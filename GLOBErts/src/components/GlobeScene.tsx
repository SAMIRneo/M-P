import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import type { GlobeSettings, MapMode, CountryProperties } from '../types/index.ts';
import { CONFLICT_ZONES, COUNTRY_DATABASE, ALLIANCE_NETWORKS, getCountrySubjectData, ISO_MAPPING } from '../constants/data.ts';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type PolygonCoords = number[][][];
type MultiPolygonCoords = number[][][][];

interface RawGeoJSONFeature {
  type: string;
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: PolygonCoords | MultiPolygonCoords };
}

interface GeoJSONFeature {
  type: string;
  properties: CountryProperties;
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: PolygonCoords | MultiPolygonCoords };
}

interface GeoJSONData {
  features: GeoJSONFeature[];
}

interface GlobeSceneProps {
  onCountryClick?: (country: CountryProperties) => void;
  onPovChange?: (pov: { altitude: number; zoomLevel: string }) => void;
  selectedCountry?: CountryProperties | null;
  mode?: MapMode;
  settings?: GlobeSettings;
}

const DEFAULT_SETTINGS: GlobeSettings = {
  showGrid: false, autoRotate: true, showAtmosphere: false, showLabels: true,
  showArcs: true, showPoints: true, showHexBins: false, showNews: false, showTelemetry: false
};

type ZoomLevel = 'orbital' | 'global' | 'continental' | 'regional' | 'local';

const getZoomLevel = (altitude: number): ZoomLevel => {
  if (altitude > 2.0) return 'orbital';
  if (altitude > 1.2) return 'global';
  if (altitude > 0.6) return 'continental';
  if (altitude > 0.3) return 'regional';
  return 'local';
};

const LOWPOLY_COLORS = {
  land: '#0f172a',
  sea: '#020408',
  outline: '#334155',
  sideLight: '#1e3a5f',
  sideDark: '#0c1929'
};

const LARGE_COUNTRIES = new Set(['RU', 'CA', 'US', 'CN', 'BR', 'AU', 'IN', 'AR', 'KZ', 'DZ', 'CD', 'SA', 'MX', 'ID', 'SD', 'LY', 'IR', 'MN', 'PE', 'TD', 'NE', 'AO', 'ML', 'ZA', 'CO', 'ET', 'EG', 'MR', 'TZ', 'NG', 'VE', 'PK', 'TR', 'CL', 'MM', 'AF', 'SO', 'CF', 'UA', 'MG', 'BW', 'KE']);
const MEDIUM_COUNTRIES = new Set(['FR', 'ES', 'SE', 'DE', 'FI', 'NO', 'PL', 'IT', 'GB', 'RO', 'BY', 'GR', 'BG', 'IS', 'HU', 'PT', 'AT', 'CZ', 'RS', 'IE', 'HR', 'BA', 'SK', 'JP', 'PH', 'VN', 'MY', 'TH', 'LA', 'KP', 'KR', 'NP', 'BD', 'UZ', 'TM', 'KG', 'TJ', 'IQ', 'SY', 'JO', 'IL', 'LB', 'AE', 'OM', 'YE', 'MA', 'TN', 'SN', 'GH', 'CI', 'CM', 'GA', 'CG', 'ZW', 'ZM', 'MZ', 'NA', 'UG', 'RW', 'NZ', 'PG', 'CU', 'HT', 'DO', 'PA', 'CR', 'NI', 'HN', 'SV', 'GT', 'BZ', 'GY', 'SR', 'EC', 'BO', 'PY', 'UY']);

const getCountryZoomAltitude = (iso: string): number => {
  if (LARGE_COUNTRIES.has(iso)) return 0.6;
  if (MEDIUM_COUNTRIES.has(iso)) return 0.35;
  return 0.25;
};

const getCountryElevation = (iso: string, isSelected: boolean): number => {
  if (isSelected) return 0.04;
  if (LARGE_COUNTRIES.has(iso)) return 0.012;
  if (MEDIUM_COUNTRIES.has(iso)) return 0.008;
  return 0.005;
};

