import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, Sparkles, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface RoasterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoasterModal: React.FC<RoasterModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(14);
  const duration = 92; // 1m 32s interview

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#181613] text-[#F8F6F0] rounded-xl shadow-2xl border border-[#3A352D] overflow-hidden z-10">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D2A24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93B] animate-ping" />
            <h3 className="font-cinzel text-sm sm:text-base font-bold tracking-widest uppercase text-white">
              Head Roaster Dispatch · Elias Brün
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas & Media Player */}
        <div className="relative aspect-video bg-black overflow-hidden group">
          <img
            src="/assets/user/img1.jpg"
            alt="Master Roaster Elias Brün"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Film Grain & Dark Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30 pointer-events-none" />

          {/* Interactive Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#2F1207]/90 hover:bg-[#2F1207] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10 border border-white/20"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
          </button>

          {/* Bottom Captions & Speech Visualizer */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center gap-3 mb-2">
              {/* Equalizer sound bars */}
              <div className="flex items-end gap-1 h-4">
                {[0.4, 0.9, 0.6, 1.0, 0.7, 0.5, 0.8].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      height: isPlaying ? `${h * 100}%` : '20%',
                      transition: 'height 0.2s ease',
                    }}
                    className="w-1 bg-[#E5A93B] rounded-full inline-block"
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono tracking-wider text-neutral-300">
                {formatTime(currentTime)} / {formatTime(duration)} · Audio Commentary
              </span>
            </div>

            {/* Subtitle speech banner */}
            <p className="text-xs sm:text-sm text-neutral-100 bg-black/60 backdrop-blur-sm p-2.5 rounded border border-white/10 font-sans-clean leading-relaxed">
              "When we roast this Ethiopian heirloom lot, our job is not to leave heavy scorch marks on it. We drop the beans at exactly 412°F to let the natural wild honeysuckle and bergamot sing through the cup."
            </p>
          </div>
        </div>

        {/* Roaster Notes & Specs Strip */}
        <div className="p-4 sm:p-6 bg-[#211E1A] grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#312C24]">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#E5A93B] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Origin</p>
              <p className="text-xs font-semibold text-white">Yirgacheffe, Gedeo (1,950m)</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Award className="w-4 h-4 text-[#E5A93B] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Roast Profile</p>
              <p className="text-xs font-semibold text-white">Light-Medium (City+) Cast-Iron</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#E5A93B] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Cupping Score</p>
              <p className="text-xs font-semibold text-white">89.5 SCAA Certified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
