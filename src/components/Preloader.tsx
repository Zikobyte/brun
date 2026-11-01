import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SpinningCupCanvas } from './SpinningCupCanvas';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'writing' | 'sliding' | 'done'>('writing');
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  const [lettersVisible, setLettersVisible] = useState({
    b: false,
    r: false,
    u: false,
    dots: false,
    n: false,
    tagline: false,
    cup: false,
  });

  // Lock body scroll while preloader is active so the page does not move underneath
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (stage !== 'writing') return;
    if (reduceMotion) {
      setStage('sliding');
      return;
    }
    // Exact requested sequential reveal:
    // 1. Letter B
    const t1 = setTimeout(() => {
      setLettersVisible((p) => ({ ...p, b: true }));
    }, 250);

    // 2. Letter R
    const t2 = setTimeout(() => {
      setLettersVisible((p) => ({ ...p, r: true }));
    }, 600);

    // 3. Letter U with the two dots above Ü
    const t3 = setTimeout(() => {
      setLettersVisible((p) => ({ ...p, u: true, dots: true }));
    }, 950);

    // 4. Letter N
    const t4 = setTimeout(() => {
      setLettersVisible((p) => ({ ...p, n: true }));
    }, 1300);

    // Tagline cursive script "your day"
    const t5 = setTimeout(() => {
      setLettersVisible((p) => ({ ...p, tagline: true }));
    }, 1500);

    // CRUCIAL: Once they are finished writing, the 3D cup will appear at the right side of it!
    const t6 = setTimeout(() => {
      setLettersVisible((p) => ({ ...p, cup: true }));
    }, 1750);

    // Then, the preloader transitions up smoothly
    const t7 = setTimeout(() => {
      setStage('sliding');
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [stage, reduceMotion]);

  const handleSkip = () => {
    setStage('sliding');
  };

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="brun-preloader"
          initial={{ y: 0 }}
          animate={{ y: stage === 'sliding' ? '-100%' : 0 }}
          onAnimationComplete={() => {
            if (stage !== 'sliding' || completedRef.current) return;
            completedRef.current = true;
            setStage('done');
            onCompleteRef.current();
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.95,
            ease: [0.76, 0, 0.24, 1], // Luxurious smooth custom cubic-bezier
          }}
          data-preloader
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Central Writing Brand Container with 3D Cup at the Right Side */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-14 px-6 max-w-5xl mx-auto">
            {/* Left: The Word BRÜN & Tagline */}
            <div className="flex flex-col items-center text-center">
              {/* Sequential Letter-by-Letter Writing */}
              <div className="flex items-baseline justify-center tracking-[-0.02em] font-sans font-bold select-none text-[#2F1207]">
                {/* 1. Letter B */}
                <motion.span
                  initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                  animate={{
                    opacity: lettersVisible.b ? 1 : 0,
                    y: lettersVisible.b ? 0 : 22,
                    filter: lettersVisible.b ? 'blur(0px)' : 'blur(6px)',
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-none font-black text-[#2F1207] mx-1 sm:mx-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", "Montserrat", sans-serif' }}
                >
                  B
                </motion.span>

                {/* 2. Letter R */}
                <motion.span
                  initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                  animate={{
                    opacity: lettersVisible.r ? 1 : 0,
                    y: lettersVisible.r ? 0 : 22,
                    filter: lettersVisible.r ? 'blur(0px)' : 'blur(6px)',
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-none font-black text-[#2F1207] mx-1 sm:mx-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", "Montserrat", sans-serif' }}
                >
                  R
                </motion.span>

                {/* 3. Letter Ü with two distinct dots on top */}
                <div className="relative inline-flex flex-col items-center mx-1 sm:mx-2">
                  {/* Two Roasted Espresso Dots directly above letter U */}
                  <div className="absolute -top-7 sm:-top-9 md:-top-11 lg:-top-14 flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
                    <motion.span
                      initial={{ opacity: 0, scale: 0, y: -16 }}
                      animate={{
                        opacity: lettersVisible.dots ? 1 : 0,
                        scale: lettersVisible.dots ? 1 : 0,
                        y: lettersVisible.dots ? 0 : -16,
                      }}
                      transition={{ type: 'spring', damping: 14, stiffness: 320, delay: 0.05 }}
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#2F1207] shadow-sm inline-block"
                    />
                    <motion.span
                      initial={{ opacity: 0, scale: 0, y: -16 }}
                      animate={{
                        opacity: lettersVisible.dots ? 1 : 0,
                        scale: lettersVisible.dots ? 1 : 0,
                        y: lettersVisible.dots ? 0 : -16,
                      }}
                      transition={{ type: 'spring', damping: 14, stiffness: 320, delay: 0.15 }}
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#2F1207] shadow-sm inline-block"
                    />
                  </div>

                  {/* Letter U Body */}
                  <motion.span
                    initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                    animate={{
                      opacity: lettersVisible.u ? 1 : 0,
                      y: lettersVisible.u ? 0 : 22,
                      filter: lettersVisible.u ? 'blur(0px)' : 'blur(6px)',
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-none font-black text-[#2F1207]"
                    style={{ fontFamily: '"Plus Jakarta Sans", "Montserrat", sans-serif' }}
                  >
                    U
                  </motion.span>
                </div>

                {/* 4. Letter N */}
                <motion.span
                  initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                  animate={{
                    opacity: lettersVisible.n ? 1 : 0,
                    y: lettersVisible.n ? 0 : 22,
                    filter: lettersVisible.n ? 'blur(0px)' : 'blur(6px)',
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-none font-black text-[#2F1207] mx-1 sm:mx-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", "Montserrat", sans-serif' }}
                >
                  N
                </motion.span>
              </div>

              {/* Handwritten cursive tagline & coffee divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.8 }}
                animate={{
                  opacity: lettersVisible.tagline ? 1 : 0,
                  scaleX: lettersVisible.tagline ? 1 : 0.8,
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md sm:max-w-lg mt-3 flex flex-col items-center"
              >
                {/* Thin horizontal line interrupted by coffee bean */}
                <div className="flex items-center w-full justify-center gap-3">
                  <div className="h-[2px] flex-1 bg-[#2F1207]/35 max-w-[130px]" />
                  <div className="w-5 h-3.5 rounded-full bg-[#2F1207] relative -rotate-12 flex items-center justify-center">
                    <div className="w-4 h-[1.5px] bg-white rounded-full" />
                  </div>
                  <div className="h-[2px] flex-1 bg-[#2F1207]/35 max-w-[130px]" />
                </div>

                {/* Flowing handwritten tagline */}
                <p
                  className="font-script text-3xl sm:text-4xl md:text-5xl text-[#2F1207] mt-1.5 font-normal"
                  style={{ fontFamily: '"Caveat", "Brush Script MT", cursive' }}
                >
                  your day
                </p>

                {/* Subtitle */}
                <p className="font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase text-[#6D4C41] mt-1">
                  Specialty Roastery & Cafe
                </p>
              </motion.div>
            </div>

            {/* Right: 3D Cup Appears at the Right Side Once Writing Completes */}
            <AnimatePresence>
              {lettersVisible.cup && (
                <motion.div
                  key="preloader-3d-cup"
                  initial={{ opacity: 0, scale: 0.25, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: 'spring',
                    damping: 18,
                    stiffness: 260,
                    mass: 0.9,
                  }}
                  className="w-36 h-48 sm:w-48 sm:h-64 md:w-56 md:h-72 flex-shrink-0 flex items-center justify-center relative"
                >
                  {/* Subtle contact shadow below cup */}
                  <div className="absolute -bottom-2 w-32 h-6 bg-[#2F1207]/10 rounded-full blur-md" />

                  {/* Standalone 3D Cup Canvas with exact identical sleeve, lid, steam & artwork */}
                  <SpinningCupCanvas
                    className="w-full h-full"
                    speed={1.15}
                    interactive={false}
                    scale={1.05}
                    steam={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minimalist Bottom Indicator & Skip Link */}
          <div className="absolute bottom-8 flex flex-col items-center gap-2">
            <span className="text-[10px] font-cinzel tracking-widest uppercase text-[#8D6E63] font-semibold">
              Crafting Excellence
            </span>
            <div className="w-14 h-0.5 bg-[#2F1207]/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-[#2F1207]"
              />
            </div>
            <button
              onClick={handleSkip}
              disabled={stage !== 'writing'}
              className="text-[10px] text-[#8D6E63] hover:text-[#2F1207] transition-colors cursor-pointer tracking-wider underline underline-offset-4 mt-1"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
