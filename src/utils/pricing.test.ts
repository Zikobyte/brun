import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatNaira, FREE_SHIPPING_THRESHOLD, PRODUCT_PRICES } from './pricing';

test('product unit prices stay within the requested naira range', () => {
  Object.values(PRODUCT_PRICES).forEach(price => {
    assert.ok(price >= 6000 && price <= 15000);
    assert.ok(Number.isInteger(price));
  });
  assert.equal(Math.max(...Object.values(PRODUCT_PRICES)), 15000);
});

test('prices and cart amounts use the naira symbol and thousands separators', () => {
  assert.equal(formatNaira(6000), '\u20a66,000');
  assert.equal(formatNaira(15000), '\u20a615,000');
  const subtotal = PRODUCT_PRICES.signatureCup + PRODUCT_PRICES.wholeBean;
  assert.equal(formatNaira(subtotal), '\u20a623,000');
  assert.equal(formatNaira(FREE_SHIPPING_THRESHOLD - subtotal), '\u20a612,000');
  assert.equal(formatNaira(PRODUCT_PRICES.signatureCup * 2), '\u20a616,000');
});
