// The format pages: one ready-made block per common way of training, each with its own address,
// wording and text in every language. The generator turns each into a page.

export const PRESETS_LABEL = {
  fr: 'FORMATS PRÊTS À L’EMPLOI',
  en: 'READY-MADE FORMATS',
  nl: 'KANT-EN-KLARE FORMATS',
};

export const FREE_SETUP_LABEL = {
  fr: 'Réglage libre',
  en: 'Free setup',
  nl: 'Vrije instelling',
};

// The short names of the quick picker above the setup, the free setup first.
export const PICKER_LABEL = { fr: 'MODÈLES', en: 'TEMPLATES', nl: 'SJABLONEN' };

export const FREE_CHIP = { fr: 'Libre', en: 'Free', nl: 'Vrij' };

export const PRESETS = [
  {
    settings: { structure: 'circuit', unit: 'time', exercises: 1, rounds: 8, prep: 10, effort: 20, recRound: 10 },
    fr: {
      slug: 'minuteur-tabata',
      chip: 'Tabata',
      heading: 'Minuteur Tabata',
      question: 'Qu’est-ce que le Tabata ?',
      title: 'Minuteur Tabata gratuit : 8 tours de 20 s / 10 s · BIP Timer',
      description:
        'Minuteur Tabata prêt à l’emploi : 8 tours de 20 s d’effort et 10 s de repos, avec bips et couleurs lisibles de loin. Gratuit, sans installation.',
      intro: 'Déjà réglé pour un Tabata : 8 tours de 20 s d’effort et 10 s de repos. Démarre, ou ajuste avant.',
      body: [
        'Le Tabata est un format de fractionné très court : 20 secondes d’effort maximal, 10 secondes de repos, répétées 8 fois. Quatre minutes suffisent, à condition de tout donner pendant chaque effort.',
        'Ici, c’est un circuit d’un seul exercice : 8 tours, 20 s d’effort et 10 s de récupération entre les tours, après 10 s de préparation. Les 3 dernières secondes de chaque phase sont bipées, et l’écran passe du blanc (effort) au vert (repos) pour se lire de loin.',
        'Pour un Tabata à plusieurs exercices, augmente le nombre d’exercices : le minuteur fait 20 s sur chacun à la suite, puis recommence. Mets une récupération plus longue entre les tours pour souffler entre deux blocs.',
      ],
    },
    en: {
      slug: 'tabata-timer',
      chip: 'Tabata',
      heading: 'Tabata timer',
      question: 'What is Tabata?',
      title: 'Free Tabata timer: 8 rounds of 20 s / 10 s · BIP Timer',
      description:
        'Ready-made Tabata timer: 8 rounds of 20 s work and 10 s rest, with beeps and colours you can read from afar. Free, no install.',
      intro: 'Already set for Tabata: 8 rounds of 20 s work and 10 s rest. Start, or adjust first.',
      body: [
        'Tabata is a very short interval format: 20 seconds of all-out work, 10 seconds of rest, repeated 8 times. Four minutes are enough, as long as you give everything during each effort.',
        'Here it is a circuit of a single exercise: 8 rounds, 20 s of work and 10 s of rest between rounds, after 10 s to get ready. The last 3 seconds of each phase beep, and the screen turns from white (work) to green (rest) so you can read it from across the room.',
        'For a Tabata with several exercises, raise the number of exercises: the timer runs 20 s on each in turn, then starts over. Set a longer rest between rounds to breathe between two blocks.',
      ],
    },
    nl: {
      slug: 'tabata-timer',
      chip: 'Tabata',
      heading: 'Tabata-timer',
      question: 'Wat is Tabata?',
      title: 'Gratis Tabata-timer: 8 rondes van 20 s / 10 s · BIP Timer',
      description:
        'Kant-en-klare Tabata-timer: 8 rondes van 20 s inspanning en 10 s rust, met piepjes en kleuren die je van ver leest. Gratis, zonder installatie.',
      intro: 'Al ingesteld voor Tabata: 8 rondes van 20 s inspanning en 10 s rust. Start, of pas eerst aan.',
      body: [
        'Tabata is een heel kort intervalformat: 20 seconden maximale inspanning, 10 seconden rust, 8 keer herhaald. Vier minuten volstaan, als je bij elke inspanning alles geeft.',
        'Hier is het een circuit met één oefening: 8 rondes, 20 s inspanning en 10 s rust tussen de rondes, na 10 s voorbereiding. De laatste 3 seconden van elke fase piepen, en het scherm gaat van wit (inspanning) naar groen (rust) zodat je het van ver leest.',
        'Voor een Tabata met meerdere oefeningen verhoog je het aantal oefeningen: de timer doet 20 s op elke oefening na elkaar en begint dan opnieuw. Zet een langere rust tussen de rondes om op adem te komen tussen twee blokken.',
      ],
    },
  },
  {
    settings: {
      structure: 'circuit',
      unit: 'time',
      exercises: 4,
      rounds: 3,
      prep: 10,
      effort: 40,
      recExercise: 20,
      recRound: 60,
    },
    fr: {
      slug: 'minuteur-hiit',
      chip: 'HIIT',
      heading: 'Minuteur HIIT',
      question: 'Qu’est-ce que le HIIT ?',
      title: 'Minuteur HIIT gratuit en ligne : circuit, tours et récupérations · BIP Timer',
      description:
        'Minuteur HIIT en ligne : plusieurs exercices, 40 s d’effort, 20 s entre exercices, 60 s entre tours. Bips, écran lisible de loin, gratuit et sans installation.',
      intro: 'Réglé pour un HIIT en circuit : 4 exercices, 3 tours, 40 s d’effort. Ajuste, puis démarre.',
      body: [
        'Le HIIT (High Intensity Interval Training) alterne des efforts intenses et des récupérations courtes. La plupart des minuteurs HIIT ne gèrent qu’un couple travail / repos ; ici, tu décris la séance entière, avec plusieurs exercices et une vraie pause entre les tours.',
        'Réglage de départ : 4 exercices enchaînés en circuit, 40 s d’effort chacun, 20 s pour changer d’exercice, 60 s de récupération à la fin de chaque tour, 3 tours. Environ 13 minutes, préparation comprise.',
        'Pour débuter, passe à 30 s d’effort. Pour corser, garde 40 s mais descends à 10 s entre exercices. Avec « Par exercice », donne plus de temps aux exercices les plus exigeants.',
      ],
    },
    en: {
      slug: 'hiit-timer',
      chip: 'HIIT',
      heading: 'HIIT timer',
      question: 'What is HIIT?',
      title: 'Free online HIIT timer: circuit, rounds and rests · BIP Timer',
      description:
        'Online HIIT timer: several exercises, 40 s work, 20 s between exercises, 60 s between rounds. Beeps, a screen you read from afar, free and no install.',
      intro: 'Set for a HIIT circuit: 4 exercises, 3 rounds, 40 s of work. Adjust, then start.',
      body: [
        'HIIT (High Intensity Interval Training) alternates hard efforts with short rests. Most HIIT timers only handle one work / rest pair; here you describe the whole session, with several exercises and a real break between rounds.',
        'Starting setup: 4 exercises in a circuit, 40 s of work each, 20 s to change exercise, 60 s of rest at the end of each round, 3 rounds. About 13 minutes, getting ready included.',
        'To start easier, go down to 30 s of work. To make it harder, keep 40 s but cut the change to 10 s. With “Per exercise”, give the toughest exercises more time.',
      ],
    },
    nl: {
      slug: 'hiit-timer',
      chip: 'HIIT',
      heading: 'HIIT-timer',
      question: 'Wat is HIIT?',
      title: 'Gratis online HIIT-timer: circuit, rondes en rust · BIP Timer',
      description:
        'Online HIIT-timer: meerdere oefeningen, 40 s inspanning, 20 s tussen oefeningen, 60 s tussen rondes. Piepjes, een scherm dat je van ver leest, gratis en zonder installatie.',
      intro: 'Ingesteld voor een HIIT-circuit: 4 oefeningen, 3 rondes, 40 s inspanning. Pas aan en start.',
      body: [
        'HIIT (High Intensity Interval Training) wisselt zware inspanningen af met korte rust. De meeste HIIT-timers kennen maar één paar werk / rust; hier beschrijf je de hele sessie, met meerdere oefeningen en een echte pauze tussen de rondes.',
        'Startinstelling: 4 oefeningen in een circuit, 40 s inspanning per oefening, 20 s om te wisselen, 60 s rust aan het einde van elke ronde, 3 rondes. Ongeveer 13 minuten, voorbereiding inbegrepen.',
        'Om rustiger te beginnen ga je naar 30 s inspanning. Voor meer uitdaging hou je 40 s maar verkort je de wissel tot 10 s. Met „Per oefening” geef je de zwaarste oefeningen meer tijd.',
      ],
    },
  },
  {
    settings: {
      structure: 'circuit',
      unit: 'time',
      exercises: 6,
      rounds: 3,
      prep: 10,
      effort: 45,
      recExercise: 15,
      recRound: 90,
    },
    fr: {
      slug: 'minuteur-circuit-training',
      chip: 'Circuit',
      heading: 'Minuteur circuit training',
      question: 'Qu’est-ce qu’un circuit training ?',
      title: 'Minuteur circuit training : plusieurs exercices et tours · BIP Timer',
      description:
        'Minuteur pour circuit training : jusqu’à 30 exercices, repos entre exercices et entre tours, durée propre à chaque exercice. Gratuit, dans le navigateur.',
      intro: 'Réglé pour un circuit training de 6 exercices, 3 tours, 45 s par exercice. Ajuste, puis démarre.',
      body: [
        'Un circuit training enchaîne plusieurs exercices, souvent sur des groupes musculaires différents, puis recommence la liste pour un nouveau tour. C’est le format idéal en groupe : chacun sait où il en est grâce à l’écran qui change de couleur.',
        'Réglage de départ : 6 exercices, 45 s d’effort, 15 s pour passer à l’exercice suivant, 90 s de récupération entre les tours, 3 tours. L’écran indique le numéro de l’exercice, le tour en cours et ce qui vient ensuite.',
        'Chaque exercice peut avoir sa propre durée avec « Par exercice » : 60 s pour le gainage, 30 s pour les burpees. Et si tu comptes des répétitions plutôt que du temps, passe l’unité en « Répétitions » : l’écran attend que tu valides chaque exercice.',
      ],
    },
    en: {
      slug: 'circuit-training-timer',
      chip: 'Circuit',
      heading: 'Circuit training timer',
      question: 'What is circuit training?',
      title: 'Circuit training timer: several exercises and rounds · BIP Timer',
      description:
        'Circuit training timer: up to 30 exercises, rest between exercises and between rounds, a work time of its own for each exercise. Free, in the browser.',
      intro: 'Set for a circuit of 6 exercises, 3 rounds, 45 s per exercise. Adjust, then start.',
      body: [
        'Circuit training chains several exercises, often on different muscle groups, then runs the list again for a new round. It is the ideal format for a group: everyone knows where they are from the screen changing colour.',
        'Starting setup: 6 exercises, 45 s of work, 15 s to move to the next exercise, 90 s of rest between rounds, 3 rounds. The screen shows the exercise number, the current round and what comes next.',
        'Each exercise can have its own time with “Per exercise”: 60 s for the plank, 30 s for burpees. And if you count reps rather than time, switch the unit to “Reps”: the screen waits for you to confirm each exercise.',
      ],
    },
    nl: {
      slug: 'circuittraining-timer',
      chip: 'Circuit',
      heading: 'Circuittraining-timer',
      question: 'Wat is circuittraining?',
      title: 'Circuittraining-timer: meerdere oefeningen en rondes · BIP Timer',
      description:
        'Timer voor circuittraining: tot 30 oefeningen, rust tussen oefeningen en tussen rondes, een eigen tijd per oefening. Gratis, in de browser.',
      intro: 'Ingesteld voor een circuit van 6 oefeningen, 3 rondes, 45 s per oefening. Pas aan en start.',
      body: [
        'Een circuittraining zet meerdere oefeningen achter elkaar, vaak voor verschillende spiergroepen, en begint dan opnieuw aan de lijst voor een nieuwe ronde. Het is het ideale format in groep: iedereen ziet waar hij staat aan het scherm dat van kleur verandert.',
        'Startinstelling: 6 oefeningen, 45 s inspanning, 15 s om naar de volgende oefening te gaan, 90 s rust tussen de rondes, 3 rondes. Het scherm toont het nummer van de oefening, de huidige ronde en wat er komt.',
        'Elke oefening kan een eigen tijd krijgen met „Per oefening”: 60 s voor de plank, 30 s voor burpees. Tel je liever herhalingen dan tijd, zet de eenheid dan op „Herhalingen”: het scherm wacht tot je elke oefening bevestigt.',
      ],
    },
  },
  {
    settings: { structure: 'circuit', unit: 'time', exercises: 1, rounds: 10, prep: 10, effort: 30, recRound: 30 },
    fr: {
      slug: 'minuteur-fractionne',
      chip: '30/30',
      heading: 'Minuteur fractionné 30/30',
      question: 'Qu’est-ce que le fractionné 30/30 ?',
      title: 'Minuteur fractionné 30/30 pour la course et le vélo · BIP Timer',
      description:
        'Minuteur de fractionné 30/30 : 10 répétitions de 30 s d’effort et 30 s de récupération, avec bips. Réglable pour le 15/15 ou le 1/1. Gratuit.',
      intro: 'Réglé pour un 30/30 : 10 fois 30 s d’effort et 30 s de récupération. Ajuste, puis démarre.',
      body: [
        'Le fractionné alterne des phases rapides et des phases de récupération, sur piste, sur route ou à vélo. Le 30/30 (30 s vite, 30 s lent) est le grand classique pour travailler la VMA.',
        'Réglage de départ : 1 exercice, 10 tours, 30 s d’effort et 30 s de récupération entre les tours, après 10 s de préparation. Les bips annoncent chaque changement : tu peux courir sans regarder l’écran.',
        'Pour un 15/15, mets 15 s d’effort et 15 s de récupération ; pour un 1/1, passe à 60 s et 60 s. Pour deux séries de 10 × 30/30 avec 3 min de pause entre elles, passe en « Par séries » : 2 exercices, 10 séries, 30 s entre séries et 3 min entre exercices.',
      ],
    },
    en: {
      slug: 'running-interval-timer',
      chip: '30/30',
      heading: '30/30 interval timer',
      question: 'What is a 30/30 interval session?',
      title: '30/30 interval timer for running and cycling · BIP Timer',
      description:
        '30/30 interval timer: 10 reps of 30 s work and 30 s recovery, with beeps. Adjustable for 15/15 or 1/1. Free.',
      intro: 'Set for 30/30: 10 times 30 s of work and 30 s of recovery. Adjust, then start.',
      body: [
        'Interval training alternates fast phases and recovery phases, on the track, on the road or on a bike. The 30/30 (30 s fast, 30 s easy) is the classic session for working on your maximal aerobic speed.',
        'Starting setup: 1 exercise, 10 rounds, 30 s of work and 30 s of recovery between rounds, after 10 s to get ready. The beeps announce every change, so you can run without looking at the screen.',
        'For 15/15, set 15 s of work and 15 s of recovery; for 1/1, go to 60 s and 60 s. For two sets of 10 × 30/30 with a 3-minute break between them, switch to “By sets”: 2 exercises, 10 sets, 30 s between sets and 3 min between exercises.',
      ],
    },
    nl: {
      slug: 'intervaltraining-timer',
      chip: '30/30',
      heading: 'Intervaltimer 30/30',
      question: 'Wat is een 30/30-intervaltraining?',
      title: 'Intervaltimer 30/30 voor lopen en fietsen · BIP Timer',
      description:
        'Intervaltimer 30/30: 10 herhalingen van 30 s inspanning en 30 s herstel, met piepjes. Instelbaar voor 15/15 of 1/1. Gratis.',
      intro: 'Ingesteld voor 30/30: 10 keer 30 s inspanning en 30 s herstel. Pas aan en start.',
      body: [
        'Intervaltraining wisselt snelle fases en herstelfases af, op de piste, op de weg of op de fiets. De 30/30 (30 s snel, 30 s rustig) is de klassieker om aan je maximale aerobe snelheid te werken.',
        'Startinstelling: 1 oefening, 10 rondes, 30 s inspanning en 30 s herstel tussen de rondes, na 10 s voorbereiding. De piepjes kondigen elke wissel aan: je kunt lopen zonder naar het scherm te kijken.',
        'Voor 15/15 zet je 15 s inspanning en 15 s herstel; voor 1/1 ga je naar 60 s en 60 s. Voor twee reeksen van 10 × 30/30 met 3 min pauze ertussen kies je „Per reeks”: 2 oefeningen, 10 reeksen, 30 s tussen reeksen en 3 min tussen oefeningen.',
      ],
    },
  },
  {
    settings: {
      structure: 'series',
      unit: 'reps',
      exercises: 3,
      rounds: 4,
      prep: 10,
      reps: 10,
      recSet: 90,
      recExercise: 120,
    },
    fr: {
      slug: 'minuteur-musculation',
      chip: 'Muscu',
      heading: 'Minuteur musculation par séries',
      question: 'Comment chronométrer une séance de musculation ?',
      title: 'Minuteur musculation : séries, répétitions et temps de repos · BIP Timer',
      description:
        'Minuteur de musculation par séries : il compte tes séries, attend ta validation après chaque série et chronomètre les temps de repos. Gratuit, sans installation.',
      intro: 'Réglé pour 3 exercices de 4 séries de 10 répétitions, 90 s de repos. Valide chaque série, le repos démarre seul.',
      body: [
        'En musculation, on fait toutes les séries d’un exercice avant de passer au suivant, avec un temps de repos précis entre les séries. C’est le mode « Par séries » de BIP Timer, avec l’unité « Répétitions ».',
        'Réglage de départ : 3 exercices, 4 séries de 10 répétitions, 90 s de repos entre les séries et 2 min avant l’exercice suivant. L’écran affiche le nombre de répétitions à faire et attend que tu appuies sur Valider ; le repos se lance aussitôt et bipe avant la série suivante.',
        'Chaque exercice peut avoir son propre nombre de répétitions avec « Par exercice » : 12 au développé couché, 8 au soulevé de terre. Tu travailles plutôt au temps, en gainage ou en isométrie ? Passe l’unité en « Temps ».',
      ],
    },
    en: {
      slug: 'strength-training-timer',
      chip: 'Strength',
      heading: 'Strength training timer',
      question: 'How do you time a strength session?',
      title: 'Strength training timer: sets, reps and rest times · BIP Timer',
      description:
        'Strength training timer by sets: it counts your sets, waits for you to confirm each one and times your rests. Free, no install.',
      intro: 'Set for 3 exercises of 4 sets of 10 reps, 90 s of rest. Confirm each set and the rest starts on its own.',
      body: [
        'In strength training you do every set of one exercise before moving to the next, with a precise rest between sets. That is BIP Timer’s “By sets” mode, with the “Reps” unit.',
        'Starting setup: 3 exercises, 4 sets of 10 reps, 90 s of rest between sets and 2 min before the next exercise. The screen shows the reps to do and waits for you to press Done; the rest starts right away and beeps before the next set.',
        'Each exercise can have its own number of reps with “Per exercise”: 12 on the bench press, 8 on the deadlift. Working to time instead, for planks or isometric holds? Switch the unit to “Time”.',
      ],
    },
    nl: {
      slug: 'krachttraining-timer',
      chip: 'Kracht',
      heading: 'Krachttraining-timer',
      question: 'Hoe time je een krachttraining?',
      title: 'Krachttraining-timer: reeksen, herhalingen en rusttijden · BIP Timer',
      description:
        'Timer voor krachttraining per reeks: hij telt je reeksen, wacht tot je elke reeks bevestigt en klokt je rusttijden. Gratis, zonder installatie.',
      intro: 'Ingesteld voor 3 oefeningen van 4 reeksen van 10 herhalingen, 90 s rust. Bevestig elke reeks en de rust start vanzelf.',
      body: [
        'Bij krachttraining doe je alle reeksen van één oefening voor je naar de volgende gaat, met een precieze rust tussen de reeksen. Dat is de modus „Per reeks” van BIP Timer, met de eenheid „Herhalingen”.',
        'Startinstelling: 3 oefeningen, 4 reeksen van 10 herhalingen, 90 s rust tussen de reeksen en 2 min voor de volgende oefening. Het scherm toont het aantal herhalingen en wacht tot je op Klaar drukt; de rust start meteen en piept voor de volgende reeks.',
        'Elke oefening kan een eigen aantal herhalingen krijgen met „Per oefening”: 12 bij bankdrukken, 8 bij deadlift. Train je liever op tijd, met plank of isometrische oefeningen? Zet de eenheid op „Tijd”.',
      ],
    },
  },
  {
    // A plain repeating beep, for people who search for a beep timer: reachable from search and the
    // guide, kept out of the template picker so the setup stays about training blocks.
    picker: false,
    group: 'beep',
    settings: { structure: 'circuit', unit: 'time', exercises: 1, rounds: 60, prep: 5, effort: 30, recRound: 0, countdown: false },
    fr: {
      slug: 'minuteur-bip',
      sections: [
        [
          'COMMENT L’UTILISER',
          [
            'Règle l’intervalle avec Effort : 30 s pour un bip toutes les demi-minutes, 1:00 pour un bip chaque minute, jusqu’à 10 minutes.',
            'Règle la durée avec Tours : le minuteur bipe une fois à la fin de chaque tour, donc 60 tours de 30 s font 30 minutes.',
            'Appuie sur Démarrer et pose le téléphone : l’écran reste allumé, un bip sonne à chaque intervalle et l’écran indique les tours restants.',
          ],
        ],
        [
          'IDÉES D’INTERVALLES',
          [
            '<strong>Pompes chaque minute</strong> (EMOM) : 10 pompes à chaque bip, repos jusqu’au suivant.',
            '<strong>Gainage tournant</strong> : face, côté gauche, côté droit, on change à chaque bip toutes les 30 s.',
            '<strong>Allure de course</strong> : un bip toutes les 15 s pour vérifier ton passage sur la piste.',
            '<strong>Révisions ou bureau</strong> : un bip toutes les 5 minutes pour lever les yeux, boire ou passer à la question suivante.',
          ],
        ],
      ],
      faqTitle: 'QUESTIONS SUR LE MINUTEUR BIP',
      faq: [
        ['Peut-on avoir un bip chaque minute pendant une heure ?', 'Oui : mets Effort à 1:00 et Tours à 60. Une séance va jusqu’à 99 tours de 10 minutes maximum chacun.'],
        ['Est-ce qu’il continue de biper écran éteint ?', 'L’écran reste allumé pendant la séance, donc les bips continuent. Si tu verrouilles le téléphone, le navigateur met la page en pause : le minuteur continue de compter et les bips reprennent à ton retour.'],
        ['Est-ce qu’il marche hors ligne ?', 'Oui. Une fois ouvert, ou ajouté à l’écran d’accueil, il fonctionne sans connexion.'],
        ['Peut-on entendre un décompte 3-2-1 avant chaque bip ?', 'Oui : active Décompte sous Son. Il est coupé ici pour que chaque intervalle se termine sur un seul bip.'],
      ],
      chip: 'Bip',
      heading: 'Minuteur bip',
      question: 'Qu’est-ce qu’un minuteur bip ?',
      title: 'Minuteur bip : un bip toutes les 30 s ou chaque minute · BIP Timer',
      description:
        'Minuteur bip gratuit en ligne : un bip net toutes les 30 secondes, chaque minute ou à l’intervalle de ton choix, pour le sport, le rythme ou les révisions. Sans installation, hors ligne.',
      intro: 'Un bip toutes les 30 secondes pendant 30 minutes. Change l’intervalle, puis démarre.',
      body: [
        'Un minuteur bip fait une chose simple : il bipe à intervalle fixe, encore et encore, pour garder le rythme sans regarder l’heure. Des pompes chaque minute, un changement de position de gainage toutes les 30 secondes, une allure à tenir sur la piste, ou un rappel pour lever les yeux de ton travail.',
        'Il est réglé ici sur un bip toutes les 30 secondes pendant 30 minutes : un exercice, 60 tours de 30 secondes, sans récupération et sans décompte 3-2-1, pour que chaque intervalle se termine sur un seul bip. Change l’intervalle avec Effort et la durée avec Tours : 60 tours de 60 s, c’est un bip chaque minute pendant une heure.',
        'Besoin de plus qu’un bip ? C’est le même minuteur : ajoute des exercices, des récupérations entre exercices et entre tours, des séries ou des répétitions, et il déroule tout le bloc pour toi.',
      ],
    },
    en: {
      slug: 'beep-timer',
      sections: [
        [
          'HOW TO USE IT',
          [
            'Set the interval with Work: 30 s for a beep every half minute, 1:00 for a beep every minute, up to 10 minutes.',
            'Set how long it lasts with Rounds: the timer beeps once at the end of each round, so 60 rounds of 30 s make 30 minutes.',
            'Press Start and put the phone down: the screen stays on, a beep sounds at each interval and the screen shows how many rounds are left.',
          ],
        ],
        [
          'INTERVAL IDEAS',
          [
            '<strong>Push-ups every minute</strong> (EMOM): 10 push-ups at each beep, rest until the next one.',
            '<strong>Plank switches</strong>: front, left side, right side, changing at each beep every 30 s.',
            '<strong>Running pace</strong>: a beep every 15 s to check your split on the track.',
            '<strong>Study or desk work</strong>: a beep every 5 minutes to look up, drink, or move on to the next question.',
          ],
        ],
      ],
      faqTitle: 'BEEP TIMER QUESTIONS',
      faq: [
        ['Can I get a beep every minute for an hour?', 'Yes: set Work to 1:00 and Rounds to 60. A session goes up to 99 rounds of up to 10 minutes each.'],
        ['Does it keep beeping with the screen off?', 'The screen stays on during a session so the beeps keep going. If you lock the phone, the browser pauses the page: the timer keeps counting and the beeps resume when you come back.'],
        ['Does it work offline?', 'Yes. Once opened, or added to your home screen, it works without a connection.'],
        ['Can I hear a 3-2-1 countdown before each beep?', 'Yes: turn on Countdown under Sound. It is off here so that each interval ends on a single beep.'],
      ],
      chip: 'Beep',
      heading: 'Beep timer',
      question: 'What is a beep timer?',
      title: 'Beep Timer: a beep every 30 s, every minute or any interval · BIP Timer',
      description:
        'Free online beep timer: a clean beep every 30 seconds, every minute or any interval, for workouts, pacing or study. No install, works offline.',
      intro: 'A beep every 30 seconds, for 30 minutes. Change the interval, then start.',
      body: [
        'A beep timer does one simple thing: it beeps at a fixed interval, again and again, so you keep the rhythm without watching a clock. Push-ups every minute, a plank switch every 30 seconds, a pace to hold on the track, or a reminder to look up from your work.',
        'Here it is set to a beep every 30 seconds for 30 minutes: one exercise, 60 rounds of 30 seconds, with no rest and no 3-2-1 countdown, so each interval ends on a single beep. Change the interval with Work and the length with Rounds: 60 rounds of 60 s is a beep every minute for an hour.',
        'Need more than a beep? It is the same timer: add exercises, rests between exercises and between rounds, sets or reps, and it runs the whole block for you.',
      ],
    },
    nl: {
      slug: 'piep-timer',
      sections: [
        [
          'ZO GEBRUIK JE HEM',
          [
            'Stel het interval in met Inspanning: 30 s voor een piep elke halve minuut, 1:00 voor een piep elke minuut, tot 10 minuten.',
            'Stel de duur in met Rondes: de timer piept één keer aan het einde van elke ronde, dus 60 rondes van 30 s zijn 30 minuten.',
            'Druk op Starten en leg je telefoon neer: het scherm blijft aan, bij elk interval klinkt een piep en het scherm toont hoeveel rondes er nog zijn.',
          ],
        ],
        [
          'IDEEËN VOOR INTERVALLEN',
          [
            '<strong>Push-ups elke minuut</strong> (EMOM): 10 push-ups bij elke piep, rust tot de volgende.',
            '<strong>Wisselende plank</strong>: voor, linkerzij, rechterzij, wisselen bij elke piep om de 30 s.',
            '<strong>Looptempo</strong>: een piep elke 15 s om je tussentijd op de piste te checken.',
            '<strong>Studeren of bureauwerk</strong>: een piep elke 5 minuten om op te kijken, te drinken of naar de volgende vraag te gaan.',
          ],
        ],
      ],
      faqTitle: 'VRAGEN OVER DE PIEP-TIMER',
      faq: [
        ['Kan ik een uur lang elke minuut een piep krijgen?', 'Ja: zet Inspanning op 1:00 en Rondes op 60. Een sessie gaat tot 99 rondes van maximaal 10 minuten elk.'],
        ['Blijft hij piepen met het scherm uit?', 'Het scherm blijft aan tijdens een sessie, dus de piepjes gaan door. Vergrendel je de telefoon, dan zet de browser de pagina op pauze: de timer blijft tellen en de piepjes gaan verder als je terugkomt.'],
        ['Werkt hij offline?', 'Ja. Eenmaal geopend, of op je beginscherm gezet, werkt hij zonder verbinding.'],
        ['Kan ik een aftelling 3-2-1 voor elke piep horen?', 'Ja: zet Aftellen aan onder Geluid. Hier staat het uit, zodat elk interval eindigt op één enkele piep.'],
      ],
      chip: 'Piep',
      heading: 'Piep-timer',
      question: 'Wat is een piep-timer?',
      title: 'Piep-timer: een piep elke 30 s of elke minuut · BIP Timer',
      description:
        'Gratis online piep-timer: een duidelijke piep elke 30 seconden, elke minuut of met het interval dat je kiest, voor sport, tempo of studeren. Zonder installatie, werkt offline.',
      intro: 'Een piep elke 30 seconden, 30 minuten lang. Pas het interval aan en start.',
      body: [
        'Een piep-timer doet één eenvoudig ding: hij piept met een vast interval, telkens opnieuw, zodat je het ritme houdt zonder op de klok te kijken. Push-ups elke minuut, elke 30 seconden van plankhouding wisselen, een tempo vasthouden op de piste, of een herinnering om even op te kijken van je werk.',
        'Hier staat hij op een piep elke 30 seconden, 30 minuten lang: één oefening, 60 rondes van 30 seconden, zonder rust en zonder aftellen 3-2-1, zodat elk interval eindigt op één enkele piep. Pas het interval aan met Inspanning en de duur met Rondes: 60 rondes van 60 s is een piep elke minuut, een uur lang.',
        'Meer nodig dan een piep? Het is dezelfde timer: voeg oefeningen toe, rust tussen oefeningen en tussen rondes, reeksen of herhalingen, en hij laat het hele blok voor je lopen.',
      ],
    },
  },
];

