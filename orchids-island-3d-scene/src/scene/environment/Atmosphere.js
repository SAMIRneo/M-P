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
        vec3 dir = normalize(vWorldPosition);
        float height = dir.y;
        
        // Borderlands Sky Palette
        vec3 zenith = vec3(0.1, 0.4, 0.8);   
        vec3 horizon = vec3(0.9, 0.85, 0.7);  // Warmer horizon
        vec3 sunColor = vec3(1.0, 0.9, 0.5);  // Stylized yellow-orange sun
        
        vec3 color;
        if (height > -0.2) {
          float h = pow(max(0.0, height + 0.2), 0.6); 
          color = mix(horizon, zenith, h);
          
          // Stylized Borderlands Sun
          vec3 sunDir = normalize(vec3(0.5, 0.3, -1.0));
          float sunDot = max(0.0, dot(dir, sunDir));
          
          // Core sun disc (sharper for comic look)
          float sunDisc = smoothstep(0.995, 0.997, sunDot);
          
          // Comic-style inner ring
          float sunRing = smoothstep(0.990, 0.992, sunDot) - smoothstep(0.993, 0.995, sunDot);
          
          // Stronger, more defined glow
          float sunGlow = pow(sunDot, 64.0) * 0.5;
          
          // Subtle comic rays (radial pattern)
          float angle = atan(dir.x - sunDir.x, dir.z - sunDir.z);
          float rays = step(0.8, sin(angle * 12.0)) * pow(sunDot, 12.0) * 0.15;
          
          color += sunColor * (sunDisc * 1.5 + sunRing * 0.8 + sunGlow + rays);
          
          // Horizon haze
          float horizonGlow = pow(1.0 - max(0.0, height + 0.1), 10.0) * 0.3;
          color = mix(color, horizon, horizonGlow);
        } else {
          color = horizon;
        }
        
        // Contrast boost for cell-shading look
        color = mix(color, floor(color * 5.0) / 5.0, 0.1); 
        color = pow(color, vec3(1.2)); 
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

export class Atmosphere {
  constructor(scene) {
    this.group = new THREE.Group();
    this.balloons = [];
    this.clouds = [];
    
    this.createSky();
    this.createClouds();
    
    scene.add(this.group);
  }

