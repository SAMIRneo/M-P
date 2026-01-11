import { memo } from 'react';
import { Package, Settings, Database, AlertTriangle, Info, X } from 'lucide-react';
import type { TabType, MapMode, WidgetType } from '../../types/index.ts';

interface ToolbarProps {
  activeTab: TabType;
  activeWidget: WidgetType;
  onToggleTab: (tab: 'inventory' | 'config' | 'resources') => void;
  onToggleWidget: (widget: 'status' | 'info') => void;
  mapMode: MapMode;
}

export const Toolbar = memo(function Toolbar({
  activeTab,
  activeWidget,
  onToggleTab,
  onToggleWidget,
  mapMode
}: ToolbarProps) {
    const tabs = [
      { id: 'inventory' as const, icon: <Package size={24} strokeWidth={3} />, label: 'Actifs', color: 'bg-emerald-400' },
      { id: 'config' as const, icon: <Settings size={24} strokeWidth={3} />, label: 'Système', color: 'bg-blue-400' },
      { id: 'resources' as const, icon: <Database size={24} strokeWidth={3} />, label: 'Données', color: 'bg-purple-400' },
    ];

    const widgets = [
      { id: 'status' as const, icon: <AlertTriangle size={24} strokeWidth={3} />, label: 'Statut', color: mapMode === 'tactical' ? 'bg-accent' : 'bg-cyan-400' },
      { id: 'info' as const, icon: <Info size={24} strokeWidth={3} />, label: 'Info', color: 'bg-yellow-400' },
    ];

    return (
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
        <div className="bg-ink comic-border p-1.5 flex flex-col gap-3 comic-shadow transform -rotate-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onToggleTab(tab.id)}
              className={`group relative w-12 h-12 flex items-center justify-center comic-border transition-all duration-100 ${
                activeTab === tab.id 
                  ? tab.color + ' text-black translate-x-0.5 -translate-y-0.5 comic-shadow-sm'
                  : 'bg-white text-black hover:bg-yellow-400'
              }`}
            >
              {tab.icon}
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-yellow-400 comic-border text-[11px] font-black uppercase tracking-tight text-black whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-100 -translate-x-2 group-hover:translate-x-0 comic-shadow-sm z-50">
                {tab.label}
              </div>
            </button>
          ))}
        </div>
        
        <div className="bg-ink comic-border p-1.5 flex flex-col gap-3 comic-shadow transform rotate-1">
          {widgets.map(widget => (
            <button
              key={widget.id}
              onClick={() => onToggleWidget(widget.id)}
              className={`group relative w-12 h-12 flex items-center justify-center comic-border transition-all duration-100 ${
                activeWidget === widget.id 
                  ? widget.color + ' text-black translate-x-0.5 -translate-y-0.5 comic-shadow-sm'
                  : 'bg-white text-black hover:bg-cyan-300'
              }`}
            >
              {activeWidget === widget.id ? <X size={24} strokeWidth={3} /> : widget.icon}
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-cyan-300 comic-border text-[11px] font-black uppercase tracking-tight text-black whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-100 -translate-x-2 group-hover:translate-x-0 comic-shadow-sm z-50">
                {widget.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
});
