import * as THREE from 'three';
import gsap from 'gsap';

export class Player {
  constructor(scene, camera, terrain) {
    this.scene = scene;
    this.camera = camera;
    this.terrain = terrain;
    
    this.group = new THREE.Group();
    this.group.position.set(0, 15, 0);
    this.scene.add(this.group);

    this.speed = 40;
    this.turnSpeed = 4;
    this.velocity = new THREE.Vector3();
    this.isMoving = false;

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    this.initModel();
    this.initControls();
    
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 50;
    this.downVector = new THREE.Vector3(0, -1, 0);
  }

  initModel() {
    const material = new THREE.MeshToonMaterial({ color: 0x333333 });
    const limbMaterial = new THREE.MeshToonMaterial({ color: 0x222222 });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), material);
    head.position.y = 8;
    this.group.add(head);

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 1), material);
    torso.position.y = 5.5;
    this.group.add(torso);

    // Arms
    this.leftArm = this.createLimb(0.4, 3.5, limbMaterial);
    this.leftArm.position.set(-1.2, 7, 0);
    this.group.add(this.leftArm);

    this.rightArm = this.createLimb(0.4, 3.5, limbMaterial);
    this.rightArm.position.set(1.2, 7, 0);
    this.group.add(this.rightArm);

    // Legs
    this.leftLeg = this.createLimb(0.5, 4, limbMaterial);
    this.leftLeg.position.set(-0.6, 4, 0);
    this.group.add(this.leftLeg);

    this.rightLeg = this.createLimb(0.5, 4, limbMaterial);
    this.rightLeg.position.set(0.6, 4, 0);
    this.group.add(this.rightLeg);

    this.group.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  createLimb(radius, height, material) {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height), material);
    mesh.position.y = -height / 2;
    group.add(mesh);
    return group;
  }

  initControls() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
  }

  onKeyDown(e) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': this.keys.forward = true; break;
      case 'KeyS': case 'ArrowDown': this.keys.backward = true; break;
      case 'KeyA': case 'ArrowLeft': this.keys.left = true; break;
      case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
    }
  }

  onKeyUp(e) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': this.keys.forward = false; break;
      case 'KeyS': case 'ArrowDown': this.keys.backward = false; break;
      case 'KeyA': case 'ArrowLeft': this.keys.left = false; break;
      case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
    }
  }

  update(time, delta, controls) {
    this.isMoving = this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;

    if (this.isMoving) {
      // Rotation
      if (this.keys.left) this.group.rotation.y += this.turnSpeed * delta;
      if (this.keys.right) this.group.rotation.y -= this.turnSpeed * delta;

      // Movement
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(this.group.quaternion);
      
      const moveStep = this.speed * delta;
      if (this.keys.forward) this.group.position.add(direction.multiplyScalar(moveStep));
      if (this.keys.backward) this.group.position.add(direction.multiplyScalar(-moveStep * 0.5));

      // Animation
      const walkCycle = Math.sin(time * 12);
      this.leftLeg.rotation.x = walkCycle * 0.6;
      this.rightLeg.rotation.x = -walkCycle * 0.6;
      this.leftArm.rotation.x = -walkCycle * 0.5;
      this.rightArm.rotation.x = walkCycle * 0.5;
      
      this.group.position.y = 0 + Math.abs(Math.cos(time * 12)) * 0.5;
    } else {
      // Idle
      const idleCycle = Math.sin(time * 2);
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = idleCycle * 0.1;
      this.rightArm.rotation.x = -idleCycle * 0.1;
      this.group.position.y = 0;
    }

    // Stick to terrain
    this.raycaster.set(this.group.position.clone().add(new THREE.Vector3(0, 10, 0)), this.downVector);
    const intersects = this.raycaster.intersectObject(this.terrain.mesh);
    
    if (intersects.length > 0) {
      const terrainHeight = intersects[0].point.y;
      const targetY = terrainHeight;
      this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, targetY, 0.2);
      
      if (this.isMoving) {
        this.group.position.y += Math.abs(Math.cos(time * 12)) * 0.4;
      }
    }

    this.updateCamera(controls);
  }

  updateCamera(controls) {
    if (!controls) return;
    
    // Smoothly follow player
    const targetPos = this.group.position.clone().add(new THREE.Vector3(0, 10, 0));
    controls.target.lerp(targetPos, 0.1);
    
    // If we wanted a locked third person, we would move the camera position too
    // But keeping OrbitControls with player as target is better for "immersion" as requested
  }
}
