import * as THREE from 'three';
import { IWorld, ISceneSetup, WorldType } from './types';
import { IslandWorld } from './IslandWorld';
import { RomanWorld } from './RomanWorld';
import { ComicWorld } from './ComicWorld';
import { SceneSetup } from './SceneSetup';

export class WorldManager {
  private sceneSetup: ISceneSetup;
  private currentWorld: IWorld | null = null;
  private currentType: WorldType = 'island';
  private isSwitching: boolean = false;
  private clock: THREE.Clock;

  constructor(sceneSetup: ISceneSetup) {
    this.sceneSetup = sceneSetup;
    this.clock = new THREE.Clock();
  }

  get world() {
    return this.currentWorld;
  }

  get worldType() {
    return this.currentType;
  }

  get switching() {
    return this.isSwitching;
  }

  async init() {
    await this.loadWorld('island');
  }

  async switchWorld() {
    if (this.isSwitching) return;
    
    const nextType: WorldType = 
      this.currentType === 'island' ? 'roman' :
      this.currentType === 'roman' ? 'comic' : 'island';
    
    await this.loadWorld(nextType);
  }

  private async loadWorld(type: WorldType) {
    this.isSwitching = true;
    
    // 1. Dispose current world
    if (this.currentWorld) {
      try {
        this.currentWorld.dispose();
      } catch (e) {
        console.error("Error disposing world:", e);
      }
      this.currentWorld = null;
    }

    // 2. Clear scene content
    this.sceneSetup.clearContent();

    // 3. Small delay to ensure disposal
    await new Promise(resolve => setTimeout(resolve, 100));

    // 4. Create new world
    this.currentType = type;
    switch (type) {
      case 'island':
        this.currentWorld = new IslandWorld(this.sceneSetup.scene, this.sceneSetup.camera) as unknown as IWorld;
        break;
      case 'roman':
        this.currentWorld = new RomanWorld(this.sceneSetup.scene, this.sceneSetup.camera) as unknown as IWorld;
        break;
      case 'comic':
        this.currentWorld = new ComicWorld(this.sceneSetup.scene, this.sceneSetup.camera) as unknown as IWorld;
        break;
    }

    // 5. Initialize
    if (this.currentWorld) {
      const success = await this.currentWorld.init();
      if (!success && success !== undefined) {
        console.warn(`World ${type} failed to initialize properly`);
      }

      // 6. Reset camera & controls
      this.syncCamera();
      
      // 7. Reset clock to avoid delta spikes
      this.clock = new THREE.Clock();
    }

    this.isSwitching = false;
  }

  private syncCamera() {
    if (this.currentWorld?.player?.group) {
      const player = this.currentWorld.player as any;
      const playerPos = player.group.position.clone();
      
      if (isNaN(playerPos.x) || isNaN(playerPos.y) || isNaN(playerPos.z)) {
        playerPos.set(0, 60, 0);
        player.group.position.copy(playerPos);
      }
      
      this.sceneSetup.controls.reset();
      
      // If player has a custom camera update method, use it for the initial placement
      if (player.updateCamera) {
        player.updateCamera(this.sceneSetup.controls, 0.016);
      } else {
        const offset = new THREE.Vector3(0, 15, -50);
        this.sceneSetup.controls.target.copy(playerPos);
        this.sceneSetup.camera.position.copy(playerPos.clone().add(offset));
      }
      
      this.sceneSetup.controls.update();
    }
  }

  update() {
    if (this.isSwitching || !this.currentWorld) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    this.currentWorld.update(time, delta, this.sceneSetup.controls);
    this.sceneSetup.update(delta);
    
    return {
      delta,
      time,
      isFirstPerson: (this.currentWorld.player as any)?.isFirstPerson || false
    };
  }

  dispose() {
    if (this.currentWorld) {
      this.currentWorld.dispose();
    }
    this.sceneSetup.dispose();
  }
}
