# BIP Timer : brief de design

## Le produit

Un minuteur d'entraînement par intervalles, dans l'esprit du minuteur HIIT de Litobox, mais capable
de décrire un bloc complet de l'app bip : plusieurs exercices, plusieurs tours, et des temps de
récupération distincts entre les exercices et entre les tours.

C'est une page web installable (PWA) : on l'ouvre depuis un lien, on l'ajoute à l'écran d'accueil,
et elle marche ensuite hors ligne, sans passer par un store. Elle garde l'écran allumé et émet des
bips pendant la séance.

La promesse tient en une phrase : **réglé en dix secondes, lancé en un tap.**

## Le contexte d'usage

Il commande toutes les décisions.

- En extérieur, en plein jour, ou dans une salle.
- Le téléphone est posé par terre ou sur un banc, à un ou deux mètres, ou tenu à bout de bras.
- La personne est essoufflée, en sueur, et n'a souvent qu'une main de libre.
- Pendant la séance, elle ne lit pas : elle jette un coup d'œil. La phase en cours doit se
  reconnaître à la couleur avant même qu'on lise un mot.

## Trois écrans

### 1. Réglage

Tout tient sur un écran, sans défilement sur un téléphone courant. L'écran se souvient du dernier
réglage.

- **Structure** : Circuit (on enchaîne tous les exercices, puis on recommence) ou Par séries (toutes
  les séries d'un exercice, puis le suivant). Un contrôle segmenté à deux choix.
- **Unité** : Temps (le chrono passe seul) ou Répétitions (l'écran attend une validation). Un
  contrôle segmenté à deux choix.
- **Nombre d'exercices** : de 1 à 30.
- **Nombre de tours** en circuit, **de séries** en séries : de 1 à 99.
- **Préparation** : le décompte avant le premier effort, en secondes.
- **Effort** en secondes, ou **répétitions** si l'unité est Répétitions.
- **Récupération entre exercices**, en secondes. Masquée s'il n'y a qu'un exercice.
- **Récupération entre tours** en circuit, **entre séries** en séries. Jamais les deux à la fois.
- **Son** : activé ou coupé.

Chaque valeur numérique se règle au pouce avec un moins et un plus bien espacés, pas au clavier.
Une valeur à zéro fait disparaître l'étape correspondante.

En bas de l'écran, toujours visible : le résumé calculé en direct (par exemple « 24 étapes ·
13 min ») et un grand bouton **Démarrer**, la seule action orange de l'écran.

### 2. Séance

L'écran qui porte le produit.

- **Le temps restant domine**, lisible à deux ou trois mètres : chiffres très grands et à chasse
  fixe, pour que « 0:09 » ne bouge pas quand il devient « 0:08 ».
- **La phase se voit à la couleur**, bord à bord : préparation en jaune, effort en blanc cassé,
  récupération en vert. Une bande de couleur en haut de l'écran et une jauge qui se vide au fil du
  temps restant. Le nom de la phase est écrit, mais on ne devrait pas avoir besoin de le lire.
- **Où on en est** : « Exercice 2 / 4 » et « Tour 1 / 3 », avec une petite frise des tours.
- **Ce qui vient ensuite**, sur une ligne : « Ensuite : exercice 3 », ou « Dernier effort ».
- **Trois commandes au pouce**, en bas : Précédent, Pause (au centre, la plus grande, en orange),
  Suivant. En mode Répétitions, pendant un effort, le bouton central devient **Valider** et le
  chiffre affiché est le nombre de répétitions au lieu d'un temps.
- **Quitter** en haut, discret, qui demande une confirmation. Avancer d'une étape n'en demande
  jamais.
- En pause, tout le contenu s'estompe et le bouton central devient **Reprendre**.

### 3. Fin

- « Terminé », la durée réelle de la séance et la durée prévue à côté.
- Deux actions : **Recommencer** (même réglage) et **Réglages**.

## Le langage visuel à reprendre de bip

- **Sombre par défaut.** Fond presque noir `#0E0D0B`, surfaces `#1C1A14`, texte `#EAE6DD`, texte
  secondaire `#B4AEA3`, filets `rgba(234, 230, 221, 0.24)`.
- **La loi des couleurs, sans exception** : l'orange `#C2481C` est ce qu'on touche pour avancer, le
  jaune `#D9A227` est de l'information et jamais un bouton, le blanc cassé `#F2EFE8` remplit ce qui
  est sélectionné, le presque noir est l'espace. Couleurs de phase : préparation `#D9A227`, effort
  `#F5F2EA`, récupération `#4FA37A`.
- **Typographie** : Saira Condensed en gras pour les chiffres et les titres, en capitales ; IBM Plex
  Mono pour les étiquettes, en capitales espacées ; Archivo pour le texte courant.
- **Formes** : angles droits partout, bordures d'un pixel, jamais d'ombre ni de coin arrondi. Les
  contrôles segmentés sont des cellules séparées par des filets fins. L'outil doit se lire comme un
  instrument, pas comme une app de fitness colorée.
- Zones tactiles de 44 × 44 points au minimum partout, bien plus grandes pour les trois commandes de
  la séance.
- Contraste d'au moins 4,5:1 pour tout texte, y compris sur les couleurs de phase.

## Ce qu'il ne faut pas concevoir

Pas de compte, pas de bibliothèque d'exercices, pas d'exercices nommés, pas d'historique, pas de
statistiques. Un seul réglage, celui qui est à l'écran.

## Ce que j'attends

Des écrans mobiles au format iPhone (390 × 844) pour les trois écrans, avec les états qui comptent :

- le réglage en Circuit et en Par séries, pour voir le champ de récupération qui change ;
- la séance dans chacune des trois phases (préparation, effort, récupération) ;
- la séance en mode Répétitions, avec le bouton Valider ;
- la séance en pause ;
- la confirmation de sortie ;
- l'écran de fin.

Un prototype cliquable qui enchaîne réglage, séance et fin serait un plus.
