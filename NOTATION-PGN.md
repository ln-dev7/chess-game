# Notation PGN (Portable Game Notation)

Ce document explique le format PGN utilisé pour exporter et importer les parties d'échecs.

## Qu'est-ce que le PGN ?

Le **PGN (Portable Game Notation)** est le format standard FIDE (et universel dans le monde des échecs) pour enregistrer, échanger et importer/exporter des parties d'échecs.

C'est un simple fichier texte (.pgn) qui contient :

- Les métadonnées (joueurs, date, résultat, événement, etc.)
- La liste des coups (en notation algébrique standard)

Le format a été défini par Steven J. Edwards en 1993, et adopté par la FIDE et toutes les grandes plateformes (Chess.com, Lichess, ICC, etc.) comme norme de facto.

## Structure d'un fichier PGN

Un fichier PGN contient deux parties principales :

### 1. Les en-têtes (Tags)

Encadrés entre crochets `[]`, ils décrivent le contexte de la partie.

**Exemple :**

```
[Event "World Championship"]
[Site "Dubai UAE"]
[Date "2021.12.12"]
[Round "6"]
[White "Carlsen, Magnus"]
[Black "Nepomniachtchi, Ian"]
[Result "1-0"]
```

**Tags obligatoires définis par la FIDE :**

| Tag    | Signification                                    |
| ------ | ------------------------------------------------ |
| Event  | Nom du tournoi ou match                          |
| Site   | Lieu (ville, pays ou plateforme en ligne)        |
| Date   | Date au format AAAA.MM.JJ                        |
| Round  | Numéro de ronde                                  |
| White  | Nom du joueur des Blancs                         |
| Black  | Nom du joueur des Noirs                          |
| Result | Résultat de la partie (1-0, 0-1, 1/2-1/2, ou \*) |

**Tags optionnels fréquents :**

- `[ECO "C42"]` - Code d'ouverture
- `[Opening "Petrov Defense"]` - Nom de l'ouverture
- `[TimeControl "90+30"]` - Cadence de jeu
- `[Termination "Normal"]` - Type de fin de partie
- `[Annotator "GM X"]` - Annotateur

### 2. La notation des coups

La partie est listée en **notation algébrique standard**.

**Exemple :**

```
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7
6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
```

À la fin, le résultat est répété :

- `1-0` : Victoire des Blancs
- `0-1` : Victoire des Noirs
- `1/2-1/2` : Partie nulle
- `*` : Partie en cours

## Notation algébrique standard

### Notation des pièces

Pour les pièces (notation anglaise FIDE) :

| Pièce             | Lettre            |
| ----------------- | ----------------- |
| Roi (King)        | K                 |
| Dame (Queen)      | Q                 |
| Tour (Rook)       | R                 |
| Fou (Bishop)      | B                 |
| Cavalier (Knight) | N                 |
| Pion (Pawn)       | _(aucune lettre)_ |

**Note :** On utilise `N` pour le cavalier (knight) pour éviter la confusion avec le roi `K`.

### Coordonnées des cases

Chaque case est identifiée par une lettre (colonne) + un chiffre (rangée) :

- **Colonnes** : de `a` à `h` (de gauche à droite pour les Blancs)
- **Rangées** : de `1` à `8` (de bas en haut pour les Blancs)

**Exemples :** `e4`, `d5`, `h1`, `a8`

### Format d'un coup

#### Mouvement simple

```
[Lettre de pièce][case de destination]
```

**Exemples :**

- `Nf3` : cavalier va en f3
- `e4` : pion va en e4 (pas de lettre pour les pions)

#### Capture

On insère `x` avant la case de destination :

**Exemples :**

- `Bxe5` : fou capture en e5
- `exd5` : pion de la colonne e capture en d5

#### Promotion du pion

Quand un pion atteint la dernière rangée :

```
[case]=Pièce
```

**Exemples :**

- `e8=Q` : pion promu en dame
- `dxe8=R` : pion capture et promeut en tour

#### Roque

- **Petit roque** (côté roi) : `O-O`
- **Grand roque** (côté dame) : `O-O-O`

#### Prise en passant

