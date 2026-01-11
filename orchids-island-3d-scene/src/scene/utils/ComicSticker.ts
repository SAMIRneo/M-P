import * as THREE from 'three';

export class ComicSticker {
  private mesh: THREE.Mesh;
  private life = 1.0;
  private static textures: THREE.Texture[] = [];
  private static loaded = false;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    if (!ComicSticker.loaded) {
      this.loadTextures();
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Draw comic bubble/star
    const words = ['POW!', 'BAM!', 'BOOM!', 'ZAP!', 'KAPOW!', 'WHACK!'];
    const word = words[Math.floor(Math.random() * words.length)];
    
    ctx.save();
    ctx.translate(128, 64);
    
    // Draw jagged star
    ctx.beginPath();
    const points = 12;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? 100 : 50;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fillStyle = '#ffde00';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.fill();
    ctx.stroke();
    
    // Text
    ctx.font = 'bold 48px "Arial Black", Gadget, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeText(word, 0, 0);
    ctx.fillText(word, 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      depthTest: false
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(15, 7.5, 1);
    scene.add(sprite);
    this.mesh = sprite as any;

    // Animation
    const startTime = performance.now();
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      this.life = 1.0 - elapsed / 0.8;
      
      if (this.life > 0) {
        sprite.scale.setScalar(15 * (1 + (1 - this.life) * 0.5));
        material.opacity = this.life;
        sprite.position.y += 0.1;
        requestAnimationFrame(animate);
      } else {
        scene.remove(sprite);
        texture.dispose();
        material.dispose();
      }
    };
    animate();
  }

  private loadTextures() {
    ComicSticker.loaded = true;
  }
}
