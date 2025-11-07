# ErikGaren 3D Portfolio
## UNDER RENOVATION!!! GOTTA UPDATE ALL OF THIS!!! PORTFOLIO'S NOT LOOKING LIKE THIS ANYMORE, THIS IS EARLY JUNE-JULY 2025 BUILD!!!
***
<img width="3392" height="1321" alt="image" src="https://github.com/user-attachments/assets/b6706b7d-99a9-4a51-bdbf-42838c633d86" />

> A 3D interactive portfolio website showcasing creative technology expertise through an immersive WebGL experience.

---
## 🎨 Design System

### Color Palette
- **Base**: `#0e0e0e` - Deep black background
- **Accent 1**: `#d4af37` - Gold (monitor, highlights)
- **Accent 2**: `#7b1f27` - Deep burgundy (door, accents)
- **Accent 3**: `#cfcfcf` - Neutral light (text, UI elements)

### Typography
- **Font Family**: System default (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`)
- **Navigation**: 18px, medium weight
- **Body**: 16px, normal weight
- **Headings**: Bold, varying sizes

## 🏗️ Project Structure

```
erikgaren-portfolio/
├── src/
│   ├── components/
│   │   ├── content/          # Modal content components
│   │   │   ├── AboutContent.tsx
│   │   │   ├── ProjectsContent.tsx
│   │   │   └── ContactContent.tsx
│   │   ├── objects/          # 3D object components
│   │   │   ├── Desk.tsx
│   │   │   ├── Monitor.tsx    # Interactive - triggers About modal
│   │   │   ├── Door.tsx       # Interactive - triggers Contact modal
│   │   │   ├── Shelf.tsx      # Interactive cubes - trigger Projects modal
│   │   │   └── Orbis.tsx      # Animated floating sphere
│   │   ├── Modal.tsx          # Reusable modal component
│   │   ├── Scene.tsx          # Main 3D scene with custom raycaster
│   │   └── UIOverlay.tsx      # Navigation and UI elements
│   ├── hooks/
│   │   └── useRaycaster.ts    # Custom raycaster hook (legacy)
│   ├── App.tsx                # Main application component
│   ├── index.css              # Global styles with Tailwind
│   └── main.tsx               # Application entry point
├── public/                     # Static assets
├── dist/                       # Production build output
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 🔧 Technical Implementation

### Custom Raycaster System

**Problem**: React Three Fiber's declarative `onClick` events don't work reliably in all production environments.

**Solution**: Implemented a custom raycaster using native Three.js:

```typescript
// In Scene.tsx
useEffect(() => {
  const canvas = gl.domElement;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  const handleClick = (event: MouseEvent) => {
    // Calculate normalized device coordinates
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Check userData to identify clicked object
    if (intersects[0]?.object.userData?.objectType === 'monitor') {
      onMonitorClick();
    }
  };
  
  canvas.addEventListener('click', handleClick);
  return () => canvas.removeEventListener('click', handleClick);
}, [camera, gl, scene]);
```

### Object Identification Strategy

3D objects are tagged with `userData` for reliable identification:

```typescript
<mesh userData={{ interactive: true, objectType: 'monitor' }}>
  {/* geometry and material */}
</mesh>
```

### Interactive Elements

1. **Monitor** (Gold) - Opens "About Me" modal
2. **Project Cubes** (Shelf) - Opens "Projects" modal
3. **Door** (Burgundy) - Opens "Contact" modal
4. **Top Navigation** - Direct access to all sections

## 📦 Dependencies

### Core
- `react` ^18.3.1 - UI library
- `react-dom` ^18.3.1 - React DOM renderer
- `vite` ^6.0.1 - Build tool

### 3D Graphics
- `three` ^0.169.0 - WebGL 3D library
- `@react-three/fiber` 8.17.10 - React renderer for Three.js (React 18 compatible)
- `@react-three/drei` 9.114.3 - Useful helpers for R3F (React 18 compatible)
- `@react-spring/three` 9.7.5 - Animation library (React 18 compatible)

### Styling
- `tailwindcss` v3.4.16 - Utility-first CSS
- `tailwindcss-animate` ^1.0.7 - Animation utilities

### UI Components
- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` ^0.364.0 - Icon library

**Note**: The 3D library versions are specifically pinned for React 18 compatibility. Newer versions (drei 10.x, fiber 9.x) require React 19.

## 🎬 Animations

- **Orbis Sphere**: Continuous rotation and vertical bobbing
- **Hover Effects**: Emissive intensity changes on Monitor and Door
- **Scale Effects**: Project cubes scale up on hover
- **Modal Transitions**: Smooth fade-in/fade-out

## 📱 Responsive Design

- Fixed camera position optimized for desktop viewing
- OrbitControls allow user exploration:
  - **Zoom**: 5-20 units
  - **Rotation**: Full horizontal, limited vertical (top-down only)
  - **Damping**: Enabled for smooth movements

## 🔄 Future Enhancements

### Replace Placeholder Geometry with Real 3D Models

Currently using basic geometries (boxes, spheres, cylinders). To use custom Blender models:

1. **Export from Blender**:
   - File → Export → glTF 2.0 (.glb)
   - Settings: Include animations, optimize for size
   - Target: < 10MB total

2. **Add to project**:
   ```bash
   # Place model in public directory
   /public/models/studio.glb
   ```

3. **Load in component**:
   ```typescript
   import { useGLTF } from '@react-three/drei';
   
   function Studio() {
     const { scene } = useGLTF('/models/studio.glb');
     return <primitive object={scene} />;
   }
   ```

4. **Tag interactive meshes**:
   ```typescript
   // In Blender, name objects: "monitor_mesh", "door_mesh", etc.
   // Then traverse and tag:
   scene.traverse((child) => {
     if (child.name === 'monitor_mesh') {
       child.userData = { interactive: true, objectType: 'monitor' };
     }
   });
   ```

### Performance Optimization

- Implement code splitting with `React.lazy()`
- Use `draco` compression for models
- Add loading progress indicator
- Implement LOD (Level of Detail) for complex models

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### GitHub Pages

```bash
# Build
pnpm run build

# Deploy (using gh-pages)
pnpm add -D gh-pages
npx gh-pages -d dist
```

### Manual Deployment

1. Build: `pnpm run build`
2. Upload `dist/` folder to any static hosting
3. Ensure proper routing configuration for SPA

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 🙏 Credits

- Design: Custom 3D portfolio concept
- Development: React + Three.js + TypeScript
- Innovation: Custom raycaster for reliable 3D interactions

---

**Author**: David Erik García Arenas
**Contact**: daviderikgarciaarenas@gmail.com
