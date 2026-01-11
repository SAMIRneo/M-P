import * as THREE from 'three';
import { RomanTerrain } from '../environment/RomanTerrain';
import { ComicSticker } from '../utils/ComicSticker';

export const MONSTER_TYPES = {
  MINOTAUR: 'MINOTAUR',
  CENTAUR: 'CENTAUR',
  LION: 'LION',
  GRIFFIN: 'GRIFFIN'
} as const;

export const MONSTER_STATES = {
  IDLE: 'IDLE',
  WANDER: 'WANDER',
  ALERT: 'ALERT'
} as const;

export type MonsterType = keyof typeof MONSTER_TYPES;
export type MonsterState = keyof typeof MONSTER_STATES;

interface MonsterOptions {
  type?: MonsterType;
  color?: number;
  scale?: number;
  speed?: number;
  allMonsters?: MythicalMonster[];
  x?: number;
  z?: number;
}

export class MythicalMonster {
  public group: THREE.Group;
  private type: MonsterType;
  private state: MonsterState = 'WANDER';
  private color: number;
  private scale: number;
  private speed: number;
  private targetPos = new THREE.Vector3();
  private isWalking = true; // Always moving
  private stateTimer = 0;
    private rotationTarget = 0;
    public collisionRadius: number;
    public hitboxRadius: number;
    private footOffset = 0;
    private groundOffset = 0.5;
    private surfaceNormal = new THREE.Vector3(0, 1, 0);
    private targetRotation = new THREE.Quaternion();
    private parts: { [key: string]: THREE.Group | THREE.Mesh | any } = {};
  private allMonsters: MythicalMonster[];
  private outlineMaterial: THREE.MeshBasicMaterial;
  private hitFlashTimer = 0;
  private originalColors = new Map<THREE.Mesh, THREE.Color>();

