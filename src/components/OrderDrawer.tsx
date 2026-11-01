import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, Check, ArrowRight, ShieldCheck, Truck, Coffee } from 'lucide-react';
import { ProductItem, CartItem } from '../types';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: ProductItem, grind: CartItem['grind']) => void;
  allProducts: ProductItem[];
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  allProducts,
}) => {
  const [selectedGrind, setSelectedGrind] = useState<CartItem['grind']>('Medium / Pour Over');
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<ProductItem>(allProducts[0]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 35;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
    setTimeout(() => {
      setIsCheckoutSuccess(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Smooth Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
            onClick={onClose}
          />

          {/* Smooth Slide-out Cart Drawer from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 27, stiffness: 260, mass: 0.85 }}
            className="relative w-full max-w-lg bg-[#F8F6F0] text-[#1D1B16] h-full shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#E3DDD1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xl font-bold tracking-wider text-[#2F1207]">
                  YOUR ORDER BAG
                </span>
                <span className="text-xs bg-[#EFECE3] px-2 py-0.5 rounded-full text-[#7C7567] font-semibold">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="p-2 rounded-full text-[#7C7567] hover:text-[#1D1B16] hover:bg-[#EAE4D7] transition-all cursor-pointer active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3 bg-[#EFECE3] border-b border-[#E3DDD1] text-xs">
              <div className="flex justify-between items-center mb-1 font-medium text-[#5A5345]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#2F1207]" />
                  {subtotal >= freeShippingThreshold
                    ? 'You unlocked FREE Carbon-Neutral Delivery!'
                    : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping`}
                </span>
                <span className="font-bold">{progressToFreeShipping.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[#DFD8CB] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#2F1207] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {isCheckoutSuccess ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-[#1D1B16]">
                    Roast Order Dispatched!
                  </h3>
                  <p className="text-xs text-[#7C7567] max-w-xs mx-auto">
                    Your micro-batch order has been routed to our lead roaster. Estimated dispatch: Freshly roasted within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart List */}
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-3.5 bg-white rounded-xl border border-[#DFD8CB] flex gap-3 items-center shadow-xs hover:border-[#2F1207]/40 transition-colors"
                        >
                          <div className="w-16 h-20 bg-[#F5F2EB] rounded-lg flex items-center justify-center overflow-hidden shrink-0 p-1">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#1D1B16] truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-[#8C8372]">
                              {item.product.size} · {item.grind}
                            </p>
                            <p className="font-mono text-xs font-bold text-[#2F1207] mt-1">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-1.5 border border-[#DFD8CB] rounded-lg p-1 bg-[#F8F6F0]">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-[#7C7567] hover:text-[#1D1B16] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-[#7C7567] hover:text-[#1D1B16] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-2 border-2 border-dashed border-[#DFD8CB] rounded-xl p-6">
                      <Coffee className="w-10 h-10 text-[#A89F8F] mx-auto stroke-[1.5]" />
                      <p className="font-cinzel text-sm font-bold text-[#1D1B16]">Your Bag Is Empty</p>
                      <p className="text-xs text-[#7C7567]">
                        Choose from our freshly roasted single-origin coffees below to add to your order.
                      </p>
                    </div>
                  )}

                  {/* Quick Add / Customize Module */}
                  <div className="pt-4 border-t border-[#E3DDD1] space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8372]">
                      Select Format & Add To Bag
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {allProducts.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProductToAdd(p)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            selectedProductToAdd.id === p.id
                              ? 'border-[#2F1207] bg-white ring-1 ring-[#2F1207]'
                              : 'border-[#DFD8CB] bg-[#F5F2EB] hover:bg-white'
                          }`}
                        >
                          <p className="font-cinzel text-xs font-bold text-[#1D1B16] truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[#7C7567]">{p.size}</p>
                          <p className="text-xs font-mono font-bold text-[#2F1207] mt-1">${p.price.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>

                    {/* Grind Selector */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C7567]">
                        Grind Specification
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {(['Whole Bean', 'Medium / Pour Over', 'Fine / Espresso', 'Coarse / French Press'] as const).map(
                          (g) => (
                            <button
                              key={g}
                              onClick={() => setSelectedGrind(g)}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                selectedGrind === g
                                  ? 'bg-[#2F1207] text-white border-[#2F1207] font-semibold'
                                  : 'bg-white text-[#5A5345] border-[#DFD8CB] hover:border-[#2F1207]'
                              }`}
                            >
                              {g}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(selectedProductToAdd, selectedGrind)}
                      className="w-full py-2.5 bg-[#1D1B16] hover:bg-black text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add {selectedProductToAdd.name} to Bag</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer Checkout Bar */}
            {!isCheckoutSuccess && (
              <div className="p-5 sm:p-6 bg-[#EFECE3] border-t border-[#E3DDD1] space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-cinzel text-xs font-bold text-[#5A5345]">Order Subtotal</span>
                  <span className="font-mono text-base font-bold text-[#1D1B16]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-[#7C7567] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Guaranteed Fresh Roasted · Dispatch within 24 Hours
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full py-3 bg-[#2F1207] hover:bg-[#1a0a04] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-cinzel text-xs font-bold tracking-widest uppercase rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
