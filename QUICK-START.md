# 🚀 Guide de Démarrage Rapide / Quick Start Guide

**Français** | [English](#english-version)

---

## Version Française

Bienvenue dans le Jeu d'Échecs ! Ce guide vous aidera à démarrer rapidement.

### 📋 Prérequis

Assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** (généralement installé avec Node.js)

### 🛠️ Installation

1. **Naviguer vers le dossier du projet**

```bash
cd chess-game/
```

2. **Installer les dépendances** (si ce n'est pas déjà fait)

```bash
npm install
```

### 🎮 Lancement du jeu

#### Mode Développement

Pour lancer le jeu en mode développement (avec rechargement automatique) :

```bash
npm run dev
```

Le jeu sera accessible à l'adresse : **http://localhost:3000**

#### Mode Production

Pour construire et lancer le jeu en mode production :

```bash
# 1. Construire l'application
npm run build

# 2. Lancer l'application
npm start
```

### 🎯 Comment jouer

#### Configuration initiale

1. Ouvrez votre navigateur à l'adresse http://localhost:3000
2. **Choisissez votre mode de jeu** :
   - **Joueur vs Joueur** : Pour jouer à deux sur le même appareil
   - **Joueur vs LN** : Pour jouer contre l'intelligence artificielle

#### Si vous jouez contre l'IA

1. **Sélectionnez le niveau de difficulté** :
   - LN Débutant (400 Elo) : Fait beaucoup d'erreurs
   - LN Amateur (800 Elo) : Joue de manière basique
   - LN Intermédiaire (1200 Elo) : Bon niveau tactique
   - LN Avancé (1600 Elo) : Solide et stratégique
   - LN Expert (2000 Elo) : Très fort
   - LN Maître (2500 Elo) : Quasi-parfait

2. **Choisissez votre couleur** :
   - Jouer avec les Blancs (vous commencez)
   - Jouer avec les Noirs (l'IA commence)

#### Démarrage d'une partie

1. Les pièces blanches commencent toujours en premier
2. Cliquez sur une pièce pour la sélectionner
3. Les mouvements possibles s'affichent en gris
4. Cliquez sur une case valide pour déplacer la pièce

### 🎨 Indicateurs visuels

| Couleur         | Signification                                   |
| --------------- | ----------------------------------------------- |
| 🟡 Jaune        | Dernier coup joué (case de départ et d'arrivée) |
| 🔴 Rouge        | Roi en échec                                    |
| ⚪ Cercle petit | Mouvement possible vers une case vide           |
| ⚫ Cercle grand | Capture possible                                |

### 🎮 Actions disponibles

#### Boutons principaux

- **🔄 Nouvelle partie** : Recommencer une nouvelle partie
- **🏳️ Abandonner** : Déclarer forfait (l'adversaire gagne)
- **🤝 Proposer nulle** : Proposer un match nul aux deux joueurs
- **🎨 Thème** : Changer les couleurs de l'échiquier (16 thèmes disponibles)
- **🎭 Style** : Changer l'apparence des pièces (3 styles disponibles)
- **⏱️ Temps** : Configurer la pendule d'échecs (6 cadences disponibles)
- **🔊 Sons** : Activer/désactiver les effets sonores
- **🌐 Langue** : Basculer entre français et anglais
- **💾 Exporter PGN** : Sauvegarder ou copier la partie au format standard FIDE
  - **Aperçu en temps réel** : Le PGN se met à jour automatiquement
  - **Copier** : Copie directement dans le presse-papiers
  - **Télécharger** : Sauvegarde un fichier .pgn

#### Panneau d'information

- **Joueur actuel** : Affiche qui doit jouer (Blancs ou Noirs)
- **Statut de la partie** : Affiche les échecs, échecs et mat, ou pat
- **Pendule d'échecs** : Affiche le temps restant pour chaque joueur
- **Historique des coups** : Liste tous les coups joués

### ✨ Règles spéciales

#### Le Roque

Pour effectuer un roque :

1. Sélectionnez le Roi
2. Cliquez sur la case de destination (2 cases à droite ou à gauche)
3. La Tour se déplacera automatiquement

**Conditions :**

- Le Roi et la Tour n'ont pas encore bougé
- Aucune pièce entre le Roi et la Tour
- Le Roi n'est pas en échec
- Le Roi ne traverse pas une case attaquée

#### Prise en Passant

La prise en passant se fait automatiquement :

1. Un pion adverse avance de 2 cases à côté de votre pion
2. Vous pouvez capturer ce pion au coup suivant
3. Cliquez sur la case diagonale indiquée

#### Promotion du Pion

Quand un pion atteint la dernière rangée :

1. Une fenêtre s'ouvre automatiquement
2. Choisissez la pièce de promotion (Dame, Tour, Fou, Cavalier)
3. Cliquez sur votre choix

### 📱 Compatibilité

Le jeu est compatible avec :

- 💻 **Ordinateurs** : Windows, macOS, Linux
- 📱 **Tablettes** : iPad, Android
- 📱 **Smartphones** : iPhone, Android

Le jeu est entièrement responsive et s'adapte à toutes les tailles d'écran !

### 🎨 Personnalisation

#### Thèmes de couleurs

Le jeu propose **16 thèmes de couleurs** pré-définis :

- **Classique** : Style chess.com (par défaut)
- **Bois** : Tons chaleureux naturels
- **Océan** : Palette bleue apaisante
- **Forêt** : Tons verts naturels
- **Améthyste** : Teintes violettes élégantes
- **Minimaliste** : Noir et blanc épuré
- **Nuit** : Mode sombre
- **Et 9 autres thèmes !**

Pour changer de thème, cliquez sur le bouton **"Thème"** dans l'interface du jeu.

Consultez **[THEMES.md](./THEMES.md)** pour plus de détails sur tous les thèmes disponibles.

#### Styles de pièces

3 styles de pièces sont disponibles :

- **Classique** : Style traditionnel intemporel
- **Moderne** : Design contemporain et minimaliste
- **Coloré** : Style vibrant avec des couleurs vives

Pour changer de style, cliquez sur le bouton **"Style"** dans l'interface du jeu.

#### Cadences de temps

6 cadences de temps sont disponibles :

- **Sans limite** : Pas de contrainte de temps
- **Bullet (1 min)** : 1 minute par joueur
- **Bullet (2 min)** : 2 minutes par joueur
- **Blitz (3 min)** : 3 minutes par joueur
- **Blitz (5 min)** : 5 minutes par joueur
- **Rapide (10 min)** : 10 minutes par joueur

Pour configurer le temps, cliquez sur le bouton **"Temps"** avant de commencer une partie.

### 🐛 Résolution de problèmes

#### Le serveur ne démarre pas

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### Port 3000 déjà utilisé

```bash
# Utiliser un autre port
PORT=3001 npm run dev
```

#### Erreurs de build

```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run build
```

### 📚 Documentation complète

Pour plus d'informations, consultez :

- **[README.md](./README.md)** : Documentation technique complète
- **[RULES.md](./RULES.md)** : Toutes les règles du jeu d'échecs
- **[PGN-NOTATION.md](./PGN-NOTATION.md)** : Format PGN et notation algébrique
- **[THEMES.md](./THEMES.md)** : Guide des thèmes de couleurs (16 thèmes disponibles)
- **[AI-IMPROVEMENTS.md](./AI-IMPROVEMENTS.md)** : Documentation de l'IA
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** : Fonctionnalités futures possibles

### 🎓 Conseils pour débuter

#### Pour les débutants

1. **Protégez votre Roi** : C'est la pièce la plus importante
2. **Contrôlez le centre** : Occupez les cases centrales (e4, e5, d4, d5)
3. **Développez vos pièces** : Sortez Cavaliers et Fous rapidement
4. **Faites le roque** : Mettez votre Roi en sécurité tôt dans la partie
5. **Ne perdez pas de pièces** : Chaque pièce compte !

#### Valeur des pièces

- Pion = 1 point
- Cavalier = 3 points
- Fou = 3 points
- Tour = 5 points
- Dame = 9 points
- Roi = ♾️ (inestimable)

#### Principes d'ouverture

1. Contrôler le centre avec les pions (e4 ou d4)
2. Développer les Cavaliers (vers f3/c3 pour les Blancs)
3. Développer les Fous
4. Roquer rapidement (petit roque généralement)
5. Connecter les Tours

### 🤝 Support

Si vous rencontrez des problèmes ou avez des questions :

1. Vérifiez la [documentation](#-documentation-complète)
2. Consultez les [règles du jeu](./RULES.md)
3. Vérifiez que toutes les dépendances sont installées
4. Essayez de redémarrer le serveur de développement

### 🎉 Profitez du jeu !

Vous êtes maintenant prêt à jouer ! Lancez le serveur et commencez une partie.

```bash
npm run dev
```

**Bon jeu ! ♟️👑**

---

<a name="english-version"></a>

## English Version

Welcome to Chess Game! This guide will help you get started quickly.

### 📋 Prerequisites

Make sure you have installed:

- **Node.js** (version 18 or higher)
- **npm** (usually installed with Node.js)

### 🛠️ Installation

1. **Navigate to the project folder**

```bash
cd chess-game/
```

2. **Install dependencies** (if not already done)

```bash
npm install
```

### 🎮 Running the Game

#### Development Mode

To run the game in development mode (with automatic reload):

```bash
npm run dev
```

The game will be accessible at: **http://localhost:3000**

#### Production Mode

To build and run the game in production mode:

```bash
# 1. Build the application
npm run build

# 2. Run the application
npm start
```

### 🎯 How to Play

#### Initial Setup

1. Open your browser at http://localhost:3000
2. **Choose your game mode**:
   - **Player vs Player**: To play with two people on the same device
   - **Player vs LN**: To play against artificial intelligence

#### If Playing Against AI

1. **Select difficulty level**:
   - LN Beginner (400 Elo): Makes many mistakes
   - LN Amateur (800 Elo): Basic play
   - LN Intermediate (1200 Elo): Good tactical level
   - LN Advanced (1600 Elo): Solid and strategic
   - LN Expert (2000 Elo): Very strong
   - LN Master (2500 Elo): Near-perfect

2. **Choose your color**:
   - Play as White (you start)
   - Play as Black (AI starts)

#### Starting a Game

1. White pieces always start first
2. Click on a piece to select it
3. Possible moves are displayed in gray
4. Click on a valid square to move the piece

### 🎨 Visual Indicators

| Color          | Meaning                                   |
| -------------- | ----------------------------------------- |
| 🟡 Yellow      | Last move (departure and arrival square)  |
| 🔴 Red         | King in check                             |
| ⚪ Small circle | Possible move to an empty square          |
| ⚫ Large circle | Possible capture                          |

### 🎮 Available Actions

#### Main Buttons

- **🔄 New Game**: Start a new game
- **🏳️ Resign**: Forfeit (opponent wins)
- **🤝 Offer Draw**: Propose a draw to both players
- **🎨 Theme**: Change board colors (16 themes available)
- **🎭 Style**: Change piece appearance (3 styles available)
- **⏱️ Time**: Configure chess clock (6 time controls available)
- **🔊 Sounds**: Enable/disable sound effects
- **🌐 Language**: Switch between French and English
- **💾 Export PGN**: Save or copy the game in FIDE standard format
  - **Real-time preview**: PGN updates automatically
  - **Copy**: Copy directly to clipboard
  - **Download**: Save a .pgn file

#### Information Panel

- **Current Player**: Shows who should play (White or Black)
- **Game Status**: Displays checks, checkmates, or stalemates
- **Chess Clock**: Shows remaining time for each player
- **Move History**: Lists all moves played

### ✨ Special Rules

#### Castling

To perform castling:

1. Select the King
2. Click on the destination square (2 squares right or left)
3. The Rook will move automatically

**Conditions:**

- The King and Rook have not yet moved
- No pieces between the King and Rook
- The King is not in check
- The King does not cross an attacked square

#### En Passant

En passant capture happens automatically:

1. An opponent's pawn advances 2 squares next to your pawn
2. You can capture this pawn on the next move
3. Click on the indicated diagonal square

#### Pawn Promotion

When a pawn reaches the last rank:

1. A window opens automatically
2. Choose the promotion piece (Queen, Rook, Bishop, Knight)
3. Click on your choice

### 📱 Compatibility

The game is compatible with:

- 💻 **Computers**: Windows, macOS, Linux
- 📱 **Tablets**: iPad, Android
- 📱 **Smartphones**: iPhone, Android

The game is fully responsive and adapts to all screen sizes!

### 🎨 Customization

#### Color Themes

The game offers **16 pre-defined color themes**:

- **Classic**: Chess.com style (default)
- **Wood**: Warm natural tones
- **Ocean**: Soothing blue palette
- **Forest**: Natural green tones
- **Amethyst**: Elegant purple hues
- **Minimalist**: Clean black and white
- **Night**: Dark mode
- **And 9 more themes!**

To change theme, click the **"Theme"** button in the game interface.

See **[THEMES.md](./THEMES.md)** for details on all available themes.

#### Piece Styles

3 piece styles are available:

- **Classic**: Timeless traditional style
- **Modern**: Contemporary minimalist design
- **Colorful**: Vibrant style with bright colors

To change style, click the **"Style"** button in the game interface.

#### Time Controls

6 time controls are available:

- **No Limit**: No time constraint
- **Bullet (1 min)**: 1 minute per player
- **Bullet (2 min)**: 2 minutes per player
- **Blitz (3 min)**: 3 minutes per player
- **Blitz (5 min)**: 5 minutes per player
- **Rapid (10 min)**: 10 minutes per player

To configure time, click the **"Time"** button before starting a game.

### 🐛 Troubleshooting

#### Server Won't Start

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Port 3000 Already in Use

```bash
# Use another port
PORT=3001 npm run dev
```

#### Build Errors

```bash
# Clean Next.js cache
rm -rf .next
npm run build
```

### 📚 Complete Documentation

For more information, see:

- **[README.md](./README.md)**: Complete technical documentation
- **[RULES.md](./RULES.md)**: All chess game rules
- **[PGN-NOTATION.md](./PGN-NOTATION.md)**: PGN format and algebraic notation
- **[THEMES.md](./THEMES.md)**: Color themes guide (16 themes available)
- **[AI-IMPROVEMENTS.md](./AI-IMPROVEMENTS.md)**: AI documentation
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)**: Possible future features

### 🎓 Tips for Beginners

#### For Beginners

1. **Protect your King**: It's the most important piece
2. **Control the center**: Occupy central squares (e4, e5, d4, d5)
3. **Develop your pieces**: Bring out Knights and Bishops quickly
4. **Castle early**: Put your King to safety early in the game
5. **Don't lose pieces**: Every piece counts!

#### Piece Values

- Pawn = 1 point
- Knight = 3 points
- Bishop = 3 points
- Rook = 5 points
- Queen = 9 points
- King = ♾️ (priceless)

#### Opening Principles

1. Control the center with pawns (e4 or d4)
2. Develop Knights (towards f3/c3 for White)
3. Develop Bishops
4. Castle quickly (usually kingside)
5. Connect the Rooks

### 🤝 Support

If you encounter problems or have questions:

1. Check the [documentation](#-complete-documentation)
2. Consult the [game rules](./RULES.md)
3. Verify that all dependencies are installed
4. Try restarting the development server

### 🎉 Enjoy the Game!

You're now ready to play! Start the server and begin a game.

```bash
npm run dev
```

**Enjoy! ♟️👑**
