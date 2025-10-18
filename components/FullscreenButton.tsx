"use client";

import { useState, useEffect, RefObject } from "react";
import { Maximize, Minimize } from "lucide-react";

interface FullscreenButtonProps {
  boardRef?: RefObject<HTMLDivElement | null>;
}

export default function FullscreenButton({ boardRef }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Si on a une référence à l'échiquier, mettre uniquement celui-ci en plein écran
        if (boardRef?.current) {
          await boardRef.current.requestFullscreen();
        } else {
          // Sinon, mettre toute la page en plein écran
          await document.documentElement.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      title={isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}
    >
      {isFullscreen ? (
        <Minimize className="w-5 h-5 text-gray-700" />
      ) : (
        <Maximize className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}
