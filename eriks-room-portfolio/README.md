# ErikGaren's Room Portfolio

A stunning 3D interactive portfolio showcasing David Erik García Arenas (ErikGaren)'s work in AI, automation, and cybersecurity. Built with Three.js, this immersive experience features a fully explorable 3D room environment with custom shaders, animations, and a playable piano.

![Portfolio Preview](https://k36x7ryn92u5.space.minimax.io/media/og-image.webp)

## Live Demo

**Visit**: [https://k36x7ryn92u5.space.minimax.io](https://k36x7ryn92u5.space.minimax.io)

## Features

### 3D Interactive Experience
- Fully explorable 3D room environment
- OrbitControls for intuitive camera manipulation
- 90+ interactive objects with sophisticated hover effects
- Real-time animations (clock, fans, chair, fish)

### Playable Piano
- 24 functional piano keys (C1-B2)
- Individual sound samples for authentic playback
- Visual feedback on key press
- Automatic background music fading

### Dynamic Theme System
- Day/Night mode toggle
- Custom GLSL shader-based texture blending
- Smooth transitions between themes
- 4 texture sets with lighting variants

### Custom Visual Effects
- Coffee steam particle system with Perlin noise
- Shader-based smoke rendering
- Baked lighting with environmental reflections
- Professional color palette (Gold & Burgundy)

### Professional Content
- **About**: Creative Technologist profile and expertise
- **Projects**: OR.BIS, AI & Cybersecurity Portal, Full Stack Development
- **Contact**: Email, GitHub, LinkedIn with professional branding

## Technology Stack

### Core
- **Three.js** 0.172.0 - 3D rendering engine
- **Vite** 6.0.5 - Build tool and dev server
- **GSAP** 3.12.7 - Animation library
- **Howler.js** 2.2.4 - Audio system
- **SASS** 1.83.4 - Styling

### Advanced Features
- Custom GLSL shaders (vertex/fragment)
- DRACO compression for 3D models
- Sophisticated raycasting system
- Multi-texture material blending
- Real-time uniform updates

## Project Structure

```
erikgaren-room-portfolio/
├── public/
│   ├── audio/              # Music and sound effects
│   ├── models/             # 3D room model (GLB with DRACO)
│   ├── textures/           # Day/night textures, skybox
│   ├── images/             # UI and profile images
│   ├── draco/              # DRACO decoder
│   └── fonts/              # Custom fonts
├── src/
│   ├── main.js             # Core scene logic (2,114 lines)
│   ├── style.scss          # Main stylesheet
│   ├── shaders/            # Custom GLSL shaders
│   │   ├── smoke/          # Particle effects
│   │   └── theme/          # Day/night blending
│   ├── styles/             # SCSS modules
│   └── utils/              # OrbitControls
├── dist/                   # Production build
├── index.html              # Entry point
└── package.json            # Dependencies
```

## Local Development

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd erikgaren-room-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The dev server will start at `http://localhost:5173` (or next available port)

## Content Customization

### Personal Information
Edit `index.html` to update:
- About section (lines 241-304)
- Projects section (lines 113-213)
- Contact information (lines 333-387)

### Color Branding
Edit `src/styles/variables.scss` and `src/style.scss` (lines 8-29):
```scss
$base-dark-purple: #7b1f27;  // Burgundy
$base-purple: #d4af37;        // Gold
$base-black: #0e0e0e;         // Dark base
$base-white: #cfcfcf;         // Neutral light
```

### 3D Model
Replace `public/models/Room_Portfolio.glb` with your custom 3D model.
Ensure DRACO compression for optimal loading performance.

## Build & Deployment

### Production Build
```bash
npm run build
```

Outputs to `dist/` directory with optimized assets:
- Minified HTML, CSS, JS
- Compressed textures
- DRACO-compressed 3D model

### Deployment
Deploy the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any CDN or web server

## Performance

### Build Statistics
- **HTML**: 22.90 kB (gzipped: 6.49 kB)
- **CSS**: 11.18 kB (gzipped: 2.60 kB)
- **JavaScript**: 785.93 kB (gzipped: 202.08 kB)
- **3D Model**: 1.2 MB (DRACO compressed)

### Optimization Features
- DRACO compression for 3D geometry
- WebP textures for reduced bandwidth
- Efficient raycasting with limited object arrays
- Strategic use of object pooling
- Proper disposal of GSAP timelines

## Browser Compatibility

Tested and working on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires WebGL support.

## Credits & Inspiration

### Original Concept
This portfolio is inspired by the original SooahKim room portfolio, showcasing the potential of 3D web experiences for creative professionals.

### Technologies
- Three.js community
- GSAP animation platform
- Howler.js audio library
- Vite build tool

### Content
All content, projects, and professional information belong to David Erik García Arenas (ErikGaren).

## License

This project structure and code are available for reference. The 3D assets, branding, and content are proprietary.

## Contact

**David Erik García Arenas (ErikGaren)**
- **Email**: contact@erikgaren.dev
- **GitHub**: [Hawaiiiiii](https://github.com/Hawaiiiiii)
- **LinkedIn**: [David Erik García Arenas](https://es.linkedin.com/in/david-erik-garcia-arenas-8b17a1280)

## Documentation

For detailed technical documentation, see:
- `DELIVERY_DOCUMENTATION.md` - Complete project specifications
- `test-progress.md` - Testing and verification results
- `docs/original_scene_analysis.md` - Technical architecture analysis

---

**Built with passion using Three.js, GSAP, and creative coding**
**Portfolio Status**: Production Ready ✓
**Last Updated**: November 4, 2025
