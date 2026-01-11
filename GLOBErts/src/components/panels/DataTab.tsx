import { memo } from 'react';
import { Activity, ArrowUpRight, Users, Wifi, Shield } from 'lucide-react';

const EVENTS = [
  { id: 1, type: 'traffic', label: 'Pic de trafic détecté', loc: 'Amérique du Nord', val: '+24%', status: 'up' },
  { id: 2, type: 'security', label: 'Menace cybernétique', loc: 'Europe de l\'Est', val: 'CRITIQUE', status: 'down' },
  { id: 3, type: 'user', label: 'Nouveaux utilisateurs', loc: 'Asie Pacifique', val: '+1,2k', status: 'up' },
  { id: 4, type: 'system', label: 'Mise à jour satellite', loc: 'Orbite Basse', val: '100%', status: 'neutral' },
  { id: 5, type: 'traffic', label: 'Congestion réseau', loc: 'Europe de l\'Ouest', val: '-5%', status: 'down' },
];

export const DataTab = memo(function DataTab() {
  return (
    <div className="space-y-5">
      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1 hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between text-white/40">
            <Users size={12} />
            <ArrowUpRight size={12} className="text-emerald-500" />
          </div>
          <div className="text-lg font-black text-white tracking-tight">24.5k</div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider font-bold">Utilisateurs Actifs</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1 hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between text-white/40">
            <Wifi size={12} />
            <Activity size={12} className="text-blue-500" />
          </div>
          <div className="text-lg font-black text-white tracking-tight">12ms</div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider font-bold">Latence Globale</div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">Flux en temps réel</h3>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          {EVENTS.map((evt) => (
            <div key={evt.id} className="group flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  evt.type === 'traffic' ? 'bg-blue-500/20 text-blue-400' :
                  evt.type === 'security' ? 'bg-red-500/20 text-red-400' :
                  evt.type === 'user' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-white/10 text-white/60'
                }`}>
                  {evt.type === 'traffic' && <Activity size={14} />}
                  {evt.type === 'security' && <Shield size={14} />}
                  {evt.type === 'user' && <Users size={14} />}
                  {evt.type === 'system' && <Wifi size={14} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">{evt.label}</span>
                  <span className="text-[9px] text-white/40">{evt.loc}</span>
                </div>
              </div>
              <div className={`text-[10px] font-mono font-bold ${
                evt.status === 'up' ? 'text-emerald-400' :
                evt.status === 'down' ? 'text-red-400' :
                'text-white/60'
              }`}>
                {evt.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
