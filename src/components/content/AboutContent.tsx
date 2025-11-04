export function AboutContent() {
  return (
    <div className="space-y-6 text-neutral-300">
      {/* Profile placeholder */}
      <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-red-900 rounded-full mx-auto mb-6" />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-amber-500">
          David Erik García Arenas
        </h3>
        <p className="text-lg leading-relaxed">
          Creative technologist focused on the intersection of{' '}
          <span className="text-amber-500 font-semibold">sound</span>,{' '}
          <span className="text-amber-500 font-semibold">geometry</span>, and{' '}
          <span className="text-amber-500 font-semibold">AI</span>.
        </p>

        <p className="leading-relaxed">
          I explore innovative ways to blend technology with creativity,
          building immersive experiences that push the boundaries of digital
          art and interactive design.
        </p>

        <div className="pt-4">
          <h4 className="text-lg font-semibold text-amber-500 mb-2">
            Expertise
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>3D visualization and interactive experiences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>Generative audio and visual systems</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>AI-driven creative tools</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
