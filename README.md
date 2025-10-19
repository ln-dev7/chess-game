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
│   ├── ChessBoard.tsx       # Plateau d'échecs
│   ├── ChessSquare.tsx      # Case individuelle
│   ├── ChessPiece.tsx       # Pièce d'échecs
│   ├── ChessGame.tsx        # Composant principal
│   ├── GameInfo.tsx         # Informations de la partie
│   ├── GameControls.tsx     # Contrôles du jeu
│   ├── GameModeSelector.tsx # Sélecteur de mode
│   ├── AIDifficultySelector.tsx # Sélecteur de difficulté IA
│   ├── ChessClock.tsx       # Pendule d'échecs
│   ├── MoveHistory.tsx      # Historique des coups
│   ├── PromotionDialog.tsx  # Dialogue de promotion
│   ├── ThemeSelector.tsx    # Sélecteur de thème
│   ├── PieceStyleSelector.tsx # Sélecteur de style
│   └── LanguageSelector.tsx # Sélecteur de langue
├── lib/                     # Logique du jeu
│   ├── chess-engine.ts      # Moteur de jeu
│   ├── chess-ai.ts          # Intelligence artificielle
│   ├── chess-utils.ts       # Fonctions utilitaires
│   ├── chess-themes.ts      # Thèmes de couleurs
│   ├── chess-sounds.ts      # Effets sonores
│   ├── piece-styles.ts      # Styles de pièces
│   ├── time-controls.ts     # Contrôles de temps
│   └── pgn-utils.ts         # Utilitaires PGN
├── store/                   # Gestion d'état Zustand
├── types/                   # Types TypeScript
│   └── chess.ts            # Types du jeu d'échecs
├── messages/               # Traductions
│   ├── en.json            # Anglais
│   └── fr.json            # Français
├── public/                 # Fichiers statiques
│   └── pieces/            # Images des pièces
└── Documentation/
    ├── README.md          # Ce fichier
    ├── RULES.md          # Règles complètes
    ├── PGN-NOTATION.md   # Format PGN et notation
    ├── THEMES.md         # Thèmes de couleurs
    ├── AI-IMPROVEMENTS.md # Documentation IA
    └── IMPROVEMENTS.md   # Améliorations futures
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
- **[AI-IMPROVEMENTS.md](./AI-IMPROVEMENTS.md)** : Documentation de l'IA
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** : Fonctionnalités futures possibles

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
│   ├── ChessBoard.tsx       # Chess board
│   ├── ChessSquare.tsx      # Individual square
│   ├── ChessPiece.tsx       # Chess piece
│   ├── ChessGame.tsx        # Main component
│   ├── GameInfo.tsx         # Game information
│   ├── GameControls.tsx     # Game controls
│   ├── GameModeSelector.tsx # Mode selector
│   ├── AIDifficultySelector.tsx # AI difficulty selector
│   ├── ChessClock.tsx       # Chess clock
│   ├── MoveHistory.tsx      # Move history
│   ├── PromotionDialog.tsx  # Promotion dialog
│   ├── ThemeSelector.tsx    # Theme selector
│   ├── PieceStyleSelector.tsx # Style selector
│   └── LanguageSelector.tsx # Language selector
├── lib/                     # Game logic
│   ├── chess-engine.ts      # Game engine
│   ├── chess-ai.ts          # Artificial intelligence
│   ├── chess-utils.ts       # Utility functions
│   ├── chess-themes.ts      # Color themes
│   ├── chess-sounds.ts      # Sound effects
│   ├── piece-styles.ts      # Piece styles
│   ├── time-controls.ts     # Time controls
│   └── pgn-utils.ts         # PGN utilities
├── store/                   # Zustand state management
├── types/                   # TypeScript types
│   └── chess.ts            # Chess game types
├── messages/               # Translations
│   ├── en.json            # English
│   └── fr.json            # French
├── public/                 # Static files
│   └── pieces/            # Piece images
└── Documentation/
    ├── README.md          # This file
    ├── RULES.md          # Complete rules
    ├── PGN-NOTATION.md   # PGN format and notation
    ├── THEMES.md         # Color themes
    ├── AI-IMPROVEMENTS.md # AI documentation
    └── IMPROVEMENTS.md   # Future improvements
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
- **[AI-IMPROVEMENTS.md](./AI-IMPROVEMENTS.md)** : AI documentation
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** : Possible future features

### 📄 License

This project is open source and available under the MIT license.

### 👨‍💻 Author

Developed with ❤️ using React and Next.js
