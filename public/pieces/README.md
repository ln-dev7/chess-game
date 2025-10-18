# Chess Pieces Structure

This folder contains chess pieces organized by style.

## Organization

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
└── README.md          # This file
```

## Available Styles

### Classic
Traditional chess piece style with solid silhouettes. Perfect for a timeless look.

### Modern
Contemporary and minimalist geometric design with clean lines and shapes. Features a sleek, professional appearance.

## Adding a New Style

To add a new piece style:

1. Create a new folder with the style name (e.g., `medieval`, `cartoon`, etc.)
   ```bash
   mkdir -p pieces/new-style/black
   mkdir -p pieces/new-style/white
   ```

2. Add the 12 SVG files (6 pieces × 2 colors):
   - `black/bishop.svg`, `black/king.svg`, `black/knight.svg`, `black/pawn.svg`, `black/queen.svg`, `black/rook.svg`
   - `white/bishop.svg`, `white/king.svg`, `white/knight.svg`, `white/pawn.svg`, `white/queen.svg`, `white/rook.svg`

3. Register the new style in `/lib/piece-styles.ts`:
   ```typescript
   export const PIECE_STYLES: PieceStyle[] = [
     {
       id: "classic",
       name: "Classic",
       description: "Traditional chess piece style",
     },
     {
       id: "new-style",
       name: "New Style",
       description: "Your style description",
     },
   ];
   ```

4. The new style will be automatically available in the style selector!

## SVG File Format

- SVG files can be any size (they will be automatically resized)
- For white pieces, use `fill="#FFFFFF"` or `fill="#FFF"`
- For black pieces, use `fill="#000000"` or `fill="#000"`
- Optimize your SVGs for better performance (use SVGO for example)
