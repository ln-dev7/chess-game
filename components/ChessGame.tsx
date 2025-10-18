"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
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
import { useTimeControlStore } from "@/store/useTimeControlStore";
import { useGameModeStore } from "@/store/useGameModeStore";
import { getAIMove } from "@/lib/chess-ai";
import BoardContainer from "./BoardContainer";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";
import PromotionDialog from "./PromotionDialog";
import MoveHistory from "./MoveHistory";
import CheckmateAnimation from "./CheckmateAnimation";
import ChessClock from "./ChessClock";
import LanguageSelector from "./LanguageSelector";
import GameModeSelector from "./GameModeSelector";
import AIDifficultySelector from "./AIDifficultySelector";

interface AnimatingMove {
  from: Position;
  to: Position;
  piece: Piece;
}

export default function ChessGame() {
  const t = useTranslations("common");
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
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Zustand stores
  const {
    boardRotation,
    showCoordinates,
    animationSpeed,
    soundEnabled,
    soundVolume,
  } = usePreferencesStore();

  const { themeId, pieceStyleId } = useThemeStore();
  const { selectedTimeControl } = useTimeControlStore();
  const { gameMode, aiLevel, aiColor } = useGameModeStore();

  // États pour l'horloge
  const [whiteTime, setWhiteTime] = useState(selectedTimeControl.initialTime);
  const [blackTime, setBlackTime] = useState(selectedTimeControl.initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialiser le gestionnaire audio
  useEffect(() => {
    soundManager.setVolume(soundVolume);
    if (!soundEnabled && !soundManager.getIsMuted()) {
      soundManager.toggleMute();
    } else if (soundEnabled && soundManager.getIsMuted()) {
      soundManager.toggleMute();
    }
  }, [soundEnabled, soundVolume]);

  // Effet pour gérer le timer
  useEffect(() => {
    const isGameOver =
      gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;

    // Si pas de temps ou partie terminée, ne pas démarrer le timer
    if (selectedTimeControl.initialTime === 0 || isGameOver) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Ne pas démarrer le timer si c'est le début de la partie (pas de coups)
    if (gameState.moveHistory.length === 0) {
      return;
    }

    // Démarrer le timer
    timerRef.current = setInterval(() => {
      if (gameState.currentPlayer === "white") {
        setWhiteTime((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current!);
            // Défaite par timeout
            setGameState((gs) => ({
              ...gs,
              isCheckmate: true,
              gameEndReason: "timeout",
            }));
            playSound("checkmate");
            setTimeout(() => {
              setShowCheckmateAnimation(true);
            }, 500);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current!);
            // Défaite par timeout
            setGameState((gs) => ({
              ...gs,
              isCheckmate: true,
              gameEndReason: "timeout",
            }));
            playSound("checkmate");
            setTimeout(() => {
              setShowCheckmateAnimation(true);
            }, 500);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    gameState.currentPlayer,
    gameState.moveHistory.length,
    gameState.isCheckmate,
    gameState.isStalemate,
    gameState.isDraw,
    selectedTimeControl.initialTime,
  ]);

  // Réinitialiser les temps quand le contrôle de temps change
  useEffect(() => {
    setWhiteTime(selectedTimeControl.initialTime);
    setBlackTime(selectedTimeControl.initialTime);
  }, [selectedTimeControl]);

  // Récupérer le thème et le style de pièce
  const theme = CHESS_THEMES.find((t) => t.id === themeId) || CHESS_THEMES[0];
  const pieceStyle =
    PIECE_STYLES.find((s) => s.id === pieceStyleId) || PIECE_STYLES[0];
  const animationDuration = getAnimationDuration(animationSpeed);

  // Effet pour faire jouer l'IA
  useEffect(() => {
    // Vérifier si c'est le tour de l'IA
    const isAITurn = gameMode === "ai" && gameState.currentPlayer === aiColor;
    const isGameOver =
      gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;

    // Ne pas faire jouer l'IA si la partie n'est pas lancée (en mode IA)
    if (gameMode === "ai" && !gameStarted) {
      return;
    }

    if (
      isAITurn &&
      !isGameOver &&
      !isAnimating &&
      !pendingPromotion &&
      !isAIThinking
    ) {
      setIsAIThinking(true);

      // Laisser un petit délai avant que l'IA joue
      setTimeout(async () => {
        try {
          const aiMove = await getAIMove(gameState, aiLevel, aiColor);

          if (aiMove) {
            const piece = gameState.board[aiMove.from.row][aiMove.from.col];

            if (piece) {
              // Vérifier si c'est une promotion
              if (
                piece.type === "pawn" &&
                (aiMove.to.row === 0 || aiMove.to.row === 7)
              ) {
                // L'IA fait une promotion
                setIsAnimating(true);
                setAnimatingMove({
                  from: aiMove.from,
                  to: aiMove.to,
                  piece,
                });

                setTimeout(() => {
                  const targetPiece =
                    gameState.board[aiMove.to.row][aiMove.to.col];
                  const isCapture = targetPiece !== null;

                  const newState = executeMove(
                    gameState,
                    aiMove.from,
                    aiMove.to,
                    aiMove.promotionPiece
                  );

                  // Ajouter l'incrément de temps
                  if (selectedTimeControl.increment > 0) {
                    if (aiColor === "white") {
                      setWhiteTime(
                        (prev) => prev + selectedTimeControl.increment
                      );
                    } else {
                      setBlackTime(
                        (prev) => prev + selectedTimeControl.increment
                      );
                    }
                  }

                  // Jouer les sons appropriés
                  if (newState.isCheckmate) {
                    playSound("checkmate");
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
                  setIsAIThinking(false);
                }, animationDuration);
              } else {
                // Mouvement normal de l'IA
                setIsAnimating(true);
                setAnimatingMove({
                  from: aiMove.from,
                  to: aiMove.to,
                  piece,
                });

                setTimeout(() => {
                  const targetPiece =
                    gameState.board[aiMove.to.row][aiMove.to.col];
                  const isCapture = targetPiece !== null;

                  const newState = executeMove(
                    gameState,
                    aiMove.from,
                    aiMove.to
                  );

                  // Ajouter l'incrément de temps
                  if (selectedTimeControl.increment > 0) {
                    if (aiColor === "white") {
                      setWhiteTime(
                        (prev) => prev + selectedTimeControl.increment
                      );
                    } else {
                      setBlackTime(
                        (prev) => prev + selectedTimeControl.increment
                      );
                    }
                  }

                  // Jouer les sons appropriés
                  if (newState.isCheckmate) {
                    playSound("checkmate");
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
                  setIsAIThinking(false);
                }, animationDuration);
              }
            }
          } else {
            setIsAIThinking(false);
          }
        } catch (error) {
          console.error("Erreur IA:", error);
          setIsAIThinking(false);
        }
      }, 300);
    }
  }, [
    gameMode,
    aiColor,
    aiLevel,
    gameState,
    isAnimating,
    pendingPromotion,
    isAIThinking,
    animationDuration,
    selectedTimeControl.increment,
    gameStarted,
  ]);

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

      // Empêcher le joueur de jouer si la partie n'est pas lancée en mode IA
      if (gameMode === "ai" && !gameStarted) {
        return;
      }

      // Empêcher le joueur de jouer si c'est le tour de l'IA
      if (gameMode === "ai" && gameState.currentPlayer === aiColor) {
        return;
      }

      // Empêcher le joueur de jouer si l'IA réfléchit
      if (isAIThinking) {
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
    [gameState, isAnimating, gameMode, aiColor, isAIThinking, gameStarted]
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
        const targetPiece =
          gameState.board[pendingPromotion.to.row][pendingPromotion.to.col];
        const isCapture = targetPiece !== null;

        const newState = executeMove(
          gameState,
          pendingPromotion.from,
          pendingPromotion.to,
          pieceType
        );

        // Ajouter l'incrément de temps au joueur qui vient de jouer
        if (selectedTimeControl.increment > 0) {
          if (gameState.currentPlayer === "white") {
            setWhiteTime((prev) => prev + selectedTimeControl.increment);
          } else {
            setBlackTime((prev) => prev + selectedTimeControl.increment);
          }
        }

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
    [
      gameState,
      pendingPromotion,
      animationDuration,
      selectedTimeControl.increment,
    ]
  );

  const handleAnimationComplete = useCallback(() => {
    if (!animatingMove || !gameState.selectedSquare) return;

    // Vérifier si c'est une capture
    const targetPiece =
      gameState.board[animatingMove.to.row][animatingMove.to.col];
    const isCapture = targetPiece !== null;

    const newState = executeMove(
      gameState,
      animatingMove.from,
      animatingMove.to
    );

    // Ajouter l'incrément de temps au joueur qui vient de jouer
    if (selectedTimeControl.increment > 0) {
      if (gameState.currentPlayer === "white") {
        setWhiteTime((prev) => prev + selectedTimeControl.increment);
      } else {
        setBlackTime((prev) => prev + selectedTimeControl.increment);
      }
    }

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

    // IMPORTANT : Mettre à jour l'état du jeu AVANT de retirer l'animation
    // Cela garantit que la pièce finale est affichée avant que la pièce animée ne disparaisse
    setGameState(newState);

    // Retirer l'animation après un court délai pour éviter le clignotement sur mobile
    // requestAnimationFrame garantit que le rendu est terminé avant de retirer l'animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimatingMove(null);
        setIsAnimating(false);
      });
    });
  }, [animatingMove, gameState, selectedTimeControl.increment]);

  const handleNewGame = useCallback(() => {
    setGameState(createInitialGameState());
    setPendingPromotion(null);
    setAnimatingMove(null);
    setIsAnimating(false);
    setShowCheckmateAnimation(false);
    setIsAIThinking(false);
    setGameStarted(false);
    setWhiteTime(selectedTimeControl.initialTime);
    setBlackTime(selectedTimeControl.initialTime);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [selectedTimeControl.initialTime]);

  const handleStartGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  const handleResign = useCallback(() => {
    setGameState({
      ...gameState,
      isCheckmate: true,
      gameEndReason: "resignation",
      selectedSquare: null,
      validMoves: [],
    });
    playSound("checkmate");
    setTimeout(() => {
      setShowCheckmateAnimation(true);
    }, 500);
  }, [gameState]);

  const handleOfferDraw = useCallback(() => {
    setGameState({
      ...gameState,
      isDraw: true,
      gameEndReason: "draw",
      selectedSquare: null,
      validMoves: [],
    });
    playSound("draw");
  }, [gameState]);

  const isGameOver =
    gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;

  const hasMovesPlayed = gameState.moveHistory.length > 0;
  const canChangeSettings = gameMode === "pvp" ? !hasMovesPlayed : !gameStarted;

  // Rotation automatique de l'échiquier en mode IA
  // Si on joue contre l'IA et qu'on a les noirs, on retourne l'échiquier
  const effectiveBoardRotation =
    gameMode === "ai" ? aiColor === "white" : boardRotation;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 pt-4 md:pt-8">
        <div className="flex items-start justify-between mb-4 md:mb-8 relative">
          <LanguageSelector />
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-xl text-center md:text-5xl font-bold text-gray-900 mb-1 md:mb-2">
              {t("chess")}
            </h1>
            <p className="text-gray-600 text-center text-sm md:text-base">
              {gameMode === "ai" ? `${t("localGame")} vs LN` : t("localGame")}
            </p>
          </div>

          <a
            href="https://github.com/ln-dev7/chess-game"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">{t("github")}</span>
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-8">
          <div className="flex-1 lg:flex-[2]">
            <BoardContainer
              ref={boardRef}
              gameState={gameState}
              onSquareClick={handleSquareClick}
              theme={theme}
              animatingMove={animatingMove}
              onAnimationComplete={handleAnimationComplete}
              pieceStyle={pieceStyle.id}
              showCoordinates={showCoordinates}
              isRotated={effectiveBoardRotation}
              animationDuration={animationDuration}
              showCheckmateAnimation={showCheckmateAnimation}
              onCheckmateAnimationComplete={() =>
                setShowCheckmateAnimation(false)
              }
            />
          </div>

          <div className="flex-1 space-y-6">
            <GameModeSelector
              disabled={!canChangeSettings}
              onStartGame={handleStartGame}
              showStartButton={
                gameMode === "ai" && !gameStarted && !hasMovesPlayed
              }
            />
            <AIDifficultySelector disabled={!canChangeSettings} />
            <GameInfo gameState={gameState} />
            {selectedTimeControl.initialTime > 0 && (
              <ChessClock
                whiteTime={whiteTime}
                blackTime={blackTime}
                currentPlayer={gameState.currentPlayer}
                isGameOver={isGameOver}
                initialTime={selectedTimeControl.initialTime}
              />
            )}
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
          endReason={gameState.gameEndReason || "checkmate"}
        />
      )}
    </div>
  );
}
