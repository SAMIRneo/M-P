import * as THREE from 'three';

export class Ocean {
  public mesh: THREE.Mesh;
  private material: THREE.MeshPhysicalMaterial;

  constructor() {
    this.mesh = this.createOcean();
    this.material = this.mesh.material as THREE.MeshPhysicalMaterial;
  }

  private createOcean(): THREE.Mesh {
    const size = 15000;
    const segments = 128; 
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments); 
    
    // Pro Physical Water Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0091ea,
      emissive: 0x00b0ff,
      emissiveIntensity: 0.2,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.4,
      thickness: 5,
      ior: 1.33,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    // Custom Shader Injection for Waves & Foam
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      
      shader.vertexShader = `
        uniform float uTime;
        varying vec3 vWorldPos;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `
        vec3 transformed = vec3(position);
        float wave = sin(transformed.x * 0.005 + uTime * 0.8) * 1.5 + 
                     cos(transformed.y * 0.005 + uTime * 0.6) * 1.5 +
                     sin((transformed.x + transformed.y) * 0.002 + uTime * 0.4) * 2.5;
        transformed.z += wave;
        vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        `
      );

        shader.fragmentShader = `
        uniform float uTime;
        varying vec3 vWorldPos;
        ${shader.fragmentShader}
      `.replace(
        `#include <dithering_fragment>`,
        `
        #include <dithering_fragment>
        
        // Expert Comic Water Surface
        vec2 uv = vWorldPos.xz * 0.015;
        float noise = sin(uv.x + uTime * 0.5) * cos(uv.y - uTime * 0.3);
        noise += sin(uv.x * 2.0 - uTime * 0.8) * cos(uv.y * 1.5 + uTime * 0.5) * 0.5;
        
        // Fluid stylized foam
        float foam = smoothstep(0.4, 0.6, noise + 0.5);
        float foamLines = step(0.92, noise + 0.5);
        
        // Dynamic water color variation
        vec3 waterColor = gl_FragColor.rgb;
        vec3 foamColor = vec3(0.95, 1.0, 1.0);
        
        // Mix foam lines and surface variation
        gl_FragColor.rgb = mix(waterColor, waterColor * 1.2, foam * 0.3);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, foamColor, foamLines * 0.6);
        
        // Edge Ink Outline (Refined)
        vec3 oceanViewDir = normalize(vViewPosition);
        vec3 oceanNormal = normalize(vNormal);
        float edge = pow(1.0 - max(0.0, dot(oceanNormal, oceanViewDir)), 3.5);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.01, 0.05, 0.15), step(0.8, edge) * 0.4);
        `
      );

      this.material.userData.shader = shader;
    };

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -3;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  public update(time: number): void {
    if (this.material.userData.shader) {
      this.material.userData.shader.uniforms.uTime.value = time;
    }
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach(m => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
  }
}
