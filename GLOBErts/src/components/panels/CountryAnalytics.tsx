import { memo, useMemo } from 'react';
import { Users, Activity, ShieldCheck, Zap, Anchor, Target, Banknote, Radar, Satellite, TrendingUp, Handshake, TriangleAlert, Trophy, Scale } from 'lucide-react';
import type { CountryData, MapMode } from '../../types/index.ts';

interface CountryAnalyticsProps {
  data: CountryData;
  mode: MapMode;
}

const TacticalView = ({ data }: { data: CountryData }) => (
  <div className="space-y-5 animate-pop">
    <div className="flex items-center gap-3">
       <div className="flex-1 bg-white p-3 comic-border-ink comic-shadow-sm flex items-center justify-between">
         <div className="flex flex-col">
           <span className="text-[9px] text-black/60 font-black uppercase tracking-widest">Rang Global</span>
           <span className="text-xl font-black text-black leading-none mt-0.5">#{data.military.rank}</span>
         </div>
         <Trophy size={18} className="text-accent" />
       </div>
       {data.military.nuclearPower && (
         <div className="flex-1 bg-accent p-3 comic-border-ink comic-shadow-sm flex items-center justify-between">
           <div className="flex flex-col">
             <span className="text-[9px] text-white/60 font-black uppercase tracking-widest">Cap. Nucléaire</span>
             <span className="text-xs font-black text-white uppercase tracking-widest mt-0.5">Actif</span>
           </div>
           <TriangleAlert size={18} className="text-white animate-pulse" />
         </div>
       )}
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 p-3 comic-border-ink flex flex-col gap-1 halftone-dark">
        <div className="flex items-center justify-between text-white/40 text-[9px] font-black uppercase tracking-widest">
          <span>Effectifs</span>
          <Users size={14} />
        </div>
        <div className="text-lg font-black text-white tracking-tighter">{data.military.personnel}</div>
      </div>
      <div className="bg-white/5 p-3 comic-border-ink flex flex-col gap-1 halftone-dark">
        <div className="flex items-center justify-between text-white/40 text-[9px] font-black uppercase tracking-widest">
          <span>Budget</span>
          <Banknote size={14} />
        </div>
        <div className="text-lg font-black text-white tracking-tighter">{data.military.budget}</div>
      </div>
    </div>

    <div className="bg-white p-4 comic-border-ink comic-shadow-sm transform rotate-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
          <ShieldCheck size={16} />
          <span>Statut Opérationnel</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div 
              key={lvl}
              className={`w-2.5 h-4 comic-border-ink ${lvl >= data.military.defcon ? 'bg-accent animate-pulse' : 'bg-black/10'}`}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] text-black/60 font-black tracking-widest uppercase italic">
          <span>Disponibilité</span>
          <span>{data.military.readiness}%</span>
        </div>
        <div className="h-2 bg-black/10 comic-border-ink p-0.5">
          <div 
            className="h-full bg-black transition-all duration-700" 
            style={{ width: `${data.military.readiness}%` }} 
          />
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></span>
        Actifs Stratégiques
      </h3>
      <div className="grid grid-cols-1 gap-1.5">
        {data.military.assets.length > 0 ? (
          data.military.assets.map((asset, i) => (
            <div key={i} className="flex items-center justify-between bg-ink/40 p-2.5 comic-border-ink hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 comic-border-ink bg-white/5 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-white transition-colors">
                  {asset.type === 'fleet' ? <Anchor size={14} /> : 
                   asset.type === 'base' ? <Activity size={14} /> : 
                   asset.type === 'radar' ? <Radar size={14} /> :
                   asset.type === 'satellite' ? <Satellite size={14} /> :
                   <Target size={14} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white uppercase italic leading-none">{asset.name}</span>
                  <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{asset.status}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[9px] text-white/20 italic font-black uppercase tracking-widest">Aucun signal détecté</div>
        )}
      </div>
    </div>
  </div>
);

const ResourcesView = ({ data }: { data: CountryData }) => (
  <div className="space-y-5 animate-pop">
    <div className="bg-cyan-400 p-4 comic-border-ink comic-shadow-sm transform -rotate-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
          <Zap size={16} />
          <span>Matrice Énergie</span>
        </div>
        {data.energy?.consumption && (
          <div className="text-[10px] font-mono font-black text-black italic">
            {data.energy.consumption} TWh
          </div>
        )}
      </div>
      <div className="space-y-3">
        {data.energy?.production ? (
          data.energy.production.map((prod, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-[9px] uppercase font-black text-black/60 italic">
                <span>{prod.type}</span>
                <span>{prod.value}%</span>
              </div>
              <div className="h-2 bg-black/10 comic-border-ink p-0.5">
                <div 
                  className="h-full bg-black" 
                  style={{ width: `${prod.value}%` }} 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-[9px] text-black/30 italic text-center py-4 font-black">DONNÉES INDISPONIBLES</div>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 p-3 comic-border-ink halftone-dark">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-cyan-400 mb-2">Flux Export</h3>
        <div className="space-y-2">
          {data.economy.mainExports.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 transform rotate-45" />
              <span className="text-[10px] font-black text-white uppercase italic truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/5 p-3 comic-border-ink halftone-dark">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Besoins Import</h3>
        <div className="space-y-2">
          {data.economy.mainImports?.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent transform rotate-45" />
              <span className="text-[10px] font-black text-white uppercase italic truncate">{item}</span>
            </div>
          )) || <span className="text-[9px] text-white/20 font-black">N/A</span>}
        </div>
      </div>
    </div>
  </div>
);

const EconomyView = ({ data }: { data: CountryData }) => {
  const isPositiveBalance = data.economy.tradeBalance.startsWith('+');
  const growthValue = parseFloat(data.economy.gdpGrowth.replace('%', ''));
  const stabilityScore = Math.min(100, Math.max(0, 50 + (growthValue * 10) + (isPositiveBalance ? 10 : -10)));
  
  return (
    <div className="space-y-5 animate-pop">
      <div className="bg-white p-4 comic-border-ink comic-shadow-sm flex items-center justify-between transform rotate-1">
         <div className="flex flex-col gap-1">
           <span className="text-[9px] text-black/60 font-black uppercase tracking-widest">Indice Stabilité</span>
           <div className="flex items-baseline gap-2">
             <span className="text-2xl font-black text-black leading-none">{Math.round(stabilityScore)}%</span>
             <span className={`text-[10px] font-black uppercase italic ${stabilityScore > 70 ? 'text-emerald-600' : stabilityScore > 40 ? 'text-yellow-600' : 'text-accent'}`}>
               {stabilityScore > 70 ? 'Optimal' : stabilityScore > 40 ? 'Stable' : 'Critique'}
             </span>
           </div>
         </div>
         <Activity size={28} className="text-black/20" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 p-3 comic-border-ink flex flex-col gap-1 halftone-dark">
          <div className="flex items-center justify-between text-white/40 text-[9px] font-black uppercase tracking-widest">
            <span>PIB Nominal</span>
            <Banknote size={14} />
          </div>
          <div className="text-lg font-black text-white tracking-tighter">{data.economy.gdp}</div>
        </div>
        <div className="bg-white/5 p-3 comic-border-ink flex flex-col gap-1 halftone-dark">
          <div className="flex items-center justify-between text-white/40 text-[9px] font-black uppercase tracking-widest">
            <span>Croissance</span>
            <TrendingUp size={14} className={growthValue >= 0 ? 'text-emerald-400' : 'text-accent'} />
          </div>
          <div className={`text-lg font-black tracking-tighter ${growthValue >= 0 ? 'text-emerald-400' : 'text-accent'}`}>
            {data.economy.gdpGrowth}
          </div>
        </div>
      </div>

      <div className="bg-ink/40 comic-border-ink p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-emerald-400" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">Balance Commerciale</h3>
          </div>
          {data.economy.currency && (
             <div className="text-[10px] font-black text-emerald-400 italic">
               {data.economy.currency}
             </div>
          )}
        </div>
        
        <div className={`p-3 comic-border-ink comic-shadow-sm flex items-center justify-between ${isPositiveBalance ? 'bg-emerald-400' : 'bg-accent'}`}>
           <span className="text-xl font-black text-black leading-none">
             {data.economy.tradeBalance}
           </span>
           <div className="text-[9px] font-black uppercase bg-black text-white px-2 py-0.5 transform -skew-x-12">
             {isPositiveBalance ? 'EXCÉDENT' : 'DÉFICIT'}
           </div>
        </div>

        {data.economy.sanctions && (
           <div className="flex items-center gap-3 p-3 bg-accent/10 comic-border-ink border-accent/20">
             <ShieldCheck size={18} className="text-accent" />
             <div className="flex flex-col">
               <span className="text-[8px] text-accent font-black uppercase tracking-widest">Sanctions Actives</span>
               <span className="text-[11px] text-white font-black italic leading-tight">{data.economy.sanctions}</span>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

const AlliancesView = ({ data }: { data: CountryData }) => {
  const partnersCount = data.diplomacy?.partners?.length || 0;
  const enemiesCount = data.diplomacy?.enemies?.length || 0;
  
  return (
    <div className="space-y-5 animate-pop">
      <div className="grid grid-cols-2 gap-3">
         <div className="bg-white p-3 comic-border-ink comic-shadow-sm text-center transform -rotate-1">
            <div className="text-2xl font-black text-black leading-none">{partnersCount}</div>
            <div className="text-[9px] text-black/60 uppercase tracking-widest font-black mt-1 italic">Partenaires</div>
         </div>
         <div className="bg-accent p-3 comic-border-ink comic-shadow-sm text-center transform rotate-1">
            <div className="text-2xl font-black text-white leading-none">{enemiesCount}</div>
            <div className="text-[9px] text-white/60 uppercase tracking-widest font-black mt-1 italic">Rivaux</div>
         </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-alliances rounded-full animate-ping"></span>
          Blocs Géopolitiques
        </h3>
        <div className="space-y-1.5">
          {data.alliances.length > 0 ? (
            data.alliances.map((alliance, i) => (
              <div key={i} className="bg-ink/60 p-3 comic-border-ink flex items-center justify-between group hover:bg-alliances/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 comic-border-ink bg-white/5 flex items-center justify-center text-alliances font-black text-[10px] group-hover:bg-alliances group-hover:text-white transition-colors">
                    {alliance.name.substring(0, 2)}
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-white uppercase italic leading-none">{alliance.name}</div>
                    <div className="text-[9px] text-white/20 uppercase tracking-widest font-black mt-1">{alliance.type}</div>
                  </div>
                </div>
                <div className="w-2 h-2 bg-alliances transform rotate-45 animate-pulse" />
              </div>
            ))
          ) : (
            <div className="text-[9px] text-white/20 font-black italic uppercase tracking-widest">A-POLITIQUE / NON-ALIGNÉ</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CountryAnalytics = memo(function CountryAnalytics({ data, mode }: CountryAnalyticsProps) {
  const content = useMemo(() => {
    switch (mode) {
      case 'tactical': return <TacticalView data={data} />;
      case 'resources': return <ResourcesView data={data} />;
      case 'economy': return <EconomyView data={data} />;
      case 'alliances': return <AlliancesView data={data} />;
      default: return <TacticalView data={data} />;
    }
  }, [mode, data]);

  return (
    <div className="min-h-[300px]">
      {content}
    </div>
  );
});
