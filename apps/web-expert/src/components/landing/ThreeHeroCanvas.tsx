import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroCanvasProps {
  className?: string;
}

export const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Particle System (Bio-luminescent spores / data nodes)
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const emerald = new THREE.Color(0x10b981);
    const cyan = new THREE.Color(0x06b6d4);
    const amber = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      const mixedColor = i % 3 === 0 ? emerald : i % 3 === 1 ? cyan : amber;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Canvas Circle Texture for smooth glowing orbs
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(16, 185, 129, 0.8)');
      gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.4,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 2. Holographic Planetary Digital Twin Sphere (Subtle Wireframe)
    const sphereGeometry = new THREE.IcosahedronGeometry(11, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x059669,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const globe = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    globe.position.set(12, -2, -5);
    scene.add(globe);

    // 3. Satellite Orbit Ring
    const ringGeometry = new THREE.RingGeometry(15, 15.15, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const orbitRing = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitRing.rotation.x = Math.PI / 2.5;
    orbitRing.rotation.y = Math.PI / 6;
    orbitRing.position.set(12, -2, -5);
    scene.add(orbitRing);

    // 4. Satellite Beacon
    const satGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const satellite = new THREE.Mesh(satGeo, satMat);
    scene.add(satellite);

    // Mouse Tracking with smooth interpolation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetX = (e.clientX - windowHalfX) * 0.0008;
      targetY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop with Dynamic FPS Monitoring & Quality Downscaling
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsCheckTime = performance.now();
    let isLowQualityMode = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();

      // Dynamic FPS monitoring (every 60 frames ~ 1 sec)
      frameCount++;
      if (frameCount >= 60) {
        const deltaSec = (now - lastFpsCheckTime) / 1000;
        const currentFps = frameCount / deltaSec;
        frameCount = 0;
        lastFpsCheckTime = now;

        // Downscale quality if FPS drops below 45
        if (currentFps < 45 && !isLowQualityMode) {
          isLowQualityMode = true;
          renderer.setPixelRatio(1.0);
          particleGeometry.setDrawRange(0, 225); // reduce rendering load by half
        }
      }

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX * 8;
      camera.position.y = -mouseY * 8;
      camera.lookAt(scene.position);

      // Rotate particles & globe
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      globe.rotation.y = elapsedTime * 0.08;
      globe.rotation.x = elapsedTime * 0.04;

      // Orbit satellite around globe
      const orbitAngle = elapsedTime * 0.6;
      satellite.position.x = globe.position.x + Math.cos(orbitAngle) * 15;
      satellite.position.z = globe.position.z + Math.sin(orbitAngle) * 15 * Math.cos(Math.PI / 2.5);
      satellite.position.y = globe.position.y + Math.sin(orbitAngle) * 15 * Math.sin(Math.PI / 2.5) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      sphereGeometry.dispose();
      wireframeMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      satGeo.dispose();
      satMat.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
};
