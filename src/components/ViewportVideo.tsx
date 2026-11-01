import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface ViewportVideoProps {
  src: string;
  label: string;
  className?: string;
  active?: boolean;
}

export const ViewportVideo: React.FC<ViewportVideoProps> = ({
  src, label, className = 'w-full h-full object-cover', active = true,
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref);
  const nearView = useInView(ref, { once: true, margin: '300px' });
  const shouldLoad = nearView;
  const reduceMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setFailed(false);
    setBlocked(false);
  }, [src]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !shouldLoad) return;
    let disposed = false;
    const updatePlayback = () => {
      if (!active || !inView || document.hidden || reduceMotion || failed) {
        video.pause();
        return;
      }
      void video.play().catch((error: unknown) => {
        if (disposed || (error instanceof DOMException && error.name === 'AbortError')) return;
        console.warn(`BRUN: Unable to autoplay ${label}.`, error);
        setBlocked(true);
      });
    };
    updatePlayback();
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', updatePlayback);
      video.pause();
    };
  }, [src, label, active, inView, reduceMotion, failed, shouldLoad]);

  return (
    <>
      <video
        ref={ref}
        src={shouldLoad ? src : undefined}
        aria-label={label}
        className={className}
        preload="metadata"
        loop
        muted
        playsInline
        controls={!!reduceMotion || blocked}
        onClick={event => {
          if (reduceMotion || blocked) event.stopPropagation();
        }}
        onError={() => {
          console.error(`BRUN: Unable to load ${label}.`, ref.current?.error);
          setFailed(true);
        }}
      />
      {failed && (
        <span role="status" className="absolute inset-0 flex items-center justify-center bg-[#24140D] text-white text-xs text-center p-3">
          {label} video unavailable
        </span>
      )}
    </>
  );
};
