import { memo } from 'react';
import { X, Activity } from 'lucide-react';
import type { CountryProperties, MapMode } from '../../types/index.ts';
import { CountryAnalytics } from './CountryAnalytics.tsx';

interface RightPanelProps {
  selectedCountry: CountryProperties | null;
  mapMode: MapMode;
  onResetView: () => void;
  isVisible: boolean;
}

export const RightPanel = memo(function RightPanel({ 
  selectedCountry, 
  mapMode, 
  onResetView,
  isVisible
}: RightPanelProps) {
  if (!isVisible || !selectedCountry) return null;

  const countryData = selectedCountry.countryData;

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-12 z-40 w-[420px] max-h-[85vh] flex flex-col animate-slide-pop transform -rotate-1">
      <div className="comic-glass comic-shadow flex flex-col max-h-full overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-ink text-white halftone">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none italic text-accent">{selectedCountry.ADMIN}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-black font-mono font-black tracking-widest bg-yellow-400 px-1.5 py-0.5 comic-border-ink">{selectedCountry.ISO_A2 || countryData?.iso}</span>
              {countryData && (
                <>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-[10px] text-white/70 font-black uppercase tracking-widest">{countryData.capital}</span>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={onResetView}
            className="w-10 h-10 flex items-center justify-center comic-border bg-white text-black hover:bg-accent hover:text-white transition-all group"
          >
            <X size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar relative z-10 flex-1 halftone-dark">
          {countryData ? (
            <CountryAnalytics data={countryData} mode={mapMode} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/10">
              <Activity size={40} strokeWidth={3} className="mb-3 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">NO_DATA_STREAM</span>
            </div>
          )}
        </div>
        
        {countryData && (
          <div className="px-5 py-2 border-t-2 border-black bg-cyan-400">
             <span className="text-[9px] font-black uppercase tracking-widest text-black italic">Population: {countryData.population} Units</span>
          </div>
        )}
      </div>
    </div>
  );
});
