import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ShelfProps {
  onProjectClick: (projectId: number) => void;
}

export function Shelf({ onProjectClick }: ShelfProps) {
  return (
    <group>
      {/* Shelf back */}
      <mesh position={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Shelf platforms */}
      {[0, 0.7, 1.4].map((y, i) => (
        <mesh key={i} position={[0, y - 0.5, 0]} castShadow>
          <boxGeometry args={[2.8, 0.05, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Project cubes */}
      {[
        { pos: [-1, 0, 0], id: 0, color: '#7b1f27' },
        { pos: [0, 0, 0], id: 1, color: '#d4af37' },
        { pos: [1, 0, 0], id: 2, color: '#cfcfcf' },
        { pos: [-0.5, 0.7, 0], id: 3, color: '#d4af37' },
        { pos: [0.5, 0.7, 0], id: 4, color: '#7b1f27' },
      ].map((item, i) => (
        <ProjectCube
          key={i}
          position={item.pos as [number, number, number]}
          color={item.color}
          onClick={() => onProjectClick(item.id)}
        />
      ))}
    </group>
  );
}

function ProjectCube({
  position,
  color,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <mesh
        ref={meshRef}
        position={position}
        userData={{ interactive: true, objectType: 'cube' }}
        onClick={(e) => {
          console.log('Cube clicked!', color, e);
          e.stopPropagation();
          onClick();
        }}
        onPointerDown={(e) => {
          console.log('Cube pointer down!', color, e);
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          console.log('Cube hover start', color);
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          console.log('Cube hover end', color);
          e.stopPropagation();
          setHovered(false);
        }}
        castShadow
        receiveShadow
        scale={hovered ? 1.2 : 1}
      >
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.1}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {hovered && (
        <Html position={[position[0], position[1] + 0.3, position[2]]} center>
          <div
            style={{
              color: '#cfcfcf',
              fontSize: '12px',
              fontWeight: 'bold',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            View Project
          </div>
        </Html>
      )}
    </>
  );
}