// The beep pages, one per common interval, built from a single description so they stay alike in
// shape and differ in what each interval is good for.
const INTERVALS = [
  {
    seconds: 10,
    rounds: 60,
    fr: { every: '10 secondes', slug: 'bip-toutes-les-10-secondes', total: '10 minutes', uses: 'Toutes les 10 secondes, c’est le rythme des exercices très courts : appuis rapides, touches de balle, changement de poste express ou cadence de respiration.' },
    en: { every: '10 seconds', slug: 'beep-every-10-seconds', total: '10 minutes', uses: 'Every 10 seconds is the pace of very short drills: quick footwork, ball touches, a fast change of station or a breathing rhythm.' },
    nl: { every: '10 seconden', slug: 'piep-elke-10-seconden', total: '10 minuten', uses: 'Elke 10 seconden is het ritme van heel korte oefeningen: snel voetenwerk, balcontacten, een snelle stationswissel of een ademritme.' },
  },
  {
    seconds: 15,
    rounds: 80,
    fr: { every: '15 secondes', slug: 'bip-toutes-les-15-secondes', total: '20 minutes', uses: 'Toutes les 15 secondes convient aux sprints courts, aux efforts façon Tabata, aux changements de position en mobilité ou au contrôle d’allure sur piste.' },
    en: { every: '15 seconds', slug: 'beep-every-15-seconds', total: '20 minutes', uses: 'Every 15 seconds suits short sprints, Tabata-style bursts, mobility switches or a pace check on the track.' },
    nl: { every: '15 seconden', slug: 'piep-elke-15-seconden', total: '20 minuten', uses: 'Elke 15 seconden past bij korte sprints, Tabata-achtige inspanningen, wissels in mobiliteitsoefeningen of een tempocontrole op de piste.' },
  },
  {
    seconds: 30,
    rounds: 60,
    fr: { every: '30 secondes', slug: 'bip-toutes-les-30-secondes', total: '30 minutes', uses: 'Toutes les 30 secondes, c’est le classique du gainage et des étirements tenus, des changements d’exercice en HIIT ou d’une allure à tenir en course.' },
    en: { every: '30 seconds', slug: 'beep-every-30-seconds', total: '30 minutes', uses: 'Every 30 seconds is the classic for plank and stretching holds, HIIT exercise switches or a pace to hold when running.' },
    nl: { every: '30 seconden', slug: 'piep-elke-30-seconden', total: '30 minuten', uses: 'Elke 30 seconden is de klassieker voor plank- en rekhoudingen, oefeningswissels in HIIT of een tempo om vast te houden bij het lopen.' },
  },
  {
    seconds: 60,
    rounds: 60,
    fr: { every: 'minutes', slug: 'bip-toutes-les-minutes', total: 'une heure', uses: 'Chaque minute, c’est le rythme de l’EMOM : une série de pompes ou de squats à chaque bip, puis repos jusqu’à la minute suivante. Il sert aussi à rythmer une lecture ou un entraînement aux examens.' },
    en: { every: 'minute', slug: 'beep-every-minute', total: 'an hour', uses: 'Every minute is the pace of EMOM: a set of push-ups or squats at each beep, then rest until the next minute. It also paces reading or exam practice.' },
    nl: { every: 'minuut', slug: 'piep-elke-minuut', total: 'een uur', uses: 'Elke minuut is het ritme van EMOM: een reeks push-ups of squats bij elke piep, dan rust tot de volgende minuut. Hij geeft ook ritme aan lezen of examentraining.' },
  },
  {
    seconds: 120,
    rounds: 30,
    fr: { every: '2 minutes', slug: 'bip-toutes-les-2-minutes', total: 'une heure', uses: 'Toutes les 2 minutes convient aux ateliers d’un circuit, au repos entre deux séries lourdes ou au rythme de questions d’entraînement.' },
    en: { every: '2 minutes', slug: 'beep-every-2-minutes', total: 'an hour', uses: 'Every 2 minutes suits circuit stations, rest between heavy sets or a steady pace through practice questions.' },
    nl: { every: '2 minuten', slug: 'piep-elke-2-minuten', total: 'een uur', uses: 'Elke 2 minuten past bij circuitstations, rust tussen zware reeksen of een vast ritme door oefenvragen.' },
  },
  {
    seconds: 300,
    rounds: 12,
    fr: { every: '5 minutes', slug: 'bip-toutes-les-5-minutes', total: 'une heure', uses: 'Toutes les 5 minutes, c’est un rappel discret : redresser sa posture, boire, se lever du bureau, ou changer d’allure sur une longue sortie à vélo.' },
    en: { every: '5 minutes', slug: 'beep-every-5-minutes', total: 'an hour', uses: 'Every 5 minutes is a gentle reminder: fix your posture, drink, get up from the desk, or change pace on a long bike ride.' },
    nl: { every: '5 minuten', slug: 'piep-elke-5-minuten', total: 'een uur', uses: 'Elke 5 minuten is een zachte herinnering: je houding verbeteren, drinken, rechtstaan van je bureau of van tempo wisselen op een lange fietstocht.' },
  },
];

