'use client';

import { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  count?: number;
}

interface InventoryProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlot: number;
  onSlotChange: (slot: number) => void;
}

const RARITY_COLORS = {
  common: { bg: 'from-gray-600 to-gray-700', border: 'border-gray-400', glow: '' },
  rare: { bg: 'from-blue-600 to-blue-700', border: 'border-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' },
  epic: { bg: 'from-purple-600 to-purple-700', border: 'border-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' },
  legendary: { bg: 'from-yellow-500 to-orange-500', border: 'border-yellow-400', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.6)]' },
};

function SwordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
      <path d="M14.5 3L21 9.5L9 21.5L2.5 15L14.5 3Z" fill="#E2E8F0" stroke="black" strokeWidth="2.5"/>
      <path d="M5 14L8 17" stroke="black" strokeWidth="2.5"/>
      <path d="M11 8L14 11" stroke="black" strokeWidth="2.5"/>
      <path d="M17 5L20 8" stroke="black" strokeWidth="2.5"/>
      <path d="M3 21L7 17" stroke="#64748B" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="3" cy="21" r="2" fill="#FACC15" stroke="black" strokeWidth="2"/>
    </svg>
  );
}

function AK47Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
      <path d="M18 14L22 14L22 10L18 8L18 14Z" fill="#8B4513" stroke="black" strokeWidth="1.5"/>
      <path d="M6 14L18 14L18 10L6 10L6 14Z" fill="#1a1a1a" stroke="black" strokeWidth="1.5"/>
      <path d="M10 14L8 18L11 18L12 14" fill="#FFD700" stroke="black" strokeWidth="1.5"/>
      <path d="M2 11L6 11L6 12L2 12L2 11Z" fill="#FFD700" stroke="black" strokeWidth="1.5"/>
      <rect x="12" y="10.5" width="2" height="1" fill="#00FFFF" />
      <rect x="19" y="10" width="1.5" height="1.5" fill="#00FFFF" />
    </svg>
  );
}

const DEFAULT_ITEMS: (InventoryItem | null)[] = [
  { id: '1', name: 'Épée Légendaire', icon: <SwordIcon />, rarity: 'legendary' },
  { id: '2', name: 'AK47 SPATIAL VVS', icon: <AK47Icon />, rarity: 'epic' },
  null,
  null,
  null,
  null,
];

