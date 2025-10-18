# Règles des Échecs

Ce document décrit toutes les règles du jeu d'échecs implémentées dans cette application, conformes aux règles officielles de la FIDE (Fédération Internationale des Échecs).

## Table des matières

1. [Configuration initiale](#configuration-initiale)
2. [Mouvements des pièces](#mouvements-des-pièces)
3. [Règles spéciales](#règles-spéciales)
4. [Fin de partie](#fin-de-partie)
5. [Règles de nulle](#règles-de-nulle)

## Configuration initiale

### L'échiquier

- L'échiquier est composé de 64 cases (8x8) alternant entre cases claires et foncées
- Chaque joueur doit avoir une case blanche dans son coin inférieur droit
- Les colonnes sont nommées de a à h (de gauche à droite)
- Les rangées sont numérotées de 1 à 8 (de bas en haut pour les Blancs)

### Position des pièces

Chaque joueur commence avec 16 pièces :

**Pièces blanches (rangée 1 et 2) :**

- 1ère rangée : Tour, Cavalier, Fou, Dame, Roi, Fou, Cavalier, Tour
- 2ème rangée : 8 Pions

**Pièces noires (rangée 7 et 8) :**

- 8ème rangée : Tour, Cavalier, Fou, Dame, Roi, Fou, Cavalier, Tour
- 7ème rangée : 8 Pions

**Note importante :** La Dame blanche commence sur une case blanche, la Dame noire sur une case noire.

## Mouvements des pièces

### Le Roi ♔ ♚

- Se déplace d'une seule case dans n'importe quelle direction (horizontale, verticale, diagonale)
- Ne peut pas se déplacer sur une case attaquée par une pièce adverse
- Ne peut jamais se mettre en échec

### La Dame (Reine) ♕ ♛

- Se déplace de n'importe quel nombre de cases
- Peut se déplacer horizontalement, verticalement ou en diagonale
- Ne peut pas sauter par-dessus d'autres pièces

### La Tour ♖ ♜

- Se déplace de n'importe quel nombre de cases
- Peut se déplacer horizontalement ou verticalement
- Ne peut pas sauter par-dessus d'autres pièces

### Le Fou ♗ ♝

- Se déplace de n'importe quel nombre de cases en diagonale
- Ne peut pas sauter par-dessus d'autres pièces
- Reste toujours sur la même couleur de case (claire ou foncée)

### Le Cavalier ♘ ♞

- Se déplace en forme de "L" : 2 cases dans une direction + 1 case perpendiculairement
- C'est la seule pièce qui peut sauter par-dessus d'autres pièces

### Le Pion ♙ ♟

**Mouvement normal :**

- Avance d'une case vers l'avant (ne recule jamais)
- Lors de son premier mouvement, peut avancer de 2 cases
- Ne peut avancer que si la case devant est libre

**Capture :**

- Capture en diagonale (une case en avant et une case sur le côté)
- Ne peut capturer qu'une pièce adverse

## Règles spéciales

### Le Roque

Le roque est un mouvement spécial impliquant le Roi et une Tour.

**Conditions pour roquer :**

- Le Roi et la Tour concernée n'ont pas encore bougé
- Aucune pièce ne se trouve entre le Roi et la Tour
- Le Roi n'est pas en échec
- Le Roi ne traverse pas une case attaquée
- Le Roi n'arrive pas sur une case attaquée

**Types de roque :**

**Petit roque (côté Roi) :**

- Le Roi se déplace de 2 cases vers la droite
- La Tour se déplace de 2 cases vers la gauche et se place à côté du Roi

**Grand roque (côté Dame) :**

- Le Roi se déplace de 2 cases vers la gauche
- La Tour se déplace de 3 cases vers la droite et se place à côté du Roi

### La Prise en Passant

Règle spéciale de capture pour les pions :

**Conditions :**

- Un pion adverse avance de 2 cases depuis sa position initiale
- Il se retrouve à côté de votre pion (sur la même rangée)
- Vous pouvez capturer ce pion "en passant" immédiatement au coup suivant
- Votre pion se déplace en diagonale comme pour une capture normale
- Le pion adverse est retiré de l'échiquier

**Important :** Cette capture doit être effectuée immédiatement, sinon l'opportunité est perdue.

### La Promotion du Pion

**Quand un pion atteint la dernière rangée adverse :**

- Il doit être immédiatement promu en une autre pièce
- Le joueur peut choisir : Dame, Tour, Fou ou Cavalier
- La pièce choisie remplace le pion
- Le choix le plus courant est la Dame (la pièce la plus puissante)
- Il n'y a pas de limite au nombre de Dames ou autres pièces qu'un joueur peut avoir

## Fin de partie

### Échec

- Le Roi est en échec quand il est attaqué par une pièce adverse
- Quand un joueur est en échec, il DOIT sortir de l'échec à son prochain coup
- Il y a trois façons de sortir de l'échec :
  1. Déplacer le Roi sur une case non attaquée
  2. Bloquer l'attaque avec une autre pièce
  3. Capturer la pièce qui donne l'échec

### Échec et Mat

- Si un joueur est en échec et ne peut pas sortir de l'échec, c'est échec et mat
- La partie est terminée et le joueur en échec et mat perd
- L'adversaire gagne la partie

### Pat (Stalemate)

- Un joueur est en pat quand :
  - Ce n'est pas en échec
  - Il n'a aucun mouvement légal disponible
- Le pat entraîne une partie nulle (match nul)

### Abandon

- Un joueur peut abandonner à tout moment
- L'adversaire est déclaré vainqueur

## Règles de nulle

Une partie peut être nulle dans plusieurs situations :

### 1. Accord Mutuel

- Les deux joueurs peuvent s'entendre pour faire nulle à tout moment

### 2. Répétition de Position (Triple Répétition)

- Si la même position se répète 3 fois avec le même joueur au trait
- La position doit être identique (mêmes pièces aux mêmes endroits)
- Les droits de roque et de prise en passant doivent aussi être identiques

### 3. Règle des 50 Coups

- Si 50 coups consécutifs (par les deux joueurs) sont joués sans :
  - Aucune capture de pièce
  - Aucun mouvement de pion
- Un joueur peut réclamer la nulle
- Dans cette application, la nulle est automatiquement déclarée après 50 coups

### 4. Matériel Insuffisant

La partie est automatiquement nulle s'il est impossible de mater avec le matériel restant :

**Cas de matériel insuffisant :**

- Roi contre Roi
- Roi + Fou contre Roi
- Roi + Cavalier contre Roi
- Roi + Fou contre Roi + Fou (avec les deux Fous sur la même couleur de cases)

## Notation et Conseils

### Comment jouer dans cette application

1. **Sélectionner une pièce :** Cliquez sur une de vos pièces
2. **Voir les mouvements possibles :** Des indicateurs apparaissent sur les cases valides
3. **Déplacer :** Cliquez sur une case valide pour y déplacer votre pièce
4. **Annuler la sélection :** Cliquez à nouveau sur la pièce sélectionnée

### Indicateurs visuels

- **Cases jaunes :** Dernière pièce jouée (départ et arrivée)
- **Case rouge :** Roi en échec
- **Cercles gris :** Mouvements possibles pour la pièce sélectionnée
- **Cercle complet :** Indique une capture possible

### Contrôles disponibles

- **Nouvelle partie :** Recommencer une partie
- **Abandonner :** Déclarer forfait (l'adversaire gagne)
- **Proposer nulle :** Proposer un match nul (les deux joueurs doivent accepter)

## Stratégie de base

Quelques conseils pour bien jouer :

1. **Contrôlez le centre** : Les pièces au centre de l'échiquier ont plus de mobilité
2. **Développez vos pièces** : Sortez vos Cavaliers et Fous rapidement
3. **Protégez votre Roi** : Pensez au roque pour mettre votre Roi en sécurité
4. **Ne perdez pas de pièces gratuitement** : Chaque pièce a de la valeur
5. **Réfléchissez avant de jouer** : Vérifiez toujours si votre coup expose votre Roi

### Valeur approximative des pièces

- Pion = 1 point
- Cavalier = 3 points
- Fou = 3 points
- Tour = 5 points
- Dame = 9 points
- Roi = inestimable (sa perte signifie la défaite)

---

**Bon jeu ! ♟️**
