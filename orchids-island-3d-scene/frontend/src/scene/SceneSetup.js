import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

export class SceneSetup {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.biomeIndicator = document.getElementById('biome-indicator');
    
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupControls();
    this.setupPostProcessing();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.scene = new THREE.Scene();
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 220, 350);
    this.camera.lookAt(0, 10, 0);
  }

  setupLights() {
    const directional = new THREE.DirectionalLight(0xFFF4E6, 1.3);
    directional.position.set(120, 180, 100);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 2048;
    directional.shadow.mapSize.height = 2048;
    directional.shadow.camera.near = 10;
    directional.shadow.camera.far = 500;
    directional.shadow.camera.left = -250;
    directional.shadow.camera.right = 250;
    directional.shadow.camera.top = 250;
    directional.shadow.camera.bottom = -250;
    directional.shadow.bias = -0.0001;
    this.scene.add(directional);

    const hemisphere = new THREE.HemisphereLight(0x87CEEB, 0xC2B280, 0.7);
    this.scene.add(hemisphere);

    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.25);
    this.scene.add(ambient);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 70;
    this.controls.maxDistance = 500;
    this.controls.minPolarAngle = Math.PI * 0.1;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.autoRotate = false;
    this.controls.panSpeed = 0.8;
    this.controls.rotateSpeed = 0.5;
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6,
      0.9,
      0.75
    );
    this.composer.addPass(bloomPass);
  }

  teleportTo(targetPos, biomeName) {
    const cameraTarget = new THREE.Vector3(
      targetPos.x,
      targetPos.y + 50,
      targetPos.z + 90
    );

    gsap.to(this.camera.position, {
      x: cameraTarget.x,
      y: cameraTarget.y,
      z: cameraTarget.z,
      duration: 2.5,
      ease: 'power2.inOut'
    });

    gsap.to(this.controls.target, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 2.5,
      ease: 'power2.inOut'
    });

    this.showBiomeIndicator(biomeName);
  }

  showBiomeIndicator(name) {
    this.biomeIndicator.textContent = name;
    this.biomeIndicator.classList.add('visible');
    
    setTimeout(() => {
      this.biomeIndicator.classList.remove('visible');
    }, 3000);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  update(delta) {
    this.controls.update();
    this.composer.render();
  }
}
