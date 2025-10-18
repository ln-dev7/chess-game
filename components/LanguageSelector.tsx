"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function LanguageSelector() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Set cookie for locale
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      // Reload to apply new locale
      window.location.reload();
    });
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <Select
      value={locale}
      onValueChange={handleLanguageChange}
      disabled={isPending}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className="w-[80px] bg-white border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
        <SelectValue>
          <span className="font-medium">{currentLanguage?.label}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="font-medium">{lang.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
