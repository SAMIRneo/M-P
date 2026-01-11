import { memo } from 'react';
import { Activity, Database, DollarSign, Users } from 'lucide-react';
import type { MapMode } from '../../types/index.ts';

interface HeaderProps {
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  systemLoad: number;
  currentTime: Date;
}

const MODES = [
  { id: 'tactical' as const, icon: Activity, label: 'Tactique', color: 'cyan' },
  { id: 'resources' as const, icon: Database, label: 'Ressources', color: 'blue' },
  { id: 'economy' as const, icon: DollarSign, label: 'Économie', color: 'emerald' },
  { id: 'alliances' as const, icon: Users, label: 'Alliances', color: 'purple' }
] as const;

export const Header = memo(function Header({ 
  mapMode, 
  setMapMode, 
  systemLoad, 
  currentTime 
}: HeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-8 border-b-2 border-black halftone">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-accent comic-border comic-shadow flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-all duration-150 cursor-pointer group">
          <Activity className="text-white group-hover:scale-110 transition-transform" size={28} strokeWidth={3} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">
            Globe<span className="text-accent">RTs</span>
          </h1>
          <div className="bg-yellow-400 comic-border inline-block px-2 py-0.5 mt-0.5 transform rotate-1 comic-shadow-sm">
            <p className="text-[10px] text-black font-mono tracking-widest uppercase font-black">Strategic Intelligence v2026</p>
          </div>
        </div>
      </div>

      <div className="flex bg-ink comic-border p-1 comic-shadow transform -rotate-1">
        {MODES.map((mode, index) => {
          const Icon = mode.icon;
          const isActive = mapMode === mode.id;
          
          return (
            <div key={mode.id} className="flex items-center">
              {index > 0 && <div className="w-[1px] bg-white/10 mx-1 h-6"></div>}
              <button 
                onClick={() => setMapMode(mode.id)}
                className={`group relative px-5 py-2 flex items-center gap-3 transition-all duration-150 ${
                  isActive 
                    ? 'bg-primary text-ink comic-shadow-sm translate-x-0.5 -translate-y-0.5' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'text-current'} strokeWidth={3} />
                <span className="text-[13px] font-black uppercase tracking-tight">
                  {mode.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] text-black uppercase font-black tracking-widest bg-cyan-400 comic-border px-1.5 py-0.5 comic-shadow-sm">System Load</span>
          <div className="w-32 h-3 bg-ink comic-border p-0.5">
            <div 
              className={`h-full transition-all duration-500 ${systemLoad > 80 ? 'bg-accent' : 'bg-cyan-400'}`} 
              style={{ width: `${systemLoad}%` }}
            />
          </div>
        </div>
        <div className="text-right font-mono bg-white px-4 py-1.5 comic-border comic-shadow transform rotate-2">
          <div className="text-[10px] text-black/60 font-black uppercase tracking-widest leading-none mb-0.5">{currentTime.toLocaleDateString('fr-FR')}</div>
          <div className="text-[18px] text-black font-black tracking-tighter leading-none">
            {currentTime.toLocaleTimeString('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
});
