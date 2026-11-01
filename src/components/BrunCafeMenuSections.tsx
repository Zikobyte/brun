import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Coffee,
  ArrowUp,
  Mail,
  Check,
  Instagram,
  Heart,
  ShieldCheck,
  RotateCw,
  Plus,
} from 'lucide-react';
import { SpinningCupCanvas } from './SpinningCupCanvas';
import { ViewportVideo } from './ViewportVideo';
import { CAFE_VIDEOS } from '../utils/media';
import { formatNaira, PRODUCT_PRICES } from '../utils/pricing';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BrunCafeMenuSectionsProps {
  onOpenOrder: () => void;
}

export const BrunCafeMenuSections: React.FC<BrunCafeMenuSectionsProps> = React.memo(({ onOpenOrder }) => {
  // Active clip index for the infinite looping video section
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInView = useInView(marqueeRef);
  const footerMarqueeRef = useRef<HTMLDivElement>(null);
  const footerMarqueeInView = useInView(footerMarqueeRef);
  const reduceMotion = useReducedMotion();
  const heroCardRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const revealUp = {
    initial: reduceMotion ? false as const : { opacity: 0, y: 36 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: false, amount: 0.12 },
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };
  const glideLeft = {
    ...revealUp,
    initial: reduceMotion ? false as const : { opacity: 0, x: -40, y: 20 },
  };
  const glideRight = {
    ...revealUp,
    initial: reduceMotion ? false as const : { opacity: 0, x: 40, y: 20 },
  };

  // GSAP Smooth Parallax on Architectural Showcase Image
  useEffect(() => {
    if (!heroCardRef.current || !heroImgRef.current || reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(heroImgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroCardRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const videoList = [
    {
      title: 'Espresso Extraction & Steaming',
      subtitle: 'The Craft of BRUN',
      url: CAFE_VIDEOS.espresso,
    },
    {
      title: 'Artisan Bakery Fresh Bakes',
      subtitle: 'Morning Viennoiserie',
      url: CAFE_VIDEOS.bakery,
    },
    {
      title: 'Barista Pour & Signature Latte Art',
      subtitle: 'Precision Temperature',
      url: 'https://pub-ee5a826221134162b53dc4a7b9eeca2a.r2.dev/downloadgram.org_AQMtDJ_W7vk8ydJHfW0YQ8pUQ2rnGJsJCpv_GNZ1d9tmeJYfFhMYrnN0akDEA69Gu5_Et-uaxSHC2u91W0q3qW1XVefxI-aPS3gf8FU.mp4',
    },
    {
      title: 'Atmosphere & Golden Hour Lounge',
      subtitle: 'Dine-In Space',
      url: CAFE_VIDEOS.atmosphere,
    },
  ];

  // 7 authentic BRUN cafe photos provided by user
  const galleryItemsRow1 = [
    { src: '/assets/user/uu.png', label: 'Flagship Architecture', tag: 'Exterior' },
    { src: '/assets/user/img5.jpg', label: 'BRUN Signature Cup', tag: 'Craft Brew' },
    { src: '/assets/user/img1.jpg', label: 'Marble Dining Lounge', tag: 'Interior' },
    { src: '/assets/user/img2.jpg', label: 'Sunlit Window Espresso Bar', tag: 'Bar Counter' },
    { src: '/assets/user/img6.jpg', label: 'Al Fresco Patio Dining', tag: 'Garden Patio' },
    { src: '/assets/user/img3.jpg', label: 'Ambient Dining Tables', tag: 'Atmosphere' },
    { src: '/assets/user/img4.jpg', label: 'High-Top Bar Stools', tag: 'Lounge' },
  ];

  const galleryItemsRow2 = [
    { src: '/assets/user/img3.jpg', label: 'Bespoke Woven Lighting', tag: 'Interior' },
    { src: '/assets/user/img6.jpg', label: 'Outdoor Sun Terrace', tag: 'Patio' },
    { src: '/assets/user/img2.jpg', label: 'Espresso Bar Along Glass', tag: 'Coffee' },
    { src: '/assets/user/uu.png', label: 'Sunset Stucco Facade', tag: 'Architecture' },
    { src: '/assets/user/img5.jpg', label: 'BRUN "your day" Cup', tag: 'Signature' },
    { src: '/assets/user/img1.jpg', label: 'Bakery Case & Booths', tag: 'Bakery' },
    { src: '/assets/user/img4.jpg', label: 'Window View Stools', tag: 'Workspace' },
  ];

  return (
    <div id="brun-cafe-experience" className="w-full bg-[#FAF7F0] text-[#1D1B16] selection:bg-[#2F1207] selection:text-white">
      {/* Padded Main Content Container */}
      <div className="w-full py-16 px-4 sm:px-8 lg:px-14 2xl:px-20 space-y-32">

        {/* =========================================================================
            SECTION 1 (ABOVE "WE LOVE COFFEE"):
            "THE BRUN CRAFT & ATMOSPHERE: COFFEE SHOP & BAKERY"
            Full-width architecture showcase with exterior photo, bakery & roastery pillars
           ========================================================================= */}
        <section className="w-full space-y-12">
          {/* Section Header */}
          <motion.div {...revealUp} className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#E8E1D2] pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2F1207] text-[#FAF7F0] text-[11px] font-cinzel font-bold tracking-widest uppercase rounded-full shadow-xs">
                <Sparkles className="w-3 3 text-[#E5A93B]" />
                <span>Flagship Destination</span>
              </div>
              <h2 className="font-bebas text-5xl sm:text-7xl md:text-8xl text-[#1D1B16] tracking-tight leading-none">
                BRUN COFFEE SHOP & BAKERY
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#61594A] max-w-xl font-sans-clean leading-relaxed">
              A sanctuary crafted for specialty coffee connoisseurs and pastry lovers. Savor freshly roasted Ethiopian micro-lots alongside European viennoiserie baked fresh daily under sunlit architectural canopies.
            </p>
          </motion.div>

          {/* Full-Width Hero Architectural Card with GSAP Parallax */}
          <motion.div
            {...revealUp}
            ref={heroCardRef}
            className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-[#E5DFD3] group"
          >
            <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9] w-full overflow-hidden">
              <img
                loading="lazy"
                decoding="async"
                ref={heroImgRef}
                src="/assets/user/uu.png"
                alt="BRUN Coffee Shop & Bakery Flagship Exterior"
                className="w-full h-[115%] -top-[7%] relative object-cover will-change-transform"
              />
              {/* Gradient Overlays for Cinematic Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 text-white pointer-events-none">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
                <div className="space-y-3 max-w-2xl">
                  <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#E5A93B]">
                    Architectural Atmosphere
                  </span>
                  <h3 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight">
                    WARM STUCCO, WOVEN LIGHTS & OPEN PATIO
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-200 font-sans-clean leading-relaxed">
                    Designed by master architects to blend urban serenity with rich Mediterranean earth tones, panoramic window espresso bars, and a relaxed garden terrace.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4 Pillars of BRUN (Full-Width Responsive 4-Column Grid with Scroll-In Reveal) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'IN-HOUSE ROASTING',
                desc: 'Single-origin Ethiopian lots slow-drum caramelized to preserve bright bergamot and honey.',
                img: '/assets/user/img5.jpg',
                pill: 'Specialty Roast',
              },
              {
                title: 'ARTISAN VIENNOISERIE',
                desc: 'Pure European butter croissants, sourdough brioche, and fruit tarts hand-laminated every dawn.',
                img: '/assets/user/img1.jpg',
                pill: 'Fresh Daily',
              },
              {
                title: 'SUNLIT ESPRESSO BAR',
                desc: 'Panoramic window counters with high-top seating designed for work, contemplation, and conversation.',
                img: '/assets/user/img2.jpg',
                pill: 'Workspace Friendly',
              },
              {
                title: 'GARDEN PATIO SEATING',
                desc: 'Al fresco wicker armchairs shaded by striped canopies for relaxed morning coffee and casual bites.',
                img: '/assets/user/img6.jpg',
                pill: 'Outdoor Terrace',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...revealUp}
                transition={{ ...revealUp.transition, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-[#FFFDF7] border border-[#EBE4D5] rounded-2xl overflow-hidden p-4 sm:p-5 shadow-xs hover:shadow-lg transition-colors group flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 relative bg-neutral-900">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-cinzel font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.pill}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bebas text-2xl text-[#1D1B16] tracking-wide group-hover:text-[#2F1207] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#61594A] font-sans-clean leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: "WE LOVE COFFEE" (Atmosphere & Warm Stucco Lounge)
           ========================================================================= */}
        <section className="w-full">
          <div className="bg-[#FFFDF7] border border-[#EBE4D5] rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
            {/* Left: Authentic Cafe Interior Lounge Photo */}
            <motion.div {...glideLeft} className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden shadow-md group bg-neutral-900">
              <img
                loading="lazy"
                decoding="async"
                src="/assets/user/img1.jpg"
                alt="BRUN Cafe Warm Sunlit Interior Dining Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-xs text-white text-xs font-cinzel font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Cafe Interior & Bakery
              </div>
            </motion.div>

            {/* Right: Story & Location Details */}
            <motion.div {...glideRight} className="space-y-6">
              <div className="space-y-2">
                <span className="font-cinzel text-xl sm:text-2xl font-black tracking-widest text-[#2F1207]">
                  BRUN Cafe
                </span>
                <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-[#1D1B16] tracking-tight leading-none">
                  We love coffee
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#4A4337] leading-relaxed font-sans-clean">
                <p>
                  BRUN Cafe is a cozy and welcoming spot in the heart of the city, offering a delightful selection of specialty coffees, fresh pastries, and wholesome meals.
                </p>
                <p>
                  Join us for a moment of relaxation and indulgence in our architecturally curated lounge or on our garden terrace.
                </p>
              </div>

              {/* Location Details */}
              <div className="space-y-1.5 text-sm text-[#4A4337] border-t border-[#EBE4D5] pt-4">
                <p className="font-bold text-[#1D1B16] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2F1207]" />
                  <span>Location:</span>
                </p>
                <p className="font-medium text-[#1D1B16]">BRUN Coffee Shop & Bakery</p>
                <p>Ikeja, Lagos</p>
                <p>Nigeria</p>
              </div>

              {/* CTA Button */}
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={onOpenOrder}
                  className="px-8 py-3.5 bg-[#181818] hover:bg-black text-white text-sm font-semibold rounded-full shadow transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <span>Explore menu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3:
            1. FULL-WIDTH VIDEO PLAYING ON LOOP INFINITELY
            2. TWO-ROW INFINITE MARQUEE IMAGE CAROUSEL
               - Row 1: Slides Left to Right
               - Row 2: Slides Right to Left
           ========================================================================= */}
        <section className="w-full space-y-10">
          {/* Section Header */}
          <motion.div {...revealUp} className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#E8E1D2] pb-4">
            <div>
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#2F1207]">
                Cinematic Motion & Gallery
              </span>
              <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-[#1D1B16] tracking-tight leading-none mt-1">
                THE LIVING EXPERIENCE
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-cinzel font-semibold text-[#61594A]">Continuous Loop Stream</span>
            </div>
          </motion.div>

          {/* 1. Full-Width Infinite Looping Video Player (No border radius, increased height, pure cinematic aesthetic) */}
          <motion.div {...revealUp} className="w-full relative rounded-none overflow-hidden bg-black shadow-2xl h-[520px] sm:h-[660px] lg:h-[800px] border-y border-[#E5DFD3] group">
            <ViewportVideo
              src={videoList[activeVideoIdx].url}
              label={videoList[activeVideoIdx].title}
              className="w-full h-full object-cover"
            />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Bottom Switcher Tabs for all 4 Videos */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-20">
              <div>
                <p className="font-cinzel text-xs text-[#E5A93B] font-bold uppercase tracking-wider">
                  {videoList[activeVideoIdx].subtitle}
                </p>
                <h3 className="font-bebas text-3xl sm:text-4xl lg:text-5xl text-white tracking-wide leading-none mt-1">
                  {videoList[activeVideoIdx].title}
                </h3>
              </div>

              {/* 4 Video Selection Buttons */}
              <div className="flex flex-wrap gap-2">
                {videoList.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVideoIdx(i)}
                    className={`px-3 py-1.5 text-[11px] font-cinzel font-semibold rounded-lg transition-all cursor-pointer backdrop-blur-md border ${
                      activeVideoIdx === i
                        ? 'bg-[#2F1207] text-white border-[#2F1207] shadow-md'
                        : 'bg-black/50 text-white/80 border-white/20 hover:bg-black/80'
                    }`}
                  >
                    Clip {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 2. Full-Width Infinite Two-Row Image Marquee Carousel */}
          <motion.div {...revealUp} ref={marqueeRef} data-animation-paused={!marqueeInView} className="w-full space-y-6 pt-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-cinzel font-bold text-[#61594A] uppercase tracking-widest">
                Live Atmosphere Reel (Hover to Pause)
              </span>
              <span className="text-xs text-[#8C8372]">7 Curated Perspectives</span>
            </div>

            {/* ROW 1: Slides Left to Right (Infinite Marquee) */}
            <div className="w-full overflow-hidden relative py-1">
              <div className="animate-marquee-right">
                {[0, 1].map(copy => (
                <div key={copy} aria-hidden={copy === 1} className="flex gap-5 pr-5">
                {galleryItemsRow1.map((item, idx) => (
                  <div
                    key={`r1-${idx}`}
                    className="flex-shrink-0 w-72 sm:w-80 md:w-96 aspect-[16/11] rounded-2xl overflow-hidden shadow-md border border-[#E5DFD3] relative group bg-neutral-900 cursor-pointer"
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={item.src}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#E5A93B]">
                        {item.tag}
                      </span>
                      <h5 className="font-cinzel text-xs font-bold truncate">
                        {item.label}
                      </h5>
                    </div>
                  </div>
                ))}
                </div>
                ))}
              </div>
            </div>

            {/* ROW 2: Slides Right to Left (Infinite Marquee Opposite Direction) */}
            <div className="w-full overflow-hidden relative py-1">
              <div className="animate-marquee-left">
                {[0, 1].map(copy => (
                <div key={copy} aria-hidden={copy === 1} className="flex gap-5 pr-5">
                {galleryItemsRow2.map((item, idx) => (
                  <div
                    key={`r2-${idx}`}
                    className="flex-shrink-0 w-72 sm:w-80 md:w-96 aspect-[16/11] rounded-2xl overflow-hidden shadow-md border border-[#E5DFD3] relative group bg-neutral-900 cursor-pointer"
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={item.src}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#E5A93B]">
                        {item.tag}
                      </span>
                      <h5 className="font-cinzel text-xs font-bold truncate">
                        {item.label}
                      </h5>
                    </div>
                  </div>
                ))}
                </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 4: "OUR MENU" (Full-Width with Authentic User Images & Fluid Scroll-Ins)
           ========================================================================= */}
        <section className="w-full space-y-12">
          <motion.div {...revealUp} className="border-b border-[#E8E1D2] pb-4">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#2F1207]">
              Craft Roasts & Bakery
            </span>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-[#1D1B16] tracking-tight">
              Our Menu
            </h2>
          </motion.div>

          {/* 1. Coffee Pair (Features real BRUN Signature Cup in hand img5.jpg) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            <motion.div
              {...glideLeft}
              className="bg-[#FFFDF7] border border-[#EBE4D5] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-xs"
            >
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1D1B16]">
                Coffee & Espresso
              </h3>
              <div className="space-y-4 divide-y divide-[#EBE4D5]/60">
                {[
                  { name: 'BRUN Signature Cup', price: PRODUCT_PRICES.signatureCup, desc: 'Our iconic single-origin Ethiopian espresso pull served in our signature double-walled cup.' },
                  { name: 'Espresso Single / Double', price: 6000, desc: 'Rich and bold single origin extraction with sweet citrus crema.' },
                  { name: 'Americano', price: 6500, desc: 'Espresso with hot water for a smooth, robust flavor.' },
                  { name: 'Latte', price: 8000, desc: 'Espresso with silky microfoam milk. Flavors: Vanilla, Salted Caramel, Hazelnut, Mocha.' },
                  { name: 'Cappuccino', price: 8000, desc: 'Equal parts espresso, velvety steamed milk, and dense foam.' },
                  { name: 'Flat White', price: 8000, desc: 'Silky microfoam over a double ristretto shot of heirloom beans.' },
                  { name: 'Nitro Cold Brew', price: PRODUCT_PRICES.nitroDraft, desc: 'Cascading nitrogen-infused slow cold brew served ice cold.' },
                ].map((item, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-cinzel text-sm font-bold text-[#1D1B16]">{item.name}</span>
                      <span className="font-mono text-sm font-bold text-[#1D1B16]">{formatNaira(item.price)}</span>
                    </div>
                    <p className="text-xs text-[#736B5E] mt-0.5 font-sans-clean leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Full-Width 3D Spinning BRÜN Signature Cup Showcase (Replacing static img5.jpg) */}
            <motion.div
              {...glideRight}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#24140D] via-[#1A0E08] to-[#0D0704] border border-[#4A291A] flex flex-col justify-between p-6 sm:p-8 min-h-[460px] lg:min-h-[520px] w-full group"
            >
              {/* Top Bar inside Card */}
              <div className="flex justify-between items-center z-10 w-full">
                <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white font-cinzel">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5A93B]" />
                  <span>BRÜN Signature 3D Cup</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/80 font-mono">
                  <RotateCw className="w-3 h-3 text-[#E5A93B] animate-spin" />
                  <span>360° Drag & Rotate</span>
                </div>
              </div>

              {/* Central Full-Width 3D Canvas Mount */}
              <div className="flex-1 w-full flex items-center justify-center my-2 relative">
                <SpinningCupCanvas
                  className="w-full h-full min-h-[300px] sm:min-h-[360px]"
                  speed={0.88}
                  interactive={true}
                  scale={1.05}
                  steam={true}
                />
              </div>

              {/* Bottom Card Footer */}
              <div className="z-10 w-full pt-3 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 text-white">
                <div>
                  <h4 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
                    BRÜN DOUBLE-WALLED SIGNATURE CUP
                  </h4>
                  <p className="text-xs text-neutral-300 font-sans-clean mt-0.5">
                    Printed with custom "BRÜN your day" roasted sleeve · Single-origin espresso pour
                  </p>
                </div>
                <button
                  onClick={onOpenOrder}
                  className="px-5 py-2.5 bg-[#2F1207] hover:bg-[#1a0a04] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Now · {formatNaira(PRODUCT_PRICES.signatureCup)}</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* 2. Specialty Lattes Pair (Features real window bar counter img2.jpg) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            {/* Image Card: Window Bar Counter */}
            <motion.div
              {...glideLeft}
              className="relative rounded-3xl overflow-hidden shadow-sm aspect-square lg:aspect-auto order-2 lg:order-1 group bg-neutral-900"
            >
              <img
                loading="lazy"
                decoding="async"
                src="/assets/user/img2.jpg"
                alt="BRUN Window Bar Espresso Bar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-5 left-5 bg-black/75 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm font-cinzel">
                Window Espresso Bar
              </div>
            </motion.div>

            {/* Menu Card */}
            <motion.div
              {...glideRight}
              className="bg-[#FFFDF7] border border-[#EBE4D5] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-xs order-1 lg:order-2"
            >
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1D1B16]">
                Specialty Lattes
              </h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-[#EBE4D5]">
                <ViewportVideo src={CAFE_VIDEOS.atmosphere} label="Specialty Lattes" />
              </div>
              <div className="space-y-4 divide-y divide-[#EBE4D5]/60">
                {[
                  { name: 'Ceremonial Matcha Latte', price: 9500, desc: 'Stone-ground ceremonial Uji matcha blended with steamed oat milk.' },
                  { name: 'Golden Turmeric Latte', price: 9500, desc: 'Turmeric, fresh ginger, and cinnamon with steamed coconut milk for a warm botanical boost.' },
                  { name: 'Spiced Chai Latte', price: 8000, desc: 'Slow-simmered whole spices and black tea steeped with creamy milk.' },
                  { name: 'Wild Honey Lavender Latte', price: 10000, desc: 'Heirloom espresso, organic lavender blossom syrup, and raw mountain honey.' },
                ].map((item, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-cinzel text-sm font-bold text-[#1D1B16]">{item.name}</span>
                      <span className="font-mono text-sm font-bold text-[#1D1B16]">{formatNaira(item.price)}</span>
                    </div>
                    <p className="text-xs text-[#736B5E] mt-0.5 font-sans-clean leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3. Tea & Beverages Pair (Features high bar stools by glass facade img4.jpg) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            <motion.div
              {...glideLeft}
              className="bg-[#FFFDF7] border border-[#EBE4D5] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-xs"
            >
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1D1B16]">
                Tea & Other Beverages
              </h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-[#EBE4D5]">
                <ViewportVideo src={CAFE_VIDEOS.bakery} label="Tea & Other Beverages" />
              </div>
              <div className="space-y-4 divide-y divide-[#EBE4D5]/60">
                {[
                  { name: 'Artisan Loose Leaf Tea', price: 6000, desc: 'Selection of organic Earl Grey, Sencha Green, Moroccan Mint, and Chamomile.' },
                  { name: 'Valrhona Hot Chocolate', price: 8500, desc: '70% French dark cocoa melted into steamed whole milk with homemade marshmallow.' },
                  { name: 'Cascara Sparkling Spritz', price: 9000, desc: 'Coffee cherry tea infused with blood orange and sparkling spring water.' },
                  { name: 'Cold-Pressed Citrus Juice', price: 9000, desc: 'Fresh Valencia oranges, ginger, and turmeric pressed cold daily.' },
                ].map((item, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-cinzel text-sm font-bold text-[#1D1B16]">{item.name}</span>
                      <span className="font-mono text-sm font-bold text-[#1D1B16]">{formatNaira(item.price)}</span>
                    </div>
                    <p className="text-xs text-[#736B5E] mt-0.5 font-sans-clean leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image Card: High Stools Facade */}
            <motion.div
              {...glideRight}
              className="relative rounded-3xl overflow-hidden shadow-sm aspect-square lg:aspect-auto group bg-neutral-900"
            >
              <img
                loading="lazy"
                decoding="async"
                src="/assets/user/img4.jpg"
                alt="BRUN High Bar Stool Counter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-5 left-5 bg-black/75 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm font-cinzel">
                Window Counter Stools
              </div>
            </motion.div>
          </div>

          {/* 4. Pastries & Bakery Pair (Features outdoor patio seating with reflection img6.jpg) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            {/* Image Card: Patio Wicker Seating */}
            <motion.div
              {...glideLeft}
              className="relative rounded-3xl overflow-hidden shadow-sm aspect-square lg:aspect-auto order-2 lg:order-1 group bg-neutral-900"
            >
              <img
                loading="lazy"
                decoding="async"
                src="/assets/user/img6.jpg"
                alt="BRUN Outdoor Patio Dining"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-5 left-5 bg-black/75 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm font-cinzel">
                Garden Patio & Bakery
              </div>
            </motion.div>

            {/* Menu Card */}
            <motion.div
              {...glideRight}
              className="bg-[#FFFDF7] border border-[#EBE4D5] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-xs order-1 lg:order-2"
            >
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1D1B16]">
                Pastries & Baked Goods
              </h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-[#EBE4D5]">
                <ViewportVideo src={CAFE_VIDEOS.espresso} label="Pastries & Baked Goods" />
              </div>
              <div className="space-y-4 divide-y divide-[#EBE4D5]/60">
                {[
                  { name: 'Butter Croissant', price: 6000, desc: 'Laminated with pure Normandy butter, golden and flaky with honeyed honeycomb layers.' },
                  { name: 'Pain au Chocolat', price: 7500, desc: 'Double batons of Valrhona dark chocolate wrapped in crisp laminated dough.' },
                  { name: 'Cardamom Sourdough Bun', price: 7000, desc: 'Wild fermented dough infused with crushed green cardamom and Swedish pearl sugar.' },
                  { name: 'Almond Frangipane Tart', price: 8500, desc: 'Crisp shortcrust shell filled with rich almond cream and toasted sliced almonds.' },
                  { name: 'Valrhona Fudgy Brownie', price: 6500, desc: 'Dark espresso-infused chocolate brownie with cracked sea salt top.' },
                ].map((item, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-cinzel text-sm font-bold text-[#1D1B16]">{item.name}</span>
                      <span className="font-mono text-sm font-bold text-[#1D1B16]">{formatNaira(item.price)}</span>
                    </div>
                    <p className="text-xs text-[#736B5E] mt-0.5 font-sans-clean leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: "LATEST COFFEE NEWS" (Full-Width with Authentic Images)
           ========================================================================= */}
        <section className="w-full space-y-8 pt-6">
          <motion.div {...revealUp} className="flex justify-between items-end border-b border-[#EBE4D5] pb-4 w-full">
            <div>
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#2F1207]">
                Journal & Dispatches
              </span>
              <h2 className="font-bebas text-5xl sm:text-6xl text-[#1D1B16] tracking-tight leading-none mt-1">
                Latest coffee news
              </h2>
            </div>
            <button
              onClick={onOpenOrder}
              className="text-xs font-cinzel font-bold text-[#2F1207] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* 3 Articles Grid with Real Images & Staggered Scroll-In */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                title: 'Designing The Space: Mediterranean Stucco & Marble',
                date: 'October 30, 2026',
                category: 'Architecture',
                readTime: '5 min read',
                image: '/assets/user/uu.png',
                excerpt: 'An architectural exploration into crafting BRUN’s iconic warm terra-cotta exterior, woven pendant lighting, and sunlit dining lounge.',
              },
              {
                title: 'Morning Viennoiserie: The Art of Lamination',
                date: 'October 26, 2026',
                category: 'Bakery Craft',
                readTime: '4 min read',
                image: '/assets/user/img1.jpg',
                excerpt: 'Why 48-hour chilled butter lamination creates the unmatched flaky crumb of our signature croissants and morning pastries.',
              },
              {
                title: 'Single-Origin Terroir: High-Altitude Gedeo Beans',
                date: 'October 20, 2026',
                category: 'Roastery',
                readTime: '6 min read',
                image: '/assets/user/img3.jpg',
                excerpt: 'Tracing our green coffee lots from smallholder mountain slopes in Ethiopia to our vintage cast-iron roasting drum.',
              },
            ].map((article, idx) => (
              <motion.div
                key={idx}
                {...revealUp}
                transition={{ ...revealUp.transition, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-[#FFFDF7] border border-[#EBE4D5] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-colors group cursor-pointer flex flex-col justify-between"
                onClick={onOpenOrder}
              >
                <div className="aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#736B5E] font-medium">
                      <span className="text-[#2F1207] font-bold uppercase tracking-wider">{article.category}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="font-cinzel text-base font-bold text-[#1D1B16] group-hover:text-[#2F1207] transition-colors mt-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#736B5E] mt-2 font-sans-clean leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#EBE4D5]/60 flex items-center justify-between text-xs font-semibold text-[#2F1207]">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* =========================================================================
          REDESIGNED BRUN CAFE FOOTER:
          - Background color strictly matching letter B R U N on the preloader: #2F1207
          - Massive, monumental "BRUN" display text across the viewport width
          - Sophisticated editorial layout with hours, locations, roastery club & back to top
         ========================================================================= */}
      <footer className="w-full bg-[#2F1207] text-[#FAF7F0] pt-16 sm:pt-20 pb-10 px-4 sm:px-8 lg:px-14 2xl:px-20 overflow-hidden relative border-t-4 border-[#1c0a04] shadow-2xl">
        {/* Subtle Decorative Architectural Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Info Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-white/20">
          {/* Column 1: Brand & Heritage */}
          <motion.div {...revealUp} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-3xl font-black tracking-widest text-white drop-shadow-sm">
                BRUN
              </span>
              <span className="font-cinzel text-xs uppercase tracking-widest text-[#FDE68A] font-semibold border-l border-white/30 pl-2">
                Est. 1998
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-white/85 font-sans-clean">
              Specialty Coffee Roastery & European Bakery. Dedicated to terroir-driven single origin Ethiopian coffees, meticulous cold brew taps, and slow butter lamination.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#FDE68A]" />
              <span>Q-Grader Certified Lots (89.5+ SCAA)</span>
            </div>
          </motion.div>

          {/* Column 2: Hours & Service */}
          <motion.div {...revealUp} transition={{ ...revealUp.transition, delay: 0.08 }} className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-[#FDE68A] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Operating Hours</span>
            </h4>
            <div className="text-xs sm:text-sm text-white/85 space-y-1.5 font-sans-clean">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Monday – Friday</span>
                <span className="font-mono font-medium text-white">7:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Saturday</span>
                <span className="font-mono font-medium text-white">8:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-mono font-medium text-white">8:00 AM – 7:00 PM</span>
              </div>
            </div>
            <p className="text-[11px] text-white/70 italic pt-1">
              * Espresso bar opens daily at 6:45 AM for commuters.
            </p>
          </motion.div>

          {/* Column 3: Flagship Roastery Location */}
          <motion.div {...revealUp} transition={{ ...revealUp.transition, delay: 0.16 }} className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-[#FDE68A] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Flagship Location</span>
            </h4>
            <div className="text-xs sm:text-sm text-white/85 space-y-1 font-sans-clean leading-relaxed">
              <p className="font-bold text-white">BRUN Coffee Shop & Bakery</p>
              <p>Ikeja, Lagos</p>
              <p>Nigeria</p>
              <p className="pt-2 text-[#FDE68A] font-mono text-xs">hello@bruncafe.com</p>
              <p className="text-white/70 text-xs">+1 (555) 728-2786</p>
            </div>
          </motion.div>

          {/* Column 4: Newsletter & Club */}
          <motion.div {...revealUp} transition={{ ...revealUp.transition, delay: 0.24 }} className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-[#FDE68A] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>The Roasters Club</span>
            </h4>
            <p className="text-xs text-white/85 font-sans-clean leading-relaxed">
              Receive early invitations to limited single-origin lot drops, cupping sessions, and bakery specials.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/25 rounded-lg px-3 py-2 text-xs text-white placeholder-white/50 outline-none transition-all focus:border-[#FDE68A]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-white text-[#2F1207] hover:bg-[#FDE68A] text-xs font-cinzel font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  {isSubscribed ? <Check className="w-4 h-4 text-emerald-700" /> : 'Join'}
                </button>
              </div>
              {isSubscribed && (
                <p className="text-[11px] text-[#FDE68A] font-semibold animate-fade-in">
                  Thank you! You have been added to the reserve list.
                </p>
              )}
            </form>
          </motion.div>
        </div>

        <motion.div
          {...revealUp}
          ref={footerMarqueeRef}
          data-animation-paused={!footerMarqueeInView}
          className="footer-brand-row relative z-10 flex items-center gap-3 sm:gap-8 w-full py-8"
        >
          <div className="footer-wordmark-lane flex-1 min-w-0 overflow-hidden" aria-label="BRUN Coffee">
            <div className="animate-footer-marquee" aria-hidden="true">
              {[0, 1].map(copy => (
                <div key={copy} className="footer-wordmark-group">
                  <span>BRUN</span>
                  <span>BRUN</span>
                </div>
              ))}
            </div>
          </div>
          <div className="footer-cup shrink-0" aria-label="Interactive BRUN 3D cup">
            <SpinningCupCanvas
              className="w-full h-full"
              speed={0.65}
              scale={1}
              active={footerMarqueeInView}
            />
          </div>
        </motion.div>

        {/* Bottom Utility Bar */}
        <div className="relative z-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/80 font-sans-clean">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} BRUN Coffee Shop & Bakery. All rights reserved.</p>
            <span className="hidden sm:inline text-white/40">|</span>
            <p>Single Origin Heirloom Arabica & French Viennoiserie</p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenOrder}
              className="text-[#FDE68A] hover:underline font-cinzel font-bold cursor-pointer"
            >
              Order Online
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-white hover:text-[#FDE68A] transition-colors cursor-pointer group font-cinzel font-semibold"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
});
