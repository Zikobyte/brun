<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/56d5463b-9818-4881-889d-c1fd688e465a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Animation behavior

- The brand preloader runs once per document load (including reloads), not when
  opening drawers, changing chapters, updating the cart, or remounting the app.
  Skip cancels the reveal timers and completes through the same exit animation.
- Hero scroll transforms use Motion values rather than per-frame React renders.
  Chapter links use the hero's scrollable distance, including after resizing.
  On narrow screens the product lineup scrolls horizontally so all five products
  remain accessible inside the sticky scene.
- All 3D cups share the same model, sleeve artwork and color management. Cups
  initialize when needed, stop rendering offscreen or in hidden tabs, and release
  GPU resources on unmount. Horizontal dragging rotates the cup; vertical touch
  gestures still scroll the page.
- The hero cup settles over the B/R side of the wordmark. The preloader backdrop
  is pure white without a gradient or grain layer.
- Section headings fade up, images and menu cards glide in from alternating
  sides, and journal/footer cards reveal with staggered timing. These reveals
  replay on re-entry; large sections stay mounted and visible so child reveals
  trigger independently, including on short viewports.
- The gallery and footer wordmark use two identical groups
  for seamless looping, pause offscreen/on hover, and respect reduced motion.
  The footer keeps one interactive 3D cup beside the scrolling BRUN wordmark.
- Cart thumbnails use the shared 3D cup in a dark espresso finish with white
  artwork, without changing product names, pricing, or quantity controls. The
  rest of the page retains the original light cup design.
  The cafe video only autoplays while visible.
- Reduced-motion preferences disable automatic cup rotation, gallery movement
  and parallax; the cafe video exposes playback controls instead.

Validate with `npm run test`, `npm run lint`, and `npm run build`. Browser checks:
reload and skip; open/close drawers; navigate chapters in both directions; resize
to mobile and short desktop viewports; scroll beyond the hero and back; enable
reduced motion. Frame rate depends on the device/GPU and should be profiled on
target devices rather than described as a percentage guarantee.
