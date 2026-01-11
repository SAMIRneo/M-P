import * as THREE from 'three';

export const BIOMES_CONFIG = [
    {
      name: 'PYRAMIDE SOLAIRE', // CHARTS (Finance)
      position: new THREE.Vector3(-1000, 160, -800),
      color: 0xffd700,
      radius: 70,
      height: 10,
      type: 'pyramid_solar',
      url: 'http://localhost:5174', // Port Charts
      lightIntensity: 2.5
    },
    {
      name: 'PYRAMIDE LUNAIRE',
      position: new THREE.Vector3(1000, 160, -800),
      color: 0xc0c0ff,
      radius: 70,
      height: 10,
      type: 'pyramid_lunar',
      url: 'https://example.com/pyramid-lunar',
      lightIntensity: 2.0
    },
    {
      name: 'PYRAMIDE OBSCURE', // GNOSIS (Savoir)
      position: new THREE.Vector3(-800, 160, 900),
      color: 0x8b00ff,
      radius: 65,
      height: 9,
      type: 'pyramid_void',
      url: 'http://localhost:3001', // Port Gnosis
      lightIntensity: 2.2
    },
    {
      name: 'PYRAMIDE CELESTIALE', // GLOBErts (Monde)
      position: new THREE.Vector3(900, 160, 900),
      color: 0x00ffff,
      radius: 75,
      height: 11,
      type: 'pyramid_celestial',
      url: 'http://localhost:5173', // Port GLOBErts
      lightIntensity: 2.8
    }
];
