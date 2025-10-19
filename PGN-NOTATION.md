# Notation PGN (Portable Game Notation) / PGN Notation

**Français** | [English](#english-version)

---

## Version Française

Ce document explique le format PGN utilisé pour exporter et importer les parties d'échecs.

## Qu'est-ce que le PGN ?

Le **PGN (Portable Game Notation)** est le format standard FIDE (et universel dans le monde des échecs) pour enregistrer, échanger et importer/exporter des parties d'échecs.

C'est un simple fichier texte (.pgn) qui contient :

- Les métadonnées (joueurs, date, résultat, événement, etc.)
- La liste des coups (en notation algébrique standard)

Le format a été défini par Steven J. Edwards en 1993, et adopté par la FIDE et toutes les grandes plateformes (Chess.com, Lichess, ICC, etc.) comme norme de facto.

## Structure d'un fichier PGN

Un fichier PGN contient deux parties principales :

### 1. Les en-têtes (Tags)

Encadrés entre crochets `[]`, ils décrivent le contexte de la partie.

**Exemple :**

```
[Event "World Championship"]
[Site "Dubai UAE"]
[Date "2021.12.12"]
[Round "6"]
[White "Carlsen, Magnus"]
[Black "Nepomniachtchi, Ian"]
[Result "1-0"]
```

**Tags obligatoires définis par la FIDE (Seven Tag Roster) :**

| Tag    | Signification                                    |
| ------ | ------------------------------------------------ |
| Event  | Nom du tournoi ou match                          |
| Site   | Lieu (ville, pays ou plateforme en ligne)        |
| Date   | Date au format AAAA.MM.JJ                        |
| Round  | Numéro de ronde                                  |
| White  | Nom du joueur des Blancs                         |
| Black  | Nom du joueur des Noirs                          |
| Result | Résultat de la partie (1-0, 0-1, 1/2-1/2, ou \*) |

**Tags supplémentaires fréquents (Supplemental tag names) :**

- `[WhiteElo "1500"]` - Classement Elo du joueur blanc
- `[BlackElo "1450"]` - Classement Elo du joueur noir
- `[TimeControl "15+10"]` - Cadence de jeu (minutes+incrément en secondes)
- `[Termination "Normal"]` - Type de fin de partie (Normal, White resigns, Black resigns, Draw by agreement, Stalemate, etc.)
- `[Variant "Standard"]` ou `[Variant "Chess960"]` - Variante d'échecs
- `[SetUp "1"]` - Indique une position de départ non standard (utilisé avec FEN)
- `[FEN "..."]` - Position de départ en notation FEN (pour Chess960 ou positions personnalisées)
- `[ECO "C42"]` - Code d'ouverture
- `[Opening "Petrov Defense"]` - Nom de l'ouverture
- `[Annotator "GM X"]` - Annotateur

### 2. La notation des coups (Movetext Section)

La partie est listée en **notation algébrique standard (SAN)**.

**Exemple :**

```
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7
6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
```

À la fin, le résultat est répété :

- `1-0` : Victoire des Blancs
- `0-1` : Victoire des Noirs
- `1/2-1/2` : Partie nulle
- `*` : Partie en cours

### 3. Terminaisons spéciales et commentaires

Le format PGN permet d'ajouter des **commentaires** entre accolades `{...}` pour préciser la nature de la fin de partie :

**Exemples :**

- Abandon : `{White resigns.}` ou `{Black resigns.}`
- Timeout : `{White wins by timeout.}` ou `{Black wins by timeout.}`
- Pat : `{Stalemate.}`
- Règle des 50 coups : `{Draw by fifty-move rule.}`
- Nulle par accord : `{Draw by agreement.}`

Le tag `[Termination "..."]` dans l'en-tête précise également le motif :

- `[Termination "Normal"]` - Échec et mat
- `[Termination "White resigns"]` - Les Blancs abandonnent
- `[Termination "Black resigns"]` - Les Noirs abandonnent
- `[Termination "Stalemate"]` - Pat
- `[Termination "Draw by agreement"]` - Nulle par accord
- `[Termination "Draw by fifty-move rule"]` - Règle des 50 coups

### 4. Chess960 et positions non standard

Pour les parties **Chess960** (Fischer Random Chess) ou toute position de départ non standard :

- `[Variant "Chess960"]` - Indique la variante
- `[SetUp "1"]` - Indique une position de départ non standard
- `[FEN "..."]` - Position de départ en notation FEN

**Exemple pour Chess960 :**

```
[Event "Chess960 Tournament"]
[Site "chess-game"]
[Date "2025.10.19"]
[Round "1"]
[White "Player 1"]
[Black "Player 2"]
[Result "1-0"]
[Variant "Chess960"]
[SetUp "1"]
[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 1-0
```

## Notation algébrique standard

### Notation des pièces

Pour les pièces (notation anglaise FIDE) :

| Pièce             | Lettre            |
| ----------------- | ----------------- |
| Roi (King)        | K                 |
| Dame (Queen)      | Q                 |
| Tour (Rook)       | R                 |
| Fou (Bishop)      | B                 |
| Cavalier (Knight) | N                 |
| Pion (Pawn)       | _(aucune lettre)_ |

**Note :** On utilise `N` pour le cavalier (knight) pour éviter la confusion avec le roi `K`.

### Coordonnées des cases

Chaque case est identifiée par une lettre (colonne) + un chiffre (rangée) :

- **Colonnes** : de `a` à `h` (de gauche à droite pour les Blancs)
- **Rangées** : de `1` à `8` (de bas en haut pour les Blancs)

**Exemples :** `e4`, `d5`, `h1`, `a8`

### Format d'un coup

#### Mouvement simple

```
[Lettre de pièce][case de destination]
```

**Exemples :**

- `Nf3` : cavalier va en f3
- `e4` : pion va en e4 (pas de lettre pour les pions)

#### Capture

On insère `x` avant la case de destination :

**Exemples :**

- `Bxe5` : fou capture en e5
- `exd5` : pion de la colonne e capture en d5

#### Promotion du pion

Quand un pion atteint la dernière rangée :

```
[case]=Pièce
```

**Exemples :**

- `e8=Q` : pion promu en dame
- `dxe8=R` : pion capture et promeut en tour

#### Roque

- **Petit roque** (côté roi) : `O-O`
- **Grand roque** (côté dame) : `O-O-O`

#### Prise en passant

La notation suit les règles normales de capture, avec mention optionnelle :

```
exd6 e.p.
```

#### Échec et échec et mat

- `+` : Échec
- `#` : Échec et mat

**Exemples :**

- `Qh5+` : dame en h5, échec
- `Qxf7#` : dame capture en f7, échec et mat

### Désambiguïsation

Quand deux pièces identiques peuvent aller à la même case, on précise :

1. **La colonne de départ** (si cela suffit) : `Ngf3`
2. **La rangée de départ** (si nécessaire) : `N1f3`
3. **Colonne et rangée** (en dernier recours) : `Ng1f3`

## Exemple complet de fichier PGN

### Exemple 1 : Partie classique avec tous les tags

```pgn
[Event "Casual Game"]
[Site "chess-game"]
[Date "2025.10.19"]
[Round "1"]
[White "Player 1"]
[Black "Player 2"]
[Result "1-0"]
[WhiteElo "1600"]
[BlackElo "1550"]
[TimeControl "15+10"]
[Variant "Standard"]
[Termination "Normal"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6
8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. Nc3 Qc7 13. Bg5 h6
14. Bh4 Re8 15. Rc1 Bf8 16. cxb5 axb5 17. Nxb5 Qb8 18. Nc3 Ba6
19. dxe5 dxe5 20. Na4 Bb5 21. Nc3 Ba6 22. Nd5 cxd5 23. Bxf6 Nxf6
24. exd5 e4 25. Nd4 Qf4 26. Re3 Bd6 27. g3 Qg5 28. Rc6 Rad8 29. Rxa6 Bxg3
30. Rxg3 Qh4 31. Nf5 Qxf2+ 32. Kh1 Qxf5 33. Qxd7 1-0
```

### Exemple 2 : Partie avec abandon

```pgn
[Event "Blitz Tournament"]
[Site "chess-game"]
[Date "2025.10.19"]
[Round "5"]
[White "Player A"]
[Black "Player B"]
[Result "0-1"]
[WhiteElo "1500"]
[BlackElo "1450"]
[TimeControl "3+2"]
[Variant "Standard"]
[Termination "White resigns"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {White resigns.} 0-1
```

### Exemple 3 : Partie Chess960

```pgn
[Event "Chess960 Tournament"]
[Site "chess-game"]
[Date "2025.10.19"]
[Round "1"]
[White "Player 1"]
[Black "Player 2"]
[Result "1/2-1/2"]
[WhiteElo "1700"]
[BlackElo "1680"]
[TimeControl "10+5"]
[Variant "Chess960"]
[SetUp "1"]
[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
[Termination "Draw by agreement"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Be7 5. O-O O-O 6. c3 d6 7. Nbd2 Be6
8. Bb3 Qd7 9. h3 Rad8 {Draw by agreement.} 1/2-1/2
```

## Utilisation dans l'application

### Exporter une partie

1. Jouez une partie d'échecs
2. Cliquez sur le bouton **"Exporter PGN"**
3. **L'aperçu du PGN s'affiche automatiquement** avec les métadonnées par défaut
4. **Personnalisez les métadonnées en temps réel** :
   - **Événement** : Nom du tournoi ou de la partie
   - **Joueurs** : Noms des joueurs blanc et noir
   - **Elo** : Classement Elo de chaque joueur (optionnel)
   - L'aperçu se met à jour automatiquement à chaque modification
5. **Deux options pour exporter** :
   - 📋 **Copier** : Copie le PGN dans le presse-papiers
   - 💾 **Télécharger** : Sauvegarde un fichier `.pgn`

**Note :** Les informations suivantes sont ajoutées automatiquement :

- Date actuelle au format AAAA.MM.JJ
- Résultat de la partie (1-0, 0-1, 1/2-1/2, ou \*)
- **Cadence** : Détectée automatiquement depuis les paramètres de la partie (ex: "15+10", "3+2", "-" pour sans limite)
- Tag `[Termination "..."]` selon la fin de partie (échec et mat, abandon, timeout, pat, etc.)
- Tag `[Variant "..."]` (Standard ou Chess960)
- Tags `[SetUp "1"]` et `[FEN "..."]` pour les parties Chess960

Le fichier sera téléchargé avec un nom automatique : `chess_YYYY-MM-DD_HH-MM-SS.pgn`

### Importer une partie (à venir)

La fonctionnalité d'import PGN pourra être ajoutée dans une future version. Elle permettra de :

- Charger des parties depuis un fichier .pgn
- Rejouer les coups pas à pas
- Analyser des parties célèbres
- Continuer une partie sauvegardée

## Avantages du format PGN

✅ **Lisible par l'humain** : Format texte simple  
✅ **Universel** : Compatible avec tous les logiciels d'échecs  
✅ **Compact** : Taille de fichier minimale  
✅ **Standardisé** : Norme FIDE officielle  
✅ **Extensible** : Peut contenir des annotations et commentaires

## Utilisation avec d'autres logiciels

Les fichiers PGN exportés peuvent être ouverts dans :

- **ChessBase** - Logiciel professionnel d'analyse
- **Lichess** - Import/export gratuit en ligne
- **Chess.com** - Analyse de parties
- **Arena** - Interface pour moteurs d'échecs
- **Scid** - Base de données d'échecs
- **PyChess** - Client d'échecs open source
- **Et tous les autres logiciels d'échecs modernes**

## Références

- **FIDE Handbook** : [Standards for Chess Equipment and Venues](https://handbook.fide.com/)
- **PGN Specification** : Standard de Steven J. Edwards (1993)
- **Wikipedia** : [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation)

## Format FEN (bonus)

Le format **FEN (Forsyth-Edwards Notation)** est complémentaire au PGN. Il décrit une position unique d'échecs, plutôt qu'une partie complète.

**Exemple de position initiale :**

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

Ce format peut être ajouté dans une future version pour sauvegarder/charger des positions spécifiques.

---

**Note :** Cette implémentation suit les standards FIDE pour la notation algébrique et le format PGN. Pour plus de détails sur les règles, consultez le [Handbook FIDE officiel](https://handbook.fide.com/).

---

<a name="english-version"></a>

## English Version

This document explains the PGN format used to export and import chess games.

### What is PGN?

**PGN (Portable Game Notation)** is the FIDE standard (and universal in the chess world) format for recording, exchanging, and importing/exporting chess games.

It's a simple text file (.pgn) that contains:

- Metadata (players, date, result, event, etc.)
- The list of moves (in standard algebraic notation)

The format was defined by Steven J. Edwards in 1993 and adopted by FIDE and all major platforms (Chess.com, Lichess, ICC, etc.) as the de facto standard.

### Structure of a PGN File

A PGN file contains two main parts:

#### 1. Headers (Tags)

Enclosed in brackets `[]`, they describe the context of the game.

**Example:**

```
[Event "World Championship"]
[Site "Dubai UAE"]
[Date "2021.12.12"]
[Round "6"]
[White "Carlsen, Magnus"]
[Black "Nepomniachtchi, Ian"]
[Result "1-0"]
```

**Mandatory FIDE tags (Seven Tag Roster):**

| Tag    | Meaning                                      |
| ------ | -------------------------------------------- |
| Event  | Tournament or match name                     |
| Site   | Location (city, country, or online platform) |
| Date   | Date in YYYY.MM.DD format                    |
| Round  | Round number                                 |
| White  | White player's name                          |
| Black  | Black player's name                          |
| Result | Game result (1-0, 0-1, 1/2-1/2, or \*)       |

**Common supplemental tags (Supplemental tag names):**

- `[WhiteElo "1500"]` - White player's Elo rating
- `[BlackElo "1450"]` - Black player's Elo rating
- `[TimeControl "15+10"]` - Time control (minutes+increment in seconds)
- `[Termination "Normal"]` - Game termination type (Normal, White resigns, Black resigns, Draw by agreement, Stalemate, etc.)
- `[Variant "Standard"]` or `[Variant "Chess960"]` - Chess variant
- `[SetUp "1"]` - Indicates a non-standard starting position (used with FEN)
- `[FEN "..."]` - Starting position in FEN notation (for Chess960 or custom positions)
- `[ECO "C42"]` - Opening code
- `[Opening "Petrov Defense"]` - Opening name
- `[Annotator "GM X"]` - Annotator

#### 2. Move Notation

The game is listed in **standard algebraic notation**.

**Example:**

```
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7
6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
```

At the end, the result is repeated:

- `1-0`: White wins
- `0-1`: Black wins
- `1/2-1/2`: Draw
- `*`: Game in progress

### Standard Algebraic Notation

#### Piece Notation

For pieces (FIDE English notation):

| Piece  | Letter        |
| ------ | ------------- |
| King   | K             |
| Queen  | Q             |
| Rook   | R             |
| Bishop | B             |
| Knight | N             |
| Pawn   | _(no letter)_ |

**Note:** We use `N` for knight to avoid confusion with the king `K`.

#### Square Coordinates

Each square is identified by a letter (file) + a number (rank):

- **Files**: from `a` to `h` (left to right for White)
- **Ranks**: from `1` to `8` (bottom to top for White)

**Examples:** `e4`, `d5`, `h1`, `a8`

#### Move Format

##### Simple Move

```
[Piece letter][destination square]
```

**Examples:**

- `Nf3`: knight moves to f3
- `e4`: pawn moves to e4 (no letter for pawns)

##### Capture

Insert `x` before the destination square:

**Examples:**

- `Bxe5`: bishop captures on e5
- `exd5`: e-file pawn captures on d5

##### Pawn Promotion

When a pawn reaches the last rank:

```
[square]=Piece
```

**Examples:**

- `e8=Q`: pawn promoted to queen
- `dxe8=R`: pawn captures and promotes to rook

##### Castling

- **Kingside castling**: `O-O`
- **Queenside castling**: `O-O-O`

##### En Passant

Notation follows normal capture rules, with optional mention:

```
exd6 e.p.
```

##### Check and Checkmate

- `+`: Check
- `#`: Checkmate

**Examples:**

- `Qh5+`: queen to h5, check
- `Qxf7#`: queen captures on f7, checkmate

#### Disambiguation

When two identical pieces can go to the same square, specify:

1. **File of origin** (if sufficient): `Ngf3`
2. **Rank of origin** (if necessary): `N1f3`
3. **File and rank** (as last resort): `Ng1f3`

### Complete PGN File Examples

#### Example 1: Standard game with all tags

```pgn
[Event "Casual Game"]
[Site "chess-game"]
[Date "2025.10.19"]
[Round "1"]
[White "Player 1"]
[Black "Player 2"]
[Result "1-0"]
[WhiteElo "1600"]
[BlackElo "1550"]
[TimeControl "15+10"]
[Variant "Standard"]
[Termination "Normal"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6
8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. Nc3 Qc7 13. Bg5 h6
14. Bh4 Re8 15. Rc1 Bf8 16. cxb5 axb5 17. Nxb5 Qb8 18. Nc3 Ba6
19. dxe5 dxe5 20. Na4 Bb5 21. Nc3 Ba6 22. Nd5 cxd5 23. Bxf6 Nxf6
24. exd5 e4 25. Nd4 Qf4 26. Re3 Bd6 27. g3 Qg5 28. Rc6 Rad8 29. Rxa6 Bxg3
30. Rxg3 Qh4 31. Nf5 Qxf2+ 32. Kh1 Qxf5 33. Qxd7 1-0
```

#### Example 2: Game with resignation

```pgn
[Event "Blitz Tournament"]
[Site "chess-game"]
[Date "2025.10.19"]
[Round "5"]
[White "Player A"]
[Black "Player B"]
[Result "0-1"]
[WhiteElo "1500"]
[BlackElo "1450"]
[TimeControl "3+2"]
[Variant "Standard"]
[Termination "White resigns"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {White resigns.} 0-1
```

#### Example 3: Chess960 game

```pgn
[Event "Chess960 Tournament"]
[Site "chess-game"]
[Date "2025.10.19"]
[Round "1"]
[White "Player 1"]
[Black "Player 2"]
[Result "1/2-1/2"]
[WhiteElo "1700"]
[BlackElo "1680"]
[TimeControl "10+5"]
[Variant "Chess960"]
[SetUp "1"]
[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
[Termination "Draw by agreement"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Be7 5. O-O O-O 6. c3 d6 7. Nbd2 Be6
8. Bb3 Qd7 9. h3 Rad8 {Draw by agreement.} 1/2-1/2
```

### Using in the Application

#### Exporting a Game

1. Play a chess game
2. Click the **"Export PGN"** button
3. **The PGN preview displays automatically** with default metadata
4. **Customize metadata in real-time**:
   - **Event**: Tournament or game name
   - **Players**: White and black player names
   - **Elo**: Elo rating for each player (optional)
   - The preview updates automatically with each change
5. **Two export options**:
   - 📋 **Copy**: Copies PGN to clipboard
   - 💾 **Download**: Saves a .pgn file

**Note:** The following information is added automatically:

- Current date in YYYY.MM.DD format
- Game result (1-0, 0-1, 1/2-1/2, or \*)
- **Time Control**: Automatically detected from game settings (e.g., "15+10", "3+2", "-" for unlimited)
- `[Termination "..."]` tag based on game ending (checkmate, resignation, timeout, stalemate, etc.)
- `[Variant "..."]` tag (Standard or Chess960)
- `[SetUp "1"]` and `[FEN "..."]` tags for Chess960 games

The file will be downloaded with an automatic name: `chess_YYYY-MM-DD_HH-MM-SS.pgn`

#### Importing a Game (Coming Soon)

The PGN import feature can be added in a future version. It will allow:

- Loading games from a .pgn file
- Replaying moves step by step
- Analyzing famous games
- Continuing a saved game

### PGN Format Advantages

✅ **Human-readable**: Simple text format  
✅ **Universal**: Compatible with all chess software  
✅ **Compact**: Minimal file size  
✅ **Standardized**: Official FIDE standard  
✅ **Extensible**: Can contain annotations and comments

### Using with Other Software

Exported PGN files can be opened in:

- **ChessBase** - Professional analysis software
- **Lichess** - Free online import/export
- **Chess.com** - Game analysis
- **Arena** - Chess engine interface
- **Scid** - Chess database
- **PyChess** - Open source chess client
- **And all other modern chess software**

### References

- **FIDE Handbook**: [Standards for Chess Equipment and Venues](https://handbook.fide.com/)
- **PGN Specification**: Steven J. Edwards standard (1993)
- **Wikipedia**: [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation)

### FEN Format (Bonus)

The **FEN (Forsyth-Edwards Notation)** format is complementary to PGN. It describes a single chess position, rather than a complete game.

**Example of initial position:**

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

This format can be added in a future version to save/load specific positions.

---

**Note:** This implementation follows FIDE standards for algebraic notation and PGN format. For more details on the rules, see the [official FIDE Handbook](https://handbook.fide.com/).
