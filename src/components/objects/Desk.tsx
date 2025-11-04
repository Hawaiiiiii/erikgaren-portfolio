import { useRef } from 'react';
import * as THREE from 'three';

export function Desk() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={[0, 0, 0]}>
      {/* Desk surface */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Desk legs */}
      {[
        [-1.8, 0.5, 0.8],
        [1.8, 0.5, 0.8],
        [-1.8, 0.5, -0.8],
        [1.8, 0.5, -0.8],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
}
