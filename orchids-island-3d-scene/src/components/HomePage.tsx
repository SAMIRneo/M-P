'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Gamepad2, Volume2, Monitor, Zap, Map, Sword, Users, Star, ChevronRight, Trophy, Shield, Info } from 'lucide-react';

interface HomePageProps {
  onEnter: () => void;
}

export function HomePage({ onEnter }: HomePageProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [onlineCount, setOnlineCount] = useState(1240);

  const features = [
    { icon: <Map className="w-8 h-8" />, title: "2 Îles Uniques", desc: "Explorez l'île préhistorique et l'arène romaine avec des biomes détaillés." },
    { icon: <Sword className="w-8 h-8" />, title: "Combat Dynamique", desc: "Système de combat fluide contre des dinosaures et gardiens mythiques." },
    { icon: <Zap className="w-8 h-8" />, title: "Hoverboard Pro", desc: "Vitesse extrême et acrobaties aériennes sur votre hoverboard high-tech." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 z-[200] transition-all duration-1000 ${isEntering ? 'opacity-0 scale-110' : 'opacity-100 scale-100'} overflow-hidden`}>
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 transition-transform duration-[10s] ease-in-out scale-110"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1e1e3f 0%, #0a0a1a 100%)',
          animation: 'bg-pulse 20s infinite alternate'
        }}
      />
      
      {/* Background Layers */}
      <div className="absolute inset-0">
        <div className="halftone-bg absolute inset-0 opacity-40" />
        <div className="grid-bg absolute inset-0 opacity-20" />
        <div className="vignette absolute inset-0" />
        
        {/* Animated Orbs */}
        <div className="orb absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-purple-600/20 blur-[120px] rounded-full animate-float-slow" />
        <div className="orb absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] bg-blue-600/20 blur-[100px] rounded-full animate-float-reverse" />
        <div className="orb absolute top-[40%] right-[20%] w-[25vw] h-[25vw] bg-pink-600/10 blur-[80px] rounded-full animate-float" />
      </div>

      {/* Header Bar */}
      <div className="absolute top-0 left-0 w-full h-16 px-8 flex items-center justify-between z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center rotate-3 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="font-black text-black italic">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-sm tracking-[0.2em] uppercase">Orchids Island</span>
            <span className="text-yellow-400 text-[10px] font-bold uppercase">v2.0 Beta Live</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white/60 text-[11px] font-bold tracking-widest uppercase">{onlineCount} Joueurs en ligne</span>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-white/60 hover:text-yellow-400 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pt-16">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Section */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-tighter transform -rotate-1">Update #42</span>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Season of Giants</span>
            </div>

            <div className="relative mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-4 bg-yellow-400/20 blur-3xl opacity-50" />
              <h1 className="comic-title-pro text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]">
                ORCHIDS
              </h1>
              <div className="absolute -top-6 -right-12 rotate-12">
                <div className="premium-badge">
                  <Star className="w-4 h-4 text-black fill-black" />
                  <span>3D WORLD</span>
                </div>
              </div>
            </div>

            <p className="text-xl sm:text-2xl text-white/80 font-medium mb-10 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Maîtrisez votre <span className="text-yellow-400 font-black italic">Hoverboard</span>, explorez des biomes extraordinaires et forgez votre propre légende dans cette aventure <span className="text-cyan-400 underline decoration-2 underline-offset-4">Comic-3D</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={handleEnter}
                disabled={isEntering}
                className="premium-play-button group"
              >
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                <span className="relative flex items-center justify-center gap-4">
                  LANCER L'AVENTURE
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>

          {/* Sidebar Info Panels */}
          <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 animate-fade-in-right" style={{ animationDelay: '0.5s' }}>
            
            {/* Features Panel */}
            <div className="glass-panel p-1 group">
              <div className="bg-[#0a0a1a]/80 p-6 h-full backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-black text-sm uppercase tracking-[0.3em] flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Gameplay
                  </h3>
                  <div className="flex gap-1">
                    {features.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-1 transition-all duration-500 ${activeFeature === i ? 'bg-yellow-400 w-12' : 'bg-white/10'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="relative h-24 overflow-hidden">
                  {features.map((feature, i) => (
                    <div 
                      key={i}
                      className={`absolute inset-0 flex items-start gap-4 transition-all duration-700 ${
                        activeFeature === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-lg mb-1 uppercase tracking-tight">{feature.title}</h4>
                        <p className="text-sm text-white/50 leading-snug">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 bg-[#0a0a1a]/60 hover:bg-yellow-400/5 transition-colors group cursor-default">
                <div className="flex flex-col gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sécurité</span>
                  <span className="text-white font-bold text-xs uppercase italic">Anti-Cheat Active</span>
                </div>
              </div>
              <div className="glass-panel p-4 bg-[#0a0a1a]/60 hover:bg-pink-400/5 transition-colors group cursor-default">
                <div className="flex flex-col gap-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Serveur</span>
                  <span className="text-white font-bold text-xs uppercase italic">Région: EU-WEST-1</span>
                </div>
              </div>
            </div>

            {/* Event Panel */}
            <div className="glass-panel overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center overflow-hidden bg-black">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-spin-slow" />
                </div>
                <div className="flex flex-col">
                  <span className="text-yellow-400 font-black text-[10px] uppercase tracking-widest">Événement Spécial</span>
                  <span className="text-white font-bold uppercase tracking-tight">Double XP ce weekend !</span>
                </div>
                <Info className="w-5 h-5 ml-auto text-white/20" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Controls Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 w-full max-w-sm">
        <div className="flex gap-8 items-center justify-center w-full">
          <ControlKey keyName="ZQSD" label="Move" />
          <div className="w-px h-6 bg-white/10" />
          <ControlKey keyName="Espace" label="Jump" />
          <div className="w-px h-6 bg-white/10" />
          <ControlKey keyName="Shift" label="Boost" />
        </div>
        <div className="h-[2px] w-12 bg-yellow-400/30" />
        <span className="text-white/20 text-[10px] font-bold tracking-[0.5em] uppercase">© 2026 Orchids Island Studios</span>
      </div>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      <style jsx>{`
        .halftone-bg {
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 16px 16px;
        }
        
        .grid-bg {
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .vignette {
          background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%);
        }

        .comic-title-pro {
          font-family: 'Impact', 'Arial Black', sans-serif;
          font-weight: 900;
          color: white;
          line-height: 0.8;
          text-transform: uppercase;
          letter-spacing: -4px;
          -webkit-text-stroke: 6px #000;
          paint-order: stroke fill;
          text-shadow: 
            8px 8px 0 #000,
            12px 12px 0 rgba(251, 191, 36, 0.4),
            16px 16px 0 rgba(0, 0, 0, 0.2);
          animation: float-slight 6s ease-in-out infinite;
        }

        .premium-badge {
          background: #fbbf24;
          padding: 8px 20px;
          font-family: 'Impact', 'Arial Black', sans-serif;
          font-size: 1.25rem;
          font-weight: 900;
          color: #000;
          display: flex;
          items-center: center;
          gap: 8px;
          border: 4px solid #000;
          box-shadow: 6px 6px 0 #000;
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .premium-play-button {
          position: relative;
          overflow: hidden;
          padding: 24px 64px;
          font-family: 'Impact', 'Arial Black', sans-serif;
          font-size: 1.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: #000;
          background: #fbbf24;
          border: 6px solid #000;
          box-shadow: 10px 10px 0 #000;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .premium-play-button:hover {
          transform: translate(-4px, -4px);
          box-shadow: 14px 14px 0 #000;
          background: #fff;
        }

        .premium-play-button:active {
          transform: translate(4px, 4px);
          box-shadow: 4px 4px 0 #000;
        }

        .glass-panel {
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          transition: border-color 0.3s ease;
        }

        .glass-panel:hover {
          border-color: rgba(251, 191, 36, 0.3);
        }

        @keyframes bg-pulse {
          from { transform: scale(1.1) rotate(0deg); }
          to { transform: scale(1.2) rotate(2deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -30px); }
        }

        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 20px); }
        }

        @keyframes float-slight {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: rotate(12deg) scale(1); }
          50% { transform: rotate(12deg) scale(1.1); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in-up { animation: fade-in-up 1s forwards cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; }
        .animate-fade-in-right { animation: fade-in-right 1s forwards cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
}

function ControlKey({ keyName, label }: { keyName: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[9px] font-black text-white/80 uppercase">
        {keyName}
      </div>
      <span className="text-white/20 text-[8px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'controls' | 'audio' | 'graphics'>('controls');

  const controls = [
    { key: 'ZQSD / WASD', action: 'Déplacement' },
    { key: 'Souris', action: 'Caméra' },
    { key: 'Espace', action: 'Saut / Boost' },
    { key: 'Shift', action: 'Accélération' },
    { key: 'R', action: 'Mode à pied' },
    { key: 'C', action: 'Caméra FPS/TPS' },
    { key: 'Clic Droit', action: 'Attaquer' },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0a0a1a] border border-white/10 shadow-2xl overflow-hidden animate-modal-in">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">Config. Système</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors rounded-full text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex p-2 gap-2 bg-black/40">
          <TabButtonPro active={activeTab === 'controls'} onClick={() => setActiveTab('controls')} icon={<Gamepad2 className="w-4 h-4" />} label="Contrôles" />
          <TabButtonPro active={activeTab === 'audio'} onClick={() => setActiveTab('audio')} icon={<Volume2 className="w-4 h-4" />} label="Audio" />
          <TabButtonPro active={activeTab === 'graphics'} onClick={() => setActiveTab('graphics')} icon={<Monitor className="w-4 h-4" />} label="Rendu" />
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {activeTab === 'controls' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {controls.map((ctrl, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{ctrl.action}</span>
                  <span className="px-3 py-1 bg-yellow-400 text-black font-black text-[10px] uppercase rounded italic">{ctrl.key}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'audio' && (
            <div className="space-y-8 py-4">
              <SliderSettingPro label="Master" defaultValue={80} color="#fbbf24" />
              <SliderSettingPro label="Musique" defaultValue={60} color="#fbbf24" />
              <SliderSettingPro label="VFX" defaultValue={100} color="#fbbf24" />
            </div>
          )}
          {activeTab === 'graphics' && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Qualité Globale</span>
                <select className="bg-black text-yellow-400 font-bold text-xs uppercase p-2 border border-yellow-400/30">
                  <option>Ultra (RTX)</option>
                  <option>Haute</option>
                  <option>Moyenne</option>
                </select>
              </div>
              <ToggleSettingPro label="Ombres Dynamiques" defaultChecked />
              <ToggleSettingPro label="Anti-Aliasing" defaultChecked />
              <ToggleSettingPro label="Post-Processing" defaultChecked />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButtonPro({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-3 p-3 transition-all duration-300 ${
        active ? 'bg-yellow-400 text-black' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function SliderSettingPro({ label, defaultValue, color }: any) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{label}</span>
        <span className="text-white font-black text-xs">{value}%</span>
      </div>
      <input 
        type="range" 
        value={value} 
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-1 bg-white/10 appearance-none cursor-pointer accent-yellow-400"
      />
    </div>
  );
}

function ToggleSettingPro({ label, defaultChecked }: any) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg cursor-pointer" onClick={() => setChecked(!checked)}>
      <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{label}</span>
      <div className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-yellow-400' : 'bg-white/10'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  );
}
