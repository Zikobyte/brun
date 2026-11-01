import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCupPose, getHeroChapter, getMouthfeelsY, HERO_CHAPTER_PROGRESS } from './heroAnimation';

test('navigation targets land inside the matching scroll chapters', () => {
  HERO_CHAPTER_PROGRESS.forEach((progress, chapter) => {
    assert.equal(getHeroChapter(progress), chapter);
  });
  assert.equal(getHeroChapter(0.32), 1);
  assert.equal(getHeroChapter(0.65), 2);
  assert.equal(getHeroChapter(0.95), 3);
});

test('mouthfeels translation is continuous at the direction change', () => {
  assert.ok(Math.abs(getMouthfeelsY(0.48)) < 0.001);
  assert.ok(Math.abs(getMouthfeelsY(0.48 - 0.000001)) < 0.001);
  assert.ok(Math.abs(getMouthfeelsY(0.48 + 0.000001)) < 0.001);
});

test('cup transforms are continuous across every scene boundary during entrance and after it', () => {
  for (const entrance of [0, 0.5, 1]) {
    for (const [width, height] of [[390, 844], [768, 1024], [1440, 900], [1386, 486]]) {
      for (const boundary of [0.28, 0.32, 0.60, 0.88, 0.88 + 0.08 / 1.5]) {
        const before = getCupPose(boundary - 0.000001, entrance, width, height);
        const after = getCupPose(boundary + 0.000001, entrance, width, height);
        for (const property of ['x', 'y', 'scale', 'opacity'] as const) {
          assert.ok(Math.abs(before[property] - after[property]) < 0.01, `${property} jumps at ${boundary}`);
        }
      }
    }
  }
});

test('initial and centered cup placements fit mobile, tablet and short desktop viewports', () => {
  for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [1440, 900], [1386, 486]]) {
    const canvasWidth = width < 640 ? 380 : width < 768 ? 460 : 540;
    const canvasHeight = width < 640 ? 480 : width < 768 ? 580 : 650;
    for (const entrance of [0, 0.5, 1]) {
      const pose = getCupPose(0, entrance, width, height);
      const centerX = width / 2 + pose.x;
      const centerY = height / 2 + pose.y;
      assert.ok(centerX - canvasWidth * pose.scale / 2 >= 0);
      assert.ok(centerX + canvasWidth * pose.scale / 2 <= width);
      assert.ok(centerY - canvasHeight * pose.scale / 2 >= 0);
      assert.ok(centerY + canvasHeight * pose.scale / 2 <= height);
    }
  }
});

test('hero cup stays centered and its canvas fits between BR and UN before scrolling', () => {
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 900]]) {
    const canvasWidth = width < 640 ? 380 : width < 768 ? 460 : 540;
    const gap = width * (width < 640 ? 0.52 : 0.40);
    for (const entrance of [0, 0.5, 1]) {
      const pose = getCupPose(0, entrance, width, height);
      assert.equal(pose.x, 0);
      assert.equal(pose.y, 0);
      assert.ok(canvasWidth * pose.scale < gap);
    }
  }
});

test('scrubbing in either direction produces the same bounded pose without history', () => {
  const progressValues = Array.from({ length: 101 }, (_, index) => index / 100);
  const forward = progressValues.map(progress => getCupPose(progress, 1, 1440, 900));
  const backward = [...progressValues].reverse().map(progress => getCupPose(progress, 1, 1440, 900)).reverse();
  assert.deepEqual(backward, forward);
  forward.forEach(pose => {
    assert.ok(pose.scale > 0);
    assert.ok(pose.opacity >= 0 && pose.opacity <= 1);
  });
  assert.equal(getCupPose(1, 1, 1440, 900).opacity, 0);
});
