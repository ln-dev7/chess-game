"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { soundManager } from "@/lib/chess-sounds";

export default function SoundControl() {
  const t = useTranslations("sound");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    setIsMuted(soundManager.getIsMuted());
    setVolume(soundManager.getVolume());
  }, []);

  const handleToggleMute = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("title")}</h3>

      <div className="space-y-4">
        {/* Bouton Mute/Unmute */}
        <button
          onClick={handleToggleMute}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          {isMuted ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
              <span>{t("enable")}</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <span>{t("disable")}</span>
            </>
          )}
        </button>

        {/* Contrôle du volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="volume"
              className="text-sm font-medium text-gray-700"
            >
              {t("volume")}
            </label>
            <span className="text-sm text-gray-500">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={isMuted}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isMuted
                ? undefined
                : `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
                    volume * 100
                  }%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
