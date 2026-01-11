import type { StrategicResource, ConflictZone, CountryData, TradeRoute } from '../types/index.ts';

// --- GEOPOLITICAL CONSTANTS (2025 UPDATE) ---

export const CONFLICT_COUNTRIES = ['UA', 'IL', 'PS', 'LB', 'YE', 'SY', 'SD', 'MM', 'CD', 'ML', 'BF', 'NE', 'HT'];
export const MAJOR_POWERS = ['US', 'CN', 'RU', 'IN', 'EU', 'JP', 'GB', 'FR', 'DE', 'BR', 'SA', 'TR', 'ID', 'KR', 'AU', 'CA', 'IT', 'ZA', 'MX', 'PL', 'IR', 'EG', 'VN', 'PK', 'NG'];
export const SANCTIONED_COUNTRIES = ['RU', 'IR', 'KP', 'SY', 'VE', 'CU', 'BY', 'AF', 'MM', 'NI'];

export const MILITARY_NEWS: string[] = [
  'UKRAINE: FRAPPES LONGUE PORTÉE • DÉFENSE AÉRIENNE SOUS PRESSION',
  'MER ROUGE: RISQUE MARITIME ÉLEVÉ • TRAFIC DÉTOURNÉ',
  'TAÏWAN: EXERCICES AMPHIBIES • ALERTES AÉRIENNES RÉCURRENTES',
  'SAHEL: INSTABILITÉ PERSISTANTE • MENACES ASYMÉTRIQUES',
  'INDO-PACIFIQUE: PATROUILLES NAVALS RENFORCÉES'
];

export const ECONOMY_NEWS: string[] = [
  'ÉNERGIE: VOLATILITÉ PÉTROLE/GNL • PRIME DE RISQUE GÉOPOL',
  'CHAÎNES SUPPLY: RÉORGANISATION • NEARSHORING/FRIENDSHORING',
  'SEMI-CONDUCTEURS: CAPEX RECORD • CONTRÔLES EXPORT',
  'MÉTAUX CRITIQUES: COMPÉTITION • LITHIUM/TERRES RARES',
  'INFLATION: DÉSINFLATION LENTE • TAUX HAUTS PLUS LONGTEMPS'
];

export const ALLIANCE_NEWS: string[] = [
  'OTAN: INTEROPÉRABILITÉ + • INDUSTRIE DE DÉFENSE EN HAUSSE',
  'BRICS+: ÉLARGISSEMENT • COOPÉRATION ÉNERGIE/FINANCE',
  'AUKUS: CAPACITÉS SOUS-MARINES • TECHNOLOGIES AVANCÉES',
  'QUAD: COORDINATION MARITIME • RÉSILIENCE INDO-PACIFIQUE',
  'UE: SÉCURITÉ ÉCONOMIQUE • CONTRÔLES & SUBVENTIONS'
];

// --- RESOURCES (DATA VIZ) ---

export const STRATEGIC_RESOURCES: StrategicResource[] = [
  { 
    name: 'Lithium (Or Blanc)', 
    countries: ['AU', 'CL', 'CN', 'AR', 'US', 'ZW'], 
    color: '#00f2ff', // Electric Cyan
    importance: 10,
    locations: [
      { lat: -23.5, lng: -68.3, label: 'Triangle du Lithium (ABC)' },
      { lat: -26.0, lng: 121.0, label: 'Mines Greenbushes (AU)' }
    ]
  },
  { 
    name: 'Semi-conducteurs', 
    countries: ['TW', 'KR', 'US', 'CN', 'JP', 'NL'], 
    color: '#fbbf24', // Warning Yellow
    importance: 10,
    locations: [
      { lat: 24.8, lng: 121.0, label: 'TSMC (Taïwan)' },
      { lat: 37.2, lng: 127.0, label: 'Samsung (Corée)' }
    ]
  },
  { 
    name: 'Pétrole', 
    countries: ['US', 'SA', 'RU', 'CA', 'IQ', 'AE', 'CN', 'IR', 'BR'], 
    color: '#1a1a1a', // Oil Black
    importance: 9,
    locations: [
      { lat: 26.3, lng: 50.1, label: 'Champs Ghawar (SA)' },
      { lat: 31.5, lng: -102.0, label: 'Permian Basin (US)' }
    ]
  },
  {
    name: 'Terres Rares',
    countries: ['CN', 'US', 'AU', 'MM', 'VN'],
    color: '#d946ef', // Rare Purple
    importance: 10,
    locations: [
      { lat: 41.0, lng: 110.0, label: 'Bayan Obo (CN)' }
    ]
  }
];

