import * as THREE from 'three';

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

export class Terrain {
  noise: (x: number, y: number) => number;
  size: number;
  maxRadius: number;
  segments: number;
  mesh: THREE.Mesh;
  temples: { x: number; z: number }[];

  constructor() {
    this.noise = createNoise2D();
    this.size = 5000;
    this.maxRadius = this.size * 0.45;
    this.segments = 128; 
    
    const geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    const material = this.createMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false; 

    this.temples = [
      { x: -1200, z: -1000 },
      { x: 1200, z: -1000 },
      { x: -1000, z: 1100 },
      { x: 1100, z: 1100 }
    ];
  }

  createMaterial() {
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
          
          // Expert Cel-Shading (No halftone/dots)
          #ifndef FLAT_SHADED
            vec3 terrainNormal = normalize(vNormal);
          #else
            vec3 terrainNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
          #endif
          
          vec3 terrainViewDir = normalize(vViewPosition);
          float slope = 1.0 - terrainNormal.y;
          
            // Smooth Step Cel-Shading for cleaner look
            float diff = dot(terrainNormal, vec3(0.5, 1.0, 0.5));
            float toon = smoothstep(0.3, 0.35, diff) * 0.5 + smoothstep(0.6, 0.65, diff) * 0.5;
            gl_FragColor.rgb *= (0.85 + toon * 0.15);
            
            // Refined Borderlands Outline
            float fresnel = pow(1.0 - max(0.0, dot(terrainNormal, terrainViewDir)), 6.0);
            float edge = step(0.92, fresnel);
            vec3 inkColor = vec3(0.02, 0.02, 0.05);
            
            // Highlight slopes with color shift instead of dots
            if (slope > 0.45) {
               gl_FragColor.rgb *= 0.92;
            }
            
            // Posterization
            gl_FragColor.rgb = (floor(gl_FragColor.rgb * 10.0) / 10.0) + 0.02;
            
            // Final Edge mix
            gl_FragColor.rgb = mix(gl_FragColor.rgb, inkColor, edge * 0.2);
          `
        );

    };

    return material;
  }

  async init() {
    const positions = this.mesh.geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    
    // Pro Comic Palette - Optimized for BD feel
    const deepWater = new THREE.Color(0x1a237e); // Lighter, more vibrant navy
    const shallowWater = new THREE.Color(0x03a9f4); // Vibrant sky blue
    const sand = new THREE.Color(0xfff59d); // Brighter sand
    const grass = new THREE.Color(0x66bb6a); // Brighter, more comic green
    const jungle = new THREE.Color(0x2e7d32); // Rich forest green
    const rock = new THREE.Color(0x78909c); // Lighter blue-gray rock
    const volcano = new THREE.Color(0x455a64); // Dark ash gray instead of black
    const lava = new THREE.Color(0xff7043); // Brighter comic lava
    const ash = new THREE.Color(0x607d8b); // Lighter ash
    const pathColor = new THREE.Color(0xfff176); // Bright yellow paths
    
    const tempColor = new THREE.Color();

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const worldZ = -y;
      const height = this.getHeightAt(x, worldZ);
      positions[i + 2] = height;

      const isPath = this.getIsPath(x, worldZ);
      const distFromVolcano = Math.sqrt(x * x + (worldZ - 100) * (worldZ - 100));
      const n = this.noise(x * 0.012, worldZ * 0.012);
      const biomeNoise = this.noise(x * 0.002, worldZ * 0.002);

      if (height < -15) {
        tempColor.copy(deepWater).lerp(shallowWater, Math.min(1, (height + 40) / 25));
      } else if (isPath > 0.5) {
        tempColor.copy(pathColor).lerp(sand, n * 0.3);
      } else if (height < 2) {
        tempColor.copy(sand);
      } else if (distFromVolcano < 450) {
        // Volcanic Influence
        const t = Math.min(1, distFromVolcano / 450);
        const lavaNoise = this.noise(x * 0.05, worldZ * 0.05);
        if (height > 120 && lavaNoise > 0.4) {
          tempColor.copy(lava);
        } else {
          tempColor.copy(volcano).lerp(ash, t * 0.5 + n * 0.2);
        }
      } else if (height < 85) {
        // Jungle & Grass with biome noise
        const t = (height - 2) / 83;
        const mix = THREE.MathUtils.clamp(t + biomeNoise * 0.3, 0, 1);
        tempColor.copy(grass).lerp(jungle, mix);
      } else {
        // Rock & Peaks
        const t = Math.min(1, (height - 85) / 60);
        tempColor.copy(jungle).lerp(rock, t + n * 0.1);
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
    for (const temple of this.temples) {
      const d = this.distToSegment(x, y, 0, 0, temple.x, temple.z);
      if (d < 40) return 1.0;
    }
    return 0;
  }

  private distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * (x2 - x1))) ** 2 + (py - (y1 + t * (y2 - y1))) ** 2);
  }

    public getHeightAt(x: number, y: number) {
      const h = this.getRawHeightAt(x, y);
      const stepSize = 6;
      return Math.round(h / stepSize) * stepSize;
    }

    public getRawHeightAt(x: number, y: number) {
      const distFromCenter = Math.sqrt(x * x + y * y);
      const mask = this.maxRadius + this.noise(x * 0.001, y * 0.001) * 150;
      
      if (distFromCenter > mask) return -60;

      let h = 25 
        + this.noise(x * 0.0008, y * 0.0008) * 120
        + this.noise(x * 0.003, y * 0.003) * 40
        + this.noise(x * 0.012, y * 0.012) * 8;
      
        const dv = Math.sqrt(x * x + (y - 100) ** 2);
        if (dv < 400) h = 80 + (1 - dv / 400) * 120;

        // Landing Zone Plateau (Island 1)
        const distToLanding = Math.sqrt(x * x + (y - 500) ** 2);
        if (distToLanding < 60) {
            h = 36; 
        } else if (distToLanding < 120) {
            const t = (distToLanding - 60) / 60;
            h = h * t + 36 * (1 - t);
        }

        for (const t of this.temples) {
        const dt = Math.sqrt((x - t.x) ** 2 + (y - t.z) ** 2);
        if (dt < 250) {
          const summitHeight = 220;
          const plateauRadius = 130;
          const slopeWidth = 100;
          
          if (dt < plateauRadius) {
            h = summitHeight;
          } else {
            const t_slope = (dt - plateauRadius) / slopeWidth;
            h = h * t_slope + summitHeight * (1 - t_slope);
          }
        }
      }

      const factor = Math.pow(1 - distFromCenter / mask, 0.5);
      return Math.max(-40, h * factor);
    }
}
