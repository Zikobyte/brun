import React, { useState, useEffect, useRef } from 'react';
import { motion, animate, useMotionValue, useTransform, useReducedMotion, useInView } from 'motion/react';
import {
  Play,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Plus,
  Sparkles,
  Award,
  Truck
} from 'lucide-react';
import { RoastStat, FlavorSplash, ProductItem } from '../types';
import { CoffeeCup3D } from './CoffeeCup3D';
import { getCupPose, getHeroChapter, getMouthfeelsY } from '../utils/heroAnimation';
import { BrunCafeMenuSections } from './BrunCafeMenuSections';
import { SpinningCupCanvas } from './SpinningCupCanvas';
import { ViewportVideo } from './ViewportVideo';
import { formatNaira } from '../utils/pricing';

interface HeroScrollContainerProps {
  onOpenRoaster: () => void;
  onOpenOrder: () => void;
  onAddToCart: (product: ProductItem) => void;
  activeChapter: number;
  setActiveChapter: (ch: number) => void;
  allProducts: ProductItem[];
  isPreloaderDone?: boolean;
}

export const HeroScrollContainer: React.FC<HeroScrollContainerProps> = ({
  onOpenRoaster,
  onOpenOrder,
  onAddToCart,
  activeChapter,
  setActiveChapter,
  allProducts,
  isPreloaderDone = true,
}) => {
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroTrackRef);
  const progress = useMotionValue(0);
  const [activeStatIndex, setActiveStatIndex] = useState<number | null>(null);
  const [activeFlavor, setActiveFlavor] = useState<string | null>(null);
  const [pairingTab, setPairingTab] = useState<'brunch' | 'pastry' | 'dessert'>('brunch');
  const [isInitialSpinDone, setIsInitialSpinDone] = useState(false);
  const entranceFactor = useMotionValue(0);
  const screenWidth = useMotionValue(window.innerWidth);
  const screenHeight = useMotionValue(window.innerHeight);
  const reduceMotion = useReducedMotion();
  const [cupActive, setCupActive] = useState(false);
  const [cupDocked, setCupDocked] = useState(false);
  const [lineupActive, setLineupActive] = useState(false);
  const [heroAmbient, setHeroAmbient] = useState(true);
  const [mouthAmbient, setMouthAmbient] = useState(false);
  const heroAnimating = isPreloaderDone && heroInView && heroAmbient && !reduceMotion;
  const mouthAnimating = isPreloaderDone && heroInView && mouthAmbient && !reduceMotion;
  const lastSceneRef = useRef('');
  const lastChapterRef = useRef(-1);

  // Stats for Scene 1 (matching ABV 6.2%, IBU 51.5, OG 1.059 in Video 1)
  const roastStats: RoastStat[] = [
    {
      label: 'ROAST LEVEL',
      value: '6.2%',
      unit: 'City+ Medium',
      description: 'Slow-drum caramelized to bring out bright natural berry sugars without charred bitterness.',
      detail: 'Dropped at precisely 412°F after first crack in our cast-iron vintage drum roaster.',
    },
    {
      label: 'IBU EQUIV',
      value: '51.5',
      unit: 'Acidity Index',
      description: 'High-altitude micro-climate in Gedeo, Ethiopia creates dense beans with explosive floral sweetness.',
      detail: 'Winey phosphoric acidity balanced by natural honey mucilage from shade-grown heirloom trees.',
    },
    {
      label: 'ORIGINAL GRAVITY',
      value: '1.059',
      unit: 'Extraction 89.5 SCAA',
      description: 'Certified specialty single origin lot with remarkable cleanliness, wild bergamot and toffee finish.',
      detail: 'Certified Q-Grader score 89.5 with exceptional floral aroma and silky mouthfeel.',
    },
  ];

  // Initial centered turntable, followed by the scroll-driven cup choreography.
  useEffect(() => {
    if (!isPreloaderDone) return;
    let animation: ReturnType<typeof animate> | undefined;
    const timer = setTimeout(() => {
      setIsInitialSpinDone(true);
      animation = animate(entranceFactor, 1, {
        duration: reduceMotion ? 0 : 0.75,
        ease: [0.16, 1, 0.3, 1],
      });
    }, reduceMotion ? 0 : 1600);
    return () => {
      clearTimeout(timer);
      animation?.stop();
    };
  }, [isPreloaderDone, entranceFactor, reduceMotion]);

  useEffect(() => {
    let rAFId: number | null = null;
    let trackTop = 0;
    let scrollableDistance = 1;

    const measure = () => {
      const track = heroTrackRef.current;
      if (!track) return;
      trackTop = track.getBoundingClientRect().top + window.scrollY;
      scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
      screenWidth.set(window.innerWidth);
      screenHeight.set(window.innerHeight);
      handleScroll();
    };

    const updateScrollProgress = () => {
      rAFId = null;
      if (!heroTrackRef.current) return;
      if (scrollableDistance > 0) {
        const currentScroll = window.scrollY - trackTop;
        const p = Math.min(1, Math.max(0, currentScroll / scrollableDistance));
        progress.set(p);
        const cup = isPreloaderDone && p < 0.934;
        const docked = p > 0.65;
        const lineup = isPreloaderDone && p > 0.60 && window.scrollY < trackTop + scrollableDistance + window.innerHeight;
        const hero = p < 1 / 5.2;
        const mouth = p > 0.32 && p < 0.58 + 1 / 6;
        const sceneKey = `${cup}:${docked}:${lineup}:${hero}:${mouth}`;
        if (sceneKey !== lastSceneRef.current) {
          lastSceneRef.current = sceneKey;
          setCupActive(cup);
          setCupDocked(docked);
          setLineupActive(lineup);
          setHeroAmbient(hero);
          setMouthAmbient(mouth);
        }

        const nextChapter = getHeroChapter(p);

        if (nextChapter !== lastChapterRef.current) {
          lastChapterRef.current = nextChapter;
          setActiveChapter(nextChapter);
        }
      }
    };

    const handleScroll = () => {
      if (rAFId === null) {
        rAFId = requestAnimationFrame(updateScrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', measure);
    const resizeObserver = new ResizeObserver(measure);
    if (heroTrackRef.current) resizeObserver.observe(heroTrackRef.current);
    measure();
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measure);
      resizeObserver.disconnect();
      if (rAFId !== null) cancelAnimationFrame(rAFId);
    };
  }, [setActiveChapter, progress, screenWidth, screenHeight, isPreloaderDone]);

  // Interpolation calculations for scenes:
  // Scene 1: Initial Release (0.0 to 0.18) -> Details View (0.18 to 0.36)
  // Scene 2: Mouthfeels (0.36 to 0.64)
  // Scene 3: Year Round Lineup (0.64 to 1.00)

  // 1. Initial "UNLIMITED RELEASE BREW" background text
  const heroReleaseTextOpacity = useTransform(progress, p => Math.max(0, 1 - p * 5.2));
  const heroReleaseTextTranslateY = useTransform(progress, p => -p * 260);

  // 2. Scene 1 details (Left "ETHIOPIAN YIRGACHEFFE" & Right Stats Box)
  const scene1DetailsOpacity = useTransform(progress, p =>
    p < 0.08
      ? p / 0.08
      : p < 0.28
      ? 1
      : Math.max(0, 1 - (p - 0.28) * 6));
  const scene1DetailsTranslateY = useTransform(progress, p =>
    p < 0.12 ? (1 - p / 0.12) * 40 : (p - 0.12) * -120);

  // 3. Scene 2 "MOUTHFEELS" text
  const mouthfeelsOpacity = useTransform(progress, p =>
    p < 0.28
      ? 0
      : p < 0.58
      ? Math.min(1, (p - 0.28) * 5)
      : Math.max(0, 1 - (p - 0.58) * 5));
  const mouthfeelsTranslateY = useTransform(progress, getMouthfeelsY);

  // 4. Scene 2 details (Video box left, Style right, Splatters)
  const mouthfeelsDetailsOpacity = useTransform(progress, p =>
    p < 0.32
      ? 0
      : p < 0.58
      ? Math.min(1, (p - 0.32) * 5)
      : Math.max(0, 1 - (p - 0.58) * 6));

  // 5. Scene 3 "YEAR ROUND" & Lineup
  // Appears smoothly and STAYS fully visible so the lineup can be enjoyed and ordered from
  const lineupOpacity = useTransform(progress, p =>
    p < 0.60
      ? 0
      : p < 0.72
      ? (p - 0.60) / 0.12
      : 1);
  const lineupTranslateY = useTransform(progress, p =>
    (1 - Math.max(0, Math.min(1, (p - 0.60) / 0.08))) * 45);

  const heroVisibility = useTransform(heroReleaseTextOpacity, o => o > 0.002 ? 'visible' : 'hidden');
  const scene1Visibility = useTransform(scene1DetailsOpacity, o => o > 0.002 ? 'visible' : 'hidden');
  const mouthfeelsVisibility = useTransform(mouthfeelsOpacity, o => o > 0.002 ? 'visible' : 'hidden');
  const mouthfeelsDetailsVisibility = useTransform(mouthfeelsDetailsOpacity, o => o > 0.002 ? 'visible' : 'hidden');
  const lineupVisibility = useTransform(lineupOpacity, o => o > 0.002 ? 'visible' : 'hidden');

  const cupPose = useTransform(() =>
    getCupPose(progress.get(), entranceFactor.get(), screenWidth.get(), screenHeight.get()));


  return (
    <div className="relative w-full bg-parchment text-[#1D1B16] selection:bg-[#2F1207] selection:text-white">
      {/* =========================================================================
          HERO ANIMATED TRACK (Scenes 1-3)
          The cup belongs to the sticky stage during this track,
          then cleanly unpins so the next sections flow naturally in normal document flow.
         ========================================================================= */}
      <div id="brun-hero-track" ref={heroTrackRef} className="relative w-full h-[280vh]">
        {/* Editorial Vertical Left Guide Line (Local to Hero Track) */}
        <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-px bg-[#E5DFD3] pointer-events-none z-30 hidden md:block" />

        {/* STICKY SCENE STAGE (Full Viewport Height) */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-20 pb-6 px-4 sm:px-8 lg:px-16 select-none">
        <CoffeeCup3D
          pose={cupPose}
          active={cupActive}
          docked={cupDocked}
          initialTurn={!isInitialSpinDone}
        />

        {/* -----------------------------------------------------------------
            STAGE 1 BACKDROP: HERO SECTION "BRÜN"
            (Matches Monumental BRÜN Hero Title behind the 3D spinning cup in #2F1207)
           ----------------------------------------------------------------- */}
        <motion.div
          style={{
            opacity: heroReleaseTextOpacity,
            y: heroReleaseTextTranslateY,
            visibility: heroVisibility,
            willChange: 'transform, opacity',
          }}
          className="absolute inset-0 flex flex-col items-center justify-center -z-10"
        >
          {/* Main Monumental BRÜN Brand Title with Wavy Kinetic Feel in #2F1207 */}
          <div className="hero-wordmark select-none text-center w-full leading-[0.84] text-[#2F1207] tracking-[-0.035em]">
            <div className="hero-wordmark-left flex items-baseline justify-end">
            {/* Letter B */}
            <motion.span
              animate={heroAnimating ? { y: [0, -16, 0, 16, 0], rotate: [-1.2, 1.2, -1.2] } : { y: 0, rotate: 0 }}
              transition={{ duration: 4.2, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut' }}
              className="inline-block font-bebas text-[27vw] sm:text-[26vw] md:text-[28vw] font-black text-[#2F1207] text-letterpress"
            >
              B
            </motion.span>

            {/* Letter R */}
            <motion.span
              animate={heroAnimating ? { y: [0, -16, 0, 16, 0], rotate: [1.2, -1.2, 1.2] } : { y: 0, rotate: 0 }}
              transition={{ duration: 4.2, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut', delay: 0.35 }}
              className="inline-block font-bebas text-[27vw] sm:text-[26vw] md:text-[28vw] font-black text-[#2F1207] text-letterpress ml-[0.5vw]"
            >
              R
            </motion.span>

            </div>
            <div aria-hidden="true" />
            <div className="hero-wordmark-right flex items-baseline justify-start">
            {/* Letter Ü with two distinct animated dots */}
            <motion.div
              animate={heroAnimating ? { y: [0, -16, 0, 16, 0], rotate: [-1.2, 1.2, -1.2] } : { y: 0, rotate: 0 }}
              transition={{ duration: 4.2, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut', delay: 0.7 }}
              className="relative inline-flex flex-col items-center ml-[0.5vw]"
            >
              {/* Two Distinct Roasted Coffee Dots above the U in #2F1207 */}
              <div className="absolute -top-[2.2vw] sm:-top-[2.6vw] md:-top-[2.9vw] flex items-center justify-center gap-[1.2vw]">
                <span className="w-[1.8vw] h-[1.8vw] min-w-2 min-h-2 rounded-full bg-[#2F1207] shadow-sm inline-block" />
                <span className="w-[1.8vw] h-[1.8vw] min-w-2 min-h-2 rounded-full bg-[#2F1207] shadow-sm inline-block" />
              </div>
              <span className="inline-block font-bebas text-[27vw] sm:text-[26vw] md:text-[28vw] font-black text-[#2F1207] text-letterpress">
                U
              </span>
            </motion.div>

            {/* Letter N */}
            <motion.span
              animate={heroAnimating ? { y: [0, -16, 0, 16, 0], rotate: [1.2, -1.2, 1.2] } : { y: 0, rotate: 0 }}
              transition={{ duration: 4.2, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut', delay: 1.05 }}
              className="inline-block font-bebas text-[27vw] sm:text-[26vw] md:text-[28vw] font-black text-[#2F1207] text-letterpress ml-[0.5vw]"
            >
              N
            </motion.span>
            </div>
          </div>

          {/* Kinetic Undulating Wave Ribbon & Subtitle Accent in #2F1207 */}
          <div className="flex flex-col items-center -mt-2 sm:-mt-4 w-full max-w-xl px-4">
            <motion.svg
              viewBox="0 0 500 30"
              className="w-full h-6 overflow-visible stroke-[#2F1207]/60 fill-none"
              animate={heroAnimating ? { y: [0, 3, 0] } : { y: 0 }}
              transition={{ duration: 4, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut' }}
            >
              <path
                d="M 0,15 Q 62.5,0 125,15 T 250,15 T 375,15 T 500,15"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            </motion.svg>
            <div className="font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-[0.38em] text-[#2F1207]/85 uppercase mt-1">
              Specialty Roastery & Cafe
            </div>
          </div>


          {/* =========================================================================
              COFFEE DROPS DRIPPING FROM TOP (Occupying Far Left to Far Right)
              Duplicated seamlessly to form a rich curtain of liquid coffee dripping down
             ========================================================================= */}
          <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-20 flex items-start justify-between">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
              <motion.div
                key={`hero-coffee-drop-${idx}`}
                animate={heroAnimating ? {
                  y: [0, idx % 2 === 0 ? 8 : 12, 0],
                  scaleY: [1, 1.04, 1],
                } : { y: 0, scaleY: 1 }}
                transition={{
                  duration: 3.8 + (idx % 3) * 0.7,
                  repeat: heroAnimating ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: idx * 0.22,
                }}
                className="flex-shrink-0 w-36 sm:w-48 md:w-56 lg:w-64 -mt-2 -mx-2 sm:-mx-3 opacity-95 mix-blend-multiply origin-top"
              >
                <img
                  src="/assets/user/coffedrop3.png"
                  alt="Liquid Coffee Dropping from Top"
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            ))}
          </div>

          {/* =========================================================================
              CLEAN COFFEE STAIN STRATEGIC COMPOSITION
              Uses the provided authentic coffee stain PNG (coffeimage2.png):
              NO circular lines, NO dashed borders, NO telemetry text, and NO blur filters.
             ========================================================================= */}

          {/* 1. Top-Right Organic Coffee Stain */}
          <motion.div
            animate={heroAnimating ? { y: [0, -12, 0], rotate: [0, 4, 0] } : { y: 0, rotate: 0 }}
            transition={{ duration: 7, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut' }}
            className="absolute top-[8%] right-[2%] sm:right-[6%] lg:right-[9%] w-52 sm:w-68 lg:w-80 pointer-events-none select-none z-0"
          >
            <img
              src="/assets/user/coffeimage2.png"
              alt="Authentic Coffee Stain"
              className="w-full h-auto object-contain mix-blend-multiply opacity-85"
            />
          </motion.div>

          {/* 2. Lower-Left Coffee Splash Pad (Underneath the 3D Cup docking area) */}
          <motion.div
            animate={heroAnimating ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={{ duration: 6, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut' }}
            className="absolute bottom-[2%] left-[1%] sm:left-[3%] lg:left-[5%] w-60 sm:w-80 lg:w-96 pointer-events-none select-none -z-10"
          >
            <img
              src="/assets/user/coffeimage2.png"
              alt="Authentic Coffee Splash"
              className="w-full h-auto object-contain mix-blend-multiply opacity-85 rotate-45"
            />
          </motion.div>

          {/* 3. Top-Left Botanical Anchor Stain */}
          <motion.div
            animate={heroAnimating ? { y: [0, 8, 0], rotate: [-42, -38, -42] } : { y: 0, rotate: -42 }}
            transition={{ duration: 6.5, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut' }}
            className="absolute top-[18%] left-[4%] sm:left-[12%] lg:left-[16%] w-40 sm:w-52 pointer-events-none select-none -z-10"
          >
            <img
              src="/assets/user/coffeimage2.png"
              alt="Authentic Coffee Stain"
              className="w-full h-auto object-contain mix-blend-multiply opacity-80 -rotate-40"
            />
          </motion.div>

          {/* 4. Mid-Right Organic Liquid Cloud */}
          <motion.div
            animate={heroAnimating ? { y: [0, 10, 0], rotate: [85, 90, 85] } : { y: 0, rotate: 85 }}
            transition={{ duration: 7.2, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[42%] right-[2%] sm:right-[5%] lg:right-[7%] w-48 sm:w-60 pointer-events-none select-none -z-10"
          >
            <img
              src="/assets/user/coffeimage2.png"
              alt="Authentic Coffee Stain"
              className="w-full h-auto object-contain mix-blend-multiply opacity-75 rotate-90"
            />
          </motion.div>

          {/* 5. Floating Natural Micro Droplets */}
          <motion.div
            animate={heroAnimating ? { y: [0, -6, 0] } : { y: 0 }}
            transition={{ duration: 4, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut' }}
            className="absolute top-[28%] left-[26%] w-8 h-8 pointer-events-none select-none -z-10"
          >
            <img
              src="/assets/user/coffeimage2.png"
              alt="Coffee Droplet"
              className="w-full h-full object-contain mix-blend-multiply opacity-80"
            />
          </motion.div>
          <motion.div
            animate={heroAnimating ? { y: [0, 8, 0] } : { y: 0 }}
            transition={{ duration: 4.8, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-[22%] right-[30%] w-10 h-10 pointer-events-none select-none -z-10"
          >
            <img
              src="/assets/user/coffeimage2.png"
              alt="Coffee Droplet"
              className="w-full h-full object-contain mix-blend-multiply opacity-85 rotate-90"
            />
          </motion.div>
          <motion.div
            animate={heroAnimating ? { y: [0, -8, 0], rotate: [0, 15, 0] } : { y: 0, rotate: 0 }}
            transition={{ duration: 5.2, repeat: heroAnimating ? Infinity : 0, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[38%] right-[22%] w-11 h-11 pointer-events-none select-none -z-10"
          >
            <img
              src="/assets/user/coffeimage2.png"
              alt="Coffee Droplet"
              className="w-full h-full object-contain mix-blend-multiply opacity-80 rotate-45"
            />
          </motion.div>
        </motion.div>

        {/* -----------------------------------------------------------------
            STAGE 1 DETAILS: "ETHIOPIAN YIRGACHEFFE" & STATS BOX
            (Matches Frame 00:02–00:03 in reference video)
           ----------------------------------------------------------------- */}
        <motion.div
          style={{
            opacity: scene1DetailsOpacity,
            y: scene1DetailsTranslateY,
            visibility: scene1Visibility,
            willChange: 'transform, opacity',
          }}
          className="absolute inset-x-0 bottom-8 sm:bottom-12 px-4 sm:px-12 lg:px-20 z-20 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-none"
        >
          {/* Left Column: Limited Release Title & Story */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-2 pointer-events-auto">
            <span className="font-script text-2xl sm:text-3xl text-[#2F1207] block tracking-wide">
              Unlimited release
            </span>
            <h1 className="font-bebas text-5xl sm:text-6xl md:text-7xl font-black text-[#1D1B16] leading-[0.9] tracking-tight">
              ETHIOPIAN YIRGACHEFFE
            </h1>
            <p className="text-xs sm:text-sm text-[#4E473B] font-sans-clean leading-relaxed">
              BRUN Signature was our first seasonal way back in 1998. The recipe was formulated with shade-grown heirloom Arabica and washed processing to balance wild aromatics with honeyed sweetness so your palate never wears out.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onOpenOrder}
                className="px-5 py-2.5 bg-[#1D1B16] hover:bg-black text-white text-xs font-bold tracking-widest uppercase rounded shadow transition-all cursor-pointer flex items-center gap-2"
              >
                <span>BUY NOW</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenRoaster}
                className="text-xs font-bold font-cinzel text-[#2F1207] hover:text-[#1a0a04] underline underline-offset-4 tracking-wider cursor-pointer"
              >
                READ MORE
              </button>
            </div>
          </div>

          {/* Right Column: ABV / IBU / OG equivalent metrics box */}
          <div className="w-full max-w-xs sm:max-w-sm bg-white/80 backdrop-blur-md border border-[#E3DDD1] p-4 sm:p-5 rounded-lg shadow-sm space-y-3 pointer-events-auto">
            <div className="space-y-3 divide-y divide-[#EAE4D7]">
              {roastStats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`pt-2 cursor-pointer transition-colors ${
                    activeStatIndex === idx ? 'bg-[#F5F2EB]/80 -mx-2 px-2 rounded' : ''
                  }`}
                  onClick={() => setActiveStatIndex(activeStatIndex === idx ? null : idx)}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-cinzel text-xs font-bold text-[#1D1B16]">
                      {stat.label}
                    </span>
                    <span className="font-bebas text-2xl font-bold text-[#2F1207]">
                      {stat.value}{' '}
                      <span className="text-xs font-sans-clean font-normal text-[#7C7567]">
                        {stat.unit}
                      </span>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6D6556] leading-tight mt-0.5 line-clamp-2">
                    {stat.description}
                  </p>
                  {activeStatIndex === idx && (
                    <p className="text-[10px] text-[#2F1207] mt-1 pt-1 border-t border-[#DFD8CB] font-medium">
                      {stat.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* -----------------------------------------------------------------
            STAGE 2 BACKDROP: "MOUTHFEELS"
            (Matches Frame 00:04–00:06 in reference video)
           ----------------------------------------------------------------- */}
        <motion.div
          style={{
            opacity: mouthfeelsOpacity,
            y: mouthfeelsTranslateY,
            visibility: mouthfeelsVisibility,
            willChange: 'transform, opacity',
          }}
          className="absolute inset-0 flex items-center justify-center -z-10"
        >
          <div className="font-bebas text-[19vw] sm:text-[20vw] md:text-[21vw] font-black leading-none text-[#2F1207] tracking-[-0.04em] select-none text-letterpress text-center w-full">
            MOUTHFEELS
          </div>
        </motion.div>

        {/* -----------------------------------------------------------------
            STAGE 2 DETAILS: FLAVOR SPLATTERS & VIDEO / STYLE COLUMNS
            (Matches Frame 00:05–00:08 in reference video)
           ----------------------------------------------------------------- */}
        <motion.div
          style={{
            opacity: mouthfeelsDetailsOpacity,
            visibility: mouthfeelsDetailsVisibility,
            willChange: 'opacity',
          }}
          className="absolute inset-0 pt-24 pb-12 px-4 sm:px-12 lg:px-20 flex items-center justify-between z-10 pointer-events-none"
        >
          {/* =========================================================================
              ORGANIC COFFEE & LIQUID STAINS (Replacing rectangular cards)
              Designed as authentic coffee cup ring marks, liquid blotches & splatters!
             ========================================================================= */}

          {/* 1. Orange C-Hops Amber Coffee Splatter Stain (Top-Left of Cup) */}
          <motion.div
            animate={mouthAnimating ? { y: [0, -7, 0] } : { y: 0 }}
            transition={{ duration: 5, repeat: mouthAnimating ? Infinity : 0, ease: 'easeInOut' }}
            className="absolute top-[16%] left-[3%] sm:left-[8%] md:left-[14%] w-[230px] sm:w-[270px] pointer-events-auto filter drop-shadow-lg"
          >
            <div
              onClick={() => setActiveFlavor(activeFlavor === 'citrus' ? null : 'citrus')}
              className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* SVG Organic Citrus Coffee Stain Shape */}
              <svg viewBox="0 0 300 240" className="w-full h-auto overflow-visible select-none pointer-events-none">
                <defs>
                  <radialGradient id="orangeStainGrad" cx="45%" cy="50%" r="65%">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity="0.94" />
                    <stop offset="65%" stopColor="#D9480F" stopOpacity="0.90" />
                    <stop offset="90%" stopColor="#C2410C" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#9A3412" stopOpacity="0.75" />
                  </radialGradient>
                </defs>
                {/* Main Organic Liquid Blot Path */}
                <path
                  d="M 65,115 C 55,75 80,45 125,35 C 170,25 220,40 245,70 C 270,100 280,140 255,175 C 230,210 180,215 135,210 C 90,205 60,185 52,150 C 48,135 55,125 65,115 Z"
                  fill="url(#orangeStainGrad)"
                />
                {/* Liquid droplet splatters */}
                <circle cx="35" cy="90" r="4.5" fill="#EA580C" />
                <circle cx="28" cy="125" r="3" fill="#EA580C" />
                <circle cx="48" cy="195" r="5" fill="#D9480F" />
                <circle cx="270" cy="55" r="6" fill="#EA580C" />
                <circle cx="288" cy="80" r="3.5" fill="#C2410C" />
                <circle cx="265" cy="205" r="4" fill="#D9480F" />
                <circle cx="195" cy="228" r="3" fill="#C2410C" />
              </svg>

              {/* Content stamped inside the stain */}
              <div className="absolute inset-0 flex flex-col justify-center px-7 sm:px-9 py-6 text-white text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-200 animate-ping" />
                  <h4 className="font-bebas text-xl sm:text-2xl tracking-wider text-amber-100 text-shadow-sm">
                    ORANGE · C-HOPS
                  </h4>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-tight text-amber-50/95 font-sans-clean font-medium">
                  The pair of old school heirloom varieties brings a touch of candied orange so tasty that it is bright and deep.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. Pine & Jasmine Botanical Berry Stain (Center-Left of Cup) */}
          <motion.div
            animate={mouthAnimating ? { y: [0, 8, 0] } : { y: 0 }}
            transition={{ duration: 5.8, repeat: mouthAnimating ? Infinity : 0, ease: 'easeInOut' }}
            className="absolute top-[46%] left-[1%] sm:left-[5%] md:left-[10%] w-[230px] sm:w-[270px] pointer-events-auto filter drop-shadow-lg"
          >
            <div
              onClick={() => setActiveFlavor(activeFlavor === 'floral' ? null : 'floral')}
              className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* SVG Organic Pine & Jasmine Berry Stain Shape */}
              <svg viewBox="0 0 300 240" className="w-full h-auto overflow-visible select-none pointer-events-none">
                <defs>
                  <radialGradient id="rubyStainGrad" cx="50%" cy="50%" r="65%">
                    <stop offset="0%" stopColor="#4A2010" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#38170B" stopOpacity="0.92" />
                    <stop offset="92%" stopColor="#2F1207" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#1E0A04" stopOpacity="0.82" />
                  </radialGradient>
                </defs>
                {/* Main Organic Liquid Blot Path */}
                <path
                  d="M 58,130 C 45,85 75,48 118,38 C 160,28 215,35 248,65 C 280,95 275,145 250,180 C 225,215 175,220 128,212 C 82,204 55,178 58,130 Z"
                  fill="url(#rubyStainGrad)"
                />
                {/* Liquid droplet splatters */}
                <circle cx="28" cy="145" r="5" fill="#4A2010" />
                <circle cx="42" cy="70" r="3.5" fill="#38170B" />
                <circle cx="110" cy="18" r="4" fill="#4A2010" />
                <circle cx="265" cy="42" r="5.5" fill="#38170B" />
                <circle cx="290" cy="115" r="4" fill="#2F1207" />
                <circle cx="275" cy="195" r="3.5" fill="#4A2010" />
                <circle cx="85" cy="225" r="4.5" fill="#2F1207" />
              </svg>

              {/* Content stamped inside the stain */}
              <div className="absolute inset-0 flex flex-col justify-center px-7 sm:px-9 py-6 text-white text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping" />
                  <h4 className="font-bebas text-xl sm:text-2xl tracking-wider text-rose-100 text-shadow-sm">
                    PINE & JASMINE
                  </h4>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-tight text-rose-50/95 font-sans-clean font-medium">
                  The pine, oh hops, brings brightness to the citrus and caramel flavors that dominate the brew and linger with gentle sweetness.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. Caramel & Malt Espresso Mug Ring Stain (Top-Right of Cup) */}
          <motion.div
            animate={mouthAnimating ? { y: [0, -8, 0] } : { y: 0 }}
            transition={{ duration: 5.4, repeat: mouthAnimating ? Infinity : 0, ease: 'easeInOut' }}
            className="absolute top-[18%] right-[3%] sm:right-[8%] md:right-[14%] w-[240px] sm:w-[280px] pointer-events-auto filter drop-shadow-xl"
          >
            <div
              onClick={() => setActiveFlavor(activeFlavor === 'caramel' ? null : 'caramel')}
              className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* SVG Organic Dark Espresso Mug Ring Stain with Running Drips */}
              <svg viewBox="0 0 320 270" className="w-full h-auto overflow-visible select-none pointer-events-none">
                <defs>
                  <radialGradient id="darkEspressoGrad" cx="48%" cy="48%" r="65%">
                    <stop offset="0%" stopColor="#26221D" stopOpacity="0.97" />
                    <stop offset="68%" stopColor="#1C1814" stopOpacity="0.95" />
                    <stop offset="92%" stopColor="#120F0D" stopOpacity="0.98" />
                    <stop offset="100%" stopColor="#080706" stopOpacity="0.85" />
                  </radialGradient>
                </defs>
                {/* Main Organic Liquid Blot Path */}
                <path
                  d="M 68,120 C 58,70 90,38 138,30 C 185,22 238,38 268,72 C 298,105 292,155 264,190 C 235,225 185,230 138,222 C 90,214 62,185 68,120 Z"
                  fill="url(#darkEspressoGrad)"
                />
                {/* Running drip trails coming down from the cup ring */}
                <path d="M 125,218 C 122,238 126,252 124,262 C 123,266 120,266 119,262 C 117,252 119,235 121,218 Z" fill="#1C1814" />
                <circle cx="121" cy="266" r="3.5" fill="#1C1814" />
                <path d="M 215,212 C 218,230 216,244 219,252 C 220,256 223,256 224,252 C 226,244 223,230 220,212 Z" fill="#1C1814" />
                <circle cx="221" cy="256" r="3" fill="#1C1814" />
                {/* Liquid droplet splatters */}
                <circle cx="38" cy="85" r="4.5" fill="#26221D" />
                <circle cx="32" cy="165" r="3.5" fill="#120F0D" />
                <circle cx="285" cy="55" r="5" fill="#26221D" />
                <circle cx="305" cy="130" r="4" fill="#120F0D" />
                <circle cx="280" cy="215" r="4.5" fill="#26221D" />
              </svg>

              {/* Content stamped inside the stain */}
              <div className="absolute inset-0 flex flex-col justify-center px-7 sm:px-9 py-6 text-white text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#E5A93B] animate-ping" />
                  <h4 className="font-bebas text-xl sm:text-2xl tracking-wider text-[#FCD34D] text-shadow-sm">
                    CARAMEL · MALT
                  </h4>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-tight text-neutral-200 font-sans-clean font-medium">
                  The use of English caramel malt brings a depth of flavor to the base. White our normal malt brings clean body, deeper caramelized sugar supplies the beautiful amber color.
                </p>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM LEFT: Head Roaster Video Card & Iced Cascara Glass (Frame 00:05-00:07) */}
          <div className="absolute bottom-6 left-4 sm:left-10 lg:left-16 flex items-end gap-3 sm:gap-4 pointer-events-auto">
            {/* Video Thumbnail */}
            <div
              onClick={onOpenRoaster}
              className="w-40 sm:w-52 bg-white p-2 rounded-lg border border-[#DFD8CB] shadow-lg cursor-pointer group hover:border-[#2F1207] transition-all"
            >
              <div className="relative aspect-video rounded overflow-hidden bg-neutral-900">
                <img
                  src="/assets/user/img1.jpg"
                  alt="Head Roaster Jeremy Marshall"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#2F1207] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="font-script text-xs sm:text-sm text-[#2F1207] mt-1.5 font-bold">
                Hear it from our brewmaster
              </p>
              <p className="font-cinzel text-[10px] font-bold text-[#1D1B16] truncate">
                Jeremy Marshall · Master Dispatch
              </p>
            </div>

            {/* Amber Glass with Foam (Frame 00:07 bottom left) */}
            <div className="hidden sm:block w-24 sm:w-28 relative group">
              <img
                src="/assets/user/img2.jpg"
                alt="Nitro Amber Cold Brew Glass"
                className="w-full h-auto rounded-lg object-cover shadow-lg border border-[#DFD8CB]"
              />
            </div>
          </div>

          {/* RIGHT SIDE: STYLE & TEXT DESCRIPTION (Frame 00:05–00:07) */}
          <div className="absolute bottom-8 right-4 sm:right-10 lg:right-16 w-full max-w-xs sm:max-w-sm space-y-3 pointer-events-auto bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-lg border border-[#DFD8CB] shadow-md">
            <span className="font-bebas text-2xl font-bold text-[#2F1207] tracking-wide block border-b border-[#E3DDD1] pb-1">
              STYLE
            </span>
            <p className="text-xs text-[#3A352D] font-sans-clean leading-relaxed">
              In the world of specialty coffee, our BRUN Cafe Signature roast is a rare gem. We don't hide the bean behind heavy char; we let the volcanic terroir and high-elevation sun express themselves with vibrant floral jasmine, candied Meyer lemon, and rich toffee body.
            </p>
            <p className="text-xs text-[#3A352D] font-sans-clean leading-relaxed">
              A well-rounded, highly drinkable craft roast with an ultra-clean finish. Sourced directly from Gedeo smallholders and roasted fresh every week at BRUN Cafe.
            </p>
          </div>
        </motion.div>

        {/* -----------------------------------------------------------------
            STAGE 3: "Availability: YEAR ROUND" & 5-PRODUCT LINEUP
            (Matches Frame 00:09–00:11 in reference video)
           ----------------------------------------------------------------- */}
        <motion.div
          style={{
            opacity: lineupOpacity,
            y: lineupTranslateY,
            visibility: lineupVisibility,
            willChange: 'transform, opacity',
          }}
          className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pt-20 pb-8 px-4 sm:px-12 z-20 pointer-events-none"
        >
          {/* Header Title with Black Ink Drips (Frame 00:09–00:10) */}
          <div className="relative flex flex-col items-center">
            {/* Black Coffee Ink Drips from Top Right */}
            <div className="absolute -top-12 right-12 sm:right-28 w-32 sm:w-44 pointer-events-none">
              <svg viewBox="0 0 200 120" className="w-full fill-[#1D1B16]">
                <path d="M 0,0 L 200,0 L 200,20 C 180,25 170,60 160,85 C 155,100 145,115 140,115 C 135,115 130,95 125,70 C 120,40 110,25 90,28 C 75,30 65,75 58,95 C 52,110 46,110 42,90 C 35,55 25,20 0,22 Z" />
                <circle cx="140" cy="120" r="3" />
                <circle cx="58" cy="105" r="2.5" />
              </svg>
            </div>

            <span className="font-script text-2xl sm:text-3xl text-[#5A5345]">Availability:</span>
            <h2 className="font-bebas text-5xl sm:text-7xl md:text-8xl font-black text-[#1D1B16] tracking-tight leading-none">
              YEAR ROUND
            </h2>
          </div>

          {/* Full-Width Year Round Lineup Showcase (Occupies Full Width of the section) */}
          <div className="w-full px-2 sm:px-6 lg:px-12 flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-stretch pointer-events-auto overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory">
            {allProducts.map((item, idx) => {
              const shouldUse3DCup =
                item.id === 'nitro-draft' ||
                item.id === 'amber-growler' ||
                item.id === 'brun-cup-hero';

              return (
                <motion.div
                  key={item.id}
                  onClick={() => onAddToCart(item)}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className={`w-full min-w-[240px] sm:min-w-0 snap-center flex flex-col justify-between text-center p-3 sm:p-4 rounded-2xl transition-colors duration-300 group cursor-pointer ${
                    item.isMainCup
                      ? 'bg-white/95 border-2 border-[#2F1207]/50 shadow-xl ring-1 ring-[#2F1207]/30'
                      : 'bg-white/85 hover:bg-white border border-[#DFD8CB] hover:shadow-xl'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="text-[9px] font-cinzel font-bold text-[#2F1207] bg-[#2F1207]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.format}
                    </span>
                    <span className="text-[9px] font-mono font-medium text-[#7C7567]">
                      {item.tempServed}
                    </span>
                  </div>

                  {/* Product Visual Area: Occupies Full Width of Card with 3D Spinning Cup */}
                  <div className="h-36 sm:h-44 w-full flex items-center justify-center p-1 my-1 relative overflow-hidden rounded-xl bg-[#FAF7F0]/60 border border-[#EFECE3]">
                    {item.video ? (
                      <ViewportVideo src={item.video} label={item.name} active={lineupActive} />
                    ) : shouldUse3DCup ? (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <SpinningCupCanvas
                          className="w-full h-full min-h-[140px]"
                          speed={0.8 + idx * 0.15}
                          interactive={true}
                          scale={0.92}
                          active={lineupActive}
                        />
                        <span className="absolute bottom-1 right-1.5 text-[8px] font-cinzel text-[#2F1207]/85 bg-white/85 px-1.5 py-0.5 rounded backdrop-blur-xs font-bold pointer-events-none">
                          3D 360°
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1 my-1">
                    <h4 className="font-cinzel text-xs font-bold text-[#1D1B16] group-hover:text-[#2F1207] transition-colors truncate w-full">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#7C7567] line-clamp-1">{item.subtitle}</p>
                    <p className="font-mono text-xs font-bold text-[#2F1207]">
                      {formatNaira(item.price)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="mt-2 w-full py-2 px-3 bg-[#1D1B16] group-hover:bg-[#2F1207] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Empty spacer replacing the deleted loader bar */}
          <div className="h-4" />
        </motion.div>

      </div>
    </div>

    {/* =========================================================================
        THE 3 NEW BRUN CAFE SECTIONS (Natural Document Flow - NEVER FIXED)
        Positioned as the final sections on the page:
        1. "We love coffee" (Story & Location)
        2. "Our Menu" (4 Alternating cards with Latte, Chai, Hot Chocolate, Croissant)
        3. "Latest coffee news" (3 Journal articles)
        4. BRUN Cafe Footer
       ========================================================================= */}
    <div className="relative w-full z-10 bg-[#FAF7F0]">
      <BrunCafeMenuSections onOpenOrder={onOpenOrder} />
    </div>
  </div>
);
};
