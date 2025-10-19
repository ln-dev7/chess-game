# Chess960 (Fischer Random Chess)

## Vue d'ensemble

Le mode Chess960, également connu sous le nom de Fischer Random Chess, a été entièrement implémenté dans ce jeu d'échecs selon les règles officielles de la FIDE.

## Règles FIDE implémentées

### Position de départ

1. **Pions** : Placés normalement sur les deuxième et septième rangées
2. **Roi** : Doit être placé entre les deux tours sur la première rangée
3. **Fous** : Doivent être placés sur des cases de couleurs opposées
4. **Pièces noires** : Placées en miroir exact des pièces blanches

### Nombre de positions possibles

Il existe exactement **960 positions de départ valides** selon ces contraintes.

**Note importante** : La position #518, qui correspond à la position standard des échecs classiques (♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜), est **automatiquement exclue** lors de la génération aléatoire de parties Chess960. Cela garantit que chaque partie Chess960 offre une expérience véritablement différente des échecs classiques.

### Règles du roque

Le roque en Chess960 fonctionne différemment des échecs classiques :

#### Positions finales (identiques aux échecs classiques)

Après le roque, le roi et la tour finissent toujours sur les mêmes cases qu'aux échecs standard :

- **Petit roque (O-O)** : Roi sur g1/g8, Tour sur f1/f8
- **Grand roque (O-O-O)** : Roi sur c1/c8, Tour sur d1/d8

#### Conditions

1. Le roi et la tour concernés n'ont pas encore bougé
2. Le roi ne doit pas être en échec
3. Le roi ne doit pas traverser de case attaquée
4. Le roi ne doit pas finir sur une case attaquée
5. Toutes les cases entre les positions initiales et finales du roi et de la tour doivent être vides (à l'exception du roi et de la tour eux-mêmes)

## Implémentation technique

### Fichiers créés

1. **`store/useGameVariantStore.ts`**

   - Store Zustand pour gérer la variante de jeu (Standard ou Chess960)
   - Sauvegarde la préférence dans le localStorage

2. **`lib/chess960-utils.ts`**

   - `generateChess960Position(n)` : Génère une position spécifique (0-959)
   - `generateRandomChess960Position()` : Génère une position aléatoire
   - Utilise l'algorithme de Scharnagl pour garantir les 960 positions valides
   - `findRookPositions()` : Trouve les tours pour le roque
   - `findKingPosition()` : Trouve le roi
   - `isValidChess960Position()` : Valide une position selon les règles FIDE

3. **`components/GameVariantDialog.tsx`**
   - Composant modal pour sélectionner la variante (Standard/Chess960)
   - Affiche des informations sur Chess960
   - Nécessite une confirmation avant de changer de variante

### Fichiers modifiés

1. **`types/chess.ts`**

   - Ajout du type `GameVariant`
   - Ajout des champs Chess960 dans `GameState` :
     - `isChess960` : Booléen indiquant si c'est une partie Chess960
     - Positions initiales des tours et du roi pour chaque couleur

2. **`lib/chess-engine.ts`**

   - `createInitialGameState()` : Accepte maintenant une variante et un numéro de position
   - `getKingMoves()` : Divisé en deux fonctions :
     - `getStandardCastlingMoves()` : Roque standard
     - `getChess960CastlingMoves()` : Roque Chess960 avec les règles FIDE
   - `executeMove()` : Adapté pour gérer correctement le roque Chess960

3. **`components/ChessGame.tsx`**

   - Import et utilisation du store de variante
   - `handleNewGame()` : Crée une nouvelle partie avec la variante sélectionnée
   - Ajout du composant `GameVariantDialog` accessible depuis le `GameModeSelector`

4. **`messages/fr.json` et `messages/en.json`**
   - Ajout des traductions pour le sélecteur de variante
   - Textes explicatifs sur Chess960

## Algorithme de génération (Scharnagl)

L'algorithme de Scharnagl est utilisé pour générer les 960 positions valides de manière déterministe :

1. **Placement des fous** (16 combinaisons) :

   - Un fou sur case blanche (1, 3, 5, 7)
   - Un fou sur case noire (0, 2, 4, 6)

2. **Placement de la dame** (6 positions) :

   - Sur l'une des 6 cases restantes

3. **Placement des cavaliers** (10 combinaisons) :

   - Sur 2 des 5 cases restantes

4. **Placement Tour-Roi-Tour** (1 arrangement) :
   - Les 3 pièces restantes sont placées dans l'ordre T-R-T sur les 3 cases restantes

**Formule** : 16 × 6 × 10 × 1 = 960 positions possibles

## Utilisation

### Pour le joueur

1. Sélectionnez "Chess960" dans le sélecteur de variante
2. Cliquez sur "Nouvelle partie"
3. Une position aléatoire sera générée automatiquement
4. Le roque fonctionne avec les règles Chess960

### Notes importantes

- Chaque nouvelle partie Chess960 génère une position aléatoire parmi les **959 positions** (la position standard #518 est exclue)
- Cela garantit que chaque partie Chess960 est véritablement différente des échecs classiques
- Le roque aboutit toujours aux mêmes cases finales qu'aux échecs classiques
- Les autres règles (pions, prise en passant, promotion, etc.) sont identiques aux échecs standard

## Références

- [Règles FIDE Chess960](https://www.fide.com/FIDE/handbook/LawsOfChess.pdf) - Appendice F
- [Chess960 sur Chess.com](https://www.chess.com/terms/chess960)
- [Algorithme de Scharnagl](https://en.wikipedia.org/wiki/Fischer_random_chess_numbering_scheme)

## Tests recommandés

1. **Génération de positions** :

   - Vérifier que toutes les positions générées respectent les contraintes
   - Tester les 960 positions numérotées

2. **Roque** :

   - Tester le roque depuis différentes positions initiales
   - Vérifier que les cases finales sont correctes
   - Tester les cas limites (roi et tour adjacents, etc.)

3. **Persistance** :
   - Vérifier que la variante sélectionnée est sauvegardée
   - Tester le changement de variante pendant et entre les parties
