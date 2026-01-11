import * as THREE from 'three';
import { createComicTitle } from '../utils/ThreeDText';
import { BiomeConfig } from './biomes-config';

export interface Biome {
  group: THREE.Group;
  marker: THREE.Object3D | null;
  config: BiomeConfig;
  update: ((time: number, camera: THREE.Camera) => void) | null;
  templeParts: THREE.Object3D[];
  orbitingElements: THREE.Object3D[];
  templeGroup?: THREE.Group;
  artifact?: THREE.Object3D;
}

export class BiomeFactory {
  static create(scene: THREE.Scene, config: BiomeConfig): Biome {
    const biome: Biome = {
      group: new THREE.Group(),
      marker: null,
      config: config,
      update: null,
      templeParts: [],
      orbitingElements: []
    };

    biome.group.userData.isBiomeGroup = true;
    biome.group.position.copy(config.position);
    scene.add(biome.group);

    this.createTemple(biome, config);
    this.createMarker(biome, config);
    this.createText(biome, config);
    this.createLights(biome, config);

    biome.group.traverse((obj) => {
        obj.frustumCulled = false;
    });

    return biome;
  }

    static addOutline(mesh: THREE.Mesh, color: number = 0x000000, thickness: number = 0.08): THREE.Mesh {
      const outlineMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.BackSide });
      const outline = new THREE.Mesh(mesh.geometry, outlineMat);
      outline.scale.multiplyScalar(1.02);
      mesh.add(outline);
      return mesh;
    }

  static createBDMaterial(color: number, emissive: number | null = null, emissiveIntensity: number = 0.6): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.1,
      emissive: emissive !== null ? emissive : color,
      emissiveIntensity: emissiveIntensity,
      flatShading: false
    });
  }

  static createTemple(biome: Biome, config: BiomeConfig) {
    const templeGroup = new THREE.Group();
    biome.templeGroup = templeGroup;

    if (config.url) {
      templeGroup.userData.isNFT = true;
      templeGroup.userData.url = config.url;
      templeGroup.userData.baseY = templeGroup.position.y;
    } else if (config.targetPos) {
      templeGroup.userData.isTeleport = true;
      templeGroup.userData.targetPos = config.targetPos;
      templeGroup.userData.biomeName = config.name;
      templeGroup.userData.baseY = templeGroup.position.y;
    }
    
    switch (config.type) {
      case 'pyramid_solar':
      case 'pyramid_lunar':
      case 'pyramid_void':
      case 'pyramid_celestial':
        this.buildComicTemple(templeGroup, config, biome);
        break;
      case 'roman_jupiter':
      case 'roman_mars':
      case 'roman_venus':
      case 'roman_saturn':
        this.buildRomanTemple(templeGroup, config, biome);
        break;
      default:
        this.buildComicTemple(templeGroup, config, biome);
        break;
    }

    biome.group.add(templeGroup);

    if (biome.artifact) {
        biome.update = (time: number) => {
            if (biome.artifact) {
                const baseY = biome.artifact.userData.baseY ?? 40;
                biome.artifact.position.y = baseY + Math.sin(time * 1.5) * 5;
                biome.artifact.rotation.y += 0.01;
            }

            if (biome.orbitingElements && biome.orbitingElements.length) {
                biome.orbitingElements.forEach((o) => {
                    const radius = o.userData.radius ?? 28;
                    const speed = o.userData.speed ?? 1;
                    const phase = o.userData.phase ?? 0;
                    const oy = o.userData.baseY ?? 40;
                    o.position.x = Math.cos(time * speed + phase) * radius;
                    o.position.z = Math.sin(time * speed + phase) * radius;
                    o.position.y = oy + Math.sin(time * 2.0 + phase) * 1.2;
                    o.rotation.y += 0.02;
                });
            }
        };
    }
  }

  static buildComicTemple(group: THREE.Group, config: BiomeConfig, biome: Biome) {
    const stone = 0x555555;
    const ink = 0x000000;
    const accent = config.color;

    const add = (mesh: THREE.Mesh, outlineColor: number = ink, thickness: number = 0.08) => {
      this.addOutline(mesh, outlineColor, thickness);
      group.add(mesh);
      return mesh;
    };

    const base = new THREE.Mesh(new THREE.CylinderGeometry(40, 45, 10, 8), this.createBDMaterial(stone));
    base.position.y = 5;
    add(base, ink, 0.1);

    const pod = new THREE.Mesh(new THREE.CylinderGeometry(30, 35, 5, 8), this.createBDMaterial(accent));
    pod.position.y = 12.5;
    add(pod, ink, 0.1);

    const type = String(config.type || '');

    if (type.includes('solar')) {
      const stepMat = this.createBDMaterial(0xf2f2f2);
      const step1 = new THREE.Mesh(new THREE.BoxGeometry(58, 8, 58), stepMat);
      step1.position.y = 18;
      add(step1, ink, 0.09);

      const step2 = new THREE.Mesh(new THREE.BoxGeometry(44, 8, 44), stepMat);
      step2.position.y = 26;
      add(step2, ink, 0.09);

      const step3 = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 30), this.createBDMaterial(accent));
      step3.position.y = 35;
      add(step3, ink, 0.09);

      const obMat = this.createBDMaterial(0xffffff);
      const obGeo = new THREE.ConeGeometry(6, 32, 4);
      [
        [26, 26],
        [-26, 26],
        [26, -26],
        [-26, -26],
      ].forEach(([x, z]) => {
        const ob = new THREE.Mesh(obGeo, obMat);
        ob.position.set(x, 28, z);
        ob.rotation.y = Math.PI / 4;
        add(ob, ink, 0.08);
      });

      const coreColor = 0xffd700;
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(12, 0),
        new THREE.MeshStandardMaterial({
          color: coreColor,
          emissive: coreColor,
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.8
        })
      );
      core.position.y = 52;
      core.userData.baseY = 52;
      add(core, 0xffffff, 0.05);
      biome.artifact = core;

      const halo = new THREE.Mesh(new THREE.TorusGeometry(24, 1.2, 8, 32), new THREE.MeshBasicMaterial({ color: coreColor }));
      halo.position.y = 52;
      halo.rotation.x = Math.PI / 2;
      group.add(halo);
    } else if (type.includes('lunar')) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(30, 3.2, 10, 24), this.createBDMaterial(0xf8fafc, 0x88ccff));
      ring.position.y = 18;
      ring.rotation.x = Math.PI / 2;
      add(ring, ink, 0.08);

      const archMat = this.createBDMaterial(0xffffff);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const x = Math.cos(a) * 26;
        const z = Math.sin(a) * 26;
        const col1 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 22, 8), archMat);
        col1.position.set(x, 24, z);
        col1.lookAt(0, col1.position.y, 0);
        add(col1, ink, 0.07);

        const cap = new THREE.Mesh(new THREE.BoxGeometry(10, 3.5, 6), this.createBDMaterial(accent));
        cap.position.set(x, 36, z);
        cap.lookAt(0, cap.position.y, 0);
        add(cap, ink, 0.08);
      }

      const crescent = new THREE.Mesh(new THREE.TorusGeometry(16, 2.6, 10, 32, Math.PI * 1.35), this.createBDMaterial(0xffffff, 0x88ccff));
      crescent.position.y = 52;
      crescent.rotation.z = Math.PI / 2;
      crescent.rotation.x = Math.PI / 6;
      add(crescent, ink, 0.06);

      const coreColor = 0x88ccff;
      const core = new THREE.Mesh(
        new THREE.TorusGeometry(8, 3, 16, 32),
        new THREE.MeshStandardMaterial({
          color: coreColor,
          emissive: coreColor,
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.8
        })
      );
      core.position.y = 48;
      core.userData.baseY = 48;
      add(core, 0xffffff, 0.05);
      biome.artifact = core;

      const moonMat = this.createBDMaterial(0xffffff, coreColor);
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(4.2, 10, 10), moonMat);
        m.userData.radius = 26;
        m.userData.speed = 0.9 + i * 0.25;
        m.userData.phase = i * (Math.PI * 2 / 3);
        m.userData.baseY = 48;
        add(m, ink, 0.06);
        biome.orbitingElements.push(m);
      }
    } else if (type.includes('void')) {
      const gateBase = new THREE.Mesh(new THREE.CylinderGeometry(46, 50, 12, 6), this.createBDMaterial(0x222222, 0x9900ff));
      gateBase.position.y = 6;
      add(gateBase, ink, 0.1);

      const slab = new THREE.Mesh(new THREE.BoxGeometry(18, 76, 12), this.createBDMaterial(0x111111, 0x9900ff));
      slab.position.y = 44;
      add(slab, ink, 0.1);

      const spikeGeo = new THREE.ConeGeometry(3.5, 18, 4);
      const spikeMat = this.createBDMaterial(0xffffff, 0x9900ff);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const s = new THREE.Mesh(spikeGeo, spikeMat);
        s.position.set(Math.cos(a) * 28, 18, Math.sin(a) * 28);
        s.rotation.y = a + Math.PI / 4;
        add(s, ink, 0.07);
      }

      const coreColor = 0x9900ff;
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(11, 0),
        new THREE.MeshStandardMaterial({
          color: coreColor,
          emissive: coreColor,
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.8
        })
      );
      core.position.y = 60;
      core.userData.baseY = 60;
      add(core, 0xffffff, 0.05);
      biome.artifact = core;

      const halo = new THREE.Mesh(new THREE.TorusGeometry(22, 1.4, 8, 32), new THREE.MeshBasicMaterial({ color: coreColor }));
      halo.position.y = 60;
      halo.rotation.x = Math.PI / 2;
      halo.rotation.y = Math.PI / 4;
      group.add(halo);
    } else {
      const coreColor = accent;
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(10, 16, 16),
        new THREE.MeshStandardMaterial({
          color: coreColor,
          emissive: coreColor,
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.8
        })
      );
      core.position.y = 50;
      core.userData.baseY = 50;
      add(core, 0xffffff, 0.05);
      biome.artifact = core;

      const satMat = this.createBDMaterial(0xffffff, coreColor);
      const satGeo = new THREE.BoxGeometry(4.8, 2.0, 2.0);
      for (let i = 0; i < 4; i++) {
        const s = new THREE.Mesh(satGeo, satMat);
        s.userData.radius = 30;
        s.userData.speed = 0.6 + i * 0.15;
        s.userData.phase = i * (Math.PI / 2);
        s.userData.baseY = 50;
        add(s, ink, 0.06);
        biome.orbitingElements.push(s);
      }

      const halo = new THREE.Mesh(new THREE.TorusGeometry(24, 1.2, 8, 32), new THREE.MeshBasicMaterial({ color: coreColor }));
      halo.position.y = 50;
      halo.rotation.x = Math.PI / 2;
      group.add(halo);
    }
  }

  static createLights(biome: Biome, config: BiomeConfig) {
    const light = new THREE.PointLight(config.color, (config.lightIntensity || 1.0) * 4, 350);
    light.position.set(0, 60, 0);
    biome.group.add(light);

    const light2 = new THREE.PointLight(config.color, (config.lightIntensity || 1.0) * 2, 200);
    light2.position.set(0, 95, 0);
    biome.group.add(light2);
  }

  static createMarker(biome: Biome, config: BiomeConfig) {
    biome.marker = null;
  }

  static createText(biome: Biome, config: BiomeConfig) {
    createComicTitle(config.name.toUpperCase(), config.color).then(textGroup => {
        if (textGroup) {
            textGroup.position.y = 180;
            biome.group.add(textGroup);
            
            const originalUpdate = biome.update;
            biome.update = (time: number, camera: THREE.Camera) => {
                if (originalUpdate) originalUpdate(time, camera);
                textGroup.position.y = 180 + Math.sin(time * 2) * 2;
                textGroup.lookAt(camera.position);
            };
        }
    });
  }

  static buildRomanTemple(group: THREE.Group, config: BiomeConfig, biome: Biome) {
    const width = config.radius * 1.5;
    const depth = config.radius * 2;

    const baseGeo = new THREE.BoxGeometry(width, 5, depth);
    const baseMat = this.createBDMaterial(0xdddddd);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -2.5;
    this.addOutline(base);
    group.add(base);

    const colGeo = new THREE.CylinderGeometry(1.5, 1.8, 30, 8);
    const colMat = this.createBDMaterial(0xffffff);

    const colCountX = 5;
    const colCountZ = 7;
    const stepX = (width - 10) / (colCountX - 1);
    const stepZ = (depth - 10) / (colCountZ - 1);

    for(let i=0; i<colCountX; i++) {
        for(let j=0; j<colCountZ; j++) {
            if (i===0 || i===colCountX-1 || j===0 || j===colCountZ-1) {
                const col = new THREE.Mesh(colGeo, colMat);
                col.position.set(
                    -width/2 + 5 + i*stepX,
                    15,
                    -depth/2 + 5 + j*stepZ
                );
                this.addOutline(col);
                group.add(col);
            }
        }
    }

    const roofGeo = new THREE.BoxGeometry(width + 4, 4, depth + 4);
    const roofMat = this.createBDMaterial(config.color);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 32;
    this.addOutline(roof);
    group.add(roof);

    const pedimentGeo = new THREE.ConeGeometry(width * 0.7, 15, 4);
    const pediment = new THREE.Mesh(pedimentGeo, roofMat);
    pediment.position.y = 42;
    pediment.rotation.y = Math.PI / 4;
    pediment.scale.set(1, 1, depth/width * 1.2);
    this.addOutline(pediment);
    group.add(pediment);

    const artGeo = new THREE.IcosahedronGeometry(8, 0);
    const artMat = new THREE.MeshStandardMaterial({ 
        color: config.color, 
        emissive: config.color, 
        emissiveIntensity: 3,
        wireframe: true 
    });
    const artifact = new THREE.Mesh(artGeo, artMat);
    artifact.position.set(0, 20, 0);
    group.add(artifact);
    biome.artifact = artifact;
  }
}
