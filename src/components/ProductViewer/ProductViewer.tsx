'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree ,Decal } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei';
import { TextureLoader, Mesh, Color, Vector3, Euler,PerspectiveCamera,Group,Texture,DoubleSide  } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { setupModelPosition, setupCameraForModel } from '../../utils/modelPositioning';

// Type for logo settings
interface LogoSettings {
  visible: Boolean;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  customImage?:string;
}

// Props for the ProductViewer component
interface ProductViewerProps {
  productColor: string;
  logoSettings: LogoSettings;
}

// Props for the Product model component
interface ProductModelProps {
  color: string;
  logoSettings: LogoSettings;
}

// Function to handle product model loading and manipulation
function ProductModel({ color, logoSettings }: ProductModelProps) {
  const modelRef = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);
  const { scene: sceneRef, camera } = useThree();
  
  // Get access to the controls
  const controlsRef = useRef<any>(null);
  useEffect(() => {
    // Find OrbitControls in the parent component
    const controls = sceneRef.userData.controls;
    if (controls) {
      controlsRef.current = controls;
    }
  }, [sceneRef]);
  
  // Load the logo texture with React Three Fiber's useLoader
  const defaultLogoTexture = useLoader(TextureLoader, '/textures/logo.png');
  const [customLogoTexture, setCustomLogoTexture] = useState<Texture | null>(null);


  const logoTexture = customLogoTexture || defaultLogoTexture;


    // Load custom logo if provided
  useEffect(() => {
    if (logoSettings.customImage) {
      const loader = new TextureLoader();
      loader.load(
        logoSettings.customImage,
        (texture) => {
          setCustomLogoTexture(texture);
        },
        undefined,
        (error) => {
         console.error('Error loading custom logo:', error);
        }
      );
    } else {
      setCustomLogoTexture(null);
    }
  }, [logoSettings.customImage]);

  // Use a direct GLTFLoader approach within useEffect
  useEffect(() => {
    // Create loader instances
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    
    // Configure DRACOLoader
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    
    // Load the model
    loader.load(
      // Resource URL (from public directory)
      '/models/product.glb',
      
      // Called when resource is loaded
      (gltf) => {
        if (modelRef.current) {
          // Clear any existing model
          while (modelRef.current.children.length) {
            modelRef.current.remove(modelRef.current.children[0]);
          }
          
          // Get the model
          const model = gltf.scene;
          
          // Apply our positioning utility
          setupModelPosition(model);
          
          // Add the loaded model to our ref
          modelRef.current.add(model);
          
          // Store the model for material updates
          setModel(model);
          
          // Set up camera if controls are available
          if (controlsRef.current && camera instanceof PerspectiveCamera) {
            setupCameraForModel(camera, controlsRef.current, model);
          }
          
          // Apply initial color
          model.traverse((object) => {
            if (object instanceof Mesh && object.material) {
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
      },
      
      // Called while loading is progressing
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      
      // Called when loading has errors
      (error) => {
        console.error('An error happened during model loading:', error);
      }
    );
    
    // Cleanup function
    return () => {
      dracoLoader.dispose();
    };
  }, []); // Only run on component mount
  
  // Update model color when color prop changes
  useEffect(() => {
    if (model) {
      model.traverse((object) => {
        if (object instanceof Mesh && object.material) {
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
  }, [color, model]);

  // Animation loop
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Optional: Add subtle animation
      // modelRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={modelRef}>
      {/* The model will be loaded and added to this group by the useEffect */}
      
      {/* Logo plane (only visible if enabled) */}
      {logoSettings.visible && (
        <mesh
          position={[
            logoSettings.position.x, //-1.6
            logoSettings.position.y,  //-0.3
            logoSettings.position.z  //1.5
          ]}
          rotation={[
            logoSettings.rotation.x, //292 degree
            logoSettings.rotation.y, //355 degree
            logoSettings.rotation.z
          ]}
          scale={logoSettings.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            map={logoTexture} 
            transparent={true}
            depthTest = {true}
            depthWrite = {false} 
            opacity={1}
          />
        </mesh>
      )}
    </group>
  );
}

// Component to display loading state
function Loader() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <span className="ml-2 text-lg">Loading 3D Model...</span>
      </div>
    </Html>
  );
}

// Main ProductViewer component
export default function ProductViewer({ productColor, logoSettings }: ProductViewerProps) {
  // Create a reference to the camera
  const cameraRef = useRef<PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [-5, 2, 5], fov: 35 }}
        style={{ background: '#e7e7e7' }}
        onCreated={({ scene, gl, camera }) => {
          // Store camera reference for easy access in other components
          if (cameraRef.current) {
            cameraRef.current = camera as PerspectiveCamera;
          }
        }}
      >
        <ambientLight intensity={0.2} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.45} 
          penumbra={1} 
          intensity={0.3} 
          castShadow 
        />
        
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <Suspense fallback={<Loader />}>
            <ProductModel 
            color={productColor} 
            logoSettings={logoSettings} 
                />
          <Environment preset="city" />
          <ContactShadows 
            opacity={1} 
            scale={8} 
            blur={5} 
            far={10} 
            resolution={256} 
            position={[0.1, -1, 0]} 
          />
          <ContactShadows 
            opacity={1} 
            scale={8} 
            blur={5} 
            far={10} 
            resolution={256} 
            position={[-0.185, -1, 0]} 
          />
          
        </Suspense>
        
        <OrbitControls 
          ref={controlsRef}
          makeDefault  // This makes the controls available through scene.userData.controls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minDistance={2}
          maxDistance={10}
          // Add a slight auto rotation if desired
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// No longer need preload as we're using our own loader
// useGLTF.preload('/models/product.glb');