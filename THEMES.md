# 🎨 Thèmes de Couleurs

Le jeu d'échecs propose **16 thèmes de couleurs** pré-définis pour personnaliser l'apparence de l'échiquier selon vos préférences.

## 📚 Thèmes disponibles

### Classique

Le thème par défaut, inspiré de chess.com avec des tons verts.

- Cases claires : Beige clair
- Cases foncées : Vert olive

### Bois

Tons chauds rappelant un échiquier en bois naturel.

- Cases claires : Beige doré
- Cases foncées : Marron bois

### Océan

Palette de bleus apaisants.

- Cases claires : Gris clair bleuté
- Cases foncées : Bleu ardoise

### Forêt

Tons verts naturels et lumineux.

- Cases claires : Jaune pâle
- Cases foncées : Vert sapin

### Améthyste

Teintes violettes élégantes.

- Cases claires : Lavande pâle
- Cases foncées : Violet améthyste

### Minimaliste

Design épuré en noir et blanc.

- Cases claires : Blanc pur
- Cases foncées : Gris moyen

### Nuit

Mode sombre pour jouer dans l'obscurité.

- Cases claires : Gris foncé
- Cases foncées : Noir charbon

### Corail

Palette chaleureuse aux tons orangés.

- Cases claires : Pêche clair
- Cases foncées : Corail

### Marine

Bleus profonds rappelant la mer.

- Cases claires : Gris bleuté
- Cases foncées : Bleu marine

### Acajou

Tons bois foncés et riches.

- Cases claires : Beige sable
- Cases foncées : Acajou

### Rose

Teintes douces et féminines.

- Cases claires : Rose pâle
- Cases foncées : Rose poudré

### Menthe

Tons verts frais et légers.

- Cases claires : Vert menthe clair
- Cases foncées : Vert menthe

### Bordeaux

Palette élégante rouge foncé.

- Cases claires : Beige rosé
- Cases foncées : Bordeaux

### Sable

Tons désertiques chaleureux.

- Cases claires : Beige sable clair
- Cases foncées : Sable doré

### Tournoi

Style professionnel avec bleu vif.

- Cases claires : Blanc cassé
- Cases foncées : Bleu royal

### Marbre

Aspect pierre naturelle.

- Cases claires : Blanc cassé
- Cases foncées : Gris pierre

## 🎯 Comment changer de thème

1. **Pendant une partie**, cliquez sur le bouton **"Thème : [Nom actuel]"**
2. Un dialogue s'ouvre avec **tous les thèmes disponibles**
3. **Prévisualisez** chaque thème avec un mini-échiquier
4. **Cliquez** sur le thème de votre choix
5. Le thème est **appliqué instantanément**

## 💾 Sauvegarde automatique

Votre choix de thème est **automatiquement sauvegardé** dans votre navigateur (localStorage). Lors de votre prochaine visite, le thème que vous avez choisi sera restauré.

## 🎨 Détails techniques

Chaque thème comprend **6 couleurs** :

1. **Case claire** : Couleur de base pour les cases blanches
2. **Case foncée** : Couleur de base pour les cases noires
3. **Sélection claire** : Surbrillance des cases claires sélectionnées
4. **Sélection foncée** : Surbrillance des cases foncées sélectionnées
5. **Dernier coup clair** : Indication du dernier coup (cases claires)
6. **Dernier coup foncé** : Indication du dernier coup (cases foncées)

### Couleur d'échec

La couleur d'échec (rouge) est **identique pour tous les thèmes** afin de garantir une visibilité maximale lors d'une situation critique.

## 📱 Responsive

Tous les thèmes sont **optimisés** pour :

- 💻 **Desktop** : Affichage complet avec détails
- 📱 **Mobile** : Interface adaptée tactile
- 🖥️ **Tablette** : Expérience équilibrée

## ♿ Accessibilité

Les thèmes ont été conçus avec l'accessibilité en tête :

- ✅ **Contraste élevé** entre cases claires et foncées
- ✅ **Lisibilité** des coordonnées (a-h, 1-8)
- ✅ **Visibilité** des pièces sur tous les arrière-plans
- ✅ **Distinction claire** entre les différents états (sélection, dernier coup)

### Recommandations

- **Thème Nuit** : Idéal pour jouer dans l'obscurité
- **Thème Minimaliste** : Meilleur contraste pour la concentration
- **Thème Tournoi** : Style professionnel pour les parties sérieuses

## 🆕 Ajouter votre propre thème

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

## 🎯 Cas d'usage

### Parties longues

Utilisez le **thème Nuit** pour réduire la fatigue oculaire lors de parties longues en soirée.

### Tournois

Le **thème Tournoi** ou **Classique** offre un look professionnel adapté aux compétitions.

### Débutants

Les thèmes avec **fort contraste** (Minimaliste, Océan) facilitent la distinction des cases.

### Esthétique

Choisissez selon vos préférences personnelles : tons chauds (Bois, Corail) ou froids (Océan, Marine).

## 📊 Statistiques

- **16 thèmes** au total
- **96 couleurs** uniques définies
- **Sauvegarde locale** : Pas de serveur requis
- **Changement instantané** : 0 latence

## 💡 Astuces

1. **Testez plusieurs thèmes** avant de choisir votre favori
2. **Changez selon l'heure** : Thème clair le jour, sombre la nuit
3. **Adaptez à votre écran** : Certains thèmes rendent mieux sur certains types d'écrans
4. **Parties rapides** : Privilégiez les thèmes à fort contraste

## 🔮 Fonctionnalités futures

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
