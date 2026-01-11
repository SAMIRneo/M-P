import { memo } from 'react';
import { X } from 'lucide-react';
import type { TabType, MapMode, GlobeSettings, WidgetType } from '../../types/index.ts';
import { StatusWidget } from './StatusWidget.tsx';
import { InventoryTab } from './InventoryTab.tsx';
import { ConfigTab } from './ConfigTab.tsx';
import { DataTab } from './DataTab.tsx';

interface LeftPanelProps {
  mapMode: MapMode;
  activeTab: TabType;
  activeWidget: WidgetType;
  onToggleTab: (tab: 'inventory' | 'config' | 'resources') => void;
  globeSettings: GlobeSettings;
  onSettingsChange: (settings: GlobeSettings) => void;
}

export const LeftPanel = memo(function LeftPanel({
  mapMode,
  activeTab,
  activeWidget,
  onToggleTab,
  globeSettings,
  onSettingsChange
}: LeftPanelProps) {
  const tabTitles = {
    inventory: 'ACTIFS MONDIAUX',
    config: 'CONFIG SYSTÈME',
    resources: 'ANALYSES GLOBALES'
  };

  return (
    <>
      <div className="absolute top-1/2 -translate-y-1/2 left-28 z-40 max-h-[85vh] flex items-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-4">
          {activeWidget === 'status' && (
            <div className="w-[380px] animate-pop">
              <StatusWidget mapMode={mapMode} />
            </div>
          )}

          {activeTab && (
            <div className="w-[380px] animate-pop transform -rotate-1">
              <div className="comic-glass comic-shadow overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b-2 border-black bg-accent">
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white italic">
                    {tabTitles[activeTab]}
                  </h3>
                  <button 
                    onClick={() => onToggleTab(activeTab)}
                    className="w-8 h-8 flex items-center justify-center comic-border bg-white text-black hover:bg-black hover:text-white transition-colors"
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                </div>
                <div className="p-5 max-h-[65vh] overflow-y-auto custom-scrollbar halftone-dark">
                  {activeTab === 'inventory' && <InventoryTab />}
                  {activeTab === 'config' && (
                    <ConfigTab 
                      settings={globeSettings} 
                      onSettingsChange={onSettingsChange} 
                    />
                  )}
                  {activeTab === 'resources' && <DataTab />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
