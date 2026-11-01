import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useInView } from 'motion/react';
import { createBrunSleeveCanvas, type CupAppearance } from '../utils/sleeveTexture';
import { getCupRenderBudget } from '../utils/renderBudget';

interface SpinningCupCanvasProps {
  className?: string;
  speed?: number;
  interactive?: boolean;
  scale?: number;
  steam?: boolean;
  active?: boolean;
  docked?: boolean;
  initialTurn?: boolean;
  appearance?: CupAppearance;
}

const CupRenderer: React.FC<SpinningCupCanvasProps> = ({
  className = 'w-full h-full min-h-[280px]',
  speed = 0.85,
  interactive = true,
  scale = 1.0,
  steam = true,
  active = true,
  docked = false,
  initialTurn = false,
  appearance = 'light',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cupGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const settingsRef = useRef({ speed, interactive, scale, active, docked, initialTurn });
  settingsRef.current = { speed, interactive, scale, active, docked, initialTurn };
  const wakeRef = useRef<(() => void) | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    wakeRef.current?.();
  }, [active, speed, scale, docked, initialTurn]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;
    const budget = getCupRenderBudget(width, height, window.innerWidth, window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      console.error('BRUN: Unable to initialize the 3D cup renderer.', error);
      setHasError(true);
      return;
    }
    rendererRef.current = renderer;
    renderer.setPixelRatio(budget.pixelRatio);
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd8d0c0, 0.75);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ec, 2.8);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
    frontLight.position.set(0, 1.2, 6.0);
    scene.add(frontLight);

    const rimLight = new THREE.DirectionalLight(0xffeedb, 2.0);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // Build Cup
    const cupGroup = new THREE.Group();
    cupGroupRef.current = cupGroup;
    cupGroup.scale.setScalar(scale);
    scene.add(cupGroup);

    const topRadius = 1.35;
    const bottomRadius = 0.96;
    const cupHeight = 3.3;

    // Cup Body
    const cupGeo = new THREE.CylinderGeometry(topRadius, bottomRadius, cupHeight, budget.radialSegments, 1, false);
    const cupMat = new THREE.MeshStandardMaterial({
      color: appearance === 'dark' ? 0x17120f : 0xf9f7f2,
      roughness: 0.88,
      metalness: 0.02,
    });
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    cupGroup.add(cupMesh);

    // Rolled Top Lip
    const lipGeo = new THREE.TorusGeometry(topRadius + 0.02, 0.035, 16, 64);
    lipGeo.rotateX(Math.PI / 2);
    const lipMesh = new THREE.Mesh(lipGeo, cupMat);
    lipMesh.position.y = cupHeight / 2;
    cupGroup.add(lipMesh);

    // Bottom Rim
    const bottomLipGeo = new THREE.TorusGeometry(bottomRadius + 0.015, 0.025, 16, 64);
    bottomLipGeo.rotateX(Math.PI / 2);
    const bottomLipMesh = new THREE.Mesh(bottomLipGeo, cupMat);
    bottomLipMesh.position.y = -cupHeight / 2;
    cupGroup.add(bottomLipMesh);

    // Sleeve with canvas texture
    const sleeveHeight = 1.95;
    const sleeveY = 0.18;
    const radiusAt = (y: number) =>
      bottomRadius + ((y + cupHeight / 2) / cupHeight) * (topRadius - bottomRadius);
    const sleeveTopRadius = radiusAt(sleeveY + sleeveHeight / 2) + 0.015;
    const sleeveBottomRadius = radiusAt(sleeveY - sleeveHeight / 2) + 0.015;
    const sleeveGeo = new THREE.CylinderGeometry(
      sleeveTopRadius,
      sleeveBottomRadius,
      sleeveHeight,
      budget.radialSegments,
      1,
      true
    );
    sleeveGeo.rotateY(Math.PI);

    const sleeveCanvas = createBrunSleeveCanvas(appearance, budget.textureWidth);
    const sleeveTexture = new THREE.CanvasTexture(sleeveCanvas);
    sleeveTexture.colorSpace = THREE.SRGBColorSpace;
    sleeveTexture.generateMipmaps = true;
    sleeveTexture.minFilter = THREE.LinearMipmapLinearFilter;
    sleeveTexture.magFilter = THREE.LinearFilter;
    sleeveTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    sleeveTexture.needsUpdate = true;
    let disposed = false;
    if (document.fonts.status !== 'loaded') document.fonts.ready.then(() => {
      if (disposed) return;
      sleeveTexture.image = createBrunSleeveCanvas(appearance, budget.textureWidth);
      sleeveTexture.needsUpdate = true;
      wakeRef.current?.();
    });

    const sleeveMat = new THREE.MeshStandardMaterial({
      map: sleeveTexture,
      roughness: 0.88,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeveMesh.position.y = sleeveY;
    cupGroup.add(sleeveMesh);

    // Black Lid
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.32,
      metalness: 0.12,
    });

    const lidBaseGeo = new THREE.CylinderGeometry(topRadius + 0.08, topRadius + 0.06, 0.28, 64);
    const lidBaseMesh = new THREE.Mesh(lidBaseGeo, lidMat);
    lidBaseMesh.position.y = cupHeight / 2 + 0.14;
    cupGroup.add(lidBaseMesh);

    const lidRingGeo = new THREE.TorusGeometry(topRadius + 0.08, 0.045, 16, 64);
    lidRingGeo.rotateX(Math.PI / 2);
    const lidRingMesh = new THREE.Mesh(lidRingGeo, lidMat);
    lidRingMesh.position.y = cupHeight / 2 + 0.02;
    cupGroup.add(lidRingMesh);

    const lidDomeGeo = new THREE.CylinderGeometry(topRadius - 0.08, topRadius + 0.04, 0.26, 64);
    const lidDomeMesh = new THREE.Mesh(lidDomeGeo, lidMat);
    lidDomeMesh.position.y = cupHeight / 2 + 0.36;
    cupGroup.add(lidDomeMesh);

    // Sip Spout
    const spoutGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.20, 32);
    const spoutMesh = new THREE.Mesh(spoutGeo, lidMat);
    spoutMesh.position.set(0, cupHeight / 2 + 0.54, topRadius - 0.32);
    cupGroup.add(spoutMesh);

    // Sip Hole
    const sipHoleGeo = new THREE.RingGeometry(0.04, 0.16, 24);
    sipHoleGeo.rotateX(-Math.PI / 2);
    const sipHoleMat = new THREE.MeshBasicMaterial({ color: 0x050505, side: THREE.DoubleSide });
    const sipHoleMesh = new THREE.Mesh(sipHoleGeo, sipHoleMat);
    sipHoleMesh.position.set(0, cupHeight / 2 + 0.65, topRadius - 0.32);
    cupGroup.add(sipHoleMesh);

    // Subtle drop shadow plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, 'rgba(40, 25, 15, 0.45)');
      grad.addColorStop(0.5, 'rgba(40, 25, 15, 0.18)');
      grad.addColorStop(1, 'rgba(40, 25, 15, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -cupHeight / 2 - 0.08;
    cupGroup.add(shadowMesh);

    // Steam particles (if enabled)
    let steamGeo: THREE.BufferGeometry | null = null;
    let steamPositions: Float32Array | null = null;
    let steamSpeeds: Float32Array | null = null;
    let steamOffsets: Float32Array | null = null;
    const steamCount = 18;

    if (steam) {
      steamGeo = new THREE.BufferGeometry();
      steamPositions = new Float32Array(steamCount * 3);
      steamSpeeds = new Float32Array(steamCount);
      steamOffsets = new Float32Array(steamCount);

      for (let i = 0; i < steamCount; i++) {
        steamPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.12;
        steamPositions[i * 3 + 1] = Math.random() * 1.5;
        steamPositions[i * 3 + 2] = topRadius - 0.32 + (Math.random() - 0.5) * 0.1;
        steamSpeeds[i] = 0.35 + Math.random() * 0.4;
        steamOffsets[i] = Math.random() * Math.PI * 2;
      }
      steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

      const steamCanv = document.createElement('canvas');
      steamCanv.width = 64;
      steamCanv.height = 64;
      const sctx = steamCanv.getContext('2d');
      if (sctx) {
        const sgrad = sctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        sgrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
        sgrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.25)');
        sgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        sctx.fillStyle = sgrad;
        sctx.fillRect(0, 0, 64, 64);
      }
      const steamTex = new THREE.CanvasTexture(steamCanv);
      const steamMat = new THREE.PointsMaterial({
        size: 0.35,
        map: steamTex,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const steamPoints = new THREE.Points(steamGeo, steamMat);
      steamPoints.position.y = cupHeight / 2 + 0.65;
      cupGroup.add(steamPoints);
    }

    // Animation Loop
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animId: number | null = null;
    let lastTime: number | null = null;
    let elapsed = 0;
    let turnElapsed = 0;
    let inView = false;

    const animate = (timestamp: number) => {
      animId = null;
      const settings = settingsRef.current;
      if (disposed || !inView || !settings.active || document.hidden) {
        lastTime = null;
        return;
      }
      const delta = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      elapsed += delta;

      if (cupGroupRef.current) {
        cupGroupRef.current.scale.setScalar(settings.scale);
        if (!reduceMotion.matches && !isDraggingRef.current) {
          if (settings.initialTurn) {
            turnElapsed = Math.min(1.6, turnElapsed + delta);
            cupGroupRef.current.rotation.y = (turnElapsed / 1.6) * Math.PI * 2;
          } else if (settings.docked) {
            const current = cupGroupRef.current.rotation.y;
            const target = Math.round(current / (Math.PI * 2)) * Math.PI * 2;
            cupGroupRef.current.rotation.y = THREE.MathUtils.damp(current, target, 5, delta);
          } else {
            cupGroupRef.current.rotation.y += settings.speed * delta;
          }
        }
        // Keep perpendicular upright
        cupGroupRef.current.rotation.z = 0;
        cupGroupRef.current.rotation.x = 0;

        // Gentle breathing float
        cupGroupMeshY(reduceMotion.matches ? 0 : elapsed);
      }

      if (!reduceMotion.matches && steamGeo && steamPositions && steamSpeeds && steamOffsets) {
        const time = elapsed;
        for (let i = 0; i < steamCount; i++) {
          steamPositions[i * 3 + 1] += steamSpeeds[i] * delta;
          steamPositions[i * 3 + 0] = Math.sin(time * 1.5 + steamOffsets[i]) * 0.05;

          if (steamPositions[i * 3 + 1] > 1.8) {
            steamPositions[i * 3 + 1] = 0.02;
            steamPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.06;
          }
        }
        steamGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      if (!reduceMotion.matches) animId = requestAnimationFrame(animate);
    };

    const cupGroupMeshY = (time: number) => {
      if (cupGroupRef.current) {
        cupGroupRef.current.position.y = Math.sin(time * 1.8) * 0.035;
      }
    };

    const wake = () => {
      if (disposed || !inView || !settingsRef.current.active || document.hidden) {
        if (animId !== null) cancelAnimationFrame(animId);
        animId = null;
        lastTime = null;
        return;
      }
      if (animId !== null) return;
      lastTime = null;
      animId = requestAnimationFrame(animate);
    };
    wakeRef.current = wake;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      wake();
    });
    observer.observe(container);
    document.addEventListener('visibilitychange', wake);
    reduceMotion.addEventListener('change', wake);

    let previousWidth = width;
    let previousHeight = height;
    let previousPixelRatio = budget.pixelRatio;
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const nextBudget = getCupRenderBudget(w, h, window.innerWidth, window.devicePixelRatio);
      if (w === previousWidth && h === previousHeight && nextBudget.pixelRatio === previousPixelRatio) return;
      previousWidth = w;
      previousHeight = h;
      previousPixelRatio = nextBudget.pixelRatio;
      camera.aspect = w / h;
      camera.position.z = Math.max(7.5, 4.8 / camera.aspect);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(nextBudget.pixelRatio);
      renderer.setSize(w, h);
      wake();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    camera.position.z = Math.max(7.5, 4.8 / camera.aspect);

    // Interactive Drag
    const onPointerDown = (e: PointerEvent) => {
      if (!settingsRef.current.interactive || !e.isPrimary || e.button !== 0) return;
      isDraggingRef.current = true;
      dragDistanceRef.current = 0;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      container.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !cupGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      dragDistanceRef.current += Math.abs(deltaX);
      cupGroupRef.current.rotation.y += deltaX * 0.015;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      wake();
    };
    const onPointerUp = () => {
      isDraggingRef.current = false;
    };
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('lostpointercapture', onPointerUp);

    return () => {
      disposed = true;
      if (animId !== null) cancelAnimationFrame(animId);
      wakeRef.current = null;
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', wake);
      reduceMotion.removeEventListener('change', wake);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('lostpointercapture', onPointerUp);

      cupGeo.dispose();
      cupMat.dispose();
      lipGeo.dispose();
      bottomLipGeo.dispose();
      sleeveGeo.dispose();
      sleeveMat.dispose();
      sleeveTexture.dispose();
      lidMat.dispose();
      lidBaseGeo.dispose();
      lidRingGeo.dispose();
      lidDomeGeo.dispose();
      spoutGeo.dispose();
      sipHoleGeo.dispose();
      sipHoleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material instanceof THREE.PointsMaterial) material.map?.dispose();
            material.dispose();
          });
        }
      });
      if (steamGeo) steamGeo.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      rendererRef.current = null;
      cupGroupRef.current = null;
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [steam, appearance]);

  return (
    <div
      ref={mountRef}
      data-cup-appearance={appearance}
      style={{ touchAction: interactive ? 'pan-y' : 'auto' }}
      className={`relative cursor-grab active:cursor-grabbing select-none flex items-center justify-center ${className}`}
      onClickCapture={(event) => {
        if (dragDistanceRef.current > 5) {
          event.stopPropagation();
          dragDistanceRef.current = 0;
        }
      }}
    >
      {hasError && (
        <div className="w-full h-full flex flex-col items-center justify-center" role="status">
          <img src="/assets/user/img5.jpg" alt="BRUN signature cup" className="max-h-full object-contain" />
          <span className="text-[10px]">3D preview unavailable</span>
        </div>
      )}
    </div>
  );
};

export const SpinningCupCanvas: React.FC<SpinningCupCanvasProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const currentlyInView = useInView(ref);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (inView && props.active !== false) setInitialized(true);
  }, [inView, props.active]);

  return (
    <div ref={ref} className={props.className ?? 'w-full h-full min-h-[280px]'}>
      {initialized && <CupRenderer {...props} active={props.active !== false && currentlyInView} className="w-full h-full min-h-[inherit]" />}
    </div>
  );
};
