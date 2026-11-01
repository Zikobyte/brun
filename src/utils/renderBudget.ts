export function getCupRenderBudget(width: number, height: number, viewportWidth: number, devicePixelRatio: number) {
  const mobile = viewportWidth < 768;
  const pixelBudget = mobile ? 300000 : 750000;
  const pixelRatio = Math.min(
    devicePixelRatio || 1,
    mobile || width <= 320 ? 1 : 1.5,
    Math.sqrt(pixelBudget / Math.max(1, width * height)),
  );
  return {
    pixelRatio,
    textureWidth: mobile || width <= 320 ? 1024 : 2048,
    radialSegments: mobile || width <= 320 ? 48 : 64,
  };
}
