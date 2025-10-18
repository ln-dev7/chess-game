/**
 * Gestion des préférences utilisateur pour le jeu d'échecs
 * @deprecated Utiliser usePreferencesStore de Zustand à la place
 */

export interface UserPreferences {
  // Apparence
  boardRotation: boolean;
  showCoordinates: boolean;

  // Animation
  animationSpeed: "slow" | "normal" | "fast" | "instant";

  // Son
  soundEnabled: boolean;
  soundVolume: number;
}

// Durées d'animation en millisecondes selon la vitesse
export const ANIMATION_SPEEDS = {
  slow: 500,
  normal: 300,
  fast: 150,
  instant: 0,
} as const;

const DEFAULT_PREFERENCES: UserPreferences = {
  boardRotation: false,
  showCoordinates: true,
  animationSpeed: "normal",
  soundEnabled: true,
  soundVolume: 0.3,
};

const STORAGE_KEY = "chess-user-preferences";

/**
 * Charge les préférences depuis le localStorage
 * @deprecated Utiliser usePreferencesStore à la place
 */
export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (error) {
    console.error("Error loading preferences:", error);
  }

  return DEFAULT_PREFERENCES;
}

/**
 * Sauvegarde les préférences dans le localStorage
 * @deprecated Utiliser usePreferencesStore à la place
 */
export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving preferences:", error);
  }
}

/**
 * Met à jour une préférence spécifique
 * @deprecated Utiliser usePreferencesStore à la place
 */
export function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): UserPreferences {
  const current = loadPreferences();
  const updated = { ...current, [key]: value };
  savePreferences(updated);
  return updated;
}

/**
 * Réinitialise toutes les préférences aux valeurs par défaut
 * @deprecated Utiliser usePreferencesStore à la place
 */
export function resetPreferences(): UserPreferences {
  savePreferences(DEFAULT_PREFERENCES);
  return DEFAULT_PREFERENCES;
}
