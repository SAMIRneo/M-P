import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export class RomanAssets {
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
    // 1. Temple & Pantheon Geometries (ONLY these are kept)
    
    // Advanced Temple Geometry
    const baseGeom = new THREE.BoxGeometry(26, 3, 42);
    baseGeom.translate(0, 1.5, 0);
    
    const geomsToMerge = [baseGeom];
    const colColGeom = new THREE.CylinderGeometry(0.9, 0.9, 14, 12);
    for (let i = -11; i <= 11; i += 5.5) {
      for (let j = -19; j <= 19; j += 9.5) {
        if (Math.abs(i) === 11 || Math.abs(j) === 19) {
          const c = colColGeom.clone();
          c.translate(i, 9.5, j);
          geomsToMerge.push(c);
        }
      }
    }
    const roofGeom = new THREE.CylinderGeometry(0, 15, 7, 4);
    roofGeom.rotateY(Math.PI / 4);
    roofGeom.scale(1, 1, 1.85);
    roofGeom.translate(0, 20, 0);
    geomsToMerge.push(roofGeom);
    const templeGeom = BufferGeometryUtils.mergeGeometries(geomsToMerge);

    // Advanced Pantheon Geometry
    const pBase = new THREE.CylinderGeometry(20, 20, 18, 24);
    pBase.translate(0, 9, 0);
    const pDome = new THREE.SphereGeometry(20, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    pDome.translate(0, 18, 0);
    const pPortico = new THREE.BoxGeometry(18, 14, 12);
    pPortico.translate(0, 7, 22);
    const pantheonGeom = BufferGeometryUtils.mergeGeometries([pBase, pDome, pPortico]);

    // Single Column Geometry
    const colBase = new THREE.BoxGeometry(4, 1, 4);
    const colShaft = new THREE.CylinderGeometry(1.2, 1.2, 12, 12);
    colShaft.translate(0, 6.5, 0);
    const colCap = new THREE.BoxGeometry(3, 1, 3);
    colCap.translate(0, 12.5, 0);
    const columnGeom = BufferGeometryUtils.mergeGeometries([colBase, colShaft, colCap]);

    // Broken Column Geometry
    const brokenColShaft = new THREE.CylinderGeometry(1.2, 1.2, 5, 12);
    brokenColShaft.translate(0, 3, 0);
    brokenColShaft.rotateZ(0.2);
    const brokenColumnGeom = BufferGeometryUtils.mergeGeometries([colBase, brokenColShaft]);

    // Materials
    const marbleProps = {
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      color: 0xffffff
    };

    const marbleMat = new THREE.MeshPhysicalMaterial(marbleProps); 
    const pantheonMat = new THREE.MeshPhysicalMaterial({ ...marbleProps, color: 0xf5f5f5 });
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });

    const numTemples = 5;
    const numPantheons = 3;
    const numColumns = 30;
    const numBrokenColumns = 20;
    
    this.instances.temples = new THREE.InstancedMesh(templeGeom, marbleMat, numTemples);
    this.instances.pantheons = new THREE.InstancedMesh(pantheonGeom, pantheonMat, numPantheons);
    this.instances.columns = new THREE.InstancedMesh(columnGeom, marbleMat, numColumns);
    this.instances.brokenColumns = new THREE.InstancedMesh(brokenColumnGeom, marbleMat, numBrokenColumns);

    const createOutline = (name: string, geom: THREE.BufferGeometry, count: number, scale = 0.008) => {
      const oGeom = geom.clone();
      oGeom.scale(1 + scale, 1 + scale, 1 + scale);
      this.outlines[name] = new THREE.InstancedMesh(oGeom, outlineMat, count);
      this.group.add(this.outlines[name]!);
    };

    createOutline('temples', templeGeom, numTemples, 0.008);
    createOutline('pantheons', pantheonGeom, numPantheons, 0.008);
    createOutline('columns', columnGeom, numColumns, 0.02);
    createOutline('brokenColumns', brokenColumnGeom, numBrokenColumns, 0.02);

    Object.values(this.instances).forEach(inst => {
      if (inst) {
        inst.castShadow = true;
        inst.receiveShadow = true;
        this.group.add(inst);
      }
    });

    const dummy = new THREE.Object3D();
    const counts: { [key: string]: number } = { temples: 0, pantheons: 0, columns: 0, brokenColumns: 0 };
    
    let attempts = 0;
    const maxAttempts = 20000;

    while (attempts < maxAttempts) {
      attempts++;
      const x = (Math.random() - 0.5) * 4000;
      const z = (Math.random() - 0.5) * 4000;
      const h = this.terrain.getHeightAt(x, z);
      const isPath = this.terrain.getIsPath(x, z);
      
      const isHighPlateau = h > 130;
      const isMidPlain = h > 40 && h <= 130;

      dummy.position.set(x, h - 0.2, z);

      if (isHighPlateau && isPath < 0.1) {
        if (counts.temples < numTemples && Math.random() < 0.08) {
          const scale = 4.0 + Math.random() * 2.0;
          dummy.scale.set(scale, scale, scale);
          dummy.rotation.y = Math.atan2(x, z) + Math.PI;
          dummy.updateMatrix();
          this.instances.temples!.setMatrixAt(counts.temples, dummy.matrix);
          this.outlines.temples!.setMatrixAt(counts.temples, dummy.matrix);
          this.collisionSpheres.push({ x, z, radius: 18 * scale });
          counts.temples++;
        } else if (counts.pantheons < numPantheons && Math.random() < 0.08) {
          const scale = 4.0 + Math.random() * 2.0;
          dummy.scale.set(scale, scale, scale);
          dummy.rotation.y = Math.atan2(x, z) + Math.PI;
          dummy.updateMatrix();
          this.instances.pantheons!.setMatrixAt(counts.pantheons, dummy.matrix);
          this.outlines.pantheons!.setMatrixAt(counts.pantheons, dummy.matrix);
          this.collisionSpheres.push({ x, z, radius: 22 * scale });
          counts.pantheons++;
        }
      } else if (isMidPlain && isPath < 0.2) {
          if (counts.columns < numColumns && Math.random() < 0.05) {
            const scale = 2.0 + Math.random() * 3.0;
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.updateMatrix();
            this.instances.columns!.setMatrixAt(counts.columns, dummy.matrix);
            this.outlines.columns!.setMatrixAt(counts.columns, dummy.matrix);
            this.collisionSpheres.push({ x, z, radius: 4 * scale });
            counts.columns++;
          } else if (counts.brokenColumns < numBrokenColumns && Math.random() < 0.05) {
            const scale = 2.0 + Math.random() * 3.0;
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.updateMatrix();
            this.instances.brokenColumns!.setMatrixAt(counts.brokenColumns, dummy.matrix);
            this.outlines.brokenColumns!.setMatrixAt(counts.brokenColumns, dummy.matrix);
            this.collisionSpheres.push({ x, z, radius: 4 * scale });
            counts.brokenColumns++;
          }
      }
    }

    Object.values(this.instances).forEach(inst => {
      if (inst) inst.instanceMatrix.needsUpdate = true;
    });
    Object.values(this.outlines).forEach(out => {
      if (out) out.instanceMatrix.needsUpdate = true;
    });
  }

  public dispose() {
    Object.values(this.instances).forEach(instance => {
      if (instance) {
        instance.geometry.dispose();
        if (Array.isArray(instance.material)) instance.material.forEach(m => m.dispose());
        else instance.material.dispose();
      }
    });
    Object.values(this.outlines).forEach(instance => {
      if (instance) {
        instance.geometry.dispose();
        if (Array.isArray(instance.material)) instance.material.forEach(m => m.dispose());
        else instance.material.dispose();
      }
    });
    this.scene.remove(this.group);
  }
}
