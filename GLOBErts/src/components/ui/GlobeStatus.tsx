import { memo } from 'react';
import type { MapMode, CountryProperties } from '../../types/index.ts';

interface GlobeStatusProps {
  zoomLevel: string;
  altitude: number;
  selectedCountry: CountryProperties | null;
  mode: MapMode;
}

export const GlobeStatus = memo(function GlobeStatus({ zoomLevel, altitude, selectedCountry, mode }: GlobeStatusProps) {
  const modeStyles: Record<MapMode, { bg: string }> = {
    tactical: { bg: 'bg-accent' },
    resources: { bg: 'bg-cyan-400' },
    economy: { bg: 'bg-emerald-500' },
    alliances: { bg: 'bg-purple-500' }
  };
  const style = modeStyles[mode];

  return (
    <div className="absolute bottom-20 left-8 z-40 transform rotate-1 animate-pop">
      <div className="bg-white comic-border p-4 font-mono comic-shadow-sm flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-black text-[9px] uppercase font-black tracking-widest mb-1">Niveau</span>
          <span className={`font-black uppercase text-black bg-yellow-400 px-1 border-2 border-black text-xs`}>{zoomLevel}</span>
        </div>
        <div className="w-1 h-8 bg-black/10" />
        <div className="flex flex-col">
          <span className="text-black text-[9px] uppercase font-black tracking-widest mb-1">Altitude</span>
          <span className="text-black font-black text-xs bg-cyan-300 px-1 border-2 border-black">{(altitude * 6371).toFixed(0)} KM</span>
        </div>
        {selectedCountry && (
          <>
            <div className="w-1 h-8 bg-black/10" />
            <div className="flex flex-col">
              <span className="text-black text-[9px] uppercase font-black tracking-widest mb-1">Cible_Lock</span>
              <span className={`text-white font-black truncate max-w-[120px] text-xs ${style.bg} px-1 border-2 border-black italic`}>{selectedCountry.ADMIN}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
