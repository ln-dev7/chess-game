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

  if (typeof options.skillLevel === "number") {
    engine.send(`setoption name Skill Level value ${options.skillLevel}`);
  }

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
 * Preload the engine in the background. Safe to call multiple times; only the
 * first call actually starts loading.
 */
export function preloadStockfish(): void {
  if (typeof window === "undefined") return;
  void getEngine();
}
