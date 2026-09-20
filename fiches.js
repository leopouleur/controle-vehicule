// Fiches de contrôle générées à partir des 5 fichiers Excel d'origine.
// Types de section : std (OK/CHEF/KO), diag (OK/KO), pms (À faire/OK + quantité), amelio (À faire/Fait), travaux (texte libre).
const FICHES = [
 {
  "id": "plan-image",
  "nom": "PLAN IMAGE",
  "finTravaux": true,
  "sections": [
   {
    "titre": "FACE AVANT",
    "type": "std",
    "items": [
     "PAVILLON DE TOIT + ANTENNE",
     "VISCOPE + ANTEVISEUR",
     "PARE BRISE + BALAIS ESSUIS GLACE",
     "CALANDRE",
     "COUSSINS SUSPENSION AVANT",
     "SOCLE BOUTEILLE DESHY",
     "MOUSTACHE",
     "MARCHE PIEDS",
     "I / L / COIN PC / SUPPORT PLAQUE",
     "OPTIQUES ET CONTOUR DE PHARES"
    ]
   },
   {
    "titre": "COTE GAUCHE CABINE",
    "type": "std",
    "items": [
     "DOME LATERAL",
     "PORTE + BAS DE PORTE + POIGNEE",
     "RETROVISEUR",
     "MARCHE PIEDS",
     "PARE BOUE",
     "PORTE SOUTE + INTERIEUR SOUTE",
     "DEFLECTEUR LATERAL"
    ]
   },
   {
    "titre": "FACE AR CABINE",
    "type": "std",
    "items": [
     "PANNEAU AR",
     "DISQUE LIMITATION",
     "CACHE CLIM",
     "MAIN ROUGE / JAUNE + FLEXIBLE",
     "CORDON ABS / ECLAIRAGE",
     "POTENCE + VALVE REMORQUE",
     "CHEMINEE + SUPPORT",
     "COUSSIN DE SUSPENSION",
     "VALVE DE NIVELLEMENT",
     "DEFLECTEURS"
    ]
   },
   {
    "titre": "COTE GAUCHE CHASSIS",
    "type": "std",
    "items": [
     "JUPE LATERALE",
     "CACHE BATTERIES",
     "RESERVOIRS + SANGLE",
     "PASSERELLES",
     "PARE BOUE + CALOTTE"
    ]
   },
   {
    "titre": "ARRIERE CHASSIS",
    "type": "std",
    "items": [
     "DEMI AILE",
     "FEUX",
     "PLAQUE IMMATRICULATION",
     "PARE BOUES",
     "SELLETTE + BOULONS",
     "TRAVERSE ARRIERE"
    ]
   },
   {
    "titre": "COTE DROIT CHASSIS",
    "type": "std",
    "items": [
     "PLAQUE CATA LATERALE ET SUPERIEURE",
     "RESERVOIR ADBLUE + PLAQUE SUPERIEUR",
     "JUPE LATERALE",
     "RESERVOIRS GO + SANGLE",
     "PARE BOUE + CALOTTE"
    ]
   },
   {
    "titre": "COTE DROIT CABINE",
    "type": "std",
    "items": [
     "DOME LATERAL",
     "PORTE + BAS DE PORTE + POIGNEE",
     "ANTEVISEUR LATERAL",
     "RETROVISEUR",
     "MARCHE PIEDS",
     "PARE BOUE",
     "PORTE SOUTE + INTERIEUR SOUTE",
     "DEFLECTEUR LATERAL"
    ]
   },
   {
    "titre": "CHASSIS",
    "type": "std",
    "items": [
     "RADIATEUR / ECHANGEUR",
     "ARAIGNEE",
     "BAGUE DE LAMES AV",
     "BIELLETTE DE BARRE STAB",
     "BARRE DE DIRECTION + ACCOUPLEMENT",
     "FUITE D'HUILE MOTEUR + GOULOTTE",
     "CONTRÔLE VISUEL DISQUE DE FREIN",
     "CONTRÔLE BV",
     "CONTRÔLE ARBRE DE TRANSMISSION",
     "CONTRÔLE RESERVOIRS GASOIL + ADBLUE",
     "CONTRÔLE APM",
     "CONTRÔLE VISUEL DU PONT",
     "CONTRÔLE DISQUE AR",
     "CONTRÔLE BAGUE DE LAMES + LAMES AR",
     "CONTRÔLE COUSSIN DE SUSPENSION"
    ]
   },
   {
    "titre": "CABINE INTERIEURE",
    "type": "std",
    "items": [
     "CIEL DE TOIT",
     "BAGAGERIE SUPERIEURE",
     "RIDEAU + PORTE CARTE",
     "ETAT DE TABLEAU DE BORD + AIMANT",
     "AFFICHEUR + VOYANT",
     "VOLANT + SOUFFLET",
     "CONSOLE DE BOUTON TDB",
     "SIEGE CONDUCTEUR + CEINTURE",
     "VITRE / BOUTONS / GARNITURE / JOINTS",
     "TELECOMMANDE SUSPENSION",
     "EXTINCTEUR",
     "LISEUSE",
     "GARNITURE DE CABINE",
     "GRAND RIDEAU",
     "MATELAS + SOUTE",
     "SIEGE PASSAGER + CEINTURE",
     "VITRE / BOUTONS / GARNITURE / JOINTS",
     "RANGEMENT + PORTE + TIROIR"
    ]
   },
   {
    "titre": "SOUS CABINE",
    "type": "std",
    "items": [
     "FUITE D'HUILE MOTEUR",
     "FUITE LIQUIDE DE REFROIDISSEMENT",
     "FUITE DE DA",
     "BLOC FILTRE A AIR"
    ]
   },
   {
    "titre": "EQUIPEMENTS",
    "type": "std",
    "items": [
     "DOUBLE DE CLES + BARRILLET DE PORTE",
     "CLIM DE NUIT + TELECOMMANDE",
     "VISCOPE",
     "FRIGO + TIROIR",
     "HYDRAULIQUE / PMT",
     "PLAQUE ADR",
     "RAMPE PHARE / SLIDE BARRE",
     "GYROPHARES",
     "PNEUMATIQUES + JANTES"
    ]
   },
   {
    "titre": "VALISE DIAGNOSTIC",
    "type": "diag",
    "items": [
     "TESTS ( FREINS / SCR /SUIE / EMBRAYAGE)",
     "MISES A JOUR VDA",
     "CONTRÔLE CODE DEFAUTS",
     "90 KM/H"
    ]
   },
   {
    "titre": "ENTRETIEN SELON PMS",
    "type": "pms",
    "items": [
     "VIDANGE MOTEUR",
     "VIDANGE BOITE",
     "VIDANGE RALENTISSEUR",
     "VIDANGE PONT",
     "VIDANGE LIQUIDE REFROIDISSEMENT",
     "LAVE GLACE",
     "KIT GALETS COURROIES",
     "REGLAGE CULBUTEURS",
     "BATTERIES",
     "FILTRE A PARTICULES",
     "FILTRATIONS",
     "EXTINCTEUR NEUF"
    ]
   },
   {
    "titre": "DEMANDE D'AMELIORATIONS",
    "type": "amelio",
    "items": [
     "FRIGO",
     "VISCOPE",
     "GYROPHARE",
     "CARENAGES LATERAUX",
     "PMT",
     "B100 FLEX",
     "BARRE LED",
     "SLIDE BAR",
     "CLIM DE NUIT",
     "TROMPE DE TOIT",
     "RESERVOIR SUPPLEMENTAIRE"
    ]
   },
   {
    "titre": "TRAVAUX SUPPLEMENTAIRES",
    "type": "travaux",
    "items": []
   }
  ],
  "notes": []
 },
 {
  "id": "push-plan",
  "nom": "PUSH PLAN",
  "finTravaux": false,
  "sections": [
   {
    "titre": "EXTERIEUR VEHICULE",
    "type": "std",
    "items": [
     "CONTRÔLE ELEMENTS CARROSSERIE *",
     "CONTRÔLE PARE BRISE",
     "CONTRÔLE ECLAIRAGE",
     "DEFLECTEUR DE TOIT A DEPOSER"
    ]
   },
   {
    "titre": "CHASSIS",
    "type": "std",
    "items": [
     "CONTRÔLE RESERVOIR ET JAUGE",
     "CONTRÔLE BOUCHONS ET CLES",
     "CONTRÔLE VERROUILLAGE CABINE",
     "CONTRÔLE VALVE NIVELLEMENT CABINE",
     "CONTRÔLE PNEUMATIQUE MINI 40% **",
     "CONTRÔLE FUITE D'AIR"
    ]
   },
   {
    "titre": "MOTORISATION",
    "type": "std",
    "items": [
     "CONTRÔLE NIVEAUX LR",
     "CONTRÔLE NIVEAUX MOTEUR",
     "CONTRÔLE FUITE MOTEUR",
     "REMPLACEMENT FILTRATION GASOIL",
     "CONTRÔLE FUITE LR",
     "CONTRÔLE FUITE BV",
     "CONTRÔLE GALETS COURROIES 36 MOIS",
     "REMPLACER FAP SI 5 ANS OU 500 000 KM",
     "TEST BATTERIES + REMPLACEMENT SI HS"
    ]
   },
   {
    "titre": "CABINE",
    "type": "std",
    "items": [
     "CONTRÔLE FONCTIONNEMENT LEVE VITRE",
     "CONTRÔLE FONCTIONNEMENT RETROVISEUR",
     "CONTRÔLE FONCTIONNEMENT ESSUIS GLACE",
     "CONTRÔLE FONCTIONNEMENT WEBASTO 30 MIN",
     "CONTRÔLE FONCTIONNEMENT VENTILATION",
     "CONTRÔLE INTERIEUR GENERAL ***",
     "CONTRÔLE DEFAUTS TABLEAU DE BORD",
     "CONTRÔLE PRESENCE FRIGO SI DEMANDE CLIENT",
     "CONTROLE DOUBLES DE CLES"
    ]
   },
   {
    "titre": "VALISE DIAG",
    "type": "std",
    "items": [
     "RELEVES PLAQUETTES ( MINI 30 % )",
     "RELEVES EMBRAYAGE ( MINI 30 % )",
     "CONTRÔLE DES CAMPAGNES ET VDA",
     "CONTRÔLE TEST SCR",
     "CONTRÔLE SI DEFAUTS ACTIFS",
     "MISE A JOUR DU FAP SI ECHANGE"
    ]
   }
  ],
  "notes": [
   "* VOIR AVEC CHEF POUR ECHANGE ELEMENTS",
   "** PNEUS RETAILLER INTERDIT",
   "*** ECHANGE ELEMENTS CASSER OU MANQUANT"
  ]
 },
 {
  "id": "prepa-access",
  "nom": "PREPA ACCESS",
  "finTravaux": true,
  "sections": [
   {
    "titre": "FACE AVANT",
    "type": "std",
    "items": [
     "PARE BRISE ET ANTEVISEUR",
     "BALAIS ESSUIS GLACE",
     "COUSSINS SUSPENSIONS CABINE",
     "POUR AUTRES ELEMENTS VOIR CHEF"
    ]
   },
   {
    "titre": "COTE GAUCHE CABINE",
    "type": "std",
    "items": [
     "ETAT DES RETROVISEURS",
     "FERMETURE BARRILLET",
     "POUR AUTRES ELEMENTS VOIR CHEF"
    ]
   },
   {
    "titre": "FACE AR CABINE",
    "type": "std",
    "items": [
     "PANNEAU AR",
     "DISQUE LIMITATION",
     "COUSSINS SUSPENSIONS CABINE"
    ]
   },
   {
    "titre": "COTE GAUCHE CHASSIS",
    "type": "std",
    "items": [
     "POUR AUTRES ELEMENTS VOIR CHEF"
    ]
   },
   {
    "titre": "ARRIERE CHASSIS",
    "type": "std",
    "items": [
     "COUSSINS SUSPENSIONS CHASSIS",
     "FEUX + ECLAIRAGE",
     "PARE BOUES",
     "SELLETTE + BOULONS"
    ]
   },
   {
    "titre": "COTE DROIT CHASSIS",
    "type": "std",
    "items": [
     "POUR AUTRES ELEMENTS VOIR CHEF"
    ]
   },
   {
    "titre": "COTE DROIT CABINE",
    "type": "std",
    "items": [
     "POUR AUTRES ELEMENTS VOIR CHEF"
    ]
   },
   {
    "titre": "VALISE DIAGNOSTIC",
    "type": "diag",
    "items": [
     "TESTS ( FREINS / SCR /SUIE / EMBRAYAGE)",
     "MISES A JOUR VDA",
     "CONTRÔLE CODE DEFAUTS",
     "90 KM/H"
    ]
   },
   {
    "titre": "ENTRETIEN SELON PMS",
    "type": "pms",
    "items": [
     "VIDANGE MOTEUR",
     "VIDANGE BOITE",
     "VIDANGE RALENTISSEUR",
     "VIDANGE PONT",
     "VIDANGE LIQUIDE REFROIDISSEMENT",
     "LAVE GLACE",
     "KIT GALETS COURROIES",
     "REGLAGE CULBUTEURS",
     "BATTERIES",
     "FILTRE A PARTICULES",
     "FILTRATIONS",
     "EXTINCTEUR NEUF"
    ]
   },
   {
    "titre": "DEMANDE D'AMELIORATIONS",
    "type": "amelio",
    "items": [
     "FRIGO",
     "VISCOPE",
     "GYROPHARE",
     "CARENAGES LATERAUX",
     "PMT",
     "B100 FLEX",
     "BARRE LED",
     "SLIDE BAR",
     "CLIM DE NUIT",
     "TROMPE DE TOIT",
     "RESERVOIR SUPPLEMENTAIRE",
     "AUTRES DEMANDE"
    ]
   },
   {
    "titre": "TRAVAUX SUPPLEMENTAIRES",
    "type": "travaux",
    "items": []
   }
  ],
  "notes": [
   "TOUT ELEMENTS CASSE = A CHANGER",
   "TOUT ELEMENTS FISSURE = OK"
  ]
 },
 {
  "id": "bamy",
  "nom": "BAMY",
  "finTravaux": false,
  "sections": [
   {
    "titre": "EXTERIEUR VEHICULE",
    "type": "std",
    "items": [
     "CONTRÔLE ELEMENTS CARROSSERIES *",
     "CONTRÔLE PARE BRISE (PAS DE ROND BLANC)",
     "CONTRÔLE ECLAIRAGE"
    ]
   },
   {
    "titre": "CHASSIS",
    "type": "std",
    "items": [
     "CONTRÔLE RESERVOIRS ET JAUGES",
     "CONTRÔLE VERROUILLAGE CABINE",
     "CONTRÔLE PNEUMATIQUE MINI 40% **",
     "CONTRÔLE FUITE D'AIR"
    ]
   },
   {
    "titre": "MOTORISATION",
    "type": "std",
    "items": [
     "CONTRÔLE NIVEAUX ET FUITE LR",
     "CONTRÔLE NIVEAUX MOTEUR",
     "CONTRÔLE NIVEAU LAVE GLACE",
     "CONTRÔLE NIVEAU BV",
     "CONTRÔLE FUITE SUR DIRECTION",
     "CONTRÔLE FUITE MOTEUR",
     "CONTRÔLE TRAIN AVANT",
     "CONTRÔLE TRAIN AR",
     "CONTRÔLE ELEMENTS DE SUSPENSION",
     "REMPLACEMENT FILTRATION GASOIL",
     "CONTRÔLE FUITE BV",
     "REMPL BATTERIES OBLIGATOIRE MONTE ORIGINE"
    ]
   },
   {
    "titre": "CABINE",
    "type": "std",
    "items": [
     "CONTRÔLE FONCTIONNEMENT LEVE VITRE",
     "CONTRÔLE FONCTIONNEMENT RETROVISEUR",
     "CONTRÔLE FONCTIONNEMENT ESSUIS GLACE",
     "CONTRÔLE FONCTIONNEMENT VENTILATION",
     "CONTRÔLE FONCTIONNEMENT WEBASTO",
     "CONTRÔLE FONCTIONNEMENT CLIM",
     "CONTRÔLE INTERIEUR GENERAL ***",
     "CONTRÔLE DEFAUTS TABLEAU DE BORD",
     "CONTROLE DOUBLES DE CLES"
    ]
   },
   {
    "titre": "VALISE DIAG",
    "type": "std",
    "items": [
     "RELEVES PLAQUETTES ( MINI 30 % )",
     "RELEVES EMBRAYAGE ( MINI 30 % )",
     "CONTRÔLE DES CAMPAGNES ET VDA",
     "CONTRÔLE TEST SCR",
     "CONTRÔLE SI DEFAUTS ACTIFS"
    ]
   },
   {
    "titre": "PREPA BAMY",
    "type": "std",
    "items": [
     "CONTRÔLE PRESENCE FRIGO",
     "DEPOSE DU DEFLECTEUR",
     "POSE ROUE DE SECOURS SUR CHASSIS",
     "ASSISE DE SIEGE PAS ABIME",
     "FRIGO OBLIGATOIRE"
    ]
   }
  ],
  "notes": [
   "* VOIR AVEC CHEF POUR ECHANGE ELEMENTS",
   "** PNEUS RETAILLER INTERDIT",
   "*** ECHANGE ELEMENTS CASSER OU MANQUANT"
  ]
 },
 {
  "id": "depart-route",
  "nom": "DEPART ROUTE",
  "finTravaux": false,
  "sections": [
   {
    "titre": "EXTERIEUR VEHICULE",
    "type": "std",
    "items": [
     "CONTRÔLE ELEMENTS CARROSSERIES *",
     "CONTRÔLE PARE BRISE",
     "CONTRÔLE ECLAIRAGE"
    ]
   },
   {
    "titre": "CHASSIS",
    "type": "std",
    "items": [
     "CONTRÔLE RESERVOIRS ET JAUGES",
     "CONTRÔLE VERROUILLAGE CABINE",
     "CONTRÔLE PNEUMATIQUE MINI 40% **",
     "CONTRÔLE FUITE D'AIR"
    ]
   },
   {
    "titre": "MOTORISATION",
    "type": "std",
    "items": [
     "CONTRÔLE NIVEAUX LR",
     "CONTRÔLE NIVEAUX MOTEUR",
     "CONTRÔLE FUITE MOTEUR",
     "REMPLACEMENT FILTRATION GASOIL",
     "CONTRÔLE FUITE LR",
     "CONTRÔLE FUITE BV",
     "TEST BATTERIES + REMPLACEMENT SI HS"
    ]
   },
   {
    "titre": "CABINE",
    "type": "std",
    "items": [
     "CONTRÔLE FONCTIONNEMENT LEVE VITRE",
     "CONTRÔLE FONCTIONNEMENT RETROVISEUR",
     "CONTRÔLE FONCTIONNEMENT ESSUIS GLACE",
     "CONTRÔLE FONCTIONNEMENT VENTILATION",
     "CONTRÔLE DE LA CLIMATISATION",
     "CONTRÔLE DU WEBASTO",
     "CONTRÔLE INTERIEUR GENERAL ***",
     "CONTRÔLE DEFAUTS TABLEAU DE BORD",
     "CONTROLE DOUBLES DE CLES"
    ]
   },
   {
    "titre": "VALISE DIAG",
    "type": "std",
    "items": [
     "RELEVES PLAQUETTES ( 30% MINI )",
     "RELEVES EMBRAYAGE ( 30 % MINI )",
     "CONTRÔLE DES CAMPAGNES ET VDA",
     "CONTRÔLE TEST SCR",
     "CONTRÔLE SI DEFAUTS ACTIFS"
    ]
   }
  ],
  "notes": [
   "* VOIR AVEC CHEF POUR ECHANGE ELEMENTS",
   "** PNEUS RETAILLER INTERDIT",
   "*** ECHANGE ELEMENTS CASSER OU MANQUANT"
  ]
 }
];
