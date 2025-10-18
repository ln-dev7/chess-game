/**
 * Constantes globales de l'application
 */

/**
 * Durée de l'animation de déplacement des pièces en millisecondes (vitesse normale)
 * @deprecated Utiliser getAnimationDuration() avec les préférences utilisateur
 */
export const ANIMATION_DURATION_MS = 300;

/**
 * Durées d'animation en millisecondes selon la vitesse
 */
export const ANIMATION_SPEEDS = {
  slow: 500,
  normal: 300,
  fast: 150,
  instant: 0,
} as const;

/**
 * Type pour les vitesses d'animation
 */
export type AnimationSpeed = keyof typeof ANIMATION_SPEEDS;

/**
 * Obtient la durée d'animation selon la vitesse choisie
 */
export function getAnimationDuration(speed: AnimationSpeed): number {
  return ANIMATION_SPEEDS[speed];
}
