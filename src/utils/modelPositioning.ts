import * as THREE from 'three';

/**
 * Centers a model in the scene and adjusts its position and scale
 * @param model - The model to position
 */
export function setupModelPosition(model: THREE.Object3D): void {
  // Calculate the bounding box
  const boundingBox = new THREE.Box3().setFromObject(model);
  
  // Get model dimensions
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  
  // Get the center of the model
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);
  
  // Reset the model position and subtract the center
  model.position.sub(center);
  
  // Position the model so it's slightly above the ground plane
  model.position.y = -size.y / 10 + 0.2;
  
  // If model is too large or too small, scale it appropriately
  const maxDimension = Math.max(size.x, size.y, size.z);
  
  if (maxDimension > 5) {
    // Model is too large, scale it down
    const scale = 5 / maxDimension;
    model.scale.multiplyScalar(scale);
  } else if (maxDimension < 1) {
    // Model is too small, scale it up
    const scale = 2 / maxDimension;
    model.scale.multiplyScalar(scale);
  }
}

/**
 * Adjusts the camera to properly frame the model
 * @param camera - The camera to adjust
 * @param controls - The OrbitControls to adjust
 * @param model - The model to frame
 */
export function setupCameraForModel(
  camera: THREE.PerspectiveCamera,
  controls: any,
  model: THREE.Object3D
): void {
  // Calculate bounding box
  const boundingBox = new THREE.Box3().setFromObject(model);
  
  // Calculate the bounding sphere
  const boundingSphere = new THREE.Sphere();
  boundingBox.getBoundingSphere(boundingSphere);
  
  // Set camera position based on bounding sphere
  // Position camera at a distance that ensures the entire model is visible
  const radius = boundingSphere.radius / 1.2 ;
  const fov = camera.fov * (Math.PI / 150);
  const distance = radius / Math.sin(fov / 2);
  
  // Position camera at a good viewing angle (front-right-top)
  camera.position.set(
    distance * 1.2, // X - slightly to the right
    distance * 0.6, // Y - slightly above
    distance * 0.8  // Z - in front
  );
  
  // Set the controls target to the center of the model
  controls.target.copy(boundingSphere.center);
  
  // Update the camera and controls
  camera.lookAt(boundingSphere.center);
  camera.updateProjectionMatrix();
  controls.update();
  
  // Set appropriate near and far planes
  camera.near = distance * 0.1;
  camera.far = distance * 10;
  camera.updateProjectionMatrix();
  
  // Set appropriate control limits
  controls.minDistance = distance * 0.5;
  controls.maxDistance = distance * 2;
}

/**
 * Auto-rotates the model at a given speed
 * @param model - The model to rotate
 * @param speed - Rotation speed (radians per frame)
 */
export function autoRotateModel(model: THREE.Object3D, speed: number = 0): void {
  // This function should be called within an animation loop (useFrame)
  //model.rotation.y += speed;
}