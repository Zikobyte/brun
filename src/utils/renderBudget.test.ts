import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCupRenderBudget } from './renderBudget';

test('mobile and desktop cup drawing buffers stay within their pixel budgets', () => {
  for (const viewportWidth of [390, 768, 1440]) {
    for (const [width, height] of [[80, 112], [320, 420], [540, 650], [1080, 1300]]) {
      for (const dpr of [1, 2, 3]) {
        const budget = getCupRenderBudget(width, height, viewportWidth, dpr);
        assert.ok(width * height * budget.pixelRatio ** 2 <= (viewportWidth < 768 ? 300000 : 750000) + 0.001);
        assert.ok(budget.pixelRatio <= dpr && budget.pixelRatio > 0);
        assert.ok(budget.pixelRatio <= (viewportWidth < 768 || width <= 320 ? 1 : 1.5));
      }
    }
  }
});

test('thumbnail and mobile textures use one sixteenth of the original 4K pixel count', () => {
  for (const budget of [
    getCupRenderBudget(80, 112, 1440, 2),
    getCupRenderBudget(380, 480, 390, 3),
  ]) {
    assert.equal(budget.textureWidth, 1024);
    assert.equal(budget.radialSegments, 48);
    assert.equal((budget.textureWidth * (budget.textureWidth / 2)) / (4096 * 2048), 1 / 16);
  }
  const desktop = getCupRenderBudget(540, 650, 1440, 2);
  assert.equal(desktop.textureWidth, 2048);
  assert.equal(desktop.radialSegments, 64);
});
