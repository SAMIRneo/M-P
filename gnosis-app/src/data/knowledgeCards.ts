import { KnowledgeCardData } from "@/components/KnowledgeCard";

export const knowledgeCards: KnowledgeCardData[] = [
  // ===== POLITIQUES (6 cartes) =====
  {
    id: 1,
    title: "Géopolitique du 21e siècle",
    emoji: "🌍",
    category: "politiques",
    summary: "L'analyse des rapports de force mondiaux entre puissances établies et émergentes. Un monde multipolaire en pleine mutation.",
    content: `La géopolitique du 21e siècle est marquée par la fin de l'hégémonie unipolaire américaine et l'émergence d'un monde multipolaire complexe.

LES GRANDS BLOCS ET TENSIONS
• USA vs Chine : La "Guerre Froide" technologique (semi-conducteurs, IA) et la question de Taïwan.
• BRICS+ : L'élargissement d'un bloc cherchant à dédollariser l'économie et offrir une alternative au G7.
• Union Européenne : En quête de souveraineté stratégique entre autonomie et alliance atlantique.
• Le "Sud Global" : Des nations refusant de choisir un camp et jouant sur plusieurs tableaux diplomatiques.

ENJEUX STRATÉGIQUES
1. Souveraineté Numérique : Le contrôle des câbles sous-marins, des satellites (Starlink) et des données.
2. Sécurité Énergétique : La dépendance aux ressources (gaz, pétrole) et la course aux métaux critiques pour la transition.
3. Militarisation de l'Espace : La nouvelle frontière de la puissance militaire et de la surveillance.

DOCTRINES MODERNES
• Realpolitik : Pragmatisme basé sur l'intérêt national pur.
• Soft Power : Influence culturelle et idéologique (Hollywood, TikTok, K-Pop).
• Sharp Power : Manipulation de l'information et cyber-influence.`,
    tags: ["Multipolarité", "Puissance", "Souveraineté", "Diplomatie", "BRICS"],
    links: [{ label: "Le Dessous des Cartes", url: "https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" }]
  },
  {
    id: 2,
    title: "Systèmes de Gouvernance",
    emoji: "🏛️",
    category: "politiques",
    summary: "Comparaison des structures de pouvoir, de la démocratie libérale aux modèles technocratiques et autoritaires.",
    content: `La gouvernance définit comment une société est dirigée, comment les décisions sont prises et comment le pouvoir est distribué.

MODÈLES DÉMOCRATIQUES
• Démocratie Libérale : Séparation des pouvoirs, État de droit, libertés individuelles et élections pluralistes.
• Démocratie Directe/Participative : Référendums, budgets participatifs et implication citoyenne constante.
• Parlementarisme vs Présidentialisme : Équilibre des forces entre l'exécutif et le législatif.

MODÈLES ALTERNATIFS ET ÉMERGENTS
• Technocratie : Gouvernance par les experts et les données, privilégiant l'efficacité technique sur le débat idéologique.
• Illibéralisme : Maintien du cadre électoral mais affaiblissement des contre-pouvoirs (presse, justice).
• Gouvernance Algorithmique : L'utilisation croissante de l'IA pour optimiser les politiques publiques et la bureaucratie.

DÉFIS CONTEMPORAINS
• Crise de la Représentation : Déconnexion perçue entre les élites et les citoyens.
• Corruption et Lobbying : L'influence des intérêts privés sur la décision publique.
• État de Surveillance : L'usage des technologies pour contrôler la population sous couvert de sécurité.`,
    tags: ["Démocratie", "État", "Pouvoir", "Constitution", "Légitimité"],
    links: [{ label: "Portail Vie Publique", url: "https://www.vie-publique.fr" }]
  },
  {
    id: 3,
    title: "Économie Politique",
    emoji: "💰",
    category: "politiques",
    summary: "L'interaction entre les choix politiques et les théories économiques. Comment le pouvoir façonne la richesse.",
    content: `L'économie politique étudie comment les théories économiques se traduisent en décisions politiques et comment ces décisions affectent la distribution des richesses.

GRANDS COURANTS
• Libéralisme & Néolibéralisme : Priorité au marché, dérégulation, privatisation et libre-échange.
• Social-Démocratie : Redistribution via l'impôt, services publics forts et protection sociale.
• Keynésianisme : Intervention de l'État pour soutenir la demande et réguler les cycles économiques.
• Marxisme & Post-Capitalisme : Critique de l'accumulation du capital et recherche d'alternatives à la propriété privée.

POLITIQUES MONÉTAIRES ET FISCALES
• Banques Centrales : Indépendance vs contrôle politique. Gestion de l'inflation et des taux d'intérêt.
• Dette Publique : Levier d'investissement ou fardeau pour les générations futures ?
• Paradis Fiscaux & Évasion : La lutte pour la transparence financière mondiale.

L'ÉCONOMIE DANS LA CITÉ
• Inégalités : Le coefficient de Gini et la concentration des richesses au sommet.
• Économie de Guerre : Réorientation de l'industrie vers les besoins militaires en temps de conflit.
• Croissance vs Décroissance : Le débat sur la viabilité du PIB comme seul indicateur de progrès.`,
    tags: ["Capitalisme", "Monnaie", "Fiscalité", "Marché", "Keynes"],
    links: [{ label: "Alternatives Économiques", url: "https://www.alternatives-economiques.fr" }]
  },
  {
    id: 4,
    title: "Diplomatie & Traités",
    emoji: "🤝",
    category: "politiques",
    summary: "L'art de la négociation internationale et les cadres juridiques qui régissent les relations entre États.",
    content: `La diplomatie est l'outil premier de la politique étrangère, visant à résoudre les conflits et construire des alliances sans recours à la force.

INSTRUMENTS DIPLOMATIQUES
• Ambassades & Consulats : Représentation permanente et protection des ressortissants.
• Sommets Internationaux : G7, G20, COP – des lieux de décision globale.
• Médiation & Arbitrage : L'intervention de tiers neutres pour désamorcer les tensions.

GRANDS TRAITÉS ET ORGANISATIONS
• ONU (Organisation des Nations Unies) : Le cadre multilatéral principal pour la paix et la sécurité.
• Traités de Non-Prolifération (TNP) : La gestion du risque nucléaire.
• Accords de Libre-Échange (ALENA, CETA) : La structuration du commerce mondial.
• Le Droit International : Un ensemble de règles souvent bousculées par les rapports de force réels.

LA DIPLOMATIE DE L'OMBRE
• Diplomatie Secrète : Négociations confidentielles loin des caméras.
• Backchanneling : Utilisation de canaux non officiels (académiques, business) pour maintenir le dialogue.
• Sanctions Économiques : Un outil de pression diplomatique entre la parole et l'épée.`,
    tags: ["Négociation", "ONU", "Traités", "Paix", "Alliances"],
    links: [{ label: "Quai d'Orsay", url: "https://www.diplomatie.gouv.fr" }]
  },
  {
    id: 5,
    title: "Mouvements Sociaux",
    emoji: "📢",
    category: "politiques",
    summary: "L'expression de la volonté populaire en dehors des cadres institutionnels. Protestations, grèves et activisme.",
    content: `Les mouvements sociaux sont des actions collectives cherchant à établir, modifier ou empêcher un changement social ou politique.

FORMES DE PROTESTATION
• Manifestations & Grèves : Occupation de l'espace public et arrêt de la production.
• Désobéissance Civile : Violation délibérée et pacifique d'une loi jugée injuste (Thoreau, Gandhi).
• Hacktivisme : Utilisation de l'outil informatique pour des causes politiques (Anonymous).
• Activisme Numérique : Campagnes virales, pétitions en ligne et organisation via les réseaux sociaux.

ÉVOLUTION HISTORIQUE
• Droits des Travailleurs : Syndicalisme, congés payés, sécurité sociale.
• Droits Civiques : Lutte contre les discriminations raciales et pour l'égalité.
• Féminisme : Suffrage, égalité salariale, droits reproductifs.
• Écologie Politique : Mouvements pour la préservation du climat et de la biodiversité.

DYNAMIQUES DE POUVOIR
• Répression vs Concession : Comment l'État répond à la pression de la rue.
• Récupération Politique : Quand les institutions intègrent les revendications pour neutraliser le mouvement.
• Radicalisation : Le passage à des formes d'action plus directes ou violentes.`,
    tags: ["Activisme", "Grève", "Société", "Changement", "Droits"],
    links: [{ label: "Le Monde - Mouvements Sociaux", url: "https://www.lemonde.fr/mouvements-sociaux/" }]
  },
  {
    id: 6,
    title: "Cyber-politique",
    emoji: "🌐",
    category: "politiques",
    summary: "Le cyberespace comme nouveau champ de bataille politique. Désinformation, cyberattaques et souveraineté numérique.",
    content: `La cyber-politique traite de l'impact des technologies numériques sur la vie politique, la sécurité nationale et les libertés publiques.

LA GUERRE DE L'INFORMATION
• Désinformation & Fake News : Utilisation de fausses informations pour influencer l'opinion publique et les scrutins.
• Fermes de Trolls : Opérations coordonnées pour amplifier certains récits sur les réseaux sociaux.
• Deepfakes : Manipulation vidéo/audio pour décrédibiliser des figures politiques.

CYBER-SÉCURITÉ NATIONALE
• Cyber-espionnage : Vol de secrets d'État ou industriels par voie numérique.
• Sabotage d'Infrastructures : Attaques sur les réseaux électriques, les hôpitaux ou les systèmes de vote.
• Armes Cyber : Virus sophistiqués (ex: Stuxnet) conçus pour détruire physiquement des installations.

DROITS ET LIBERTÉS NUMÉRIQUES
• Surveillance de Masse : L'utilisation du big data pour surveiller les citoyens (projet Pegasus).
• Souveraineté des Données : Le débat sur le stockage et la propriété des données personnelles.
• Neutralité du Net : Le principe d'un accès égal à tous les contenus sans discrimination par les fournisseurs.`,
    tags: ["Cyber", "Internet", "Désinformation", "Surveillance", "IA"],
    links: [{ label: "ANSSI", url: "https://www.ssi.gouv.fr" }]
  },

  // ===== HISTOIRES (6 cartes) =====
  {
    id: 7,
    title: "Civilisations Antiques",
    emoji: "🏛️",
    category: "histoires",
    summary: "Des pyramides d'Égypte aux cités-États de Grèce, explorez les fondations de l'organisation humaine.",
    content: `Les civilisations antiques ont posé les jalons de l'écriture, du droit, de l'architecture et de la philosophie qui structurent encore notre monde.

MÉSOPOTAMIE ET ÉGYPTE
• Berceau de l'écriture : Le cunéiforme sumérien et les hiéroglyphes égyptiens.
• Les Premiers Empires : Akkad, Babylone et l'Égypte pharaonique.
• Innovations : L'irrigation, la roue, le calendrier et les premiers codes de lois (Hammurabi).

GRÈCE ET ROME
• La Démocratie Athénienne : L'invention de la citoyenneté et du débat public.
• L'Empire Romain : L'unification de la Méditerranée, le droit romain et les prouesses d'ingénierie (aqueducs, routes).
• La Philosophie : Socrate, Platon et Aristote, racines de la pensée occidentale.

ASIE ET AMÉRIQUES
• La Chine Impériale : La Grande Muraille, l'invention du papier et de la poudre.
• Les Mayas et les Aztèques : Des civilisations aux connaissances astronomiques et mathématiques avancées.
• L'Empire Inca : Une organisation sociale et logistique impressionnante dans les Andes.

HÉRITAGE ET MYTHES
Les récits mythologiques grecs, égyptiens ou nordiques continuent d'irriguer notre culture, nos arts et notre compréhension de la psyché humaine.`,
    tags: ["Antiquité", "Archéologie", "Empire", "Égypte", "Grèce", "Rome"],
    links: [{ label: "Musée du Louvre - Antiquités", url: "https://www.louvre.fr/decouvrir/les-collections/antiquites-orientales" }]
  },
  {
    id: 8,
    title: "Révolutions Mondiales",
    emoji: "🔥",
    category: "histoires",
    summary: "Les moments de rupture brutale qui ont changé le cours de l'histoire, de 1789 aux révolutions numériques.",
    content: `Une révolution est un changement brusque et radical dans la structure politique et sociale d'un État.

LES RÉVOLUTIONS POLITIQUES
• 1789 - Révolution Française : La fin de l'Ancien Régime, la Déclaration des Droits de l'Homme et du Citoyen.
• 1776 - Indépendance Américaine : La naissance de la première démocratie moderne.
• 1917 - Révolution Russe : La chute des Tsars et l'avènement du bloc communiste.

LES RÉVOLUTIONS INDUSTRIELLES
• 1ère Révolution (18e) : La machine à vapeur, le charbon et le textile.
• 2ème Révolution (19e) : L'électricité, le pétrole et la production de masse (Fordisme).
• 3ème Révolution (20e) : L'informatique, l'électronique et le nucléaire.

RÉVOLUTIONS SOCIOCULTURELLES
• La Renaissance : Redécouverte de l'Antiquité et humanisme.
• Mai 68 : Libération des mœurs et remise en cause de l'autorité.
• La Révolution Numérique : Transformation profonde de nos modes de communication et d'accès au savoir.

DYNAMIQUES DE RÉVOLUTION
Souvent déclenchées par une crise économique ou une injustice flagrante, les révolutions passent par des phases d'euphorie, de terreur, puis de stabilisation.`,
    tags: ["Révolution", "Changement", "1789", "Industrie", "Société"],
    links: [{ label: "L'Histoire par l'image", url: "https://histoire-image.org" }]
  },
  {
    id: 9,
    title: "Histoire des Sciences",
    emoji: "🔬",
    category: "histoires",
    summary: "De l'alchimie à la physique quantique, comment l'humanité a appris à décoder les lois de l'univers.",
    content: `L'histoire des sciences raconte la quête perpétuelle de l'homme pour comprendre et maîtriser son environnement par l'observation et la raison.

LES PIONNIERS
• Aristote & l'Antiquité : Classification du vivant et logique.
• L'Âge d'Or Islamique : Avancées majeures en algèbre (Al-Khwarizmi), médecine (Avicenne) et optique.
• La Révolution Copernicienne : Galilée et Newton brisent la vision géocentrique de l'univers.

L'ÈRE MODERNE
• Darwin et l'Évolution : La biologie change de paradigme avec la sélection naturelle.
• Pasteur et la Microbiologie : La découverte des microbes révolutionne la médecine et l'hygiène.
• Einstein et la Relativité : Le temps et l'espace ne sont plus des absolus.

SCIENCES CONTEMPORAINES
• La Découverte de l'ADN : Watson, Crick et Franklin ouvrent l'ère de la génétique.
• L'Informatique : De Turing aux supercalculateurs.
• L'Exploration Spatiale : De Spoutnik à James Webb, l'humanité regarde vers les étoiles.

ÉPISTÉMOLOGIE
La science ne progresse pas seulement par accumulation, mais par ruptures (les "paradigmes" de Thomas Kuhn) où une ancienne vision du monde s'effondre au profit d'une nouvelle plus précise.`,
    tags: ["Science", "Invention", "Découverte", "Newton", "Einstein"],
    links: [{ label: "CNRS - Histoire des sciences", url: "https://www.cnrs.fr/fr/histoire-des-sciences" }]
  },
  {
    id: 10,
    title: "Les Grandes Guerres",
    emoji: "⚔️",
    category: "histoires",
    summary: "Analyse des conflits majeurs du 20e siècle et leur impact sur le remodelage de la carte du monde.",
    content: `Les conflits mondiaux ont été des catalyseurs de tragédies humaines immenses mais aussi de transformations géopolitiques radicales.

PREMIÈRE GUERRE MONDIALE (1914-1918)
• La guerre des tranchées et l'industrialisation de la mort.
• La chute des quatre empires (Allemand, Austro-Hongrois, Ottoman, Russe).
• Le Traité de Versailles : Une paix fragile qui portera les germes du conflit suivant.

DEUXIÈME GUERRE MONDIALE (1939-1945)
• Un conflit total impliquant civils et militaires sur tous les continents.
• La Shoah : Le génocide industriel des Juifs d'Europe.
• L'arme nucléaire : Hiroshima et Nagasaki changent la nature de la guerre.

LA GUERRE FROIDE (1947-1991)
• Un affrontement idéologique entre USA et URSS sans combat direct massif.
• La course à l'espace et l'équilibre de la terreur (MAD).
• Les conflits par procuration (Corée, Vietnam, Afghanistan).

HÉRITAGE MILITAIRE ET CIVIL
Les guerres ont accéléré des technologies civiles : aviation, antibiotiques, internet (ARPANET) et énergie nucléaire. Elles ont aussi mené à la création de l'ONU pour éviter de nouveaux embrasements.`,
    tags: ["Guerre", "14-18", "39-45", "Stratégie", "Mémoire"],
    links: [{ label: "Mémorial de Caen", url: "https://www.memorial-caen.fr" }]
  },
  {
    id: 11,
    title: "Histoire de l'Art",
    emoji: "🎨",
    category: "histoires",
    summary: "Un voyage à travers les styles et les époques, du rupestre au contemporain, miroir de l'âme humaine.",
    content: `L'art est le témoignage visuel des aspirations, des peurs et de la beauté d'une époque donnée.

DES ORIGINES À LA RENAISSANCE
• Art Rupestre : Les premières expressions sacrées (Lascaux, Chauvet).
• Moyen Âge : L'art au service du divin, de l'enluminure aux cathédrales gothiques.
• Renaissance : Le retour au réalisme, à la perspective et à l'humanisme (Léonard de Vinci, Michel-Ange).

DU BAROQUE À L'IMPRESSIONNISME
• Baroque & Classique : Le mouvement, le drame et la majesté royale (Le Caravage, Versailles).
• Romantisme : L'exaltation des sentiments et de la nature sauvage (Delacroix, Turner).
• Impressionnisme : La capture de la lumière et de l'instant (Monet, Renoir).

L'ART MODERNE ET CONTEMPORAIN
• Les Avant-gardes : Cubisme, Surréalisme et Abstraction brisent les règles de la représentation.
• Pop Art : L'intégration de la culture de masse (Warhol).
• Art Numérique & NFT : Les nouvelles frontières de la création et de la propriété artistique.

FONCTION DE L'ART
L'art n'est pas seulement esthétique ; il est politique, subversif, thérapeutique et constitue la mémoire sensible de l'humanité.`,
    tags: ["Art", "Peinture", "Renaissance", "Musée", "Esthétique"],
    links: [{ label: "Panorama de l'Art", url: "https://www.panoramadelart.com" }]
  },
  {
    id: 12,
    title: "Archéologie Moderne",
    emoji: "🏺",
    category: "histoires",
    summary: "Comment les nouvelles technologies (Lidar, ADN) révèlent les secrets enfouis de nos ancêtres.",
    content: `L'archéologie n'est plus seulement une affaire de pelles et de pinceaux, elle est devenue une science de haute technologie.

RECHERCHE DE POINTE
• LiDAR (Light Detection and Ranging) : Révèle des cités perdues sous la jungle (Mayas) par balayage laser.
• Archéologie Spatiale : Utilisation des satellites pour repérer des structures invisibles au sol.
• Paléogénétique : L'étude de l'ADN ancien pour tracer les migrations humaines.

DÉCOUVERTES RÉCENTES
• Göbekli Tepe (Turquie) : Le plus vieux temple du monde, remettant en cause l'ordre d'apparition de la religion et de l'agriculture.
• Citées immergées : Thonis-Héracléion en Égypte, redécouverte sous les eaux de la Méditerranée.
• Trésors de la Route de la Soie : Révélations sur les échanges mondiaux anciens.

ÉTHIQUE ET CONSERVATION
• Restitution des biens culturels : Le débat sur le retour des objets pillés pendant la colonisation.
• Préservation numérique : Scanner en 3D des sites menacés par les conflits ou le climat.

L'archéologie nous permet de comprendre que nous ne sommes qu'un chapitre d'une très longue histoire, et que des civilisations entières peuvent disparaître tout en laissant des traces indélébiles.`,
    tags: ["Archéologie", "Lidar", "Histoire", "Patrimoine", "Science"],
    links: [{ label: "INRAP", url: "https://www.inrap.fr" }]
  },

  // ===== PHILOSOPHIE (6 cartes) =====
  {
    id: 13,
    title: "Stoïcisme",
    emoji: "🗿",
    category: "philosophie",
    summary: "L'art de rester serein face au chaos. Distinguer ce qui dépend de nous de ce qui n'en dépend pas.",
    content: `Le stoïcisme est une philosophie pratique née en Grèce antique et florissante à Rome, visant la tranquillité de l'âme (ataraxie) par la raison.

LES TROIS PILIERS
1. La Logique : Comprendre comment nous pensons et percevons le monde.
2. La Physique : Comprendre l'ordre de la nature et notre place dans l'univers.
3. L'Éthique : Comment agir avec vertu.

DICHOTOMIE DU CONTRÔLE
C'est le concept central d'Épictète :
• Ce qui dépend de nous : Nos opinions, nos intentions, nos désirs, nos actions.
• Ce qui ne dépend pas de nous : Le corps, la richesse, la réputation, l'opinion des autres, la mort.
Souffrir vient de l'attachement à ce que nous ne contrôlons pas.

PRATIQUES QUOTIDIENNES
• Premeditatio Malorum : Visualiser les difficultés possibles pour ne pas être surpris.
• Amor Fati : Aimer son destin, accepter ce qui arrive comme une opportunité.
• Memento Mori : Se souvenir de notre mortalité pour chérir l'instant présent.

FIGURES CLÉS
• Marc Aurèle : L'empereur philosophe et ses "Pensées pour moi-même".
• Sénèque : Ses lettres sur la brièveté de la vie et la fermeté d'âme.
• Épictète : L'esclave devenu maître, auteur du "Manuel".`,
    tags: ["Sagesse", "Sénèque", "Éthique", "Mental", "Marc Aurèle"],
    links: [{ label: "Daily Stoic", url: "https://dailystoic.com" }]
  },
  {
    id: 14,
    title: "Existentialisme",
    emoji: "🚬",
    category: "philosophie",
    summary: "L'existence précède l'essence. Nous sommes condamnés à être libres et à créer notre propre sens.",
    content: `L'existentialisme place l'individu, sa liberté et sa responsabilité au centre de la réflexion philosophique.

CONCEPTS CLÉS
• L'Existence précède l'Essence (Sartre) : Contrairement à un objet (un coupe-papier conçu pour une fin), l'homme surgit dans le monde sans définition préalable. Il se définit par ses actes.
• L'Angoisse : Le vertige face à la liberté absolue de choix.
• La Mauvaise Foi : Se mentir à soi-même en prétendant qu'on n'a pas le choix (déterminisme).

LE SENS DE LA VIE
• L'Absurde (Camus) : Le divorce entre l'appel de l'homme à la cohérence et le silence déraisonnable du monde.
• La Révolte : Continuer à vivre et à créer malgré l'absence de sens transcendant (Le Mythe de Sisyphe).
• Authenticité : Vivre en accord avec ses propres valeurs plutôt que de suivre la "foule" (Kierkegaard, Heidegger).

INFLUENCE
L'existentialisme a profondément marqué la littérature (Sartre, Beauvoir, Camus), le théâtre de l'absurde (Beckett) et la psychologie humaniste.`,
    tags: ["Sartre", "Camus", "Liberté", "Absurde", "Individu"],
    links: [{ label: "Simone de Beauvoir - Philo", url: "https://www.franceculture.fr/personne-simone-de-beauvoir" }]
  },
  {
    id: 15,
    title: "Philosophie de l'Esprit",
    emoji: "🧠",
    category: "philosophie",
    summary: "Qu'est-ce que la conscience ? Le problème corps-esprit et les défis de l'IA consciente.",
    content: `Cette branche de la philosophie étudie la nature de l'esprit, de la conscience et leurs relations avec le corps physique.

LE PROBLÈME CORPS-ESPRIT
• Dualisme (Descartes) : L'esprit et la matière sont deux substances distinctes ("Je pense donc je suis").
• Monisme/Matérialisme : L'esprit n'est qu'un produit du fonctionnement complexe du cerveau (neurones).
• Fonctionnalisme : L'esprit est au cerveau ce que le logiciel est au matériel (indépendant du support).

LA CONSCIENCE (QUALIA)
• Le "Hard Problem" (David Chalmers) : Pourquoi et comment des processus physiques donnent-ils naissance à une expérience subjective (le rouge du rouge, la douleur) ?
• Les Qualia : Les propriétés subjectives de l'expérience sensible.

L'INTELLIGENCE ARTIFICIELLE
• Chambre Chinoise (John Searle) : Un système peut-il manipuler des symboles parfaitement sans jamais comprendre leur sens ?
• Test de Turing : Suffit-il de paraître intelligent pour l'être ?
• Panpsychisme : L'idée que la conscience est une propriété fondamentale de toute matière, à des degrés divers.`,
    tags: ["Conscience", "Cerveau", "Dualisme", "IA", "Descartes"],
    links: [{ label: "Stanford Encyclopedia of Philosophy - Mind", url: "https://plato.stanford.edu/entries/mind-identity/" }]
  },
  {
    id: 16,
    title: "Éthique & Morale",
    emoji: "⚖️",
    category: "philosophie",
    summary: "Comment déterminer ce qui est juste ? Utilitarisme, déontologie et éthique de la vertu.",
    content: `L'éthique est la réflexion sur les valeurs et les principes qui doivent guider nos actions pour "bien vivre".

TROIS GRANDES APPROCHES
1. Utilitarisme (Bentham, Mill) : Agir de manière à maximiser le bonheur pour le plus grand nombre. "La fin justifie les moyens."
2. Déontologie (Kant) : Agir par devoir selon des règles universelles. "Agis de telle sorte que la maxime de ton action puisse être érigée en loi universelle."
3. Éthique de la Vertu (Aristote) : L'important n'est pas la règle ou le résultat, mais le caractère de la personne. Cultiver le "juste milieu".

DILEMMES CÉLÈBRES
• Le Dilemme du Tramway : Faut-il sacrifier une personne pour en sauver cinq ?
• Le Mensonge par Compassion : Doit-on toujours dire la vérité, même si elle blesse ?

ÉTHIQUE APPLIQUÉE
• Bioéthique : Clonage, fin de vie, manipulation génétique.
• Éthique de l'IA : Biais, responsabilité des voitures autonomes.
• Éthique Environnementale : Quels sont nos devoirs envers les animaux et les générations futures ?`,
    tags: ["Justice", "Morale", "Kant", "Valeurs", "Droit"],
    links: [{ label: "Éthique Publique", url: "https://www.ccne-ethique.fr" }]
  },
  {
    id: 17,
    title: "Métaphysique",
    emoji: "🌌",
    category: "philosophie",
    summary: "L'étude de la réalité ultime. Temps, espace, causalité et l'existence du monde.",
    content: `La métaphysique s'interroge sur ce qui existe "au-delà" de la physique, sur les principes premiers de la réalité.

QUESTIONS FONDAMENTALES
• Pourquoi y a-t-il quelque chose plutôt que rien ? (Leibniz)
• Qu'est-ce que le Temps ? Est-ce une illusion, une dimension ou un flux ?
• Identité Personnelle : Qu'est-ce qui fait que je suis la même personne à 5 ans et à 80 ans ?

LES CATÉGORIES DE L'ÊTRE
• Ontologie : L'étude de l'être en tant qu'être. Qu'est-ce qui est "réel" ?
• Substance vs Accidant : L'essence immuable d'une chose vs ses propriétés changeantes.
• Universaux : Les concepts généraux (ex: "le rouge") existent-ils réellement ou ne sont-ils que des mots ?

MÉTAPHYSIQUE ET SCIENCE
La métaphysique fournit souvent les cadres dans lesquels la science opère (notion de causalité, de lois de la nature). La physique quantique aujourd'hui repousse les frontières et oblige à une nouvelle métaphysique.`,
    tags: ["Réalité", "Ontologie", "Temps", "Être", "Existence"],
    links: [{ label: "PhiloLog - Métaphysique", url: "https://www.philolog.fr/la-metaphysique/" }]
  },
  {
    id: 18,
    title: "Philosophie Politique",
    emoji: "🗳️",
    category: "philosophie",
    summary: "Comment organiser la cité ? Contrat social, justice et distribution du pouvoir.",
    content: `Cette branche explore les fondements de l'autorité, de la justice et des droits dans la société.

LE CONTRAT SOCIAL
• Thomas Hobbes : L'homme est un loup pour l'homme, il faut un État fort (Léviathan) pour garantir la paix.
• John Locke : L'État doit protéger les droits naturels (vie, liberté, propriété). Fondement du libéralisme.
• J-J Rousseau : La volonté générale et la souveraineté du peuple.

THÉORIES DE LA JUSTICE
• Platon : La République dirigée par des philosophes-rois.
• Karl Marx : Critique de l'exploitation et lutte des classes.
• John Rawls : La "Théorie de la Justice" et le voile d'ignorance – comment choisir des règles justes si on ignore sa place dans la société.

DÉFIS ACTUELS
• Globalisation : Comment exercer la justice au-delà des frontières nationales ?
• Écologie : Les droits de la nature et des générations futures.
• Technologie : La démocratie à l'ère des algorithmes.`,
    tags: ["Justice", "Contrat Social", "Rousseau", "Liberté", "Pouvoir"],
    links: [{ label: "La Vie des Idées", url: "https://laviedesidees.fr" }]
  },

  // ===== ÉSOTÉRISME (6 cartes) =====
  {
    id: 19,
    title: "Alchimie Hermétique",
    emoji: "🧪",
      category: "esotherisme",
    summary: "Bien plus que changer le plomb en or, l'alchimie est une quête de perfection spirituelle et de connaissance des lois cachées de la matière.",
    content: `L'alchimie hermétique est une tradition millénaire qui unit science expérimentale et philosophie mystique.

LE GRAND ŒUVRE (MAGNUM OPUS)
Il représente le processus de purification de l'âme à travers quatre phases symboliques :
• Nigredo (Noir) : Phase de décomposition, de descente dans ses propres ténèbres.
• Albedo (Blanc) : Purification et illumination de l'esprit.
• Citrinitas (Jaune) : Éveil de la conscience solaire.
• Rubedo (Rouge) : Accomplissement final, fusion du spirituel et du matériel (la Pierre Philosophale).

LES TROIS PRINCIPES
Paracelse a défini les bases de la matière alchimique :
1. Le Soufre : Le principe actif, l'âme, le feu.
2. Le Mercure : Le principe fluide, l'esprit, l'eau.
3. Le Sel : Le principe stable, le corps, la terre.

LA PIERRE PHILOSOPHALE
Symbole de la connaissance ultime, elle est censée permettre la transmutation des métaux vils en or, mais surtout d'offrir l'élixir de longue vie et la sagesse absolue.

JUNG ET L'ALCHIMIE
Pour le psychiatre Carl Jung, l'alchimie n'était pas une erreur scientifique, mais une projection de la psychologie humaine cherchant à unifier ses contraires.`,
    tags: ["Hermétisme", "Transmutation", "Jung", "Esprit", "Matière"],
    links: [{ label: "Alchemy Website", url: "http://www.levity.com/alchemy/" }]
  },
  {
    id: 20,
    title: "Kabbale Mystique",
    emoji: "🌳",
      category: "esotherisme",
    summary: "L'Arbre de Vie kabbalistique, une carte multidimensionnelle de l'univers et de la conscience humaine.",
    content: `La Kabbale est une tradition mystique issue du judaïsme, cherchant à décoder les secrets de la création et du divin.

L'ARBRE DE VIE (ETZ HAIM)
Composé de 10 Sephiroth (sphères d'énergie) reliées par 22 chemins, il représente :
• La structure de l'univers (du divin au matériel).
• Les étapes de la conscience humaine vers l'éveil.
• Les attributs de Dieu (Sagesse, Beauté, Force, etc.).

LES TEXTES FONDATEURS
• Le Zohar : Le livre de la splendeur, commentaire mystique de la Torah.
• Le Sefer Yetzirah : Le livre de la formation, traitant des lettres hébraïques comme briques de la création.

GEMATRIA
L'art d'analyser les textes par la valeur numérique des lettres, révélant des liens cachés entre les mots et les concepts.

LA KABBALE AUJOURD'HUI
Au-delà de son aspect religieux, la Kabbale influence de nombreux courants de pensée ésotériques occidentaux et la psychologie transpersonnelle.`,
    tags: ["Mystique", "Hébreu", "Énergie", "Sagesse", "Arbre de Vie"],
    links: [{ label: "Kabbalah Centre", url: "https://www.kabbalah.com" }]
  },
  {
    id: 21,
    title: "Astrologie Esotérique",
    emoji: "✨",
      category: "esotherisme",
    summary: "L'étude des correspondances entre les mouvements célestes et les cycles de l'âme humaine.",
    content: `L'astrologie ésotérique se distingue de l'astrologie populaire par sa recherche du sens profond et de l'évolution de l'âme.

LES SEPT RAYONS
Une doctrine enseignant que sept énergies fondamentales animent l'univers, chaque signe et planète étant un véhicule pour ces rayons.

L'ASCENDANT COMME BUT DE L'ÂME
En astrologie ésotérique, alors que le Soleil représente la personnalité, l'Ascendant indique la direction que l'âme souhaite prendre dans cette incarnation.

LES PLANÈTES TRANS-SATURNIENNES
Uranus, Neptune et Pluton sont vues comme des "octaves supérieures", régissant les transformations collectives et spirituelles profondes dépassant l'ego individuel.

LA LOI DE CORRESPONDANCE
"Ce qui est en haut est comme ce qui est en bas". Les cycles planétaires sont le miroir de nos cycles de croissance intérieure, de crise et de renouveau.`,
    tags: ["Astrologie", "Cosmos", "Âme", "Cycles", "Zodiaque"],
    links: [{ label: "Esoteric Astrology", url: "https://www.esotericastrology.org" }]
  },
  {
    id: 22,
    title: "Symbolisme Sacré",
    emoji: "💠",
      category: "esotherisme",
    summary: "Le langage caché des formes et des nombres. Géométrie sacrée et archétypes universels.",
    content: `Le symbolisme sacré étudie les formes et les motifs qui se répètent à travers les cultures et la nature comme signatures d'un ordre supérieur.

GÉOMÉTRIE SACRÉE
• Le Nombre d'Or (Phi) : Présent dans les coquillages, les galaxies et l'art classique.
• La Fleur de Vie : Un motif géométrique contenant les modèles de base de la création.
• Le Vesica Piscis : Symbole de la fusion de deux mondes.

LES NOMBRES COMME ÉNERGIES
• Un : L'Unité, le Tout.
• Deux : La Dualité, la Polarité.
• Trois : La Trinité, la Création.
• Quatre : La Stabilité, le Monde Matériel.

ARCHÉTYPES UNIVERSELS
Des symboles comme le labyrinthe, l'ouroboros (le serpent qui se mord la queue) ou la montagne sacrée se retrouvent dans toutes les mythologies mondiales, parlant directement à l'inconscient.

L'USAGE DES SYMBOLES
Dans l'ésotérisme, le symbole n'est pas qu'une décoration ; c'est un outil de méditation et de concentration capable d'activer certaines facultés psychiques.`,
    tags: ["Géométrie", "Symboles", "Architecture", "Nature", "Nombres"],
    links: [{ label: "Sacred Geometry", url: "https://www.geometrycode.com" }]
  },
  {
    id: 23,
    title: "Tarot de Marseille",
    emoji: "🃏",
      category: "esotherisme",
    summary: "Un livre d'images sans reliure. Le tarot comme outil de projection psychologique et de divination.",
    content: `Le Tarot de Marseille est l'un des jeux de cartes les plus célèbres, utilisé depuis des siècles pour la guidance et la méditation.

LES ARCANES MAJEURS
22 cartes représentant le voyage de "Le Mat" (l'Innocent) à travers les étapes de la vie :
• Le Bateleur : Le potentiel et les outils.
• La Papesse : La connaissance cachée.
• L'Arcane sans Nom (La Mort) : La transformation radicale.
• Le Monde : L'accomplissement total.

LES ARCANES MINEURS
56 cartes divisées en quatre suites (Deniers, Coupes, Épées, Bâtons) correspondant aux quatre éléments et aux domaines de la vie matérielle.

TAROT ET PSYCHOLOGIE
Jodorowsky et Jung ont utilisé le tarot comme miroir de l'inconscient. Les images agissent comme des déclencheurs pour révéler nos blocages ou nos aspirations cachées.

PRATIQUE DU TIRAGE
Le tirage n'est pas une prédiction figée du futur, mais une analyse énergétique du présent permettant de prendre de meilleures décisions.`,
    tags: ["Tarot", "Divination", "Psychologie", "Symbolisme", "Intuition"],
    links: [{ label: "Camoin - Tarot de Marseille", url: "https://fr.camoin.com" }]
  },
  {
    id: 24,
    title: "Hermétisme",
    emoji: "🕯️",
      category: "esotherisme",
    summary: "La tradition d'Hermès Trismégiste et les 7 principes universels du Kybalion.",
    content: `L'hermétisme est la philosophie à la base de l'ésotérisme occidental, issue de l'Égypte et de la Grèce antiques.

LES 7 PRINCIPES DU KYBALION
1. Le Mentalisme : Tout est Esprit ; l'Univers est Mental.
2. La Correspondance : Ce qui est en haut est comme ce qui est en bas.
3. La Vibration : Rien ne repose ; tout remue ; tout vibre.
4. La Polarité : Tout est double ; toute chose possède deux pôles.
5. Le Rythme : Tout s'écoule ; tout a ses marées.
6. La Cause et l'Effet : Toute Cause a son Effet ; tout Effet a sa Cause.
7. Le Genre : Le genre est en toutes choses.

HERMÈS TRISMÉGISTE
Personnage légendaire, "Trois Fois Grand", censé avoir réuni la sagesse des rois, des prêtres et des philosophes.

LA TRANSMISSION DU SAVOIR
L'hermétisme a influencé la science moderne (Isaac Newton était un fervent alchimiste) et continue d'inspirer les mouvements de développement personnel et spirituel.`,
    tags: ["Kybalion", "Philosophie", "Lois", "Esprit", "Hermès"],
    links: [{ label: "Corpus Hermeticum", url: "https://www.sacred-texts.com/eso/CH" }]
  },

  // ===== DEV PERSO (6 cartes) =====
  {
    id: 25,
    title: "Psychologie Cognitive",
    emoji: "🧠",
    category: "devperso",
    summary: "Comprendre comment notre cerveau traite l'information pour optimiser notre apprentissage et nos décisions.",
    content: `La psychologie cognitive étudie les processus mentaux : perception, mémoire, raisonnement et résolution de problèmes.

BIAIS COGNITIFS
Notre cerveau utilise des raccourcis (heuristiques) qui nous trompent souvent :
• Biais de confirmation : Ne chercher que les infos qui confirment nos croyances.
• Effet Dunning-Kruger : Les moins compétents surestiment leurs capacités.
• Biais d'ancrage : Se fier excessivement à la première information reçue.

MÉMOIRE ET APPRENTISSAGE
• Répétition Espacée : Technique pour ancrer les connaissances sur le long terme.
• Chunking : Diviser l'information complexe en blocs digestibles.
• Sommeil : Crucial pour la consolidation de la mémoire.

PLASTICITÉ CÉRÉBRALE
L'idée révolutionnaire que notre cerveau peut se remodeler à tout âge par l'apprentissage et l'entraînement délibéré.`,
    tags: ["Cerveau", "Biais", "Apprentissage", "Efficacité", "Mental"],
    links: [{ label: "Psychology Today", url: "https://www.psychologytoday.com" }]
  },
  {
    id: 26,
    title: "Productivité & Focus",
    emoji: "🎯",
    category: "devperso",
    summary: "Maîtriser son attention dans un monde de distractions. Deep Work et gestion du temps.",
    content: `La productivité n'est pas faire plus, mais faire ce qui compte vraiment avec une intensité maximale.

DEEP WORK (Cal Newport)
La capacité de se concentrer sans distraction sur une tâche cognitivement exigeante. C'est une compétence de plus en plus rare et précieuse.

SYSTÈMES DE GESTION
• La Matrice d'Eisenhower : Distinguer l'Urgent de l'Important.
• La Méthode Pomodoro : Travailler par blocs de 25 minutes pour maintenir la fraîcheur mentale.
• Getting Things Done (GTD) : Libérer son cerveau en notant tout dans un système fiable.

LA GUERRE DE L'ATTENTION
Comprendre comment les algorithmes des réseaux sociaux exploitent notre dopamine pour nous garder captifs, et apprendre à reprendre le contrôle par le "Minimalisme Numérique".`,
    tags: ["Focus", "Temps", "Travail", "Discipline", "Dopamine"],
    links: [{ label: "Cal Newport Blog", url: "https://www.calnewport.com/blog/" }]
  },
  {
    id: 27,
    title: "Intelligence Émotionnelle",
    emoji: "❤️",
    category: "devperso",
    summary: "Reconnaître, comprendre et gérer ses propres émotions et celles des autres.",
    content: `L'Intelligence Émotionnelle (QE) est souvent un prédicteur de succès plus important que le QI dans la vie personnelle et professionnelle.

LES 5 COMPOSANTES (Daniel Goleman)
1. Conscience de soi : Reconnaître ses émotions au moment où elles surviennent.
2. Maîtrise de soi : Savoir canaliser ses pulsions et émotions perturbatrices.
3. Motivation : Utiliser ses émotions pour atteindre ses objectifs.
4. Empathie : Percevoir les sentiments des autres.
5. Aptitudes sociales : Gérer les relations et influencer positivement.

RÉGULATION ÉMOTIONNELLE
Techniques comme le recadrage cognitif (changer sa perspective sur un événement) ou la pause respiratoire pour éviter les réactions impulsives.

L'EMPATHIE RADICALE
Comprendre le point de vue de l'autre sans nécessairement être d'accord, outil fondamental de la négociation et de la paix sociale.`,
    tags: ["Empathie", "Relations", "Émotions", "Leadership", "Social"],
    links: [{ label: "Daniel Goleman", url: "https://www.danielgoleman.info" }]
  },
  {
    id: 28,
    title: "Habitudes Atomiques",
    emoji: "⚛️",
    category: "devperso",
    summary: "Le pouvoir des petits changements. Comment construire des habitudes durables et briser les mauvaises.",
    content: `Le succès est le produit d'habitudes quotidiennes, non de transformations uniques.

LA LOI DU 1% (James Clear)
S'améliorer de 1% chaque jour mène à des résultats exponentiels sur un an (37 fois meilleur).

LE CYCLE DE L'HABITUDE
1. Le Signal : Déclencheur visuel ou contextuel.
2. L'Envie : L'anticipation de la récompense.
3. La Réponse : L'action elle-même (l'habitude).
4. La Récompense : Le bénéfice immédiat qui valide le cycle.

STRATÉGIES DE MISE EN PLACE
• Empilement d'habitudes : Greffer une nouvelle habitude sur une ancienne (ex: "Après mon café, je médite 2 minutes").
• La Règle des 2 Minutes : Commencer une habitude si petite qu'elle est impossible à rater.
• Design de l'Environnement : Rendre les bons signaux évidents et les mauvais invisibles.`,
    tags: ["Habitudes", "Routine", "Changement", "James Clear", "Discipline"],
    links: [{ label: "James Clear - Atomic Habits", url: "https://jamesclear.com/atomic-habits" }]
  },
  {
    id: 29,
    title: "Méditation & Pleine Conscience",
    emoji: "🧘",
    category: "devperso",
    summary: "Entraîner son esprit à rester dans le présent. Réduction du stress et clarté mentale.",
    content: `La méditation est une pratique millénaire validée par les neurosciences modernes pour ses bienfaits sur la santé mentale et physique.

LA PLEINE CONSCIENCE (Mindfulness)
Porter son attention sur l'instant présent, sans jugement. Observer ses pensées comme des nuages qui passent sans s'y attacher.

BÉNÉFICES PROUVÉS
• Réduction du cortisol (hormone du stress).
• Amélioration de la concentration et de la régulation émotionnelle.
• Épaississement de la matière grise dans les zones liées à l'apprentissage et à la mémoire.

MODES DE PRATIQUE
• Méditation assise : Focus sur la respiration.
• Body Scan : Balayage mental des sensations corporelles.
• Méditation marchée : Conscience du mouvement.
• Méditation de l'Amour Bienveillant (Metta) : Cultiver la compassion envers soi et les autres.`,
    tags: ["Zen", "Stress", "Santé", "Présent", "Neuroscience"],
    links: [{ label: "Mindful.org", url: "https://www.mindful.org" }]
  },
  {
    id: 30,
    title: "Communication Non-Violente",
    emoji: "💬",
    category: "devperso",
    summary: "L'art de s'exprimer avec clarté et d'écouter avec empathie pour résoudre les conflits.",
    content: `La CNV (Marshall Rosenberg) est un processus de communication qui permet de transformer les conflits en dialogue constructif.

LES 4 ÉTAPES (OSBD)
1. Observation : Décrire les faits sans juger ni évaluer.
2. Sentiment : Exprimer ce que l'on ressent (je suis triste, en colère) plutôt que ce que l'on pense de l'autre (tu es méchant).
3. Besoin : Identifier le besoin universel non satisfait (respect, sécurité, autonomie).
4. Demande : Formuler une demande concrète, positive et réalisable.

L'ÉCOUTE EMPATHIQUE
Accueillir le message de l'autre en cherchant à deviner ses sentiments et besoins, même s'il s'exprime de manière agressive.

TRANSFORMER SON DIALOGUE INTÉRIEUR
Appliquer la CNV à soi-même pour sortir de l'auto-critique destructrice et mieux comprendre ses propres motivations profonds.`,
    tags: ["Communication", "Empathie", "Conflit", "Écoute", "CNV"],
    links: [{ label: "CNV France", url: "https://www.cnvfrance.fr" }]
  },

  // ===== CRYPTO (6 cartes) =====
  {
    id: 31,
    title: "Bitcoin & Rareté Numérique",
    emoji: "₿",
    category: "crypto",
    summary: "L'invention de l'or numérique. Comprendre pourquoi 21 millions est un nombre qui change l'économie mondiale.",
    content: `Bitcoin est la première monnaie décentralisée, créée en 2009 par Satoshi Nakamoto. Son innovation majeure est la résolution du problème de la double dépense sans tiers de confiance.

LA RARETÉ ABSOLUE
Il n'y aura jamais plus de 21 millions de Bitcoins. Cette limite est inscrite dans le code et protégée par la puissance de calcul du réseau mondial.
• Le Halving : Tous les 4 ans environ, la création de nouveaux Bitcoins est divisée par deux, augmentant mécaniquement la rareté.

PROOF OF WORK (PREUVE DE TRAVAIL)
Les mineurs utilisent de l'énergie pour sécuriser le réseau. Ce lien avec le monde physique rend le Bitcoin impossible à falsifier sans un coût prohibitif.

RÉSERVE DE VALEUR VS MONNAIE
Souvent comparé à l'or (Or Numérique), Bitcoin est utilisé comme protection contre l'inflation des monnaies fiduciaires (Dollar, Euro) dont la masse peut être augmentée à l'infini par les banques centrales.`,
    tags: ["Bitcoin", "Blockchain", "Satoshi", "Finance", "Mining"],
    links: [{ label: "Bitcoin.org", url: "https://bitcoin.org" }]
  },
  {
    id: 32,
    title: "Ethereum & Smart Contracts",
    emoji: "Ξ",
    category: "crypto",
    summary: "L'ordinateur mondial. Comment Ethereum permet de coder des accords financiers sans avocats ni banques.",
    content: `Si Bitcoin est l'or numérique, Ethereum est l'infrastructure d'un nouvel internet programmable.

SMART CONTRACTS (CONTRATS INTELLIGENTS)
Ce sont des programmes autonomes qui s'exécutent sur la blockchain. Si les conditions X sont remplies, alors l'action Y est déclenchée. Ils sont irréversibles et transparents.

L'ORDINATEUR MONDIAL (EVM)
L'Ethereum Virtual Machine permet de faire tourner des applications décentralisées (dApps) sans serveur central, rendant le système résistant à la censure.

LE PASSAGE AU PROOF OF STAKE
Depuis "The Merge", Ethereum ne consomme quasiment plus d'énergie, sécurisant le réseau par le verrouillage (staking) de jetons ETH plutôt que par la puissance de calcul.`,
    tags: ["Ethereum", "Smart Contracts", "Web3", "Staking", "ETH"],
    links: [{ label: "Ethereum.org", url: "https://ethereum.org" }]
  },
  {
    id: 33,
    title: "DeFi (Finance Décentralisée)",
    emoji: "🏦",
    category: "crypto",
    summary: "Reconstruire le système financier sur la blockchain. Prêts, échanges et intérêts sans intermédiaires.",
    content: `La DeFi vise à remplacer les fonctions bancaires traditionnelles par des protocoles de code ouverts.

ÉCHANGES DÉCENTRALISÉS (DEX)
Des plateformes comme Uniswap permettent d'échanger des actifs sans qu'une entreprise ne détienne vos fonds. Le prix est fixé par des algorithmes (Automated Market Makers).

PRÊTS ET EMPRUNTS
Des protocoles comme Aave permettent de prêter vos cryptos pour gagner des intérêts, ou d'emprunter des fonds en déposant une garantie, le tout de manière instantanée et sans vérification de dossier.

STABLECOINS
Des jetons indexés sur le dollar (comme l'USDC ou le DAI) qui permettent de conserver de la valeur sans subir la volatilité des cryptos, tout en restant dans l'écosystème blockchain.`,
    tags: ["DeFi", "Finance", "Uniswap", "Aave", "Yield"],
    links: [{ label: "DeFi Llama", url: "https://defillama.com" }]
  },
  {
    id: 34,
    title: "NFTs & Propriété Numérique",
    emoji: "🎨",
    category: "crypto",
    summary: "L'art et la rareté à l'ère du copier-coller. Pourquoi un fichier numérique peut avoir une valeur unique.",
    content: `Les NFT (Non-Fungible Tokens) sont des titres de propriété numériques gravés sur la blockchain.

FONGIBLE VS NON-FONGIBLE
• Un billet de 10€ est fongible : il peut être remplacé par n'importe quel autre billet de 10€.
• Un tableau original est non-fongible : il est unique. Les NFT apportent cette unicité au monde numérique.

CAS D'USAGE
• Art Numérique : Permet aux artistes de vendre des œuvres originales et de toucher des royalties sur chaque revente.
• Gaming : Posséder réellement ses objets en jeu (épées, skins) et pouvoir les revendre sur des marchés secondaires.
• Immobilier & Billetterie : Simplifier le transfert de titres de propriété ou éviter la falsification de billets de concert.

CRITIQUES ET DÉFIS
Spéculation excessive, droits d'auteur complexes et impact environnemental (en partie résolu par les blockchains récentes).`,
    tags: ["NFT", "Art", "Propriété", "Web3", "Digital"],
    links: [{ label: "OpenSea", url: "https://opensea.io" }]
  },
  {
    id: 35,
    title: "Sécurité Blockchain",
    emoji: "🛡️",
    category: "crypto",
    summary: "Comment protéger ses actifs. Hardware wallets, seed phrases et bonnes pratiques pour éviter les arnaques.",
    content: `Dans le monde de la crypto, vous êtes votre propre banque. Cette liberté s'accompagne d'une grande responsabilité.

LES OUTILS DE PROTECTION
• Hardware Wallets (Ledger, Trezor) : Gardent vos clés privées hors ligne, à l'abri des hackers.
• Seed Phrase (Phrase de récupération) : 12 ou 24 mots qui sont l'unique accès à vos fonds. Si vous les perdez, vos fonds sont perdus à jamais.

LES PIÈGES À ÉVITER
• Phishing : Faux sites imitant des plateformes connues pour voler vos identifiants.
• Rug Pulls : Projets qui disparaissent avec les fonds des investisseurs.
• "Not your keys, not your coins" : Si vous laissez vos cryptos sur un échange (Binance, Coinbase), vous ne les possédez pas réellement.

L'HYGIÈNE NUMÉRIQUE
Double authentification (2FA) par application (pas SMS), utilisation de mots de passe uniques et méfiance envers les offres "trop belles pour être vraies".`,
    tags: ["Sécurité", "Hardware", "Hacking", "Prudence", "Wallet"],
    links: [{ label: "Ledger Academy", url: "https://www.ledger.com/academy" }]
  },
  {
    id: 36,
    title: "Web3 & Décentralisation",
    emoji: "🌐",
    category: "crypto",
    summary: "L'avenir d'Internet ? Un réseau où les utilisateurs possèdent leurs données et les plateformes sur lesquelles ils interagissent.",
    content: `Le Web3 est la prochaine évolution de l'Internet, passant d'un Web dominé par les géants technologiques à un Web possédé par ses utilisateurs.

L'ÉVOLUTION DU WEB
• Web1 (1990-2005) : "Read-only" – On consulte des pages statiques.
• Web2 (2005-présent) : "Read-Write" – On crée du contenu sur des plateformes centralisées (FB, YouTube) qui possèdent nos données.
• Web3 (Futur) : "Read-Write-Own" – On interagit via des protocoles décentralisés et on possède sa propre identité numérique.

LES DAO (ORGANISATIONS DÉCENTRALISÉES)
Des communautés gérées par le code et le vote des détenteurs de jetons, sans PDG ni hiérarchie traditionnelle.

L'IDENTITÉ SOUVERAINE
Se connecter à n'importe quel service avec son portefeuille crypto (Wallet), sans avoir besoin de créer des comptes Google ou Facebook, en gardant le contrôle total sur ses informations personnelles.`,
    tags: ["Web3", "Internet", "DAO", "Liberté", "Futur"],
    links: [{ label: "A16Z Crypto", url: "https://a16zcrypto.com" }]
  },

  // ===== IA (6 cartes) =====
  {
    id: 37,
    title: "Deep Learning",
    emoji: "🕸️",
    category: "ia",
    summary: "Les réseaux de neurones artificiels qui imitent le cerveau pour apprendre à partir de données massives.",
    content: `Le Deep Learning (Apprentissage Profond) est la technologie derrière la révolution actuelle de l'IA.

RÉSEAUX DE NEURONES
Inspirés du fonctionnement biologique, ils sont composés de couches de "neurones" mathématiques. Chaque couche extrait des caractéristiques de plus en plus complexes (ex: de simples pixels à un visage complet).

L'IMPORTANCE DES DONNÉES
Plus le réseau dispose d'exemples (Big Data), plus il devient précis. C'est ainsi que l'IA a appris à reconnaître des objets, traduire des langues et conduire des voitures.

LES GPU ET LE CALCUL
Le Deep Learning demande une puissance de calcul immense. Les puces graphiques (GPU), initialement pour les jeux vidéo, se sont révélées parfaites pour ces calculs mathématiques intensifs.

APPLICATIONS
Reconnaissance vocale (Siri, Alexa), diagnostic médical par image, et bien sûr, la génération de texte et d'images.`,
    tags: ["Neurones", "Algorithme", "Calcul", "Data", "Apprentissage"],
    links: [{ label: "DeepLearning.AI", url: "https://www.deeplearning.ai" }]
  },
  {
    id: 38,
    title: "LLMs (Large Language Models)",
    emoji: "💬",
    category: "ia",
    summary: "Comment GPT, Claude et Gemini ont appris à parler et à raisonner comme des humains.",
    content: `Les modèles de langage géants ont transformé notre relation avec les machines en leur permettant de comprendre et générer du langage naturel.

L'ARCHITECTURE TRANSFORMER
L'innovation clé (Google, 2017) qui permet à l'IA de porter une "attention" spécifique à certains mots d'une phrase pour en comprendre le contexte global, même sur de très longs textes.

PROBABILITÉ ET PRÉDICTION
Fondamentalement, un LLM prédit le mot suivant le plus probable. Cependant, avec des milliards de paramètres, cette capacité de prédiction se transforme en une forme de raisonnement et de créativité apparente.

L'ENTRAÎNEMENT ET LE FINING-TUNING
1. Pré-entraînement : L'IA lit presque tout internet pour apprendre la structure du langage.
2. Alignement (RLHF) : Des humains notent les réponses pour rendre l'IA plus utile, honnête et inoffensive.

HALLUCINATIONS
Le défi majeur des LLMs : leur tendance à inventer des faits avec assurance lorsqu'ils ne connaissent pas la réponse.`,
    tags: ["GPT", "NLP", "Langage", "Chatbot", "Transformer"],
    links: [{ label: "OpenAI", url: "https://openai.com" }]
  },
  {
    id: 39,
    title: "IA Générative d'Images",
    emoji: "🖼️",
    category: "ia",
    summary: "Midjourney, DALL-E et Stable Diffusion : quand les mots deviennent des pixels.",
    content: `L'IA générative permet de créer des images complexes à partir de simples descriptions textuelles (Prompts).

MODÈLES DE DIFFUSION
Le concept est fascinant : on apprend à l'IA à retirer du bruit d'une image. En partant d'un nuage de pixels aléatoires, l'IA "voit" progressivement l'image demandée et la fait émerger par étapes de débruitage.

LE LATENT SPACE (ESPACE LATENT)
L'IA ne stocke pas d'images, mais une carte mathématique des concepts (ex: "chat", "style Van Gogh", "lumière d'été"). Le prompt guide l'IA vers les coordonnées de ces concepts pour générer une image unique.

L'IMPACT SUR LE DESIGN
Ces outils accélèrent radicalement le prototypage, le concept art et la publicité, mais posent des questions cruciales sur le droit d'auteur et l'avenir des métiers créatifs.

CONTROLNET ET PRÉCISION
Les outils récents permettent de guider l'IA avec des croquis ou des poses spécifiques, offrant un contrôle professionnel sur le résultat final.`,
    tags: ["Midjourney", "Art", "Design", "Diffusion", "Créativité"],
    links: [{ label: "Midjourney", url: "https://www.midjourney.com" }]
  },
  {
    id: 40,
    title: "Éthique de l'IA",
    emoji: "⚖️",
    category: "ia",
    summary: "Biais, emploi et risques existentiels. Comment s'assurer que l'IA reste bénéfique pour l'humanité.",
    content: `Le développement rapide de l'IA soulève des questions fondamentales sur notre sécurité et nos valeurs sociales.

LES BIAIS ALGORITHMIQUES
Si les données d'entraînement contiennent des préjugés (racisme, sexisme), l'IA les reproduira et les amplifiera. C'est un défi majeur pour la justice, le recrutement et le crédit bancaire.

L'AUTOMATISATION ET L'EMPLOI
L'IA ne remplace pas seulement les tâches manuelles, mais aussi les tâches intellectuelles. Le débat porte sur la création de nouveaux métiers vs le besoin d'un revenu universel de base.

L'ALIGNEMENT
Comment garantir qu'une IA super-intelligente poursuivra des objectifs compatibles avec la survie et le bien-être humain ?

LA TRANSPARENCE ET LA RÉGULATION
L'Europe avec l'AI Act tente de classer les IA par niveau de risque pour protéger les droits fondamentaux des citoyens.`,
    tags: ["Éthique", "Sécurité", "Emploi", "Justice", "Régulation"],
    links: [{ label: "Future of Life Institute", url: "https://futureoflife.org" }]
  },
  {
    id: 41,
    title: "Vision par Ordinateur",
    emoji: "👁️",
    category: "ia",
    summary: "Donner des yeux aux machines. Des voitures autonomes au diagnostic médical par scanner.",
    content: `La Computer Vision permet aux ordinateurs d'extraire des informations significatives à partir d'images ou de vidéos.

RECONNAISSANCE D'OBJETS
Identifier et localiser des éléments (piétons, panneaux, voitures) en temps réel, base indispensable des véhicules autonomes.

IMAGERIE MÉDICALE
L'IA dépasse désormais souvent les radiologues pour détecter des signes précoces de cancer ou de pathologies rares sur des IRM et des scanners, grâce à sa capacité d'analyser des détails invisibles à l'œil humain.

RECONNAISSANCE FACIALE
Utilisée pour la sécurité (déverrouiller son téléphone) mais aussi pour la surveillance de masse, posant d'importants débats sur la vie privée.

RÉALITÉ AUGMENTÉE
La vision par ordinateur permet de superposer des objets virtuels sur le monde réel en comprenant la géométrie de la pièce en temps réel.`,
    tags: ["Vision", "Santé", "Tesla", "Image", "Reconnaissance"],
    links: [{ label: "OpenCV", url: "https://opencv.org" }]
  },
  {
    id: 42,
    title: "Futur de l'IA (AGI)",
    emoji: "🚀",
    category: "ia",
    summary: "Vers l'Intelligence Artificielle Générale. Quand les machines égaleront ou dépasseront l'intelligence humaine globale.",
    content: `Aujourd'hui, l'IA est "étroite" (douée pour une tâche précise). L'AGI est le graal de la recherche : une IA capable d'apprendre n'importe quelle tâche intellectuelle humaine.

VERS LA SINGULARITÉ
Le moment théorique où l'IA deviendra capable de s'améliorer elle-même, entraînant une explosion d'intelligence dépassant totalement la compréhension humaine.

L'IA MULTIMODALE
Les nouveaux modèles (comme GPT-4o) voient, entendent et parlent simultanément, se rapprochant de la manière dont les humains interagissent avec le monde.

AGENTS AUTONOMES
L'évolution vers des IA qui ne se contentent pas de répondre, mais qui peuvent planifier et exécuter des actions complexes (réserver un voyage, coder une application entière) de manière indépendante.

DÉFIS PHYSIQUES ET ÉNERGÉTIQUES
L'IA du futur nécessitera des puces révolutionnaires et une consommation d'énergie colossale, poussant les géants de la tech à investir dans l'énergie nucléaire.`,
    tags: ["AGI", "Singularité", "Futur", "Science-fiction", "Évolution"],
    links: [{ label: "DeepMind", url: "https://www.deepmind.com" }]
  },

  // ===== PHYSIQUE (6 cartes) =====
  {
    id: 43,
    title: "Mécanique Quantique",
    emoji: "⚛️",
      category: "physique",
    summary: "Le monde de l'infiniment petit où les particules peuvent être à deux endroits à la fois.",
    content: `La mécanique quantique décrit le comportement de la matière à l'échelle des atomes, où nos intuitions quotidiennes ne s'appliquent plus.

LA SUPERPOSITION
Une particule quantique n'a pas un état fixe tant qu'elle n'est pas observée. Elle existe dans une superposition de tous les états possibles (le célèbre Chat de Schrödinger, vivant et mort à la fois).

L'INTRICATION (ENTANGLEMENT)
Deux particules peuvent devenir liées de telle sorte que la mesure de l'une affecte instantanément l'autre, quelle que soit la distance qui les sépare. Einstein appelait cela une "action fantôme à distance".

LA DUALITÉ ONDE-CORPUSCULE
La lumière et la matière se comportent parfois comme des ondes et parfois comme des grains (photons/électrons), selon la manière dont on les observe.

INFORMATIQUE QUANTIQUE
L'utilisation de ces propriétés pour créer des ordinateurs d'une puissance dépassant l'imagination, capables de résoudre en secondes des calculs qui prendraient des millénaires aux supercalculateurs actuels.`,
    tags: ["Quantique", "Atome", "Science", "Schrödinger", "Énergie"],
    links: [{ label: "Quanta Magazine", url: "https://www.quantamagazine.org" }]
  },
  {
    id: 44,
    title: "Relativité Générale",
    emoji: "🌌",
      category: "physique",
    summary: "La vision d'Einstein : la gravité n'est pas une force, mais une courbure de l'espace et du temps.",
    content: `La relativité générale a révolutionné notre compréhension de l'univers en liant l'espace, le temps et la matière.

L'ESPACE-TEMPS
Imaginez l'univers comme un drap tendu. Une masse (comme le Soleil) creuse ce drap. Les planètes ne sont pas "attirées", elles suivent simplement la courbure créée par cette masse.

DILATATION DU TEMPS
Plus la gravité est forte ou plus on va vite, plus le temps passe lentement. C'est un effet réel que nous devons compenser pour que les satellites GPS restent précis !

LES TROUS NOIRS
Des régions de l'espace où la matière est si dense que la courbure de l'espace-temps devient infinie, empêchant même la lumière de s'échapper.

ONDES GRAVITATIONNELLES
Détectées récemment (2015), ce sont des vibrations de l'espace-temps lui-même, causées par des événements cataclysmiques comme la fusion de deux trous noirs.`,
    tags: ["Einstein", "Espace", "Temps", "Gravité", "Cosmos"],
    links: [{ label: "NASA Astrophysics", url: "https://science.nasa.gov/astrophysics" }]
  },
  {
    id: 45,
    title: "Physique des Particules",
    emoji: "💥",
      category: "physique",
    summary: "À la recherche des briques élémentaires de l'univers. Le Boson de Higgs et le Modèle Standard.",
  content: `La physique des particules explore les composants les plus fondamentaux de la matière et les forces qui les animent.

LE MODÈLE STANDARD
C'est le catalogue des particules élémentaires :
• Les Quarks : Qui forment les protons et les neutrons.
• Les Leptons : Dont l'électron fait partie.
• Les Bosons : Qui transmettent les forces (comme le photon pour la lumière).

LE BOSON DE HIGGS
Découvert en 2012 au CERN, c'est la particule qui donne leur masse à toutes les autres. Sans lui, les particules voleraient à la vitesse de la lumière sans jamais former d'atomes.

LE CERN ET LE LHC
Le plus grand accélérateur de particules au monde, un anneau de 27 km sous la frontière franco-suisse où l'on provoque des collisions à des énergies proches du Big Bang.

MATIÈRE NOIRE
L'un des plus grands mystères : 85% de la matière de l'univers est invisible et de nature inconnue. La physique des particules cherche activement à la détecter.`,
    tags: ["CERN", "Higgs", "Atome", "Matière", "Énergie"],
    links: [{ label: "CERN", url: "https://home.cern" }]
  },
  {
    id: 46,
    title: "Thermodynamique",
    emoji: "🔥",
      category: "physique",
    summary: "L'étude de l'énergie, de la chaleur et de l'entropie. Pourquoi le temps ne remonte jamais en arrière.",
    content: `La thermodynamique régit les échanges d'énergie dans tout l'univers, du moteur de votre voiture à la mort des étoiles.

LA CONSERVATION DE L'ÉNERGIE
L'énergie ne peut être ni créée ni détruite, elle se transforme seulement (ex: de l'énergie chimique de l'essence à l'énergie de mouvement).

L'ENTROPIE (DÉSORDRE)
La loi la plus implacable de la physique : dans un système isolé, le désordre ne fait qu'augmenter. C'est pourquoi un verre brisé ne se recolle jamais tout seul et que le temps a une direction.

ZÉRO ABSOLU
La température la plus basse possible (-273,15°C) où tout mouvement atomique s'arrête presque totalement.

MOTEURS ET RENDEMENT
La thermodynamique nous apprend qu'aucune machine ne peut être efficace à 100% ; il y aura toujours une perte sous forme de chaleur.`,
    tags: ["Énergie", "Chaleur", "Entropie", "Temps", "Moteur"],
    links: [{ label: "Physics Today", url: "https://physicstoday.scitation.org" }]
  },
  {
    id: 47,
    title: "Astrophysique",
    emoji: "🔭",
      category: "physique",
    summary: "L'évolution des étoiles, des galaxies et l'histoire du Big Bang.",
    content: `L'astrophysique applique les lois de la physique pour comprendre les objets célestes et l'univers dans sa globalité.

VIE ET MORT DES ÉTOILES
De leur naissance dans des nuages de gaz (nébuleuses) à leur fin spectaculaire en Supernova ou leur effondrement en Étoile à Neutrons ou Trou Noir.

L'EXPANSION DE L'UNIVERS
La découverte que les galaxies s'éloignent les unes des autres, menant à la théorie du Big Bang : l'univers a commencé par un état extrêmement chaud et dense il y a 13,8 milliards d'années.

ÉNERGIE SOMBRE
Une force mystérieuse qui accélère l'expansion de l'univers, constituant environ 70% de tout ce qui existe, mais dont nous ignorons encore la nature exacte.

EXOPLANÈTES
La recherche de planètes autour d'autres étoiles et l'analyse de leur atmosphère pour y trouver des signes de vie potentiels.`,
    tags: ["Étoiles", "Galaxie", "Big Bang", "Espace", "Télescope"],
    links: [{ label: "Hubble Site", url: "https://hubblesite.org" }]
  },
  {
    id: 48,
    title: "Physique Nucléaire",
    emoji: "☢️",
      category: "physique",
    summary: "La puissance au cœur de l'atome. Fission, fusion et l'énergie des étoiles.",
    content: `La physique nucléaire étudie les forces qui lient les protons et les neutrons au centre de l'atome.

FISSION NUCLÉAIRE
Casser un gros noyau (Uranium) en deux, libérant une énergie colossale. C'est le principe des centrales nucléaires actuelles.

FUSION NUCLÉAIRE
Fusionner deux petits noyaux (Hydrogène) pour en former un plus gros. C'est ce qui fait briller le Soleil. La fusion promet une énergie propre et quasi-illimitée, mais reste un défi technologique majeur (projet ITER).

RADIOACTIVITÉ
Le processus naturel par lequel des noyaux instables se transforment en émettant des rayonnements. Utilisée en médecine (radiothérapie) et pour d'ater l'histoire (Carbone 14).

E = MC²
La célèbre équation d'Einstein qui explique que la masse est une forme d'énergie extrêmement concentrée, ce qui explique pourquoi une petite quantité de matière peut libérer une énergie dévastatrice ou salvatrice.`,
    tags: ["Atome", "Énergie", "Fusion", "Nucléaire", "Soleil"],
    links: [{ label: "IAEA", url: "https://www.iaea.org" }]
  }
];

