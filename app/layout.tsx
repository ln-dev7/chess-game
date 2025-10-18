import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeu d'Échecs",
  description: "Jeu d'échecs en ligne jouable localement à deux joueurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
