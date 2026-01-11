import * as THREE from 'three';
import { BiomeConfig } from './biomes-config';

export const ROMAN_BIOMES_CONFIG: BiomeConfig[] = [
    {
      name: 'TEMPLE DE JUPITER', 
      position: new THREE.Vector3(0, 140, -1200),
      color: 0xffd700,
      radius: 70,
      height: 15,
      type: 'roman_jupiter',
      url: '/temple-jupiter',
      lightIntensity: 2.5
    },
    {
      name: 'TEMPLE DE MARS',
      position: new THREE.Vector3(1200, 140, 0),
      color: 0xff3333,
      radius: 60,
      height: 15,
      type: 'roman_mars',
      url: '/temple-mars',
      lightIntensity: 2.0
    },
    {
      name: 'TEMPLE DE VENUS', 
      position: new THREE.Vector3(-1200, 140, 0),
      color: 0xff69b4,
      radius: 60,
      height: 15,
      type: 'roman_venus',
      url: '/temple-venus',
      lightIntensity: 2.2
    },
    {
      name: 'TEMPLE DE SATURNE', 
      position: new THREE.Vector3(0, 140, 1200),
      color: 0x444444,
      radius: 70,
      height: 15,
      type: 'roman_saturn',
      url: '/temple-saturn',
      lightIntensity: 2.0
    }
];
