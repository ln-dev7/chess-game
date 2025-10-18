# 🚀 Guide de Démarrage Rapide

Bienvenue dans le Jeu d'Échecs ! Ce guide vous aidera à démarrer rapidement.

## 📋 Prérequis

Assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** (généralement installé avec Node.js)

## 🛠️ Installation

1. **Naviguer vers le dossier du projet**

```bash
cd chess-game/
```

2. **Installer les dépendances** (si ce n'est pas déjà fait)

```bash
npm install
```

## 🎮 Lancement du jeu

### Mode Développement

Pour lancer le jeu en mode développement (avec rechargement automatique) :

```bash
npm run dev
```

Le jeu sera accessible à l'adresse : **http://localhost:3000**

### Mode Production

Pour construire et lancer le jeu en mode production :

```bash
# 1. Construire l'application
npm run build

# 2. Lancer l'application
npm start
```

## 🎯 Comment jouer

### Démarrage d'une partie

1. Ouvrez votre navigateur à l'adresse http://localhost:3000
2. Les pièces blanches commencent toujours en premier
3. Cliquez sur une pièce pour la sélectionner
4. Les mouvements possibles s'affichent en gris
5. Cliquez sur une case valide pour déplacer la pièce

### Indicateurs visuels

| Couleur         | Signification                                   |
| --------------- | ----------------------------------------------- |
| 🟡 Jaune        | Dernier coup joué (case de départ et d'arrivée) |
| 🔴 Rouge        | Roi en échec                                    |
| ⚪ Cercle petit | Mouvement possible vers une case vide           |
| ⚫ Cercle grand | Capture possible                                |

### Actions disponibles

#### Boutons principaux

- **🔄 Nouvelle partie** : Recommencer une nouvelle partie
- **🏳️ Abandonner** : Déclarer forfait (l'adversaire gagne)
- **🤝 Proposer nulle** : Proposer un match nul aux deux joueurs
- **💾 Exporter PGN** : Sauvegarder la partie au format standard FIDE

#### Panneau d'information

- **Joueur actuel** : Affiche qui doit jouer (Blancs ou Noirs)
- **Statut de la partie** : Affiche les échecs, échecs et mat, ou pat
- **Historique des coups** : Liste tous les coups joués

### Règles spéciales

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

## 📱 Compatibilité

Le jeu est compatible avec :

- 💻 **Ordinateurs** : Windows, macOS, Linux
- 📱 **Tablettes** : iPad, Android
- 📱 **Smartphones** : iPhone, Android

Le jeu est entièrement responsive et s'adapte à toutes les tailles d'écran !

## 🎨 Personnalisation

### Couleurs de l'échiquier

Les couleurs actuelles sont inspirées de chess.com :

- Cases claires : `#ebecd0`
- Cases foncées : `#739552`

Vous pouvez les modifier dans le fichier `components/ChessSquare.tsx`

### Symboles des pièces

Les pièces utilisent actuellement les symboles Unicode. Si vous souhaitez utiliser des images ou des SVG, modifiez le fichier `components/ChessPiece.tsx`

## 🐛 Résolution de problèmes

### Le serveur ne démarre pas

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 déjà utilisé

```bash
# Utiliser un autre port
PORT=3001 npm run dev
```

### Erreurs de build

```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run build
```

### Les pièces ne s'affichent pas correctement

Vérifiez que votre navigateur prend en charge les symboles Unicode des échecs. Tous les navigateurs modernes le supportent.

## 📚 Documentation complète

Pour plus d'informations, consultez :

- **[README.md](./README.md)** : Documentation technique complète
- **[REGLES.md](./REGLES.md)** : Toutes les règles du jeu d'échecs
- **[NOTATION-PGN.md](./NOTATION-PGN.md)** : Format PGN et notation algébrique
- **[AMELIORATIONS.md](./AMELIORATIONS.md)** : Fonctionnalités futures possibles

## 🎓 Conseils pour débuter

### Pour les débutants

1. **Protégez votre Roi** : C'est la pièce la plus importante
2. **Contrôlez le centre** : Occupez les cases centrales (e4, e5, d4, d5)
3. **Développez vos pièces** : Sortez Cavaliers et Fous rapidement
4. **Faites le roque** : Mettez votre Roi en sécurité tôt dans la partie
5. **Ne perdez pas de pièces** : Chaque pièce compte !

### Valeur des pièces

- Pion = 1 point
- Cavalier = 3 points
- Fou = 3 points
- Tour = 5 points
- Dame = 9 points
- Roi = ♾️ (inestimable)

### Principes d'ouverture

1. Contrôler le centre avec les pions (e4 ou d4)
2. Développer les Cavaliers (vers f3/c3 pour les Blancs)
3. Développer les Fous
4. Roquer rapidement (petit roque généralement)
5. Connecter les Tours

## 🤝 Support

Si vous rencontrez des problèmes ou avez des questions :

1. Vérifiez la [documentation](#-documentation-complète)
2. Consultez les [règles du jeu](./REGLES.md)
3. Vérifiez que toutes les dépendances sont installées
4. Essayez de redémarrer le serveur de développement

## 🎉 Profitez du jeu !

Vous êtes maintenant prêt à jouer ! Lancez le serveur et commencez une partie.

```bash
npm run dev
```

**Bon jeu ! ♟️👑**
