"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Trophy, Copy, Check, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface WinnerRewardModalProps {
  isOpen: boolean;
  code: string | null;
  onClose: () => void;
}

const BLOCKUS_PRICING_URL = "https://blockus.lndevui.com/pricing";

export default function WinnerRewardModal({
  isOpen,
  code,
  onClose,
}: WinnerRewardModalProps) {
  const t = useTranslations("winnerReward");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  async function handleCopy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — fallback browsers
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg">
            <Trophy className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-4 text-center">
            <p className="text-sm font-medium text-emerald-700 mb-1">
              {t("discountLabel")}
            </p>
            <p className="text-3xl font-bold text-emerald-600">100%</p>
            <p className="text-sm text-emerald-700 mt-1">{t("planName")}</p>
          </div>

          {code && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {t("codeLabel")}
              </p>
              <div className="flex items-stretch gap-2">
                <code className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm font-semibold text-gray-900 truncate">
                  {code}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 hover:bg-gray-50 transition-colors"
                  aria-label={t("copyAriaLabel")}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-emerald-600">{t("copied")}</p>
              )}
            </div>
          )}

          <a
            href={BLOCKUS_PRICING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            {t("redeemCta")}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
