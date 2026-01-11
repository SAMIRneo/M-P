import { memo, useMemo } from 'react';
import { Activity } from 'lucide-react';
import type { MapMode } from '../../types/index.ts';

interface NewsTickerProps {
  news: string[];
  mapMode: MapMode;
}

const MODE_COLORS: Record<MapMode, { bg: string; border: string; badge: string; text: string; icon: string }> = {
  tactical: { bg: 'bg-ink/60', border: 'border-accent', badge: 'bg-accent', text: 'text-accent', icon: 'text-white' },
  resources: { bg: 'bg-ink/60', border: 'border-blue-500', badge: 'bg-blue-500', text: 'text-blue-400', icon: 'text-white' },
  economy: { bg: 'bg-ink/60', border: 'border-emerald-500', badge: 'bg-emerald-500', text: 'text-emerald-400', icon: 'text-white' },
  alliances: { bg: 'bg-ink/60', border: 'border-purple-500', badge: 'bg-purple-500', text: 'text-purple-400', icon: 'text-white' }
};

const MODE_LABELS: Record<MapMode, string> = {
  tactical: 'Alerte Tactique',
  resources: 'Flux Ressources',
  economy: 'Indice Éco',
  alliances: 'Pacte Global'
};

export const NewsTicker = memo(function NewsTicker({ news, mapMode }: NewsTickerProps) {
  const colors = MODE_COLORS[mapMode];
  const label = MODE_LABELS[mapMode];

  const newsItems = useMemo(() => news.slice(0, 5).map((item, i) => (
    <span key={i} className="flex items-center gap-6">
      <span className="font-black italic">{item}</span>
      <span className="text-white/20">///</span>
    </span>
  )), [news]);

    return (
      <div className={`absolute top-20 left-0 right-0 h-10 ${colors.bg} border-b-2 border-black z-30 flex items-center overflow-hidden backdrop-blur-md halftone-dark`}>
        <div className={`${colors.badge} px-6 h-full flex items-center text-[10px] font-black uppercase italic tracking-widest z-10 comic-border-ink comic-shadow-sm transform -skew-x-12 -translate-x-2`}>
          <div className="transform skew-x-12 flex items-center gap-3">
            <Activity size={14} className="animate-pulse" strokeWidth={3} />
            {label}
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative flex items-center h-full">
          <div className={`animate-ticker text-[11px] font-mono ${colors.text} uppercase tracking-widest flex items-center gap-12 font-black`}>
            {newsItems}
            {newsItems}
          </div>
        </div>
      </div>
    );
});
