# Development Guide

## Code Structure Details

### Main Application Flow

```
App.tsx
├── Canvas (3D Scene Container)
│   └── Scene.tsx
│       ├── Camera & Lighting Setup
│       ├── OrbitControls (User Navigation)
│       ├── Custom Raycaster (Click Detection)
│       └── 3D Objects
│           ├── Desk (Non-interactive)
│           ├── Monitor (Interactive → About)
│           ├── Orbis (Animated)
│           ├── Shelf with Cubes (Interactive → Projects)
│           └── Door (Interactive → Contact)
├── UIOverlay (2D UI Elements)
│   └── Navigation Buttons
└── Modals (Content Overlays)
    ├── About Modal
    ├── Projects Modal
    └── Contact Modal
```

### Key Files Explained

#### `src/App.tsx`
Main application component that manages:
- Modal state (which modal is open)
- Click handlers (onMonitorClick, onDoorClick, onProjectClick)
- Layout structure (Canvas + UI Overlay + Modals)

```typescript
function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  const handleMonitorClick = () => setActiveModal('about');
  const handleDoorClick = () => setActiveModal('contact');
  const handleProjectClick = () => setActiveModal('projects');
  
  return (
    <div className="w-full h-screen">
      <Canvas>{/* 3D Scene */}</Canvas>
      <UIOverlay />
      <Modal isOpen={activeModal === 'about'}>
        <AboutContent />
      </Modal>
    </div>
  );
}
```

#### `src/components/Scene.tsx`
3D scene setup with **custom raycaster implementation**:

**Why Custom Raycaster?**
- React Three Fiber's declarative events (`onClick`) don't work reliably in production
- Need precise control over click detection
- Better performance with optimized raycasting

**Implementation:**
1. Create raycaster and mouse vector
2. Listen to canvas click events
3. Convert mouse position to normalized device coordinates
4. Cast ray from camera through mouse position
5. Check intersections with scene objects
6. Identify object via `userData.objectType`
7. Trigger appropriate modal handler

**Floor Filtering:**
```typescript
// Filter out floor and non-interactive objects
const intersects = allIntersects.filter(hit => {
  const obj = hit.object;
  // Skip floor mesh (positioned at y=0 with negative x rotation)
  if (obj.position.y === 0 && obj.rotation.x < 0) return false;
  return true;
});
```

#### `src/components/objects/Monitor.tsx`
Interactive 3D object example:

```typescript
export function Monitor({ onClick }: MonitorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animation loop - updates emissive intensity on hover
  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = hovered ? 0.8 : 0.4;
    }
  });

  return (
    <group position={[0, 1.5, -0.5]} name="Monitor">
      <mesh
        ref={meshRef}
        userData={{ interactive: true, objectType: 'monitor' }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
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
    </group>
  );
}
```

**Key Points:**
- `userData` object tags the mesh for raycaster identification
- `useFrame` hook runs every frame for smooth animations
- `castShadow` enables shadow rendering
- Emissive properties create glowing effect

#### `src/components/Modal.tsx`
Reusable modal component with animation:

```typescript
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-neutral-900 rounded-lg p-8 max-w-2xl">
        <button onClick={onClose}>×</button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
```

## 3D Object userData Pattern

All interactive objects follow this pattern:

```typescript
<mesh
  userData={{
    interactive: true,      // Marks as clickable
    objectType: 'monitor'   // Identifies which object ('monitor', 'door', 'cube')
  }}
>
  {/* geometry and material */}
</mesh>
```

Then in Scene.tsx raycaster:

```typescript
const hit = intersects[0].object;

if (hit.userData?.interactive && hit.userData?.objectType) {
  switch (hit.userData.objectType) {
    case 'monitor':
      onMonitorClick();
      break;
    case 'door':
      onDoorClick();
      break;
    case 'cube':
      onProjectClick(0);
      break;
  }
}
```

## Adding New Interactive Objects

1. **Create object component**:
```typescript
// src/components/objects/NewObject.tsx
export function NewObject({ onClick }: { onClick: () => void }) {
  return (
    <group position={[x, y, z]} name="NewObject">
      <mesh userData={{ interactive: true, objectType: 'newobject' }}>
        {/* your geometry */}
      </mesh>
    </group>
  );
}
```

2. **Add to Scene.tsx raycaster**:
```typescript
if (hit.userData?.objectType === 'newobject') {
  onNewObjectClick();
  return;
}
```

3. **Add handler in App.tsx**:
```typescript
const handleNewObjectClick = () => {
  setActiveModal('newmodal');
};

// Pass to Scene
<Scene onNewObjectClick={handleNewObjectClick} />
```

## Styling Guide

### Tailwind Classes Used

**Layout:**
- `w-full h-screen` - Full viewport coverage
- `fixed inset-0` - Fixed positioning covering viewport
- `flex items-center justify-center` - Flexbox centering
- `pointer-events-none` - Allow clicks to pass through
- `pointer-events-auto` - Re-enable clicks for specific elements

**Colors (Custom)**
- `bg-neutral-950` - Deep black (#0a0a0a)
- `text-amber-500` - Gold accent (#f59e0b)
- `bg-neutral-900` - Dark gray (#171717)

**Effects:**
- `backdrop-blur-sm` - Blur background
- `shadow-2xl` - Large shadow
- `transition-colors duration-300` - Smooth color transitions

### Custom CSS

Located in `src/index.css`:

```css
@layer base {
  body {
    @apply bg-neutral-950 text-neutral-100;
  }
}

@layer components {
  .modal-backdrop {
    @apply fixed inset-0 bg-black/80 backdrop-blur-sm;
  }
}
```

## Performance Considerations

### Current Bundle Size
- **Total**: ~1.04 MB (281 KB gzipped)
- **Warning**: Bundle exceeds recommended 500 KB

### Optimization Opportunities

1. **Code Splitting**:
```typescript
// Lazy load modal content
const AboutContent = lazy(() => import('./components/content/AboutContent'));

<Suspense fallback={<Loading />}>
  <AboutContent />
</Suspense>
```

2. **Tree Shaking**:
```typescript
// Import only needed components
import { OrbitControls } from '@react-three/drei';
// Instead of: import * as drei from '@react-three/drei';
```

3. **Model Compression**:
```typescript
// Use Draco compression for 3D models
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
```

## Debugging Tips

### Console Logging in Development

The raycaster includes comprehensive logging:

```typescript
console.log('🎯 Clicked:', hit.name);
console.log('🎯 Interactive object detected:', objType);
console.log('✅ MONITOR CLICKED! (userData)');
```

### Common Issues

**1. Clicks not detected:**
- Check if object has `userData` set
- Verify object is in scene hierarchy
- Check if floor is blocking (should be filtered)

**2. Modal not opening:**
- Verify click handler is called (check console)
- Check modal state in React DevTools
- Ensure modal component receives `isOpen` prop

**3. Performance issues:**
- Check if too many `useFrame` hooks
- Verify OrbitControls damping is enabled
- Consider reducing shadow quality

### Development Mode

```bash
# Run with detailed logging
pnpm run dev

# Check bundle size
pnpm run build --stats

# Preview production build locally
pnpm run preview
```

## Testing Checklist

Before deployment:

- [ ] All navigation buttons work
- [ ] Monitor click opens About modal
- [ ] Door click opens Contact modal
- [ ] Cube clicks open Projects modal
- [ ] Modals close properly
- [ ] OrbitControls work (zoom, rotate)
- [ ] No console errors
- [ ] Responsive on different screen sizes
- [ ] Performance is acceptable (60 FPS)
- [ ] Build completes without errors