export function Inventory({ isOpen, onClose, activeSlot, onSlotChange }: InventoryProps) {
  const [items] = useState<(InventoryItem | null)[]>(DEFAULT_ITEMS);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 border-[6px] border-black shadow-[16px_16px_0px_#000] max-w-2xl w-full transform transition-all duration-300 ease-out ${isAnimating ? 'scale-100 opacity-100 rotate-0' : 'scale-90 opacity-0 -rotate-3'}`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 0)', backgroundSize: '8px 8px' }} />
        
        <div className="relative z-10 flex items-center justify-between p-8 border-b-[6px] border-black bg-gradient-to-r from-yellow-400 to-orange-400">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-white border-[4px] border-black rotate-12 shadow-[6px_6px_0px_#000]">
              <Package className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-black italic drop-shadow-[4px_4px_0px_#fff]">
              Inventaire
            </h2>
          </div>
          <button
            onClick={onClose}
            className="group relative p-2 bg-red-500 border-[4px] border-black shadow-[6px_6px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0px_#000] transition-all"
          >
            <X className="w-10 h-10 text-white stroke-[5px] group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="relative z-10 p-10 bg-white/5">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-8">
            {items.map((item, index) => (
              <InventorySlot
                key={index}
                item={item}
                index={index}
                isSelected={selectedSlot === index}
                isActive={activeSlot === index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSlot(index);
                  if (item) onSlotChange(index);
                }}
              />
            ))}
          </div>

          {selectedSlot !== null && items[selectedSlot] && (
            <div className="mt-10 p-8 bg-black border-[6px] border-white shadow-[12px_12px_0px_#000] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rotate-45 translate-x-24 -translate-y-24 pointer-events-none" />
              <div className="flex items-center gap-8 relative z-10">
                <div className={`p-6 bg-gradient-to-br ${RARITY_COLORS[items[selectedSlot]!.rarity].bg} border-[4px] border-white shadow-[6px_6px_0px_rgba(255,255,255,0.2)] rotate-3`}>
                  <div className="scale-[2.0]">{items[selectedSlot]!.icon}</div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
                    {items[selectedSlot]!.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 text-sm font-black uppercase tracking-widest border-3 ${
                      items[selectedSlot]!.rarity === 'legendary' ? 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_#fff]' :
                      items[selectedSlot]!.rarity === 'epic' ? 'bg-purple-600 text-white border-white' :
                      items[selectedSlot]!.rarity === 'rare' ? 'bg-blue-600 text-white border-white' : 'bg-gray-600 text-white border-white'
                    }`}>
                      {items[selectedSlot]!.rarity}
                    </span>
                    {activeSlot === selectedSlot && (
                      <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase border-2 border-black">Équipé</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 p-6 border-t-[6px] border-black bg-black flex justify-center items-center gap-4">
          <div className="h-[2px] flex-1 bg-yellow-400/30" />
          <span className="text-yellow-400 text-sm font-black uppercase tracking-[0.3em] animate-pulse">
            V - FERMER
          </span>
          <div className="h-[2px] flex-1 bg-yellow-400/30" />
        </div>
      </div>
    </div>
  );
}

function InventorySlot({ 
  item, 
  index, 
  isSelected, 
  isActive,
  onClick 
}: { 
  item: InventoryItem | null; 
  index: number; 
  isSelected: boolean;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const rarityStyle = item ? RARITY_COLORS[item.rarity] : null;

  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-square flex items-center justify-center
        transition-all duration-300 cursor-pointer group pointer-events-auto
        ${item ? `bg-gradient-to-br ${rarityStyle?.bg} ${rarityStyle?.glow}` : 'bg-black/60'}
        ${isSelected ? 'ring-[6px] ring-yellow-400 scale-110 z-20 shadow-[0_0_30px_rgba(250,204,21,0.7)] rotate-3' : 'hover:scale-105 hover:-rotate-2'}
        ${isActive ? 'border-white' : 'border-black'}
        border-[4px] shadow-[6px_6px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0px_#000]
      `}
    >
      {item ? (
        <div className="transform transition-transform group-hover:scale-110 group-hover:rotate-6">
          {item.icon}
        </div>
      ) : (
        <div className="w-10 h-10 border-4 border-dashed border-white/10 opacity-20" />
      )}
      
      <span className="absolute -top-3 -left-3 bg-black text-white text-xs font-black px-2 py-1 border-[3px] border-white shadow-[4px_4px_0px_#000] transform -rotate-12 group-hover:rotate-0 transition-transform">
        {index + 1}
      </span>
      {isActive && item && (
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-black rounded-full" />
      )}
    </button>
  );
}

interface HotbarProps {
  activeSlot: number;
  onSlotChange: (slot: number) => void;
}

export function HotbarSlots({ activeSlot, onSlotChange }: HotbarProps) {
  const [items] = useState<(InventoryItem | null)[]>(DEFAULT_ITEMS);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6) {
        onSlotChange(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSlotChange]);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4 pointer-events-none">
      <div className="px-6 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-[0.2em] border-[3px] border-black mb-[-12px] z-10 shadow-[6px_6px_0px_#000] -rotate-2 pointer-events-auto">
        Sac à Dos
      </div>
      <div className="flex gap-3 p-4 bg-[#1a1a1a] border-[6px] border-black shadow-[10px_10px_0px_#000] relative overflow-hidden pointer-events-auto">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '10px 10px' }} />
        
        {items.slice(0, 6).map((item, index) => (
          <HotbarSlot
            key={index}
            item={item}
            index={index}
            isActive={activeSlot === index}
            onClick={(e) => {
              e.stopPropagation();
              onSlotChange(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HotbarSlot({
  item,
  index,
  isActive,
  onClick
}: {
  item: InventoryItem | null;
  index: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const rarityStyle = item ? RARITY_COLORS[item.rarity] : null;

  return (
    <button
      onClick={onClick}
      className={`
        relative w-14 h-14 flex items-center justify-center
        transition-all duration-300 group pointer-events-auto
        ${item ? `bg-gradient-to-br ${rarityStyle?.bg}` : 'bg-black/80'}
        ${isActive ? 'scale-125 z-20 border-yellow-400 ring-[4px] ring-black shadow-[0_0_25px_rgba(250,204,21,0.8)] -translate-y-3 rotate-3' : 'hover:scale-110 border-white/20 hover:-translate-y-1'}
        border-[4px] border-black shadow-[5px_5px_0px_#000]
      `}
    >
      {item ? (
        <div className="scale-90 transform transition-transform group-hover:scale-110 group-hover:rotate-6">{item.icon}</div>
      ) : (
        <div className="w-6 h-6 border-2 border-dashed border-white/10 opacity-30" />
      )}
      
      <span className={`absolute -bottom-2 -right-2 w-6 h-6 flex items-center justify-center text-xs font-black border-[2px] border-black shadow-[2px_2px_0px_#000] transition-colors ${isActive ? 'bg-yellow-400 text-black' : 'bg-white text-black'}`}>
        {index + 1}
      </span>
    </button>
  );
}
