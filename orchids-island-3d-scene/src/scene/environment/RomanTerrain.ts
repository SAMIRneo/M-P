import * as THREE from 'three';
import { ROMAN_BIOMES_CONFIG } from '../biomes/roman-biomes-config';

function createNoise2D() {
  const permutation: number[] = [];
  for (let i = 0; i < 256; i++) permutation[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }
  const p = [...permutation, ...permutation];

  function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
  function grad(hash: number, x: number, y: number) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  return function(x: number, y: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = p[X] + Y, B = p[X + 1] + Y;
    return lerp(
      lerp(grad(p[A], x, y), grad(p[B], x - 1, y), u),
      lerp(grad(p[A + 1], x, y - 1), grad(p[B + 1], x - 1, y - 1), u),
      v
    );
  };
}

export class RomanTerrain {
  public mesh: THREE.Mesh;
  private noise = createNoise2D();
  private size = 5000;
  private maxRadius = this.size * 0.45;
  private segments = 128;
  private temples: { x: number; z: number }[];

  constructor() {
    const geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    const material = this.createMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;

    this.temples = ROMAN_BIOMES_CONFIG.map(config => ({
      x: config.position.x,
      z: config.position.z
    }));
  }

  private createMaterial(): THREE.MeshPhysicalMaterial {
    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.9,
      metalness: 0.0,
      clearcoat: 0.0
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec3 vWorldPos;
        varying float vHeight;
        `
      ).replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vHeight = position.z;
        `
      );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `
          #include <common>
          varying vec3 vWorldPos;
          varying float vHeight;
          
          float halftone(vec2 uv, float res) {
            vec2 grid = fract(uv * res) - 0.5;
            return step(length(grid), 0.35);
          }
          `
        ).replace(
          '#include <dithering_fragment>',
          `
          #include <dithering_fragment>
          
          #ifndef FLAT_SHADED
            vec3 rNormal = normalize(vNormal);
          #else
            vec3 rNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
          #endif
  
          vec3 rViewDir = normalize(vViewPosition);
          float rSlope = 1.0 - rNormal.y;
          
            // Modern Halftone for Paved areas
            bool isPaved = vColor.r > 0.6 && vColor.g > 0.6 && vColor.b > 0.6;
            if (isPaved && rSlope < 0.25) {
              float pattern = halftone(vWorldPos.xz, 0.25);
              gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.75, pattern * 0.1);
            }
    
            // Modern Halftone for Slopes
            if (rSlope > 0.3) {
              float pattern = halftone(vWorldPos.xz, 0.18);
              gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.6, pattern * 0.15);
            }
    
            // Posterization - Softened to avoid black crush
            gl_FragColor.rgb = (floor(gl_FragColor.rgb * 10.0) / 10.0) + 0.05;
    
            // Ink Outline - Colored ink instead of black
            float fresnel = pow(1.0 - max(0.0, dot(rNormal, rViewDir)), 6.0);
            float edge = step(0.92, fresnel);
            vec3 inkColor = vec3(0.05, 0.0, 0.1); // Deep purple-navy ink
            gl_FragColor.rgb = mix(gl_FragColor.rgb, inkColor, edge * 0.2);
          `
        );

    };

    return material;
  }

  public async init(): Promise<void> {
    const positions = this.mesh.geometry.attributes.position.array as Float32Array;
    const colors = new Float32Array(positions.length);
    
    const azure = new THREE.Color(0x1565c0);
    const turquoise = new THREE.Color(0x4dd0e1);
    const marbleWhite = new THREE.Color(0xffffff);
    const goldenSand = new THREE.Color(0xfff59d);
    const oliveGreen = new THREE.Color(0x689f38);
    const cyprusGreen = new THREE.Color(0x2e7d32);
    const pavedGrey = new THREE.Color(0xcfd8dc);
    const terraCotta = new THREE.Color(0xbf360c);
    
    const tempColor = new THREE.Color();

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const worldZ = -y;
      const height = this.getHeightAt(x, worldZ);
      positions[i + 2] = height;

      const isPath = this.getIsPath(x, worldZ);
      const biomeNoise = this.noise(x * 0.003, worldZ * 0.003);
      const detailNoise = this.noise(x * 0.02, worldZ * 0.02) * 0.1;

      if (height < -25) {
        tempColor.copy(azure).lerp(turquoise, Math.min(1, (height + 50) / 25));
      } else if (height < 6) {
        tempColor.copy(goldenSand);
      } else if (isPath > 0.8) {
        tempColor.copy(pavedGrey).lerp(marbleWhite, detailNoise);
      } else if (height < 85) {
        const t = (height - 6) / 79;
        const mix = THREE.MathUtils.clamp(t + biomeNoise * 0.4, 0, 1);
        tempColor.copy(oliveGreen).lerp(cyprusGreen, mix);
      } else {
        const t = Math.min(1, (height - 85) / 60);
        tempColor.copy(cyprusGreen).lerp(marbleWhite, t + detailNoise);
      }

      colors[i] = tempColor.r;
      colors[i+1] = tempColor.g;
      colors[i+2] = tempColor.b;

      if (i % 12000 === 0) await new Promise(r => setTimeout(r, 0));
    }

    this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }

  public getIsPath(x: number, y: number): number {
    const dCenter = Math.sqrt(x*x + y*y);
    if (dCenter < 350) return 1.0;
    for (const temple of this.temples) {
      const d = this.distToSegment(x, y, 0, 0, temple.x, temple.z);
      if (d < 45) return 1.0;
    }
    return 0;
  }

  private distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * (x2 - x1))) ** 2 + (py - (y1 + t * (y2 - y1))) ** 2);
  }

  public getHeightAt(x: number, y: number): number {
    const dCenter = Math.sqrt(x * x + y * y);
    const mask = this.maxRadius + (this.noise(x * 0.001, y * 0.001) * 180);
    
    if (dCenter > mask) return -55;

    let h = 30 + this.noise(x * 0.0012, y * 0.0012) * 90 + this.noise(x * 0.006, y * 0.006) * 12;

    if (dCenter < 400) {
       h = dCenter < 300 ? 70 : 70 * (1 - (dCenter - 300) / 100) + h * ((dCenter - 300) / 100);
    }

    for (const t of this.temples) {
      const d = Math.sqrt((x - t.x)**2 + (y - t.z)**2);
      if (d < 280) h = d < 140 ? 150 : h * ((d - 140) / 140) + 150 * (1 - (d - 140) / 140);
    }

    // Minecraft Voxel Style
    const stepSize = 8;
    h = Math.round(h / stepSize) * stepSize;
    
    // Micro-voxel detail
    const blockNoise = Math.floor(this.noise(x * 0.04, y * 0.04) * 2) * 3;
    h += blockNoise;

    const factor = Math.pow(Math.max(0, 1 - dCenter / mask), 0.55);
    return Math.max(-35, h * factor);
  }
}
