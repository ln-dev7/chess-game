# Jeu d'Échecs / Chess Game

Un jeu d'échecs complet et interactif développé avec React, Next.js et shadcn/ui. Le jeu propose un mode joueur contre joueur et un mode contre l'intelligence artificielle.

A complete and interactive chess game developed with React, Next.js and shadcn/ui. The game offers a player vs player mode and a mode against artificial intelligence.

---

## 🌍 Langue / Language

**Français** | [English](#english-version)

---

## 📋 Fonctionnalités / Features

### Règles du jeu complètes / Complete Game Rules

- ✅ Tous les mouvements de pièces (pion, cavalier, fou, tour, dame, roi) / All piece movements (pawn, knight, bishop, rook, queen, king)
- ✅ Règles spéciales / Special rules:
  - Roque (petit et grand) / Castling (kingside and queenside)
  - Prise en passant / En passant
  - Promotion du pion / Pawn promotion
- ✅ Détection d'échec, échec et mat, et pat / Check, checkmate, and stalemate detection
- ✅ Règles de nulle / Draw rules:
  - Répétition de position (3 fois) / Threefold repetition
  - Règle des 50 coups / 50-move rule
  - Matériel insuffisant / Insufficient material
  - Accord mutuel / Mutual agreement

### Modes de jeu / Game Modes

- 🎮 **Mode Joueur vs Joueur** : Deux joueurs sur le même appareil / **Player vs Player Mode**: Two players on the same device
- 🤖 **Mode contre l'IA** : 6 niveaux de difficulté (400 à 2500 Elo) / **AI Mode**: 6 difficulty levels (400 to 2500 Elo)
  - LN Débutant (400 Elo) / LN Beginner
  - LN Amateur (800 Elo)
  - LN Intermédiaire (1200 Elo) / LN Intermediate
  - LN Avancé (1600 Elo) / LN Advanced
  - LN Expert (2000 Elo)
  - LN Maître (2500 Elo) / LN Master

### Interface utilisateur / User Interface

- 🎨 Design minimaliste inspiré de chess.com / Minimalist design inspired by chess.com
- 🎨 **16 thèmes de couleurs** personnalisables / **16 customizable color themes**
- 🎭 **3 styles de pièces** (Classique, Moderne, Coloré) / **3 piece styles** (Classic, Modern, Colorful)
- 📱 Responsive (adapté mobile, tablette, desktop) / Responsive (mobile, tablet, desktop)
- 🎯 Indicateurs visuels pour les mouvements possibles / Visual indicators for possible moves
- 🔴 Mise en évidence de l'échec / Check highlighting
- 📊 Affichage des informations de la partie / Game information display
- 📜 Historique des coups en notation algébrique FIDE / Move history in FIDE algebraic notation
- 💾 Export PGN (format standard FIDE) avec copie dans le presse-papiers / PGN export (FIDE standard format) with clipboard copy
- 🎮 Contrôles de jeu (nouvelle partie, abandon, proposition nulle) / Game controls (new game, resign, draw offer)
- ⏱️ **Pendule d'échecs** avec plusieurs cadences / **Chess clock** with multiple time controls
- 🔊 **Effets sonores** (déplacement, capture, échec, victoire) / **Sound effects** (move, capture, check, victory)
- ✨ **Animations fluides** des déplacements de pièces / **Smooth animations** for piece movements
- 🌐 **Interface bilingue** (français / anglais) / **Bilingual interface** (French / English)
- 🎬 **Animation de victoire** lors d'un échec et mat / **Victory animation** on checkmate

### Personnalisation / Customization

- 🎨 16 thèmes de couleurs pré-définis / 16 pre-defined color themes
- 🎭 3 styles de pièces au choix / 3 piece styles to choose from
- ⏱️ 6 cadences de temps différentes / 6 different time controls
- 🔊 Contrôle du volume sonore / Volume control
- 💾 Sauvegarde automatique des préférences / Automatic preference saving

## 🛠️ Technologies utilisées / Technologies Used

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique / Static typing
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI / UI components
- **Lucide React** - Icônes / Icons
- **Zustand** - Gestion d'état / State management
- **next-intl** - Internationalisation / Internationalization
- **Motion** - Animations

## 📥 Installation

### Français

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

### English

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

## 🎮 Comment jouer / How to Play

### Français

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

### English

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

## 📂 Structure du projet / Project Structure

```
chess-game/
├── app/                      # Pages Next.js
├── components/               # Composants React / React components
│   ├── ChessBoard.tsx       # Plateau d'échecs / Chess board
│   ├── ChessSquare.tsx      # Case individuelle / Individual square
│   ├── ChessPiece.tsx       # Pièce d'échecs / Chess piece
│   ├── ChessGame.tsx        # Composant principal / Main component
│   ├── GameInfo.tsx         # Informations de la partie / Game information
│   ├── GameControls.tsx     # Contrôles du jeu / Game controls
│   ├── GameModeSelector.tsx # Sélecteur de mode / Mode selector
│   ├── AIDifficultySelector.tsx # Sélecteur de difficulté IA / AI difficulty selector
│   ├── ChessClock.tsx       # Pendule d'échecs / Chess clock
│   ├── MoveHistory.tsx      # Historique des coups / Move history
│   ├── PromotionDialog.tsx  # Dialogue de promotion / Promotion dialog
│   ├── ThemeSelector.tsx    # Sélecteur de thème / Theme selector
│   ├── PieceStyleSelector.tsx # Sélecteur de style / Style selector
│   └── LanguageSelector.tsx # Sélecteur de langue / Language selector
├── lib/                     # Logique du jeu / Game logic
│   ├── chess-engine.ts      # Moteur de jeu / Game engine
│   ├── chess-ai.ts          # Intelligence artificielle / Artificial intelligence
│   ├── chess-utils.ts       # Fonctions utilitaires / Utility functions
│   ├── chess-themes.ts      # Thèmes de couleurs / Color themes
│   ├── chess-sounds.ts      # Effets sonores / Sound effects
│   ├── piece-styles.ts      # Styles de pièces / Piece styles
│   ├── time-controls.ts     # Contrôles de temps / Time controls
│   └── pgn-utils.ts         # Utilitaires PGN / PGN utilities
├── store/                   # Gestion d'état Zustand / Zustand state management
├── types/                   # Types TypeScript
│   └── chess.ts            # Types du jeu d'échecs / Chess game types
├── messages/               # Traductions / Translations
│   ├── en.json            # Anglais / English
│   └── fr.json            # Français / French
├── public/                 # Fichiers statiques / Static files
│   └── pieces/            # Images des pièces / Piece images
└── Documentation/
    ├── README.md          # Ce fichier / This file
    ├── RULES.md          # Règles complètes / Complete rules
    ├── PGN-NOTATION.md   # Format PGN et notation / PGN format and notation
    ├── THEMES.md         # Thèmes de couleurs / Color themes
    ├── AI-IMPROVEMENTS.md # Documentation IA / AI documentation
    └── IMPROVEMENTS.md   # Améliorations futures / Future improvements
```

## 🎯 Règles implémentées / Implemented Rules

Toutes les règles officielles de la FIDE (Fédération Internationale des Échecs) sont implémentées :

All official FIDE (International Chess Federation) rules are implemented:

- Mouvements de toutes les pièces selon les règles officielles / All piece movements according to official rules
- Roque (avec vérification des conditions) / Castling (with condition checking)
- Prise en passant / En passant capture
- Promotion du pion (choix entre dame, tour, fou, cavalier) / Pawn promotion (choice between queen, rook, bishop, knight)
- Échec et échec et mat / Check and checkmate
- Pat (stalemate)
- Nulle par répétition de position / Draw by threefold repetition
- Nulle par la règle des 50 coups / Draw by 50-move rule
- Nulle par matériel insuffisant / Draw by insufficient material
- Abandon et proposition de nulle / Resignation and draw offer

## 💻 Développement / Development

### Commandes disponibles / Available Commands

```bash
npm run dev      # Lancer le serveur de développement / Start development server
npm run build    # Construire l'application pour la production / Build for production
npm run start    # Lancer l'application en production / Start production server
npm run lint     # Vérifier le code / Lint code
```

## 📚 Documentation complète / Complete Documentation

Pour plus d'informations, consultez / For more information, see:

- **[QUICK-START.md](./QUICK-START.md)** : Guide de démarrage rapide / Quick start guide
- **[RULES.md](./RULES.md)** : Toutes les règles du jeu d'échecs / All chess rules
- **[PGN-NOTATION.md](./PGN-NOTATION.md)** : Format PGN et notation algébrique / PGN format and algebraic notation
- **[THEMES.md](./THEMES.md)** : Guide des thèmes de couleurs / Color themes guide
- **[AI-IMPROVEMENTS.md](./AI-IMPROVEMENTS.md)** : Documentation de l'IA / AI documentation
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** : Fonctionnalités futures possibles / Possible future features

## 📄 Licence / License

Ce projet est open source et disponible sous la licence MIT.

This project is open source and available under the MIT license.

## 👨‍💻 Auteur / Author

Développé avec ❤️ en utilisant React et Next.js

Developed with ❤️ using React and Next.js

---

<a name="english-version"></a>

# English Version

See the bilingual sections above for all information in English.
