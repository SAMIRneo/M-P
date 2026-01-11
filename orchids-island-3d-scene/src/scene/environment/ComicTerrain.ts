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

export class ComicTerrain {
  noise: (x: number, y: number) => number;
  size: number;
  maxRadius: number;
  segments: number;
  mesh: THREE.Mesh;

  constructor() {
    this.noise = createNoise2D();
    this.size = 12000; // MUCH larger
    this.maxRadius = this.size * 0.48;
    this.segments = 160; // Optimized segments for large size
    
    const geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    const material = this.createMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false; 
  }

  createMaterial() {
    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.8,
      metalness: 0.1,
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
          
          float comicDots(vec2 uv, float res) {
            vec2 grid = fract(uv * res) - 0.5;
            return step(length(grid), 0.25);
          }

          float comicHatch(vec2 uv, float res) {
            float line = fract((uv.x + uv.y) * res);
            return step(line, 0.15);
          }
          `
        ).replace(
          '#include <dithering_fragment>',
          `
          #include <dithering_fragment>
          
          #ifndef FLAT_SHADED
            vec3 terrainNormal = normalize(vNormal);
          #else
            vec3 terrainNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
          #endif
          
          vec3 terrainViewDir = normalize(vViewPosition);
          float slope = 1.0 - terrainNormal.y;
          
            // Advanced Comic Cel-Shading
            float diff = dot(terrainNormal, vec3(0.5, 1.0, 0.5));
            float toon = smoothstep(0.2, 0.25, diff) * 0.4 + smoothstep(0.5, 0.55, diff) * 0.4 + smoothstep(0.8, 0.85, diff) * 0.2;
            gl_FragColor.rgb *= (0.8 + toon * 0.2);
            
            // Ben-Day Dots in shadows for that BD feel
            if (diff < 0.4) {
               float dots = comicDots(vWorldPos.xz, 0.05);
               gl_FragColor.rgb *= (0.98 + dots * 0.02);
            }

            // Hatching on steep slopes
            if (slope > 0.6) {
               float hatch = comicHatch(vWorldPos.xz, 0.1);
               gl_FragColor.rgb *= (0.9 + hatch * 0.1);
            }
            
            // Thick Ink Outline
            float fresnel = pow(1.0 - max(0.0, dot(terrainNormal, terrainViewDir)), 8.0);
            float edge = step(0.95, fresnel);
            vec3 inkColor = vec3(0.01, 0.01, 0.03);
            
            // Posterization
            gl_FragColor.rgb = floor(gl_FragColor.rgb * 12.0) / 12.0;
            
            // Final Edge mix
            gl_FragColor.rgb = mix(gl_FragColor.rgb, inkColor, edge * 0.15);
          `
        );
    };

    return material;
  }

  async init() {
    const positions = this.mesh.geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    
    // Premium Comic Biome Palette
    const deepOcean = new THREE.Color(0x0d47a1); 
    const tropicalBlue = new THREE.Color(0x00bcd4);
    const coralSand = new THREE.Color(0xffecb3);
    const vibrantGrass = new THREE.Color(0x4caf50);
    const deepForest = new THREE.Color(0x1b5e20);
    const comicPurple = new THREE.Color(0x7e57c2); // Magic/Mystic biome
    const mountainSlate = new THREE.Color(0x546e7a);
    const snowCap = new THREE.Color(0xeceff1);
    
    const tempColor = new THREE.Color();

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const worldZ = -y;
      const height = this.getHeightAt(x, worldZ);
      positions[i + 2] = height;

      const n = this.noise(x * 0.008, worldZ * 0.008);
      const biomeNoise = this.noise(x * 0.0015, worldZ * 0.0015);

      if (height < -25) {
        tempColor.copy(deepOcean).lerp(tropicalBlue, Math.min(1, (height + 60) / 35));
      } else if (height < 5) {
        tempColor.copy(coralSand).lerp(vibrantGrass, Math.max(0, (height + 2) / 7));
      } else if (height < 150) {
        // Main Island Biomes
        const t = (height - 5) / 145;
        if (biomeNoise > 0.3) {
           // Mystic Purple Biome
           tempColor.copy(vibrantGrass).lerp(comicPurple, t * 0.7 + n * 0.3);
        } else {
           // Lush Forest Biome
           tempColor.copy(vibrantGrass).lerp(deepForest, t + n * 0.2);
        }
      } else if (height < 350) {
        // High Plateaus / Mountains
        const t = (height - 150) / 200;
        tempColor.copy(deepForest).lerp(mountainSlate, t + n * 0.1);
      } else {
        // Peaks
        const t = Math.min(1, (height - 350) / 150);
        tempColor.copy(mountainSlate).lerp(snowCap, t);
      }

      colors[i] = tempColor.r;
      colors[i+1] = tempColor.g;
      colors[i+2] = tempColor.b;
      
      // Batch processing to avoid UI freeze
      if (i % 20000 === 0) await new Promise(r => setTimeout(r, 0));
    }

    this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }

  public getHeightAt(x: number, y: number) {
    const distFromCenter = Math.sqrt(x * x + y * y);
    const mask = this.maxRadius + this.noise(x * 0.0005, y * 0.0005) * 500;
    
    if (distFromCenter > mask) return -80;

    // Multi-layered noise for better "sols bios"
    let h = 40 
      + this.noise(x * 0.0004, y * 0.0004) * 250 // Large scale features
      + this.noise(x * 0.002, y * 0.002) * 80    // Medium scale hills
      + this.noise(x * 0.01, y * 0.01) * 15;     // Small scale details

      // Add some "comic" stylized cliffs/terraces - Minecraft Voxel Style
      const stepSize = 12;
      h = Math.round(h / stepSize) * stepSize; 

      // Landing Zone Plateau
      const distToLanding = Math.sqrt(x * x + (y - 200) ** 2);
      if (distToLanding < 80) {
          h = 48; 
      } else if (distToLanding < 160) {
          const t = (distToLanding - 80) / 80;
          h = h * t + 48 * (1 - t);
      }
      
      // Add micro-voxel noise for that blocky feel
    const blockNoise = Math.floor(this.noise(x * 0.05, y * 0.05) * 3) * 4;
    h += blockNoise;
    
    const factor = Math.pow(Math.max(0, 1 - distFromCenter / mask), 0.6);
    return Math.max(-60, h * factor);
  }
}
