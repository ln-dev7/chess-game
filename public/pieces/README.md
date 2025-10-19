# Structure des Pièces d'Échecs / Chess Pieces Structure

**Français** | [English](#english-version)

---

## Version Française

Ce dossier contient les pièces d'échecs organisées par style.

### Organisation

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
├── modern/            # Style moderne
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
├── colorful/          # Style coloré
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

### Styles Disponibles

#### Classique

Style de pièce d'échecs traditionnel avec des silhouettes solides. Parfait pour un look intemporel et classique rappelant les jeux d'échecs traditionnels.

**Idéal pour :** Les joueurs qui préfèrent l'esthétique traditionnelle et une reconnaissance claire des pièces.

#### Moderne

Design géométrique contemporain et minimaliste avec des lignes épurées. Présente une apparence élégante et professionnelle avec des formes simplifiées.

**Idéal pour :** Les joueurs qui apprécient le design moderne et un échiquier épuré.

#### Coloré

Style vibrant et ludique avec des couleurs vives et audacieuses. Chaque pièce a des couleurs distinctives qui les font ressortir sur l'échiquier.

**Idéal pour :** Les apprenants visuels, les débutants et les joueurs qui préfèrent une apparence plus dynamique et engageante.

### Ajouter un Nouveau Style

Pour ajouter un nouveau style de pièces :

1. **Créer la structure de dossiers :**

   ```bash
   mkdir -p pieces/nouveau-style/black
   mkdir -p pieces/nouveau-style/white
   ```

2. **Ajouter les 12 fichiers SVG** (6 pièces × 2 couleurs) :

   - `black/bishop.svg`, `black/king.svg`, `black/knight.svg`, `black/pawn.svg`, `black/queen.svg`, `black/rook.svg`
   - `white/bishop.svg`, `white/king.svg`, `white/knight.svg`, `white/pawn.svg`, `white/queen.svg`, `white/rook.svg`

3. **Enregistrer le style** dans `/lib/piece-styles.ts` :

   ```typescript
   export const PIECE_STYLES: PieceStyle[] = [
     {
       id: "classic",
       name: "Classique",
       description: "Style de pièce traditionnel",
     },
     {
       id: "modern",
       name: "Moderne",
       description: "Design contemporain minimaliste",
     },
     {
       id: "colorful",
       name: "Coloré",
       description: "Style vibrant avec couleurs vives",
     },
     {
       id: "nouveau-style",
       name: "Nouveau Style",
       description: "Description de votre style",
     },
   ];
   ```

4. **Le nouveau style sera automatiquement disponible** dans le sélecteur de styles !

### Directives pour les Fichiers SVG

#### Format de Fichier

- Les fichiers SVG peuvent être de n'importe quelle taille (ils seront redimensionnés automatiquement)
- Optimisez vos SVG pour de meilleures performances (utilisez SVGO ou des outils similaires)
- Utilisez l'attribut `viewBox` pour un redimensionnement correct

#### Couleurs

- **Pièces blanches** : Utilisez `fill="#FFFFFF"` ou `fill="#FFF"`
- **Pièces noires** : Utilisez `fill="#000000"` ou `fill="#000"`
- Pour les pièces colorées, utilisez n'importe quel code couleur hexadécimal

#### Bonnes Pratiques

- Gardez les tailles de fichiers petites (< 10KB par pièce)
- Utilisez des chemins simples pour de meilleures performances
- Évitez les dégradés et les effets complexes
- Assurez-vous que les pièces sont reconnaissables en petite taille
- Testez sur des fonds clairs et sombres

### Tester Votre Style

Après avoir ajouté un nouveau style :

1. Démarrez le serveur de développement : `npm run dev`
2. Cliquez sur le bouton **Style** dans l'interface du jeu
3. Sélectionnez votre nouveau style dans la liste
4. Testez toutes les pièces sur différents thèmes
5. Vérifiez la visibilité des pièces sur les cases claires et foncées

### Conseils de Conception

1. **Cohérence** : Toutes les pièces doivent suivre le même langage de design
2. **Distinction** : Chaque type de pièce doit être facilement reconnaissable
3. **Évolutivité** : Les pièces doivent être belles à différentes tailles
4. **Contraste** : Assurez un bon contraste entre les pièces et l'échiquier
5. **Simplicité** : Les designs plus simples fonctionnent souvent mieux en petite taille

### Contribuer

Si vous créez un nouveau style de pièces et souhaitez le contribuer au projet :

1. Assurez-vous que les 12 fichiers SVG sont optimisés
2. Testez le style avec les 16 thèmes de couleurs
3. Ajoutez votre style à `/lib/piece-styles.ts`
4. Soumettez une pull request avec vos ajouts

---

<a name="english-version"></a>

## English Version

This folder contains chess pieces organized by style.

### Organization

```
pieces/
├── classic/           # Classic style (default)
│   ├── black/         # Black pieces
│   │   ├── bishop.svg
│   │   ├── king.svg
│   │   ├── knight.svg
│   │   ├── pawn.svg
│   │   ├── queen.svg
│   │   └── rook.svg
│   └── white/         # White pieces
│       ├── bishop.svg
│       ├── king.svg
│       ├── knight.svg
│       ├── pawn.svg
│       ├── queen.svg
│       └── rook.svg
├── modern/            # Modern style
│   ├── black/         # Black pieces
│   │   ├── bishop.svg
│   │   ├── king.svg
│   │   ├── knight.svg
│   │   ├── pawn.svg
│   │   ├── queen.svg
│   │   └── rook.svg
│   └── white/         # White pieces
│       ├── bishop.svg
│       ├── king.svg
│       ├── knight.svg
│       ├── pawn.svg
│       ├── queen.svg
│       └── rook.svg
├── colorful/          # Colorful style
│   ├── black/         # Black pieces
│   │   ├── bishop.svg
│   │   ├── king.svg
│   │   ├── knight.svg
│   │   ├── pawn.svg
│   │   ├── queen.svg
│   │   └── rook.svg
│   └── white/         # White pieces
│       ├── bishop.svg
│       ├── king.svg
│       ├── knight.svg
│       ├── pawn.svg
│       ├── queen.svg
│       └── rook.svg
└── README.md          # This file
```

### Available Styles

#### Classic

Traditional chess piece style with solid silhouettes. Perfect for a timeless, classic look reminiscent of traditional chess sets.

**Best for:** Players who prefer traditional aesthetics and clear piece recognition.

#### Modern

Contemporary and minimalist geometric design with clean lines and shapes. Features a sleek, professional appearance with simplified forms.

**Best for:** Players who enjoy modern design and a clean, uncluttered board.

#### Colorful

Vibrant and playful style with bright, bold colors. Each piece has distinctive colors that make them stand out on the board.

**Best for:** Visual learners, beginners, and players who prefer a more dynamic, engaging appearance.

### Adding a New Style

To add a new piece style:

1. **Create the folder structure:**

   ```bash
   mkdir -p pieces/new-style/black
   mkdir -p pieces/new-style/white
   ```

2. **Add the 12 SVG files** (6 pieces × 2 colors):

   - `black/bishop.svg`, `black/king.svg`, `black/knight.svg`, `black/pawn.svg`, `black/queen.svg`, `black/rook.svg`
   - `white/bishop.svg`, `white/king.svg`, `white/knight.svg`, `white/pawn.svg`, `white/queen.svg`, `white/rook.svg`

3. **Register the style** in `/lib/piece-styles.ts`:

   ```typescript
   export const PIECE_STYLES: PieceStyle[] = [
     {
       id: "classic",
       name: "Classic",
       description: "Traditional chess piece style",
     },
     {
       id: "modern",
       name: "Modern",
       description: "Contemporary minimalist design",
     },
     {
       id: "colorful",
       name: "Colorful",
       description: "Vibrant style with bright colors",
     },
     {
       id: "new-style",
       name: "New Style",
       description: "Your style description",
     },
   ];
   ```

4. **The new style will be automatically available** in the style selector!

### SVG File Guidelines

#### File Format

- SVG files can be any size (they will be automatically resized)
- Optimize your SVGs for better performance (use SVGO or similar tools)
- Use `viewBox` attribute for proper scaling

#### Colors

- **White pieces**: Use `fill="#FFFFFF"` or `fill="#FFF"`
- **Black pieces**: Use `fill="#000000"` or `fill="#000"`
- For colorful pieces, use any hex color code

#### Best Practices

- Keep file sizes small (< 10KB per piece)
- Use simple paths for better performance
- Avoid gradients and complex effects
- Ensure pieces are recognizable at small sizes
- Test on light and dark backgrounds

### Testing Your Style

After adding a new style:

1. Start the development server: `npm run dev`
2. Click on the **Style** button in the game interface
3. Select your new style from the list
4. Test all pieces on different themes
5. Verify piece visibility on both light and dark squares

### Style Design Tips

1. **Consistency**: All pieces should follow the same design language
2. **Distinctiveness**: Each piece type should be easily recognizable
3. **Scalability**: Pieces should look good at different sizes
4. **Contrast**: Ensure good contrast between pieces and board
5. **Simplicity**: Simpler designs often work better at small sizes

### Contributing

If you create a new piece style and would like to contribute it to the project:

1. Ensure all 12 SVG files are optimized
2. Test the style with all 16 color themes
3. Add your style to `/lib/piece-styles.ts`
4. Submit a pull request with your additions
