import * as THREE from 'three';

const vertexShader = `
  uniform float time;
  uniform float waveHeight;
  uniform float waveSpeed;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float wave1 = sin(pos.x * 0.03 + time * waveSpeed) * waveHeight;
    float wave2 = sin(pos.y * 0.05 + time * waveSpeed * 0.8) * waveHeight * 0.6;
    float wave3 = sin((pos.x + pos.y) * 0.02 + time * waveSpeed * 1.2) * waveHeight * 0.4;
    
    pos.z = wave1 + wave2 + wave3;
    vElevation = pos.z;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 deepColor = vec3(0.0, 0.808, 0.82);
    vec3 surfaceColor = vec3(0.25, 0.878, 0.816);
    
    float mixFactor = (vElevation + 1.0) * 0.5;
    mixFactor = clamp(mixFactor, 0.0, 1.0);
    
    vec3 color = mix(deepColor, surfaceColor, mixFactor);
    
    float foam = smoothstep(0.3, 0.5, vElevation);
    color = mix(color, vec3(1.0), foam * 0.15);
    
    float sparkle = sin(vUv.x * 100.0 + time * 2.0) * sin(vUv.y * 100.0 + time * 1.5);
    sparkle = smoothstep(0.95, 1.0, sparkle) * 0.3;
    color += sparkle;
    
    gl_FragColor = vec4(color, 0.9);
  }
`;

export class Ocean {
  constructor() {
    this.mesh = this.createOcean();
  }

  createOcean() {
    const geometry = new THREE.PlaneGeometry(800, 800, 200, 200);
    
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        waveHeight: { value: 0.5 },
        waveSpeed: { value: 0.25 }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -2;

    return mesh;
  }

  update(time) {
    this.material.uniforms.time.value = time;
  }
}
