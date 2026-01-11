import * as THREE from 'three';
import { ComicTerrain } from './environment/ComicTerrain';
import { Ocean } from './environment/Ocean';
import { Atmosphere } from './environment/Atmosphere';
import { Player } from './entities/Player';

export class ComicWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  interactiveObjects: THREE.Object3D[];
  isDisposed: boolean;

  atmosphere!: Atmosphere;
  ocean!: Ocean;
  terrain!: ComicTerrain;
  player!: Player;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.interactiveObjects = [];
    this.isDisposed = false;
  }

  async init() {
    try {
      if (this.isDisposed) return false;

      // Atmosphere for comic vibes
      this.atmosphere = new Atmosphere(this.scene);
      
      // Ocean
      this.ocean = new Ocean();
      this.scene.add(this.ocean.mesh);
      
      // The new optimized Comic Terrain
      this.terrain = new ComicTerrain();
      await this.terrain.init();
      
      if (this.isDisposed) return false;
      this.scene.add(this.terrain.mesh);
      
      // Player for navigation and physics
      // Note: We pass an empty array for biomes as requested (no life/veg yet)
      this.player = new Player(this.scene, this.camera, this.terrain as any, []);
      
      // Spawn at a reasonable spot
      const spawnX = 0;
      const spawnZ = 200;
      const spawnY = this.terrain.getHeightAt(spawnX, spawnZ);
      this.player.group.position.set(spawnX, spawnY + 20, spawnZ);
      
      return true;
    } catch (error) {
      console.error("CRITICAL ERROR during ComicWorld init:", error);
      return false;
    }
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }

  highlightMarker(object: THREE.Object3D | null) {
    // No markers yet in this world
  }

  update(time: number, delta: number, controls: any) {
    if (this.ocean) this.ocean.update(time);
    if (this.player) this.player.update(time, delta, controls);
    if (this.atmosphere) this.atmosphere.update(time);
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
  }
}
