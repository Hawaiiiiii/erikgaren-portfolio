# Replacing Placeholder Geometry with Real Assets

This guide explains how to replace the current placeholder 3D objects with real models exported from Blender.

## Prerequisites

- Blender 3.0+ installed
- Basic knowledge of Blender modeling
- GLTF/GLB export capability in Blender

## Export Settings in Blender

### Step 1: Prepare Your Model

1. Open your scene in Blender
2. Ensure all objects are properly named (e.g., "Desk", "Monitor", "Shelf")
3. Apply all transformations (Ctrl+A → All Transforms)
4. Check that materials use Principled BSDF
5. UV unwrap all meshes if using textures

### Step 2: Export as GLB

1. File → Export → glTF 2.0
2. Configure export settings:
   - **Format**: glTF Binary (.glb)
   - **Include**: 
     - ✓ Selected Objects (or ✓ Visible Objects)
     - ✓ Custom Properties
     - ✓ Cameras (if needed)
     - ✓ Punctual Lights
   - **Transform**:
     - ✓ +Y Up
   - **Geometry**:
     - ✓ Apply Modifiers
     - ✓ UVs
     - ✓ Normals
     - ✓ Tangents
     - ✓ Vertex Colors
   - **Materials**:
     - ✓ Export Materials (PBR Metallic-Roughness)
   - **Compression**:
     - ✓ Compress (Draco) - for smaller file sizes
3. Export to `public/models/Studio.glb`

### Step 3: Optimize File Size

Keep the total model size under 10MB:

- Use Draco compression
- Reduce polygon count where possible
- Compress textures (2K max for most surfaces)
- Use texture atlases to minimize texture files

## Integration Guide

### Option 1: Single GLB Scene (Recommended)

Replace the entire scene with one comprehensive model:

**File**: `src/components/Scene.tsx`

```tsx
import { useGLTF } from '@react-three/drei';

function StudioScene({ onMonitorClick, onProjectClick, onDoorClick }: SceneProps) {
  const { scene, nodes } = useGLTF('/models/Studio.glb');
  
  // Clone the scene to avoid mutation issues
  const clonedScene = scene.clone();

  return <primitive object={clonedScene} />;
}

// Preload for better performance
useGLTF.preload('/models/Studio.glb');

export function Scene(props: SceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
      <OrbitControls {...controlSettings} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#d4af37" />
      
      <color attach="background" args={['#0e0e0e']} />
      
      <StudioScene {...props} />
    </>
  );
}
```

### Option 2: Individual Objects

Replace each placeholder component with its real model:

**Example - Desk Component**:

```tsx
// src/components/objects/Desk.tsx
import { useGLTF } from '@react-three/drei';

export function Desk() {
  const { nodes, materials } = useGLTF('/models/desk.glb');
  
  return (
    <group>
      <mesh
        geometry={nodes.DeskSurface.geometry}
        material={materials.Wood}
        castShadow
        receiveShadow
      />
      {/* Add other desk parts */}
    </group>
  );
}

useGLTF.preload('/models/desk.glb');
```

## Adding Interactions

### Clickable Objects

To make objects clickable in your imported model:

```tsx
import { useGLTF } from '@react-three/drei';

export function Monitor({ onClick }: { onClick: () => void }) {
  const { nodes, materials } = useGLTF('/models/monitor.glb');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  return (
    <mesh
      geometry={nodes.MonitorScreen.geometry}
      material={materials.Screen}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    />
  );
}
```

### Animated Objects

For objects that should animate (like the Orbis sphere):

```tsx
export function Orbis() {
  const { nodes, materials } = useGLTF('/models/orbis.glb');
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={nodes.Sphere.geometry}
      material={materials.Metal}
      castShadow
    />
  );
}
```

## Material Customization

### Emissive Materials

To replicate the gold emissive effect from placeholders:

```tsx
<mesh geometry={nodes.Screen.geometry}>
  <meshStandardMaterial
    color="#d4af37"
    emissive="#d4af37"
    emissiveIntensity={0.4}
    metalness={0.8}
    roughness={0.3}
  />
</mesh>
```

### PBR Materials

For realistic materials, use the PBR workflow:

```tsx
<mesh geometry={nodes.Surface.geometry}>
  <meshStandardMaterial
    map={colorTexture}           // Base color
    normalMap={normalTexture}     // Surface detail
    roughnessMap={roughnessTexture}
    metalnessMap={metalnessTexture}
    aoMap={aoTexture}             // Ambient occlusion
  />
</mesh>
```

## Texture Loading

Load textures with useTexture from drei:

```tsx
import { useTexture } from '@react-three/drei';

export function CustomObject() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/textures/color.jpg',
    '/textures/normal.jpg',
    '/textures/roughness.jpg',
  ]);

  return (
    <mesh>
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
}
```

