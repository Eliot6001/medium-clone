import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function VibrationSphere({isDark= true, disableForwarding = false}) {

  const mountRef = useRef(null);
  const [fields] = useState([
    'Technology', 'Culture', 'Science', 'History', 'Geography',
    'Politics', 'Economics', 'Mathematics', 'Literature',
    'Performing Arts', 'Visual Arts', 'Health & Wellness', 'Sports',
    'Business & Finance', 'Environment'
  ]);
  
  const sphereRef = useRef();
  const labelsRef = useRef([]);
  const anchorsRef = useRef([]);
  const clock = useRef(new THREE.Clock());
  
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  
  // Drag control
  const pointerDown = useRef(false);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? "#18181b": "#f4f4f5");
    
    const camera = new THREE.PerspectiveCamera(
      100,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    const currentColor = scene.background;

    const invertedColor = (255-currentColor.r,255-currentColor.g,255-currentColor.b)
    // --- CREATE VIBRATING SPHERE ---
    const sphereGeo = new THREE.IcosahedronGeometry(3, 3);
    const originalPositions = sphereGeo.attributes.position.array.slice();
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      wireframe: true,
      opacity: 0.25,
      transparent: true
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphereRef.current = sphere;
    scene.add(sphere);
    
    // --- CREATE EVENLY SPACED LABELS USING FIBONACCI ---
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    anchorsRef.current = [];
    labelsRef.current = [];
    const n = fields.length;
    
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2; 
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      const direction = new THREE.Vector3(x, y, z).normalize();
      
      // Create anchor at surface (radius = 3)
      const anchor = new THREE.Object3D();
      anchor.position.copy(direction.clone().multiplyScalar(3));
      sphere.add(anchor);
      anchorsRef.current.push(anchor);
      
      // Create label canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 256;
      
      // Draw background with rounded corners
      ctx.fillStyle = 'rgba(255,255,255,0.00)';
      ctx.beginPath();
      
      // Use fallback for browsers that don't support roundRect
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
      } else {
        // Simple rounded rectangle fallback
        const radius = 20;
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        ctx.lineTo(radius, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
      }
      
      ctx.fill();
      
      // Draw text
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = !isDark? '#000a' : '#fff';
      ctx.fillText(fields[i], canvas.width / 2, canvas.height / 2);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      // Fix for GL_INVALID_OPERATION: Texture is immutable
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      const labelGeo = new THREE.PlaneGeometry(1.5, 0.75);
      const labelMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false
      });
      
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.userData = { field: fields[i], originalTexture: texture };
      
      // Place label slightly outwards from anchor
      label.position.copy(direction.clone().multiplyScalar(0.2));
      anchor.add(label);
      labelsRef.current.push(label);
    }
    
    // --- LIGHTING ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 5, 5);
    scene.add(directional);
    
    // --- POINTER EVENTS ---
    const onPointerDown = (e) => {
      pointerDown.current = true;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      if (!pointerDown.current) return;
      targetRotation.current.x += e.movementY * 0.005;
      targetRotation.current.y += e.movementX * 0.005;
    };
    
    const onPointerUp = () => {
      pointerDown.current = false;
    };
    
    // Separate click handler (not pointerclick which isn't a standard event)
    const onClick = (e) => {
      // Check if we've been dragging - if so, don't trigger click
      if (pointerDown.current) return;
      
      raycaster.current.setFromCamera(mouse.current, camera);
      
      // Get visible labels
      const visibleLabels = labelsRef.current.filter(label => {
        const worldPos = new THREE.Vector3();
        label.getWorldPosition(worldPos);
        
        // Vector from camera to label
        const cameraToLabel = worldPos.clone().sub(camera.position);
        
        // Vector from sphere center to label
        const sphereToLabel = worldPos.clone().sub(sphere.position);
        
        // Dot product should be negative for labels facing camera
        return cameraToLabel.dot(sphereToLabel) < 0;
      });
      
      const intersects = raycaster.current.intersectObjects(visibleLabels);
      
      if (intersects.length > 0) {
        const field = intersects[0].object.userData.field;
        if(!disableForwarding)
          window.location.href = `/search?field=${field}`;
        else {
          console.log("You selected", field)
        }
      }
    };
    
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    
    // Use click instead of pointerclick (which isn't a standard event)
    renderer.domElement.addEventListener('click', onClick);
    
    // --- ANIMATION LOOP ---
    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.current.getElapsedTime();
      
      // Vibrate sphere vertices
      const positions = sphere.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i] + Math.sin(time * 3 + i) * 0.05;
      }
      sphere.geometry.attributes.position.needsUpdate = true;
      
      // Smooth rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;
      sphere.rotation.set(currentRotation.current.x, currentRotation.current.y, 0);
      
      // Make each label face the camera with correct orientation
      labelsRef.current.forEach(label => {
        // Make label face camera
        label.lookAt(camera.position);
        
        // Get label's world position
        const worldPos = new THREE.Vector3();
        label.getWorldPosition(worldPos);
        
        // Get label's world orientation vectors
        const worldUp = new THREE.Vector3(0, 1, 0).applyQuaternion(label.getWorldQuaternion(new THREE.Quaternion()));
        
        // Calculate angle between world up and label's up vector
        const angle = worldUp.angleTo(new THREE.Vector3(0, 1, 0));
        
        // If angle is greater than 90 degrees, the text would appear upside down
        // Rotate label 180 degrees around its local Z-axis to fix orientation
        if (angle > Math.PI/2) {
          // Apply 180-degree rotation around label's local Z-axis
          label.rotateZ(Math.PI);
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();
    
    // --- RESIZE HANDLER ---
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark, disableForwarding]);
  
  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #1a1a2a 0%, #0a0a1a 100%)'
      }}
    />
  );
}