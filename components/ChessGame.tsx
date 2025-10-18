"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, Position, PieceType, Piece } from "@/types/chess";
import {
  createInitialGameState,
  executeMove,
  getPossibleMoves,
} from "@/lib/chess-engine";
import { positionsEqual } from "@/lib/chess-utils";
import { CHESS_THEMES } from "@/lib/chess-themes";
import { PIECE_STYLES } from "@/lib/piece-styles";
import { getAnimationDuration } from "@/lib/constants";
import { soundManager, playSound } from "@/lib/chess-sounds";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useThemeStore } from "@/store/useThemeStore";
import BoardContainer from "./BoardContainer";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";
import PromotionDialog from "./PromotionDialog";
import MoveHistory from "./MoveHistory";
import CheckmateAnimation from "./CheckmateAnimation";

interface AnimatingMove {
  from: Position;
  to: Position;
  piece: Piece;
}

export default function ChessGame() {
  const boardRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Position;
    to: Position;
  } | null>(null);
  const [animatingMove, setAnimatingMove] = useState<AnimatingMove | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCheckmateAnimation, setShowCheckmateAnimation] = useState(false);

  // Zustand stores
  const {
    boardRotation,
    showCoordinates,
    animationSpeed,
    soundEnabled,
    soundVolume,
  } = usePreferencesStore();

  const { themeId, pieceStyleId } = useThemeStore();

  // Initialiser le gestionnaire audio
  useEffect(() => {
    soundManager.setVolume(soundVolume);
    if (!soundEnabled && !soundManager.getIsMuted()) {
      soundManager.toggleMute();
    } else if (soundEnabled && soundManager.getIsMuted()) {
      soundManager.toggleMute();
    }
  }, [soundEnabled, soundVolume]);

  // Récupérer le thème et le style de pièce
  const theme = CHESS_THEMES.find((t) => t.id === themeId) || CHESS_THEMES[0];
  const pieceStyle = PIECE_STYLES.find((s) => s.id === pieceStyleId) || PIECE_STYLES[0];
  const animationDuration = getAnimationDuration(animationSpeed);

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
      setTimeout(() => {
        // Vérifier si c'est une capture
        const targetPiece = gameState.board[pendingPromotion.to.row][pendingPromotion.to.col];
        const isCapture = targetPiece !== null;

        const newState = executeMove(
          gameState,
          pendingPromotion.from,
          pendingPromotion.to,
          pieceType
        );

        // Jouer les sons appropriés
        if (newState.isCheckmate) {
          playSound("checkmate");
          // Déclencher l'animation d'échec et mat après un court délai
          setTimeout(() => {
            setShowCheckmateAnimation(true);
          }, 500);
        } else if (newState.isStalemate || newState.isDraw) {
          playSound("draw");
        } else if (newState.isCheck) {
          playSound("check");
        } else if (isCapture) {
          playSound("capture");
        } else {
          playSound("move");
        }

        setGameState(newState);
        setPendingPromotion(null);
        setAnimatingMove(null);
        setIsAnimating(false);
      }, animationDuration);
    },
    [gameState, pendingPromotion, animationDuration]
  );

  const handleAnimationComplete = useCallback(() => {
    if (!animatingMove || !gameState.selectedSquare) return;

    // Petit délai pour éviter le clignotement
    setTimeout(() => {
      // Vérifier si c'est une capture
      const targetPiece = gameState.board[animatingMove.to.row][animatingMove.to.col];
      const isCapture = targetPiece !== null;

      const newState = executeMove(
        gameState,
        animatingMove.from,
        animatingMove.to
      );

      // Jouer les sons appropriés
      if (newState.isCheckmate) {
        playSound("checkmate");
        // Déclencher l'animation d'échec et mat après un court délai
        setTimeout(() => {
          setShowCheckmateAnimation(true);
        }, 500);
      } else if (newState.isStalemate || newState.isDraw) {
        playSound("draw");
      } else if (newState.isCheck) {
        playSound("check");
      } else if (isCapture) {
        playSound("capture");
      } else {
        playSound("move");
      }

      setGameState(newState);
      setAnimatingMove(null);
      setIsAnimating(false);
    }, 50);
  }, [animatingMove, gameState]);

  const handleNewGame = useCallback(() => {
    setGameState(createInitialGameState());
    setPendingPromotion(null);
    setAnimatingMove(null);
    setIsAnimating(false);
    setShowCheckmateAnimation(false);
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
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Jeu d&apos;Échecs
          </h1>
          <p className="text-gray-600">Partie locale à deux joueurs</p>

          <a
            href="https://github.com/ln-dev7/chess-game"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-0 right-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <BoardContainer
            ref={boardRef}
            gameState={gameState}
            onSquareClick={handleSquareClick}
            theme={theme}
            animatingMove={animatingMove}
            onAnimationComplete={handleAnimationComplete}
            pieceStyle={pieceStyle.id}
            showCoordinates={showCoordinates}
            isRotated={boardRotation}
            animationDuration={animationDuration}
          />

          <div className="space-y-6">
            <GameInfo gameState={gameState} />
            <MoveHistory moves={gameState.moveHistory} />
            <GameControls
              onNewGame={handleNewGame}
              onResign={handleResign}
              onOfferDraw={handleOfferDraw}
              currentPlayer={gameState.currentPlayer}
              isGameOver={isGameOver}
              gameState={gameState}
              boardRef={boardRef}
            />
          </div>
        </div>
      </div>

      <PromotionDialog
        isOpen={pendingPromotion !== null}
        color={gameState.currentPlayer}
        onSelect={handlePromotion}
        pieceStyle={pieceStyle.id}
      />

      {/* Animation d'échec et mat */}
      {showCheckmateAnimation && (
        <CheckmateAnimation
          loserColor={gameState.currentPlayer === "white" ? "black" : "white"}
          pieceStyle={pieceStyle.id}
          onComplete={() => setShowCheckmateAnimation(false)}
        />
      )}
    </div>
  );
}
