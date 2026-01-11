import * as THREE from 'three';
import { RomanTerrain } from './environment/RomanTerrain';
import { Ocean } from './environment/Ocean';
import { Atmosphere } from './environment/Atmosphere';
import { RomanVegetation } from './environment/RomanVegetation';
import { RomanAssets } from './environment/RomanAssets';
import { BiomeFactory } from './biomes/BiomeFactory';
import { ROMAN_BIOMES_CONFIG } from './biomes/roman-biomes-config';
import { Player } from './entities/Player';
import { MythicalMonster, MonsterType } from './entities/MythicalMonster';

interface Biome {
  group: THREE.Group;
  marker?: THREE.Mesh | null;
  templeGroup?: THREE.Group | null;
  config: any;
  update?: ((time: number) => void) | null;
  dispose?: () => void;
}

export class RomanWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  interactiveObjects: THREE.Object3D[];
  biomes: Biome[];
  isDisposed: boolean;

  atmosphere!: Atmosphere;
  ocean!: Ocean;
  terrain!: RomanTerrain;
  vegetation!: RomanVegetation;
  romanAssets!: RomanAssets;
  player!: Player;
  monsters: MythicalMonster[] = [];

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
      
      this.terrain = new RomanTerrain();
      await this.terrain.init();
      this.scene.add(this.terrain.mesh);
    
      this.vegetation = new RomanVegetation(this.scene, this.terrain);
      this.romanAssets = new RomanAssets(this.scene, this.terrain);
      
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      if (this.isDisposed) return false;

      const collisionData = [
        ...this.vegetation.getCollisionSpheres(),
        ...this.romanAssets.getCollisionSpheres()
      ];
    
      for (const config of ROMAN_BIOMES_CONFIG) {
        if (this.isDisposed) break;
        const biome = BiomeFactory.create(this.scene, config as any) as Biome;
        this.biomes.push(biome);
        
        const terrainHeight = this.terrain.getHeightAt(config.position.x, config.position.z);
        biome.group.position.y = terrainHeight;
      }
      
      this.player = new Player(this.scene, this.camera, this.terrain as any, this.biomes);
      this.player.setCollidables(collisionData);

      const spawnX = 0;
      const spawnZ = 0;
      const spawnY = this.terrain.getHeightAt(spawnX, spawnZ);
      this.player.group.position.set(spawnX, spawnY + 10, spawnZ);
      
        // Spawn Mythical Monsters - Improved logical dispatch and scale
        const spawnMonster = (type: MonsterType, count: number, minRadius: number, maxRadius: number) => {
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = minRadius + Math.random() * (maxRadius - minRadius);
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;
            
            const monster = new MythicalMonster(this.scene, this.terrain, {
              type,
              x,
              z,
              scale: type === 'MINOTAUR' ? 1.8 : (type === 'GRIFFIN' ? 1.6 : 1.4),
              allMonsters: this.monsters
            });
            this.monsters.push(monster);
          }
        };

        spawnMonster('MINOTAUR', 4, 300, 1200);
        spawnMonster('CENTAUR', 6, 400, 1400);
          spawnMonster('LION', 8, 200, 1000);
          spawnMonster('GRIFFIN', 5, 500, 1600);
        
        this.player.monsters = this.monsters;
        
        return true;
    } catch (error) {
      console.error("CRITICAL ERROR during RomanWorld init:", error);
      return false;
    }
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }

  highlightMarker(object: THREE.Object3D | null) {
    this.interactiveObjects.forEach(obj => {
      const isHovered = obj === object || (object && object.parent === obj);
      if (obj.userData.isTeleport) {
        obj.scale.setScalar(isHovered ? 1.2 : 1.0);
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
          obj.material.emissiveIntensity = isHovered ? 3 : 2;
        }
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
    if (this.vegetation) this.vegetation.update(time);
    if (this.monsters) {
      this.monsters.forEach(monster => monster.update(time, delta, this.player?.group.position));
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
    if (this.romanAssets) this.romanAssets.dispose();
    if (this.monsters) {
      this.monsters.forEach(monster => monster.dispose());
      this.monsters = [];
    }
    
    if (this.biomes) {
      this.biomes.forEach(biome => {
        if (biome.group) {
          biome.group.traverse((child: any) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) child.material.forEach((m: any) => m.dispose());
              else child.material.dispose();
            }
          });
          this.scene.remove(biome.group);
        }
      });
      this.biomes = [];
    }
  }
}