  constructor(private scene: THREE.Scene, private terrain: RomanTerrain, options: MonsterOptions = {}) {
    this.allMonsters = options.allMonsters || [];
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.type = options.type || 'LION';
    this.color = options.color || this.getDefaultColor();
    this.scale = options.scale || 3;
    this.speed = (options.speed || 1.5) * (1.1 + Math.random() * 0.7); // Faster
    this.collisionRadius = 12 * (this.scale / 3);
    this.hitboxRadius = 15 * (this.scale / 3);

    this.outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });

    this.createModel();
    this.pickNewTarget();

    const startX = options.x !== undefined ? options.x : (Math.random() - 0.5) * 2000;
    const startZ = options.z !== undefined ? options.z : (Math.random() - 0.5) * 2000;
    this.group.position.set(startX, 0, startZ);
    this.group.scale.set(this.scale, this.scale, this.scale);

    this.updateGrounding();
  }

  private getDefaultColor(): number {
    switch (this.type) {
      case 'MINOTAUR': return 0x8d6e63;
      case 'CENTAUR': return 0xa1887f;
      case 'LION': return 0xffb74d;
      case 'GRIFFIN': return 0xffd54f;
      default: return 0xffffff;
    }
  }

  private addOutline(mesh: THREE.Mesh): void {
    const outline = new THREE.Mesh(mesh.geometry, this.outlineMaterial);
    outline.scale.multiplyScalar(1.1); // Thicker outline
    mesh.add(outline);
  }

  private createModel(): void {
    const mainMat = new THREE.MeshToonMaterial({ color: this.color });
    const eyeMat = new THREE.MeshToonMaterial({ color: 0xff0000 });
    const hornMat = new THREE.MeshToonMaterial({ color: 0xeeeeee });

    const bodyGroup = new THREE.Group();
    this.group.add(bodyGroup);
    this.parts.body = bodyGroup;

    switch (this.type) {
      case 'MINOTAUR':
        this.createMinotaur(mainMat, eyeMat, hornMat);
        this.footOffset = 15;
        break;
      case 'CENTAUR':
        this.createCentaur(mainMat, eyeMat);
        this.footOffset = 12;
        break;
      case 'LION':
        this.createLion(mainMat, eyeMat);
        this.footOffset = 10;
        break;
      case 'GRIFFIN':
        this.createGriffin(mainMat, eyeMat);
        this.footOffset = 10;
        break;
    }
  }

  private createMinotaur(mat: THREE.Material, eyeMat: THREE.Material, hornMat: THREE.Material): void {
    const torso = new THREE.Mesh(new THREE.BoxGeometry(10, 12, 6), mat);
    this.addOutline(torso);
    this.parts.body.add(torso);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 4), mat);
    chest.position.set(0, 3, 2);
    this.addOutline(chest);
    this.parts.body.add(chest);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 8, 2);
    this.parts.body.add(headGroup);
    this.parts.head = headGroup;

    const head = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 8), mat);
    this.addOutline(head);
    headGroup.add(head);

    const eyeGeom = new THREE.BoxGeometry(1, 1, 1);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(2, 1, 4);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeR.position.set(-2, 1, 4);
    head.add(eyeR);

    const hornL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 1.5), hornMat);
    hornL.position.set(3, 4, 0);
    hornL.rotation.z = -0.5;
    this.addOutline(hornL);
    head.add(hornL);
    const hornR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 1.5), hornMat);
    hornR.position.set(-3, 4, 0);
    hornR.rotation.z = 0.5;
    this.addOutline(hornR);
    head.add(hornR);

    this.parts.legL = this.createHumanLeg(mat, -4, -6, 0);
    this.parts.legR = this.createHumanLeg(mat, 4, -6, 0);

    const armGeom = new THREE.BoxGeometry(3.5, 11, 3.5);
    const armL = new THREE.Mesh(armGeom, mat);
    armL.position.set(7, 1, 0);
    this.addOutline(armL);
    this.parts.body.add(armL);
    this.parts.armL = armL;

    const armR = new THREE.Mesh(armGeom, mat);
    armR.position.set(-7, 1, 0);
    this.addOutline(armR);
    this.parts.body.add(armR);
    this.parts.armR = armR;
  }

  private createCentaur(mat: THREE.Material, eyeMat: THREE.Material): void {
    const horseBody = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 16), mat);
    this.addOutline(horseBody);
    this.parts.body.add(horseBody);

    const humanTorso = new THREE.Mesh(new THREE.BoxGeometry(7, 10, 5), mat);
    humanTorso.position.set(0, 8, 6);
    this.addOutline(humanTorso);
    this.parts.body.add(humanTorso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), mat);
    head.position.set(0, 15, 6);
    this.addOutline(head);
    this.parts.body.add(head);
    this.parts.head = head;

    this.parts.legFL = this.createAnimalLeg(mat, -4, -4, 6);
    this.parts.legFR = this.createAnimalLeg(mat, 4, -4, 6);
    this.parts.legBL = this.createAnimalLeg(mat, -4, -4, -6);
    this.parts.legBR = this.createAnimalLeg(mat, 4, -4, -6);
  }

  private createLion(mat: THREE.Material, eyeMat: THREE.Material): void {
    const body = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 14), mat);
    this.addOutline(body);
    this.parts.body.add(body);

    const mane = new THREE.Mesh(new THREE.BoxGeometry(11, 11, 6), new THREE.MeshToonMaterial({ color: 0x795548 }));
    mane.position.set(0, 2, 6);
    this.addOutline(mane);
    this.parts.body.add(mane);

    const head = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), mat);
    head.position.set(0, 2, 9);
    this.addOutline(head);
    this.parts.body.add(head);
    this.parts.head = head;

    this.parts.legFL = this.createAnimalLeg(mat, -4, -4, 5);
    this.parts.legFR = this.createAnimalLeg(mat, 4, -4, 5);
    this.parts.legBL = this.createAnimalLeg(mat, -4, -4, -5);
    this.parts.legBR = this.createAnimalLeg(mat, 4, -4, -5);
  }

  private createGriffin(mat: THREE.Material, eyeMat: THREE.Material): void {
    this.createLion(mat, eyeMat);

    const wingGeom = new THREE.BoxGeometry(1, 15, 10);
    const wingMat = new THREE.MeshToonMaterial({ color: 0xffffff });
    
    const wingL = new THREE.Mesh(wingGeom, wingMat);
    wingL.position.set(5, 6, 0);
    wingL.rotation.z = -Math.PI / 4;
    this.addOutline(wingL);
    this.parts.body.add(wingL);
    this.parts.wingL = wingL;

    const wingR = new THREE.Mesh(wingGeom, wingMat);
    wingR.position.set(-5, 6, 0);
    wingR.rotation.z = Math.PI / 4;
    this.addOutline(wingR);
    this.parts.body.add(wingR);
    this.parts.wingR = wingR;

    const beak = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 4), new THREE.MeshToonMaterial({ color: 0xffd54f }));
    beak.position.set(0, 2, 12);
    this.addOutline(beak);
    this.parts.body.add(beak);
  }

  private createHumanLeg(mat: THREE.Material, x: number, y: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    this.group.add(group);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(3.5, 10, 3.5), mat);
    leg.position.y = -5;
    this.addOutline(leg);
    group.add(leg);
    return group;
  }

  private createAnimalLeg(mat: THREE.Material, x: number, y: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    this.group.add(group);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(2.5, 8, 2.5), mat);
    leg.position.y = -4;
    this.addOutline(leg);
    group.add(leg);
    return group;
  }

  private pickNewTarget(): void {
    const angle = Math.random() * Math.PI * 2;
    const dist = 1000 + Math.random() * 2000;
    this.targetPos.set(
      this.group.position.x + Math.cos(angle) * dist,
      0,
      this.group.position.z + Math.sin(angle) * dist
    );
    // Keep within world bounds (increased for better dispatching)
    this.targetPos.x = THREE.MathUtils.clamp(this.targetPos.x, -2500, 2500);
    this.targetPos.z = THREE.MathUtils.clamp(this.targetPos.z, -2500, 2500);

    this.isWalking = true;
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

  private updateGrounding(): void {
    const { height: groundY, normal } = this.getGroundHeightAndNormal(this.group.position.x, this.group.position.z);
    this.surfaceNormal.lerp(normal, 0.1);
    
    // Safety offset + scaled foot offset
    this.group.position.y = groundY + this.groundOffset + (this.footOffset * this.scale);

    const up = new THREE.Vector3(0, 1, 0);
    if (this.surfaceNormal.dot(up) < 0.99) {
        const axis = new THREE.Vector3().crossVectors(up, this.surfaceNormal).normalize();
        const angle = Math.acos(up.dot(this.surfaceNormal));
        this.targetRotation.setFromAxisAngle(axis, angle);
    } else {
        this.targetRotation.set(0, 0, 0, 1);
    }
  }

  public takeHit(position: THREE.Vector3): void {
    this.hitFlashTimer = 0.5;
    this.state = 'ALERT';
    this.stateTimer = 3;
    
    // Comic Sticker Effect
    new ComicSticker(this.scene, position.clone().add(new THREE.Vector3(0, 5 * this.scale, 0)));
    
    // Stronger knockback
    const dir = new THREE.Vector3().subVectors(this.group.position, position).normalize();
    this.group.position.add(dir.multiplyScalar(25));
    
    // Immediately pick a new target to flee
    this.pickNewTarget();
  }

  public getHitboxes(): { center: THREE.Vector3; radius: number }[] {
    const hitboxes: { center: THREE.Vector3; radius: number }[] = [];
    const baseRadius = this.hitboxRadius;

    // Body hitbox
    hitboxes.push({
      center: this.group.position.clone().add(new THREE.Vector3(0, 4 * this.scale, 0)),
      radius: baseRadius
    });

    // Head hitbox
    if (this.parts.head) {
      const headPos = new THREE.Vector3();
      this.parts.head.getWorldPosition(headPos);
      hitboxes.push({
        center: headPos,
        radius: baseRadius * 0.8
      });
    }

    // Legs hitboxes
    ['legL', 'legR', 'legFL', 'legFR', 'legBL', 'legBR'].forEach(l => {
        if (this.parts[l]) {
            const pos = new THREE.Vector3();
            this.parts[l].getWorldPosition(pos);
            hitboxes.push({ center: pos, radius: baseRadius * 0.7 });
        }
    });

    // Wings hitboxes for Griffin
    if (this.type === 'GRIFFIN') {
        if (this.parts.wingL) {
            const pos = new THREE.Vector3();
            this.parts.wingL.getWorldPosition(pos);
            hitboxes.push({ center: pos, radius: baseRadius * 1.2 });
        }
        if (this.parts.wingR) {
            const pos = new THREE.Vector3();
            this.parts.wingR.getWorldPosition(pos);
            hitboxes.push({ center: pos, radius: baseRadius * 1.2 });
        }
    }

    return hitboxes;
  }

  public update(time: number, delta: number, playerPos?: THREE.Vector3): void {
    if (playerPos) {
      const distToPlayer = this.group.position.distanceTo(playerPos);
      if (distToPlayer < 150 && this.state !== 'ALERT') {
        this.state = 'ALERT';
      } else if (distToPlayer > 250 && this.state === 'ALERT') {
        this.state = 'WANDER';
      }
    }

    // Always moving logic
    const dx = this.targetPos.x - this.group.position.x;
    const dz = this.targetPos.z - this.group.position.z;
    const distSq = dx * dx + dz * dz;

    if (distSq < 100) {
      this.pickNewTarget();
    }

    // Rotation
    let angleDiff = this.rotationTarget - this.group.rotation.y;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.group.rotation.y += angleDiff * delta * 2;

    const moveSpeed = this.speed * 40 * delta;
    this.group.position.x += Math.sin(this.group.rotation.y) * moveSpeed;
    this.group.position.z += Math.cos(this.group.rotation.y) * moveSpeed;

    this.updateGrounding();

    // Apply slope tilting to the body
    if (this.parts.body) {
        this.parts.body.quaternion.slerp(this.targetRotation, 0.1);
    }

    // Hit Flash Logic
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      const flash = Math.sin(this.hitFlashTimer * 40) > 0;
      this.group.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshToonMaterial) {
          if (flash) {
            if (!this.originalColors.has(child)) this.originalColors.set(child, child.material.color.clone());
            child.material.color.set(0xffffff);
          } else {
            const orig = this.originalColors.get(child);
            if (orig) child.material.color.copy(orig);
          }
        }
      });
      if (this.hitFlashTimer <= 0) {
        this.group.traverse(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshToonMaterial) {
            const orig = this.originalColors.get(child);
            if (orig) child.material.color.copy(orig);
          }
        });
      }
    }

    // Animations
    const animScale = 1 + Math.sin(time * 2) * 0.02;
    this.parts.body.scale.set(animScale, animScale, animScale);

    if (this.parts.head) {
        this.parts.head.rotation.y = Math.sin(time * 0.5) * 0.2;
    }

    const walkCycle = time * 8 * this.speed;
    const amp = 0.5;
    
    if (this.type === 'MINOTAUR') {
      this.parts.legL.rotation.x = Math.sin(walkCycle) * amp;
      this.parts.legR.rotation.x = Math.sin(walkCycle + Math.PI) * amp;
      this.parts.armL.rotation.x = -Math.sin(walkCycle) * amp;
      this.parts.armR.rotation.x = -Math.sin(walkCycle + Math.PI) * amp;
    } else {
      ['legFL', 'legBR'].forEach(l => { if(this.parts[l]) this.parts[l].rotation.x = Math.sin(walkCycle) * amp; });
      ['legFR', 'legBL'].forEach(l => { if(this.parts[l]) this.parts[l].rotation.x = Math.sin(walkCycle + Math.PI) * amp; });
    }

    if (this.type === 'GRIFFIN' && this.parts.wingL && this.parts.wingR) {
        const wingFreq = 10;
        const wingAmp = 0.8;
        this.parts.wingL.rotation.z = -Math.PI/4 - Math.sin(time * wingFreq) * wingAmp;
        this.parts.wingR.rotation.z = Math.PI/4 + Math.sin(time * wingFreq) * wingAmp;
    }
  }

  public dispose(): void {
    this.group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      }
    });
    this.scene.remove(this.group);
  }
}
