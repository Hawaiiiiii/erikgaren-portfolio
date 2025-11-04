interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
}

const projects: Project[] = [
  {
    id: 0,
    title: 'Sonic Geometry',
    description:
      'An interactive audio-visual experience that translates sound waves into geometric patterns using real-time FFT analysis.',
    tech: ['Three.js', 'Web Audio API', 'GLSL'],
  },
  {
    id: 1,
    title: 'AI Composer',
    description:
      'A machine learning model that generates original musical compositions based on user-provided themes and moods.',
    tech: ['Python', 'TensorFlow', 'MIDI'],
  },
  {
    id: 2,
    title: 'Particle Orchestra',
    description:
      'A WebGL-based particle system where each particle emits a unique sound, creating an emergent musical composition.',
    tech: ['React Three Fiber', 'Tone.js', 'WebGL'],
  },
  {
    id: 3,
    title: 'Neural Canvas',
    description:
      'Real-time style transfer application that transforms webcam input into artistic renditions using neural networks.',
    tech: ['TensorFlow.js', 'React', 'WebRTC'],
  },
  {
    id: 4,
    title: 'Fractal Soundscapes',
    description:
      'Generative music system that creates infinite, evolving soundscapes based on fractal algorithms.',
    tech: ['Max/MSP', 'JavaScript', 'Web Audio'],
  },
];

interface ProjectsContentProps {
  selectedProjectId?: number;
}

export function ProjectsContent({ selectedProjectId }: ProjectsContentProps) {
  const displayProjects = selectedProjectId !== undefined
    ? projects.filter((p) => p.id === selectedProjectId)
    : projects;

  return (
    <div className="space-y-6">
      {displayProjects.map((project) => (
        <div
          key={project.id}
          className="p-6 bg-neutral-800/50 border border-amber-500/20 rounded-lg hover:border-amber-500/40 transition-colors"
        >
          <h3 className="text-xl font-semibold text-amber-500 mb-3">
            {project.title}
          </h3>
          <p className="text-neutral-300 mb-4 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-neutral-700 text-neutral-300 text-sm rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          {(project.github || project.demo) && (
            <div className="flex gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 text-sm font-medium"
                >
                  GitHub →
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 text-sm font-medium"
                >
                  Live Demo →
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
