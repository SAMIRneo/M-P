import * as THREE from 'three';
import { BIOMES_CONFIG as biomesConfig } from '../biomes/biomes-config.js';

export class Paths {
  constructor(scene, biomes) {
    this.scene = scene;
    this.biomes = biomes;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.createPaths();
  }

  createPaths() {
    if (!this.biomes || this.biomes.length === 0) return;
    
    const centerBiome = this.biomes.find(b => b.config.type === 'crypto');
    if (!centerBiome) return;

    const centerPos = centerBiome.group.position.clone();
    centerPos.y += 2; // Connect at the top of the platform

    this.biomes.forEach(biome => {
      if (biome.config.type === 'crypto') return;

      const targetPos = biome.group.position.clone();
      targetPos.y += 2; // Connect at the top of the platform

      const dist = centerPos.distanceTo(targetPos);
      const midPoint = new THREE.Vector3().lerpVectors(centerPos, targetPos, 0.5);
      midPoint.y += dist * 0.15 + 10; // Arc height depends on distance

      const curve = new THREE.QuadraticBezierCurve3(centerPos, midPoint, targetPos);
      
      const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.8, 8, false);
      const tubeMaterial = new THREE.MeshStandardMaterial({
        color: biome.config.color,
        emissive: biome.config.color,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6
      });

      const pathMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
      this.group.add(pathMesh);

      const pulseGeometry = new THREE.SphereGeometry(2.5, 16, 16);
      const pulseMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.9
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.userData = {
        curve: curve,
        progress: Math.random()
      };
      this.group.add(pulse);
    });
  }

  update(time) {
    this.group.children.forEach(child => {
      if (child.userData.curve) {
        child.userData.progress += 0.005;
        if (child.userData.progress > 1) child.userData.progress = 0;
        
        const pos = child.userData.curve.getPointAt(child.userData.progress);
        child.position.copy(pos);
        
        const s = 1 + Math.sin(time * 5) * 0.2;
        child.scale.set(s, s, s);
      }
    });
  }

  dispose() {
    this.group.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    this.scene.remove(this.group);
  }
}
