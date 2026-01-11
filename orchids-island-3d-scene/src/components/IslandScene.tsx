'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { WorldManager } from '../scene/WorldManager';
import { Volume2, VolumeX } from 'lucide-react';
import { Inventory, HotbarSlots } from './Inventory';

export function IslandScene() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [activeWeaponSlot, setActiveWeaponSlot] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  
  const managerRef = useRef<WorldManager | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const handleWeaponChange = useCallback((slot: number) => {
    setActiveWeaponSlot(slot);
    const world = managerRef.current?.world;
    if (world?.player) {
      world.player.switchWeapon(slot + 1);
    }
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    // SceneSetup is managed by WorldManager, but we can't easily access it 
    // without making it public or adding a method. Let's add a method to WorldManager.
    (managerRef.current as any)?.sceneSetup?.toggleAudio(newMuted);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'v') {
        event.preventDefault();
        setIsInventoryOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !indicatorRef.current) return;

    const init = async () => {
      const sceneSetup = new SceneSetup(canvasRef.current!, indicatorRef.current!);
      const manager = new WorldManager(sceneSetup as any);
      managerRef.current = manager;

      await manager.init();
      setLoading(false);
      
      startAnimation();
      setupEventListeners();
    };

    const startAnimation = () => {
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        
        const updateResult = managerRef.current?.update();
        
        if (updateResult && crosshairRef.current) {
          crosshairRef.current.style.opacity = updateResult.isFirstPerson ? '1' : '0';
        }
      };
      animate();
    };

    const setupEventListeners = () => {
      window.addEventListener('click', onClick);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('resize', onResize);
    };

    const onResize = () => {
      (managerRef.current as any)?.sceneSetup?.onResize();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'a') {
        if (managerRef.current && !managerRef.current.switching) {
          handleSwitchWorld();
        }
      }
    };

    const handleSwitchWorld = async () => {
      setLoading(true);
      await managerRef.current?.switchWorld();
      setLoading(false);
    };

    const onClick = (event: MouseEvent) => {
      const manager = managerRef.current;
      if (!manager || !manager.world) return;

      const sceneSetup = (manager as any).sceneSetup;
      const isFPS = (manager.world.player as any)?.isFirstPerson;

      if (isFPS && !document.pointerLockElement) {
        canvasRef.current?.requestPointerLock();
        return;
      }

      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycasterRef.current.setFromCamera(mouseRef.current, sceneSetup.camera);
      const intersects = raycasterRef.current.intersectObjects(manager.world.getInteractiveObjects(), true);
      
      if (intersects.length > 0) {
        let object: THREE.Object3D | null = intersects[0].object;
        while (object && !object.userData.isTeleport && !object.userData.isNFT) {
          object = object.parent;
        }

        if (object) {
          if (object.userData.isTeleport) {
            sceneSetup.teleportTo(object.userData.targetPos, object.userData.biomeName);
          } else if (object.userData.isNFT) {
            window.open(object.userData.url, '_blank');
          }
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const manager = managerRef.current;
      if (!manager || !manager.world) return;

      const sceneSetup = (manager as any).sceneSetup;
      
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycasterRef.current.setFromCamera(mouseRef.current, sceneSetup.camera);
      const intersects = raycasterRef.current.intersectObjects(manager.world.getInteractiveObjects(), true);
      
      document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
      manager.world.highlightMarker(intersects.length > 0 ? intersects[0].object : null);
    };

    init();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      managerRef.current?.dispose();
      window.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-1000">
          <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4" />
          <h2 className="text-white font-light tracking-[0.3em] uppercase text-sm">Génération de l&apos;île...</h2>
        </div>
      )}
      
      <canvas ref={canvasRef} className={`block w-full h-full outline-none transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`} id="canvas" />
      
      <button
        onClick={toggleMute}
        className="fixed top-8 right-8 p-4 bg-black/60 backdrop-blur-sm border-2 border-white/30 rounded-full text-white hover:bg-black/80 transition-all z-50 group"
        title={isMuted ? "Activer le son" : "Couper le son"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white/70 group-hover:text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        )}
      </button>

      <div 
        ref={indicatorRef}
        id="biome-indicator"
        className="fixed top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium tracking-widest uppercase opacity-0 pointer-events-none transition-all duration-500 z-50 [&.visible]:opacity-100 [&.visible]:top-12"
      >
        Biome
      </div>

      <div 
        ref={crosshairRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-50 transition-opacity duration-200 opacity-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_rgba(0,0,0,0.5)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px] bg-white/50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-8 bg-white/50"></div>
      </div>

      <HotbarSlots activeSlot={activeWeaponSlot} onSlotChange={handleWeaponChange} />
      
      <Inventory 
        isOpen={isInventoryOpen} 
        onClose={() => setIsInventoryOpen(false)} 
        activeSlot={activeWeaponSlot}
        onSlotChange={handleWeaponChange}
      />
    </div>
  );
}
