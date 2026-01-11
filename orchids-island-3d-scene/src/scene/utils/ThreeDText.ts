import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

let font: Font | null = null;
const loader = new FontLoader();

export const loadFont = (): Promise<Font> => {
    return new Promise((resolve, reject) => {
        if (font) {
            resolve(font);
            return;
        }
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (loadedFont) => {
            font = loadedFont;
            resolve(font);
        }, undefined, (err) => {
            console.error('Failed to load font', err);
            reject(err);
        });
    });
};

export const createComicTitle = async (text: string, color: number = 0xffd700): Promise<THREE.Group | null> => {
    try {
        const loadedFont = await loadFont();
        
        const geometry = new TextGeometry(text, {
            font: loadedFont,
            size: 15,
            height: 4,
            depth: 4,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelOffset: 0,
            bevelSegments: 3
        });

        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
            const xOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xOffset, 0, 0);
        }

        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.1,
            emissive: color,
            emissiveIntensity: 0.2
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
        const outlineMesh = new THREE.Mesh(geometry, outlineMat);
        outlineMesh.scale.multiplyScalar(1.05);
        
        const textGroup = new THREE.Group();
        textGroup.add(outlineMesh);
        textGroup.add(mesh);

        const padding = 10;
        const width = geometry.boundingBox ? (geometry.boundingBox.max.x - geometry.boundingBox.min.x) + padding * 2 : 100;
        const height = geometry.boundingBox ? (geometry.boundingBox.max.y - geometry.boundingBox.min.y) + padding * 2 : 40;
        
        const shape = new THREE.Shape();
        const r = 5;
        const w = width;
        const h = height;
        const x = -w/2;
        const y = -h/2 + 2;

        shape.moveTo(x + r, y);
        shape.lineTo(x + w - r, y);
        shape.quadraticCurveTo(x + w, y, x + w, y + r);
        shape.lineTo(x + w, y + h - r);
        shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        shape.lineTo(x + r, y + h);
        shape.quadraticCurveTo(x, y + h, x, y + h - r);
        shape.lineTo(x, y + r);
        shape.quadraticCurveTo(x, y, x + r, y);

        const bubbleGeo = new THREE.ExtrudeGeometry(shape, {
            depth: 2,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 3
        });

        const bubbleMat = new THREE.MeshToonMaterial({ color: 0xFFFFFF });
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.z = -3;
        
        const bubbleOutlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
        const bubbleOutline = new THREE.Mesh(bubbleGeo, bubbleOutlineMat);
        bubbleOutline.scale.multiplyScalar(1.02);
        bubbleOutline.position.z = -3;
        
        const fullGroup = new THREE.Group();
        fullGroup.add(bubbleOutline);
        fullGroup.add(bubble);
        fullGroup.add(textGroup);

        return fullGroup;
    } catch (e) {
        console.error("Error creating 3D text:", e);
        return null;
    }
};
