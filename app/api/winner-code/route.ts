import { NextResponse } from "next/server";

/**
 * Renvoie le code promo Blockus si — et seulement si — le joueur vient de
 * battre l'IA LN GM (niveau 2500, Stockfish pleine puissance) en mode
 * standard. Variante Chess960 et autres niveaux d'IA ne donnent rien.
 *
 * La variable d'environnement `LN_CHESS_GAME_WINNER_CODE` n'est pas exposée
 * côté client (pas de préfixe NEXT_PUBLIC_) : le code transite uniquement
 * par cette route quand les conditions sont remplies.
 */

interface WinnerCheckPayload {
  gameMode?: string;
  aiLevel?: number;
  gameVariant?: string;
  gameEndReason?: string | null;
  isCheckmate?: boolean;
  winnerColor?: string;
  aiColor?: string;
}

export async function POST(req: Request) {
  let payload: WinnerCheckPayload;
  try {
    payload = (await req.json()) as WinnerCheckPayload;
  } catch {
    return NextResponse.json(
      { eligible: false, error: "invalid_body" },
      { status: 400 }
    );
  }

  const {
    gameMode,
    aiLevel,
    gameVariant,
    gameEndReason,
    isCheckmate,
    winnerColor,
    aiColor,
  } = payload;

  const eligible =
    gameMode === "ai" &&
    aiLevel === 2500 &&
    gameVariant === "standard" &&
    isCheckmate === true &&
    gameEndReason !== "resignation" &&
    gameEndReason !== "draw" &&
    typeof winnerColor === "string" &&
    typeof aiColor === "string" &&
    winnerColor !== aiColor;

  if (!eligible) {
    return NextResponse.json({ eligible: false }, { status: 403 });
  }

  const code = process.env.LN_CHESS_GAME_WINNER_CODE;
  if (!code) {
    return NextResponse.json(
      { eligible: false, error: "code_not_configured" },
      { status: 500 }
    );
  }

  return NextResponse.json({ eligible: true, code });
}
