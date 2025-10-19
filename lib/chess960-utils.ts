import { Piece, PieceColor, PieceType } from "@/types/chess";

/**
 * Génère une position Chess960 selon les règles FIDE
 * Il y a exactement 960 positions possibles
 *
 * Règles:
 * 1. Le roi doit être placé entre les deux tours
 * 2. Les deux fous doivent être sur des cases de couleurs opposées
 * 3. Les pièces noires sont en miroir des blanches
 */
export function generateChess960Position(
  positionNumber: number
): (Piece | null)[][] {
  if (positionNumber < 0 || positionNumber > 959) {
    throw new Error("Le numéro de position Chess960 doit être entre 0 et 959");
  }

  // Créer le plateau vide
  const board: (Piece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Générer la position de la première rangée pour les blancs
  const whiteBackRow = generateBackRowFromNumber(positionNumber);

  // Placer les pièces blanches
  board[7] = whiteBackRow.map((type) => ({
    type,
    color: "white" as PieceColor,
    hasMoved: false,
  }));

  // Placer les pions blancs
  board[6] = Array(8)
    .fill(null)
    .map(() => ({
      type: "pawn" as PieceType,
      color: "white" as PieceColor,
      hasMoved: false,
    }));

  // Placer les pions noirs
  board[1] = Array(8)
    .fill(null)
    .map(() => ({
      type: "pawn" as PieceType,
      color: "black" as PieceColor,
      hasMoved: false,
    }));

  // Placer les pièces noires (miroir des blanches)
  board[0] = whiteBackRow.map((type) => ({
    type,
    color: "black" as PieceColor,
    hasMoved: false,
  }));

  return board;
}

/**
 * Génère un arrangement de pièces à partir d'un numéro de position (0-959)
 * Utilise l'algorithme de Scharnagl pour générer les 960 positions possibles
 */
function generateBackRowFromNumber(n: number): PieceType[] {
  const pieces: (PieceType | null)[] = Array(8).fill(null);

  // Placer les fous sur des cases de couleurs opposées
  // Il y a 4 cases blanches (1,3,5,7) et 4 cases noires (0,2,4,6)
  const n1 = Math.floor(n / 4);
  const b1 = (n % 4) * 2 + 1; // Fou sur case blanche (1, 3, 5, 7)
  pieces[b1] = "bishop";

  const n2 = Math.floor(n1 / 4);
  const b2 = (n1 % 4) * 2; // Fou sur case noire (0, 2, 4, 6)
  pieces[b2] = "bishop";

  // Placer la dame sur l'une des 6 cases restantes
  const n3 = Math.floor(n2 / 6);
  const q = n2 % 6;
  let emptySquares = pieces
    .map((piece, idx) => (piece === null ? idx : -1))
    .filter((idx) => idx !== -1);
  pieces[emptySquares[q]] = "queen";

  // Placer les cavaliers sur 2 des 5 cases restantes
  emptySquares = pieces
    .map((piece, idx) => (piece === null ? idx : -1))
    .filter((idx) => idx !== -1);

  // Il y a 10 façons de placer 2 cavaliers sur 5 cases
  // Convertir n3 (0-9) en deux positions
  const knightCombinations = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ];

  const [knight1Pos, knight2Pos] = knightCombinations[n3];
  pieces[emptySquares[knight1Pos]] = "knight";
  pieces[emptySquares[knight2Pos]] = "knight";

  // Placer R-K-R sur les 3 cases restantes (dans cet ordre)
  emptySquares = pieces
    .map((piece, idx) => (piece === null ? idx : -1))
    .filter((idx) => idx !== -1);

  pieces[emptySquares[0]] = "rook";
  pieces[emptySquares[1]] = "king";
  pieces[emptySquares[2]] = "rook";

  return pieces as PieceType[];
}

/**
 * Trouve les positions des tours pour une configuration Chess960
 */
export function findRookPositions(
  board: (Piece | null)[][],
  color: PieceColor
): { queenSideRook: number; kingSideRook: number } {
  const row = color === "white" ? 7 : 0;
  const kingCol = board[row].findIndex(
    (piece) => piece?.type === "king" && piece?.color === color
  );

  let queenSideRook = -1;
  let kingSideRook = -1;

  // Tour côté dame (à gauche du roi)
  for (let col = 0; col < kingCol; col++) {
    const piece = board[row][col];
    if (piece?.type === "rook" && piece?.color === color) {
      queenSideRook = col;
      break;
    }
  }

  // Tour côté roi (à droite du roi)
  for (let col = kingCol + 1; col < 8; col++) {
    const piece = board[row][col];
    if (piece?.type === "rook" && piece?.color === color) {
      kingSideRook = col;
      break;
    }
  }

  return { queenSideRook, kingSideRook };
}

/**
 * Trouve la position du roi pour une couleur donnée
 */
export function findKingPosition(
  board: (Piece | null)[][],
  color: PieceColor
): number {
  const row = color === "white" ? 7 : 0;
  return board[row].findIndex(
    (piece) => piece?.type === "king" && piece?.color === color
  );
}

/**
 * Vérifie si une position Chess960 est valide selon les règles FIDE
 */
export function isValidChess960Position(pieces: PieceType[]): boolean {
  if (pieces.length !== 8) return false;

  // Vérifier qu'on a exactement: 1 roi, 2 tours, 2 fous, 2 cavaliers, 1 dame
  const counts: Record<string, number> = {};
  pieces.forEach((piece) => {
    counts[piece] = (counts[piece] || 0) + 1;
  });

  if (
    counts["king"] !== 1 ||
    counts["rook"] !== 2 ||
    counts["bishop"] !== 2 ||
    counts["knight"] !== 2 ||
    counts["queen"] !== 1
  ) {
    return false;
  }

  // Vérifier que le roi est entre les deux tours
  const kingIdx = pieces.indexOf("king");
  const rook1Idx = pieces.indexOf("rook");
  const rook2Idx = pieces.lastIndexOf("rook");

  if (
    kingIdx <= Math.min(rook1Idx, rook2Idx) ||
    kingIdx >= Math.max(rook1Idx, rook2Idx)
  ) {
    return false;
  }

  // Vérifier que les fous sont sur des cases de couleurs opposées
  const bishop1Idx = pieces.indexOf("bishop");
  const bishop2Idx = pieces.lastIndexOf("bishop");

  // Une case est blanche si (row + col) est pair, noire si impair
  // Pour la première rangée (row = 0 ou 7), on regarde juste si col est pair ou impair
  const bishop1Color = bishop1Idx % 2;
  const bishop2Color = bishop2Idx % 2;

  if (bishop1Color === bishop2Color) {
    return false;
  }

  return true;
}

/**
 * Génère une position Chess960 aléatoire
 * Exclut la position #518 qui correspond à la position standard des échecs classiques
 */
export function generateRandomChess960Position(): (Piece | null)[][] {
  // Position #518 = configuration standard (R N B Q K B N R)
  // On génère un nombre entre 0 et 958 (959 positions - 1)
  let positionNumber = Math.floor(Math.random() * 959);

  // Si on tombe sur 518 ou après, on décale d'une position pour l'éviter
  if (positionNumber >= 518) {
    positionNumber += 1;
  }

  return generateChess960Position(positionNumber);
}
