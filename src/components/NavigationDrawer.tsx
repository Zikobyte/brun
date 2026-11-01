import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, MapPin, Coffee, Sparkles, Clock, ShoppingBag } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapterIndex: number) => void;
  onOpenOrder: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
  onOpenOrder,
}) => {
  const chapters = [
    { title: 'The Release: Ethiopian Lot', num: '01', desc: 'High-elevation heirloom Arabica from Gedeo Zone', chapter: 0 },
    { title: 'Mouthfeels & Aromatics', num: '02', desc: 'Interactive flavor anatomy & head roaster story', chapter: 1 },
    { title: 'Year Round Lineup', num: '03', desc: 'Single-origin beans, nitro cans & signature cups', chapter: 2 },
    { title: 'The BRUN Experience & Menu', num: '04', desc: 'Bakery viennoiserie, cafe lounge & latest news', chapter: 3 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Smooth Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
            onClick={onClose}
          />

          {/* Smooth Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 27, stiffness: 260, mass: 0.85 }}
            className="relative w-full max-w-md bg-[#F8F6F0] text-[#1D1B16] h-full shadow-2xl flex flex-col justify-between p-6 sm:p-8 z-10 overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E3DDD1]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-cinzel text-2xl font-black tracking-widest text-[#2F1207]">
                      BRÜN Cafe
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F1207]" />
                  </div>
                  <p className="font-cinzel text-[10px] tracking-widest uppercase text-[#7C7567] mt-0.5">
                    Specialty Roastery & Kitchen
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-2.5 rounded-full text-[#1D1B16] hover:bg-[#EAE4D7] transition-all cursor-pointer active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chapter Links */}
              <div className="py-6 space-y-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C8372]">
                  Interactive Experience Chapters
                </span>
                <div className="space-y-2.5">
                  {chapters.map((item, idx) => (
                    <motion.button
                      key={item.num}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + idx * 0.05, duration: 0.35 }}
                      onClick={() => {
                        onSelectChapter(item.chapter);
                        onClose();
                      }}
                      className="w-full text-left p-3.5 rounded-xl border border-transparent hover:border-[#DFD8CB] hover:bg-[#F0EDE4] active:bg-[#EAE4D7] transition-all group flex items-start justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-bebas text-lg text-[#2F1207]">{item.num}</span>
                          <h4 className="font-cinzel font-bold text-sm text-[#1D1B16] group-hover:text-[#2F1207] transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#7C7567] mt-0.5 pl-6">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#A89F8F] group-hover:text-[#2F1207] group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Roastery Quick Info */}
              <div className="pt-4 border-t border-[#E3DDD1] space-y-3">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C8372]">
                  Roastery & Locations
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#EFECE3] rounded-xl">
                    <div className="flex items-center gap-1.5 text-[#1D1B16] font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#2F1207]" />
                      <span>Flagship Cafe</span>
                    </div>
                    <p className="text-[#7C7567] mt-1 text-[11px] leading-tight">
                      123 Latte Lane, Food City
                    </p>
                  </div>
                  <div className="p-3 bg-[#EFECE3] rounded-xl">
                    <div className="flex items-center gap-1.5 text-[#1D1B16] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#2F1207]" />
                      <span>Roaster Hours</span>
                    </div>
                    <p className="text-[#7C7567] mt-1 text-[11px] leading-tight">
                      Mon–Sun: 7am – 7pm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-[#E3DDD1] flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenOrder();
                }}
                className="w-full py-3 bg-[#1D1B16] hover:bg-[#2F1207] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Open Order Bag</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
