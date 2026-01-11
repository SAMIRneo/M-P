import * as THREE from 'three';
import { RomanTerrain } from './RomanTerrain';

export class RomanVegetation {
  public group: THREE.Group;
  private instances: { [key: string]: THREE.InstancedMesh | null } = {};
  private collisionSpheres: { x: number; z: number; radius: number }[] = [];

  constructor(private scene: THREE.Scene, private terrain: RomanTerrain) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.createVegetation();
  }

  public getCollisionSpheres() {
    return this.collisionSpheres;
  }

  private createVegetation() {
    this.createCypresses();
    this.createOliveTrees();
    this.createLavender();
  }

  private createCypresses() {
    const count = 50;
    const cypressGeo = new THREE.CylinderGeometry(2, 12, 100, 6);
    const cypressMat = new THREE.MeshToonMaterial({ color: 0x1b5e20 }); // Dark green
    const cypressMesh = new THREE.InstancedMesh(cypressGeo, cypressMat, count);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1800;
      const z = (Math.random() - 0.5) * 1800;
      const y = this.terrain.getHeightAt(x, z);

      // Place near paths or temples for a "managed" look
      if (y < 10 || y > 160) {
        i--;
        continue;
      }

      dummy.position.set(x, y + 50, z);
      dummy.scale.set(1, 1 + Math.random() * 0.5, 1);
      dummy.updateMatrix();
      cypressMesh.setMatrixAt(i, dummy.matrix);
      
      this.collisionSpheres.push({ x, z, radius: 12 });
    }

    this.group.add(cypressMesh);
    this.instances['cypresses'] = cypressMesh;
  }

  private createOliveTrees() {
    const count = 30;
    
    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(6, 8, 35, 5);
    const trunkMat = new THREE.MeshToonMaterial({ color: 0x5d4037 });
    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, count);
    
    // Canopy
    const canopyGeo = new THREE.IcosahedronGeometry(28, 0);
    const canopyMat = new THREE.MeshToonMaterial({ color: 0x9ed36a }); // Silvery green
    const canopyMesh = new THREE.InstancedMesh(canopyGeo, canopyMat, count);

    const dummy = new THREE.Object3D();
    const canopyDummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1600;
      const z = (Math.random() - 0.5) * 1600;
      const y = this.terrain.getHeightAt(x, z);

      if (y < 20 || y > 130) {
        i--;
        continue;
      }

      dummy.position.set(x, y + 15, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(i, dummy.matrix);

      canopyDummy.position.set(x, y + 45, z);
      canopyDummy.scale.set(1.2, 0.8, 1.2);
      canopyDummy.updateMatrix();
      canopyMesh.setMatrixAt(i, canopyDummy.matrix);
      
      this.collisionSpheres.push({ x, z, radius: 15 });
    }

    this.group.add(trunkMesh);
    this.group.add(canopyMesh);
    this.instances['olive_trunks'] = trunkMesh;
    this.instances['olive_canopies'] = canopyMesh;
  }

  private createLavender() {
    const count = 80;
    const lavenderGeo = new THREE.ConeGeometry(6, 20, 4);
    const lavenderMat = new THREE.MeshToonMaterial({ color: 0x9575cd }); // Lavender purple
    const lavenderMesh = new THREE.InstancedMesh(lavenderGeo, lavenderMat, count);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1900;
      const z = (Math.random() - 0.5) * 1900;
      const y = this.terrain.getHeightAt(x, z);

      if (y < 5 || y > 100) {
        i--;
        continue;
      }

      dummy.position.set(x, y + 10, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.setScalar(0.5 + Math.random() * 1.0);
      dummy.updateMatrix();
      lavenderMesh.setMatrixAt(i, dummy.matrix);
    }

    this.group.add(lavenderMesh);
    this.instances['lavender'] = lavenderMesh;
  }

  public update(time: number) {
    // Animation if needed
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
