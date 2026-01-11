import * as THREE from 'three';

export class Volcano {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    // Position du cratère basée sur Terrain.js (0, 165, 100)
    this.group.position.set(0, 165, 100);
    this.scene.add(this.group);

    this.smokeParticles = [];
    this.lavaGlow = null;
    
    this.init();
  }

  init() {
    this.createLava();
    this.createSmokeSystem();
  }

  createLava() {
    // Cœur de lave brillant
    const lavaGeo = new THREE.CircleGeometry(30, 16);
    const lavaMat = new THREE.MeshBasicMaterial({ 
      color: 0xff3300,
      side: THREE.DoubleSide
    });
    const lava = new THREE.Mesh(lavaGeo, lavaMat);
    lava.rotation.x = -Math.PI / 2;
    lava.position.y = -5; // Légèrement enfoncé dans le cratère
    this.group.add(lava);
    this.lava = lava;

    // Lueur ponctuelle
    const lavaLight = new THREE.PointLight(0xff4400, 1000, 300);
    lavaLight.position.set(0, 20, 0);
    this.group.add(lavaLight);
    this.lavaLight = lavaLight;
  }

  createSmokeSystem() {
    // Matériau de fumée style BD ultra-simple
    this.smokeMat = new THREE.MeshToonMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.7
    });

    this.outlineMat = new THREE.MeshBasicMaterial({ 
      color: 0x000000, 
      side: THREE.BackSide 
    });

    // Matériau de débris/suie
    this.debrisMat = new THREE.MeshToonMaterial({
      color: 0x111111
    });
  }

  spawnSmoke() {
    const size = 12 + Math.random() * 18;
    const geo = new THREE.SphereGeometry(size, 5, 5); 
    const mesh = new THREE.Mesh(geo, this.smokeMat.clone());
    
    mesh.position.set(
      (Math.random() - 0.5) * 60,
      0,
      (Math.random() - 0.5) * 60
    );

    const outline = new THREE.Mesh(geo, this.outlineMat);
    outline.scale.multiplyScalar(1.15); 
    mesh.add(outline);

    // Ash/Ember particles (Luminous)
    if (Math.random() > 0.4) {
      const emberGeo = new THREE.BoxGeometry(3, 3, 3);
      const emberMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      mesh.add(ember);
    }

    const particle = {
      mesh: mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        4.0 + Math.random() * 4.0, 
        (Math.random() - 0.5) * 1.2
      ),
      life: 1.0,
      decay: 0.0015 + Math.random() * 0.0015,
      baseScale: 1.0,
      wobbleOffset: Math.random() * Math.PI * 2
    };

    this.group.add(mesh);
    this.smokeParticles.push(particle);
  }

  update(time, delta) {
    // Animation de la lave style Borderlands (flashs et pulsation)
    const lavaPulse = Math.sin(time * 4) * 0.3 + 0.7;
    const lavaFlash = Math.sin(time * 15) * 0.1; // Petit scintillement instable
    
    if (this.lava) {
      this.lava.scale.setScalar(0.85 + lavaPulse * 0.2 + lavaFlash);
      // Alternance de couleur pour l'aspect "énergie instable"
      this.lava.material.color.setHex(lavaPulse > 0.8 ? 0xff4400 : 0xee2200);
    }
    
    if (this.lavaLight) {
      this.lavaLight.intensity = (800 + lavaFlash * 2000) * lavaPulse;
      this.lavaLight.color.setHex(lavaPulse > 0.9 ? 0xffaa00 : 0xff4400);
    }

    // Spawn de fumée régulier
    if (Math.random() < 0.15) {
      this.spawnSmoke();
    }

    // Mise à jour des particules
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.life -= p.decay;
      
      if (p.life <= 0) {
        this.group.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose(); // Important de disposer le clone
        this.smokeParticles.splice(i, 1);
        continue;
      }

      // Mouvement vertical + léger balancement
      p.mesh.position.y += p.velocity.y * delta * 60;
      p.mesh.position.x += (p.velocity.x + Math.sin(time * 2 + p.wobbleOffset) * 0.5) * delta * 60;
      p.mesh.position.z += (p.velocity.z + Math.cos(time * 2 + p.wobbleOffset) * 0.5) * delta * 60;

      // La fumée grossit beaucoup en montant
      const scale = (1 + (1 - p.life) * 5) * p.baseScale;
      p.mesh.scale.setScalar(scale);
      
      // Opacité dégressive
      p.mesh.material.opacity = p.life * 0.7;
    }
  }
}