export const TRADE_ROUTES: TradeRoute[] = [
  { from: 'CN', to: 'US', color: '#ef4444', volume: '$500B', type: 'export' },
  { from: 'CN', to: 'EU', color: '#ef4444', volume: '$450B', type: 'export' },
  { from: 'SA', to: 'CN', color: '#1a1a1a', volume: '$300B', type: 'export' },
  { from: 'TW', to: 'US', color: '#fbbf24', volume: '$200B', type: 'export' },
  { from: 'US', to: 'EU', color: '#3b82f6', volume: '$400B', type: 'export' }
];

// --- CONFLICT ZONES (LIVE 2025) ---

export const CONFLICT_ZONES: ConflictZone[] = [
  {
    id: 'ukraine-front',
    name: 'FRONT EST',
    center: { lat: 48.5, lng: 37.5 },
    points: [
      { lat: 50.45, lng: 30.52, label: 'KYIV (Défense)', status: 'ALERTE', intel: 'Menace aérienne constante.' },
      { lat: 48.00, lng: 37.80, label: 'DONBASS (Combat)', status: 'COMBAT', intel: 'Offensives intenses.' },
      { lat: 44.95, lng: 34.10, label: 'CRIMÉE (Cible)', status: 'MENACE', intel: 'Frappes logistiques.' }
    ],
    arcs: [{ startLat: 55.75, startLng: 37.61, endLat: 50.45, endLng: 30.52, color: '#ef4444' }]
  },
  {
    id: 'middle-east',
    name: 'LEVANT',
    center: { lat: 32.0, lng: 35.0 },
    points: [
      { lat: 31.50, lng: 34.46, label: 'GAZA', status: 'COMBAT', intel: 'Opérations urbaines.' },
      { lat: 33.89, lng: 35.50, label: 'LIBAN SUD', status: 'COMBAT', intel: 'Échanges de tirs quotidiens.' },
      { lat: 15.36, lng: 44.19, label: 'YÉMEN (Houthis)', status: 'MENACE', intel: 'Blocage Mer Rouge.' }
    ],
    arcs: [{ startLat: 35.68, startLng: 51.38, endLat: 33.89, endLng: 35.50, color: '#ef4444' }]
  },
  {
    id: 'taiwan-strait',
    name: 'DÉTROIT DE TAÏWAN',
    center: { lat: 24.0, lng: 120.0 },
    points: [
      { lat: 25.03, lng: 121.56, label: 'TAÏWAN', status: 'CRITIQUE', intel: 'Zone d\'exclusion aérienne simulée.' }
    ],
    arcs: [{ startLat: 24.5, startLng: 118.0, endLat: 24.5, endLng: 120.0, color: '#ef4444' }]
  }
];

// --- ALLIANCES (2025) ---

export const ALLIANCE_NETWORKS: Record<string, { name: string, hq: { lat: number, lng: number, label: string }, members: string[], color: string }> = {
  'OTAN': {
    name: 'OTAN',
    hq: { lat: 50.87, lng: 4.42, label: 'BXL' },
    members: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'TR', 'PL', 'ES', 'NL', 'NO', 'DK', 'BE', 'PT', 'GR', 'RO', 'CZ', 'HU', 'SK', 'BG', 'EE', 'LV', 'LT', 'FI', 'SE', 'IS', 'LU', 'HR', 'AL', 'ME', 'MK', 'SI'],
    color: '#2563eb' // Royal Blue
  },
  'BRICS': {
    name: 'BRICS+',
    hq: { lat: 31.23, lng: 121.47, label: 'SHANGHAI' },
    members: ['CN', 'RU', 'IN', 'BR', 'ZA', 'SA', 'AE', 'EG', 'ET', 'IR'],
    color: '#d97706' // Amber
  },
  'AUKUS': {
    name: 'AUKUS',
    hq: { lat: -35.28, lng: 149.13, label: 'PACIFIQUE' },
    members: ['US', 'GB', 'AU'],
    color: '#7c3aed' // Violet
  }
};

