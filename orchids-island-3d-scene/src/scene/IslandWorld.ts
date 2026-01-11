import * as THREE from 'three';
import { Terrain } from './environment/Terrain';
import { Ocean } from './environment/Ocean';
import { Atmosphere } from './environment/Atmosphere';
import { Volcano } from './environment/Volcano';
import { Vegetation } from './environment/Vegetation';
import { PrehistoricAssets } from './environment/PrehistoricAssets';
import { BiomeFactory } from './biomes/BiomeFactory';
import { BIOMES_CONFIG as biomesConfig } from './biomes/biomes-config';
import { Player } from './entities/Player';
import { Dinosaur } from './entities/Dinosaur';
import { LeavesVFX } from './environment/LeavesVFX';

export class IslandWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  interactiveObjects: THREE.Object3D[];
  biomes: any[];
  isDisposed: boolean;

  atmosphere!: Atmosphere;
  ocean!: Ocean;
  terrain!: Terrain;
  vegetation!: Vegetation;
  prehistoric!: PrehistoricAssets;
  volcano!: Volcano;
  player!: Player;
  dinosaurs: Dinosaur[] = [];
  leavesVFX!: LeavesVFX;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.interactiveObjects = [];
    this.biomes = [];
    this.isDisposed = false;
  }

  async init() {
    try {
      if (this.isDisposed) return false;

      this.atmosphere = new Atmosphere(this.scene);
      this.ocean = new Ocean();
      this.scene.add(this.ocean.mesh);
      
      this.terrain = new Terrain();
      if (this.terrain.init) {
        await this.terrain.init();
      }
      
      if (this.isDisposed) return false;

      this.scene.add(this.terrain.mesh);
    
      this.vegetation = new Vegetation(this.scene, this.terrain);
      this.prehistoric = new PrehistoricAssets(this.scene, this.terrain);
      this.volcano = new Volcano(this.scene);
    this.leavesVFX = new LeavesVFX(this.scene);
    
    await new Promise(resolve => requestAnimationFrame(resolve));
      
      if (this.isDisposed) return false;

      const collisionData = [
        ...this.vegetation.getCollisionSpheres(),
        ...this.prehistoric.getCollisionSpheres()
      ];
    
      for (const config of biomesConfig) {
        if (this.isDisposed) break;

        const biome = BiomeFactory.create(this.scene, config);
        this.biomes.push(biome);
        
        const terrainHeight = this.terrain.getHeightAt(config.position.x, config.position.z);
        biome.group.position.y = terrainHeight; 
        
        biome.group.visible = true;
        biome.group.updateMatrixWorld(true);

        if (biome.marker) this.interactiveObjects.push(biome.marker);
        if (biome.templeGroup) {
          this.interactiveObjects.push(biome.templeGroup);
        }
      }
      
      this.scene.updateMatrixWorld(true);
      
      this.player = new Player(this.scene, this.camera, this.terrain, this.biomes);
      
      const spawnX = 0;
      const spawnZ = 500;
      const spawnY = this.terrain.getHeightAt(spawnX, spawnZ);
      this.player.group.position.set(spawnX, spawnY + 2, spawnZ); 
      this.player.group.rotation.y = Math.PI; // Look towards the island (negative Z)
      
      this.player.setCollidables(collisionData);
      
        // Spawn Dinosaurs - Improved logical dispatch
        const spawnDino = (type: DinoType, count: number, minRadius: number, maxRadius: number) => {
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = minRadius + Math.random() * (maxRadius - minRadius);
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist + 100; // Offset by volcano Z
            
            const dino = new Dinosaur(this.scene, this.terrain, {
              type,
              x,
              z,
              scale: type === 'BRACHIOSAURUS' ? 6 : (type === 'TREX' ? 5 : 3.5),
              allDinosaurs: this.dinosaurs
            });
            this.dinosaurs.push(dino);
          }
        };

        spawnDino('TREX', 3, 500, 1500);
        spawnDino('TRICERATOPS', 6, 400, 1200);
        spawnDino('BRACHIOSAURUS', 5, 600, 1800);
          spawnDino('STEGOSAURUS', 5, 400, 1400);
          spawnDino('RAPTOR', 10, 300, 1000);
        
        this.player.monsters = this.dinosaurs;
        
        return true;
    } catch (error) {
      console.error("CRITICAL ERROR during IslandWorld init:", error);
      return false; 
    }
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }

  highlightMarker(object: THREE.Object3D | null) {
    const isDescendant = (ancestor: THREE.Object3D, node: THREE.Object3D) => {
      let cur: THREE.Object3D | null = node;
      while (cur) {
        if (cur === ancestor) return true;
        cur = cur.parent;
      }
      return false;
    };

    this.interactiveObjects.forEach(obj => {
      const isHovered = object ? isDescendant(obj, object) : false;

      if (obj.userData.isTeleport) {
        obj.scale.setScalar(isHovered ? 1.2 : 1.0);
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
          obj.material.emissiveIntensity = isHovered ? 3 : 2;
        }
      }

      if (obj.userData.isNFT) {
        if (obj.userData.baseY == null || !Number.isFinite(obj.userData.baseY)) {
          obj.userData.baseY = obj.position.y;
        }
        obj.position.y = obj.userData.baseY + (isHovered ? 5 : 0);
        obj.scale.setScalar(isHovered ? 1.08 : 1.0);
      }
    });
  }

  update(time: number, delta: number, controls: any) {
    if (this.ocean) this.ocean.update(time);
    if (this.player) this.player.update(time, delta, controls);
    if (this.biomes) {
      this.biomes.forEach(biome => {
        if (biome.update) biome.update(time, this.camera);
      });
    }
    if (this.atmosphere) this.atmosphere.update(time);
    if (this.volcano) this.volcano.update(time, delta);
    if (this.vegetation) this.vegetation.update(time);
    if (this.leavesVFX) this.leavesVFX.update(time, delta);
    if (this.dinosaurs) {
      this.dinosaurs.forEach(dino => dino.update(time, delta, this.player?.group.position));
    }
  }

  dispose() {
    this.isDisposed = true;

    if (this.atmosphere) {
      this.scene.remove(this.atmosphere.group);
      this.atmosphere.dispose();
    }
    if (this.ocean) {
      this.scene.remove(this.ocean.mesh);
      this.ocean.dispose();
    }
    if (this.terrain && this.terrain.mesh) {
      this.scene.remove(this.terrain.mesh);
      this.terrain.mesh.geometry.dispose();
      (this.terrain.mesh.material as THREE.Material).dispose();
    }
    if (this.player) this.player.dispose();
    if (this.vegetation) this.vegetation.dispose();
    if (this.prehistoric) this.prehistoric.dispose();
    if (this.volcano) this.volcano.dispose();
    if (this.dinosaurs) {
      this.dinosaurs.forEach(dino => dino.dispose());
    }
    if (this.biomes) {
      this.biomes.forEach(biome => {
        if (biome.group) {
          biome.group.traverse((child: any) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((m: any) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
          this.scene.remove(biome.group);
        }
      });
      this.biomes = [];
    }

    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const child = this.scene.children[i];
      if (child.userData && child.userData.isBiomeGroup) {
         this.scene.remove(child);
         child.traverse((c: any) => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) {
                if (Array.isArray(c.material)) c.material.forEach((m: any) => m.dispose());
                else c.material.dispose();
            }
         });
      }
    }
  }
}
