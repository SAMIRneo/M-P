export interface GlobeSettings {
  showGrid: boolean;
  autoRotate: boolean;
  showAtmosphere: boolean;
  showLabels: boolean;
  showArcs: boolean;
  showPoints: boolean;
  showHexBins: boolean;
  showNews: boolean;
  showTelemetry: boolean;
}

export interface ConflictPoint {
  lat: number;
  lng: number;
  label: string;
  status: string;
  intel: string;
}

export interface ConflictArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

export interface ConflictZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  points: ConflictPoint[];
  arcs: ConflictArc[];
}

export interface StrategicResource {
  name: string;
  countries: string[];
  color: string;
  importance: number;
  locations?: { lat: number; lng: number; label: string }[];
}

export interface CountryResource {
  name: string;
  color: string;
}

export interface CountryConflict {
  id: string;
  name: string;
  points: ConflictPoint[];
}

export interface CountryEconomy {
  gdp: string;
  gdpGrowth: string;
  tradeBalance: string;
  mainExports: string[];
  mainImports: string[];
  sanctions?: string;
  currency: string;
}

export interface CountryAlliance {
  name: string;
  type: 'military' | 'economic' | 'political';
  color: string;
}

export interface CountryRegion {
  name: string;
  status: string;
  bio: string;
}

export interface CountryData {
  iso: string;
  name: string;
  capital: string;
  population: string;
  military: {
    personnel: string;
    budget: string;
    nuclearPower: boolean;
    rank: number;
    defcon: 1 | 2 | 3 | 4 | 5;
    readiness: number; // 0-100
    assets: TacticalAsset[];
  };
  energy?: {
    production: { type: string; value: number }[];
    consumption: string;
  };
  diplomacy?: {
    partners: { name: string; value: number }[];
    enemies: { name: string; value: number }[];
  };
  economy: CountryEconomy;
  alliances: CountryAlliance[];
  role: 'superpower' | 'regional' | 'ally' | 'neutral' | 'contested';
  threatLevel: number;
  intel: string;
  regions?: CountryRegion[];
}

export interface TacticalAsset {
  id: string;
  type: 'base' | 'fleet' | 'silo' | 'radar' | 'satellite';
  name: string;
  lat: number;
  lng: number;
  status: 'ACTIVE' | 'STANDBY' | 'ENGAGED' | 'MAINTENANCE';
  range?: number;
}

export interface TacticalPoint {
  lat: number;
  lng: number;
  label: string;
  status: string;
  intel: string;
  size: number;
  color: string;
  type?: string;
}

export interface TradeRoute {
  from: string;
  to: string;
  volume: string;
  type: 'export' | 'import';
  color: string;
}

export interface AllianceData {
  id: string;
  name: string;
  members: string[];
  color: string;
  type: 'military' | 'economic' | 'political';
  headquarters: string;
}

export interface CountryProperties {
  ADMIN: string;
  ISO_A2: string;
  ISO_A3: string;
  LABEL_X?: number;
  LABEL_Y?: number;
  resources?: CountryResource[];
  conflict?: CountryConflict;
  countryData?: CountryData;
}

export interface ResourcePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  country: string;
}

export interface EconomyPoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  gdp: string;
}

export interface AlliancePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  alliance: string;
  country: string;
}

export type MapMode = 'tactical' | 'resources' | 'economy' | 'alliances';
export type TabType = 'inventory' | 'config' | 'resources' | null;
export type WidgetType = 'status' | 'info' | null;
