import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { Modal } from './components/Modal';
import { AboutContent } from './components/content/AboutContent';
import { ProjectsContent } from './components/content/ProjectsContent';
import { ContactContent } from './components/content/ContactContent';

type ModalType = 'about' | 'projects' | 'contact' | null;

function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>();

  const handleNavClick = (section: string) => {
    setActiveModal(section as ModalType);
    if (section !== 'projects') {
      setSelectedProjectId(undefined);
    }
  };

  const handleMonitorClick = () => {
    setActiveModal('about');
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setActiveModal('projects');
  };

  const handleDoorClick = () => {
    setActiveModal('contact');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedProjectId(undefined);
  };

  return (
    <div className="w-full h-screen bg-neutral-950">
      {/* 3D Canvas */}
      <Canvas 
        shadows
      >
        <Suspense fallback={null}>
          <Scene
            onMonitorClick={handleMonitorClick}
            onProjectClick={handleProjectClick}
            onDoorClick={handleDoorClick}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UIOverlay onNavClick={handleNavClick} />

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'about'}
        onClose={handleCloseModal}
        title="About Me"
      >
        <AboutContent />
      </Modal>

      <Modal
        isOpen={activeModal === 'projects'}
        onClose={handleCloseModal}
        title="Projects"
      >
        <ProjectsContent selectedProjectId={selectedProjectId} />
      </Modal>

      <Modal
        isOpen={activeModal === 'contact'}
        onClose={handleCloseModal}
        title="Get in Touch"
      >
        <ContactContent />
      </Modal>
    </div>
  );
}

export default App;
