const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const PRODUCT_PRICES = {
  nitroDraft: 9000,
  growler: 14000,
  signatureCup: 8000,
  wholeBean: 15000,
  nitroCan: 7000,
} as const;

export const FREE_SHIPPING_THRESHOLD = 35000;

export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}
