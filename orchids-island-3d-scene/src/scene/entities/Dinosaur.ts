import * as THREE from 'three';
import { Terrain } from '../environment/Terrain';

export type DinoType = 'TREX' | 'TRICERATOPS' | 'BRACHIOSAURUS' | 'STEGOSAURUS' | 'RAPTOR' | 'ANKYLOSAURUS' | 'PARASAUROLOPHUS';

export const DINO_TYPES: { [key in DinoType]: DinoType } = {
    TREX: 'TREX',
    TRICERATOPS: 'TRICERATOPS',
    BRACHIOSAURUS: 'BRACHIOSAURUS',
    STEGOSAURUS: 'STEGOSAURUS',
    RAPTOR: 'RAPTOR',
    ANKYLOSAURUS: 'ANKYLOSAURUS',
    PARASAUROLOPHUS: 'PARASAUROLOPHUS'
};

export interface DinosaurOptions {
    type?: DinoType;
    color?: number;
    accentColor?: number;
    scale?: number;
    speed?: number;
    x?: number;
    z?: number;
    allDinosaurs?: Dinosaur[];
}

export class Dinosaur {
  public group: THREE.Group;
  private scene: THREE.Scene;
  private terrain: Terrain;
  private allDinosaurs: Dinosaur[];
  private type: DinoType;
  private color: number;
  private accentColor: number;
  private scaleValue: number;
  private speed: number;
  private targetPos: THREE.Vector3;
  private isWalking: boolean;
  private waitTimer: number;
  private rotationTarget: number;
  private collisionRadius: number;
    private footOffset: number = 0;
    private groundOffset: number = 0.5;
    private surfaceNormal: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    private targetRotation: THREE.Quaternion = new THREE.Quaternion();
    private parts: { [key: string]: any } = {};
  public hitboxRadius: number = 20;
  private health: number = 100;
  private isHit: boolean = false;
  private hitFlashTimer: number = 0;

  constructor(scene: THREE.Scene, terrain: Terrain, options: DinosaurOptions = {}) {
    this.scene = scene;
    this.terrain = terrain;
    this.allDinosaurs = options.allDinosaurs || [];
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.type = options.type || DINO_TYPES.TREX;
    this.color = options.color || 0x2d4c3b;
    this.accentColor = options.accentColor || 0xe6a15c;
    this.scaleValue = options.scale || 3;
    this.speed = (options.speed || 1) * (0.8 + Math.random() * 0.4);
    
    this.targetPos = new THREE.Vector3();
    this.isWalking = false;
    this.waitTimer = 0;
    this.rotationTarget = 0;
    this.collisionRadius = 15 * (this.scaleValue / 3);
    
    this.createModel();
    this.pickNewTarget();
    
    const startX = options.x !== undefined ? options.x : (Math.random() - 0.5) * 1500;
    const startZ = options.z !== undefined ? options.z : (Math.random() - 0.5) * 1500;
    this.group.position.set(startX, 0, startZ);
    this.group.scale.set(this.scaleValue, this.scaleValue, this.scaleValue);
    
    this.updateGrounding();
  }

  private createModel() {
    const bodyMat = new THREE.MeshToonMaterial({ color: this.color });
    const bellyMat = new THREE.MeshToonMaterial({ color: this.accentColor });
    const jawMat = new THREE.MeshToonMaterial({ color: 0xd2b48c });
    const eyeMat = new THREE.MeshToonMaterial({ color: 0xffff00 });
    const black = 0x1a1a1a;
    const plateMat = new THREE.MeshToonMaterial({ color: 0x8b4513 });

    const bodyGroup = new THREE.Group();
    this.group.add(bodyGroup);
    this.parts.body = bodyGroup;

    switch(this.type) {
        case DINO_TYPES.TREX:
            this.createTrex(bodyMat, bellyMat, jawMat, eyeMat, black);
            this.footOffset = 17;
            break;
        case DINO_TYPES.TRICERATOPS:
            this.createTriceratops(bodyMat, bellyMat, eyeMat, black);
            this.footOffset = 10;
            break;
        case DINO_TYPES.BRACHIOSAURUS:
            this.createBrachiosaurus(bodyMat, bellyMat, eyeMat, black);
            this.footOffset = 12;
            break;
        case DINO_TYPES.STEGOSAURUS:
            this.createStegosaurus(bodyMat, bellyMat, plateMat, eyeMat, black);
            this.footOffset = 10;
            break;
        case DINO_TYPES.RAPTOR:
            this.createRaptor(bodyMat, bellyMat, jawMat, eyeMat, black);
            this.footOffset = 12;
            this.speed *= 1.5;
            break;
        case DINO_TYPES.ANKYLOSAURUS:
            this.createAnkylosaurus(bodyMat, bellyMat, eyeMat, black);
            this.footOffset = 8;
            break;
        case DINO_TYPES.PARASAUROLOPHUS:
            this.createParasaurolophus(bodyMat, bellyMat, eyeMat, black);
            this.footOffset = 15;
            break;
    }
  }

