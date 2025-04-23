import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Loads a GLTF model with support for DRACO compression
 * @param path - Path to the GLTF/GLB file
 * @param onProgress - Optional progress callback
 * @returns Promise resolving to the loaded GLTF object
 */
export function loadGLTFModel(
  path: string,
  onProgress?: (event: ProgressEvent) => void
): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    // Create loaders
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    
    // Configure DRACOLoader
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    
    // Load the model
    loader.load(
      path,
      (gltf) => resolve(gltf),
      (xhr) => {
        if (onProgress) {
          onProgress(xhr);
        }
      },
      (error) => reject(error)
    );
  });
}

/**
 * Applies a color to all materials in a 3D model
 * @param model - The 3D model object
 * @param color - The color to apply (hex string)
 */
export function applyColorToModel(model: THREE.Object3D, color: string): void {
  model.traverse((object) => {
    if (object instanceof THREE.Mesh && object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => {
          if (material.color) {
            material.color.set(color);
          }
        });
      } else if (object.material.color) {
        object.material.color.set(color);
      }
    }
  });
}

/**
 * Finds a specific mesh in a model by name
 * @param model - The 3D model object
 * @param name - The name of the mesh to find
 * @returns The found mesh or undefined
 */
export function findMeshByName(model: THREE.Object3D, name: string): THREE.Mesh | undefined {
  let foundMesh: THREE.Mesh | undefined;
  
  model.traverse((object) => {
    if (object instanceof THREE.Mesh && object.name === name) {
      foundMesh = object;
    }
  });
  
  return foundMesh;
}

/**
 * Creates a texture plane for a logo
 * @param texturePath - Path to the texture image
 * @param width - Width of the plane
 * @param height - Height of the plane
 * @returns A mesh with the texture applied
 */
export function createLogoPlane(
  texturePath: string,
  width: number = 1,
  height: number = 1
): THREE.Mesh {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(texturePath);
  
  // Create material with the texture
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 1
  });
  
  // Create geometry and mesh
  const geometry = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geometry, material);
  
  return mesh;
}

/**
 * Calculates the bounding box of a model
 * @param model - The 3D model object
 * @returns The bounding box
 */
export function getBoundingBox(model: THREE.Object3D): THREE.Box3 {
  const boundingBox = new THREE.Box3().setFromObject(model);
  return boundingBox;
}

/**
 * Positions a logo on a model based on a specific face
 * @param logoMesh - The logo mesh to position
 * @param model - The model to place the logo on
 * @param face - The face direction ('front', 'back', 'left', 'right', 'top', 'bottom')
 * @param padding - Padding from the edge of the model
 */
export function positionLogoOnModelFace(
  logoMesh: THREE.Mesh,
  model: THREE.Object3D,
  face: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom',
  padding: number = 0.1
): void {
  // Get model dimensions
  const boundingBox = getBoundingBox(model);
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);
  
  // Set position and rotation based on face
  switch (face) {
    case 'front':
      logoMesh.position.set(center.x, center.y, boundingBox.max.z + padding);
      logoMesh.rotation.set(0, 0, 0);
      break;
    case 'back':
      logoMesh.position.set(center.x, center.y, boundingBox.min.z - padding);
      logoMesh.rotation.set(0, Math.PI, 0);
      break;
    case 'left':
      logoMesh.position.set(boundingBox.min.x - padding, center.y, center.z);
      logoMesh.rotation.set(0, -Math.PI / 2, 0);
      break;
    case 'right':
      logoMesh.position.set(boundingBox.max.x + padding, center.y, center.z);
      logoMesh.rotation.set(0, Math.PI / 2, 0);
      break;
    case 'top':
      logoMesh.position.set(center.x, boundingBox.max.y + padding, center.z);
      logoMesh.rotation.set(Math.PI / 2, 0, 0);
      break;
    case 'bottom':
      logoMesh.position.set(center.x, boundingBox.min.y - padding, center.z);
      logoMesh.rotation.set(-Math.PI / 2, 0, 0);
      break;
  }
}

/**
 * Load a texture from a path
 * @param path - Path to the texture
 * @returns Promise that resolves to the loaded texture
 */
export function loadTexture(path: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      path,
      (texture) => resolve(texture),
      undefined,
      (error) => reject(error)
    );
  });
}

/**
 * Creates a simple environment map
 * @param path - Path to the environment map texture
 * @returns The environment map texture
 */
export function createEnvironmentMap(path: string): THREE.CubeTexture {
  const loader = new THREE.CubeTextureLoader();
  const envMap = loader.load([
    `${path}/px.jpg`, `${path}/nx.jpg`,
    `${path}/py.jpg`, `${path}/ny.jpg`,
    `${path}/pz.jpg`, `${path}/nz.jpg`
  ]);
  
  return envMap;
}

/**
 * Create a screenshot of the current Three.js scene
 * @param renderer - The Three.js renderer
 * @param scene - The scene to capture
 * @param camera - The camera to use for the capture
 * @returns Data URL of the screenshot
 */
export function takeScreenshot(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera
): string {
  // Render the scene
  renderer.render(scene, camera);
  
  // Get the canvas data URL
  const dataURL = renderer.domElement.toDataURL('image/png');
  
  return dataURL;
}

/**
 * Animates a model by smoothly changing its rotation
 * @param model - The model to animate
 * @param targetRotation - The target rotation
 * @param duration - The duration of the animation in milliseconds
 */
export function animateModelRotation(
  model: THREE.Object3D,
  targetRotation: THREE.Euler,
  duration: number = 1000
): void {
  // Store initial rotation
  const startRotation = model.rotation.clone();
  const startTime = Date.now();
  
  // Animation function
  function animate() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    // Update rotation using linear interpolation
    model.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * progress;
    model.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * progress;
    model.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * progress;
    
    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  // Start animation
  animate();
}

/**
 * Creates a reflective material
 * @param color - Base color of the material
 * @param metalness - How metallic the material appears (0-1)
 * @param roughness - How rough the material appears (0-1)
 * @returns The created material
 */
export function createReflectiveMaterial(
  color: string | number = 0xffffff,
  metalness: number = 0.9,
  roughness: number = 0.1
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness,
    roughness
  });
}

/**
 * Disposes of all resources used by a 3D model to prevent memory leaks
 * @param model - The model to dispose
 */
export function disposeModel(model: THREE.Object3D): void {
  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(object.material);
        }
      }
    }
  });
}

/**
 * Helper function to dispose of a material and its textures
 * @param material - The material to dispose
 */
function disposeMaterial(material: THREE.Material): void {
  // Dispose textures
  Object.keys(material).forEach((propertyName) => {
    const value = (material as any)[propertyName];
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });
  
  // Dispose material
  material.dispose();
}

/**
 * Centers a model at the origin and scales it to fit within a given size
 * @param model - The model to center and normalize
 * @param maxSize - The maximum size in any dimension
 */
export function centerAndNormalizeModel(model: THREE.Object3D, maxSize: number = 1): void {
  // Calculate bounding box
  const boundingBox = getBoundingBox(model);
  
  // Get model center and size
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);
  
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  
  // Calculate scale factor
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scaleFactor = maxSize / maxDimension;
  
  // Center the model
  model.position.sub(center);
  
  // Scale the model
  model.scale.multiplyScalar(scaleFactor);
}