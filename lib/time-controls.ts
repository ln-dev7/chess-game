/**
 * Types de contrôle du temps pour les parties d'échecs
 */

export type TimeControlType =
  | "none"
  | "bullet"
  | "blitz"
  | "rapid"
  | "classical";

export interface TimeControl {
  type: TimeControlType;
  id?: string; // Identifiant unique pour la traduction (optionnel pour rétrocompatibilité)
  name: string;
  description: string;
  initialTime: number; // en secondes
  increment: number; // en secondes (bonus par coup)
  icon?: string;
}

export const TIME_CONTROLS: TimeControl[] = [
  {
    type: "none",
    id: "none",
    name: "Sans limite",
    description: "Partie sans chronomètre",
    initialTime: 0,
    increment: 0,
  },
  {
    type: "bullet",
    id: "bullet1",
    name: "Bullet",
    description: "1 minute par joueur",
    initialTime: 60,
    increment: 0,
  },
  {
    type: "bullet",
    id: "bullet1_1",
    name: "Bullet 1+1",
    description: "1 min + 1 sec par coup",
    initialTime: 60,
    increment: 1,
  },
  {
    type: "bullet",
    id: "bullet2_1",
    name: "Bullet 2+1",
    description: "2 min + 1 sec par coup",
    initialTime: 120,
    increment: 1,
  },
  {
    type: "blitz",
    id: "blitz3",
    name: "Blitz",
    description: "3 minutes par joueur",
    initialTime: 180,
    increment: 0,
  },
  {
    type: "blitz",
    id: "blitz3_2",
    name: "Blitz 3+2",
    description: "3 min + 2 sec par coup",
    initialTime: 180,
    increment: 2,
  },
  {
    type: "blitz",
    id: "blitz5",
    name: "Blitz 5+0",
    description: "5 minutes par joueur",
    initialTime: 300,
    increment: 0,
  },
  {
    type: "blitz",
    id: "blitz5_3",
    name: "Blitz 5+3",
    description: "5 min + 3 sec par coup",
    initialTime: 300,
    increment: 3,
  },
  {
    type: "rapid",
    id: "rapid10",
    name: "Rapid 10+0",
    description: "10 minutes par joueur",
    initialTime: 600,
    increment: 0,
  },
  {
    type: "rapid",
    id: "rapid10_5",
    name: "Rapid 10+5",
    description: "10 min + 5 sec par coup",
    initialTime: 600,
    increment: 5,
  },
  {
    type: "rapid",
    id: "rapid15_10",
    name: "Rapid 15+10",
    description: "15 min + 10 sec par coup",
    initialTime: 900,
    increment: 10,
  },
  {
    type: "rapid",
    id: "rapid30",
    name: "Rapid 30+0",
    description: "30 minutes par joueur",
    initialTime: 1800,
    increment: 0,
  },
  {
    type: "classical",
    id: "classical60",
    name: "Classique 60+0",
    description: "60 minutes par joueur",
    initialTime: 3600,
    increment: 0,
  },
  {
    type: "classical",
    id: "classical90_30",
    name: "Classique 90+30",
    description: "90 min + 30 sec par coup",
    initialTime: 5400,
    increment: 30,
  },
];

/**
 * Formate le temps en mm:ss
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Retourne la couleur selon le temps restant
 */
export function getTimeColor(seconds: number, initialTime: number): string {
  const percentage = (seconds / initialTime) * 100;

  if (percentage > 50) return "text-gray-900";
  if (percentage > 20) return "text-orange-600";
  return "text-red-600";
}

/**
 * Formate le TimeControl en notation PGN standard
 * Format: "minutes+increment" (ex: "15+10", "3+2")
 * Retourne "-" pour les parties sans limite de temps
 */
export function formatTimeControlForPGN(timeControl: TimeControl): string {
  if (timeControl.type === "none" || timeControl.initialTime === 0) {
    return "-";
  }

  const minutes = Math.floor(timeControl.initialTime / 60);
  const increment = timeControl.increment;

  return `${minutes}+${increment}`;
}
