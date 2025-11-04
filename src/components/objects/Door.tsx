import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface DoorProps {
  onClick: () => void;
}

export function Door({ onClick }: DoorProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group name="Door">
      {/* Door frame */}
      <mesh position={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[1.2, 2.5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Door */}
      <mesh
        ref={meshRef}
        userData={{ interactive: true, objectType: 'door' }}
        onClick={(e) => {
          console.log('Door clicked!', e);
          e.stopPropagation();
          onClick();
        }}
        onPointerDown={(e) => {
          console.log('Door pointer down!', e);
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          console.log('Door hover start');
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          console.log('Door hover end');
          e.stopPropagation();
          setHovered(false);
        }}
        castShadow
        receiveShadow
        scale={hovered ? [1.05, 1.05, 1] : [1, 1, 1]}
      >
        <boxGeometry args={[1, 2.3, 0.05]} />
        <meshStandardMaterial
          color="#7b1f27"
          emissive="#7b1f27"
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.4, 0, 0.05]} castShadow>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>

      {/* Hover indicator */}
      {hovered && (
        <Html position={[0, 1.5, 0.1]} center>
          <div
            style={{
              color: '#d4af37',
              fontSize: '14px',
              fontWeight: 'bold',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Contact
          </div>
        </Html>
      )}
    </group>
  );
}
