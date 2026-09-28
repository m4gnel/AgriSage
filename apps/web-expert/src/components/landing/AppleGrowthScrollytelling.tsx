import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Cpu, Zap, ArrowRight, Activity, Layers } from 'lucide-react';

interface AppleGrowthScrollytellingProps {
  onEnterPlatform?: () => void;
  onEnterAuth?: () => void;
}

export const AppleGrowthScrollytelling: React.FC<AppleGrowthScrollytellingProps> = ({
  onEnterPlatform,
  onEnterAuth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollP, setScrollP] = useState(0); // 0 to 1
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadCount, setPreloadCount] = useState(0);

  const totalFrames = 441;
  const targetFrameRef = useRef(0);
  const animatedFrameRef = useRef(0);

  // Generate 441 frame URLs formatted as '0001.jpg', '0002.jpg', ..., '0441.jpg'
  const frameUrls = useMemo(() => {
    return Array.from({ length: totalFrames }, (_, i) => {
      const num = String(i + 1).padStart(4, '0');
      return `/images/Agri-Sage-Section-2-animation/${num}.jpg`;
    });
  }, [totalFrames]);

  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload frames in parallel
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(totalFrames);
    let loaded = 0;

    frameUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loaded++;
        setPreloadCount(loaded);
        if (loaded === 1 && canvasRef.current) {
          drawCanvasFrame(0, images);
        }
        if (loaded >= 30) {
          setIsPreloaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        setPreloadCount(loaded);
      };
      images[i] = img;
    });

    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, [frameUrls, totalFrames]);

  const lastDrawnFrameRef = useRef<number>(-1);
  const lastScrollPRef = useRef<number>(-1);

  // Resize canvas dimensions smoothly on window resize without forced layout thrashing inside RAF
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(parent.clientWidth * dpr);
    const targetH = Math.round(parent.clientHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
  }, []);

  // High-performance Canvas draw with aspect cover & #050505 background fill
  const drawCanvasFrame = useCallback((frameIdx: number, imgsList?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const imgs = imgsList || imagesRef.current;
    const img = imgs[frameIdx];

    updateCanvasDimensions();

    // Clear with strict #050505 color for perfect void blending
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Aspect cover positioning logic
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgRatio > canvasRatio) {
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }, [updateCanvasDimensions]);

  // Smooth spring-dampened frame interpolation loop
  useEffect(() => {
    let animId: number;

    const lerpFrameLoop = () => {
      const target = targetFrameRef.current;
      const current = animatedFrameRef.current;

      // Smooth dampening factor (~0.22 for responsive yet buttery frame transitions)
      const diff = target - current;
      if (Math.abs(diff) > 0.01) {
        animatedFrameRef.current = current + diff * 0.22;
        const roundedIdx = Math.min(totalFrames - 1, Math.max(0, Math.round(animatedFrameRef.current)));
        if (roundedIdx !== lastDrawnFrameRef.current) {
          lastDrawnFrameRef.current = roundedIdx;
          setCurrentFrame(roundedIdx);
          drawCanvasFrame(roundedIdx);
        }
      }
      animId = requestAnimationFrame(lerpFrameLoop);
    };

    animId = requestAnimationFrame(lerpFrameLoop);

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScrollable = rect.height - vh;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      
      // Quantize setScrollP updates to prevent micro React re-renders on sub-pixel scroll movements
      if (Math.abs(progress - lastScrollPRef.current) > 0.002) {
        lastScrollPRef.current = progress;
        setScrollP(progress);
      }

      const frameIdx = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
      targetFrameRef.current = frameIdx;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [totalFrames, drawCanvasFrame]);

  // Determine active story beat based on scroll percentage
  const activeBeat = useMemo(() => {
    if (scrollP < 0.20) return 1; // Beat A: 0-20%
    if (scrollP < 0.45) return 2; // Beat B: 25-45%
    if (scrollP < 0.70) return 3; // Beat C: 50-70%
    if (scrollP < 0.95) return 4; // Beat D: 75-95%
    return 5;
  }, [scrollP]);

  // Stage name helper
  const stageName = useMemo(() => {
    if (currentFrame < 80) return 'Stage I · Embryonic Awakening';
    if (currentFrame < 180) return 'Stage II · Cotyledon Emergence';
    if (currentFrame < 290) return 'Stage III · Foliar Expansion';
    if (currentFrame < 380) return 'Stage IV · Vegetative Vigor';
    return 'Stage V · Full Canopy Saturation';
  }, [currentFrame]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full bg-[#050505] text-white selection:bg-emerald-500 selection:text-white"
      style={{ height: '400vh' }}
    >
      {/* Preloading Overlay */}
      <AnimatePresence>
        {!isPreloaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Sprout size={24} className="text-emerald-400 animate-pulse" />
            </div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase mb-2">
              Initializing 441-Frame Scrollytelling Sequence
            </h4>
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-400 transition-all duration-150"
                style={{ width: `${Math.min(100, Math.round((preloadCount / totalFrames) * 100))}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-white/50">
              {Math.min(100, Math.round((preloadCount / totalFrames) * 100))}% Loaded
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Full-Screen Pinned Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between items-center bg-[#050505]">
        {/* Seamless Radial Ambient Glow in Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_#050815_0%,_#050505_75%)]" />

        {/* Full-Screen Canvas Engine */}
        <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.04]"
          />
        </div>

        {/* Top HUD Telemetry Badge */}
        <div className="relative z-30 w-full px-6 pt-6 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{stageName}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white/80 text-xs font-mono font-bold tracking-widest shadow-xl">
            <span className="text-emerald-400">FRAME</span>
            <span>{String(currentFrame + 1).padStart(3, '0')} / {totalFrames}</span>
          </div>
        </div>

        {/* Dynamic Scrollytelling Beats */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 flex-1 flex items-center pointer-events-none">
          <AnimatePresence mode="wait">
            {/* Beat A — 0–20% Scroll (Centered Hero) */}
            {activeBeat === 1 && (
              <motion.div
                key="beat-a"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-4xl mx-auto text-center space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-widest">
                  <Sprout size={13} />
                  <span>Biophysical Transformation Engine</span>
                </div>
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-2xl leading-[0.95]">
                  EMERGENCE. <br />
                  <span className="bg-gradient-to-r from-white via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                    PERFECTED.
                  </span>
                </h2>
                <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                  Scroll to scrub through 441 hyper-photorealistic frames. Watch cellular plant phenology expand from embryonic seed awakening to full biophysical canopy saturation.
                </p>
              </motion.div>
            )}

            {/* Beat B — 25–45% Scroll (Left Aligned Feature) */}
            {activeBeat === 2 && (
              <motion.div
                key="beat-b"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-xl text-left space-y-5 p-8 sm:p-10 rounded-3xl bg-black/75 backdrop-blur-2xl border border-white/15 shadow-2xl"
              >
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={14} />
                  <span>Phenological Architecture</span>
                </div>
                <h3 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  Precision-Engineered <br /> for Cellular Vitality.
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed font-medium">
                  Custom DSSAT biophysical models, sealed acoustic transpiration chambers, and real-time stomatal conductance analysis deliver studio-grade agricultural insight.
                </p>
                <div className="pt-2 flex items-center gap-6 text-xs font-mono text-white/60">
                  <span>Root Vigour: <strong className="text-emerald-400">99.2%</strong></span>
                  <span>Conductance: <strong className="text-teal-300">0.84 mol/m²s</strong></span>
                </div>
              </motion.div>
            )}

            {/* Beat C — 50–70% Scroll (Right Aligned Feature) */}
            {activeBeat === 3 && (
              <motion.div
                key="beat-c"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-xl ml-auto text-left space-y-5 p-8 sm:p-10 rounded-3xl bg-black/75 backdrop-blur-2xl border border-white/15 shadow-2xl"
              >
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} />
                  <span>Adaptive Stress Isolation</span>
                </div>
                <h3 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  Adaptive Multispectral <br /> Intelligence, Redefined.
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed font-medium">
                  Multi-spectral satellite array listens in every direction. Real-time thermal stress analysis adapts to your environment—drought, pests, and yield anomalies fade away.
                </p>
                <ul className="space-y-2 text-xs font-mono text-white/80 pt-1">
                  <li className="flex items-center gap-2 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>780nm RedEdge Shift Multi-Spectral Array</span>
                  </li>
                  <li className="flex items-center gap-2 text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Real-Time Pathogen Outbreak Isolation</span>
                  </li>
                </ul>
              </motion.div>
            )}

            {/* Beat D — 75–95% Scroll (Centered CTA) */}
            {activeBeat >= 4 && (
              <motion.div
                key="beat-d"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-3xl mx-auto text-center space-y-6 pointer-events-auto p-8 sm:p-12 rounded-3xl bg-black/80 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20"
              >
                <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Layers size={14} />
                  <span>Yield Projection Physics</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-2xl">
                  Hear Everything. <br />
                  <span className="text-emerald-400">Protect Every Harvest.</span>
                </h2>
                <p className="text-base text-white/80 max-w-xl mx-auto font-medium">
                  AgriSage Biophysical Edition. Designed for focus, crafted for smallholders and agronomists worldwide.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={onEnterPlatform}
                    className="btn btn-primary text-sm h-14 px-8 font-bold flex items-center gap-2.5 shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform"
                  >
                    <span>Experience AgriSage Platform</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={onEnterAuth}
                    className="btn bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/25 text-sm h-14 px-7 font-bold flex items-center gap-2 hover:border-emerald-400 transition-all"
                  >
                    <Zap size={16} className="text-amber-400" />
                    <span>See Full Biophysical Specs</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll to Explore Indicator (Fades out by 10% scroll) */}
        <AnimatePresence>
          {scrollP < 0.08 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative z-30 mb-4 flex flex-col items-center gap-2 text-white/60 pointer-events-none"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Scroll to Explore Sequence
              </span>
              <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
                <span className="w-1 h-2 rounded-full bg-emerald-400 animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Scroll Progress Bar */}
        <div className="relative z-30 w-full px-6 pb-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-white/60 mb-2">
            <span>SCROLL-LINKED SEQUENCE · 441 FRAMES</span>
            <span>{Math.round(scrollP * 100)}% COMPLETE</span>
          </div>
          <div className="max-w-7xl mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-75 ease-out"
              style={{ width: `${scrollP * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
