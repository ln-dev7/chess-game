# 🎨 Thèmes de Couleurs / Color Themes

**Français** | [English](#english-version)

---

## Version Française

Le jeu d'échecs propose **16 thèmes de couleurs** pré-définis pour personnaliser l'apparence de l'échiquier selon vos préférences.

### 📚 Thèmes disponibles

#### Classique

Le thème par défaut, inspiré de chess.com avec des tons verts.

- Cases claires : Beige clair
- Cases foncées : Vert olive

#### Bois

Tons chauds rappelant un échiquier en bois naturel.

- Cases claires : Beige doré
- Cases foncées : Marron bois

#### Océan

Palette de bleus apaisants.

- Cases claires : Gris clair bleuté
- Cases foncées : Bleu ardoise

#### Forêt

Tons verts naturels et lumineux.

- Cases claires : Jaune pâle
- Cases foncées : Vert sapin

#### Améthyste

Teintes violettes élégantes.

- Cases claires : Lavande pâle
- Cases foncées : Violet améthyste

#### Minimaliste

Design épuré en noir et blanc.

- Cases claires : Blanc pur
- Cases foncées : Gris moyen

#### Nuit

Mode sombre pour jouer dans l'obscurité.

- Cases claires : Gris foncé
- Cases foncées : Noir charbon

#### Corail

Palette chaleureuse aux tons orangés.

- Cases claires : Pêche clair
- Cases foncées : Corail

#### Marine

Bleus profonds rappelant la mer.

- Cases claires : Gris bleuté
- Cases foncées : Bleu marine

#### Acajou

Tons bois foncés et riches.

- Cases claires : Beige sable
- Cases foncées : Acajou

#### Rose

Teintes douces et féminines.

- Cases claires : Rose pâle
- Cases foncées : Rose poudré

#### Menthe

Tons verts frais et légers.

- Cases claires : Vert menthe clair
- Cases foncées : Vert menthe

#### Bordeaux

Palette élégante rouge foncé.

- Cases claires : Beige rosé
- Cases foncées : Bordeaux

#### Sable

Tons désertiques chaleureux.

- Cases claires : Beige sable clair
- Cases foncées : Sable doré

#### Tournoi

Style professionnel avec bleu vif.

- Cases claires : Blanc cassé
- Cases foncées : Bleu royal

#### Marbre

Aspect pierre naturelle.

- Cases claires : Blanc cassé
- Cases foncées : Gris pierre

### 🎯 Comment changer de thème

1. **Pendant une partie**, cliquez sur le bouton **"Thème : [Nom actuel]"**
2. Un dialogue s'ouvre avec **tous les thèmes disponibles**
3. **Prévisualisez** chaque thème avec un mini-échiquier
4. **Cliquez** sur le thème de votre choix
5. Le thème est **appliqué instantanément**

### 💾 Sauvegarde automatique

Votre choix de thème est **automatiquement sauvegardé** dans votre navigateur (localStorage). Lors de votre prochaine visite, le thème que vous avez choisi sera restauré.

### 🎨 Détails techniques

Chaque thème comprend **6 couleurs** :

1. **Case claire** : Couleur de base pour les cases blanches
2. **Case foncée** : Couleur de base pour les cases noires
3. **Sélection claire** : Surbrillance des cases claires sélectionnées
4. **Sélection foncée** : Surbrillance des cases foncées sélectionnées
5. **Dernier coup clair** : Indication du dernier coup (cases claires)
6. **Dernier coup foncé** : Indication du dernier coup (cases foncées)

#### Couleur d'échec

La couleur d'échec (rouge) est **identique pour tous les thèmes** afin de garantir une visibilité maximale lors d'une situation critique.

### 📱 Responsive

Tous les thèmes sont **optimisés** pour :

- 💻 **Desktop** : Affichage complet avec détails
- 📱 **Mobile** : Interface adaptée tactile
- 🖥️ **Tablette** : Expérience équilibrée

### ♿ Accessibilité

Les thèmes ont été conçus avec l'accessibilité en tête :

- ✅ **Contraste élevé** entre cases claires et foncées
- ✅ **Lisibilité** des coordonnées (a-h, 1-8)
- ✅ **Visibilité** des pièces sur tous les arrière-plans
- ✅ **Distinction claire** entre les différents états (sélection, dernier coup)

#### Recommandations

- **Thème Nuit** : Idéal pour jouer dans l'obscurité
- **Thème Minimaliste** : Meilleur contraste pour la concentration
- **Thème Tournoi** : Style professionnel pour les parties sérieuses

### 🆕 Ajouter votre propre thème

Les développeurs peuvent facilement ajouter de nouveaux thèmes en modifiant le fichier `lib/chess-themes.ts` :

```typescript
{
  id: "mon-theme",
  name: "Mon Thème",
  lightSquare: "#ffffff",
  darkSquare: "#000000",
  selectedLight: "#e8e8e8",
  selectedDark: "#333333",
  lastMoveLight: "#d0d0d0",
  lastMoveDark: "#222222",
}
```

### 🎯 Cas d'usage

#### Parties longues

Utilisez le **thème Nuit** pour réduire la fatigue oculaire lors de parties longues en soirée.

#### Tournois

Le **thème Tournoi** ou **Classique** offre un look professionnel adapté aux compétitions.

#### Débutants

Les thèmes avec **fort contraste** (Minimaliste, Océan) facilitent la distinction des cases.

#### Esthétique

Choisissez selon vos préférences personnelles : tons chauds (Bois, Corail) ou froids (Océan, Marine).

### 📊 Statistiques

- **16 thèmes** au total
- **96 couleurs** uniques définies
- **Sauvegarde locale** : Pas de serveur requis
- **Changement instantané** : 0 latence

### 💡 Astuces

1. **Testez plusieurs thèmes** avant de choisir votre favori
2. **Changez selon l'heure** : Thème clair le jour, sombre la nuit
3. **Adaptez à votre écran** : Certains thèmes rendent mieux sur certains types d'écrans
4. **Parties rapides** : Privilégiez les thèmes à fort contraste

### 🔮 Fonctionnalités futures

Fonctionnalités envisagées pour les prochaines versions :

- [ ] **Thèmes personnalisés** : Créer vos propres palettes
- [ ] **Import/Export** : Partager vos thèmes avec d'autres joueurs
- [ ] **Thèmes saisonniers** : Thèmes automatiques selon la saison
- [ ] **Mode auto** : Thème clair le jour, sombre la nuit (automatique)
- [ ] **Thèmes animés** : Transitions douces entre les couleurs
- [ ] **Galerie communautaire** : Partage de thèmes créés par la communauté

---

**Note :** Tous les thèmes respectent les normes d'accessibilité WCAG 2.1 niveau AA pour le contraste des couleurs.

**Bon jeu ! 🎨♟️**

---

<a name="english-version"></a>

## English Version

The chess game offers **16 pre-defined color themes** to customize the board's appearance according to your preferences.

### 📚 Available Themes

#### Classic

The default theme, inspired by chess.com with green tones.

- Light squares: Light beige
- Dark squares: Olive green

#### Wood

Warm tones reminiscent of a natural wood board.

- Light squares: Golden beige
- Dark squares: Wood brown

#### Ocean

Soothing blue palette.

- Light squares: Light bluish gray
- Dark squares: Slate blue

#### Forest

Natural and bright green tones.

- Light squares: Pale yellow
- Dark squares: Fir green

#### Amethyst

Elegant purple hues.

- Light squares: Pale lavender
- Dark squares: Amethyst violet

#### Minimalist

Clean black and white design.

- Light squares: Pure white
- Dark squares: Medium gray

#### Night

Dark mode for playing in the dark.

- Light squares: Dark gray
- Dark squares: Charcoal black

#### Coral

Warm orange-toned palette.

- Light squares: Light peach
- Dark squares: Coral

#### Marine

Deep blues reminiscent of the sea.

- Light squares: Bluish gray
- Dark squares: Navy blue

#### Mahogany

Rich, dark wood tones.

- Light squares: Sand beige
- Dark squares: Mahogany

#### Pink

Soft and feminine hues.

- Light squares: Pale pink
- Dark squares: Powder pink

#### Mint

Fresh and light green tones.

- Light squares: Light mint green
- Dark squares: Mint green

#### Burgundy

Elegant dark red palette.

- Light squares: Rosy beige
- Dark squares: Burgundy

#### Sand

Warm desert tones.

- Light squares: Light sand beige
- Dark squares: Golden sand

#### Tournament

Professional style with bright blue.

- Light squares: Off-white
- Dark squares: Royal blue

#### Marble

Natural stone appearance.

- Light squares: Off-white
- Dark squares: Stone gray

### 🎯 How to Change Theme

1. **During a game**, click the **"Theme: [Current Name]"** button
2. A dialog opens with **all available themes**
3. **Preview** each theme with a mini board
4. **Click** on your preferred theme
5. The theme is **applied instantly**

### 💾 Automatic Saving

Your theme choice is **automatically saved** in your browser (localStorage). On your next visit, your chosen theme will be restored.

### 🎨 Technical Details

Each theme includes **6 colors**:

1. **Light square**: Base color for white squares
2. **Dark square**: Base color for black squares
3. **Light selection**: Highlight for selected light squares
4. **Dark selection**: Highlight for selected dark squares
5. **Light last move**: Last move indication (light squares)
6. **Dark last move**: Last move indication (dark squares)

#### Check Color

The check color (red) is **identical for all themes** to ensure maximum visibility during a critical situation.

### 📱 Responsive

All themes are **optimized** for:

- 💻 **Desktop**: Full display with details
- 📱 **Mobile**: Touch-adapted interface
- 🖥️ **Tablet**: Balanced experience

### ♿ Accessibility

Themes were designed with accessibility in mind:

- ✅ **High contrast** between light and dark squares
- ✅ **Readability** of coordinates (a-h, 1-8)
- ✅ **Visibility** of pieces on all backgrounds
- ✅ **Clear distinction** between different states (selection, last move)

#### Recommendations

- **Night Theme**: Ideal for playing in the dark
- **Minimalist Theme**: Best contrast for concentration
- **Tournament Theme**: Professional style for serious games

### 🆕 Adding Your Own Theme

Developers can easily add new themes by modifying the `lib/chess-themes.ts` file:

```typescript
{
  id: "my-theme",
  name: "My Theme",
  lightSquare: "#ffffff",
  darkSquare: "#000000",
  selectedLight: "#e8e8e8",
  selectedDark: "#333333",
  lastMoveLight: "#d0d0d0",
  lastMoveDark: "#222222",
}
```

### 🎯 Use Cases

#### Long Games

Use the **Night theme** to reduce eye strain during long evening games.

#### Tournaments

The **Tournament** or **Classic** theme offers a professional look suitable for competitions.

#### Beginners

Themes with **high contrast** (Minimalist, Ocean) make square distinction easier.

#### Aesthetics

Choose according to your personal preferences: warm tones (Wood, Coral) or cool tones (Ocean, Marine).

### 📊 Statistics

- **16 themes** total
- **96 unique colors** defined
- **Local saving**: No server required
- **Instant change**: 0 latency

### 💡 Tips

1. **Test several themes** before choosing your favorite
2. **Change by time**: Light theme during day, dark at night
3. **Adapt to your screen**: Some themes render better on certain screen types
4. **Fast games**: Prefer high-contrast themes

### 🔮 Future Features

Features considered for future versions:

- [ ] **Custom themes**: Create your own palettes
- [ ] **Import/Export**: Share your themes with other players
- [ ] **Seasonal themes**: Automatic themes according to season
- [ ] **Auto mode**: Light theme during day, dark at night (automatic)
- [ ] **Animated themes**: Smooth transitions between colors
- [ ] **Community gallery**: Share themes created by the community

---

**Note:** All themes comply with WCAG 2.1 Level AA accessibility standards for color contrast.

**Enjoy! 🎨♟️**
