import React from 'react';
import { motion, type MotionValue, useTransform } from 'motion/react';
import { SpinningCupCanvas } from './SpinningCupCanvas';
import type { CupPose } from '../utils/heroAnimation';

interface CoffeeCup3DProps {
  pose: MotionValue<CupPose>;
  active: boolean;
  docked: boolean;
  initialTurn: boolean;
}

export const CoffeeCup3D: React.FC<CoffeeCup3DProps> = ({
  pose, active, docked, initialTurn,
}) => {
  const transform = useTransform(pose, ({ x, y, scale }) =>
    `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`
  );
  const opacity = useTransform(pose, (value) => value.opacity);
  const visibility = useTransform(pose, (value) => value.opacity <= 0.002 ? 'hidden' : 'visible');

  return (
    <motion.div
      style={{ transform, opacity, visibility, willChange: 'transform, opacity' }}
      className="absolute top-1/2 left-1/2 z-[45] select-none"
    >
      <div className="w-[380px] sm:w-[460px] md:w-[540px] h-[480px] sm:h-[580px] md:h-[650px]">
        <SpinningCupCanvas
          className="w-full h-full"
          active={active}
          docked={docked}
          initialTurn={initialTurn}
          speed={0.8}
        />
      </div>
    </motion.div>
  );
};