const GlobeScene = memo(function GlobeScene({ 
  mode = 'tactical', settings = DEFAULT_SETTINGS, onCountryClick, onPovChange, selectedCountry
}: GlobeSceneProps) {
  const globeRef = useRef<GlobeMethods>(undefined);
  const [countries, setCountries] = useState<GeoJSONData>({ features: [] });
  const [altitude, setAltitude] = useState(1.6);
  const [viewCenter, setViewCenter] = useState({ lat: 25, lng: 0 });
  const [isReady, setIsReady] = useState(false);
  const povTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const zoomLevel = useMemo(() => getZoomLevel(altitude), [altitude]);
  const selectedIso = selectedCountry?.ISO_A2;

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson', { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then((data: { features?: RawGeoJSONFeature[] }) => {
        const toStr = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);
        const toNum = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined);

        const normalizedFeatures = (data.features ?? [])
          .filter((f): f is RawGeoJSONFeature => !!f && !!f.geometry && !!f.properties)
          .map((f) => {
            const props = f.properties;
            const admin = toStr(props['ADMIN']) ?? toStr(props['NAME']) ?? 'Unknown';
            const isoA2Raw = toStr(props['ISO_A2']) ?? '';
            const isoA3Raw = toStr(props['ISO_A3']) ?? toStr(props['ADM0_A3']) ?? '';

            let iso = isoA2Raw;
            if (!iso || iso === '-99') {
              iso = isoA3Raw ? ISO_MAPPING[isoA3Raw] ?? '' : '';
            }

            const normalized: CountryProperties = {
              ADMIN: admin,
              ISO_A2: iso,
              ISO_A3: isoA3Raw || iso,
              LABEL_X: toNum(props['LABEL_X']),
              LABEL_Y: toNum(props['LABEL_Y']),
            };

            return {
              type: f.type,
              properties: normalized,
              geometry: f.geometry as GeoJSONFeature['geometry'],
            };
          });

        setCountries({ features: normalizedFeatures });
      })
      .catch(err => { if (err.name !== 'AbortError') console.error('GeoJSON error:', err); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isReady && globeRef.current?.controls) {
      const c = globeRef.current.controls();
      if (c) {
        c.autoRotate = settings.autoRotate;
        c.autoRotateSpeed = 0.4;
        c.enableDamping = true;
        c.dampingFactor = 0.15;
        c.rotateSpeed = 0.5;
        c.zoomSpeed = 1.2;
        c.minDistance = 15;
        c.maxDistance = 500;
      }
    }
  }, [isReady, settings.autoRotate]);

  const setupGlobe = useCallback(() => {
    const g = globeRef.current;
    if (!g) { setIsReady(true); return; }
    
      try {
        const scene = g.scene();
        if (scene) {
          scene.children = scene.children.filter((c: THREE.Object3D) => 
            !['AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight'].includes(c.type)
          );
          
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
          scene.add(ambientLight);
          
          const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
          dirLight.position.set(5, 8, 5);
          scene.add(dirLight);
          
          const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
          fillLight.position.set(-5, -2, -5);
          scene.add(fillLight);
        }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mat = (g as any).globeMaterial?.();
      if (mat) {
        mat.color = new THREE.Color(LOWPOLY_COLORS.sea);
        mat.emissive = new THREE.Color(0x000000);
        mat.shininess = 0;
        mat.flatShading = true;
      }
    } catch (e) {
      console.error('Globe setup failed', e);
    }
    setIsReady(true);
  }, []);

  const handlePovUpdate = useCallback((pov: { altitude: number; lat?: number; lng?: number }) => {
    if (povTimeoutRef.current) clearTimeout(povTimeoutRef.current);
    povTimeoutRef.current = setTimeout(() => {
      setAltitude(pov.altitude);
      setViewCenter({ lat: pov.lat || 0, lng: pov.lng || 0 });
      onPovChange?.({ altitude: pov.altitude, zoomLevel: getZoomLevel(pov.altitude) });
    }, 100);
  }, [onPovChange]);

  const handleZoom = useCallback((delta: number) => {
    if (globeRef.current) {
      const newAlt = Math.max(0.15, Math.min(3.0, altitude + delta));
      globeRef.current.pointOfView({ lat: viewCenter.lat, lng: viewCenter.lng, altitude: newAlt }, 400);
    }
  }, [altitude, viewCenter]);

  const handleReset = useCallback(() => {
    globeRef.current?.pointOfView({ lat: 25, lng: 0, altitude: 1.6 }, 800);
  }, []);

  const pointsData = useMemo(() => {
    if (!settings.showPoints) return [];
    const pts: Array<{ lat: number; lng: number; size: number; color: string; label: string }> = [];
    
    if (mode === 'tactical') {
      CONFLICT_ZONES.forEach(z => {
        z.points.forEach(p => {
          pts.push({ 
            lat: p.lat, lng: p.lng, 
            size: p.status === 'CRITIQUE' ? 1.0 : 0.6, 
            color: p.status === 'CRITIQUE' ? '#f43f5e' : '#fbbf24', 
            label: p.label
          });
        });
      });
    } else if (mode === 'alliances') {
      Object.values(ALLIANCE_NETWORKS).forEach(network => {
         pts.push({
           lat: network.hq.lat, lng: network.hq.lng,
           size: 1.2,
           color: network.color,
           label: network.hq.label
         });
      });
    }
    return pts;
  }, [mode, settings.showPoints]);

  const arcsData = useMemo(() => {
    if (!settings.showArcs) return [];
    const arcs: Array<{ startLat: number; startLng: number; endLat: number; endLng: number; color: string; stroke: number; altitude: number }> = [];
    
    if (mode === 'tactical') {
      CONFLICT_ZONES.forEach(z => {
        z.arcs.forEach(a => arcs.push({ 
          ...a, 
          stroke: 1.5, 
          altitude: 0.3,
          color: '#f43f5e'
        }));
      });
    } else if (mode === 'alliances') {
      Object.values(ALLIANCE_NETWORKS).forEach(network => {
        network.members.slice(0, 5).forEach(memberIso => { // Optimized: less arcs
          const member = countries.features.find(f => f.properties.ISO_A2 === memberIso);
          if (member) {
             arcs.push({
               startLat: network.hq.lat, startLng: network.hq.lng,
               endLat: member.properties.LABEL_Y || 0, endLng: member.properties.LABEL_X || 0,
               color: network.color,
               stroke: 0.8,
               altitude: 0.5
             });
          }
        });
      });
    }
    return arcs;
  }, [mode, settings.showArcs, countries.features]);

  const handlePolygonClick = useCallback((polygon: GeoJSONFeature) => {
    if (!globeRef.current) return;
    const iso = polygon.properties.ISO_A2;
    const dbData = COUNTRY_DATABASE[iso];
    const subjectData = getCountrySubjectData(iso, mode);
    
    const targetAltitude = getCountryZoomAltitude(iso);
    
    globeRef.current.pointOfView({ 
      lat: polygon.properties.LABEL_Y || 0, 
      lng: polygon.properties.LABEL_X || 0, 
      altitude: targetAltitude 
    }, 800);

    onCountryClick?.({
      ...polygon.properties,
      countryData: dbData || {
        iso,
        name: polygon.properties.ADMIN,
        capital: 'N/A',
        population: 'N/A',
        military: { personnel: 'N/A', budget: 'N/A', nuclearPower: false, rank: 99, defcon: 5, readiness: 50, assets: [] },
        economy: { gdp: 'N/A', gdpGrowth: 'N/A', tradeBalance: 'N/A', mainExports: [], mainImports: [], currency: 'N/A' },
        alliances: [],
        role: 'neutral',
        threatLevel: 1,
        intel: subjectData.label,
        regions: []
      }
    });
  }, [onCountryClick, mode]);

  const getPolygonLabel = useCallback((d: GeoJSONFeature) => {
    const iso = d.properties.ISO_A2;
    if (iso === selectedIso) {
      const data = getCountrySubjectData(iso, mode);
      return `
        <div class="comic-glass-light comic-shadow p-4 min-w-[200px] animate-pop">
          <div class="flex justify-between items-center mb-1 border-b-2 border-black pb-1">
            <span class="text-xs font-black uppercase tracking-widest">${iso}</span>
            <div class="w-3 h-3 border border-black" style="background-color: ${data.color}"></div>
          </div>
          <div class="text-xl font-black mb-1 uppercase italic leading-none">${d.properties.ADMIN}</div>
          <div class="text-[10px] font-black bg-yellow-400 inline-block px-1.5 py-0.5 comic-border-ink mb-2">${data.label}</div>
          <div class="w-full h-3 bg-black/10 comic-border-ink p-0.5">
            <div class="h-full bg-black" style="width: ${data.value}%"></div>
          </div>
        </div>
      `;
    }
    return zoomLevel === 'local' ? `<div class="bg-black text-white text-[10px] px-1 font-black uppercase">${d.properties.ADMIN}</div>` : null;
  }, [selectedIso, mode, zoomLevel]);

  return (
    <div className="w-full h-full relative bg-black">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] bg-background halftone">
          <div className="bg-white p-6 comic-border comic-shadow animate-pop">
            <div className="text-2xl font-black text-black uppercase italic tracking-tighter">Initializing_Globe...</div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-4">
        <div className="bg-ink comic-border p-1 flex flex-col gap-2 comic-shadow">
          <button onClick={() => handleZoom(-0.4)} className="w-10 h-10 flex items-center justify-center bg-white text-black hover:bg-yellow-400 transition-colors comic-border-ink">
            <ZoomIn size={20} strokeWidth={3} />
          </button>
          <button onClick={() => handleZoom(0.4)} className="w-10 h-10 flex items-center justify-center bg-white text-black hover:bg-yellow-400 transition-colors comic-border-ink">
            <ZoomOut size={20} strokeWidth={3} />
          </button>
          <button onClick={handleReset} className="w-10 h-10 flex items-center justify-center bg-cyan-400 text-black hover:bg-white transition-colors comic-border-ink">
            <RotateCcw size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

        <Globe
          ref={globeRef}
          onGlobeReady={setupGlobe}
          backgroundColor="#020408"
          showAtmosphere={false}
          polygonsData={countries.features}
          // @ts-expect-error - library types
          onPolygonClick={handlePolygonClick}
          // @ts-expect-error - library types
          polygonAltitude={(d: GeoJSONFeature) => {
            const iso = d.properties.ISO_A2;
            return getCountryElevation(iso, iso === selectedIso);
          }}
          // @ts-expect-error - library types
          polygonCapColor={(d: GeoJSONFeature) => {
            const iso = d.properties.ISO_A2;
            if (iso === selectedIso) return '#ffffff';
            const data = getCountrySubjectData(iso, mode);
            return data.value > 0 ? data.color : LOWPOLY_COLORS.land;
          }}
          // @ts-expect-error - library types
          polygonSideColor={(d: GeoJSONFeature) => {
            const iso = d.properties.ISO_A2;
            if (iso === selectedIso) return '#06b6d4';
            const data = getCountrySubjectData(iso, mode);
            if (data.value > 0) return LOWPOLY_COLORS.sideLight;
            return LOWPOLY_COLORS.sideDark;
          }}
          polygonStrokeColor={() => LOWPOLY_COLORS.outline}
          // @ts-expect-error - library types
          polygonLabel={getPolygonLabel}
          polygonsTransitionDuration={400}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onZoom={handlePovUpdate as any}
        pointsData={pointsData}
        pointColor="color"
        pointRadius="size"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pointAltitude={(d: any) => d.size * 0.02}
        pointsMerge={false}
        arcsData={arcsData}
        arcColor="color"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        arcStroke={(d: any) => d.stroke}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcsTransitionDuration={400}
      />
    </div>
  );
});

export default GlobeScene;
