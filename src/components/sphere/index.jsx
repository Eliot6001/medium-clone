import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import FIELDS from '@/components/fields';

export default function VibrationSphere({ isDark = true, disableForwarding = false }) {
  const mountRef = useRef(null);
  const anchorsRef = useRef([]);
  const targetRotRef = useRef({ x: 0, y: 0 });
  const curRotRef = useRef({ x: 0, y: 0 });
  const labelsRef = useRef([]);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let pointerMoved = false;

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? '#27272a' : '#f4f4f5');
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // CLOCK & UNIFORMS
    const clock = new THREE.Clock();
    const uniforms = { time: { value: 0 } };

    // SHADER MATERIAL FOR SPHERE
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms,
      wireframe: true,
      vertexShader: `
        uniform float time;
        varying vec3 vColor;
        void main() {
          float amp = 0.02;
          float freq = 1.0;
          vec3 pos = position + normal * sin(time * freq + position.y * 2.0) * amp;
          vColor = vec3(
            0.6 + 0.4 * sin(time * 0.2 + position.x),
            0.6 + 0.4 * sin(time * 0.2 + position.y + 2.0),
            0.6 + 0.4 * sin(time * 0.2 + position.z + 4.0)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
        }
      `
    });

    // CREATE SPHERE
    const sphereGeo = new THREE.IcosahedronGeometry(2, 2);
    const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    scene.add(sphere);

    // CREATE LABEL ANCHORS & LABELS (Fibonacci)
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    anchorsRef.current = [];
    labelsRef.current = [];
    FIELDS.forEach((field, i) => {
      // Compute point on unit sphere
      const y = 1 - (i / (FIELDS.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const dir = new THREE.Vector3(x, y, z).normalize();

      // Anchor at surface (radius 2)
      const anchor = new THREE.Object3D();
      anchor.position.copy(dir.clone().multiplyScalar(0));
      sphere.add(anchor);
      anchorsRef.current.push(anchor);

      // Create canvas label
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isDark ? '#fff' : '#000';
      ctx.fillText(field, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      const labelGeo = new THREE.PlaneGeometry(1.5, 0.75);
      const labelMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false
      });

      const label = new THREE.Mesh(labelGeo, labelMat);
      // position a bit outwards so it sits above the surface
      label.position.copy(dir.clone().multiplyScalar(2.1));
      anchor.add(label);
      labelsRef.current.push(label);
    });

    // LIGHTING
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(5, 5, 5);
    scene.add(dl);

    // ROTATION CONTROL
    let dragging = false;
    const targetRot = { x: 0, y: 0 };
    const curRot = { x: 0, y: 0 };
    const onDown = () =>  {
      dragging = true;
      pointerMoved = false;
    };
    const onUp = e => {
      dragging = false;
      if (pointerMoved) return;
    
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const visibleLabels = labelsRef.current.filter(label => label.visible);
      const intersects = raycaster.intersectObjects(visibleLabels);
    
      if (intersects.length > 0) {
        const label = intersects[0].object;
        const anchor = label.parent;
        const index = anchorsRef.current.findIndex(a => a === anchor);
        const field = FIELDS[index];
        if (!disableForwarding && field) {
          window.location.href = `/explore?field=${encodeURIComponent(field)}`;
        }
      }
    };
    const onMove = e => {
      if (!dragging) return; // ✨ fix here
      pointerMoved = true;
      targetRotRef.current.y += e.movementX * 0.005;
      targetRotRef.current.x += e.movementY * 0.005;
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('pointermove', onMove);

    // ANIMATION LOOP
    let req;
    const animate = () => {
      uniforms.time.value = clock.getElapsedTime();
      // smooth sphere rotation
      curRotRef.current.x += (targetRotRef.current.x - curRotRef.current.x) * 0.1;
      curRotRef.current.y += (targetRotRef.current.y - curRotRef.current.y) * 0.1;
      sphere.rotation.set(curRotRef.current.x, curRotRef.current.y, 0);

      // update labels: always face camera and stay readable
      labelsRef.current.forEach(label => {
        // Face the camera
        label.lookAt(camera.position);
      
        // Get world "up" vector of the label
        const labelUp = new THREE.Vector3(0, 1, 0).applyQuaternion(label.getWorldQuaternion(new THREE.Quaternion()));
      
        // Compare with global up direction to detect if flipped
        const angle = labelUp.angleTo(new THREE.Vector3(0, 1, 0));
      
        // Flip if angle is greater than 90 degrees (i.e. upside down)
        if (angle > Math.PI / 2) {
          label.rotateZ(Math.PI);
        }
      });

      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    };
    animate();

    // RESIZE HANDLER
    const onResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(req);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('pointermove', onMove);
      mountRef.current.removeChild(renderer.domElement);
      sphereGeo.dispose();
      sphereMaterial.dispose();
      renderer.dispose();
    };
  }, [isDark, disableForwarding]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '600px', borderRadius: '16px', overflow: 'hidden' }}
    />
  );
}
