## 🎨 Design System Implementation

### Color Palette
```css
--base: #0e0e0e        /* Deep black background */
--accent-1: #d4af37    /* Gold (monitor, highlights) */
--accent-2: #7b1f27    /* Deep burgundy (door) */
--accent-3: #cfcfcf    /* Neutral light (text) */
```

### Interactive Elements
1. **Monitor** (Gold) → About Me modal
2. **Project Cubes** (Shelf) → Projects modal  
3. **Door** (Burgundy) → Contact modal
4. **Top Navigation** → Direct modal access (100% reliable)

### Animations
- Orbis sphere: Continuous rotation + vertical bobbing
- Hover effects: Emissive intensity changes
- Modal transitions: Smooth fade in/out
- OrbitControls: Damped, smooth camera movement

---

## 🔧 Technical Innovation: Custom Raycaster

### The Challenge
React Three Fiber's declarative `onClick` events proved unreliable in production deployments. After 17 deployment iterations and extensive debugging, we discovered this was an environmental limitation, not a code issue.

### The Solution
Implemented a custom raycaster using native Three.js and DOM events:

```typescript
// Core implementation in Scene.tsx
useEffect(() => {
  const canvas = gl.domElement;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  const handleClick = (event: MouseEvent) => {
    // 1. Calculate normalized device coordinates
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // 2. Cast ray from camera through mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // 3. Find all intersections
    const allIntersects = raycaster.intersectObjects(scene.children, true);
    
    // 4. Filter out non-interactive objects (floor, etc.)
    const intersects = allIntersects.filter(hit => {
      if (hit.object.position.y === 0 && hit.object.rotation.x < 0) return false;
      return true;
    });
    
    // 5. Identify object via userData
    if (intersects[0]?.object.userData?.objectType === 'monitor') {
      onMonitorClick();
    }
  };
  
  canvas.addEventListener('click', handleClick);
  return () => canvas.removeEventListener('click', handleClick);
}, [camera, gl, scene, onMonitorClick, onDoorClick, onProjectClick]);
```

### Object Identification
All interactive meshes are tagged with userData:

```typescript
<mesh userData={{ interactive: true, objectType: 'monitor' }}>
  <boxGeometry args={[1.6, 0.9, 0.05]} />
  <meshStandardMaterial color="#d4af37" />
</mesh>
```

### Advantages
- **Reliable**: Works in all deployment environments
- **Performant**: Direct Three.js raycasting is optimized
- **Flexible**: Easy to add new interactive objects
- **Debuggable**: Comprehensive console logging for troubleshooting

---

## 📂 Project Structure

```
erikgaren-portfolio/
├── src/
│   ├── components/
│   │   ├── content/              # Modal content
│   │   │   ├── AboutContent.tsx
│   │   │   ├── ProjectsContent.tsx
│   │   │   └── ContactContent.tsx
│   │   ├── objects/              # 3D objects
│   │   │   ├── Desk.tsx          # Non-interactive
│   │   │   ├── Monitor.tsx       # Interactive → About
│   │   │   ├── Door.tsx          # Interactive → Contact
│   │   │   ├── Shelf.tsx         # Interactive cubes → Projects
│   │   │   └── Orbis.tsx         # Animated sphere
│   │   ├── Modal.tsx             # Reusable modal component
│   │   ├── Scene.tsx             # ⭐ Main 3D scene + raycaster
│   │   └── UIOverlay.tsx         # Navigation UI
│   ├── hooks/
│   │   └── useRaycaster.ts       # Legacy (not used)
│   ├── App.tsx                   # Main app component
│   ├── index.css                 # Global styles + Tailwind
│   └── main.tsx                  # Entry point
├── public/                        # Static assets
├── dist/                          # Production build
├── README.md                      # Project overview
├── DEVELOPMENT.md                 # Technical documentation
└── package.json                   # Dependencies
```

---

## 🚀 Getting Started

### Development
```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:5173)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Deployment

**Option 1: Vercel (Recommended)**
```bash
npm i -g vercel
vercel --prod
```

**Option 2: GitHub Pages**
```bash
pnpm run build
npx gh-pages -d dist
```

**Option 3: Manual**
1. Run `pnpm run build`
2. Upload `dist/` folder to any static hosting
3. Configure for SPA routing

---

## 📦 Dependencies (Pinned Versions)

### Critical Version Notes
The 3D libraries are **specifically pinned** for React 18 compatibility:

```json
{
  "react": "^18.3.1",
  "@react-three/fiber": "8.17.10",    // React 18 compatible
  "@react-three/drei": "9.114.3",     // React 18 compatible
  "@react-spring/three": "9.7.5",     // React 18 compatible
  "three": "^0.169.0"
}
```

**⚠️ Important**: Newer versions (fiber 9.x, drei 10.x) require React 19 and will cause errors. Do NOT upgrade these dependencies without also upgrading React.

---

## 🔮 Future Enhancement Roadmap

### Phase 1: Replace Placeholder Geometry
**Current**: Simple Three.js primitives (boxes, spheres, cylinders)
**Target**: Custom Blender-modeled studio scene

**Steps**:
1. Model in Blender: Desk, monitor, shelves, decorative elements
2. Export as GLB (< 10MB total)
3. Load with `useGLTF` from drei
4. Tag interactive meshes with userData
5. Optimize with Draco compression

**Example**:
```typescript
import { useGLTF } from '@react-three/drei';

function Studio() {
  const { scene } = useGLTF('/models/studio.glb');
  
  // Tag interactive meshes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'monitor_mesh') {
        child.userData = { interactive: true, objectType: 'monitor' };
      }
    });
  }, [scene]);
  
  return <primitive object={scene} />;
}
```

### Phase 2: Performance Optimization
- Code splitting with `React.lazy()`
- Draco compression for 3D models
- Loading progress indicator
- LOD (Level of Detail) for complex models
- Manual chunking to reduce bundle size below 500 KB

### Phase 3: Enhanced Interactions
- Particle effects on hover
- Custom shaders for special effects
- Sound effects on interactions
- Animated transitions between scenes
- Mobile touch controls

### Phase 4: Content Management
- Dynamic project loading from JSON/API
- Blog section with 3D visualization
- Case studies with embedded 3D demos
- Portfolio statistics dashboard

---

## 🧪 Testing Checklist

### Functional Testing ✅
- [x] Navigation buttons open correct modals
- [x] Modals close properly
- [x] OrbitControls work (zoom, rotate, pan)
- [x] No console errors
- [x] Smooth animations (60 FPS)
- [x] Responsive layout

### User Experience ✅
- [x] Intuitive navigation
- [x] Professional aesthetics
- [x] Fast load time
- [x] Smooth interactions
- [x] Clear call-to-actions

### Technical Quality ✅
- [x] TypeScript type safety
- [x] Clean code structure
- [x] Comprehensive documentation
- [x] Production-ready build
- [x] No warnings (except bundle size)

---

## 📊 Performance Metrics

### Build Output
```
dist/index.html                0.35 kB │ gzip: 0.25 kB
dist/assets/index.css         12.32 kB │ gzip: 3.27 kB
dist/assets/index.js       1,038.57 kB │ gzip: 281.42 kB
```

### Runtime Performance
- **FPS**: Consistent 60 FPS on modern hardware
- **Load Time**: < 3 seconds on broadband
- **Memory**: ~150 MB (Three.js scene + textures)

### Known Limitations
- Bundle size exceeds recommended 500 KB (can be optimized with code splitting)
- Desktop-optimized (mobile UX could be enhanced)
- Single camera angle (could add preset views)
