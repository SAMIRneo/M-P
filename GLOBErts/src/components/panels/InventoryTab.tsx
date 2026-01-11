import { memo } from 'react';
import { Target, Activity, AlertTriangle } from 'lucide-react';

const INVENTORY_ITEMS = [
  { label: 'Drones Recon', value: '18', progress: 75, color: 'bg-red-500', icon: <Target size={10} /> },
  { label: 'Nœuds SAT-COM', value: '12', progress: 98, color: 'bg-blue-500', icon: <Activity size={10} /> },
  { label: 'Stations ELINT', value: '34', progress: 45, color: 'bg-emerald-500', icon: <Activity size={10} /> },
  { label: 'Sous-marins', value: '06', progress: 85, color: 'bg-orange-500', icon: <AlertTriangle size={10} /> }
];

export const InventoryTab = memo(function InventoryTab() {
  return (
    <div className="space-y-2">
      {INVENTORY_ITEMS.map(item => (
        <div key={item.label} className="group p-2 bg-white/5 rounded hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/5 rounded text-white/40 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="text-[9px] uppercase font-bold">{item.label}</span>
            </div>
            <span className="text-sm font-black font-mono group-hover:text-red-400 transition-colors">{item.value}</span>
          </div>
          <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
            <div className={`h-full ${item.color} transition-all`} style={{ width: `${item.progress}%` }}></div>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 text-[8px] text-white/30">
        <span>Dernière sync: 12:34:56</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>EN LIGNE</span>
        </div>
      </div>
    </div>
  );
});
