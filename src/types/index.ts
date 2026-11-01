export interface RoastStat {
  label: string;
  value: string;
  unit?: string;
  description: string;
  detail: string;
}

export interface FlavorSplash {
  id: string;
  title: string;
  color: string;
  bgRgba: string;
  borderColor: string;
  description: string;
  position: 'top-left' | 'bottom-left' | 'top-right';
  badgeStyle: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  size: string;
  format: string;
  image: string;
  isMainCup?: boolean;
  price: number;
  description: string;
  tempServed: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  grind: 'Whole Bean' | 'Coarse / French Press' | 'Medium / Pour Over' | 'Fine / Espresso';
}
