"use client";

interface EvalBarProps {
  /** Évaluation en centièmes de pion, vue côté blanc.
   *  Positive = avantage blanc, négative = avantage noir. */
  cpWhite: number;
  isRotated?: boolean;
}

const MATE_DISPLAY_THRESHOLD = 900;

function cpToWinPercent(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

/** Convertit le cp en libellé court à afficher dans la barre.
 *  Au-delà de ±900 cp, considéré comme un mat à venir → '#'. */
function formatEval(cp: number): string {
  if (cp >= MATE_DISPLAY_THRESHOLD) return "#";
  if (cp <= -MATE_DISPLAY_THRESHOLD) return "#";
  const pawns = cp / 100;
  return (pawns >= 0 ? "+" : "") + pawns.toFixed(1);
}

export default function EvalBar({ cpWhite, isRotated = false }: EvalBarProps) {
  // Win% côté blanc, borné entre 0 et 100 pour le visuel.
  const whitePct = Math.max(0, Math.min(100, cpToWinPercent(cpWhite)));
  const blackPct = 100 - whitePct;

  // Quand l'échiquier est retourné (les noirs en bas), la barre l'est aussi.
  const showWhiteAtBottom = !isRotated;
  const label = formatEval(cpWhite);
  const labelOnTop = cpWhite < 0;

  return (
    <div className="h-full w-9 flex flex-col rounded overflow-hidden shadow-inner border-2 border-gray-400 bg-gray-200">
      {showWhiteAtBottom ? (
        <>
          <div
            className="bg-gray-900 transition-[height] duration-500"
            style={{ height: `${blackPct}%` }}
          >
            {labelOnTop && (
              <span className="block text-[10px] md:text-xs text-white font-bold text-center pt-0.5">
                {label}
              </span>
            )}
          </div>
          <div
            className="bg-white transition-[height] duration-500 mt-auto relative"
            style={{ height: `${whitePct}%` }}
          >
            {!labelOnTop && (
              <span className="block text-[10px] md:text-xs text-gray-900 font-bold text-center absolute bottom-0.5 left-0 right-0">
                {label}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className="bg-white transition-[height] duration-500 relative"
            style={{ height: `${whitePct}%` }}
          >
            {!labelOnTop && (
              <span className="block text-[10px] md:text-xs text-gray-900 font-bold text-center pt-0.5">
                {label}
              </span>
            )}
          </div>
          <div
            className="bg-gray-900 transition-[height] duration-500 mt-auto relative"
            style={{ height: `${blackPct}%` }}
          >
            {labelOnTop && (
              <span className="block text-[10px] md:text-xs text-white font-bold text-center absolute bottom-0.5 left-0 right-0">
                {label}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
