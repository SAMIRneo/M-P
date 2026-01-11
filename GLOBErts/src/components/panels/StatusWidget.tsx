import { memo } from 'react';
import { AlertTriangle, Database, TrendingUp, Users } from 'lucide-react';
import type { MapMode } from '../../types/index.ts';

interface StatusWidgetProps {
  mapMode: MapMode;
}

const STATUS_DATA = {
  tactical: {
    icon: AlertTriangle,
    title: 'Zones Actives',
    accent: 'bg-accent',
    items: [
      { name: 'Ukraine-Russie', status: 'Intensité Haute', color: 'bg-accent' },
      { name: 'Moyen-Orient', status: 'Alerte Critique', color: 'bg-orange-500' },
      { name: 'Taïwan Détroit', status: 'Alerte Navale', color: 'bg-yellow-500' }
    ]
  },
  resources: {
    icon: Database,
    title: 'Flux Ressources',
    accent: 'bg-blue-500',
    items: [
      { name: 'Taïwan', status: 'Semi-cond.', color: 'bg-cyan-400' },
      { name: 'Australie', status: 'Lithium', color: 'bg-cyan-600' },
      { name: 'RDC (Katanga)', status: 'Cobalt', color: 'bg-blue-500' }
    ]
  },
  economy: {
    icon: TrendingUp,
    title: 'Marchés Clés',
    accent: 'bg-emerald-500',
    items: [
      { name: 'États-Unis', status: '$27,4T', color: 'bg-emerald-500' },
      { name: 'Chine', status: '$18,5T', color: 'bg-emerald-400' },
      { name: 'Inde', status: 'Croiss. +7%', color: 'bg-emerald-300' }
    ]
  },
  alliances: {
    icon: Users,
    title: 'Blocs Majeurs',
    accent: 'bg-purple-500',
    items: [
      { name: 'OTAN', status: '32 Membres', color: 'bg-blue-500' },
      { name: 'BRICS+', status: '10 Membres', color: 'bg-emerald-500' },
      { name: 'AUKUS', status: 'Indo-Pacifique', color: 'bg-purple-500' }
    ]
  }
};

export const StatusWidget = memo(function StatusWidget({ mapMode }: StatusWidgetProps) {
  const data = STATUS_DATA[mapMode];
  const Icon = data.icon;

    return (
      <div className="comic-glass comic-shadow transform rotate-1 overflow-hidden">
        <div className={`flex items-center gap-3 px-4 py-2 border-b-2 border-black ${data.accent} halftone`}>
          <Icon size={18} className="text-white" strokeWidth={3} />
          <h3 className="text-[11px] font-black uppercase tracking-wider text-white italic">{data.title}</h3>
        </div>
        <div className="p-3 space-y-1 halftone-dark bg-white/5">
          {data.items.map(item => (
            <div key={item.name} className="flex items-center justify-between group cursor-pointer hover:bg-white/10 p-2 comic-border-ink transition-all">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-4 ${item.color} comic-border-ink transform -skew-x-12`}></span>
                <span className="text-[10px] font-black uppercase tracking-tight text-white">{item.name}</span>
              </div>
              <span className="text-[9px] font-mono text-white/40 group-hover:text-accent font-black tracking-widest uppercase italic">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
});
