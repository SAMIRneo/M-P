import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import GlobeScene from './components/GlobeScene.tsx';
import { Header } from './components/ui/Header.tsx';
import { TelemetryBar } from './components/ui/TelemetryBar.tsx';
import { Toolbar } from './components/ui/Toolbar.tsx';
import { Legend } from './components/ui/Legend.tsx';
import { GlobeStatus } from './components/ui/GlobeStatus.tsx';
import { useSystemLoad, useCurrentTime } from './hooks/useApp.ts';
import { MILITARY_NEWS, ECONOMY_NEWS, ALLIANCE_NEWS } from './constants/data.ts';
import type { CountryProperties, MapMode, TabType, GlobeSettings, WidgetType } from './types/index.ts';

const LeftPanel = lazy(() => import('./components/panels/LeftPanel.tsx').then(m => ({ default: m.LeftPanel })));
const RightPanel = lazy(() => import('./components/panels/RightPanel.tsx').then(m => ({ default: m.RightPanel })));
const NewsTicker = lazy(() => import('./components/ui/NewsTicker.tsx').then(m => ({ default: m.NewsTicker })));

export function App() {
  const [selectedCountry, setSelectedCountry] = useState<CountryProperties | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
  const [mapMode, setMapMode] = useState<MapMode>('tactical');
  const [globeSettings, setGlobeSettings] = useState<GlobeSettings>({
    showGrid: false,
    autoRotate: true,
    showAtmosphere: false,
    showLabels: true,
    showArcs: true,
    showPoints: true,
    showHexBins: false,
    showNews: true,
    showTelemetry: true
  });
  const [pov, setPov] = useState({ altitude: 1.6, zoomLevel: 'global' });

  const systemLoad = useSystemLoad(42);
  const currentTime = useCurrentTime();

  const currentNews = useMemo(() => {
    switch (mapMode) {
      case 'economy': return ECONOMY_NEWS;
      case 'alliances': return ALLIANCE_NEWS;
      default: return MILITARY_NEWS;
    }
  }, [mapMode]);

  const handleToggleTab = useCallback((tab: 'inventory' | 'config' | 'resources') => {
    setActiveTab(prev => prev === tab ? null : tab);
    if (activeWidget === 'info') setActiveWidget(null); 
  }, [activeWidget]);

  const handleToggleWidget = useCallback((widget: 'status' | 'info') => {
    setActiveWidget(prev => prev === widget ? null : widget);
    if (widget === 'info' && activeTab) setActiveTab(null);
  }, [activeTab]);

  const handleResetView = useCallback(() => {
    setSelectedCountry(null);
    setActiveWidget(null);
  }, []);

  const handleCountryClick = useCallback((country: CountryProperties) => {
    setSelectedCountry(country);
    setActiveWidget('info');
    setActiveTab(null); 
  }, []);

  const handleSettingsChange = useCallback((settings: GlobeSettings) => {
    setGlobeSettings(settings);
  }, []);

  const handlePovChange = useCallback((newPov: { altitude: number; zoomLevel: string }) => {
    setPov(newPov);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-background overflow-hidden font-sans text-white">
      <GlobeScene 
        onCountryClick={handleCountryClick} 
        onPovChange={handlePovChange}
        selectedCountry={selectedCountry}
        settings={globeSettings}
        mode={mapMode}
      />
      
      {/* Visual FX Overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines z-10" />
      <div className="absolute inset-0 pointer-events-none vignette z-10" />

      <Header 
        mapMode={mapMode}
        setMapMode={setMapMode}
        systemLoad={systemLoad}
        currentTime={currentTime}
      />

      {globeSettings.showNews && (
        <Suspense fallback={null}>
          <NewsTicker news={currentNews} mapMode={mapMode} />
        </Suspense>
      )}

      <Toolbar
        activeTab={activeTab}
        activeWidget={activeWidget}
        onToggleTab={handleToggleTab}
        onToggleWidget={handleToggleWidget}
        mapMode={mapMode}
      />

      <Legend mode={mapMode} />

      <Suspense fallback={null}>
        <LeftPanel 
          mapMode={mapMode}
          activeTab={activeTab}
          activeWidget={activeWidget}
          onToggleTab={handleToggleTab}
          globeSettings={globeSettings}
          onSettingsChange={handleSettingsChange}
        />
      </Suspense>

      <Suspense fallback={null}>
        <RightPanel 
          selectedCountry={selectedCountry}
          mapMode={mapMode}
          onResetView={handleResetView}
          isVisible={activeWidget === 'info'}
        />
      </Suspense>

      {globeSettings.showTelemetry && (
        <>
          <TelemetryBar 
            selectedCountry={selectedCountry}
          />
          {!activeTab && activeWidget !== 'status' && (
            <GlobeStatus 
              zoomLevel={pov.zoomLevel} 
              altitude={pov.altitude} 
              selectedCountry={selectedCountry}
              mode={mapMode}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
