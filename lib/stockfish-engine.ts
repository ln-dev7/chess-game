/**
 * Stockfish 18 engine wrapper.
 *
 * Loads the WASM build from /public/stockfish/ as a Web Worker, speaks UCI,
 * and exposes a small async API. Single shared instance per page.
 */

const ENGINE_PATH = "/stockfish/stockfish-18-lite-single.js";

type Listener = (line: string) => void;

interface EngineHandle {
  worker: Worker;
  send: (cmd: string) => void;
  onLine: (listener: Listener) => () => void;
  ready: Promise<void>;
}

let engineHandle: EngineHandle | null = null;
let initPromise: Promise<EngineHandle> | null = null;

function createEngine(): EngineHandle {
  const worker = new Worker(ENGINE_PATH);
  const listeners = new Set<Listener>();

  worker.addEventListener("message", (event: MessageEvent) => {
    const data = event.data;
    if (typeof data !== "string") return;
    // Stockfish sometimes emits multiple lines in one message
    for (const line of data.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      for (const listener of listeners) listener(trimmed);
    }
  });

  const send = (cmd: string) => worker.postMessage(cmd);

  const onLine = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const waitFor = (token: string) =>
    new Promise<void>((resolve) => {
      const dispose = onLine((line) => {
        if (line.startsWith(token)) {
          dispose();
          resolve();
        }
      });
    });

  const ready = (async () => {
    send("uci");
    await waitFor("uciok");
    send("isready");
    await waitFor("readyok");
  })();

  return { worker, send, onLine, ready };
}

async function getEngine(): Promise<EngineHandle> {
  if (typeof window === "undefined") {
    throw new Error("Stockfish engine can only be used in the browser");
  }
  if (engineHandle) return engineHandle;
  if (!initPromise) {
    initPromise = (async () => {
      const handle = createEngine();
      await handle.ready;
      engineHandle = handle;
      return handle;
    })();
  }
  return initPromise;
}

export interface StockfishSearchOptions {
  fen: string;
  movetimeMs: number;
  depth?: number;
  skillLevel?: number; // 0..20
  uciElo?: number; // 1320..3190
  chess960?: boolean;
}

/** Évaluation d'une position : score en centièmes de pion (vu côté blanc),
 *  ou mate en N coups (positif si les blancs matent, négatif sinon). */
export interface PositionEvaluation {
  cp: number | null;
  mate: number | null;
  bestMove: string | null;
}

export interface EvaluatePositionOptions {
  fen: string;
  movetimeMs?: number;
  depth?: number;
  chess960?: boolean;
}

/**
 * Ask Stockfish for the best move from the given position. Resolves with the
 * UCI move string (e.g. "e2e4" or "e7e8q") or null if the engine returns no move.
 */
export async function searchBestMove(
  options: StockfishSearchOptions
): Promise<string | null> {
  const engine = await getEngine();

  // Configure for this search
  engine.send(`setoption name UCI_Chess960 value ${options.chess960 ? "true" : "false"}`);

  if (typeof options.uciElo === "number") {
    engine.send("setoption name UCI_LimitStrength value true");
    engine.send(`setoption name UCI_Elo value ${options.uciElo}`);
  } else {
    engine.send("setoption name UCI_LimitStrength value false");
  }

  // Toujours réémettre Skill Level pour ne pas hériter d'une valeur posée par
  // un appel précédent (ex. analyse post-partie qui force 20).
  engine.send(
    `setoption name Skill Level value ${options.skillLevel ?? 20}`
  );

  engine.send("ucinewgame");
  engine.send("isready");
  await new Promise<void>((resolve) => {
    const dispose = engine.onLine((line) => {
      if (line.startsWith("readyok")) {
        dispose();
        resolve();
      }
    });
  });

  engine.send(`position fen ${options.fen}`);

  const goCmd =
    options.depth !== undefined
      ? `go depth ${options.depth} movetime ${options.movetimeMs}`
      : `go movetime ${options.movetimeMs}`;

  return new Promise<string | null>((resolve) => {
    const dispose = engine.onLine((line) => {
      if (!line.startsWith("bestmove")) return;
      dispose();
      const parts = line.split(/\s+/);
      const move = parts[1];
      if (!move || move === "(none)" || move === "0000") {
        resolve(null);
      } else {
        resolve(move);
      }
    });
    engine.send(goCmd);
  });
}

/**
 * Évalue une position à pleine puissance (sans UCI_LimitStrength) et renvoie
 * la valeur centipawn / mate ainsi que le meilleur coup. Utilisé pour
 * l'analyse post-partie (précision, Elo de performance).
 */
export async function evaluatePosition(
  options: EvaluatePositionOptions
): Promise<PositionEvaluation> {
  const engine = await getEngine();

  // Force pleine puissance, indépendamment du dernier setoption émis par
  // searchBestMove (cf. bridage par niveau d'IA).
  engine.send(
    `setoption name UCI_Chess960 value ${options.chess960 ? "true" : "false"}`
  );
  engine.send("setoption name UCI_LimitStrength value false");
  engine.send("setoption name Skill Level value 20");

  engine.send("ucinewgame");
  engine.send("isready");
  await new Promise<void>((resolve) => {
    const dispose = engine.onLine((line) => {
      if (line.startsWith("readyok")) {
        dispose();
        resolve();
      }
    });
  });

  engine.send(`position fen ${options.fen}`);

  const sideToMove = options.fen.split(" ")[1] ?? "w";
  const whiteToMove = sideToMove === "w";

  let cp: number | null = null;
  let mate: number | null = null;

  return new Promise<PositionEvaluation>((resolve) => {
    const dispose = engine.onLine((line) => {
      if (line.startsWith("info")) {
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        if (mateMatch) {
          const raw = parseInt(mateMatch[1], 10);
          mate = whiteToMove ? raw : -raw;
          cp = null;
        } else if (cpMatch) {
          const raw = parseInt(cpMatch[1], 10);
          cp = whiteToMove ? raw : -raw;
          mate = null;
        }
      }
      if (line.startsWith("bestmove")) {
        dispose();
        const parts = line.split(/\s+/);
        const move = parts[1];
        const bestMove =
          !move || move === "(none)" || move === "0000" ? null : move;
        resolve({ cp, mate, bestMove });
      }
    });

    const goCmd =
      options.depth !== undefined
        ? `go depth ${options.depth}${
            options.movetimeMs ? ` movetime ${options.movetimeMs}` : ""
          }`
        : `go movetime ${options.movetimeMs ?? 400}`;
    engine.send(goCmd);
  });
}

/**
 * Preload the engine in the background. Safe to call multiple times; only the
 * first call actually starts loading.
 */
export function preloadStockfish(): void {
  if (typeof window === "undefined") return;
  void getEngine();
}