La notation suit les règles normales de capture, avec mention optionnelle :

```
exd6 e.p.
```

#### Échec et échec et mat

- `+` : Échec
- `#` : Échec et mat

**Exemples :**

- `Qh5+` : dame en h5, échec
- `Qxf7#` : dame capture en f7, échec et mat

### Désambiguïsation

Quand deux pièces identiques peuvent aller à la même case, on précise :

1. **La colonne de départ** (si cela suffit) : `Ngf3`
2. **La rangée de départ** (si nécessaire) : `N1f3`
3. **Colonne et rangée** (en dernier recours) : `Ng1f3`

## Exemple complet de fichier PGN

```pgn
[Event "Partie locale"]
[Site "chess-game"]
[Date "2025.10.18"]
[Round "1"]
[White "Joueur 1 (Blancs)"]
[Black "Joueur 2 (Noirs)"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7
6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
11. c4 c6 12. Nc3 Qc7 13. Bg5 h6 14. Bh4 Re8 15. Rc1 Bf8
16. cxb5 axb5 17. Nxb5 Qb8 18. Nc3 Ba6 19. dxe5 dxe5
20. Na4 Bb5 21. Nc3 Ba6 22. Nd5 cxd5 23. Bxf6 Nxf6
24. exd5 e4 25. Nd4 Qf4 26. Re3 Bd6 27. g3 Qg5 28. Rc6 Rad8
29. Rxa6 Bxg3 30. Rxg3 Qh4 31. Nf5 1-0
```

## Utilisation dans l'application

### Exporter une partie

1. Jouez une partie d'échecs
2. Cliquez sur le bouton **"Exporter PGN"**
3. **L'aperçu du PGN s'affiche automatiquement** avec les métadonnées par défaut
4. **Personnalisez les métadonnées en temps réel** :
   - Nom de l'événement
   - Lieu
   - Noms des joueurs
   - Numéro de ronde
   - L'aperçu se met à jour automatiquement à chaque modification
5. **Deux options pour exporter** :
   - 📋 **Copier** : Copie le PGN dans le presse-papiers
   - 💾 **Télécharger** : Sauvegarde un fichier `.pgn`

Le fichier sera téléchargé avec un nom automatique : `chess_YYYY-MM-DD_HH-MM-SS.pgn`

### Importer une partie (à venir)

La fonctionnalité d'import PGN pourra être ajoutée dans une future version. Elle permettra de :

- Charger des parties depuis un fichier .pgn
- Rejouer les coups pas à pas
- Analyser des parties célèbres
- Continuer une partie sauvegardée

## Avantages du format PGN

✅ **Lisible par l'humain** : Format texte simple  
✅ **Universel** : Compatible avec tous les logiciels d'échecs  
✅ **Compact** : Taille de fichier minimale  
✅ **Standardisé** : Norme FIDE officielle  
✅ **Extensible** : Peut contenir des annotations et commentaires

## Utilisation avec d'autres logiciels

Les fichiers PGN exportés peuvent être ouverts dans :

- **ChessBase** - Logiciel professionnel d'analyse
- **Lichess** - Import/export gratuit en ligne
- **Chess.com** - Analyse de parties
- **Arena** - Interface pour moteurs d'échecs
- **Scid** - Base de données d'échecs
- **PyChess** - Client d'échecs open source
- **Et tous les autres logiciels d'échecs modernes**

## Références

- **FIDE Handbook** : [Standards for Chess Equipment and Venues](https://handbook.fide.com/)
- **PGN Specification** : Standard de Steven J. Edwards (1993)
- **Wikipedia** : [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation)

## Format FEN (bonus)

Le format **FEN (Forsyth-Edwards Notation)** est complémentaire au PGN. Il décrit une position unique d'échecs, plutôt qu'une partie complète.

**Exemple de position initiale :**

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

Ce format peut être ajouté dans une future version pour sauvegarder/charger des positions spécifiques.

---

**Note :** Cette implémentation suit les standards FIDE pour la notation algébrique et le format PGN. Pour plus de détails sur les règles, consultez le [Handbook FIDE officiel](https://handbook.fide.com/).
