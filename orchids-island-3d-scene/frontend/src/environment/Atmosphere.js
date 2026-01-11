import * as THREE from 'three';

const skyVertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  varying vec3 vWorldPosition;
  void main() {
    float height = normalize(vWorldPosition).y;
    
    vec3 zenith = vec3(0.294, 0.0, 0.51);
    vec3 horizon = vec3(1.0, 0.498, 0.314);
    vec3 bottom = vec3(0.529, 0.808, 0.922);
    
    vec3 color;
    if (height > 0.0) {
      color = mix(horizon, zenith, pow(height, 0.6));
    } else {
      color = mix(horizon, bottom, pow(-height, 0.4));
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export class Atmosphere {
  constructor() {
    this.group = new THREE.Group();
    this.balloons = [];
    this.clouds = [];
    
    this.createSky();
    this.createBalloons();
    this.createClouds();
  }

  createSky() {
    const geometry = new THREE.SphereGeometry(500, 32, 32);
    const material = new THREE.ShaderMaterial({
      vertexShader: skyVertexShader,
      fragmentShader: skyFragmentShader,
      side: THREE.BackSide
    });

    const sky = new THREE.Mesh(geometry, material);
    this.group.add(sky);
  }

  createBalloons() {
    const colors = [0xFF0000, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0x00FF00, 0x9400D3];
    
    for (let i = 0; i < 6; i++) {
      const balloon = new THREE.Group();
      
      const sphereGeo = new THREE.SphereGeometry(3, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colors[i],
        roughness: 0.4,
        metalness: 0.1
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      balloon.add(sphere);

      const ropeGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
      const ropeMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const rope = new THREE.Mesh(ropeGeo, ropeMat);
      rope.position.y = -5.5;
      balloon.add(rope);

      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 150 + Math.random() * 100;
      balloon.position.set(
        Math.cos(angle) * radius,
        90 + Math.random() * 40,
        Math.sin(angle) * radius
      );
      
      balloon.userData.offset = Math.random() * Math.PI * 2;
      balloon.userData.baseY = balloon.position.y;

      this.balloons.push(balloon);
      this.group.add(balloon);
    }
  }

  createClouds() {
    const cloudMaterial = new THREE.MeshToonMaterial({
      color: 0xFAFAFA,
      transparent: true,
      opacity: 0.9
    });

    for (let i = 0; i < 10; i++) {
      const cloud = new THREE.Group();
      
      const numPuffs = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < numPuffs; j++) {
        const puffGeo = new THREE.SphereGeometry(
          4 + Math.random() * 3,
          12, 12
        );
        const puff = new THREE.Mesh(puffGeo, cloudMaterial);
        puff.scale.set(2.5, 0.7, 1.8);
        puff.position.set(
          j * 4 - (numPuffs * 2),
          Math.random() * 1.5,
          Math.random() * 3
        );
        cloud.add(puff);
      }

      const angle = (i / 10) * Math.PI * 2;
      const radius = 200 + Math.random() * 150;
      cloud.position.set(
        Math.cos(angle) * radius,
        110 + Math.random() * 30,
        Math.sin(angle) * radius
      );
      
      cloud.userData.angle = angle;
      cloud.userData.radius = radius;
      cloud.userData.baseY = cloud.position.y;
      cloud.userData.speed = 0.02 + Math.random() * 0.02;

      this.clouds.push(cloud);
      this.group.add(cloud);
    }
  }

  update(time) {
    this.balloons.forEach(balloon => {
      balloon.position.y = balloon.userData.baseY + 
        Math.sin(time * 1.2 + balloon.userData.offset) * 3;
    });

    this.clouds.forEach(cloud => {
      cloud.userData.angle += cloud.userData.speed * 0.01;
      cloud.position.x = Math.cos(cloud.userData.angle) * cloud.userData.radius;
      cloud.position.z = Math.sin(cloud.userData.angle) * cloud.userData.radius;
      cloud.position.y = cloud.userData.baseY + Math.sin(time * 0.3) * 2;
    });
  }
}
