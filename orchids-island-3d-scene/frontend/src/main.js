import * as THREE from 'three';
import { SceneSetup } from './scene/SceneSetup.js';
import { IslandWorld } from './scene/IslandWorld.js';

class App {
  constructor() {
    this.clock = new THREE.Clock();
    this.init();
  }

  async init() {
    this.sceneSetup = new SceneSetup();
    this.world = new IslandWorld(this.sceneSetup.scene, this.sceneSetup.camera);
    
    this.setupInteraction();
    this.animate();
    
    window.addEventListener('resize', () => this.onResize());
  }

  setupInteraction() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    window.addEventListener('click', (e) => this.onClick(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.sceneSetup.camera);
    const interactiveObjects = this.world.getInteractiveObjects();
    const intersects = this.raycaster.intersectObjects(interactiveObjects, true);
    
    if (intersects.length > 0) {
      let object = intersects[0].object;
      while (object && !object.userData.isTeleport && !object.userData.isNFT) {
        object = object.parent;
      }

      if (object) {
        if (object.userData.isTeleport) {
          this.sceneSetup.teleportTo(object.userData.targetPos, object.userData.biomeName);
        } else if (object.userData.isNFT) {
          window.open(object.userData.url, '_blank');
        }
      }
    }
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.sceneSetup.camera);
    const interactiveObjects = this.world.getInteractiveObjects();
    const intersects = this.raycaster.intersectObjects(interactiveObjects, true);
    
    document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    
    this.world.highlightMarker(intersects.length > 0 ? intersects[0].object : null);
  }

  onResize() {
    this.sceneSetup.onResize();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();
    
    this.world.update(time, delta, this.sceneSetup.controls);
    this.sceneSetup.update(delta);
  }
}

new App();