export const ISO_MAPPING: Record<string, string> = {
  'FRA': 'FR', 'NOR': 'NO', 'AUS': 'AU', 'USA': 'US', 'CHN': 'CN', 'RUS': 'RU', 'IND': 'IN', 'BRA': 'BR', 'CAN': 'CA',
  'DEU': 'DE', 'JPN': 'JP', 'GBR': 'GB', 'UKR': 'UA', 'ISR': 'IL', 'KOR': 'KR', 'SAU': 'SA', 'TUR': 'TR', 'ITA': 'IT',
  'ESP': 'ES', 'POL': 'PL', 'IRN': 'IR', 'SDS': 'SS', 'KOS': 'XK'
};

// --- COUNTRY DATABASE (SIMULATED LIVE DATA) ---

export const COUNTRY_DATABASE: Record<string, CountryData> = {
  US: {
    iso: 'US', name: 'États-Unis', capital: 'Washington', population: '340M',
    military: { personnel: '1.3M', budget: '$916B', nuclearPower: true, rank: 1, defcon: 4, readiness: 98, assets: [] },
    economy: { gdp: '$28.7T', gdpGrowth: '+2.7%', tradeBalance: '-$800B', mainExports: ['Tech', 'Énergie', 'Armes'], mainImports: ['Conso', 'Auto'], currency: 'USD' },
    alliances: [{ name: 'OTAN', type: 'military', color: '#2563eb' }, { name: 'AUKUS', type: 'military', color: '#7c3aed' }],
    role: 'superpower', threatLevel: 0, intel: 'Hégémonie contestée. Pivot vers l\'Indo-Pacifique.',
    regions: []
  },
  CN: {
    iso: 'CN', name: 'Chine', capital: 'Pékin', population: '1.41B',
    military: { personnel: '2.0M', budget: '$296B', nuclearPower: true, rank: 2, defcon: 3, readiness: 95, assets: [] },
    economy: { gdp: '$18.5T', gdpGrowth: '+5.0%', tradeBalance: '+$823B', mainExports: ['Manufacture', 'EV', 'Batteries'], mainImports: ['Énergie', 'Minerais'], currency: 'CNY' },
    alliances: [{ name: 'BRICS+', type: 'economic', color: '#d97706' }],
    role: 'superpower', threatLevel: 6, intel: 'Modernisation navale rapide. Tensions commerciales.',
    regions: []
  },
  RU: {
    iso: 'RU', name: 'Russie', capital: 'Moscou', population: '144M',
    military: { personnel: '1.5M', budget: '$140B (Est.)', nuclearPower: true, rank: 3, defcon: 2, readiness: 90, assets: [] },
    economy: { gdp: '$2.0T', gdpGrowth: '+3.2%', tradeBalance: '+$120B', mainExports: ['Pétrole', 'Gaz'], mainImports: ['Tech (Parallèle)'], currency: 'RUB' },
    alliances: [{ name: 'BRICS+', type: 'economic', color: '#d97706' }, { name: 'OTSC', type: 'military', color: '#ef4444' }],
    role: 'contested', threatLevel: 9, intel: 'Économie de guerre totale. Offensive en cours.',
    regions: []
  },
  IN: {
    iso: 'IN', name: 'Inde', capital: 'New Delhi', population: '1.43B',
    military: { personnel: '1.4M', budget: '$84B', nuclearPower: true, rank: 4, defcon: 3, readiness: 85, assets: [] },
    economy: { gdp: '$3.9T', gdpGrowth: '+6.8%', tradeBalance: '-$240B', mainExports: ['Services IT', 'Pharma'], mainImports: ['Énergie'], currency: 'INR' },
    alliances: [{ name: 'BRICS+', type: 'economic', color: '#d97706' }, { name: 'QUAD', type: 'military', color: '#2563eb' }],
    role: 'regional', threatLevel: 2, intel: 'Non-alignement stratégique. Croissance majeure.',
    regions: []
  },
  DE: {
    iso: 'DE', name: 'Allemagne', capital: 'Berlin', population: '84M',
    military: { personnel: '181K', budget: '$72B', nuclearPower: false, rank: 7, defcon: 4, readiness: 70, assets: [] },
    economy: { gdp: '$4.5T', gdpGrowth: '+0.2%', tradeBalance: '+$200B', mainExports: ['Auto', 'Chimie'], mainImports: ['Énergie'], currency: 'EUR' },
    alliances: [{ name: 'OTAN', type: 'military', color: '#2563eb' }, { name: 'UE', type: 'economic', color: '#2563eb' }],
    role: 'ally', threatLevel: 0, intel: 'Pilier économique européen. Réarmement (Zeitenwende) lent.',
    regions: []
  },
  FR: {
    iso: 'FR', name: 'France', capital: 'Paris', population: '68M',
    military: { personnel: '200K', budget: '$64B', nuclearPower: true, rank: 6, defcon: 4, readiness: 88, assets: [] },
    economy: { gdp: '$3.1T', gdpGrowth: '+0.9%', tradeBalance: '-$60B', mainExports: ['Aéro', 'Luxe', 'Armes'], mainImports: ['Énergie'], currency: 'EUR' },
    alliances: [{ name: 'OTAN', type: 'military', color: '#2563eb' }, { name: 'UE', type: 'economic', color: '#2563eb' }],
    role: 'ally', threatLevel: 0, intel: 'Autonomie stratégique. Déploiement Indo-Pacifique.',
    regions: []
  },
  UA: {
    iso: 'UA', name: 'Ukraine', capital: 'Kyiv', population: '37M (Est.)',
    military: { personnel: '900K', budget: '$40B+', nuclearPower: false, rank: 15, defcon: 1, readiness: 100, assets: [] },
    economy: { gdp: '$180B', gdpGrowth: '+3.0%', tradeBalance: 'Negative', mainExports: ['Agri', 'Métaux'], mainImports: ['Armes', 'Fuel'], currency: 'UAH' },
    alliances: [{ name: 'Soutien OTAN', type: 'military', color: '#2563eb' }],
    role: 'contested', threatLevel: 10, intel: 'Guerre de haute intensité. Dépendance aide occidentale.',
    regions: []
  },
  IL: {
    iso: 'IL', name: 'Israël', capital: 'Jérusalem', population: '9.8M',
    military: { personnel: '170K (+Res)', budget: '$30B+', nuclearPower: true, rank: 18, defcon: 1, readiness: 100, assets: [] },
    economy: { gdp: '$530B', gdpGrowth: '+1.5%', tradeBalance: 'Stable', mainExports: ['Tech', 'Armes'], mainImports: ['Énergie'], currency: 'ILS' },
    alliances: [{ name: 'Allié US', type: 'military', color: '#2563eb' }],
    role: 'contested', threatLevel: 10, intel: 'Conflit multi-fronts (Gaza, Nord, Iran).',
    regions: []
  },
  JP: {
    iso: 'JP', name: 'Japon', capital: 'Tokyo', population: '124M',
    military: { personnel: '247K', budget: '$56B', nuclearPower: false, rank: 8, defcon: 4, readiness: 90, assets: [] },
    economy: { gdp: '$4.1T', gdpGrowth: '+1.0%', tradeBalance: 'Variable', mainExports: ['Auto', 'Robots'], mainImports: ['Énergie'], currency: 'JPY' },
    alliances: [{ name: 'Allié US', type: 'military', color: '#2563eb' }],
    role: 'ally', threatLevel: 1, intel: 'Réinterprétation constitution pacifiste. Surveillance Chine/RPDC.',
    regions: []
  },
  GB: {
    iso: 'GB', name: 'Royaume-Uni', capital: 'Londres', population: '67M',
    military: { personnel: '150K', budget: '$75B', nuclearPower: true, rank: 5, defcon: 4, readiness: 85, assets: [] },
    economy: { gdp: '$3.5T', gdpGrowth: '+0.5%', tradeBalance: 'Negative', mainExports: ['Services', 'Aéro'], mainImports: ['Biens'], currency: 'GBP' },
    alliances: [{ name: 'OTAN', type: 'military', color: '#2563eb' }, { name: 'AUKUS', type: 'military', color: '#7c3aed' }],
    role: 'ally', threatLevel: 0, intel: 'Force navale globale. Soutien majeur Ukraine.',
    regions: []
  },
  SA: {
    iso: 'SA', name: 'Arabie Saoudite', capital: 'Riyad', population: '36M',
    military: { personnel: '257K', budget: '$70B', nuclearPower: false, rank: 22, defcon: 3, readiness: 75, assets: [] },
    economy: { gdp: '$1.1T', gdpGrowth: '+2.0%', tradeBalance: 'Positive', mainExports: ['Pétrole'], mainImports: ['Armes', 'Luxe'], currency: 'SAR' },
    alliances: [{ name: 'BRICS+', type: 'economic', color: '#d97706' }],
    role: 'regional', threatLevel: 3, intel: 'Diversification Vision 2030. Normalisation régionale en pause.',
    regions: []
  },
  IR: {
    iso: 'IR', name: 'Iran', capital: 'Téhéran', population: '89M',
    military: { personnel: '600K', budget: '$10B+', nuclearPower: false, rank: 14, defcon: 2, readiness: 80, assets: [] },
    economy: { gdp: '$400B', gdpGrowth: '+3.0%', tradeBalance: 'Positive', mainExports: ['Pétrole (Illicite)'], mainImports: ['Biens'], currency: 'IRR' },
    alliances: [{ name: 'BRICS+', type: 'economic', color: '#d97706' }, { name: 'Axe Résistance', type: 'military', color: '#ef4444' }],
    role: 'contested', threatLevel: 8, intel: 'Seuil nucléaire proche. Guerre par procuration.',
    regions: []
  }
};

