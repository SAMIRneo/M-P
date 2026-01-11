import * as THREE from 'three';
import gsap from 'gsap';
import { Terrain } from '../environment/Terrain';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Player {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  terrain: Terrain;
  biomes: any[]; 
  group: THREE.Group;
    visualGroup: THREE.Group;
    shakeOffset: THREE.Vector3 = new THREE.Vector3();
    
      // Physics & Movement
    speed: number = 55;
    walkSpeed: number = 30;
    turnSpeed: number = 4.0; // Slightly faster turning
    isMoving: boolean = false;
    _isOnFoot: boolean = false;
    isFirstPerson: boolean = false;
    isAttacking: boolean = false;
    currentMoveSpeed: number = 0;
    
    // Jump & Velocity Physics
    velocity: THREE.Vector3 = new THREE.Vector3();
    horizontalVelocity: THREE.Vector3 = new THREE.Vector3();
    friction: number = 0.96; // Better glide
    acceleration: number = 220; // More responsive
    gravity: number = -140; // More weight
    jumpForce: number = 48;
    isGrounded: boolean = true;

    // Camera stability
    private cameraYaw: number = 0;
    private targetCameraYaw: number = 0;

    get isOnFoot() { return this._isOnFoot; }
    set isOnFoot(val: boolean) {
      if (this._isOnFoot === val) return;
      this._isOnFoot = val;
      this.animateHoverboardTransition();
    }
    
    keys: { forward: boolean; backward: boolean; left: boolean; right: boolean; boost: boolean; jump: boolean };

  
  // Model Parts (Modern Minecraft Style - Chunkier)
  hoverboard!: THREE.Group;
  torsoGroup!: THREE.Group;
  neckGroup!: THREE.Group;
  headGroup!: THREE.Group;
  
    // Articulated limbs
    leftArmGroup!: THREE.Group;
    rightArmGroup!: THREE.Group;
    leftForearm!: THREE.Group;
    rightForearm!: THREE.Group;
    
    // Optimized members for performance
    private shootRaycaster: THREE.Raycaster = new THREE.Raycaster();
    private bulletOrigin: THREE.Vector3 = new THREE.Vector3();
    private bulletDir: THREE.Vector3 = new THREE.Vector3();
    private bulletGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 6);
    private bulletMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    private trailGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.1, 0.1, 4.0);
    private trailMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    private bulletPool: THREE.Group[] = [];
    
    leftLegGroup!: THREE.Group;
  rightLegGroup!: THREE.Group;
  leftCalf!: THREE.Group;
  rightCalf!: THREE.Group;
  
  // FPS Parts
  fpsGroup!: THREE.Group;
  fpsRightArm!: THREE.Group;
  fpsLeftArm!: THREE.Group;
  swayGroup!: THREE.Group;
    fpsSwordHolder!: THREE.Group;
    tpsSwordHolder!: THREE.Group;
    fpsAK47Holder!: THREE.Group;
    tpsAK47Holder!: THREE.Group;
    currentWeaponSlot: number = 1; 
    isFiring: boolean = false;
    lastFireTime: number = 0;
    fireRate: number = 0.12; 
    bullets: any[] = [];
    slashEffect!: THREE.Mesh;
    tpsMuzzleFlash!: THREE.Group;
    fpsMuzzleFlash!: THREE.Group;

    // Standard Coordinates:
    fpsRightArmRestPos: THREE.Vector3 = new THREE.Vector3(0.8, -0.7, -0.6);
    fpsLeftArmRestPos: THREE.Vector3 = new THREE.Vector3(-0.8, -0.7, -0.6);
    fpsArmsRestRot: THREE.Euler = new THREE.Euler(-0.25, 0, 0);

  
    // VFX
    comicParticles: any[] = [];
    flameGroup: THREE.Group = new THREE.Group();
    
    // Ground Contact & Slope
    private groundOffset: number = 0.5;
    private surfaceNormal: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    private targetVisualRotation: THREE.Quaternion = new THREE.Quaternion();
    private visualY: number = 50;
    private hoverY: number = 0;
    private currentLocalY: number = 0;

    // Collision
    raycaster: THREE.Raycaster;
    downVector: THREE.Vector3;
    terrainHeight: number = 15;
    collidables: any[] = [];
    monsters: any[] = []; 
    currentBiome: string | null = null;
    
    materials: any;
  controls?: OrbitControls;
  
  // Event Listeners
  onKeyDown: (e: KeyboardEvent) => void;
  onKeyUp: (e: KeyboardEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseDown: (e: MouseEvent) => void;
  onBlur: () => void;

  sway: { targetX: number; targetY: number; currentX: number; currentY: number };
  euler: THREE.Euler;
  PI_2: number = Math.PI / 2;
  
  scarfParts?: THREE.Mesh[];

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, terrain: Terrain, biomes: any[] = []) {
    this.scene = scene;
    this.camera = camera;
    this.terrain = terrain;
    this.biomes = biomes;
    
    this.group = new THREE.Group();
    this.group.position.set(0, 50, 0);
    this.visualY = 50;
    this.scene.add(this.group);

    this.visualGroup = new THREE.Group();
    this.visualGroup.rotation.y = 0; 
    this.group.add(this.visualGroup);

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      boost: false,
      jump: false
    };

    this.initMaterials();
    this.initModel();
    this.initAccessories();
    
    if (this.hoverboard) {
        this.hoverboard.add(this.flameGroup);
    }
    
    this.onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
    this.onKeyUp = (e: KeyboardEvent) => this.handleKeyUp(e);
    this.onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
    this.onMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
    this.onBlur = () => this.handleBlur();

    this.initControls();
    this.initFlames();

    this.raycaster = new THREE.Raycaster();
    this.downVector = new THREE.Vector3(0, -1, 0);
    
    this.sway = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

    this.visualGroup.visible = true;
    if (this.fpsGroup) this.fpsGroup.visible = false;
  }

  getGroundHeightAndNormal(x: number, z: number) {
    if (!this.terrain) return { height: 0, normal: new THREE.Vector3(0, 1, 0) };

    const sampleDist = 2.5;
    const hCenter = this.terrain.getHeightAt(x, z);
    
    // 4-point sampling for better stability
    const hF = this.terrain.getHeightAt(x, z - sampleDist);
    const hB = this.terrain.getHeightAt(x, z + sampleDist);
    const hL = this.terrain.getHeightAt(x - sampleDist, z);
    const hR = this.terrain.getHeightAt(x + sampleDist, z);

    const normal = new THREE.Vector3(hL - hR, 2 * sampleDist, hF - hB).normalize();

    return { height: hCenter, normal };
  }

  getSmoothGroundHeightAndNormal(x: number, z: number) {
    if (!this.terrain) return { height: 0, normal: new THREE.Vector3(0, 1, 0) };

    const sampleDist = 2.5;
    // Use getRawHeightAt for physics to avoid staircase jitter
    const hCenter = (this.terrain as any).getRawHeightAt ? (this.terrain as any).getRawHeightAt(x, z) : this.terrain.getHeightAt(x, z);
    
    const hF = (this.terrain as any).getRawHeightAt ? (this.terrain as any).getRawHeightAt(x, z - sampleDist) : this.terrain.getHeightAt(x, z - sampleDist);
    const hB = (this.terrain as any).getRawHeightAt ? (this.terrain as any).getRawHeightAt(x, z + sampleDist) : this.terrain.getHeightAt(x, z + sampleDist);
    const hL = (this.terrain as any).getRawHeightAt ? (this.terrain as any).getRawHeightAt(x - sampleDist, z) : this.terrain.getHeightAt(x - sampleDist, z);
    const hR = (this.terrain as any).getRawHeightAt ? (this.terrain as any).getRawHeightAt(x + sampleDist, z) : this.terrain.getHeightAt(x + sampleDist, z);

    const normal = new THREE.Vector3(hL - hR, 2 * sampleDist, hF - hB).normalize();

    return { height: hCenter, normal };
  }

  initControls() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

    animateHoverboardTransition() {
    if (!this.hoverboard) return;
    
    if (this._isOnFoot) {
      gsap.to(this.hoverboard.scale, { x: 0, y: 0, z: 0, duration: 0.3, ease: "back.in(1.5)" });
      gsap.to(this.hoverboard.position, { y: -2.5, duration: 0.3 });
      } else {
        this.hoverboard.scale.set(0, 0, 0);
        this.hoverboard.position.y = -2.5;
        gsap.to(this.hoverboard.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: "back.out(1.7)" });
        gsap.to(this.hoverboard.position, { y: -1.5, duration: 0.4 });
      }
    }

    handleKeyDown(e: KeyboardEvent) {
      switch (e.code) {
        case 'KeyZ': case 'KeyW': this.keys.forward = true; break;
        case 'KeyS': this.keys.backward = true; break;
        case 'KeyQ': case 'KeyA': this.keys.left = true; break;
        case 'KeyD': this.keys.right = true; break;
        case 'Space': 
          this.keys.jump = true; 
          if (this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
          }
          break;
          case 'KeyR': this.isOnFoot = !this.isOnFoot; break;
          case 'KeyC': this.togglePOV(); break;
        }
      }

      switchWeapon(slot: number) {
        if (this.currentWeaponSlot === slot) return;
        this.isFiring = false;
        this.currentWeaponSlot = slot;
        
        const holders = [
          { holder: this.fpsSwordHolder, id: 1 },
          { holder: this.fpsAK47Holder, id: 2 },
          { holder: this.tpsSwordHolder, id: 1 },
          { holder: this.tpsAK47Holder, id: 2 }
        ];

        holders.forEach(({ holder, id }) => {
          if (holder) {
            holder.visible = (slot === id);
            if (slot === id) {
              holder.scale.set(1, 1, 1);
              gsap.from(holder.scale, {
                x: 0, y: 0, z: 0, 
                duration: 0.35, 
                ease: "back.out(1.7)"
              });
            }
          }
        });
      }

    handleKeyUp(e: KeyboardEvent) {
      switch (e.code) {
        case 'KeyZ': case 'KeyW': this.keys.forward = false; break;
        case 'KeyS': this.keys.backward = false; break;
        case 'KeyQ': case 'KeyA': this.keys.left = false; break;
        case 'KeyD': this.keys.right = false; break;
        case 'Space': this.keys.jump = false; break;
      }
    }

  handleMouseMove(e: MouseEvent) {
    if (!this.isFirstPerson || !document.pointerLockElement) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    this.euler.y -= movementX * 0.0012;
    this.euler.x -= movementY * 0.0012;
    this.euler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.euler.x));

    this.sway.targetX = -movementX * 0.0005;
    this.sway.targetY = movementY * 0.0005;
  }

  handleMouseDown(e: MouseEvent) {
    if (e.button === 0) { 
      if (this.currentWeaponSlot === 1) {
        this.performAttack();
      } else {
        this.isFiring = true;
        const onMouseUp = (upEvent: MouseEvent) => {
          if (upEvent.button === 0) {
            this.isFiring = false;
            window.removeEventListener('mouseup', onMouseUp);
          }
        };
        window.addEventListener('mouseup', onMouseUp);
      }
    } else if (e.button === 2) {
      this.keys.boost = true;
      const onMouseUp = (upEvent: MouseEvent) => {
        if (upEvent.button === 2) {
          this.keys.boost = false;
          window.removeEventListener('mouseup', onMouseUp);
        }
      };
      window.addEventListener('mouseup', onMouseUp);
    }
  }

  handleBlur() {
    this.keys.forward = false;
    this.keys.backward = false;
    this.keys.left = false;
    this.keys.right = false;
    this.keys.boost = false;
    this.keys.jump = false;
  }

  setCollidables(collidables: any[]) {
    this.collidables = collidables;
  }

  checkCollisions(nextPos: THREE.Vector3) {
    const playerRadius = 3.5;
    let collisionInfo = null;

    for (const sphere of this.collidables) {
      const dx = nextPos.x - sphere.x;
      const dz = nextPos.z - sphere.z;
      const distSq = dx * dx + dz * dz;
      const minDist = playerRadius + sphere.radius;
      
      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const normal = new THREE.Vector3(dx / dist, 0, dz / dist);
        const depth = minDist - dist;
        
        const currentDx = this.group.position.x - sphere.x;
        const currentDz = this.group.position.z - sphere.z;
        const currentDistSq = currentDx * currentDx + currentDz * currentDz;
        
        if (distSq > currentDistSq) continue;

        if (!collisionInfo || depth > collisionInfo.depth) {
          collisionInfo = { normal, depth };
        }
      }
    }
    return collisionInfo;
  }

    initMaterials() {
      this.materials = {
        suit: new THREE.MeshToonMaterial({ color: 0x0c0c0c }), // Sleek Obsidian
        skin: new THREE.MeshToonMaterial({ color: 0xffd180 }), 
        armor: new THREE.MeshToonMaterial({ 
          color: 0xffd700, // Royal Gold
          emissive: 0xffd700,
          emissiveIntensity: 0.2
        }), 
        visor: new THREE.MeshToonMaterial({ 
          color: 0x00f2ff, // Electric Cyan
          transparent: true, 
          opacity: 0.9,
          emissive: 0x00f2ff,
          emissiveIntensity: 5.0
        }),
        pack: new THREE.MeshToonMaterial({ color: 0x1a1a1a }), 
        neon: new THREE.MeshBasicMaterial({ color: 0x00f2ff }), 
        metal: new THREE.MeshToonMaterial({ color: 0x546e7a }),
        accent: new THREE.MeshBasicMaterial({ color: 0xffd700 }), 
        outline: new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }),
        board: new THREE.MeshToonMaterial({ color: 0x0a0a0a }), // Obsidian Board
        boardAccent: new THREE.MeshToonMaterial({ 
          color: 0xffd700, 
          emissive: 0xffd700,
          emissiveIntensity: 2.5
        }), 
        boardCrystal: new THREE.MeshToonMaterial({ 
          color: 0x00f2ff, 
          transparent: true, 
          opacity: 0.95,
          emissive: 0x00f2ff,
          emissiveIntensity: 6.0
        }),
        comicWhite: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
        comicYellow: new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.85 }), 
        comicOrange: new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.8 }), 
  
        boots: new THREE.MeshToonMaterial({ color: 0xffd700 }), 
        fpsWhite: new THREE.MeshBasicMaterial({ color: 0xffffff }), 
        swordBlade: new THREE.MeshToonMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.5 }), // Neon Magenta Blade
        swordGuard: new THREE.MeshToonMaterial({ color: 0xffd700 }), 
        swordHandle: new THREE.MeshToonMaterial({ color: 0x000000 }),
        eye: new THREE.MeshBasicMaterial({ color: 0x00f2ff }),
        belt: new THREE.MeshToonMaterial({ color: 0xffd700 }),
        scarf: new THREE.MeshToonMaterial({ color: 0x00f2ff }), // Cyan Scarf
        vvsDiamond: new THREE.MeshToonMaterial({ 
          color: 0x00ffff, 
          emissive: 0x00ffff, 
          emissiveIntensity: 3.0,
          transparent: true,
          opacity: 0.9
        }),
        spacialMetal: new THREE.MeshToonMaterial({ 
          color: 0x0a0a0a, 
          emissive: 0xff00ff, 
          emissiveIntensity: 0.8 
        }),
        akGold: new THREE.MeshToonMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.5 }),
        akWood: new THREE.MeshToonMaterial({ color: 0x212121 }), // Dark Polymer instead of wood for pro look
      };
    }

  initAccessories() {
    this.scarfParts = [];
    const scarfCount = 5;
    for (let i = 0; i < scarfCount; i++) {
        const part = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.5, 1.4),
            this.materials.scarf
        );
        this.addOutline(part, 0.1);
        part.position.set(0, 1.8 - i * 0.3, -1.2 - i * 0.4);
        this.torsoGroup.add(part);
        this.scarfParts.push(part);
    }
  }

  addOutline(mesh: THREE.Mesh, thickness: number = 0.05) {
    const outline = mesh.clone();
    outline.material = this.materials.outline;
    outline.scale.multiplyScalar(1 + thickness);
    mesh.add(outline);
    return mesh;
  }

  // Frame-rate independent exponential smoothing
  private expLerp(current: number, target: number, speed: number, delta: number): number {
    return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
  }

  private expSlerp(current: THREE.Quaternion, target: THREE.Quaternion, speed: number, delta: number): THREE.Quaternion {
    return current.slerp(target, 1 - Math.exp(-speed * delta));
  }

  private expLerpVec3(current: THREE.Vector3, target: THREE.Vector3, speed: number, delta: number): THREE.Vector3 {
    return current.lerp(target, 1 - Math.exp(-speed * delta));
  }

  createLimbSegment(width: number, height: number, material: THREE.Material, outlineThickness: number = 0.08) {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, width),
      material
    );
    mesh.position.y = -height / 2;
    this.addOutline(mesh, outlineThickness);
    group.add(mesh);
    return group;
  }

    createComicSword(scale: number = 1.0) {
      const sword = new THREE.Group();
      sword.scale.setScalar(scale);
  
      const bladeMain = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 5.5, 0.3),
        this.materials.swordBlade
      );
      bladeMain.position.y = 3.5;
      this.addOutline(bladeMain, 0.12);
      sword.add(bladeMain);
  
      const guardBase = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 0.8, 0.8),
        this.materials.swordGuard
      );
      guardBase.position.y = 0.8;
      this.addOutline(guardBase, 0.15);
      sword.add(guardBase);

      // Exotic Glow Ring on Guard
      const guardRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.8, 0.1, 8, 16),
        this.materials.boardCrystal
      );
      guardRing.position.set(0, 0.8, 0);
      guardRing.rotation.x = Math.PI / 2;
      sword.add(guardRing);
  
      const jewel = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5),
        this.materials.boardCrystal
      );
      jewel.position.set(0, 0.8, 0);
      sword.add(jewel);
  
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 2.0, 0.6),
        this.materials.swordHandle
      );
      handle.position.y = -0.4;
      this.addOutline(handle, 0.1);
      sword.add(handle);
  
      const pommel = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.6, 1.0),
        this.materials.swordGuard
      );
      pommel.position.y = -1.5;
      this.addOutline(pommel, 0.1);
      sword.add(pommel);
  
      return sword;
    }
  
    createAK47VVS(scale: number = 1.0) {
      const ak = new THREE.Group();
      ak.scale.setScalar(scale);
  
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.2, 4.0),
        this.materials.spacialMetal
      );
      this.addOutline(body, 0.12);
      ak.add(body);

      // Exotic Neon Line on Body
      const neonLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.1, 3.5),
        this.materials.neon
      );
      neonLine.position.set(0, 0.2, 0);
      ak.add(neonLine);
  
      const cover = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.4, 3.8),
        this.materials.vvsDiamond
      );
      cover.position.y = 0.7;
      this.addOutline(cover, 0.1);
      ak.add(cover);
  
      const barrel = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 3.0),
        this.materials.akGold
      );
      barrel.position.set(0, 0.4, -3.2);
      this.addOutline(barrel, 0.1);
      ak.add(barrel);
  
      const muzzle = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.6),
        this.materials.vvsDiamond
      );
      muzzle.position.z = -4.8;
      muzzle.position.y = 0.4;
      this.addOutline(muzzle, 0.1);
      ak.add(muzzle);
  
      const handguard = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.9, 2.0),
        this.materials.akWood
      );
      handguard.position.set(0, 0.1, -1.5);
      this.addOutline(handguard, 0.1);
      ak.add(handguard);
  
      const magGroup = new THREE.Group();
      magGroup.position.set(0, -1.0, -0.5);
      ak.add(magGroup);
  
      const magTop = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.8), this.materials.akGold);
      magTop.rotation.x = -0.3;
      this.addOutline(magTop, 0.1);
      magGroup.add(magTop);
  
      const magBottom = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.8), this.materials.vvsDiamond);
      magBottom.position.set(0, -0.8, -0.4);
      magBottom.rotation.x = -0.6;
      this.addOutline(magBottom, 0.1);
      magGroup.add(magBottom);
  
      const grip = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 1.5, 0.8),
        this.materials.akWood
      );
      grip.position.set(0, -1.0, 1.2);
      grip.rotation.x = 0.3;
      this.addOutline(grip, 0.1);
      ak.add(grip);
  
      const stock = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 1.2, 2.5),
        this.materials.akWood
      );
      stock.position.set(0, -0.2, 3.0);
      stock.rotation.x = 0.1;
      this.addOutline(stock, 0.1);
      ak.add(stock);
  
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), this.materials.vvsDiamond);
      diamond.position.set(0, -0.2, 3.5);
      ak.add(diamond);
  
      return ak;
    }

  initFlames() {
    this.comicParticles = [];
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
      const lineGeo = new THREE.BoxGeometry(0.1, 0.1, 4 + Math.random() * 6);
      const line = new THREE.Mesh(lineGeo, this.materials.comicWhite);
      line.visible = false;
      this.flameGroup.add(line);
      
      const starGeo = Math.random() > 0.5 ? new THREE.OctahedronGeometry(0.5, 0) : new THREE.CircleGeometry(0.6, 6);
      const color = i % 3 === 0 ? 0x00ffff : (i % 3 === 1 ? 0xff00ff : 0xffff00);
      const star = new THREE.Mesh(starGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 }));
      star.visible = false;
      this.flameGroup.add(star);
      
      this.comicParticles.push({
        line,
        star,
        active: false,
        timer: 0,
        speed: 60 + Math.random() * 40,
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 2,
          -2 
        )
      });
    }
  }

  updateFlames(time: number, isBoosting: boolean) {
    this.comicParticles.forEach((p) => {
      if (isBoosting) {
        if (!p.active || p.timer > 1) {
          p.active = true;
          p.timer = 0;
          p.line.visible = true;
          p.star.visible = true;
          p.line.position.copy(p.offset);
          p.star.position.copy(p.offset);
          p.line.scale.set(1, 1, 1);
          p.star.scale.set(1, 1, 1);
        }
        
        p.timer += 0.05;
        const t = p.timer;
        
        p.line.position.z = p.offset.z - t * p.speed;
        p.star.position.z = p.offset.z - t * p.speed * 0.8;
        
        const scale = 1 - t;
        p.line.scale.z = scale * 2.0;
        p.star.scale.set(scale, scale, scale);
        p.star.rotation.z += 0.15;
        
        if (p.line.material instanceof THREE.Material) p.line.material.opacity = (1 - t) * 0.9;
        if (p.star.material instanceof THREE.Material) p.star.material.opacity = (1 - t) * 0.8;
      } else {
        p.active = false;
        p.line.visible = false;
        p.star.visible = false;
        p.timer = 2;
      }
    });
  }

    initModel() {
      const torsoWidth = 5.2;
      const torsoHeight = 7.0;
      const torsoDepth = 3.6;
      const armWidth = 2.0;
      const armHeight = 6.0;
      const legWidth = 2.2;
      const legHeight = 6.4;
      const headSize = 4.2;
  
      this.torsoGroup = new THREE.Group();
      this.torsoGroup.position.y = legHeight + torsoHeight / 2; 
      this.visualGroup.add(this.torsoGroup);
  
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(torsoWidth, torsoHeight, torsoDepth),
        this.materials.suit
      );
      this.addOutline(torso, 0.12);
      this.torsoGroup.add(torso);
  
      const jacket = new THREE.Mesh(
        new THREE.BoxGeometry(torsoWidth + 0.5, torsoHeight * 0.8, torsoDepth + 0.5),
        this.materials.armor
      );
      jacket.position.y = 0.5;
      this.addOutline(jacket, 0.1);
      this.torsoGroup.add(jacket);

      // --- NEW PRO DETAILS ---
      // Power Core on Back
      const powerCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.5),
        this.materials.boardCrystal
      );
      powerCore.position.set(0, 0, -torsoDepth/2 - 0.5);
      this.torsoGroup.add(powerCore);

      const coreRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.2, 8, 16),
        this.materials.boardAccent
      );
      coreRing.position.set(0, 0, -torsoDepth/2 - 0.5);
      coreRing.rotation.x = Math.PI / 2;
      this.torsoGroup.add(coreRing);

      // Belt Buckle
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.5), this.materials.boardAccent);
      buckle.position.set(0, -2.6, torsoDepth/2 + 0.3);
      this.torsoGroup.add(buckle);
      // -----------------------
  
      const belt = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth + 0.6, 1.0, torsoDepth + 0.6), this.materials.belt);
      belt.position.y = -2.6;
      this.torsoGroup.add(belt);
  
      this.neckGroup = new THREE.Group();
      this.neckGroup.position.y = torsoHeight / 2; 
      this.torsoGroup.add(this.neckGroup);
  
      const neck = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.6), this.materials.suit);
      this.neckGroup.add(neck);
  
      this.headGroup = new THREE.Group();
      this.headGroup.position.y = 1.0; 
      this.neckGroup.add(this.headGroup);
  
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(headSize, headSize, headSize),
        this.materials.suit
      );
      this.addOutline(head, 0.15);
      this.headGroup.add(head);
  
      const hair = new THREE.Mesh(
        new THREE.BoxGeometry(headSize + 0.4, headSize * 0.5, headSize + 0.4),
        this.materials.armor
      );
      hair.position.y = headSize * 0.3;
      this.addOutline(hair, 0.1);
      this.headGroup.add(hair);
  
      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(headSize - 0.2, 1.8, 0.3),
        this.materials.visor
      );
      visor.position.set(0, 0.4, headSize / 2);
      this.headGroup.add(visor);
  
      this.leftArmGroup = new THREE.Group();
      this.leftArmGroup.position.set(torsoWidth / 2 + armWidth / 2, torsoHeight / 2 - 1.5, 0);
      this.torsoGroup.add(this.leftArmGroup);

      // Shoulder Pauldron Left
      const pauldronL = new THREE.Mesh(new THREE.BoxGeometry(armWidth + 1.2, 1.5, armWidth + 1.2), this.materials.armor);
      pauldronL.position.y = 0.5;
      this.addOutline(pauldronL, 0.1);
      this.leftArmGroup.add(pauldronL);
  
      const leftUpperArm = this.createLimbSegment(armWidth, armHeight / 2, this.materials.suit, 0.1);
      this.leftArmGroup.add(leftUpperArm);
  
      this.leftForearm = this.createLimbSegment(armWidth - 0.1, armHeight / 2, this.materials.suit, 0.1);
      this.leftForearm.position.y = -armHeight / 2;
      leftUpperArm.add(this.leftForearm);
  
      const gloveL = new THREE.Mesh(new THREE.BoxGeometry(armWidth + 0.4, 1.4, armWidth + 0.4), this.materials.boots);
      gloveL.position.y = -armHeight / 2;
      this.leftForearm.add(gloveL);
  
      this.rightArmGroup = new THREE.Group();
      this.rightArmGroup.position.set(-(torsoWidth / 2 + armWidth / 2), torsoHeight / 2 - 1.5, 0);
      this.torsoGroup.add(this.rightArmGroup);

      // Shoulder Pauldron Right
      const pauldronR = new THREE.Mesh(new THREE.BoxGeometry(armWidth + 1.2, 1.5, armWidth + 1.2), this.materials.armor);
      pauldronR.position.y = 0.5;
      this.addOutline(pauldronR, 0.1);
      this.rightArmGroup.add(pauldronR);
  
      const rightUpperArm = this.createLimbSegment(armWidth, armHeight / 2, this.materials.suit, 0.1);
      this.rightArmGroup.add(rightUpperArm);
  
      this.rightForearm = this.createLimbSegment(armWidth - 0.1, armHeight / 2, this.materials.suit, 0.1);
      this.rightForearm.position.y = -armHeight / 2;
      rightUpperArm.add(this.rightForearm);
  
      const gloveR = new THREE.Mesh(new THREE.BoxGeometry(armWidth + 0.4, 1.4, armWidth + 0.4), this.materials.boots);
      gloveR.position.y = -armHeight / 2;
      this.rightForearm.add(gloveR);
  
      this.tpsSwordHolder = new THREE.Group();
      this.tpsSwordHolder.position.set(0, -armHeight / 2, 0);
      this.tpsSwordHolder.rotation.set(1.2, 0, 0.6);
      this.rightForearm.add(this.tpsSwordHolder);
      
      const tpsSword = this.createComicSword(1.8);
      this.tpsSwordHolder.add(tpsSword);
  
      this.tpsAK47Holder = new THREE.Group();
      this.tpsAK47Holder.position.set(0, -armHeight / 2, 0);
      this.tpsAK47Holder.rotation.set(0, Math.PI, 0); // Corrected orientation: pointing forward
      this.tpsAK47Holder.visible = false;
      this.rightForearm.add(this.tpsAK47Holder);
  
      const tpsAK = this.createAK47VVS(2.2);
      tpsAK.position.set(0, -0.4, 1.2); 
      this.tpsAK47Holder.add(tpsAK);
  
      this.tpsMuzzleFlash = this.createMuzzleFlashEffect();
      this.tpsMuzzleFlash.position.set(0, 0.4, -4.8);
      this.tpsMuzzleFlash.visible = false;
      this.tpsAK47Holder.add(this.tpsMuzzleFlash);
  
      this.leftLegGroup = new THREE.Group();
      this.leftLegGroup.position.set(torsoWidth / 4 + 0.3, -torsoHeight / 2, 0);
      this.torsoGroup.add(this.leftLegGroup);
  
      const leftUpperLeg = this.createLimbSegment(legWidth, legHeight / 2, this.materials.suit, 0.1);
      this.leftLegGroup.add(leftUpperLeg);
  
      this.leftCalf = this.createLimbSegment(legWidth - 0.1, legHeight / 2, this.materials.suit, 0.1);
      this.leftCalf.position.y = -legHeight / 2;
      leftUpperLeg.add(this.leftCalf);
  
      const bootL = new THREE.Mesh(new THREE.BoxGeometry(legWidth + 0.5, 1.6, legWidth + 1.0), this.materials.boots);
      bootL.position.y = -legHeight / 2;
      bootL.position.z = 0.4;
      this.leftCalf.add(bootL);
  
      this.rightLegGroup = new THREE.Group();
      this.rightLegGroup.position.set(-(torsoWidth / 4 + 0.3), -torsoHeight / 2, 0);
      this.torsoGroup.add(this.rightLegGroup);
  
      const rightUpperLeg = this.createLimbSegment(legWidth, legHeight / 2, this.materials.suit, 0.1);
      this.rightLegGroup.add(rightUpperLeg);
  
      this.rightCalf = this.createLimbSegment(legWidth - 0.1, legHeight / 2, this.materials.suit, 0.1);
      this.rightCalf.position.y = -legHeight / 2;
      rightUpperLeg.add(this.rightCalf);
  
      const bootR = new THREE.Mesh(new THREE.BoxGeometry(legWidth + 0.5, 1.6, legWidth + 1.0), this.materials.boots);
      bootR.position.y = -legHeight / 2;
      bootR.position.z = 0.4;
      this.rightCalf.add(bootR);
  
      this.hoverboard = new THREE.Group();
      this.hoverboard.position.y = -1.5; 
      this.visualGroup.add(this.hoverboard);
  
      const boardBase = new THREE.Mesh(
        new THREE.BoxGeometry(7.0, 0.7, 12.0),
        this.materials.board
      );
      this.addOutline(boardBase, 0.15);
      this.hoverboard.add(boardBase);
  
      const frontTip = new THREE.Mesh(
        new THREE.BoxGeometry(5.0, 0.6, 3.5),
        this.materials.board
      );
      frontTip.position.set(0, -0.02, 6.0);
      this.addOutline(frontTip, 0.1);
      this.hoverboard.add(frontTip);
  
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.2, 13.0),
        this.materials.boardAccent
      );
      stripe.position.set(0, 0.4, 0.5);
      this.hoverboard.add(stripe);
  
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.2),
        this.materials.boardCrystal
      );
      core.position.set(0, 0, -3.5);
      this.hoverboard.add(core);
  
      const thrusterBase = new THREE.Mesh(
        new THREE.BoxGeometry(5.0, 1.8, 2.5),
        this.materials.metal
      );
      thrusterBase.position.set(0, -0.6, -6.0);
      this.addOutline(thrusterBase, 0.1);
      this.hoverboard.add(thrusterBase);
  
      this.group.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
  
      this.initFPSViewModel();
    }

  initFPSViewModel() {
    this.fpsGroup = new THREE.Group();
    this.scene.add(this.fpsGroup);
    this.fpsGroup.visible = false;

    this.swayGroup = new THREE.Group();
    this.fpsGroup.add(this.swayGroup);

    const armWidth = 0.7; 
    const armHeight = 0.7;
    const armLength = 1.6;
    const armGeo = new THREE.BoxGeometry(armWidth, armHeight, armLength);
    const gloveGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8); 

    this.fpsRightArm = new THREE.Group();
    this.fpsRightArm.position.copy(this.fpsRightArmRestPos);
    this.fpsRightArm.rotation.copy(this.fpsArmsRestRot);
    this.swayGroup.add(this.fpsRightArm);

    const rightArmMesh = new THREE.Mesh(armGeo, this.materials.suit);
    rightArmMesh.position.set(0, 0, -armLength / 2);
    rightArmMesh.frustumCulled = false;
    this.addOutline(rightArmMesh, 0.08);
    this.fpsRightArm.add(rightArmMesh);

    const rightGloveMesh = new THREE.Mesh(gloveGeo, this.materials.boots);
    rightGloveMesh.position.set(0, 0, -armLength + 0.2);
    rightGloveMesh.frustumCulled = false;
    this.addOutline(rightGloveMesh, 0.08);
    this.fpsRightArm.add(rightGloveMesh);

    this.fpsLeftArm = new THREE.Group();
    this.fpsLeftArm.position.copy(this.fpsLeftArmRestPos);
    this.fpsLeftArm.rotation.copy(this.fpsArmsRestRot);
    this.swayGroup.add(this.fpsLeftArm);

    const leftArmMesh = new THREE.Mesh(armGeo, this.materials.suit);
    leftArmMesh.position.set(0, 0, -armLength / 2);
    leftArmMesh.frustumCulled = false;
    this.addOutline(leftArmMesh, 0.08);
    this.fpsLeftArm.add(leftArmMesh);

    const leftGloveMesh = new THREE.Mesh(gloveGeo, this.materials.boots);
    leftGloveMesh.position.set(0, 0, -armLength + 0.2);
    leftGloveMesh.frustumCulled = false;
    this.addOutline(leftGloveMesh, 0.08);
    this.fpsLeftArm.add(leftGloveMesh);

    this.fpsSwordHolder = new THREE.Group();
    this.fpsSwordHolder.position.set(0, 0, -armLength + 0.2); 
    this.fpsRightArm.add(this.fpsSwordHolder);
    
    const fpsSword = this.createComicSword(1.6); 
    fpsSword.position.set(0.2, -0.1, -0.2); 
    fpsSword.rotation.x = -Math.PI / 2.5; 
    fpsSword.rotation.y = -Math.PI / 4;
    fpsSword.rotation.z = -Math.PI / 6;
    
    fpsSword.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).frustumCulled = false;
      }
    });
    this.fpsSwordHolder.add(fpsSword);

    this.fpsAK47Holder = new THREE.Group();
    this.fpsAK47Holder.position.set(0, 0, -armLength + 0.2);
    this.fpsAK47Holder.visible = false;
    this.fpsRightArm.add(this.fpsAK47Holder);

    const fpsAK = this.createAK47VVS(0.5);
    fpsAK.position.set(0.2, -0.4, -0.5);
    fpsAK.rotation.set(0, 0, 0);
    
    fpsAK.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).frustumCulled = false;
      }
    });
    this.fpsAK47Holder.add(fpsAK);

    this.fpsMuzzleFlash = this.createMuzzleFlashEffect();
    this.fpsMuzzleFlash.position.set(0.2, 0, -3.0);
    this.fpsMuzzleFlash.visible = false;
    this.fpsAK47Holder.add(this.fpsMuzzleFlash);

    const slashGeo = new THREE.RingGeometry(1.0, 1.5, 16, 1, Math.PI * 0.75, Math.PI * 0.5); 
    const slashMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0, 
      side: THREE.DoubleSide,
      depthTest: false
    });
    this.slashEffect = new THREE.Mesh(slashGeo, slashMat);
    this.slashEffect.visible = false;
    this.slashEffect.position.set(0, 0, -1.8);
    this.fpsGroup.add(this.slashEffect);
  }

  performAttack() {
    if (this.isAttacking) return;
    this.isAttacking = true;

    if (this.isFirstPerson) {
        const initialPos = this.fpsRightArmRestPos.clone();
        const initialRot = new THREE.Euler().copy(this.fpsArmsRestRot);

        const tl = gsap.timeline({
            onComplete: () => { 
                this.isAttacking = false;
                this.fpsRightArm.rotation.set(initialRot.x, initialRot.y, initialRot.z);
                this.fpsRightArm.position.copy(initialPos);
            }
        });

        tl.to(this.fpsRightArm.rotation, { x: 0.5, y: -0.3, duration: 0.1, ease: "power1.out" })
          .to(this.fpsRightArm.position, { z: initialPos.z + 0.15, duration: 0.1 }, "<")
          .to(this.fpsRightArm.rotation, { x: -0.9, y: 0.5, duration: 0.08, ease: "expo.in" })
          .to(this.fpsRightArm.position, { z: initialPos.z - 0.4, y: initialPos.y - 0.15, duration: 0.08 }, "<")
          .call(() => {
             this.animateSlashVFX();
             this.checkAttackHit();
          }, undefined, "-=0.03")
          .to(this.fpsRightArm.rotation, { x: initialRot.x, y: initialRot.y, duration: 0.3, ease: "back.out(1.5)" })
          .to(this.fpsRightArm.position, { x: initialPos.x, y: initialPos.y, z: initialPos.z, duration: 0.3 }, "<");

    } else {
        const tl = gsap.timeline({
            onComplete: () => { 
                this.isAttacking = false; 
            }
        });

        tl.to(this.rightArmGroup.rotation, { x: -Math.PI / 1.3, y: -0.4, duration: 0.15, ease: "power2.out" })
          .to(this.rightForearm.rotation, { x: -Math.PI / 3, duration: 0.15 }, "<")
          .to(this.torsoGroup.rotation, { y: -0.5, duration: 0.15, ease: "power2.out" }, "<")
          .to(this.rightArmGroup.rotation, { x: Math.PI / 2.0, y: 0.6, duration: 0.1, ease: "expo.in" })
          .to(this.rightForearm.rotation, { x: 0, duration: 0.1 }, "<")
          .to(this.torsoGroup.rotation, { y: 0.8, duration: 0.1, ease: "expo.in" }, "<")
          .call(() => {
              this.checkAttackHit();
              this.animateSlashVFX();
          }, undefined, "-=0.03")
          .to(this.rightArmGroup.rotation, { x: 0, y: 0, duration: 0.5, ease: "back.out(1.2)" })
          .to(this.torsoGroup.rotation, { y: 0, duration: 0.5, ease: "back.out(1.2)" }, "<");
    }
  }

  animateSlashVFX() {
    if (!this.slashEffect) return;
    this.slashEffect.visible = true;
    this.slashEffect.scale.set(0.6, 0.6, 1);
    this.slashEffect.rotation.z = Math.random() * 0.6 - 0.3; 
    if (!Array.isArray(this.slashEffect.material)) {
        this.slashEffect.material.opacity = 1;
    }

    gsap.to(this.slashEffect.scale, { x: 2.2, y: 2.2, duration: 0.25, ease: "power1.out" });
    gsap.to(this.slashEffect.material, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => {
        this.slashEffect.visible = false;
    }});
  }

  togglePOV() {
    this.isFirstPerson = !this.isFirstPerson;
    this.visualGroup.visible = true; 
    this.torsoGroup.visible = !this.isFirstPerson;
    this.headGroup.visible = !this.isFirstPerson;
    this.neckGroup.visible = !this.isFirstPerson;
    this.fpsGroup.visible = this.isFirstPerson;
    
    if (this.isFirstPerson) {
      if (this.controls) this.controls.enabled = false;
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.requestPointerLock) canvas.requestPointerLock();
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
        const yaw = Math.atan2(dir.x, dir.z); 
        const pitch = -Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
      this.euler.set(pitch, yaw, 0, 'YXZ');
      this.group.rotation.y = yaw;
      this.camera.quaternion.setFromEuler(this.euler);
    } else {
      if (this.controls) {
        this.controls.enabled = true;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 600;
      }
      if (document.exitPointerLock) document.exitPointerLock();
    }
  }

    updateCamera(controls?: OrbitControls, delta?: number) {
      if (controls) this.controls = controls;
      const activeControls = controls ?? this.controls;

      if (!this.isFirstPerson) {
        if (!activeControls) return;
        if (!activeControls.enabled) activeControls.enabled = true;
        
        // Use a smoothed yaw for the camera to prevent "tilt" and sudden swings
        const playerYaw = this.group.rotation.y;
        this.cameraYaw = this.expLerp(this.cameraYaw || playerYaw, playerYaw, 10, delta || 0.016);
        
        const cameraQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
        
        // Stable shoulder view offset
        const idealOffset = new THREE.Vector3(-4, 18, -45).applyQuaternion(cameraQuat);
        const idealCameraPos = this.group.position.clone().add(idealOffset);
        
        const headOffset = new THREE.Vector3(0, 15.0, 0);
        const targetPos = this.group.position.clone().add(headOffset);
        
        // Fluid and stable camera following
        const lerpSpeed = 12;
        this.expLerpVec3(this.camera.position, idealCameraPos, lerpSpeed, delta || 0.016);
        this.expLerpVec3(activeControls.target, targetPos, 15, delta || 0.016);
        
        // Ensure no camera roll
        this.camera.up.set(0, 1, 0);
      } else {
      if (activeControls?.enabled) activeControls.enabled = false;
      const eyePos = new THREE.Vector3();
      this.headGroup.updateMatrixWorld(true);
      eyePos.set(0, 0.5, 1.0); 
      this.headGroup.localToWorld(eyePos);
      this.camera.position.copy(eyePos);
      this.camera.quaternion.setFromEuler(this.euler);
      if (this.fpsGroup) {
        this.fpsGroup.position.copy(this.camera.position);
        this.fpsGroup.quaternion.copy(this.camera.quaternion);
      }
    }

    if (this.shakeOffset.lengthSq() > 0.0001) {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);
        this.camera.position.add(right.multiplyScalar(this.shakeOffset.x));
        this.camera.position.add(up.multiplyScalar(this.shakeOffset.y));
    }
  }

  checkAttackHit() {
    const raycaster = new THREE.Raycaster();
    (raycaster as any).camera = this.camera;
    if (this.isFirstPerson) {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        raycaster.far = 15.0;
    } else {
        const origin = this.group.position.clone().add(new THREE.Vector3(0, 8, 0)); 
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.group.quaternion);
        raycaster.set(origin, direction);
        raycaster.far = 15.0;
    }

    const intersects = raycaster.intersectObjects(this.scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
        const hit = intersects[i];
        if (!this.isSelf(hit.object)) {
            let isMonsterPart = false;
            this.monsters.forEach(m => {
                m.group.traverse((child: any) => { if (child === hit.object) isMonsterPart = true; });
            });
            if (!isMonsterPart) {
                this.triggerHitEffect(hit.point, hit.face ? hit.face.normal : new THREE.Vector3(0, 1, 0));
            }
            break; 
        }
    }

    const attackOrigin = this.isFirstPerson ? this.camera.position.clone() : this.group.position.clone().add(new THREE.Vector3(0, 8, 0));
    const attackDir = this.isFirstPerson ? new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion) : new THREE.Vector3(0, 0, -1).applyQuaternion(this.group.quaternion);
    const attackRange = 25.0; 
    const attackRadius = 12.0;

    this.monsters.forEach(monster => {
        const hitboxes = monster.getHitboxes ? monster.getHitboxes() : [{ center: monster.group.position, radius: monster.hitboxRadius || 15 }];
        for (const hitbox of hitboxes) {
            const toHitbox = new THREE.Vector3().subVectors(hitbox.center, attackOrigin);
            if (toHitbox.length() < attackRange) {
                if (toHitbox.normalize().dot(attackDir) > 0.3) {
                    const projection = toHitbox.dot(attackDir);
                    const closestPointOnLine = attackDir.clone().multiplyScalar(projection);
                    const distToLine = new THREE.Vector3().subVectors(toHitbox, closestPointOnLine).length();
                    if (distToLine < hitbox.radius + attackRadius) {
                        monster.takeHit(attackOrigin);
                        this.triggerHitEffect(hitbox.center.clone(), new THREE.Vector3(0, 1, 0));
                        break; 
                    }
                }
            }
        }
    });
  }

  isSelf(obj: THREE.Object3D) {
     let current: THREE.Object3D | null = obj;
     while(current) {
         if (current === this.group || current === this.visualGroup || current === this.fpsGroup || current === this.swayGroup) return true;
         current = current.parent;
     }
     return false;
  }

  triggerHitEffect(position: THREE.Vector3, normal: THREE.Vector3) {
      const words = ["POW!", "BAM!", "WHACK!", "BOOM!", "SMASH!", "KABOOM!", "ZAP!", "KRAK!", "CLANG!"];
      const word = words[Math.floor(Math.random() * words.length)];
      const mainColor = ['#FFD700', '#FF4500', '#FF1493', '#00FFFF', '#ADFF2F'][Math.floor(Math.random() * 5)];
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      const cx = 256, cy = 256;
      
      const drawSpikes = (radius: number, spikes: number, color: string, stroke: string, lineWidth: number) => {
          ctx.fillStyle = color; ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth;
          ctx.beginPath();
          let rot = Math.PI / 2 * 3;
          const step = Math.PI / spikes;
          ctx.moveTo(cx, cy - radius);
          for (let i = 0; i < spikes; i++) {
              ctx.lineTo(cx + Math.cos(rot) * radius, cy + Math.sin(rot) * radius);
              rot += step;
              ctx.lineTo(cx + Math.cos(rot) * radius * 0.6, cy + Math.sin(rot) * radius * 0.6);
              rot += step;
          }
          ctx.closePath();
          if (color) ctx.fill();
          if (stroke) ctx.stroke();
      };

      drawSpikes(210, 16, '#000000', '#000000', 5);
      drawSpikes(200, 16, mainColor, '#000000', 12);
      drawSpikes(170, 16, '#FFFFFF', null, 0);

      ctx.font = 'bold 110px "Arial Black", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillStyle = '#000000'; ctx.fillText(word, 8, 8);
      ctx.fillStyle = '#FF0000'; ctx.strokeStyle = '#000000'; ctx.lineWidth = 15;
      ctx.strokeText(word, 0, 0); ctx.fillText(word, 0, 0);
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 105px "Arial Black", sans-serif';
      ctx.fillText(word, 0, -2);
      ctx.restore();
      
      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }); 
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(position).add(normal.clone().multiplyScalar(1.5));
      const baseScale = 6 + Math.random() * 4;
      sprite.scale.set(0, 0, 0);
      this.scene.add(sprite);

      const tl = gsap.timeline();
      tl.to(sprite.scale, { x: baseScale * 1.5, y: baseScale * 1.5, duration: 0.1, ease: "back.out(2)" })
        .to(sprite.scale, { x: baseScale, y: baseScale, duration: 0.1 })
        .to(sprite.position, { y: "+=3", duration: 0.6, ease: "power1.out" }, 0.1)
        .to(sprite.material, { opacity: 0, duration: 0.2, onComplete: () => {
            this.scene.remove(sprite);
            sprite.geometry.dispose(); sprite.material.dispose(); tex.dispose();
        }}, 0.5);

      this.applyScreenshake();
  }

  applyScreenshake() {
      const intensity = 0.8;
      const tl = gsap.timeline();
      for(let i=0; i<4; i++) {
          tl.to(this.shakeOffset, {
              x: (Math.random() - 0.5) * intensity,
              y: (Math.random() - 0.5) * intensity,
              duration: 0.05
          });
      }
      tl.to(this.shakeOffset, { x: 0, y: 0, duration: 0.05 });
  }

  shootAK47() {
    (this.shootRaycaster as any).camera = this.camera;

    if (this.isFirstPerson) {
      this.fpsMuzzleFlash.getWorldPosition(this.bulletOrigin);
      this.camera.getWorldDirection(this.bulletDir);
      this.shootRaycaster.set(this.bulletOrigin, this.bulletDir);
    } else {
      this.tpsMuzzleFlash.getWorldPosition(this.bulletOrigin);
      this.bulletDir.set(0, 0, 1).applyQuaternion(this.group.quaternion);
      this.shootRaycaster.set(this.bulletOrigin, this.bulletDir);
    }

    this.shootRaycaster.far = 250;
    this.applyScreenshake();
    if (this.isFirstPerson) {
      gsap.to(this.fpsRightArm.position, { z: "+=0.15", duration: 0.04, yoyo: true, repeat: 1 });
      this.euler.x += (Math.random() * 0.02);
    }

    this.triggerMuzzleFlash();
    const intersects = this.shootRaycaster.intersectObjects(this.scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
      const hit = intersects[i];
      if (this.isSelf(hit.object)) continue;
      
      let hitMonster = null;
      for (const monster of this.monsters) {
        let isPart = false;
        monster.group.traverse((c: any) => { if (c === hit.object) isPart = true; });
        if (isPart) { hitMonster = monster; break; }
      }

      if (hitMonster) {
        hitMonster.takeHit(this.bulletOrigin);
        this.triggerHitEffect(hit.point, new THREE.Vector3(0, 1, 0));
      } else {
        this.triggerHitEffect(hit.point, hit.face ? hit.face.normal : new THREE.Vector3(0, 1, 0));
      }
      break;
    }
    this.spawn3DBullet(this.bulletOrigin, this.bulletDir);
  }

  spawn3DBullet(origin: THREE.Vector3, direction: THREE.Vector3) {
      let bulletGroup: THREE.Group;
      
      if (this.bulletPool.length > 0) {
          bulletGroup = this.bulletPool.pop()!;
          bulletGroup.visible = true;
      } else {
          bulletGroup = new THREE.Group();
          
          const bulletMesh = new THREE.Mesh(this.bulletGeometry, this.bulletMaterial);
          bulletMesh.rotation.x = Math.PI / 2;
          this.addOutline(bulletMesh, 0.2);
          bulletGroup.add(bulletMesh);

          const trail = new THREE.Mesh(this.trailGeometry, this.trailMaterial);
          trail.position.z = 2.5;
          bulletGroup.add(trail);
      }

      bulletGroup.position.copy(origin);
      bulletGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);
      this.scene.add(bulletGroup);
      
      this.bullets.push({ 
          mesh: bulletGroup, 
          velocity: direction.clone().multiplyScalar(400),
          life: 2.0 
      });
  }

  triggerMuzzleFlash() {
    const flash = this.isFirstPerson ? this.fpsMuzzleFlash : this.tpsMuzzleFlash;
    if (!flash) return;
    flash.visible = true;
    flash.scale.set(0.1, 0.1, 0.1);
    flash.rotation.z = Math.random() * Math.PI * 2;
    
    gsap.killTweensOf(flash.scale);
    gsap.to(flash.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 0.03, ease: "power2.out", onComplete: () => {
      gsap.to(flash.scale, { x: 0, y: 0, z: 0, duration: 0.05, onComplete: () => { flash.visible = false; } });
    }});
  }

  createMuzzleFlashEffect() {
    const boom = new THREE.Group();
    
    // Comic spike star
    for(let i=0; i<12; i++) {
        const h = 1.5 + Math.random() * 2;
        const spike = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, h, 4), 
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        spike.position.y = h / 2;
        const holder = new THREE.Group();
        holder.add(spike);
        holder.rotation.z = (i / 12) * Math.PI * 2;
        holder.rotation.x = (Math.random() - 0.5) * 1.0;
        boom.add(holder);
    }
    
    // Core of the boom
    const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 8, 8), 
        new THREE.MeshBasicMaterial({ color: 0xffa500 })
    );
    boom.add(core);

    // Add "BOOM" text as a sprite for comic feel
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.font = 'bold 80px "Arial Black", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('BOOM', 15, 95);
    ctx.fillStyle = '#ff0000';
    ctx.fillText('BOOM', 10, 90);
    
    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4, 2, 1);
    sprite.position.z = -1.0;
    boom.add(sprite);

    return boom;
  }

  update(time: number, delta: number, controls?: OrbitControls) {
    if (this.currentWeaponSlot === 2 && this.isFiring) {
      if (time - this.lastFireTime > this.fireRate) {
        this.shootAK47();
        this.lastFireTime = time;
      }
    }

    const bulletVel = new THREE.Vector3();
    for (let i = this.bullets.length - 1; i >= 0; i--) {
        const b = this.bullets[i];
        bulletVel.copy(b.velocity).multiplyScalar(delta);
        b.mesh.position.add(bulletVel);
        b.life -= delta;
        if (b.life <= 0) {
            b.mesh.visible = false;
            this.scene.remove(b.mesh);
            this.bulletPool.push(b.mesh);
            this.bullets.splice(i, 1);
        }
    }

    this.isMoving = this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;

    if (!this.isMoving && !this.isAttacking) {
        const breath = Math.sin(time * 1.5) * 0.05;
        this.torsoGroup.scale.set(1 + breath * 0.3, 1 + breath, 1 + breath * 0.3);
        this.torsoGroup.position.y = (6.4 + 7.0 / 2) + breath * 0.4; 
        this.neckGroup.rotation.x = breath * 0.2;
        this.headGroup.rotation.y = Math.sin(time * 0.6) * 0.15;
        this.leftArmGroup.rotation.z = 0.15 + breath * 0.6;
        this.rightArmGroup.rotation.z = -0.15 - breath * 0.6;
    } else {
        this.torsoGroup.scale.set(1, 1, 1);
        this.torsoGroup.position.y = (6.4 + 7.0 / 2);
    }

    if (this.isFirstPerson) {
      if (this.sway && this.swayGroup) {
        this.sway.currentX = this.expLerp(this.sway.currentX, this.sway.targetX, 12, delta);
        this.sway.currentY = this.expLerp(this.sway.currentY, this.sway.targetY, 12, delta);
        this.swayGroup.position.x = this.sway.currentX;
        this.swayGroup.position.y = this.sway.currentY;
        this.swayGroup.rotation.z = this.sway.currentX * 0.6;
        this.swayGroup.rotation.x = this.sway.currentY * 0.6;
        this.sway.targetX = this.expLerp(this.sway.targetX, 0, 8, delta);
        this.sway.targetY = this.expLerp(this.sway.targetY, 0, 8, delta);
      }
      if (this.isMoving) {
          const bobSpeed = this.keys.boost ? 18 : 14;
          const bobX = Math.sin(time * bobSpeed) * 0.02;
          const bobY = Math.abs(Math.cos(time * bobSpeed)) * 0.015;
          this.swayGroup.position.x += bobX;
          this.swayGroup.position.y += bobY;
          this.swayGroup.rotation.z += bobX * 2.5;
      }
    }

    const moveSpeed = this.isOnFoot ? this.walkSpeed : this.speed;
    const targetSpeed = this.keys.boost ? moveSpeed * 6.5 : moveSpeed;
    
    // Physics-based movement for professional feel
    const inputDir = new THREE.Vector3();
    if (this.isMoving) {
        if (this.isFirstPerson) {
            const yaw = this.euler.y;
            const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
            const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
            if (this.keys.forward) inputDir.add(forward);
            if (this.keys.backward) inputDir.sub(forward);
            if (this.keys.right) inputDir.add(right);
            if (this.keys.left) inputDir.sub(right);
        } else {
            const camDir = new THREE.Vector3();
            this.camera.getWorldDirection(camDir);
            camDir.y = 0; camDir.normalize();
            const camRight = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();
            if (this.keys.forward) inputDir.add(camDir);
            if (this.keys.backward) inputDir.sub(camDir);
            if (this.keys.right) inputDir.add(camRight);
            if (this.keys.left) inputDir.sub(camRight);
        }
    }

    if (inputDir.lengthSq() > 0) inputDir.normalize();

    // Movement Physics (Acceleration & Friction)
    if (this.isMoving) {
        let accel = this.isOnFoot ? this.acceleration * 1.5 : this.acceleration;
        // Immediate boost power
        if (this.keys.boost) accel *= 4.5;
        this.horizontalVelocity.add(inputDir.multiplyScalar(accel * delta));
    }

    // Clamp speed
    const currentMaxSpeed = targetSpeed;
    if (this.horizontalVelocity.length() > currentMaxSpeed) {
        this.horizontalVelocity.setLength(this.expLerp(this.horizontalVelocity.length(), currentMaxSpeed, 10, delta));
    }

    // Apply Friction
    const currentFriction = this.isOnFoot ? 0.82 : this.friction;
    this.horizontalVelocity.multiplyScalar(Math.pow(currentFriction, delta * 60));

    this.currentMoveSpeed = this.horizontalVelocity.length();
    
    if (this.materials.accent) this.materials.accent.emissiveIntensity = this.keys.boost ? 10 : 2;
    this.updateFlames(time, this.keys.boost && !this.isOnFoot);

    // Apply Movement with Collisions
    if (this.currentMoveSpeed > 0.1) {
        const moveStep = this.horizontalVelocity.clone().multiplyScalar(delta);
        let nextPos = this.group.position.clone().add(moveStep);
        
        const col = this.checkCollisions(nextPos);
        if (!col) {
            this.group.position.copy(nextPos);
        } else {
            // Slide along walls
            const slidingVel = this.horizontalVelocity.clone().projectOnPlane(col.normal);
            this.horizontalVelocity.copy(slidingVel.multiplyScalar(0.8));
            const slideStep = this.horizontalVelocity.clone().multiplyScalar(delta);
            this.group.position.add(slideStep);
        }

        // Rotation & Leaning
        if (!this.isFirstPerson && this.isMoving) {
            const targetRotation = Math.atan2(this.horizontalVelocity.x, this.horizontalVelocity.z); 
            let diff = targetRotation - this.group.rotation.y;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            
            this.group.rotation.y += diff * (this.turnSpeed * delta);

            // Simple and stable visual rotations (No camera-affecting tilt)
            const pitchIntensity = (this.keys.forward ? 0.15 : (this.keys.backward ? -0.15 : 0));
            
            if (this.isOnFoot) {
                this.visualGroup.rotation.z = this.expLerp(this.visualGroup.rotation.z, 0, 8, delta);
                this.visualGroup.rotation.x = this.expLerp(this.visualGroup.rotation.x, pitchIntensity, 8, delta);
            } else {
                // Subtle skateboard banking - much smoother
                this.hoverboard.rotation.z = this.expLerp(this.hoverboard.rotation.z, -diff * 0.8, 12, delta);
                this.visualGroup.rotation.z = this.expLerp(this.visualGroup.rotation.z, 0, 8, delta);
                this.visualGroup.rotation.x = this.expLerp(this.visualGroup.rotation.x, pitchIntensity * 0.5, 8, delta);
            }
        }
    }

    // Ground & Slope Logic
    if (this.terrain) {
        const { height: groundY, normal } = this.getSmoothGroundHeightAndNormal(this.group.position.x, this.group.position.z);
        this.terrainHeight = groundY;
        this.expLerpVec3(this.surfaceNormal, normal, 8, delta);

        this.velocity.y += this.gravity * delta;
        this.group.position.y += this.velocity.y * delta;

        const effectiveGroundY = groundY + this.groundOffset;

        if (this.group.position.y <= effectiveGroundY) {
            this.group.position.y = effectiveGroundY;
            this.velocity.y = 0;
            this.isGrounded = true;

            const up = new THREE.Vector3(0, 1, 0);
            if (this.surfaceNormal.dot(up) < 0.99) {
                const axis = new THREE.Vector3().crossVectors(up, this.surfaceNormal).normalize();
                const angle = Math.acos(up.dot(this.surfaceNormal));
                this.targetVisualRotation.setFromAxisAngle(axis, angle);
            } else {
                this.targetVisualRotation.set(0, 0, 0, 1);
            }
        } else {
            this.isGrounded = false;
            this.targetVisualRotation.set(0, 0, 0, 1);
        }

        // SMOOTH VISUAL Y - This hides the staircase effect
        const targetVisualY = this.group.position.y;
        this.visualY = this.expLerp(this.visualY, targetVisualY, 15, delta);
        const baseVisualY = this.visualY - this.group.position.y;

        // Transitions and Bobbing
        const targetLocalY = this.isOnFoot ? 0.0 : 6.0;
        this.currentLocalY = this.expLerp(this.currentLocalY || 0, targetLocalY, 8, delta);
        
        let dynamicBob = 0;
        if (this.isOnFoot) {
            const walkFreq = time * (this.keys.boost ? 20 : 14);
            const speedFactor = Math.min(1.0, this.currentMoveSpeed / 35);
            if (this.isMoving || this.currentMoveSpeed > 0.5) {
                dynamicBob = Math.abs(Math.sin(walkFreq * 2)) * 0.4 * speedFactor;
            }
        } else {
            dynamicBob = Math.sin(time * 4) * 0.6;
            this.hoverY = this.expLerp(this.hoverY, Math.sin(time * 8) * 0.3, 5, delta);
            this.hoverboard.position.y = -1.5 + this.hoverY;
        }

        this.visualGroup.position.y = baseVisualY + this.currentLocalY + dynamicBob;

        // Apply smooth tilting
        if (!this.isFirstPerson) {
            this.expSlerp(this.visualGroup.quaternion, this.targetVisualRotation, 10, delta);
        } else {
            this.visualGroup.quaternion.set(0, 0, 0, 1);
        }
    }

    // Animations logic
    if (this.isMoving || this.currentMoveSpeed > 0.5) {
        if (this.isOnFoot) {
            const walkFreq = time * (this.keys.boost ? 20 : 14);
            const speedFactor = Math.min(1.0, this.currentMoveSpeed / 35);
            const legSwing = Math.sin(walkFreq) * 1.0 * speedFactor;
            const calfBend = Math.max(0, Math.sin(walkFreq - Math.PI / 2)) * 0.9 * speedFactor;
            
            this.leftLegGroup.rotation.x = legSwing;
            this.leftCalf.rotation.x = legSwing < 0 ? calfBend : 0;
            this.rightLegGroup.rotation.x = -legSwing;
            this.rightCalf.rotation.x = legSwing > 0 ? calfBend : 0;

            if (!this.isAttacking) {
                this.leftArmGroup.rotation.x = -legSwing * 0.8;
                this.rightArmGroup.rotation.x = legSwing * 0.8;
                this.torsoGroup.rotation.y = Math.sin(walkFreq) * 0.15 * speedFactor;
            }
        } else {
            // Skater pose and arm balance
            const idleWobble = Math.sin(time * 3) * 0.05;
            this.leftLegGroup.rotation.x = 0.4 + idleWobble;
            this.leftCalf.rotation.x = -0.5;
            this.rightLegGroup.rotation.x = -0.2 + idleWobble;
            this.rightCalf.rotation.x = -0.4;
            
            if (!this.isAttacking) {
                this.leftArmGroup.rotation.z = 0.4 + Math.sin(time * 2) * 0.15;
                this.rightArmGroup.rotation.z = -0.4 - Math.cos(time * 2) * 0.15;
            }
        }
    } else {
        // Idle transitions for rotations
        this.visualGroup.rotation.z = this.expLerp(this.visualGroup.rotation.z, 0, 8, delta);
        this.visualGroup.rotation.x = this.expLerp(this.visualGroup.rotation.x, 0, 8, delta);
        this.hoverboard.rotation.z = this.expLerp(this.hoverboard.rotation.z, 0, 8, delta);
    }

    if (this.isOnFoot && !this.isAttacking) {
        this.leftLegGroup.rotation.x = this.expLerp(this.leftLegGroup.rotation.x, 0, 10, delta);
        this.leftCalf.rotation.x = this.expLerp(this.leftCalf.rotation.x, 0, 10, delta);
        this.rightLegGroup.rotation.x = this.expLerp(this.rightLegGroup.rotation.x, 0, 10, delta);
        this.rightCalf.rotation.x = this.expLerp(this.rightCalf.rotation.x, 0, 10, delta);
        this.leftArmGroup.rotation.x = this.expLerp(this.leftArmGroup.rotation.x, 0, 10, delta);
        this.rightArmGroup.rotation.x = this.expLerp(this.rightArmGroup.rotation.x, 0, 10, delta);
        this.leftForearm.rotation.x = this.expLerp(this.leftForearm.rotation.x, -0.2, 10, delta);
        this.rightForearm.rotation.x = this.expLerp(this.rightForearm.rotation.x, -0.2, 10, delta);
    }

    this.updateCamera(controls, delta);
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    this.scene.remove(this.group);
    if (this.fpsGroup) this.scene.remove(this.fpsGroup);
    this.group.traverse((c: any) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) Array.isArray(c.material) ? c.material.forEach((m: THREE.Material) => m.dispose()) : c.material.dispose();
    });
  }
}