const clock = (seconds) => (seconds < 60 ? `${seconds} s` : `${seconds / 60}:00`);

const INTERVAL_WORDING = {
  fr: (i, l) => ({
    slug: l.slug,
    chip: clock(i.seconds),
    heading: `Un bip toutes les ${l.every}`,
    question: `À quoi sert un bip toutes les ${l.every} ?`,
    title: `Bip toutes les ${l.every} · minuteur bip gratuit · BIP Timer`,
    description: `Un bip toutes les ${l.every}, en boucle pendant ${l.total} : minuteur bip gratuit en ligne, pour le sport, le rythme ou les révisions. Sans installation, hors ligne.`,
    intro: `Un bip toutes les ${l.every}, pendant ${l.total}. Change la durée avec Tours, puis démarre.`,
    body: [
      l.uses,
      `Réglage : un exercice, ${i.rounds} tours de ${clock(i.seconds)}, sans récupération et sans décompte 3-2-1, après 5 s de préparation. Chaque intervalle se termine sur un seul bip, et l’écran reste allumé jusqu’à la fin. Change l’intervalle avec Effort, la durée avec Tours.`,
      'Besoin de plus qu’un bip ? C’est le même minuteur : ajoute des exercices, des récupérations, des séries ou des répétitions, et il déroule tout le bloc pour toi.',
    ],
  }),
  en: (i, l) => ({
    slug: l.slug,
    chip: clock(i.seconds),
    heading: `Beep every ${l.every}`,
    question: `What is a beep every ${l.every} for?`,
    title: `Beep every ${l.every} · free online beep timer · BIP Timer`,
    description: `A beep every ${l.every}, on repeat for ${l.total}: free online beep timer for workouts, pacing or study. No install, works offline.`,
    intro: `A beep every ${l.every}, for ${l.total}. Change the length with Rounds, then start.`,
    body: [
      l.uses,
      `The setup: one exercise, ${i.rounds} rounds of ${clock(i.seconds)}, with no rest and no 3-2-1 countdown, after 5 s to get ready. Each interval ends on a single beep, and the screen stays on until the end. Change the interval with Work and the length with Rounds.`,
      'Need more than a beep? It is the same timer: add exercises, rests, sets or reps, and it runs the whole block for you.',
    ],
  }),
  nl: (i, l) => ({
    slug: l.slug,
    chip: clock(i.seconds),
    heading: `Een piep elke ${l.every}`,
    question: `Waarvoor dient een piep elke ${l.every}?`,
    title: `Piep elke ${l.every} · gratis piep-timer · BIP Timer`,
    description: `Een piep elke ${l.every}, ${l.total} lang: gratis online piep-timer voor sport, tempo of studeren. Zonder installatie, werkt offline.`,
    intro: `Een piep elke ${l.every}, ${l.total} lang. Pas de duur aan met Rondes en start.`,
    body: [
      l.uses,
      `De instelling: één oefening, ${i.rounds} rondes van ${clock(i.seconds)}, zonder rust en zonder aftellen 3-2-1, na 5 s voorbereiding. Elk interval eindigt op één enkele piep, en het scherm blijft aan tot het einde. Pas het interval aan met Inspanning en de duur met Rondes.`,
      'Meer nodig dan een piep? Het is dezelfde timer: voeg oefeningen, rust, reeksen of herhalingen toe, en hij laat het hele blok voor je lopen.',
    ],
  }),
};

PRESETS.push(
  ...INTERVALS.map((interval) => ({
    picker: false,
    group: 'beep',
    settings: { structure: 'circuit', unit: 'time', exercises: 1, rounds: interval.rounds, prep: 5, effort: interval.seconds, recRound: 0, countdown: false },
    ...Object.fromEntries(['fr', 'en', 'nl'].map((code) => [code, INTERVAL_WORDING[code](interval, interval[code])])),
  })),
);

// The links between the beep pages: the beep timer and every interval.
export const BEEP_LABEL = { fr: 'UN BIP RÉGULIER', en: 'A REGULAR BEEP', nl: 'EEN VASTE PIEP' };