## Lighting Adjustments

When adding real models, you may need to adjust lighting:

```tsx
<Scene>
  {/* Ambient - overall scene illumination */}
  <ambientLight intensity={0.3} />
  
  {/* Directional - main light source (sun) */}
  <directionalLight
    position={[10, 10, 5]}
    intensity={1.5}
    castShadow
    shadow-mapSize={[2048, 2048]}
  />
  
  {/* Point lights - accent lighting */}
  <pointLight position={[-5, 5, -5]} intensity={0.5} color="#d4af37" />
  <pointLight position={[5, 3, 5]} intensity={0.3} color="#7b1f27" />
  
  {/* Spotlight - focused lighting */}
  <spotLight
    position={[0, 10, 0]}
    angle={0.3}
    penumbra={1}
    intensity={1}
    castShadow
  />
</Scene>
```

## Environment Maps

For better reflections and lighting:

```tsx
import { Environment } from '@react-three/drei';

<Scene>
  {/* Use preset environments */}
  <Environment preset="studio" />
  
  {/* Or load custom HDR */}
  <Environment files="/hdri/studio.hdr" />
</Scene>
```

## Camera Positioning

Adjust camera based on your scene scale:

```tsx
<PerspectiveCamera
  makeDefault
  position={[8, 6, 8]}  // Adjust these values
  fov={50}               // Field of view
/>

<OrbitControls
  target={[0, 2, 0]}    // Look at point
  minDistance={3}
  maxDistance={25}
  minPolarAngle={0}
  maxPolarAngle={Math.PI / 2}
/>
```

## Performance Tips

1. **Use Draco Compression**:
```tsx
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
```

2. **LOD (Level of Detail)**:
```tsx
import { Detailed } from '@react-three/drei';

<Detailed distances={[0, 10, 20]}>
  <HighPolyModel />
  <MediumPolyModel />
  <LowPolyModel />
</Detailed>
```

3. **Instancing for Repeated Objects**:
```tsx
import { Instances, Instance } from '@react-three/drei';

<Instances geometry={boxGeometry} material={material}>
  <Instance position={[0, 0, 0]} />
  <Instance position={[2, 0, 0]} />
  <Instance position={[4, 0, 0]} />
</Instances>
```

## Debugging

Check model structure:

```tsx
const { scene } = useGLTF('/models/Studio.glb');

useEffect(() => {
  console.log('Scene structure:', scene);
  scene.traverse((child) => {
    console.log('Object:', child.name, child.type);
  });
}, [scene]);
```

## Testing Checklist

After replacing placeholders:

- [ ] Model loads without errors
- [ ] All materials render correctly
- [ ] Click interactions work
- [ ] Hover effects function
- [ ] Animations play smoothly
- [ ] Shadows render properly
- [ ] Performance is acceptable (60fps)
- [ ] File size is under 10MB
- [ ] Mobile performance is adequate

## Example Complete Component

```tsx
import { useGLTF } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CompleteStudio({ onMonitorClick, onProjectClick, onDoorClick }) {
  const { scene, nodes, materials } = useGLTF('/models/Studio.glb');
  const [hovered, setHovered] = useState(null);

  return (
    <group>
      {/* Static objects */}
      <primitive object={nodes.Desk} />
      <primitive object={nodes.Floor} />
      
      {/* Interactive monitor */}
      <mesh
        geometry={nodes.Monitor.geometry}
        material={materials.Screen}
        onClick={(e) => {
          e.stopPropagation();
          onMonitorClick();
        }}
        onPointerOver={() => setHovered('monitor')}
        onPointerOut={() => setHovered(null)}
      >
        <meshStandardMaterial
          {...materials.Screen}
          emissiveIntensity={hovered === 'monitor' ? 0.8 : 0.4}
        />
      </mesh>
      
      {/* Project cubes */}
      {[0, 1, 2, 3, 4].map((id) => (
        <mesh
          key={id}
          geometry={nodes[`ProjectCube${id}`].geometry}
          material={materials.ProjectMaterial}
          onClick={() => onProjectClick(id)}
          scale={hovered === `project${id}` ? 1.2 : 1}
          onPointerOver={() => setHovered(`project${id}`)}
          onPointerOut={() => setHovered(null)}
        />
      ))}
      
      {/* Door */}
      <mesh
        geometry={nodes.Door.geometry}
        material={materials.DoorMaterial}
        onClick={onDoorClick}
        onPointerOver={() => setHovered('door')}
        onPointerOut={() => setHovered(null)}
      />
    </group>
  );
}

useGLTF.preload('/models/Studio.glb');
```

## Support

For issues or questions about asset integration, refer to:
- [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js documentation](https://threejs.org/docs/)
- [Blender GLTF export docs](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
