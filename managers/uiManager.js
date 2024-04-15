import React, { Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ScheduleController from '@/components/scheduleController';

function Model({ onClick }) {
  const { scene } = useGLTF('/models/desk4.glb');  // Correct path
  return <primitive object={scene} scale={1} onClick={onClick} />;
}

function UIManager() {
  const [showSchedule, setShowSchedule] = useState(false);

  // Toggle visibility of ScheduleController
  const handleModelClick = () => setShowSchedule(!showSchedule);

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <PerspectiveCamera
          makeDefault
          position={[0, -0.7, 2]}
          rotation={[-0.2, Math.PI / 100, 0]}
          fov={50}
        />
        <ambientLight intensity={0.5} />
        
        <Suspense fallback={null}>
          <Model onClick={handleModelClick} />
          
        </Suspense>
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
      {showSchedule && <ScheduleController />}
    </>
  );
}

export default UIManager;