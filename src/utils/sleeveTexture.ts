export type CupAppearance = 'light' | 'dark';

const cachedCanvases = new Map<CupAppearance, { canvas: HTMLCanvasElement; fontStatus: FontFaceSetLoadStatus }>();

/**
 * Creates a high-resolution 4096x2048 canvas texture for the BRÜN paper cup sleeve.
 * Exactly matches the reference image:
 * 1. "B R Ü N" in rich dark brown espresso (#2F1207) with two distinct dots above Ü.
 * 2. Horizontal divider line with central tilted coffee bean with curved white crease.
 * 3. Flowing cursive handwritten tagline "your day".
 * 4. Left line-art coffee cup with steam.
 * 5. Right line-art croissant / pastry illustration.
 */
export function createBrunSleeveCanvas(appearance: CupAppearance = 'light'): HTMLCanvasElement {
  const cached = cachedCanvases.get(appearance);
  if (cached && cached.fontStatus === document.fonts.status) return cached.canvas;
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('BRUN: Unable to create the cup sleeve artwork.');

  const isDark = appearance === 'dark';
  const brandColor = isDark ? '#FFFFFF' : '#2F1207';
  const paperColor = isDark ? '#17120F' : '#FFFFFF';

  // 1. Crisp white paper sleeve base
  ctx.fillStyle = paperColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle organic paper fibers
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(47, 18, 7, 0.025)';
  for (let i = 0; i < 600; i++) {
    const px = Math.random() * canvas.width;
    const py = Math.random() * canvas.height;
    ctx.fillRect(px, py, Math.random() * 3 + 1, Math.random() * 3 + 1);
  }

  // Top & bottom paper seam borders
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(47, 18, 7, 0.15)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(canvas.width, 10);
  ctx.moveTo(0, canvas.height - 10);
  ctx.lineTo(canvas.width, canvas.height - 10);
  ctx.stroke();

  // Master function to render the exact BRÜN insignia lockup at any coordinate
  const drawBrunInsignia = (centerX: number, centerY: number) => {
    ctx.save();

    // -------------------------------------------------------------
    // 1. MAIN BRAND TEXT: "B R Ü N" (Bold & High Contrast)
    // -------------------------------------------------------------
    ctx.fillStyle = brandColor;
    ctx.strokeStyle = brandColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Bold modern sans-serif font
    ctx.font = '700 215px "Plus Jakarta Sans", "Montserrat", "Helvetica Neue", sans-serif';

    // Generous letter spacing matching photo
    const letterY = centerY - 55;
    const letterSpacing = 195;

    const letters = [
      { char: 'B', x: centerX - letterSpacing * 1.5 },
      { char: 'R', x: centerX - letterSpacing * 0.5 },
      { char: 'U', x: centerX + letterSpacing * 0.5 },
      { char: 'N', x: centerX + letterSpacing * 1.5 },
    ];

    letters.forEach((item) => {
      ctx.fillText(item.char, item.x, letterY);
    });

    // CRITICAL: Two distinct circular dots above the letter Ü (Bold & Prominent)
    const uX = centerX + letterSpacing * 0.5;
    const dotY = letterY - 220;
    const dotOffset = 36;
    const dotRadius = 14;

    ctx.beginPath();
    ctx.arc(uX - dotOffset, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(uX + dotOffset, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();

    // -------------------------------------------------------------
    // 2. THIN HORIZONTAL DIVIDER LINE WITH COFFEE BEAN IN CENTER
    // -------------------------------------------------------------
    const lineY = centerY + 36;
    const lineHalfWidth = 520;
    const beanGap = 52;

    ctx.lineWidth = 5.5;
    ctx.beginPath();
    // Left horizontal segment
    ctx.moveTo(centerX - lineHalfWidth, lineY);
    ctx.lineTo(centerX - beanGap, lineY);
    // Right horizontal segment
    ctx.moveTo(centerX + beanGap, lineY);
    ctx.lineTo(centerX + lineHalfWidth, lineY);
    ctx.stroke();

    // Central roasted coffee bean (tilted oval with white center crease)
    ctx.save();
    ctx.translate(centerX, lineY);
    ctx.rotate(-0.48);

    // Bean outer solid body
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 21, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bean inner S-curve crease line
    ctx.strokeStyle = paperColor;
    ctx.lineWidth = 4.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-22, -4);
    ctx.bezierCurveTo(-7, 11, 7, -11, 22, 4);
    ctx.stroke();
    ctx.restore();

    // -------------------------------------------------------------
    // 3. HANDWRITTEN TAGLINE: "your day" (Bold & High Contrast)
    // -------------------------------------------------------------
    ctx.font = '700 240px "Caveat", "Alex Brush", "Brush Script MT", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('your day', centerX + 12, centerY + 245);

    // Bold handwritten flourish stroke
    ctx.beginPath();
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brandColor;
    ctx.moveTo(centerX + 245, centerY + 295);
    ctx.bezierCurveTo(centerX + 300, centerY + 330, centerX + 370, centerY + 305, centerX + 420, centerY + 250);
    ctx.stroke();

    // -------------------------------------------------------------
    // 4. DECORATIVE ILLUSTRATION (LEFT): COFFEE CUP WITH STEAM
    // -------------------------------------------------------------
    const cupCenterX = centerX - 780;
    const cupCenterY = centerY + 70;

    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brandColor;

    // Continuous-line coffee cup body
    ctx.beginPath();
    ctx.ellipse(cupCenterX, cupCenterY, 96, 40, 0, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cupCenterX - 96, cupCenterY);
    ctx.bezierCurveTo(
      cupCenterX - 85,
      cupCenterY + 145,
      cupCenterX - 45,
      cupCenterY + 195,
      cupCenterX,
      cupCenterY + 195
    );
    ctx.bezierCurveTo(
      cupCenterX + 45,
      cupCenterY + 195,
      cupCenterX + 85,
      cupCenterY + 145,
      cupCenterX + 96,
      cupCenterY
    );
    ctx.stroke();

    // Cup handle on right
    ctx.beginPath();
    ctx.moveTo(cupCenterX + 88, cupCenterY + 28);
    ctx.bezierCurveTo(
      cupCenterX + 145,
      cupCenterY + 35,
      cupCenterX + 145,
      cupCenterY + 120,
      cupCenterX + 70,
      cupCenterY + 130
    );
    ctx.stroke();

    // Inner coffee swirl inside the rim
    ctx.beginPath();
    ctx.ellipse(cupCenterX - 12, cupCenterY, 52, 22, -0.15, 0, Math.PI * 1.8);
    ctx.stroke();

    // Flowing steam line rising above the cup
    ctx.beginPath();
    ctx.moveTo(cupCenterX - 35, cupCenterY - 45);
    ctx.bezierCurveTo(
      cupCenterX - 75,
      cupCenterY - 140,
      cupCenterX + 15,
      cupCenterY - 210,
      cupCenterX - 45,
      cupCenterY - 330
    );
    ctx.stroke();

    // Secondary subtle steam vapor
    ctx.beginPath();
    ctx.moveTo(cupCenterX + 18, cupCenterY - 40);
    ctx.bezierCurveTo(
      cupCenterX - 15,
      cupCenterY - 120,
      cupCenterX + 55,
      cupCenterY - 180,
      cupCenterX + 10,
      cupCenterY - 260
    );
    ctx.stroke();

    // -------------------------------------------------------------
    // 5. DECORATIVE ILLUSTRATION (RIGHT): ARTISAN CROISSANT / PASTRY
    // -------------------------------------------------------------
    const rightCenterX = centerX + 810;
    const rightCenterY = centerY + 100;

    ctx.beginPath();
    ctx.moveTo(rightCenterX + 95, rightCenterY - 240);
    ctx.bezierCurveTo(
      rightCenterX + 10,
      rightCenterY - 140,
      rightCenterX - 85,
      rightCenterY - 20,
      rightCenterX - 45,
      rightCenterY + 15
    );
    ctx.bezierCurveTo(
      rightCenterX - 15,
      rightCenterY + 45,
      rightCenterX + 55,
      rightCenterY + 50,
      rightCenterX + 45,
      rightCenterY + 95
    );
    ctx.bezierCurveTo(
      rightCenterX + 35,
      rightCenterY + 140,
      rightCenterX - 40,
      rightCenterY + 195,
      rightCenterX + 10,
      rightCenterY + 230
    );
    ctx.stroke();

    // Curved crescent croissant arcs
    ctx.beginPath();
    ctx.arc(rightCenterX - 10, rightCenterY + 40, 52, -1.2, 1.4);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rightCenterX - 5, rightCenterY + 115, 42, -1.1, 1.3);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rightCenterX + 2, rightCenterY + 175, 32, -1.0, 1.2);
    ctx.stroke();

    ctx.restore();
  };

  // Render on front face (u = 0.5)
  drawBrunInsignia(canvas.width * 0.5, canvas.height * 0.5);

  // Render on opposite face (u = 0 and u = 1.0)
  drawBrunInsignia(0, canvas.height * 0.5);
  drawBrunInsignia(canvas.width, canvas.height * 0.5);

  cachedCanvases.set(appearance, { canvas, fontStatus: document.fonts.status });
  return canvas;
}
