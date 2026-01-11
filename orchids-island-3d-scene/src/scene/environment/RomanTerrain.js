import * as THREE from 'three';
import { ROMAN_BIOMES_CONFIG } from '../biomes/roman-biomes-config.js';

function createNoise2D() {
  const permutation = [];
  for (let i = 0; i < 256; i++) permutation[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }
  const p = [...permutation, ...permutation];

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t) { return a + t * (b - a); }
  function grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  return function(x, y) {
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
  constructor() {
    this.noise = createNoise2D();
    this.size = 5000;
    this.maxRadius = this.size * 0.45;
    this.segments = 120; // Slightly higher detail for terraces
    
    const geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    const material = this.createMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false; 

    // Coordonnées des temples (Match roman-biomes-config.js via Import)
    this.temples = ROMAN_BIOMES_CONFIG.map(config => ({
      x: config.position.x,
      z: config.position.z
    }));
  }

  createMaterial() {
    const terrainShader = {
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.lights,
        THREE.UniformsLib.fog,
        { 
          uTime: { value: 0 },
          uUpVector: { value: new THREE.Vector3(0, 1, 0) },
          uSunDir: { value: new THREE.Vector3(300, 500, 300).normalize() }
        }
      ]),
      vertexShader: `
        #include <common>
        #include <fog_pars_vertex>
        
        varying vec3 vNormal;
        varying vec3 vColor;
        varying vec3 vWorldPos;
        varying vec3 vViewPosition;
        varying float vHeight;
        
        void main() {
          vColor = color;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPosition.xyz;
          vHeight = position.z;
          
          vNormal = normalize(normalMatrix * normal);
          
          vec4 mvPosition = viewMatrix * worldPosition;
          vViewPosition = -mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }
      `,
      fragmentShader: `
        precision highp float;
        
        uniform vec3 uUpVector;
        uniform vec3 uSunDir;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vColor;
        varying vec3 vWorldPos;
        varying vec3 vViewPosition;
        varying float vHeight;
        
        #include <common>
        #include <packing>
        #include <lights_pars_begin>
        #include <fog_pars_fragment>
        
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        float noise2D(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            
            float dotNL = 1.0;
            #if NUM_DIR_LIGHTS > 0
              dotNL = max(0.0, dot(normal, directionalLights[0].direction));
            #else
              dotNL = max(0.0, dot(normal, normalize(vec3(1.0, 1.0, 1.0))));
            #endif

            // Cel-shading Style Romain (Plus chaud/doux)
            float shade = 0.4;
            if (dotNL > 0.85) shade = 1.1;
            else if (dotNL > 0.5) shade = 0.95;
            else if (dotNL > 0.2) shade = 0.7;
            
            vec3 baseColor = vColor;
            float slope = 1.0 - normal.y;
            
            // Masques
            float isGrass = step(0.3, baseColor.g) * step(baseColor.r, 0.7);
            float isPaved = step(0.6, baseColor.r) * step(0.6, baseColor.g) * step(0.5, baseColor.b); // Paved paths
            
            // Texture marbrée/calcaire pour la roche
            if (slope > 0.4) {
               float marble = noise2D(vWorldPos.xz * 0.05 + vHeight * 0.1);
               baseColor = mix(baseColor, vec3(0.9, 0.9, 0.85), marble * 0.3); // Veines claires
            }
            
            // Texture Pavés (Grid-like noise) pour les chemins
            if (isPaved > 0.5 && slope < 0.2) {
               float gridX = step(0.9, fract(vWorldPos.x * 0.2));
               float gridZ = step(0.9, fract(vWorldPos.z * 0.2));
               float paving = max(gridX, gridZ);
                 baseColor = mix(baseColor, baseColor * 0.8, paving * 0.5);
              }

              vec3 finalColor = baseColor * shade;

            
            // Outlines (Ink)
            float edge = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
            float inkOutline = step(0.5, edge);
            finalColor = mix(finalColor, vec3(0.1, 0.05, 0.0), inkOutline * 0.7); // Outline sépia foncé

            gl_FragColor = vec4(finalColor, 1.0);
            
            #include <fog_fragment>
          }
      `
    };

    return new THREE.ShaderMaterial({
      uniforms: terrainShader.uniforms,
      vertexShader: terrainShader.vertexShader,
      fragmentShader: terrainShader.fragmentShader,
      lights: true,
      fog: true,
      vertexColors: true,
      side: THREE.DoubleSide
    });
  }

  async init() {
    const positions = this.mesh.geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    
    // Palette "Méditerranée Antique"
    const deepSeaColor = new THREE.Color(0x006994); // Aegean Blue
    const shallowSeaColor = new THREE.Color(0x40e0d0); // Turquoise
    const sandColor = new THREE.Color(0xf4a460); // Sandy Brown
    const grassColor = new THREE.Color(0x556b2f); // Dark Olive Green
    const dryGrassColor = new THREE.Color(0x8f9779); // Sage/Dry
    const rockColor = new THREE.Color(0xdcdcdc); // Gainsboro (Limestone)
    const pavedColor = new THREE.Color(0xc0c0c0); // Silver (Paved road)
    const terraceColor = new THREE.Color(0x8b4513); // SaddleBrown (Dirt/Fields)
    
    const tempColor = new THREE.Color();

    const chunkSize = 2000;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      const worldZ = -y;
      const height = this.getHeightAt(x, worldZ);
      positions[i + 2] = height;

      let color;
      const noiseVal = this.noise(x * 0.002, worldZ * 0.002);
      
      if (height < -30) {
        color = deepSeaColor;
      } else if (height < -5) {
        const t = (height + 30) / 25;
        tempColor.copy(deepSeaColor).lerp(shallowSeaColor, t);
        color = tempColor;
      } else if (height < 5) {
        color = sandColor;
      } else if (height < 120) {
        // Vegetation mix
        const isPath = this.getIsPath(x, worldZ);
        if (isPath > 0.5) {
            color = pavedColor;
        } else {
            // Mix dry and olive grass
            const t = (noiseVal + 1) * 0.5;
            tempColor.copy(grassColor).lerp(dryGrassColor, t);
            
            // Terraces visual hint (stripes based on height)
            if (height > 20) {
                const terrace = Math.sin(height * 0.5);
                if (terrace > 0.8) {
                     tempColor.lerp(terraceColor, 0.3);
                }
            }
            color = tempColor;
        }
      } else {
        // High rocky peaks
        const t = Math.min(1, (height - 120) / 50);
        tempColor.copy(dryGrassColor).lerp(rockColor, t);
        color = tempColor;
      }

      // Variation locale
      const colorVar = (this.noise(x * 0.01, worldZ * 0.01)) * 0.05;
      colors[i] = THREE.MathUtils.clamp(color.r + colorVar, 0, 1);
      colors[i+1] = THREE.MathUtils.clamp(color.g + colorVar, 0, 1);
      colors[i+2] = THREE.MathUtils.clamp(color.b + colorVar, 0, 1);

      if ((i / 3) % chunkSize === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }

  getIsPath(x, y) {
    // Paths connect Center (0,0) to Temples (Cross shape)
    // Plus a circle around the center
    const distFromCenter = Math.sqrt(x*x + y*y);
    if (distFromCenter < 300) return 1.0; // Paved Forum (Entire Area)

    for (const temple of this.temples) {
      const distToLine = this.distToSegment(x, y, 0, 0, temple.x, temple.z);
      if (distToLine < 30) return 1.0;
      if (distToLine < 50) return 0.5;
    }
    return 0;
  }

  distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * (x2 - x1))) * (px - (x1 + t * (x2 - x1))) + (py - (y1 + t * (y2 - y1))) * (py - (y1 + t * (y2 - y1))));
  }

  getHeightAt(x, y) {
    const distFromCenter = Math.sqrt(x * x + y * y);
    const edgeNoise = (this.noise(x * 0.001, y * 0.001) * 200);
    const maskRadius = this.maxRadius + edgeNoise;
    
    if (distFromCenter > maskRadius) {
       // Ocean floor
       return -50 + this.noise(x*0.005, y*0.005) * 10;
    }

    // Base: Rolling hills (Lower frequency, smoother)
    let height = 20 + this.noise(x * 0.0015, y * 0.0015) * 80;
    
    // Add detail
    height += this.noise(x * 0.005, y * 0.005) * 15;

    // Central Forum Plateau (0,0)
    if (distFromCenter < 300) {
        if (distFromCenter < 250) {
            height = 60; // Perfectly flat forum
        } else {
            // Smooth blend from flat 60 to hills
            const t = (distFromCenter - 250) / 50; // 0 to 1
            const baseH = height;
            height = 60 * (1 - t) + baseH * t; 
        }
    }

    // Temple Plateaus
    for (const temple of this.temples) {
        const dist = Math.sqrt((x - temple.x)**2 + (y - temple.z)**2);
        if (dist < 250) {
            const platH = 140; // Temples are high up
            if (dist < 100) return platH;
            
            // Ramp
            const t = (dist - 100) / 150;
            height = height * t + platH * (1-t);
        }
    }

    // Path carving
    if (this.getIsPath(x, y) > 0.8) {
        height = Math.round(height / 2) * 2; // Flatter paths
    } else {
        // Terracing effect for hills (Vineyards style)
        const terraceStep = 8;
        height = Math.round(height / terraceStep) * terraceStep;
    }
    
    // Smooth edges to water
    const edgeFactor = Math.pow(Math.max(0, 1 - distFromCenter / maskRadius), 0.5);
    height *= edgeFactor;

    return Math.max(-40, height);
  }
}
