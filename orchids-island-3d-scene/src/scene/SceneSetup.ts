import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Atmosphere } from './environment/Atmosphere';
import { Ocean } from './environment/Ocean';
import gsap from 'gsap';

export class SceneSetup {
  canvas: HTMLCanvasElement;
  biomeIndicator: HTMLDivElement;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  composer!: EffectComposer;
  outlinePass!: OutlinePass;
  listener!: THREE.AudioListener;
  ambientSound!: THREE.Audio;

  atmosphere!: Atmosphere;
  ocean!: Ocean;
  sunLight!: THREE.DirectionalLight;
  moonLight!: THREE.DirectionalLight;
  
  dayCycleTime: number = 0;
  dayDuration: number = 120; // seconds for a full cycle

  constructor(canvas: HTMLCanvasElement, biomeIndicator: HTMLDivElement) {
    this.canvas = canvas;
    this.biomeIndicator = biomeIndicator;
    
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupControls();
    this.setupPostProcessing();
    this.setupAudio();
    this.setupPersistentEnvironment();
  }

  setupPersistentEnvironment() {
    this.atmosphere = new Atmosphere(this.scene);
    this.atmosphere.group.name = 'SceneSetup_Managed';
    
    this.ocean = new Ocean();
    this.ocean.mesh.name = 'SceneSetup_Managed';
    this.scene.add(this.ocean.mesh);
  }

  setupAudio() {
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    this.ambientSound = new THREE.Audio(this.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('https://assets.mixkit.co/active_storage/sfx/2422/2422-preview.mp3', (buffer) => {
      this.ambientSound.setBuffer(buffer);
      this.ambientSound.setLoop(true);
      this.ambientSound.setVolume(0.5);
    });
  }

  toggleAudio(isMuted: boolean) {
    if (!this.ambientSound) return;
    if (isMuted) {
      this.ambientSound.pause();
    } else {
      if (this.ambientSound.context.state === 'suspended') {
        this.ambientSound.context.resume();
      }
      this.ambientSound.play();
    }
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.75;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.userData.canvas = this.canvas;
    
    const horizonColor = 0xb2ebf2;
    this.scene.fog = new THREE.FogExp2(horizonColor, 0.0001); 
    this.renderer.setClearColor(horizonColor);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1, 
      15000 
    );
    this.camera.position.set(0, 100, 600);
  }

  setupLights() {
    this.sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.2); 
    this.sunLight.position.set(500, 150, -1000);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 6000;
    this.sunLight.shadow.camera.left = -3000; 
    this.sunLight.shadow.camera.right = 3000;
    this.sunLight.shadow.camera.top = 3000;
    this.sunLight.shadow.camera.bottom = -3000;
    this.sunLight.shadow.bias = -0.0001; 
    this.scene.add(this.sunLight);

    this.moonLight = new THREE.DirectionalLight(0x4444ff, 0.3);
    this.moonLight.position.set(-500, -150, 1000);
    this.scene.add(this.moonLight);
  
    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2); // Increased intensity
    this.scene.add(hemisphere);
  
    const ambient = new THREE.AmbientLight(0xFFFFFF, 1.0); // Increased for much brighter shadows
    this.scene.add(ambient);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.minPolarAngle = Math.PI * 0.1;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 800; 
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    this.outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera
    );
    this.outlinePass.edgeStrength = 2.5;
    this.outlinePass.edgeGlow = 0.0;
    this.outlinePass.edgeThickness = 1.5;
    this.outlinePass.visibleEdgeColor.set('#000000');
    this.outlinePass.hiddenEdgeColor.set('#000000');
    this.composer.addPass(this.outlinePass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.12, 
      0.4, 
      0.9 
    );
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  updateDayNightCycle(delta: number) {
    this.dayCycleTime += delta / this.dayDuration;
    const angle = this.dayCycleTime * Math.PI * 2;
    
    const x = Math.cos(angle) * 2000;
    const y = Math.sin(angle) * 2000;
    const z = -1000; 

    this.sunLight.position.set(x, y, z);
    this.moonLight.position.set(-x, -y, z);

    const isDay = y > 0;
    const intensity = Math.max(0, Math.sin(angle));
    this.sunLight.intensity = intensity * 1.4;
    this.moonLight.intensity = (1 - intensity) * 0.5;

    const dayColor = new THREE.Color(0xb2ebf2);
    const nightColor = new THREE.Color(0x0a0a1a);
    const fogColor = dayColor.clone().lerp(nightColor, 1 - intensity);
    
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.copy(fogColor);
    }
    this.renderer.setClearColor(fogColor);
    
    if (this.atmosphere) {
      this.atmosphere.update(this.dayCycleTime * 100);
    }
  }

  teleportTo(targetPos: THREE.Vector3, biomeName: string) {
    this.showBiomeIndicator(biomeName);
    gsap.to(this.controls.target, {
      x: targetPos.x,
      y: targetPos.y + 8,
      z: targetPos.z,
      duration: 1.5,
      ease: 'power3.inOut'
    });
  }

  showBiomeIndicator(name: string) {
    if (!this.biomeIndicator) return;
    this.biomeIndicator.textContent = name;
    this.biomeIndicator.classList.add('visible');
    setTimeout(() => {
      if (this.biomeIndicator) this.biomeIndicator.classList.remove('visible');
    }, 3000);
  }

  public static disposeObject(obj: THREE.Object3D) {
    obj.traverse((child: any) => {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material: THREE.Material) => {
            this.disposeMaterial(material);
          });
        } else {
          this.disposeMaterial(child.material);
        }
      }
      
      // Handle textures if they are on the object directly (rare but possible)
      if (child.texture) {
        child.texture.dispose();
      }
    });
  }

  private static disposeMaterial(material: any) {
    material.dispose();

    // Dispose textures within materials
    for (const key in material) {
      const value = material[key];
      if (value && value instanceof THREE.Texture) {
        value.dispose();
      }
    }
  }

  dispose() {
    this.renderer.dispose();
    if (this.composer) {
      this.composer.passes.forEach(pass => {
        if (pass.dispose) pass.dispose();
      });
    }
    this.controls.dispose();
    
    // Use recursive disposal for the entire scene
    SceneSetup.disposeObject(this.scene);
  }

  clearContent() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const child = this.scene.children[i];
      if (!(child instanceof THREE.Light) && !(child instanceof THREE.Camera) && child.name !== 'SceneSetup_Managed') {
         this.scene.remove(child);
         SceneSetup.disposeObject(child);
      }
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  update(delta: number) {
    if (this.controls.enabled) this.controls.update();
    this.updateDayNightCycle(delta);
    if (this.ocean) this.ocean.update(this.dayCycleTime * 100);
    this.composer.render();
  }
}