  createSky() {
    const geometry = new THREE.SphereGeometry(8000, 32, 32); 
    const material = new THREE.ShaderMaterial({
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
        void main() {
          vec3 dir = normalize(vWorldPosition);
          float height = dir.y;
          
            // Vibrant Comic Sky Palette (Hytale/BD)
            vec3 zenith = vec3(0.0, 0.45, 0.95);   // Bright vibrant blue
            vec3 horizon = vec3(0.6, 0.9, 1.0);    // Light cyan/white horizon
            vec3 sunColor = vec3(1.0, 0.95, 0.6);  // Bright yellow sun
            
            vec3 color;
            if (height > -0.2) {
              float h = pow(max(0.0, height + 0.2), 0.75); 
              color = mix(horizon, zenith, h);
              
              // Light "Atmospheric" haze
              float haze = pow(1.0 - h, 3.0) * 0.2;
              color = mix(color, vec3(0.8, 0.95, 1.0), haze);

              
                vec3 sunDir = normalize(vec3(0.5, 0.15, -1.0));
              float sunDot = max(0.0, dot(dir, sunDir));
              
              // Core sun disc (sharper and slightly smaller for comic look)
              float sunDisc = smoothstep(0.996, 0.998, sunDot);
              
              // Comic-style inner ring (multiple rings for more "pop")
              float sunRing1 = smoothstep(0.992, 0.994, sunDot) - smoothstep(0.995, 0.997, sunDot);
              float sunRing2 = smoothstep(0.985, 0.987, sunDot) - smoothstep(0.988, 0.990, sunDot);
              
              // Stronger, more defined glow
              float sunGlow = pow(sunDot, 128.0) * 0.8;
              
              // Stylized comic rays (more numerous and sharp)
              float angle = atan(dir.x - sunDir.x, dir.z - sunDir.z);
              float rays = step(0.85, sin(angle * 16.0)) * pow(sunDot, 16.0) * 0.25;
              rays += step(0.95, sin(angle * 8.0)) * pow(sunDot, 8.0) * 0.15;
              
              color += sunColor * (sunDisc * 2.0 + sunRing1 * 1.0 + sunRing2 * 0.5 + sunGlow + rays);

            
            float horizonGlow = pow(1.0 - max(0.0, height + 0.1), 10.0) * 0.3;
            color = mix(color, horizon, horizonGlow);
          } else {
            color = horizon;
          }
          
          color = mix(color, floor(color * 5.0) / 5.0, 0.1); 
          color = pow(color, vec3(1.2)); 
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide
    });

    const sky = new THREE.Mesh(geometry, material);
    this.group.add(sky);
  }

  createClouds() {
    const cloudCount = 14;
    
    // Custom Comic Cloud Shader
    const cloudShader = {
      uniforms: {
        uColor: { value: new THREE.Color(0xffffff) },
        uShadowColor: { value: new THREE.Color(0xddeeff) },
        uSunDir: { value: new THREE.Vector3(0.5, 0.3, -1.0).normalize() }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uShadowColor;
        uniform vec3 uSunDir;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float dotNL = dot(vNormal, uSunDir);
          
          // Step-based shading for BD look
          vec3 color = uColor;
          if (dotNL < 0.2) color = uShadowColor;
          if (dotNL < -0.4) color = mix(uShadowColor, vec3(0.8, 0.85, 0.9), 0.5);
          
          // Rim lighting
          float rim = pow(1.0 - max(0.0, dot(vNormal, vViewDir)), 3.0);
          if (rim > 0.8) color = mix(color, vec3(1.0), 0.4);
          
          gl_FragColor = vec4(color, 0.98);
        }
      `
    };

    const cloudMat = new THREE.ShaderMaterial({
      uniforms: cloudShader.uniforms,
      vertexShader: cloudShader.vertexShader,
      fragmentShader: cloudShader.fragmentShader,
      transparent: true
    });

    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });

    for (let i = 0; i < cloudCount; i++) {
      const cloudGroup = new THREE.Group();
      
      const sphereCount = 5 + Math.floor(Math.random() * 5);
      for (let j = 0; j < sphereCount; j++) {
        const size = 40 + Math.random() * 60;
        // More detailed spheres for smoother "realistic" blob look
        const sphereGeo = new THREE.SphereGeometry(size, 16, 16);
        const sphere = new THREE.Mesh(sphereGeo, cloudMat);
        
        const spread = size * 1.2;
        sphere.position.set(
          (Math.random() - 0.5) * spread * 2.5,
          (Math.random() - 0.5) * spread * 0.5,
          (Math.random() - 0.5) * spread * 1.5
        );
        
        // Slightly vary scale for more organic feel
        sphere.scale.set(
          1 + Math.random() * 0.2,
          0.8 + Math.random() * 0.4,
          1 + Math.random() * 0.2
        );
        
        const outline = sphere.clone();
        outline.material = outlineMat;
        outline.scale.multiplyScalar(1.04);
        sphere.add(outline);
        
        cloudGroup.add(sphere);
      }

      const angle = (i / cloudCount) * Math.PI * 2 + Math.random();
      const radius = 2500 + Math.random() * 2000;
      const baseY = 800 + Math.random() * 600;

      cloudGroup.position.set(
        Math.cos(angle) * radius,
        baseY,
        Math.sin(angle) * radius
      );

      cloudGroup.userData = {
        angle: angle,
        radius: radius,
        baseY: baseY,
        speed: 0.02 + Math.random() * 0.05
      };

      this.clouds.push(cloudGroup);
      this.group.add(cloudGroup);
    }
  }

  update(time) {
    this.balloons.forEach(balloon => {
      balloon.position.y = balloon.userData.baseY + 
        Math.sin(time * balloon.userData.speed + balloon.userData.offset) * 5;
      balloon.rotation.y += 0.01;
    });

    this.clouds.forEach(cloud => {
      cloud.userData.angle += cloud.userData.speed * 0.01;
      cloud.position.x = Math.cos(cloud.userData.angle) * cloud.userData.radius;
      cloud.position.z = Math.sin(cloud.userData.angle) * cloud.userData.radius;
      cloud.position.y = cloud.userData.baseY + Math.sin(time * 0.2) * 3;
    });
  }

  dispose() {
    this.group.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}