export interface CategoryConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  gradient: string;
  bg: string;
  text: string;
  glow: string;
  particle: string;
  accent: string;
}

export const categories: CategoryConfig[] = [
    { 
      id: "all", 
      label: "Tous", 
      icon: "✨",
      color: "#00ff88",
      gradient: "linear-gradient(135deg, #00ff88, #00cc6a)",
      bg: "rgba(0, 255, 136, 0.12)",
      text: "#00ff88",
      glow: "0 0 40px rgba(0, 255, 136, 0.5)",
      particle: "#00ff88",
      accent: "#00ff88"
    },
    { 
      id: "politiques", 
      label: "Politiques", 
      icon: "🗽",
      color: "#ff3e3e",
      gradient: "linear-gradient(135deg, #ff3e3e, #ffaa00)",
      bg: "rgba(255, 62, 62, 0.12)",
      text: "#ff3e3e",
      glow: "0 0 40px rgba(255, 62, 62, 0.5)",
      particle: "#ff3e3e",
      accent: "#ff3e3e"
    },
    { 
      id: "histoires", 
      label: "Histoires", 
      icon: "📜",
      color: "#ff9900",
      gradient: "linear-gradient(135deg, #ff9900, #d4a76a)",
      bg: "rgba(255, 153, 0, 0.12)",
      text: "#ff9900",
      glow: "0 0 40px rgba(255, 153, 0, 0.5)",
      particle: "#ff9900",
      accent: "#ff9900"
    },
    { 
      id: "philosophie", 
      label: "Philosophie", 
      icon: "🏛️",
      color: "#8864ff",
      gradient: "linear-gradient(135deg, #8864ff, #c864ff)",
      bg: "rgba(136, 100, 255, 0.12)",
      text: "#8864ff",
      glow: "0 0 40px rgba(136, 100, 255, 0.5)",
      particle: "#8864ff",
      accent: "#c864ff"
    },
      { 
        id: "esotherisme", 
        label: "Ésotérisme", 
        icon: "📿",
        color: "#ff00ff",
        gradient: "linear-gradient(135deg, #ff00ff, #8864ff)",
        bg: "rgba(255, 0, 255, 0.12)",
        text: "#ff00ff",
        glow: "0 0 40px rgba(255, 0, 255, 0.5)",
        particle: "#ff00ff",
        accent: "#ff00ff"
      },
      { 
        id: "devperso", 
        label: "Dev Perso", 
        icon: "🌱",
        color: "#00ff00",
        gradient: "linear-gradient(135deg, #00ff00, #00cc6a)",
        bg: "rgba(0, 255, 0, 0.12)",
        text: "#00ff00",
        glow: "0 0 40px rgba(0, 255, 0, 0.5)",
        particle: "#00ff00",
        accent: "#00ff00"
      },
      { 
        id: "crypto", 
        label: "Crypto", 
        icon: "💎",
        color: "#ffcc00",
        gradient: "linear-gradient(135deg, #ffcc00, #ff6600)",
        bg: "rgba(255, 204, 0, 0.12)",
        text: "#ffcc00",
        glow: "0 0 40px rgba(255, 204, 0, 0.5)",
        particle: "#ffcc00",
        accent: "#ffcc00"
      },
      { 
        id: "ia", 
        label: "IA", 
        icon: "🤖",
        color: "#00ffff",
        gradient: "linear-gradient(135deg, #00ffff, #00ffaa)",
        bg: "rgba(0, 255, 255, 0.12)",
        text: "#00ffff",
        glow: "0 0 40px rgba(0, 255, 255, 0.5)",
        particle: "#00ffff",
        accent: "#00ffff"
      },
      { 
        id: "physique", 
        label: "Physique", 
        icon: "⚛️",
        color: "#6464ff",
        gradient: "linear-gradient(135deg, #6464ff, #8864ff)",
        bg: "rgba(100, 100, 255, 0.12)",
        text: "#6464ff",
        glow: "0 0 40px rgba(100, 100, 255, 0.5)",
        particle: "#6464ff",
        accent: "#6464ff"
      },
];
