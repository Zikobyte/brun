import React, { useState, useEffect, useCallback } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SearchModal } from './components/SearchModal';
import { RoasterModal } from './components/RoasterModal';
import { OrderDrawer } from './components/OrderDrawer';
import { HeroScrollContainer } from './components/HeroScrollContainer';
import { Preloader } from './components/Preloader';
import { ProductItem, CartItem } from './types';
import { cafeAudio } from './utils/audio';
import { HERO_CHAPTER_PROGRESS } from './utils/heroAnimation';
import { PRODUCT_PRICES } from './utils/pricing';
import { CAFE_VIDEOS } from './utils/media';

// 5 physical products for the lineup in Video 2 & store
const ALL_PRODUCTS: ProductItem[] = [
  {
    id: 'nitro-draft',
    name: 'Nitro Cold Brew Tap',
    subtitle: 'Draft Pour',
    size: '16 oz Draft',
    format: 'On Tap',
    image: '/assets/user/img2.jpg',
    price: PRODUCT_PRICES.nitroDraft,
    description: 'Cascading nitrogen micro-crema, smooth mouthfeel with sweet chocolate and candied orange note.',
    tempServed: 'Chilled / 38°F',
  },
  {
    id: 'amber-growler',
    name: 'Cold Brew Growler',
    subtitle: 'Reserve Carafe',
    size: '32 oz Glass',
    format: 'Amber Growler',
    image: '/assets/user/img4.jpg',
    price: PRODUCT_PRICES.growler,
    description: 'Freshly filled amber glass growler of our 20-hour steeped slow cold brew. Keeps cold for 5 days.',
    tempServed: 'Keep Refrigerated',
  },
  {
    id: 'brun-cup-hero',
    name: 'BRUN Signature Cup',
    subtitle: 'Limited Release Lot',
    size: '12 oz Hot / Iced',
    format: 'Dine & To-Go',
    image: '/assets/user/img5.jpg',
    isMainCup: true,
    price: PRODUCT_PRICES.signatureCup,
    description: 'Our iconic double-walled cup with custom "BRÜN your day" sleeve, freshly pulled single origin espresso & silky pour.',
    tempServed: 'Served at 155°F',
  },
  {
    id: 'whole-bean-bag',
    name: 'Ethiopian Whole Bean',
    subtitle: '12 oz Craft Bag',
    size: '12 oz (340g)',
    format: 'Whole Bean Bag',
    image: '/assets/user/img3.jpg',
    video: CAFE_VIDEOS.espresso,
    price: PRODUCT_PRICES.wholeBean,
    description: 'Specialty Grade heirloom Arabica beans roasted on our vintage cast iron drum. Notes of jasmine, bergamot, and caramel.',
    tempServed: 'Whole Bean',
  },
  {
    id: 'nitro-slim-can',
    name: 'Nitro RTD Slim Can',
    subtitle: 'Ready to Drink',
    size: '12 fl oz Can',
    format: 'Nitro Can',
    image: '/assets/user/img6.jpg',
    video: CAFE_VIDEOS.espresso,
    price: PRODUCT_PRICES.nitroCan,
    description: 'Single-serve nitrogen-charged cold brew can. Crack open to initiate instant cascading velvet foam.',
    tempServed: 'Shake & Pour Ice Cold',
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoasterOpen, setIsRoasterOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPreloaderDone, setIsPreloaderDone] = useState(() =>
    document.documentElement.hasAttribute('data-brun-preloader-started'));
  const handlePreloaderComplete = useCallback(() => setIsPreloaderDone(true), []);

  useEffect(() => {
    // Lives with the document, including across development module reloads.
    document.documentElement.setAttribute('data-brun-preloader-started', '');
  }, []);

  // Cart state initialized with 1 BRÜN Cup & 1 Whole Bean bag for immediate delight
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: ALL_PRODUCTS[2], // BRÜN Cup
      quantity: 1,
      grind: 'Medium / Pour Over',
    },
    {
      product: ALL_PRODUCTS[3], // 12 oz Bag
      quantity: 1,
      grind: 'Whole Bean',
    },
  ]);

  const handleToggleAudio = () => {
    const playing = cafeAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const handleAddToCart = (product: ProductItem, grind: CartItem['grind'] = 'Medium / Pour Over') => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.grind === grind);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.grind === grind
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, grind }];
    });
    setIsOrderOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleSelectChapter = (chapter: number) => {
    setActiveChapter(chapter);
    if (chapter === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (chapter === 1 || chapter === 2) {
      const heroTrack = document.getElementById('brun-hero-track');
      if (heroTrack) {
        const target = heroTrack.offsetTop + (heroTrack.offsetHeight - window.innerHeight) * HERO_CHAPTER_PROGRESS[chapter];
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    } else if (chapter === 3) {
      const exp = document.getElementById('brun-cafe-experience');
      if (exp) {
        exp.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-parchment font-sans-clean text-[#1D1B16] flex flex-col relative selection:bg-[#2F1207] selection:text-white">
      {/* Brand Preloader Prelude */}
      {!isPreloaderDone && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Top Bar matching video contract */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOrder={() => setIsOrderOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        activeChapter={activeChapter}
        onSelectChapter={handleSelectChapter}
      />

      {/* Hero Interactive Scroll Canvas */}
      <main className="flex-1 w-full">
        <HeroScrollContainer
          onOpenRoaster={() => setIsRoasterOpen(true)}
          onOpenOrder={() => setIsOrderOpen(true)}
          onAddToCart={handleAddToCart}
          activeChapter={activeChapter}
          setActiveChapter={setActiveChapter}
          allProducts={ALL_PRODUCTS}
          isPreloaderDone={isPreloaderDone}
        />
      </main>

      {/* Slide-out Navigation Drawer */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectChapter={handleSelectChapter}
        onOpenOrder={() => setIsOrderOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCoffee={(coffee) => {
          setIsOrderOpen(true);
        }}
      />

      {/* Master Roaster Interview Video Modal */}
      <RoasterModal
        isOpen={isRoasterOpen}
        onClose={() => setIsRoasterOpen(false)}
      />

      {/* Order & Customizer Drawer */}
      <OrderDrawer
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddToCart={handleAddToCart}
        allProducts={ALL_PRODUCTS}
      />
    </div>
    </MotionConfig>
  );
}