export const getCountrySubjectData = (iso: string, mode: string) => {
  const data = COUNTRY_DATABASE[iso];
  if (!data) return { color: '#64748b', value: 0, label: 'N/A', intensity: 0 };

  switch (mode) {
    case 'tactical':
      return {
        color: data.threatLevel > 5 ? '#ef4444' : data.alliances.some(a => a.type === 'military' && a.name.includes('OTAN')) ? '#3b82f6' : '#fbbf24',
        value: data.military.readiness,
        label: `DEFCON ${data.military.defcon}`,
        intensity: data.military.readiness / 100
      };
    case 'resources': {
      const isResourceRich = ['SA', 'RU', 'US', 'AU', 'CN'].includes(iso);
      return {
        color: isResourceRich ? '#10b981' : '#64748b',
        value: isResourceRich ? 90 : 30,
        label: isResourceRich ? 'Exportateur Majeur' : 'Importateur',
        intensity: isResourceRich ? 0.9 : 0.3
      };
    }
    case 'economy': {
      const gdpVal = parseFloat(data.economy.gdp.replace(/[^0-9.]/g, ''));
      return {
        color: gdpVal > 10 ? '#8b5cf6' : gdpVal > 2 ? '#3b82f6' : '#64748b',
        value: Math.min(100, gdpVal * 5),
        label: data.economy.gdp,
        intensity: Math.min(1, gdpVal / 20)
      };
    }
    case 'alliances': {
      const alliance = data.alliances[0];
      return {
        color: alliance ? alliance.color : '#64748b',
        value: 100,
        label: alliance ? alliance.name : 'Non-aligné',
        intensity: alliance ? 0.8 : 0.1
      };
    }
    default:
      return { color: '#64748b', value: 0, label: 'N/A', intensity: 0 };
  }
};
