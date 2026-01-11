import * as THREE from 'three';

export class PrehistoricAssets {
  public group: THREE.Group;
  private instances: { [key: string]: THREE.InstancedMesh | null } = {};
  private outlines: { [key: string]: THREE.InstancedMesh | null } = {};
  private collisionSpheres: { x: number; z: number; radius: number }[] = [];

  constructor(private scene: THREE.Scene, private terrain: any) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.createAssets();
  }

  public getCollisionSpheres() {
    return this.collisionSpheres;
  }

  private createAssets() {
    this.createObelisks();
  }

  private createObelisks() {
    const count = 15;
    
    // Obelisk body
    const bodyGeo = new THREE.CylinderGeometry(10, 15, 80, 4);
    const bodyMat = new THREE.MeshToonMaterial({ color: 0x607d8b }); // Slate grey
    const bodyMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, count);
    
    // Top tip (pyramid)
    const tipGeo = new THREE.ConeGeometry(10, 15, 4);
    const tipMat = new THREE.MeshToonMaterial({ color: 0xffd54f }); // Gold/Yellow tip for "tappable" look
    const tipMesh = new THREE.InstancedMesh(tipGeo, tipMat, count);

    const dummy = new THREE.Object3D();
    const tipDummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1600;
      const z = (Math.random() - 0.5) * 1600;
      const y = this.terrain.getHeightAt(x, z);

      if (y < 10 || y > 140) {
        i--;
        continue;
      }

      // Main body
      dummy.position.set(x, y + 40, z);
      dummy.rotation.y = Math.PI / 4; // Square alignment
      dummy.updateMatrix();
      bodyMesh.setMatrixAt(i, dummy.matrix);

      // Tip
      tipDummy.position.set(x, y + 80 + 7.5, z);
      tipDummy.rotation.y = Math.PI / 4;
      tipDummy.updateMatrix();
      tipMesh.setMatrixAt(i, tipDummy.matrix);

      this.collisionSpheres.push({ x, z, radius: 20 });
    }

    this.group.add(bodyMesh);
    this.group.add(tipMesh);
    this.instances['obelisk_body'] = bodyMesh;
    this.instances['obelisk_tip'] = tipMesh;
  }

  public update(time: number) {
    // No assets to update
  }

  public dispose() {
    Object.values(this.instances).forEach(instance => {
      if (instance) {
        instance.geometry.dispose();
        if (Array.isArray(instance.material)) instance.material.forEach(m => m.dispose());
        else instance.material.dispose();
      }
    });
    Object.values(this.outlines).forEach(outline => {
      if (outline) {
        outline.geometry.dispose();
        if (Array.isArray(outline.material)) outline.material.forEach(m => m.dispose());
        else outline.material.dispose();
      }
    });
    this.scene.remove(this.group);
  }
}
