# Règles des Échecs / Chess Rules

**Français** | [English](#english-version)

---

## Version Française

Ce document décrit toutes les règles du jeu d'échecs implémentées dans cette application, conformes aux règles officielles de la FIDE (Fédération Internationale des Échecs).

### Table des matières

1. [Configuration initiale](#configuration-initiale)
2. [Mouvements des pièces](#mouvements-des-pièces)
3. [Règles spéciales](#règles-spéciales)
4. [Fin de partie](#fin-de-partie)
5. [Règles de nulle](#règles-de-nulle)

### Configuration initiale

#### L'échiquier

- L'échiquier est composé de 64 cases (8x8) alternant entre cases claires et foncées
- Chaque joueur doit avoir une case blanche dans son coin inférieur droit
- Les colonnes sont nommées de a à h (de gauche à droite)
- Les rangées sont numérotées de 1 à 8 (de bas en haut pour les Blancs)

#### Position des pièces

Chaque joueur commence avec 16 pièces :

**Pièces blanches (rangée 1 et 2) :**

- 1ère rangée : Tour, Cavalier, Fou, Dame, Roi, Fou, Cavalier, Tour
- 2ème rangée : 8 Pions

**Pièces noires (rangée 7 et 8) :**

- 8ème rangée : Tour, Cavalier, Fou, Dame, Roi, Fou, Cavalier, Tour
- 7ème rangée : 8 Pions

**Note importante :** La Dame blanche commence sur une case blanche, la Dame noire sur une case noire.

### Mouvements des pièces

#### Le Roi ♔ ♚

- Se déplace d'une seule case dans n'importe quelle direction (horizontale, verticale, diagonale)
- Ne peut pas se déplacer sur une case attaquée par une pièce adverse
- Ne peut jamais se mettre en échec

#### La Dame (Reine) ♕ ♛

- Se déplace de n'importe quel nombre de cases
- Peut se déplacer horizontalement, verticalement ou en diagonale
- Ne peut pas sauter par-dessus d'autres pièces

#### La Tour ♖ ♜

- Se déplace de n'importe quel nombre de cases
- Peut se déplacer horizontalement ou verticalement
- Ne peut pas sauter par-dessus d'autres pièces

#### Le Fou ♗ ♝

- Se déplace de n'importe quel nombre de cases en diagonale
- Ne peut pas sauter par-dessus d'autres pièces
- Reste toujours sur la même couleur de case (claire ou foncée)

#### Le Cavalier ♘ ♞

- Se déplace en forme de "L" : 2 cases dans une direction + 1 case perpendiculairement
- C'est la seule pièce qui peut sauter par-dessus d'autres pièces

#### Le Pion ♙ ♟

**Mouvement normal :**

- Avance d'une case vers l'avant (ne recule jamais)
- Lors de son premier mouvement, peut avancer de 2 cases
- Ne peut avancer que si la case devant est libre

**Capture :**

- Capture en diagonale (une case en avant et une case sur le côté)
- Ne peut capturer qu'une pièce adverse

### Règles spéciales

#### Le Roque

Le roque est un mouvement spécial impliquant le Roi et une Tour.

**Conditions pour roquer :**

- Le Roi et la Tour concernée n'ont pas encore bougé
- Aucune pièce ne se trouve entre le Roi et la Tour
- Le Roi n'est pas en échec
- Le Roi ne traverse pas une case attaquée
- Le Roi n'arrive pas sur une case attaquée

**Types de roque :**

**Petit roque (côté Roi) :**

- Le Roi se déplace de 2 cases vers la droite
- La Tour se déplace de 2 cases vers la gauche et se place à côté du Roi

**Grand roque (côté Dame) :**

- Le Roi se déplace de 2 cases vers la gauche
- La Tour se déplace de 3 cases vers la droite et se place à côté du Roi

#### La Prise en Passant

Règle spéciale de capture pour les pions :

**Conditions :**

- Un pion adverse avance de 2 cases depuis sa position initiale
- Il se retrouve à côté de votre pion (sur la même rangée)
- Vous pouvez capturer ce pion "en passant" immédiatement au coup suivant
- Votre pion se déplace en diagonale comme pour une capture normale
- Le pion adverse est retiré de l'échiquier

**Important :** Cette capture doit être effectuée immédiatement, sinon l'opportunité est perdue.

#### La Promotion du Pion

**Quand un pion atteint la dernière rangée adverse :**

- Il doit être immédiatement promu en une autre pièce
- Le joueur peut choisir : Dame, Tour, Fou ou Cavalier
- La pièce choisie remplace le pion
- Le choix le plus courant est la Dame (la pièce la plus puissante)
- Il n'y a pas de limite au nombre de Dames ou autres pièces qu'un joueur peut avoir

### Fin de partie

#### Échec

- Le Roi est en échec quand il est attaqué par une pièce adverse
- Quand un joueur est en échec, il DOIT sortir de l'échec à son prochain coup
- Il y a trois façons de sortir de l'échec :
  1. Déplacer le Roi sur une case non attaquée
  2. Bloquer l'attaque avec une autre pièce
  3. Capturer la pièce qui donne l'échec

#### Échec et Mat

- Si un joueur est en échec et ne peut pas sortir de l'échec, c'est échec et mat
- La partie est terminée et le joueur en échec et mat perd
- L'adversaire gagne la partie

#### Pat (Stalemate)

- Un joueur est en pat quand :
  - Ce n'est pas en échec
  - Il n'a aucun mouvement légal disponible
- Le pat entraîne une partie nulle (match nul)

#### Abandon

- Un joueur peut abandonner à tout moment
- L'adversaire est déclaré vainqueur

### Règles de nulle

Une partie peut être nulle dans plusieurs situations :

#### 1. Accord Mutuel

- Les deux joueurs peuvent s'entendre pour faire nulle à tout moment

#### 2. Répétition de Position (Triple Répétition)

- Si la même position se répète 3 fois avec le même joueur au trait
- La position doit être identique (mêmes pièces aux mêmes endroits)
- Les droits de roque et de prise en passant doivent aussi être identiques

#### 3. Règle des 50 Coups

- Si 50 coups consécutifs (par les deux joueurs) sont joués sans :
  - Aucune capture de pièce
  - Aucun mouvement de pion
- Un joueur peut réclamer la nulle
- Dans cette application, la nulle est automatiquement déclarée après 50 coups

#### 4. Matériel Insuffisant

La partie est automatiquement nulle s'il est impossible de mater avec le matériel restant :

**Cas de matériel insuffisant :**

- Roi contre Roi
- Roi + Fou contre Roi
- Roi + Cavalier contre Roi
- Roi + Fou contre Roi + Fou (avec les deux Fous sur la même couleur de cases)

### Notation et Conseils

#### Comment jouer dans cette application

1. **Sélectionner une pièce :** Cliquez sur une de vos pièces
2. **Voir les mouvements possibles :** Des indicateurs apparaissent sur les cases valides
3. **Déplacer :** Cliquez sur une case valide pour y déplacer votre pièce
4. **Annuler la sélection :** Cliquez à nouveau sur la pièce sélectionnée

#### Indicateurs visuels

- **Cases jaunes :** Dernière pièce jouée (départ et arrivée)
- **Case rouge :** Roi en échec
- **Cercles gris :** Mouvements possibles pour la pièce sélectionnée
- **Cercle complet :** Indique une capture possible

#### Contrôles disponibles

- **Nouvelle partie :** Recommencer une partie
- **Abandonner :** Déclarer forfait (l'adversaire gagne)
- **Proposer nulle :** Proposer un match nul (les deux joueurs doivent accepter)

### Stratégie de base

Quelques conseils pour bien jouer :

1. **Contrôlez le centre** : Les pièces au centre de l'échiquier ont plus de mobilité
2. **Développez vos pièces** : Sortez vos Cavaliers et Fous rapidement
3. **Protégez votre Roi** : Pensez au roque pour mettre votre Roi en sécurité
4. **Ne perdez pas de pièces gratuitement** : Chaque pièce a de la valeur
5. **Réfléchissez avant de jouer** : Vérifiez toujours si votre coup expose votre Roi

#### Valeur approximative des pièces

- Pion = 1 point
- Cavalier = 3 points
- Fou = 3 points
- Tour = 5 points
- Dame = 9 points
- Roi = inestimable (sa perte signifie la défaite)

---

**Bon jeu ! ♟️**

---

<a name="english-version"></a>

## English Version

This document describes all chess rules implemented in this application, conforming to the official FIDE (International Chess Federation) rules.

### Table of Contents

1. [Initial Setup](#initial-setup)
2. [Piece Movements](#piece-movements)
3. [Special Rules](#special-rules)
4. [Game End](#game-end)
5. [Draw Rules](#draw-rules)

### Initial Setup

#### The Board

- The board consists of 64 squares (8x8) alternating between light and dark squares
- Each player must have a light square in their bottom right corner
- Files are named from a to h (left to right)
- Ranks are numbered from 1 to 8 (bottom to top for White)

#### Piece Position

Each player starts with 16 pieces:

**White pieces (ranks 1 and 2):**

- 1st rank: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
- 2nd rank: 8 Pawns

**Black pieces (ranks 7 and 8):**

- 8th rank: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
- 7th rank: 8 Pawns

**Important note:** The White Queen starts on a light square, the Black Queen on a dark square.

### Piece Movements

#### The King ♔ ♚

- Moves one square in any direction (horizontal, vertical, diagonal)
- Cannot move to a square attacked by an opponent's piece
- Can never put itself in check

#### The Queen ♕ ♛

- Moves any number of squares
- Can move horizontally, vertically, or diagonally
- Cannot jump over other pieces

#### The Rook ♖ ♜

- Moves any number of squares
- Can move horizontally or vertically
- Cannot jump over other pieces

#### The Bishop ♗ ♝

- Moves any number of squares diagonally
- Cannot jump over other pieces
- Always remains on the same color square (light or dark)

#### The Knight ♘ ♞

- Moves in an "L" shape: 2 squares in one direction + 1 square perpendicular
- The only piece that can jump over other pieces

#### The Pawn ♙ ♟

**Normal Movement:**

- Advances one square forward (never moves backward)
- On its first move, can advance 2 squares
- Can only advance if the square ahead is empty

**Capture:**

- Captures diagonally (one square forward and one square to the side)
- Can only capture an opponent's piece

### Special Rules

#### Castling

Castling is a special move involving the King and a Rook.

**Conditions for castling:**

- The King and the involved Rook have not yet moved
- No pieces are between the King and the Rook
- The King is not in check
- The King does not pass through an attacked square
- The King does not land on an attacked square

**Types of castling:**

**Kingside castling:**

- The King moves 2 squares to the right
- The Rook moves 2 squares to the left and is placed next to the King

**Queenside castling:**

- The King moves 2 squares to the left
- The Rook moves 3 squares to the right and is placed next to the King

#### En Passant

Special capture rule for pawns:

**Conditions:**

- An opponent's pawn advances 2 squares from its initial position
- It ends up next to your pawn (on the same rank)
- You can capture this pawn "en passant" immediately on the next move
- Your pawn moves diagonally as in a normal capture
- The opponent's pawn is removed from the board

**Important:** This capture must be made immediately, or the opportunity is lost.

#### Pawn Promotion

**When a pawn reaches the opponent's last rank:**

- It must immediately be promoted to another piece
- The player can choose: Queen, Rook, Bishop, or Knight
- The chosen piece replaces the pawn
- The most common choice is the Queen (the most powerful piece)
- There is no limit to the number of Queens or other pieces a player can have

### Game End

#### Check

- The King is in check when attacked by an opponent's piece
- When a player is in check, they MUST get out of check on their next move
- There are three ways to get out of check:
  1. Move the King to an unattacked square
  2. Block the attack with another piece
  3. Capture the piece giving check

#### Checkmate

- If a player is in check and cannot get out of check, it's checkmate
- The game is over and the player in checkmate loses
- The opponent wins the game

#### Stalemate

- A player is in stalemate when:
  - They are not in check
  - They have no legal moves available
- Stalemate results in a draw

#### Resignation

- A player can resign at any time
- The opponent is declared the winner

### Draw Rules

A game can be drawn in several situations:

#### 1. Mutual Agreement

- Both players can agree to a draw at any time

#### 2. Threefold Repetition

- If the same position repeats 3 times with the same player to move
- The position must be identical (same pieces in the same places)
- Castling rights and en passant rights must also be identical

#### 3. Fifty-Move Rule

- If 50 consecutive moves (by both players) are played without:
  - Any piece capture
  - Any pawn move
- A player can claim a draw
- In this application, the draw is automatically declared after 50 moves

#### 4. Insufficient Material

The game is automatically drawn if checkmate is impossible with the remaining material:

**Cases of insufficient material:**

- King vs King
- King + Bishop vs King
- King + Knight vs King
- King + Bishop vs King + Bishop (with both Bishops on the same color squares)

### Notation and Tips

#### How to Play in This Application

1. **Select a piece:** Click on one of your pieces
2. **See possible moves:** Indicators appear on valid squares
3. **Move:** Click on a valid square to move your piece there
4. **Cancel selection:** Click again on the selected piece

#### Visual Indicators

- **Yellow squares:** Last move played (departure and arrival)
- **Red square:** King in check
- **Gray circles:** Possible moves for the selected piece
- **Full circle:** Indicates a possible capture

#### Available Controls

- **New Game:** Start a new game
- **Resign:** Forfeit (opponent wins)
- **Offer Draw:** Propose a draw (both players must accept)

### Basic Strategy

Some tips for playing well:

1. **Control the center**: Pieces in the center have more mobility
2. **Develop your pieces**: Bring out your Knights and Bishops quickly
3. **Protect your King**: Think about castling to put your King to safety
4. **Don't lose pieces for free**: Every piece has value
5. **Think before you move**: Always check if your move exposes your King

#### Approximate Piece Values

- Pawn = 1 point
- Knight = 3 points
- Bishop = 3 points
- Rook = 5 points
- Queen = 9 points
- King = priceless (losing it means defeat)

---

**Enjoy! ♟️**
