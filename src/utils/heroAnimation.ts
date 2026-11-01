export interface CupPose {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export const HERO_CHAPTER_PROGRESS = [0, 0.45, 0.82] as const;

export function getHeroChapter(progress: number): number {
  if (progress < 0.32) return 0;
  if (progress < 0.65) return 1;
  if (progress < 0.95) return 2;
  return 3;
}

export function getMouthfeelsY(progress: number): number {
  const incoming = 130 * (1 - Math.max(0, Math.min(1, (progress - 0.28) / 0.20)));
  return progress < 0.48 ? incoming : (progress - 0.48) * -280;
}

export function getCupPose(progress: number, entrance: number, width: number, height: number): CupPose {
  const canvasWidth = width < 640 ? 380 : width < 768 ? 460 : 540;
  const canvasHeight = width < 640 ? 480 : width < 768 ? 580 : 650;
  const fitScale = Math.min(1, Math.max(0.25, (height - 96) / canvasHeight), (width - 32) / canvasWidth);
  const baseScale = fitScale * (width < 640 ? 0.88 : 1.05);
  const baseX = -Math.min(width * (width < 640 ? 0.035 : 0.07), Math.max(0, (width - canvasWidth * baseScale) / 2 - 16));
  const baseY = -Math.min(height * 0.025, Math.max(0, (height - canvasHeight * baseScale) / 2 - 16));

  if (progress <= 0.32) {
    const scroll = Math.min(1, progress / 0.28);
    const scale = fitScale + (baseScale - fitScale) * entrance;
    return {
      x: baseX * entrance * (1 - scroll),
      y: baseY * entrance * (1 - scroll),
      scale: scale + (fitScale * 1.18 - scale) * scroll,
      opacity: 1,
    };
  }
  if (progress <= 0.60) return { x: 0, y: 0, scale: fitScale * 1.18, opacity: 1 };
  const dock = Math.max(0, Math.min(1, (progress - 0.60) / 0.28));
  return {
    x: 0,
    y: dock * Math.min(165, height * 0.18),
    scale: fitScale * (1.18 - dock * 0.66),
    opacity: Math.max(0, Math.min(1, 1 - ((progress - 0.88) / 0.08) * 1.5)),
  };
}
