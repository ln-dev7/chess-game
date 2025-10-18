"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PieceColor } from "@/types/chess";

interface CheckmateAnimationProps {
  loserColor: PieceColor;
  pieceStyle: string;
  onComplete: () => void;
  endReason?: "checkmate" | "timeout" | "resignation" | "draw";
}

export default function CheckmateAnimation({
  loserColor,
  pieceStyle,
  onComplete,
  endReason = "checkmate",
}: CheckmateAnimationProps) {
  const t = useTranslations("checkmate");
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExplosion(true);
    }, 800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const kingPath = `/pieces/${pieceStyle}/${loserColor}/king.svg`;

  const getEndMessage = () => {
    if (endReason === "draw") {
      return t("draw").toUpperCase();
    }
    const winner = loserColor === "white" ? t("blackWins") : t("whiteWins");
    return winner.toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative">
        {/* Le roi qui tombe et se détruit */}
        <motion.div
          className="relative"
          initial={{ y: -100, rotate: 0, scale: 1, opacity: 1 }}
          animate={{
            y: [0, 50, 100],
            rotate: [0, -45, -90],
            scale: [1, 0.9, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.6, 1],
            ease: "easeIn",
          }}
        >
          <Image
            src={kingPath}
            alt="King falling"
            width={200}
            height={200}
            className="drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Particules d'explosion */}
        {showExplosion && (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              const distance = 150 + Math.random() * 50;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;

              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x,
                    y,
                    scale: [1, 0.5, 0],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background:
                        loserColor === "white"
                          ? "linear-gradient(135deg, #ffffff, #e0e0e0)"
                          : "linear-gradient(135deg, #4a4a4a, #2a2a2a)",
                    }}
                  />
                </motion.div>
              );
            })}

            {/* Flash lumineux */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-32 h-32 rounded-full bg-red-500 blur-3xl" />
            </motion.div>

            {/* Onde de choc */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-40 h-40 rounded-full border-4 border-red-400" />
            </motion.div>
          </>
        )}

        {/* Texte de fin de partie */}
        <motion.div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 1,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
            {getEndMessage()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
