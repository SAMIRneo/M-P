import * as THREE from 'three';

export interface BiomeConfig {
    name: string;
    position: THREE.Vector3;
    color: number;
    radius: number;
    height: number;
    type: string;
    url?: string;
    targetPos?: THREE.Vector3;
    lightIntensity?: number;
}

export const BIOMES_CONFIG: BiomeConfig[] = [
    {
      name: 'PYRAMIDE SOLAIRE',
      position: new THREE.Vector3(-1200, 180, -1000),
      color: 0xffd700,
      radius: 70,
      height: 10,
      type: 'pyramid_solar',
      url: 'http://localhost:5174',
      lightIntensity: 2.5
    },
    {
      name: 'PYRAMIDE LUNAIRE',
      position: new THREE.Vector3(1200, 180, -1000),
      color: 0xc0c0ff,
      radius: 70,
      height: 10,
      type: 'pyramid_lunar',
      url: 'https://example.com/pyramid-lunar',
      lightIntensity: 2.0
    },
    {
      name: 'PYRAMIDE OBSCURE',
      position: new THREE.Vector3(-1000, 180, 1100),
      color: 0x8b00ff,
      radius: 65,
      height: 9,
      type: 'pyramid_void',
      url: 'http://localhost:3001',
      lightIntensity: 2.2
    },
    {
      name: 'PYRAMIDE CELESTIALE',
      position: new THREE.Vector3(1100, 180, 1100),
      color: 0x00ffff,
      radius: 75,
      height: 11,
      type: 'pyramid_celestial',
      url: 'http://localhost:5173',
      lightIntensity: 2.8
    }
];
