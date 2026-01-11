import * as THREE from 'three';

export class LeavesVFX {
  public group: THREE.Group;
  private particles: { mesh: THREE.Mesh; velocity: THREE.Vector3; rotSpeed: THREE.Vector3 }[] = [];
  private count = 100;

  constructor(private scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.init();
  }

  private init() {
    const geo = new THREE.BoxGeometry(0.4, 0.1, 0.6);
    const mat = new THREE.MeshToonMaterial({ color: 0x2e7d32, side: THREE.DoubleSide });

    for (let i = 0; i < this.count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      this.resetLeaf(mesh);
      mesh.position.y = Math.random() * 200;
      this.group.add(mesh);
      this.particles.push({
        mesh,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.2, -0.2 - Math.random() * 0.5, (Math.random() - 0.5) * 0.2),
        rotSpeed: new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1)
      });
    }
  }

  private resetLeaf(mesh: THREE.Mesh) {
    mesh.position.set(
      (Math.random() - 0.5) * 2000,
      200 + Math.random() * 100,
      (Math.random() - 0.5) * 2000
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  }

  public update(time: number, delta: number) {
    this.particles.forEach(p => {
      p.mesh.position.add(p.velocity.clone().multiplyScalar(delta * 60));
      p.mesh.rotation.x += p.rotSpeed.x;
      p.mesh.rotation.y += p.rotSpeed.y;
      p.mesh.rotation.z += p.rotSpeed.z;
      
      p.mesh.position.x += Math.sin(time * 0.5 + p.mesh.position.y * 0.1) * 0.1;

      if (p.mesh.position.y < 0) {
        this.resetLeaf(p.mesh);
      }
    });
  }

  public dispose() {
    this.particles.forEach(p => {
      p.mesh.geometry.dispose();
      if (Array.isArray(p.mesh.material)) p.mesh.material.forEach(m => m.dispose());
      else p.mesh.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