  private createTrex(bodyMat: THREE.Material, bellyMat: THREE.Material, jawMat: THREE.Material, eyeMat: THREE.Material, black: number) {
    const torsoGeom = new THREE.BoxGeometry(8, 10, 14);
    const torso = new THREE.Mesh(torsoGeom, bodyMat);
    torso.castShadow = true;
    this.parts.body.add(torso);

    const bellyGeom = new THREE.BoxGeometry(6.5, 6, 12);
    const belly = new THREE.Mesh(bellyGeom, bellyMat);
    belly.position.set(0, -3, 1);
    this.parts.body.add(belly);

    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 4, 6);
    this.parts.body.add(neckGroup);
    this.parts.neck = neckGroup;

    const neckGeom = new THREE.BoxGeometry(5, 6, 6);
    const neck = new THREE.Mesh(neckGeom, bodyMat);
    neck.position.set(0, 2, 2);
    neck.rotation.x = -Math.PI / 6;
    neckGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 5, 4);
    neckGroup.add(headGroup);
    this.parts.head = headGroup;

    const headTopGeom = new THREE.BoxGeometry(6, 6, 10);
    const headTop = new THREE.Mesh(headTopGeom, bodyMat);
    headTop.position.set(0, 0, 3);
    headGroup.add(headTop);

    const eyeGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(2.5, 1.5, 4);
    headTop.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(-2.5, 1.5, 4);
    headTop.add(rightEye);

    const jawGroup = new THREE.Group();
    jawGroup.position.set(0, -2, 1);
    headGroup.add(jawGroup);
    this.parts.jaw = jawGroup;

    const jawGeom = new THREE.BoxGeometry(5.5, 2.5, 9);
    const jaw = new THREE.Mesh(jawGeom, jawMat);
    jaw.position.set(0, 0, 3);
    jawGroup.add(jaw);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0, -7);
    this.parts.body.add(tailGroup);
    this.parts.tail = tailGroup;
    this.createTailSegments(tailGroup, bodyMat, 4);

    this.parts.legL = this.createLeg(bodyMat, black, -5, -4, -2);
    this.parts.legR = this.createLeg(bodyMat, black, 5, -4, -2);
    
    const armGeom = new THREE.BoxGeometry(1.5, 1.5, 4);
    const armL = new THREE.Mesh(armGeom, bodyMat);
    armL.position.set(4, -1, 6);
    armL.rotation.x = Math.PI / 4;
    this.parts.body.add(armL);
    const armR = new THREE.Mesh(armGeom, bodyMat);
    armR.position.set(-4, -1, 6);
    armR.rotation.x = Math.PI / 4;
    this.parts.body.add(armR);
  }

  private createTriceratops(bodyMat: THREE.Material, bellyMat: THREE.Material, eyeMat: THREE.Material, black: number) {
    const torsoGeom = new THREE.BoxGeometry(12, 10, 18);
    const torso = new THREE.Mesh(torsoGeom, bodyMat);
    this.parts.body.add(torso);

    const bellyGeom = new THREE.BoxGeometry(10, 5, 16);
    const belly = new THREE.Mesh(bellyGeom, bellyMat);
    belly.position.y = -4;
    this.parts.body.add(belly);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2, 10);
    this.parts.body.add(headGroup);
    this.parts.head = headGroup;

    const headGeom = new THREE.BoxGeometry(8, 8, 10);
    const head = new THREE.Mesh(headGeom, bodyMat);
    headGroup.add(head);

    const frillGeom = new THREE.BoxGeometry(14, 14, 2);
    const frill = new THREE.Mesh(frillGeom, bodyMat);
    frill.position.set(0, 4, -4);
    frill.rotation.x = -Math.PI / 6;
    head.add(frill);

    const hornGeom = new THREE.ConeGeometry(1, 6, 4);
    const hornMat = new THREE.MeshToonMaterial({ color: 0xeeeeee });
    const hornL = new THREE.Mesh(hornGeom, hornMat);
    hornL.position.set(3, 4, 3);
    hornL.rotation.x = Math.PI / 3;
    head.add(hornL);
    const hornR = new THREE.Mesh(hornGeom, hornMat);
    hornR.position.set(-3, 4, 3);
    hornR.rotation.x = Math.PI / 3;
    head.add(hornR);
    const noseHorn = new THREE.Mesh(hornGeom, hornMat);
    noseHorn.scale.set(0.6, 0.6, 0.6);
    noseHorn.position.set(0, 2, 5);
    noseHorn.rotation.x = Math.PI / 10;
    head.add(noseHorn);

    this.parts.legFL = this.createLeg(bodyMat, black, -5, -4, 6, true);
    this.parts.legFR = this.createLeg(bodyMat, black, 5, -4, 6, true);
    this.parts.legBL = this.createLeg(bodyMat, black, -5, -4, -6, true);
    this.parts.legBR = this.createLeg(bodyMat, black, 5, -4, -6, true);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, -2, -9);
    this.parts.body.add(tailGroup);
    this.parts.tail = tailGroup;
    this.createTailSegments(tailGroup, bodyMat, 3);
  }

  private createBrachiosaurus(bodyMat: THREE.Material, bellyMat: THREE.Material, eyeMat: THREE.Material, black: number) {
    const torsoGeom = new THREE.BoxGeometry(12, 12, 22);
    const torso = new THREE.Mesh(torsoGeom, bodyMat);
    this.parts.body.add(torso);

    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 5, 10);
    this.parts.body.add(neckGroup);
    this.parts.neck = neckGroup;

    let prevPart: THREE.Object3D = neckGroup;
    for (let i = 0; i < 5; i++) {
        const segGroup = new THREE.Group();
        const size = 6 - i * 0.5;
        const segGeom = new THREE.BoxGeometry(size, 8, size);
        const seg = new THREE.Mesh(segGeom, bodyMat);
        seg.position.y = 4;
        segGroup.add(seg);
        segGroup.position.y = 7;
        segGroup.rotation.x = i === 0 ? Math.PI / 6 : 0.1;
        prevPart.add(segGroup);
        this.parts[`neckSeg${i}`] = segGroup;
        prevPart = segGroup;
    }

    const headGeom = new THREE.BoxGeometry(4, 3, 6);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(0, 8, 2);
    prevPart.add(head);
    this.parts.head = head;

    this.parts.legFL = this.createLeg(bodyMat, black, -5, -5, 8, true);
    this.parts.legFR = this.createLeg(bodyMat, black, 5, -5, 8, true);
    this.parts.legBL = this.createLeg(bodyMat, black, -5, -5, -8, true);
    this.parts.legBR = this.createLeg(bodyMat, black, 5, -5, -8, true);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0, -11);
    this.parts.body.add(tailGroup);
    this.parts.tail = tailGroup;
    this.createTailSegments(tailGroup, bodyMat, 6);
  }

  private createStegosaurus(bodyMat: THREE.Material, bellyMat: THREE.Material, plateMat: THREE.Material, eyeMat: THREE.Material, black: number) {
    const torsoGeom = new THREE.BoxGeometry(10, 10, 18);
    const torso = new THREE.Mesh(torsoGeom, bodyMat);
    this.parts.body.add(torso);

    const plateGeom = new THREE.BoxGeometry(1, 6, 6);
    for (let i = 0; i < 6; i++) {
        const p1 = new THREE.Mesh(plateGeom, plateMat);
        p1.position.set(2, 6, -10 + i * 4);
        p1.rotation.y = 0.2;
        this.parts.body.add(p1);
        const p2 = new THREE.Mesh(plateGeom, plateMat);
        p2.position.set(-2, 6, -8 + i * 4);
        p2.rotation.y = -0.2;
        this.parts.body.add(p2);
    }

    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0, 9);
    this.parts.body.add(neckGroup);
    this.parts.neck = neckGroup;

    const headGeom = new THREE.BoxGeometry(4, 4, 7);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.z = 3;
    neckGroup.add(head);
    this.parts.head = head;

    this.parts.legFL = this.createLeg(bodyMat, black, -4, -4, 6, true);
    this.parts.legFR = this.createLeg(bodyMat, black, 4, -4, 6, true);
    this.parts.legBL = this.createLeg(bodyMat, black, -4, -4, -6, true);
    this.parts.legBR = this.createLeg(bodyMat, black, 4, -4, -6, true);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0, -9);
    this.parts.body.add(tailGroup);
    this.parts.tail = tailGroup;
    this.createTailSegments(tailGroup, bodyMat, 4);
    
    const lastSeg = this.parts.tailSegment3;
    const spikeGeom = new THREE.ConeGeometry(0.5, 4, 4);
    if (lastSeg) {
        for (let i = 0; i < 4; i++) {
            const spike = new THREE.Mesh(spikeGeom, plateMat);
            spike.position.set(i < 2 ? 2 : -2, 0, -2 - (i % 2) * 2);
            spike.rotation.z = i < 2 ? -Math.PI/2 : Math.PI/2;
            lastSeg.add(spike);
        }
    }
  }

  private createRaptor(bodyMat: THREE.Material, bellyMat: THREE.Material, jawMat: THREE.Material, eyeMat: THREE.Material, black: number) {
    const torsoGeom = new THREE.BoxGeometry(4, 5, 10);
    const torso = new THREE.Mesh(torsoGeom, bodyMat);
    this.parts.body.add(torso);

    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 2, 5);
    this.parts.body.add(neckGroup);
    this.parts.neck = neckGroup;

    const headGeom = new THREE.BoxGeometry(3, 3, 6);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(0, 2, 2);
    neckGroup.add(head);
    this.parts.head = head;

    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 1, -5);
    this.parts.body.add(tailGroup);
    this.parts.tail = tailGroup;
    this.createTailSegments(tailGroup, bodyMat, 5);

    this.parts.legL = this.createLeg(bodyMat, black, -3, -2, -1);
    this.parts.legR = this.createLeg(bodyMat, black, 3, -2, -1);
    
    const clawGeom = new THREE.BoxGeometry(0.5, 2, 0.5);
    const clawMat = new THREE.MeshToonMaterial({ color: 0x111111 });
    const cL = new THREE.Mesh(clawGeom, clawMat);
    cL.position.set(0, -7, 2);
    cL.rotation.x = -Math.PI/4;
    this.parts.legL.children[1].add(cL);
    const cR = new THREE.Mesh(clawGeom, clawMat);
    cR.position.set(0, -7, 2);
    cR.rotation.x = -Math.PI/4;
    this.parts.legR.children[1].add(cR);
  }

  private createTailSegments(parent: THREE.Object3D, mat: THREE.Material, count: number) {
    let prev = parent;
    for (let i = 0; i < count; i++) {
        const segGroup = new THREE.Group();
        const size = 5 - i * (5/count);
        const segGeom = new THREE.BoxGeometry(size, size, 6);
        const seg = new THREE.Mesh(segGeom, mat);
        seg.position.z = -3;
        segGroup.add(seg);
        segGroup.position.z = i === 0 ? 0 : -5;
        prev.add(segGroup);
        this.parts[`tailSegment${i}`] = segGroup;
        prev = segGroup;
    }
  }

  private createLeg(mat: THREE.Material, clawColor: number, x: number, y: number, z: number, isQuadruped: boolean = false) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    this.group.add(group);
    
    const thighGeom = new THREE.BoxGeometry(isQuadruped ? 3 : 4, 8, 4);
    const thigh = new THREE.Mesh(thighGeom, mat);
    thigh.position.y = -4;
    group.add(thigh);

    const shinGroup = new THREE.Group();
    shinGroup.position.y = -8;
    group.add(shinGroup);

    const shinGeom = new THREE.BoxGeometry(isQuadruped ? 2.5 : 3, 8, 3);
    const shin = new THREE.Mesh(shinGeom, mat);
    shin.position.y = -4;
    shinGroup.add(shin);

    const footGeom = new THREE.BoxGeometry(isQuadruped ? 4 : 5, 2, isQuadruped ? 5 : 7);
    const foot = new THREE.Mesh(footGeom, mat);
    foot.position.set(0, -8, 1);
    shinGroup.add(foot);

    const clawMat = new THREE.MeshToonMaterial({ color: clawColor });
    const clawGeom = new THREE.BoxGeometry(0.8, 0.8, 1.5);
    for (let i = 0; i < 3; i++) {
        const claw = new THREE.Mesh(clawGeom, clawMat);
        claw.position.set((i - 1) * 1.2, -0.5, 2.5);
        foot.add(claw);
    }

    return group;
  }

  private pickNewTarget() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 400 + Math.random() * 1000;
    this.targetPos.set(
      Math.cos(angle) * dist,
      0,
      Math.sin(angle) * dist
    );
    this.isWalking = true;
    this.waitTimer = 0;
    
    const dx = this.targetPos.x - this.group.position.x;
    const dz = this.targetPos.z - this.group.position.z;
    this.rotationTarget = Math.atan2(dx, dz);
  }

  getGroundHeightAndNormal(x: number, z: number) {
    if (!this.terrain) return { height: 0, normal: new THREE.Vector3(0, 1, 0) };
    const sampleDist = 3.0;
    const hCenter = this.terrain.getHeightAt(x, z);
    const hForward = this.terrain.getHeightAt(x, z - sampleDist);
    const hRight = this.terrain.getHeightAt(x + sampleDist, z);
    const vForward = new THREE.Vector3(0, hForward - hCenter, -sampleDist);
    const vRight = new THREE.Vector3(sampleDist, hRight - hCenter, 0);
    const normal = new THREE.Vector3().crossVectors(vRight, vForward).normalize();
    return { height: hCenter, normal };
  }

  public updateGrounding() {
    const { height: groundY, normal } = this.getGroundHeightAndNormal(this.group.position.x, this.group.position.z);
    this.surfaceNormal.lerp(normal, 0.1);
    
    // Safety offset + scaled foot offset
    const baseHeight = groundY + this.groundOffset + (this.footOffset * this.scaleValue); 
    this.group.position.y = baseHeight;

    const up = new THREE.Vector3(0, 1, 0);
    if (this.surfaceNormal.dot(up) < 0.99) {
        const axis = new THREE.Vector3().crossVectors(up, this.surfaceNormal).normalize();
        const angle = Math.acos(up.dot(this.surfaceNormal));
        this.targetRotation.setFromAxisAngle(axis, angle);
    } else {
        this.targetRotation.set(0, 0, 0, 1);
    }
  }

  private checkCollisions(delta: number) {
    if (!this.allDinosaurs) return;
    
    for (const other of this.allDinosaurs) {
        if (other === this) continue;
        
        const dx = other.group.position.x - this.group.position.x;
        const dz = other.group.position.z - this.group.position.z;
        const distSq = dx * dx + dz * dz;
        const minDist = this.collisionRadius + other.collisionRadius;
        
        if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap * 0.5;
            const pushZ = (dz / dist) * overlap * 0.5;
            
            this.group.position.x -= pushX;
            this.group.position.z -= pushZ;
            
            if (this.isWalking && Math.random() > 0.98) {
                this.pickNewTarget();
            }
        }
    }
  }

  public takeHit(sourcePos: THREE.Vector3) {
    if (this.isHit) return;
    this.isHit = true;
    this.health -= 25;
    this.hitFlashTimer = 0.2;

    const pushDir = new THREE.Vector3().subVectors(this.group.position, sourcePos).normalize();
    this.group.position.add(pushDir.multiplyScalar(15));
    
    this.group.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (!child.userData.originalColor) {
            child.userData.originalColor = child.material.color.clone();
        }
        child.material.color.set(0xff0000);
      }
    });

    if (this.health <= 0) {
      setTimeout(() => this.dispose(), 200);
    }
  }

  public getHitboxes() {
    return [{
      center: this.group.position.clone().add(new THREE.Vector3(0, 5, 0)),
      radius: this.hitboxRadius * (this.scaleValue / 3)
    }];
  }

  public update(time: number, delta: number, playerPos?: THREE.Vector3) {
    if (!delta) delta = 0.016;

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      if (this.hitFlashTimer <= 0) {
        this.isHit = false;
        this.group.traverse((child: any) => {
          if (child.isMesh && child.userData.originalColor) {
            child.material.color.copy(child.userData.originalColor);
          }
        });
      }
    }

    if (this.isWalking) {
      const dx = this.targetPos.x - this.group.position.x;
      const dz = this.targetPos.z - this.group.position.z;
      const distSq = dx * dx + dz * dz;

      if (distSq < 400) {
        this.isWalking = false;
        this.waitTimer = 0.1; // Continuous movement
      } else {
        let angleDiff = this.rotationTarget - this.group.rotation.y;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.group.rotation.y += angleDiff * delta * 2;

        const moveSpeed = this.speed * 40 * delta;
        this.group.position.x += Math.sin(this.group.rotation.y) * moveSpeed;
        this.group.position.z += Math.cos(this.group.rotation.y) * moveSpeed;
      }
    } else {
      this.waitTimer -= delta;
      if (this.waitTimer <= 0) {
        this.pickNewTarget();
      }
    }

      this.updateGrounding();
      this.checkCollisions(delta);

      // Apply slope tilting to the body parts
      if (this.parts.body) {
        this.parts.body.quaternion.slerp(this.targetRotation, 0.1);
      }

      const breathing = Math.sin(time * 1.5) * 0.03;
    if (this.parts.body) {
        this.parts.body.scale.set(1 + breathing, 1 + breathing, 1 + breathing);
        if (this.parts.neck) {
            this.parts.neck.rotation.y = Math.sin(time * 0.5) * 0.1;
            this.parts.neck.rotation.x = (this.type === DINO_TYPES.BRACHIOSAURUS ? 0 : -Math.PI / 8) + Math.sin(time * 0.8) * 0.05;
        }
        if (this.parts.head) {
            this.parts.head.rotation.y = Math.sin(time * 0.3) * 0.2;
        }
        if (this.parts.tail) {
            const tailFreq = this.isWalking ? 3.0 : 1.0;
            const tailAmp = this.isWalking ? 0.4 : 0.15;
            for (let i = 0; i < 6; i++) {
                const seg = this.parts[`tailSegment${i}`];
                if (seg) {
                    seg.rotation.y = Math.sin(time * tailFreq - i * 0.4) * tailAmp;
                }
            }
        }
    }

    if (this.isWalking) {
        const walkCycle = time * 6 * this.speed;
        const amp = 0.6;
        
        if (this.type === DINO_TYPES.TREX || this.type === DINO_TYPES.RAPTOR) {
            if (this.parts.legL) this.parts.legL.rotation.x = Math.sin(walkCycle) * amp;
            if (this.parts.legR) this.parts.legR.rotation.x = Math.sin(walkCycle + Math.PI) * amp;
        } else {
            if (this.parts.legFL) this.parts.legFL.rotation.x = Math.sin(walkCycle) * amp;
            if (this.parts.legBR) this.parts.legBR.rotation.x = Math.sin(walkCycle) * amp;
            if (this.parts.legFR) this.parts.legFR.rotation.x = Math.sin(walkCycle + Math.PI) * amp;
            if (this.parts.legBL) this.parts.legBL.rotation.x = Math.sin(walkCycle + Math.PI) * amp;
        }
        
        if (this.parts.body) this.parts.body.position.y = Math.abs(Math.cos(walkCycle * 2)) * 1.0;
    } else {
        const legs = ['legL', 'legR', 'legFL', 'legFR', 'legBL', 'legBR'];
        legs.forEach(l => { if (this.parts[l]) this.parts[l].rotation.x = 0; });
        if (this.parts.body) this.parts.body.position.y = Math.sin(time * 1.5) * 0.2;
    }
  }

  public dispose() {
    this.group.traverse((child: any) => {
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
