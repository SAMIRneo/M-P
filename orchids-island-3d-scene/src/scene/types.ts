import * as THREE from 'three';

export interface IWorld {
  init(): Promise<boolean | void>;
  update(time: number, delta: number, controls: any): void;
  dispose(): void;
  getInteractiveObjects(): THREE.Object3D[];
  highlightMarker(object: THREE.Object3D | null): void;
  player?: any;
}

export interface ISceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: any;
  toggleAudio(isMuted: boolean): void;
  clearContent(): void;
  teleportTo(targetPos: THREE.Vector3, biomeName: string): void;
  onResize(): void;
  update(delta: number): void;
  dispose(): void;
}

export type WorldType = 'island' | 'roman' | 'comic';
