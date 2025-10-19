# Jeu d'Échecs / Chess Game

**Français** | [English](#english-version)

---

## Version Française

Un jeu d'échecs complet et interactif développé avec React, Next.js et shadcn/ui. Le jeu propose un mode joueur contre joueur et un mode contre l'intelligence artificielle.

### 📋 Fonctionnalités

#### Règles du jeu complètes

- ✅ Tous les mouvements de pièces (pion, cavalier, fou, tour, dame, roi)
- ✅ Règles spéciales :
  - Roque (petit et grand)
  - Prise en passant
  - Promotion du pion
- ✅ Détection d'échec, échec et mat, et pat
- ✅ Règles de nulle :
  - Répétition de position (3 fois)
  - Règle des 50 coups
  - Matériel insuffisant
  - Accord mutuel

#### Modes de jeu

- 🎮 **Mode Joueur vs Joueur** : Deux joueurs sur le même appareil
- 🤖 **Mode contre l'IA** : 6 niveaux de difficulté (400 à 2500 Elo)
  - LN Débutant (400 Elo)
  - LN Amateur (800 Elo)
  - LN Intermédiaire (1200 Elo)
  - LN Avancé (1600 Elo)
  - LN Expert (2000 Elo)
  - LN Maître (2500 Elo)

#### Variantes de jeu

- ♟️ **Échecs Standard** : Partie classique avec position de départ traditionnelle
- 🎲 **Chess960 (Fischer Random)** : Position de départ aléatoire parmi 960 possibilités
  - Génération automatique selon les règles FIDE
  - Roi placé entre les deux tours
  - Fous sur cases de couleurs opposées
  - Roque adapté avec destinations finales identiques aux échecs classiques
  - Documentation complète : [CHESS960.md](./CHESS960.md)

#### Interface utilisateur

- 🎨 Design minimaliste inspiré de chess.com
- 🎨 **16 thèmes de couleurs** personnalisables
- 🎭 **3 styles de pièces** (Classique, Moderne, Coloré)
- 📱 Responsive (adapté mobile, tablette, desktop)
- 🎯 Indicateurs visuels pour les mouvements possibles
- 🔴 Mise en évidence de l'échec
- 📊 Affichage des informations de la partie
- 📜 Historique des coups en notation algébrique FIDE
- 💾 Export PGN (format standard FIDE) avec copie dans le presse-papiers
- 🎮 Contrôles de jeu (nouvelle partie, abandon, proposition nulle)
- ⏱️ **Pendule d'échecs** avec plusieurs cadences
- 🔊 **Effets sonores** (déplacement, capture, échec, victoire)
- ✨ **Animations fluides** des déplacements de pièces
- 🌐 **Interface bilingue** (français / anglais)
- 🎬 **Animation de victoire** lors d'un échec et mat

#### Personnalisation

- 🎨 16 thèmes de couleurs pré-définis
- 🎭 3 styles de pièces au choix
- ⏱️ 6 cadences de temps différentes
- 🔊 Contrôle du volume sonore
- 💾 Sauvegarde automatique des préférences

### 🛠️ Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **Lucide React** - Icônes
- **Zustand** - Gestion d'état
- **next-intl** - Internationalisation
- **Motion** - Animations

### 📥 Installation

1. Cloner le projet

```bash
cd chess-game/
```

2. Installer les dépendances

```bash
npm install
```

3. Lancer le serveur de développement

```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

### 🎮 Comment jouer

1. Choisissez votre mode de jeu (PvP ou contre l'IA)
2. Si vous jouez contre l'IA, sélectionnez le niveau de difficulté
3. Les Blancs commencent toujours en premier
4. Cliquez sur une pièce pour la sélectionner
5. Les mouvements valides sont indiqués par des cercles
6. Cliquez sur une case valide pour déplacer la pièce
7. Le jeu détecte automatiquement les échecs, échecs et mat, et les pats
8. Personnalisez l'échiquier avec 16 thèmes de couleurs disponibles
9. Choisissez parmi 3 styles de pièces différents
10. Exportez votre partie au format PGN pour la sauvegarder ou la partager

### 📂 Structure du projet

```
chess-game/
├── app/                      # Pages Next.js
├── components/               # Composants React
│   ├── AIDifficultySelector.tsx # Sélecteur de difficulté IA
│   ├── AnimatedPiece.tsx    # Animation des pièces
│   ├── BoardContainer.tsx   # Conteneur du plateau
│   ├── CapturedPieces.tsx   # Pièces capturées
│   ├── CheckmateAnimation.tsx # Animation d'échec et mat
│   ├── ChessBoard.tsx       # Plateau d'échecs
│   ├── ChessClock.tsx       # Pendule d'échecs
│   ├── ChessGame.tsx        # Composant principal
│   ├── ChessPiece.tsx       # Pièce d'échecs
│   ├── ChessSquare.tsx      # Case individuelle
│   ├── ExportPGNDialog.tsx  # Dialogue d'export PGN
│   ├── FullscreenButton.tsx # Bouton plein écran
│   ├── GameControls.tsx     # Contrôles du jeu
│   ├── GameInfo.tsx         # Informations de la partie
│   ├── GameModeSelector.tsx # Sélecteur de mode
│   ├── LanguageSelector.tsx # Sélecteur de langue
│   ├── MoveHistory.tsx      # Historique des coups
│   ├── PieceStyleSelector.tsx # Sélecteur de style
│   ├── PreferencesDialog.tsx # Dialogue des préférences
│   ├── PromotionDialog.tsx  # Dialogue de promotion
│   ├── SoundControl.tsx     # Contrôle du son
│   ├── ThemeSelector.tsx    # Sélecteur de thème
│   ├── TimeControlSelector.tsx # Sélecteur de cadence
│   └── ui/                  # Composants UI shadcn
├── lib/                     # Logique du jeu
│   ├── chess-ai.ts          # Intelligence artificielle
│   ├── chess-engine.ts      # Moteur de jeu
│   ├── chess-sounds.ts      # Effets sonores
│   ├── chess-themes.ts      # Thèmes de couleurs
│   ├── chess-utils.ts       # Fonctions utilitaires
│   ├── constants.ts         # Constantes du jeu
│   ├── export-utils.ts      # Utilitaires d'export
│   ├── pgn-utils.ts         # Utilitaires PGN
│   ├── piece-styles.ts      # Styles de pièces
│   ├── preferences.ts       # Gestion des préférences
│   ├── time-controls.ts     # Contrôles de temps
│   └── utils.ts             # Utilitaires généraux
├── store/                   # Gestion d'état Zustand
├── types/                   # Types TypeScript
│   └── chess.ts            # Types du jeu d'échecs
├── messages/               # Traductions
│   ├── en.json            # Anglais
│   └── fr.json            # Français
├── public/                 # Fichiers statiques
│   └── pieces/            # Images des pièces SVG
├── README.md              # Documentation principale
├── QUICK-START.md         # Guide de démarrage rapide
├── RULES.md              # Règles complètes
├── PGN-NOTATION.md       # Format PGN et notation
└── THEMES.md             # Thèmes de couleurs
```

### 🎯 Règles implémentées

Toutes les règles officielles de la FIDE (Fédération Internationale des Échecs) sont implémentées :

- Mouvements de toutes les pièces selon les règles officielles
- Roque (avec vérification des conditions)
- Prise en passant
- Promotion du pion (choix entre dame, tour, fou, cavalier)
- Échec et échec et mat
- Pat (stalemate)
- Nulle par répétition de position
- Nulle par la règle des 50 coups
- Nulle par matériel insuffisant
- Abandon et proposition de nulle

### 💻 Développement

#### Commandes disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Construire l'application pour la production
npm run start    # Lancer l'application en production
npm run lint     # Vérifier le code
```

### 📚 Documentation complète

Pour plus d'informations, consultez :

- **[QUICK-START.md](./QUICK-START.md)** : Guide de démarrage rapide
- **[RULES.md](./RULES.md)** : Toutes les règles du jeu d'échecs
- **[PGN-NOTATION.md](./PGN-NOTATION.md)** : Format PGN et notation algébrique
- **[THEMES.md](./THEMES.md)** : Guide des thèmes de couleurs

### 📄 Licence

Ce projet est open source et disponible sous la licence MIT.

### 👨‍💻 Auteur

Développé avec ❤️ en utilisant React et Next.js

---

<a name="english-version"></a>

## English Version

A complete and interactive chess game developed with React, Next.js and shadcn/ui. The game offers a player vs player mode and a mode against artificial intelligence.

### 📋 Features

#### Complete Game Rules

- ✅ All piece movements (pawn, knight, bishop, rook, queen, king)
- ✅ Special rules:
  - Castling (kingside and queenside)
  - En passant
  - Pawn promotion
- ✅ Check, checkmate, and stalemate detection
- ✅ Draw rules:
  - Threefold repetition
  - 50-move rule
  - Insufficient material
  - Mutual agreement

#### Game Modes

- 🎮 **Player vs Player Mode**: Two players on the same device
- 🤖 **AI Mode**: 6 difficulty levels (400 to 2500 Elo)
  - LN Beginner (400 Elo)
  - LN Amateur (800 Elo)
  - LN Intermediate (1200 Elo)
  - LN Advanced (1600 Elo)
  - LN Expert (2000 Elo)
  - LN Master (2500 Elo)

#### Game Variants

- ♟️ **Standard Chess**: Classic game with traditional starting position
- 🎲 **Chess960 (Fischer Random)**: Random starting position among 960 possibilities
  - Automatic generation according to FIDE rules
  - King placed between the two rooks
  - Bishops on opposite-colored squares
  - Adapted castling with final destinations identical to classical chess
  - Complete documentation: [CHESS960.md](./CHESS960.md)

#### User Interface

- 🎨 Minimalist design inspired by chess.com
- 🎨 **16 customizable color themes**
- 🎭 **3 piece styles** (Classic, Modern, Colorful)
- 📱 Responsive (mobile, tablet, desktop)
- 🎯 Visual indicators for possible moves
- 🔴 Check highlighting
- 📊 Game information display
- 📜 Move history in FIDE algebraic notation
- 💾 PGN export (FIDE standard format) with clipboard copy
- 🎮 Game controls (new game, resign, draw offer)
- ⏱️ **Chess clock** with multiple time controls
- 🔊 **Sound effects** (move, capture, check, victory)
- ✨ **Smooth animations** for piece movements
- 🌐 **Bilingual interface** (French / English)
- 🎬 **Victory animation** on checkmate

#### Customization

- 🎨 16 pre-defined color themes
- 🎭 3 piece styles to choose from
- ⏱️ 6 different time controls
- 🔊 Volume control
- 💾 Automatic preference saving

### 🛠️ Technologies Used

- **Next.js 15** - React Framework
- **TypeScript** - Static typing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Zustand** - State management
- **next-intl** - Internationalization
- **Motion** - Animations

### 📥 Installation

1. Clone the project

```bash
cd chess-game/
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### 🎮 How to Play

1. Choose your game mode (PvP or vs AI)
2. If playing against AI, select the difficulty level
3. White always starts first
4. Click on a piece to select it
5. Valid moves are indicated by circles
6. Click on a valid square to move the piece
7. The game automatically detects checks, checkmates, and stalemates
8. Customize the board with 16 available color themes
9. Choose from 3 different piece styles
10. Export your game in PGN format to save or share it

### 📂 Project Structure

```
chess-game/
├── app/                      # Next.js pages
├── components/               # React components
│   ├── AIDifficultySelector.tsx # AI difficulty selector
│   ├── AnimatedPiece.tsx    # Piece animations
│   ├── BoardContainer.tsx   # Board container
│   ├── CapturedPieces.tsx   # Captured pieces
│   ├── CheckmateAnimation.tsx # Checkmate animation
│   ├── ChessBoard.tsx       # Chess board
│   ├── ChessClock.tsx       # Chess clock
│   ├── ChessGame.tsx        # Main component
│   ├── ChessPiece.tsx       # Chess piece
│   ├── ChessSquare.tsx      # Individual square
│   ├── ExportPGNDialog.tsx  # PGN export dialog
│   ├── FullscreenButton.tsx # Fullscreen button
│   ├── GameControls.tsx     # Game controls
│   ├── GameInfo.tsx         # Game information
│   ├── GameModeSelector.tsx # Mode selector
│   ├── LanguageSelector.tsx # Language selector
│   ├── MoveHistory.tsx      # Move history
│   ├── PieceStyleSelector.tsx # Style selector
│   ├── PreferencesDialog.tsx # Preferences dialog
│   ├── PromotionDialog.tsx  # Promotion dialog
│   ├── SoundControl.tsx     # Sound control
│   ├── ThemeSelector.tsx    # Theme selector
│   ├── TimeControlSelector.tsx # Time control selector
│   └── ui/                  # shadcn UI components
├── lib/                     # Game logic
│   ├── chess-ai.ts          # Artificial intelligence
│   ├── chess-engine.ts      # Game engine
│   ├── chess-sounds.ts      # Sound effects
│   ├── chess-themes.ts      # Color themes
│   ├── chess-utils.ts       # Utility functions
│   ├── constants.ts         # Game constants
│   ├── export-utils.ts      # Export utilities
│   ├── pgn-utils.ts         # PGN utilities
│   ├── piece-styles.ts      # Piece styles
│   ├── preferences.ts       # Preferences management
│   ├── time-controls.ts     # Time controls
│   └── utils.ts             # General utilities
├── store/                   # Zustand state management
├── types/                   # TypeScript types
│   └── chess.ts            # Chess game types
├── messages/               # Translations
│   ├── en.json            # English
│   └── fr.json            # French
├── public/                 # Static files
│   └── pieces/            # SVG piece images
├── README.md              # Main documentation
├── QUICK-START.md         # Quick start guide
├── RULES.md              # Complete rules
├── PGN-NOTATION.md       # PGN format and notation
└── THEMES.md             # Color themes
```

### 🎯 Implemented Rules

All official FIDE (International Chess Federation) rules are implemented:

- All piece movements according to official rules
- Castling (with condition checking)
- En passant capture
- Pawn promotion (choice between queen, rook, bishop, knight)
- Check and checkmate
- Stalemate
- Draw by threefold repetition
- Draw by 50-move rule
- Draw by insufficient material
- Resignation and draw offer

### 💻 Development

#### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint code
```

### 📚 Complete Documentation

For more information, see:

- **[QUICK-START.md](./QUICK-START.md)** : Quick start guide
- **[RULES.md](./RULES.md)** : All chess rules
- **[PGN-NOTATION.md](./PGN-NOTATION.md)** : PGN format and algebraic notation
- **[THEMES.md](./THEMES.md)** : Color themes guide

### 📄 License

This project is open source and available under the MIT license.

### 👨‍💻 Author

Developed with ❤️ using React and Next.js
