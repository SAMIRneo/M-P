import { memo, useMemo } from 'react';
import { Activity, Signal } from 'lucide-react';
import type { CountryProperties } from '../../types/index.ts';

interface TelemetryBarProps {
  selectedCountry: CountryProperties | null;
}

const SIGNAL_BARS = Array.from({ length: 8 }, (_, i) => i);

export const TelemetryBar = memo(function TelemetryBar({ selectedCountry }: TelemetryBarProps) {
  const coords = useMemo(() => ({
    lat: selectedCountry?.LABEL_Y?.toFixed(4) ?? '48.8566',
    lng: selectedCountry?.LABEL_X?.toFixed(4) ?? '2.3522',
    alt: selectedCountry ? '420 KM' : '1240 KM'
  }), [selectedCountry]);

        return (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-ink/90 border-t-2 border-black flex items-center px-10 justify-between z-40 backdrop-blur-md halftone-dark">
            <div className="flex gap-10 text-[9px] font-mono uppercase tracking-widest font-black">
              <div className="flex gap-3 items-center">
                <span className="text-white/40 italic">LAT:</span>
                <span className="text-accent">{coords.lat}</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-white/40 italic">LNG:</span>
                <span className="text-accent">{coords.lng}</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-white/40 italic">ALT:</span>
                <span className="text-cyan-400">{coords.alt}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-10">
              <div className="flex gap-1.5 items-center">
                <Signal size={12} className="text-white/40 mr-2" />
                {SIGNAL_BARS.map(i => (
                  <div key={i} className={`w-1.5 h-3 comic-border-ink transition-all duration-300 ${i < 6 ? 'bg-accent' : 'bg-white/5'}`} />
                ))}
                <span className="text-[8px] font-black ml-4 text-white/40 uppercase tracking-widest italic">Signal_Lock</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="flex gap-4 items-center group cursor-help">
                <Activity size={16} className="animate-pulse text-accent" strokeWidth={3} />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors italic">Stream_Active</span>
              </div>
            </div>
          </div>
        );
});
