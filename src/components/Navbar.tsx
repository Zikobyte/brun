import React from 'react';
import { Menu, Search, Volume2, VolumeX, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenOrder: () => void;
  cartCount: number;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  activeChapter: number;
  onSelectChapter: (chapter: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMenu,
  onOpenSearch,
  onOpenOrder,
  cartCount,
  isAudioPlaying,
  onToggleAudio,
  activeChapter,
  onSelectChapter,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8F6F0]/90 backdrop-blur-md border-b border-[#E3DDD1] transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left Zone: Hamburger Menu + Search */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="p-2 sm:p-2.5 rounded-lg text-[#1D1B16] hover:bg-[#EAE4D7] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>

          <button
            onClick={onOpenSearch}
            aria-label="Search roasts"
            className="p-2 sm:p-2.5 rounded-lg text-[#1D1B16] hover:bg-[#EAE4D7] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Center Zone: BRÜN Wordmark & Heritage Stamp */}
        <div className="flex flex-col items-center justify-center select-none text-center">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xl sm:text-2xl md:text-3xl font-black tracking-[0.25em] text-[#2F1207]">
              BRÜN Cafe
            </span>
          </div>
          <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#6D6556] -mt-1 font-semibold">
            Specialty Roastery & Kitchen
          </span>
        </div>

        {/* Right Zone: Ambient Audio Toggle + ORDER COFFEE CTA Button + Cart */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Audio Atmosphere Synthesizer */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? "Mute cafe ambience" : "Listen to cafe ambience"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#EAE4D7] border-[#2F1207] text-[#2F1207]'
                : 'bg-transparent border-[#DFD8CB] text-[#7C7567] hover:border-[#BFB6A4]'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse text-[#2F1207]" />
                <span className="hidden sm:inline text-[11px] font-semibold">Cafe Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Ambience</span>
              </>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenOrder}
            aria-label="View bag"
            className="relative p-2 sm:p-2.5 rounded-lg text-[#1D1B16] hover:bg-[#EAE4D7] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2F1207] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary Action Button (Matches "BUY BEER" button from video with #2F1207 branding!) */}
          <button
            onClick={onOpenOrder}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#2F1207] hover:bg-[#1a0a04] active:scale-95 text-white font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            BUY COFFEE
          </button>
        </div>
      </div>
    </header>
  );
};
