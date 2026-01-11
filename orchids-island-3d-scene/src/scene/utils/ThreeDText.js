import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

let font = null;
const loader = new FontLoader();

// Charger la police une seule fois
export const loadFont = () => {
    return new Promise((resolve, reject) => {
        if (font) {
            resolve(font);
            return;
        }
        // Utilisation de la police Helvetiker Bold standard de Three.js (via CDN fiable pour l'exemple)
        // Dans un projet prod, il faudrait l'avoir en local
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (loadedFont) => {
            font = loadedFont;
            resolve(font);
        }, undefined, (err) => {
            console.error('Failed to load font', err);
            // Fallback si échec (ne devrait pas arriver si online)
            reject(err);
        });
    });
};

export const createComicTitle = async (text, color = 0xffd700) => {
    try {
        const loadedFont = await loadFont();
        
        const geometry = new TextGeometry(text, {
            font: loadedFont,
            size: 15, // Grand
            height: 4, // Épaisseur 3D (anciennement height, maintenant depth souvent, mais TextGeometry args c'est height/depth selon version)
            depth: 4, // Pour être sûr
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelOffset: 0,
            bevelSegments: 3
        });

        geometry.computeBoundingBox();
        const xOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xOffset, 0, 0);

        // Matériau Face: Couleur vive + Emissive pour briller un peu
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.1,
            emissive: color,
            emissiveIntensity: 0.2
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Outline Noir sur le texte (Technique BackSide Scale)
        const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
        const outlineMesh = new THREE.Mesh(geometry, outlineMat);
        outlineMesh.scale.multiplyScalar(1.05); // +5% taille pour contour net
        
        const textGroup = new THREE.Group();
        textGroup.add(outlineMesh);
        textGroup.add(mesh);

        // --- COMIC BUBBLE (Bulle de BD) ---
        // Création d'une forme de bulle dynamique autour du texte
        const padding = 10;
        const width = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) + padding * 2;
        const height = (geometry.boundingBox.max.y - geometry.boundingBox.min.y) + padding * 2;
        
        // Forme arrondie (Rounded Rectangle)
        const shape = new THREE.Shape();
        const r = 5; // Rayon des coins
        const w = width;
        const h = height;
        const x = -w/2;
        const y = -h/2 + 2; // Ajustement vertical

        shape.moveTo(x + r, y);
        shape.lineTo(x + w - r, y);
        shape.quadraticCurveTo(x + w, y, x + w, y + r);
        shape.lineTo(x + w, y + h - r);
        shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        shape.lineTo(x + r, y + h);
        shape.quadraticCurveTo(x, y + h, x, y + h - r);
        shape.lineTo(x, y + r);
        shape.quadraticCurveTo(x, y, x + r, y);

        // Extrusion de la bulle
        const bubbleGeo = new THREE.ExtrudeGeometry(shape, {
            depth: 2,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 3
        });

        const bubbleMat = new THREE.MeshToonMaterial({ color: 0xFFFFFF }); // Blanc pur
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.z = -3; // Derrière le texte
        
        // Outline de la bulle
        const bubbleOutlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
        const bubbleOutline = new THREE.Mesh(bubbleGeo, bubbleOutlineMat);
        bubbleOutline.scale.multiplyScalar(1.02);
        bubbleOutline.position.z = -3;

        // Pointe de la bulle (optionnel, vers le bas)
        // Pour un titre flottant, une bulle simple est souvent plus propre.
        
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
