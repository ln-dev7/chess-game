"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState, Position, PieceType, Piece } from "@/types/chess";
import {
  createInitialGameState,
  executeMove,
  getPossibleMoves,
} from "@/lib/chess-engine";
import { positionsEqual } from "@/lib/chess-utils";
import { ChessTheme, getSavedTheme, saveTheme } from "@/lib/chess-themes";
import { PieceStyle, getSavedPieceStyle, savePieceStyle } from "@/lib/piece-styles";
import ChessBoard from "./ChessBoard";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";
import PromotionDialog from "./PromotionDialog";
import MoveHistory from "./MoveHistory";
import ThemeSelector from "./ThemeSelector";
import PieceStyleSelector from "./PieceStyleSelector";

// Durée de l'animation en millisecondes
const ANIMATION_DURATION = 300;

interface AnimatingMove {
  from: Position;
  to: Position;
  piece: Piece;
}

export default function ChessGame() {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Position;
    to: Position;
  } | null>(null);
  const [theme, setTheme] = useState<ChessTheme>(getSavedTheme());
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>(getSavedPieceStyle());
  const [animatingMove, setAnimatingMove] = useState<AnimatingMove | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Charger le thème et le style de pièces sauvegardés au montage du composant
  useEffect(() => {
    setTheme(getSavedTheme());
    setPieceStyle(getSavedPieceStyle());
  }, []);

  const handleThemeChange = useCallback((newTheme: ChessTheme) => {
    setTheme(newTheme);
    saveTheme(newTheme.id);
  }, []);

  const handlePieceStyleChange = useCallback((newStyle: PieceStyle) => {
    setPieceStyle(newStyle);
    savePieceStyle(newStyle.id);
  }, []);

  const handleSquareClick = useCallback(
    (position: Position) => {
      // Si une animation est en cours ou la partie est terminée, ne rien faire
      if (
        isAnimating ||
        gameState.isCheckmate ||
        gameState.isStalemate ||
        gameState.isDraw
      ) {
        return;
      }

      const piece = gameState.board[position.row][position.col];

      // Si une case est déjà sélectionnée
      if (gameState.selectedSquare) {
        // Si on clique sur la même case, désélectionner
        if (positionsEqual(gameState.selectedSquare, position)) {
          setGameState({
            ...gameState,
            selectedSquare: null,
            validMoves: [],
          });
          return;
        }

        // Si on clique sur un mouvement valide
        const isValidMove = gameState.validMoves.some((move) =>
          positionsEqual(move, position)
        );
        if (isValidMove) {
          const selectedPiece =
            gameState.board[gameState.selectedSquare.row][
              gameState.selectedSquare.col
            ];

          // Vérifier si c'est une promotion de pion
          if (
            selectedPiece?.type === "pawn" &&
            (position.row === 0 || position.row === 7)
          ) {
            setPendingPromotion({
              from: gameState.selectedSquare,
              to: position,
            });
            return;
          }

          // Déclencher l'animation
          setIsAnimating(true);
          const movingPiece =
            gameState.board[gameState.selectedSquare.row][
              gameState.selectedSquare.col
            ];

          // Vérification de sécurité : la pièce doit exister
          if (!movingPiece) {
            setIsAnimating(false);
            return;
          }

          setAnimatingMove({
            from: gameState.selectedSquare,
            to: position,
            piece: movingPiece,
          });
          return;
        }

        // Si on clique sur une autre pièce de notre couleur, la sélectionner
        if (piece && piece.color === gameState.currentPlayer) {
          const validMoves = getPossibleMoves(
            gameState.board,
            position,
            gameState
          );
          setGameState({
            ...gameState,
            selectedSquare: position,
            validMoves,
          });
          return;
        }

        // Sinon, désélectionner
        setGameState({
          ...gameState,
          selectedSquare: null,
          validMoves: [],
        });
        return;
      }

      // Si aucune case n'est sélectionnée, sélectionner la pièce si elle appartient au joueur actuel
      if (piece && piece.color === gameState.currentPlayer) {
        const validMoves = getPossibleMoves(
          gameState.board,
          position,
          gameState
        );
        setGameState({
          ...gameState,
          selectedSquare: position,
          validMoves,
        });
      }
    },
    [gameState, isAnimating]
  );

  const handlePromotion = useCallback(
    (pieceType: PieceType) => {
      if (!pendingPromotion) return;

      // Déclencher l'animation
      setIsAnimating(true);
      const movingPiece =
        gameState.board[pendingPromotion.from.row][pendingPromotion.from.col];

      // Vérification de sécurité : la pièce doit exister
      if (!movingPiece) {
        setIsAnimating(false);
        return;
      }

      setAnimatingMove({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        piece: movingPiece,
      });

      // Stocker le type de pièce pour la promotion après l'animation
      // On doit attendre la fin de l'animation
      setTimeout(() => {
        const newState = executeMove(
          gameState,
          pendingPromotion.from,
          pendingPromotion.to,
          pieceType
        );
        setGameState(newState);
        setPendingPromotion(null);
        setAnimatingMove(null);
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    },
    [gameState, pendingPromotion]
  );

  const handleAnimationComplete = useCallback(() => {
    if (!animatingMove || !gameState.selectedSquare) return;

    const newState = executeMove(
      gameState,
      animatingMove.from,
      animatingMove.to
    );
    setGameState(newState);
    setAnimatingMove(null);
    setIsAnimating(false);
  }, [animatingMove, gameState]);

  const handleNewGame = useCallback(() => {
    setGameState(createInitialGameState());
    setPendingPromotion(null);
    setAnimatingMove(null);
    setIsAnimating(false);
  }, []);

  const handleResign = useCallback(() => {
    setGameState({
      ...gameState,
      isCheckmate: true,
      selectedSquare: null,
      validMoves: [],
    });
  }, [gameState]);

  const handleOfferDraw = useCallback(() => {
    setGameState({
      ...gameState,
      isDraw: true,
      selectedSquare: null,
      validMoves: [],
    });
  }, [gameState]);

  const isGameOver =
    gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Jeu d&apos;Échecs
          </h1>
          <p className="text-gray-600">Partie locale à deux joueurs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 flex justify-center items-start">
            <ChessBoard
              gameState={gameState}
              onSquareClick={handleSquareClick}
              theme={theme}
              animatingMove={animatingMove}
              onAnimationComplete={handleAnimationComplete}
              pieceStyle={pieceStyle.id}
            />
          </div>

          <div className="space-y-6">
            <GameInfo gameState={gameState} />
            <MoveHistory moves={gameState.moveHistory} />
            <ThemeSelector
              currentTheme={theme}
              onThemeChange={handleThemeChange}
            />
            <PieceStyleSelector
              currentStyle={pieceStyle}
              onStyleChange={handlePieceStyleChange}
            />
            <GameControls
              onNewGame={handleNewGame}
              onResign={handleResign}
              onOfferDraw={handleOfferDraw}
              currentPlayer={gameState.currentPlayer}
              isGameOver={isGameOver}
              gameState={gameState}
            />
          </div>
        </div>
      </div>

      <PromotionDialog
        isOpen={pendingPromotion !== null}
        color={gameState.currentPlayer}
        onSelect={handlePromotion}
      />
    </div>
  );
}
