/**
 * Script de test pour valider l'implémentation Chess960
 * Ce fichier n'est pas utilisé dans l'application, uniquement pour les tests
 */

import { generateChess960Position, isValidChess960Position } from "./chess960-utils";
import { PieceType } from "@/types/chess";

/**
 * Teste toutes les 960 positions possibles
 */
export function testAll960Positions(): {
  success: boolean;
  errors: string[];
  stats: {
    total: number;
    valid: number;
    invalid: number;
  };
} {
  const errors: string[] = [];
  let validCount = 0;
  let invalidCount = 0;

  console.log("🧪 Test de toutes les 960 positions Chess960...");

  for (let i = 0; i < 960; i++) {
    try {
      const board = generateChess960Position(i);
      const whiteBackRow = board[7].map((piece) => piece?.type) as PieceType[];

      if (!isValidChess960Position(whiteBackRow)) {
        errors.push(`Position ${i} invalide: ${whiteBackRow.join(",")}`);
        invalidCount++;
      } else {
        validCount++;
      }

      // Vérifier que les pièces noires sont bien en miroir
      const blackBackRow = board[0].map((piece) => piece?.type) as PieceType[];
      if (JSON.stringify(whiteBackRow) !== JSON.stringify(blackBackRow)) {
        errors.push(
          `Position ${i}: Les pièces noires ne sont pas en miroir des blanches`
        );
      }
    } catch (error) {
      errors.push(`Position ${i}: Erreur lors de la génération - ${error}`);
      invalidCount++;
    }
  }

  const success = errors.length === 0;

  console.log(`✅ Positions valides: ${validCount}/960`);
  console.log(`❌ Positions invalides: ${invalidCount}/960`);

  if (errors.length > 0) {
    console.error("Erreurs détectées:");
    errors.forEach((error) => console.error(`  - ${error}`));
  }

  return {
    success,
    errors,
    stats: {
      total: 960,
      valid: validCount,
      invalid: invalidCount,
    },
  };
}

/**
 * Teste des positions spécifiques connues
 */
export function testKnownPositions(): {
  success: boolean;
  results: Array<{ position: number; description: string; valid: boolean }>;
} {
  console.log("🧪 Test de positions spécifiques...");

  const knownPositions = [
    { num: 518, desc: "Position standard des échecs classiques" },
    { num: 0, desc: "Première position" },
    { num: 959, desc: "Dernière position" },
  ];

  const results = knownPositions.map(({ num, desc }) => {
    const board = generateChess960Position(num);
    const whiteBackRow = board[7].map((piece) => piece?.type) as PieceType[];
    const valid = isValidChess960Position(whiteBackRow);

    console.log(`Position ${num} (${desc}): ${whiteBackRow.join("-")}`);
    console.log(`  Valide: ${valid ? "✅" : "❌"}`);

    return {
      position: num,
      description: desc,
      valid,
    };
  });

  const success = results.every((r) => r.valid);

  return { success, results };
}

/**
 * Affiche des statistiques sur la distribution des pièces
 */
export function analyzeDistribution(): void {
  console.log("📊 Analyse de la distribution des pièces...");

  const kingPositions: number[] = [];
  const queenPositions: number[] = [];

  for (let i = 0; i < 960; i++) {
    const board = generateChess960Position(i);
    const whiteBackRow = board[7].map((piece) => piece?.type) as PieceType[];

    const kingPos = whiteBackRow.indexOf("king");
    const queenPos = whiteBackRow.indexOf("queen");

    kingPositions.push(kingPos);
    queenPositions.push(queenPos);
  }

  // Statistiques du roi (devrait toujours être entre les colonnes 1 et 6)
  const kingMin = Math.min(...kingPositions);
  const kingMax = Math.max(...kingPositions);
  console.log(`Position du roi: min=${kingMin}, max=${kingMax}`);
  console.log(
    `  Le roi doit être entre 1 et 6: ${kingMin >= 1 && kingMax <= 6 ? "✅" : "❌"}`
  );

  // Distribution de la dame
  const queenDistribution = Array(8).fill(0);
  queenPositions.forEach((pos) => queenDistribution[pos]++);
  console.log("Distribution de la dame:");
  queenDistribution.forEach((count, pos) => {
    console.log(`  Colonne ${pos}: ${count} fois (${((count / 960) * 100).toFixed(1)}%)`);
  });
}

/**
 * Lance tous les tests
 */
export function runAllTests(): void {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 Tests Chess960");
  console.log("=".repeat(60) + "\n");

  // Test de toutes les positions
  const test1 = testAll960Positions();
  console.log("\n");

  // Test de positions spécifiques
  const test2 = testKnownPositions();
  console.log("\n");

  // Analyse de distribution
  analyzeDistribution();
  console.log("\n");

  // Résumé
  console.log("=".repeat(60));
  console.log("📋 Résumé des tests");
  console.log("=".repeat(60));
  console.log(
    `Test des 960 positions: ${test1.success ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log(
    `Test des positions connues: ${test2.success ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log(
    `Résultat global: ${test1.success && test2.success ? "✅ TOUS LES TESTS PASSENT" : "❌ CERTAINS TESTS ÉCHOUENT"}`
  );
  console.log("=".repeat(60) + "\n");
}

// Décommenter pour exécuter les tests
// runAllTests();

