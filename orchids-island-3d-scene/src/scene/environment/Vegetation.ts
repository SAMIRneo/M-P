import * as THREE from 'three';
import { Terrain } from './Terrain';

export class Vegetation {
  public group: THREE.Group;
  private instances: { [key: string]: THREE.InstancedMesh | null } = {};
  private outlines: { [key: string]: THREE.InstancedMesh | null } = {};
  private collisionSpheres: { x: number; z: number; radius: number }[] = [];

  constructor(private scene: THREE.Scene, private terrain: Terrain) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.createVegetation();
  }

  public getCollisionSpheres() {
    return this.collisionSpheres;
  }

  private createVegetation() {
    this.createPalms();
    this.createBushes();
    this.createTropicalPlants();
  }

  private createPalms() {
    const count = 40;
    const trunkHeight = 280;
    const trunkRadiusTop = 18;
    const trunkRadiusBottom = 36;
    
    // Trunk Geometry - Much taller
    const trunkGeo = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 6);
    const trunkMat = new THREE.MeshToonMaterial({ color: 0x795548 });
    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, count);
    
    // Leaves Geometry - Bigger leaves
    const leafGeo = new THREE.BoxGeometry(120, 8, 35);
    const leafMat = new THREE.MeshToonMaterial({ color: 0x4caf50 });
    const leavesPerTree = 7;
    const leavesMesh = new THREE.InstancedMesh(leafGeo, leafMat, count * leavesPerTree);

    const dummy = new THREE.Object3D();
    const leafDummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1800;
      const z = (Math.random() - 0.5) * 1800;
      const y = this.terrain.getHeightAt(x, z);

      if (y < 5 || y > 150) {
        i--;
        continue;
      }

      dummy.position.set(x, y + trunkHeight / 2, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.x = (Math.random() - 0.5) * 0.15;
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(i, dummy.matrix);

      // Leaves at the top
      for (let j = 0; j < leavesPerTree; j++) {
        leafDummy.position.set(x, y + trunkHeight, z);
        leafDummy.rotation.y = (j / leavesPerTree) * Math.PI * 2 + Math.random();
        leafDummy.rotation.z = 0.5;
        leafDummy.updateMatrix();
        leavesMesh.setMatrixAt(i * leavesPerTree + j, leafDummy.matrix);
      }

      this.collisionSpheres.push({ x, z, radius: 30 });
    }

    this.group.add(trunkMesh);
    this.group.add(leavesMesh);
    this.instances['palms_trunk'] = trunkMesh;
    this.instances['palms_leaves'] = leavesMesh;
  }

  private createBushes() {
    const count = 100;
    const bushGeo = new THREE.IcosahedronGeometry(25, 0);
    const bushMat = new THREE.MeshToonMaterial({ color: 0x2e7d32 });
    const bushMesh = new THREE.InstancedMesh(bushGeo, bushMat, count);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1900;
      const z = (Math.random() - 0.5) * 1900;
      const y = this.terrain.getHeightAt(x, z);

      if (y < 2 || y > 120) {
        i--;
        continue;
      }

      dummy.position.set(x, y + 10, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.setScalar(0.8 + Math.random() * 0.6);
      dummy.updateMatrix();
      bushMesh.setMatrixAt(i, dummy.matrix);
      
      this.collisionSpheres.push({ x, z, radius: 20 });
    }

    this.group.add(bushMesh);
    this.instances['bushes'] = bushMesh;
  }

  private createTropicalPlants() {
    const count = 60;
    const plantGeo = new THREE.ConeGeometry(15, 50, 4);
    const plantMat = new THREE.MeshToonMaterial({ color: 0xec407a }); // Pinkish for tropical vibe
    const plantMesh = new THREE.InstancedMesh(plantGeo, plantMat, count);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1800;
      const z = (Math.random() - 0.5) * 1800;
      const y = this.terrain.getHeightAt(x, z);

      if (y < 10 || y > 140) {
        i--;
        continue;
      }

      dummy.position.set(x, y + 20, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.z = (Math.random() - 0.5) * 0.4;
      dummy.updateMatrix();
      plantMesh.setMatrixAt(i, dummy.matrix);
      
      this.collisionSpheres.push({ x, z, radius: 12 });
    }

    this.group.add(plantMesh);
    this.instances['tropical_plants'] = plantMesh;
  }

  public update(time: number) {
    // Subtle wind animation for leaves
    if (this.instances['palms_leaves']) {
      // In a real scenario we might want to update matrices here, 
      // but for performance we can keep them static or use a shader.
    }
  }

  public dispose() {
    Object.values(this.instances).forEach(instance => {
      if (instance) {
        instance.geometry.dispose();
        if (Array.isArray(instance.material)) instance.material.forEach(m => m.dispose());
        else instance.material.dispose();
      }
    });
    this.scene.remove(this.group);
  }
}
