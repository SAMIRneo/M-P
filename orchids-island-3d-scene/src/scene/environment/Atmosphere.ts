import * as THREE from 'three';

export class Atmosphere {
  public group: THREE.Group;
  private clouds: THREE.Group[] = [];
  private skyMaterial: THREE.ShaderMaterial;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.skyMaterial = this.createSky();
    this.createClouds();
    
    scene.add(this.group);
  }

  private createSky(): THREE.ShaderMaterial {
    const geometry = new THREE.SphereGeometry(8000, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSunDir: { value: new THREE.Vector3(0.5, 0.15, -1.0).normalize() }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vWorldPosition;
        uniform float uTime;
        uniform vec3 uSunDir;

          void main() {
            vec3 dir = normalize(vWorldPosition);
            float height = dir.y;
            
            // Vibrant Comic Palette
            vec3 zenith = vec3(0.0, 0.3, 0.8);
            vec3 horizon = vec3(0.4, 0.8, 1.0);
            vec3 sunColor = vec3(1.0, 0.95, 0.4);
            
            vec3 color = mix(horizon, zenith, pow(max(0.0, height + 0.2), 0.7));
            
            // Comic Style Sun - Ultra Sharp
            vec3 sunDir = normalize(uSunDir);
            float sunDot = max(0.0, dot(dir, sunDir));
            float sunDisc = step(0.9985, sunDot); 
            float sunGlow = pow(sunDot, 256.0) * 0.4;
            
            // Comic Ray logic - Graphical
            float angle = atan(dir.x, dir.z);
            float rays = step(0.96, sin(angle * 12.0 + uTime * 0.1)) * pow(sunDot, 48.0) * 0.3;
            
            color += sunColor * (sunDisc * 2.0 + sunGlow + rays);
            
            // Graphical Haze
            color = mix(color, horizon, pow(1.0 - abs(height), 12.0) * 0.3);

            gl_FragColor = vec4(color, 1.0);
          }
      `,
      side: THREE.BackSide
    });

    const sky = new THREE.Mesh(geometry, material);
    this.group.add(sky);
    return material;
  }

  private createClouds(): void {
    const cloudMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.0,
      emissive: 0xffffff,
      emissiveIntensity: 0.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.95
    });

    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });

    for (let i = 0; i < 16; i++) {
      const cloudGroup = new THREE.Group();
      const clusterSize = 4 + Math.floor(Math.random() * 6);
      
      for (let j = 0; j < clusterSize; j++) {
        const radius = 50 + Math.random() * 80;
        const sphereGeo = new THREE.SphereGeometry(radius, 16, 16);
        const sphere = new THREE.Mesh(sphereGeo, cloudMat);
        sphere.position.set(
          (Math.random() - 0.5) * radius * 3.0,
          (Math.random() - 0.5) * radius * 0.6,
          (Math.random() - 0.5) * radius * 2.0
        );
        sphere.scale.set(1.0, 0.6 + Math.random() * 0.4, 1.0);
        
        const outline = new THREE.Mesh(sphereGeo, outlineMat);
        outline.scale.multiplyScalar(1.05);
        sphere.add(outline);
        cloudGroup.add(sphere);
      }

      const angle = (i / 16) * Math.PI * 2 + Math.random();
      const dist = 3000 + Math.random() * 2500;
      const height = 1000 + Math.random() * 800;
      
      cloudGroup.position.set(Math.cos(angle) * dist, height, Math.sin(angle) * dist);
      cloudGroup.userData = { angle, dist, height, speed: 0.01 + Math.random() * 0.03 };
      
      this.clouds.push(cloudGroup);
      this.group.add(cloudGroup);
    }
  }

  public update(time: number): void {
    this.skyMaterial.uniforms.uTime.value = time;
    
    const sunAngle = time * 0.02;
    const sunDir = new THREE.Vector3(Math.cos(sunAngle), 0.8, Math.sin(sunAngle)).normalize();
    this.skyMaterial.uniforms.uSunDir.value.copy(sunDir);

    this.clouds.forEach((cloud, idx) => {
      cloud.userData.angle += cloud.userData.speed * 0.005;
      cloud.position.x = Math.cos(cloud.userData.angle) * cloud.userData.dist;
      cloud.position.z = Math.sin(cloud.userData.angle) * cloud.userData.dist;
      cloud.position.y = cloud.userData.height + Math.sin(time * 0.2 + idx) * 20;
      cloud.rotation.y += 0.001;
    });
  }

  public dispose(): void {
    this.group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
  }
}

