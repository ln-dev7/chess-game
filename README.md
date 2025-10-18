# Jeu d'Échecs

Un jeu d'échecs complet et interactif développé avec React, Next.js et shadcn/ui. Le jeu est jouable en local entre deux joueurs sur le même appareil.

## Fonctionnalités

### Règles du jeu complètes

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

### Interface utilisateur

- 🎨 Design minimaliste inspiré de chess.com
- 🎨 **16 thèmes de couleurs** personnalisables
- 📱 Responsive (adapté mobile, tablette, desktop)
- 🎯 Indicateurs visuels pour les mouvements possibles
- 🔴 Mise en évidence de l'échec
- 📊 Affichage des informations de la partie
- 📜 Historique des coups en notation algébrique FIDE
- 💾 Export PGN (format standard FIDE) avec copie dans le presse-papiers
- 🎮 Contrôles de jeu (nouvelle partie, abandon, proposition nulle)

## Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **Lucide React** - Icônes

## Installation

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

## Comment jouer

1. Les Blancs commencent toujours en premier
2. Cliquez sur une pièce pour la sélectionner
3. Les mouvements valides sont indiqués par des cercles
4. Cliquez sur une case valide pour déplacer la pièce
5. Le jeu détecte automatiquement les échecs, échecs et mat, et les pats
6. Personnalisez l'échiquier avec 16 thèmes de couleurs disponibles
7. Exportez votre partie au format PGN pour la sauvegarder ou la partager

## Structure du projet

```
chess-game/
├── app/                      # Pages Next.js
├── components/               # Composants React
│   ├── ChessBoard.tsx       # Plateau d'échecs
│   ├── ChessSquare.tsx      # Case individuelle
│   ├── ChessPiece.tsx       # Pièce d'échecs
│   ├── ChessGame.tsx        # Composant principal du jeu
│   ├── GameInfo.tsx         # Informations de la partie
│   ├── GameControls.tsx     # Contrôles du jeu
│   └── PromotionDialog.tsx  # Dialogue de promotion
├── lib/                     # Logique du jeu
│   ├── chess-engine.ts      # Moteur de jeu
│   └── chess-utils.ts       # Fonctions utilitaires
├── types/                   # Types TypeScript
│   └── chess.ts            # Types du jeu d'échecs
├── public/                  # Fichiers statiques
└── Documentation/
    ├── README.md           # Ce fichier
    ├── REGLES.md          # Règles complètes
    ├── NOTATION-PGN.md    # Format PGN et notation
    ├── THEMES.md          # Thèmes de couleurs
    └── ...                # Autres guides
```

## Règles implémentées

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

## Développement

### Commandes disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Construire l'application pour la production
npm run start    # Lancer l'application en production
npm run lint     # Vérifier le code
```

## Licence

Ce projet est open source et disponible sous la licence MIT.

## Auteur

Développé avec ❤️ en utilisant React et Next.js
