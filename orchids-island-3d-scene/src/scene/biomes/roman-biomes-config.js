import * as THREE from 'three';

export const ROMAN_BIOMES_CONFIG = [
    {
      name: 'TEMPLE DE JUPITER', 
      position: new THREE.Vector3(0, 140, -1200), // North
      color: 0xffd700, // Gold
      radius: 70,
      height: 15,
      type: 'roman_jupiter',
      url: '/temple-jupiter',
      lightIntensity: 2.5
    },
    {
      name: 'TEMPLE DE MARS',
      position: new THREE.Vector3(1200, 140, 0), // East
      color: 0xff3333, // Red
      radius: 60,
      height: 15,
      type: 'roman_mars',
      url: '/temple-mars',
      lightIntensity: 2.0
    },
    {
      name: 'TEMPLE DE VENUS', 
      position: new THREE.Vector3(-1200, 140, 0), // West
      color: 0xff69b4, // Pink
      radius: 60,
      height: 15,
      type: 'roman_venus',
      url: '/temple-venus',
      lightIntensity: 2.2
    },
    {
      name: 'TEMPLE DE SATURNE', 
      position: new THREE.Vector3(0, 140, 1200), // South
      color: 0x444444, // Dark Grey
      radius: 70,
      height: 15,
      type: 'roman_saturn',
      url: '/temple-saturn',
      lightIntensity: 2.0
    }
];
