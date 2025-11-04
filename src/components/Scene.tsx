import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Desk } from './objects/Desk';
import { Monitor } from './objects/Monitor';
import { Orbis } from './objects/Orbis';
import { Shelf } from './objects/Shelf';
import { Door } from './objects/Door';
import { useRaycaster } from '../hooks/useRaycaster';

interface SceneProps {
  onMonitorClick: () => void;
  onProjectClick: (projectId: number) => void;
  onDoorClick: () => void;
}

export function Scene({ onMonitorClick, onProjectClick, onDoorClick }: SceneProps) {
  const { camera, gl, scene } = useThree();
  const monitorRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);
  const shelfRef = useRef<THREE.Group>(null);
  
  // Direct event listener approach - WORKING!
  useEffect(() => {
    const canvas = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Raycast against interactive groups
      const interactiveObjects = [
        monitorRef.current,
        doorRef.current,
        shelfRef.current
      ].filter(obj => obj !== null) as THREE.Object3D[];
      
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        console.log('🎯 Clicked:', hit.name || hit.type);
        
        // Check userData on hit object first, then traverse up parent chain
        let current: THREE.Object3D | null = hit;
        while (current) {
          const userData = current.userData;
          
          // Check if this object or its parent has interactive userData
          if (userData?.interactive && userData?.objectType) {
            const objType = userData.objectType;
            console.log('🎯 Interactive object detected:', objType, 'from', current.type, current.name);
            
            if (objType === 'monitor') {
              console.log('✅ MONITOR CLICKED!');
              onMonitorClick();
              return;
            }
            if (objType === 'door') {
              console.log('✅ DOOR CLICKED!');
              onDoorClick();
              return;
            }
            if (objType === 'cube') {
              console.log('✅ CUBE CLICKED!');
              onProjectClick(0);
              return;
            }
          }
          
          // Also check by reference and name as fallback
          if (current === monitorRef.current || current.name === 'MonitorGroup' || current.name === 'Monitor') {
            console.log('✅ MONITOR CLICKED! (fallback match)');
            onMonitorClick();
            return;
          }
          if (current === doorRef.current || current.name === 'DoorGroup' || current.name === 'Door') {
            console.log('✅ DOOR CLICKED! (fallback match)');
            onDoorClick();
            return;
          }
          if (current === shelfRef.current || current.name === 'ShelfGroup') {
            console.log('✅ SHELF CLICKED! (fallback match)');
            onProjectClick(0);
            return;
          }
          
          current = current.parent;
        }
        
        // If no specific object was matched
        console.log('ℹ️ No interactive object matched. Hit:', hit.type, hit.name, 'userData:', hit.userData);
      } else {
        console.log('ℹ️ No interactive objects in ray path');
      }
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [camera, gl, scene, onMonitorClick, onDoorClick, onProjectClick, monitorRef, doorRef, shelfRef]);

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
      
      {/* Controls */}
      <OrbitControls
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#d4af37" />

      {/* Background */}
      <color attach="background" args={['#0e0e0e']} />

      {/* Floor - explicitly excluded from raycasting */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
        name="floor"
        userData={{ isFloor: true }}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Scene Objects - wrapped in groups for click detection */}
      <Desk />
      <group ref={monitorRef} name="MonitorGroup" position={[0, 1.5, -0.5]} userData={{ objectType: 'monitor', interactive: true }}>
        <Monitor onClick={onMonitorClick} />
      </group>
      <Orbis />
      <group ref={shelfRef} name="ShelfGroup" position={[-3, 2, -2]} userData={{ objectType: 'cube', interactive: true }}>
        <Shelf onProjectClick={onProjectClick} />
      </group>
      <group ref={doorRef} name="DoorGroup" position={[4, 1.5, -3]} userData={{ objectType: 'door', interactive: true }}>
        <Door onClick={onDoorClick} />
      </group>
    </>
  );
}
