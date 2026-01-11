import { memo, useCallback } from 'react';
import type { GlobeSettings } from '../../types/index.ts';

interface ConfigTabProps {
  settings: GlobeSettings;
  onSettingsChange: (settings: GlobeSettings) => void;
}

const CONFIG_OPTIONS: { id: keyof GlobeSettings; label: string; desc: string; category: string }[] = [
  { id: 'autoRotate', label: 'Rotation Auto', desc: 'Rotation orbitale du globe', category: 'Globe' },
  { id: 'showAtmosphere', label: 'Atmosphère', desc: 'Effet de halo lumineux', category: 'Globe' },
  { id: 'showGrid', label: 'Grille Tactique', desc: 'Overlay hexagonal', category: 'Globe' },
  { id: 'showLabels', label: 'Labels', desc: 'Noms des pays au survol', category: 'Globe' },
  { id: 'showArcs', label: 'Arcs Logistiques', desc: 'Lignes de connexion', category: 'Tactique' },
  { id: 'showPoints', label: 'Points Tactiques', desc: 'Marqueurs stratégiques', category: 'Tactique' },
  { id: 'showHexBins', label: 'Activité Globale', desc: 'Densité de données (Hex)', category: 'Tactique' },
  { id: 'showNews', label: 'Flash Info', desc: 'Bandeau d\'actualités', category: 'Interface' },
  { id: 'showTelemetry', label: 'Télémétrie', desc: 'Barre de coordonnées', category: 'Interface' }
];

export const ConfigTab = memo(function ConfigTab({ settings, onSettingsChange }: ConfigTabProps) {
  const toggleSetting = useCallback((id: keyof GlobeSettings) => {
    onSettingsChange({ ...settings, [id]: !settings[id] });
  }, [settings, onSettingsChange]);

  const categories = ['Globe', 'Tactique', 'Interface'];

  return (
    <div className="space-y-3">
      {categories.map(category => (
        <div key={category}>
          <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-2">{category}</div>
          <div className="space-y-1">
            {CONFIG_OPTIONS.filter(opt => opt.category === category).map(opt => (
              <div 
                key={opt.id} 
                className="flex items-center justify-between group cursor-pointer p-1.5 rounded hover:bg-white/5 transition-colors" 
                onClick={() => toggleSetting(opt.id)}
              >
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-white/70 group-hover:text-white transition-colors">{opt.label}</span>
                  <span className="text-[7px] text-white/30">{opt.desc}</span>
                </div>
                <button 
                  className={`w-8 h-4 rounded-full relative transition-all duration-200 ${settings[opt.id] ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200 ${settings[opt.id] ? 'right-0.5 shadow-[0_0_6px_rgba(59,130,246,0.8)]' : 'left-0.5 opacity-50'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="border-t border-white/10 pt-2 mt-2">
        <button 
          onClick={() => onSettingsChange({
            showGrid: true,
            autoRotate: true,
            showAtmosphere: true,
            showLabels: true,
            showArcs: true,
            showPoints: true,
            showHexBins: true,
            showNews: true,
            showTelemetry: true
          })}
          className="w-full py-1.5 bg-white/5 hover:bg-white/10 rounded text-[8px] font-bold uppercase tracking-wide transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
});
