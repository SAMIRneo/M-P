import { memo } from 'react';
import type { MapMode } from '../../types/index.ts';

interface LegendProps {
  mode: MapMode;
}

const LEGEND_DATA: Record<MapMode, { color: string; label: string; pulse?: boolean }[]> = {
  tactical: [
    { color: 'bg-accent', label: 'Conflit Actif', pulse: true },
    { color: 'bg-orange-500', label: 'Menace Haute' },
    { color: 'bg-cyan-400', label: 'Actifs Navals' },
    { color: 'bg-yellow-400', label: 'Bases Sol/Air' },
  ],
  resources: [
    { color: 'bg-yellow-400', label: 'Énergie / Fossiles' },
    { color: 'bg-cyan-400', label: 'Semi-conducteurs' },
    { color: 'bg-emerald-400', label: 'Uranium / Mat. Strat.' },
    { color: 'bg-purple-500', label: 'Terres Rares' },
  ],
  economy: [
    { color: 'bg-emerald-500', label: 'Hub Économique' },
    { color: 'bg-amber-400', label: 'Marché Émergent' },
    { color: 'bg-blue-400', label: 'Routes Maritimes' },
    { color: 'bg-accent', label: 'Zone Sanctionnée' },
  ],
  alliances: [
    { color: 'bg-blue-600', label: 'Bloc Atlantique' },
    { color: 'bg-emerald-600', label: 'Bloc BRICS+' },
    { color: 'bg-purple-600', label: 'Pacte Pacifique' },
    { color: 'bg-slate-600', label: 'Non-Alignés' },
  ]
};

export const Legend = memo(function Legend({ mode }: LegendProps) {
  const items = LEGEND_DATA[mode];
  const modeColors: Record<MapMode, string> = {
    tactical: 'text-accent',
    resources: 'text-cyan-400',
    economy: 'text-emerald-400',
    alliances: 'text-purple-400',
  };

  return (
    <div className="absolute bottom-20 right-6 z-40 animate-pop transform rotate-1">
      <div className="comic-glass comic-shadow p-4 max-w-xs halftone-dark">
        <h3 className={`text-[9px] font-black uppercase tracking-widest ${modeColors[mode]} mb-3 flex items-center gap-2`}>
          <div className={`w-2 h-2 ${modeColors[mode].replace('text', 'bg')} transform rotate-45`} />
          Légende_{mode}
        </h3>
        <div className="space-y-2">
          {items.map(({ color, label, pulse }) => (
            <div key={label} className="flex items-center gap-3 group cursor-default">
              <div className="relative">
                <div className={`w-3 h-3 comic-border-ink ${color} ${pulse ? 'animate-pulse' : ''} transform -rotate-12`} />
                {pulse && <div className={`absolute inset-0 w-3 h-3 ${color} animate-ping opacity-75`} />}
              </div>
              <span className="text-[10px] text-white font-black uppercase tracking-tight group-hover:text-accent transition-colors italic">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
