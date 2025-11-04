import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ClickableObject {
  object: THREE.Object3D | null;
  onClick: () => void;
}

export function useRaycaster(objects: ClickableObject[]) {
  const { camera, gl, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = (event: MouseEvent) => {
      console.log('=== CLICK EVENT ===');
      console.log('clientX:', event.clientX, 'clientY:', event.clientY);
      console.log('offsetX:', event.offsetX, 'offsetY:', event.offsetY);
      console.log('pageX:', event.pageX, 'pageY:', event.pageY);
      
      const rect = canvas.getBoundingClientRect();
      console.log('Canvas rect - left:', rect.left, 'top:', rect.top, 'width:', rect.width, 'height:', rect.height);
      
      // Calculate position relative to canvas
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      console.log('Calculated position - x:', x, 'y:', y);
      
      // Calculate normalized device coordinates (-1 to +1)
      mouse.current.x = (x / rect.width) * 2 - 1;
      mouse.current.y = -(y / rect.height) * 2 + 1;
      
      console.log('Normalized - x:', mouse.current.x, 'y:', mouse.current.y);

      // Update the raycaster with the camera and mouse position
      raycaster.current.setFromCamera(mouse.current, camera);
      
      console.log('Ray origin:', raycaster.current.ray.origin.x.toFixed(2), raycaster.current.ray.origin.y.toFixed(2), raycaster.current.ray.origin.z.toFixed(2));
      console.log('Ray direction:', raycaster.current.ray.direction.x.toFixed(2), raycaster.current.ray.direction.y.toFixed(2), raycaster.current.ray.direction.z.toFixed(2));

      // Calculate objects intersecting the raycaster - filter out null objects
      const meshes = objects.map(o => o.object).filter(o => o !== null) as THREE.Object3D[];
      
      console.log('Click detected at', mouse.current.x.toFixed(2), mouse.current.y.toFixed(2));
      console.log('Available meshes:', meshes.length, meshes.map(m => m.name || m.type));

      if (meshes.length === 0) {
        console.log('Warning: No meshes available for raycasting');
        return;
      }

      const intersects = raycaster.current.intersectObjects(meshes, true);
      console.log('Intersects:', intersects.length);
      
      if (intersects.length > 0) {
        console.log('✨ INTERSECTION FOUND!');
        console.log('First hit:', {
          object: intersects[0].object.type,
          name: intersects[0].object.name,
          distance: intersects[0].distance,
          point: intersects[0].point
        });
        // Find which object was clicked
        for (const obj of objects) {
          if (!obj.object) continue;
          
          if (intersects.some(i => {
            // Check if the intersected object is the target or a child of it
            let current = i.object;
            while (current) {
              if (current === obj.object) return true;
              current = current.parent as THREE.Object3D;
            }
            return false;
          })) {
            console.log('Triggering onClick for:', obj.object.name || obj.object.type);
            obj.onClick();
            break;
          }
        }
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [camera, gl, scene, objects]);
}
