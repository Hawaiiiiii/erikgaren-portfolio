import { useRef, useState } from 'react';

interface UIOverlayProps {
  onNavClick: (section: string) => void;
}

export function UIOverlay({ onNavClick }: UIOverlayProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      {/* Top-right navigation */}
      <div className="absolute top-8 right-8 flex items-center gap-8 pointer-events-auto">
        {/* Logo */}
        <div className="text-2xl font-bold text-amber-500 tracking-wider">
          ErikGaren
        </div>

        {/* Navigation */}
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="text-neutral-300 hover:text-amber-500 transition-colors duration-300 text-lg font-medium relative"
            >
              {item.label}
              {hoveredItem === item.id && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Loading indicator (optional) */}
      <div className="absolute bottom-8 left-8 text-neutral-500 text-sm pointer-events-none">
        Use mouse to explore the scene
      </div>
    </div>
  );
}
