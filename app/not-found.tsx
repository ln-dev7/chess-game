import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {t("heading")}
        </h2>
        <p className="text-gray-600 mb-8">{t("message")}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("returnHome")}
        </Link>
      </div>
    </div>
  );
}
