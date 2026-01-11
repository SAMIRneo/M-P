import * as THREE from 'three';
import gsap from 'gsap';
import { Terrain } from '../environment/Terrain.js';
import { Ocean } from '../environment/Ocean.js';
import { Atmosphere } from '../environment/Atmosphere.js';
import { BiomeFactory } from '../biomes/BiomeFactory.js';
import { BIOMES_CONFIG } from '../biomes/biomes-config.js';
import { Paths } from '../environment/Paths.js';
import { Player } from '../entities/Player.js';

export class IslandWorld {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.biomes = [];
    this.teleportMarkers = [];
    this.highlightedMarker = null;
    
    this.init();
  }

  init() {
    this.terrain = new Terrain();
    this.scene.add(this.terrain.mesh);

    this.ocean = new Ocean();
    this.scene.add(this.ocean.mesh);

    this.atmosphere = new Atmosphere();
    this.scene.add(this.atmosphere.group);

    this.paths = new Paths(BIOMES_CONFIG);
    this.scene.add(this.paths.group);

    this.player = new Player(this.scene, this.camera, this.terrain);

    this.biomeFactory = new BiomeFactory();
    this.nftCards = [];
    BIOMES_CONFIG.forEach(config => {
      const biome = this.biomeFactory.create(config);
      this.biomes.push(biome);
      this.scene.add(biome.group);
      this.teleportMarkers.push(biome.marker);
      if (biome.nftCard) this.nftCards.push(biome.nftCard);
    });
  }

  getInteractiveObjects() {
    return [...this.teleportMarkers, ...this.nftCards];
  }

  highlightMarker(object) {
    if (this.highlightedMarker) {
      gsap.to(this.highlightedMarker.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.3
      });
    }

    if (object) {
      let marker = object;
      while (marker && !marker.userData.isTeleport) {
        marker = marker.parent;
      }
      if (marker) {
        this.highlightedMarker = marker;
        gsap.to(marker.scale, {
          x: 1.3, y: 1.3, z: 1.3,
          duration: 0.3
        });
      }
    } else {
      this.highlightedMarker = null;
    }
  }

  update(time, delta, controls) {
    this.ocean.update(time);
    this.atmosphere.update(time);
    this.paths.update(time);
    this.biomes.forEach(biome => biome.update(time, delta));
    this.player.update(time, delta, controls);
  }
}
