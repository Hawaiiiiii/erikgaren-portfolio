import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface MonitorProps {
  onClick: () => void;
}

export function Monitor({ onClick }: MonitorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = hovered ? 0.8 : 0.4;
    }
  });

  return (
    <group name="Monitor">
      {/* Screen */}
      <mesh
        ref={meshRef}
        userData={{ interactive: true, objectType: 'monitor' }}
        onClick={(e) => {
          console.log('Monitor clicked!', e);
          e.stopPropagation();
          onClick();
        }}
        onPointerDown={(e) => {
          console.log('Monitor pointer down!', e);
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          console.log('Monitor hover start');
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          console.log('Monitor hover end');
          e.stopPropagation();
          setHovered(false);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.6, 0.9, 0.05]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Screen stand */}
      <mesh position={[0, -0.6, 0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Base */}
      <mesh position={[0, -0.85, 0.3]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Hover indicator */}
      {hovered && (
        <Html position={[0, 0.6, 0]} center>
          <div style={{
            color: '#d4af37',
            fontSize: '14px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            About Me
          </div>
        </Html>
      )}
    </group>
  );
}
