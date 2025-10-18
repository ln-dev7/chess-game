# Structure des pièces d'échecs

Ce dossier contient les pièces d'échecs organisées par style.

## Organisation

```
pieces/
├── classic/           # Style classique (par défaut)
│   ├── black/         # Pièces noires
│   │   ├── bishop.svg
│   │   ├── king.svg
│   │   ├── knight.svg
│   │   ├── pawn.svg
│   │   ├── queen.svg
│   │   └── rook.svg
│   └── white/         # Pièces blanches
│       ├── bishop.svg
│       ├── king.svg
│       ├── knight.svg
│       ├── pawn.svg
│       ├── queen.svg
│       └── rook.svg
└── README.md          # Ce fichier
```

## Ajouter un nouveau style

Pour ajouter un nouveau style de pièces :

1. Créez un nouveau dossier avec le nom du style (par exemple : `modern`, `medieval`, `cartoon`, etc.)
   ```bash
   mkdir -p pieces/nouveau-style/black
   mkdir -p pieces/nouveau-style/white
   ```

2. Ajoutez les 12 fichiers SVG (6 pièces × 2 couleurs) :
   - `black/bishop.svg`, `black/king.svg`, `black/knight.svg`, `black/pawn.svg`, `black/queen.svg`, `black/rook.svg`
   - `white/bishop.svg`, `white/king.svg`, `white/knight.svg`, `white/pawn.svg`, `white/queen.svg`, `white/rook.svg`

3. Enregistrez le nouveau style dans `/lib/piece-styles.ts` :
   ```typescript
   export const PIECE_STYLES: PieceStyle[] = [
     {
       id: "classic",
       name: "Classique",
       description: "Style traditionnel des pièces d'échecs",
     },
     {
       id: "nouveau-style",
       name: "Nouveau Style",
       description: "Description de votre style",
     },
   ];
   ```

4. Le nouveau style sera automatiquement disponible dans le sélecteur de style de l'application !

## Format des fichiers SVG

- Les SVG peuvent avoir n'importe quelle taille (ils seront redimensionnés automatiquement)
- Pour les pièces blanches, utilisez `fill="#FFFFFF"` ou `fill="#FFF"`
- Pour les pièces noires, utilisez `fill="#000000"` ou `fill="#000"`
- Optimisez vos SVG pour de meilleures performances (utilisez SVGO par exemple)

## Exemples d'idées de styles

- **Modern** : Design minimaliste et géométrique
- **Medieval** : Style inspiré des pièces médiévales
- **Cartoon** : Design amusant et coloré pour les enfants
- **3D** : Effet de profondeur et d'ombrage
- **Pixel Art** : Style rétro 8-bit
- **Staunton** : Style de tournoi traditionnel
- **Fantasy** : Pièces inspirées de la fantasy et du jeu vidéo
