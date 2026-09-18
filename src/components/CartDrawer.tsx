import React, { useState, useMemo } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Flame,
  AlertCircle,
  MapPin,
  Car,
  Utensils,
  CreditCard,
  Banknote,
  Building,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CartItem, CustomerInfo, OrderType, PaymentMethod, RestaurantConfig } from '../types';
import { formatCOP } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onExploreMenu: () => void;
  config: RestaurantConfig;
  discountAmount: number;
  appliedPromoCode: string | null;
  onProceedToReview: (
    orderType: OrderType,
    customerInfo: CustomerInfo,
    paymentMethod: PaymentMethod,
    cashGiven: number | undefined,
    specialKitchenNotes: string
  ) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onExploreMenu,
  config,
  discountAmount,
  appliedPromoCode,
  onProceedToReview,
}) => {
  if (!isOpen) return null;

  // Order Type state
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Customer Info state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    tableNumber: '',
    address: '',
    neighborhood: '',
    locationReference: '',
    additionalNotes: '',
  });

  // Payment Method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashAmountInput, setCashAmountInput] = useState<string>('');
  const [specialKitchenNotes, setSpecialKitchenNotes] = useState<string>('');

  // Validation errors
  const [validationError, setValidationError] = useState<string | null>(null);

  // Real-time Pricing Calculations (Section 16)
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const extrasTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const itemExtras = item.selectedCustomizations.reduce((eAcc, c) => eAcc + c.price, 0);
      return acc + itemExtras * item.quantity;
    }, 0);
  }, [cartItems]);

  const deliveryFee = orderType === 'delivery' ? config.deliveryFee : 0;

  const rawTotal = subtotal + extrasTotal + deliveryFee;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  // Cash change calculation
  const cashNumber = parseFloat(cashAmountInput.replace(/[^0-9]/g, '')) || 0;
  const changeDue = cashNumber >= finalTotal ? cashNumber - finalTotal : 0;

  // Form validation handler (Section 22, 25)
  const handleValidateAndProceed = () => {
    setValidationError(null);

    if (cartItems.length === 0) {
      setValidationError('Your cart is empty. Add items before continuing.');
      return;
    }

    if (orderType === 'dine_in') {
      if (!customerInfo.tableNumber?.trim()) {
        setValidationError('Please enter your table number.');
        return;
      }
    } else if (orderType === 'takeaway') {
      if (!customerInfo.fullName.trim()) {
        setValidationError('Please enter your full name for the order.');
        return;
      }
      if (!customerInfo.phone.trim()) {
        setValidationError('Please enter your contact phone number.');
        return;
      }
    } else if (orderType === 'delivery') {
      if (!customerInfo.fullName.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (!customerInfo.phone.trim()) {
        setValidationError('Please enter your phone number.');
        return;
      }
      if (!customerInfo.address?.trim()) {
        setValidationError('Please complete your delivery address before continuing.');
        return;
      }
      if (!customerInfo.neighborhood?.trim()) {
        setValidationError('Please provide your neighborhood or sector in Ibagué.');
        return;
      }
    }

    // Cash check
    if (paymentMethod === 'cash') {
      if (!cashAmountInput.trim()) {
        setValidationError('Please specify the cash amount you will pay with.');
        return;
      }
      if (cashNumber < finalTotal) {
        setValidationError('The cash amount must be equal to or greater than the order total.');
        return;
      }
    }

    onProceedToReview(
      orderType,
      customerInfo,
      paymentMethod,
      paymentMethod === 'cash' ? cashNumber : undefined,
      specialKitchenNotes
    );
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl h-full bg-[#110a0d] border-l border-[#2e1218] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#2b1218] flex items-center justify-between bg-[#150d11]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2b0f16] border border-[#e11d48]/50 flex items-center justify-center fire-glow-sm">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-white tracking-wide">
                MY FUEGO ORDER
              </h3>
              <span className="text-xs text-zinc-400">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your selection
              </span>
            </div>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* EMPTY CART STATE (Section 36) */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center my-auto">
              <div className="w-20 h-20 rounded-full bg-[#240d12] border border-[#e11d48]/40 flex items-center justify-center mb-5 fire-glow">
                <Flame className="w-10 h-10 text-amber-400 fill-amber-400 animate-flame-subtle" />
              </div>
              <h4 className="font-serif-brand text-2xl font-bold text-white mb-2">
                YOUR ORDER IS EMPTY
              </h4>
              <p className="text-sm text-zinc-400 max-w-xs mb-6 leading-relaxed">
                “Discover our gastronomic experience and start building your FUEGO order.”
              </p>
              <button
                id="cart-explore-menu-btn"
                onClick={() => {
                  onClose();
                  onExploreMenu();
                }}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#c22026] to-[#e11d48] text-white font-bold text-sm tracking-wider shadow-lg fire-glow flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <span>EXPLORE MENU</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Product list (Section 15) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                  Selected Dishes & Drinks
                </span>

                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-4 rounded-2xl bg-[#170e12] border border-[#2b1419] flex gap-3.5 justify-between transition-all"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/5"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-bold text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                          title="Remove from order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-xs text-amber-200 font-bold block mt-0.5">
                        {formatCOP(item.itemSubtotal)}
                      </span>

                      {/* Customizations list */}
                      {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                        <div className="mt-1.5 space-y-0.5">
                          {item.selectedCustomizations.map((c) => (
                            <span
                              key={c.id}
                              className="text-[10px] text-zinc-400 block truncate"
                            >
                              + {c.name} {c.price > 0 ? `(${formatCOP(c.price)})` : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Removed ingredients */}
                      {item.removedIngredients && item.removedIngredients.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.removedIngredients.map((r, rIdx) => (
                            <span key={rIdx} className="text-[10px] text-red-300 block">
                              • No {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.kitchenNotes && (
                        <span className="text-[10px] text-amber-300/80 block mt-1 italic">
                          Note: {item.kitchenNotes}
                        </span>
                      )}

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <span className="text-[11px] text-zinc-400">
                          Unit: {formatCOP(item.product.price)}
                        </span>
                        <div className="flex items-center bg-[#10090c] rounded-lg border border-[#30161d] p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Type Selector (Section 21) */}
              <div className="p-4 rounded-2xl bg-[#160e12] border border-[#2d141b] space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block">
                  Order Type
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-3 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      orderType === 'delivery'
                        ? 'bg-[#2b0f16] border-[#e11d48] text-white shadow-md'
                        : 'bg-[#10080b] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#e11d48]" />
                    <span>DELIVERY</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`p-3 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      orderType === 'dine_in'
                        ? 'bg-[#2b0f16] border-[#e11d48] text-white shadow-md'
                        : 'bg-[#10080b] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>DINE-IN (TABLE)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`p-3 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      orderType === 'takeaway'
                        ? 'bg-[#2b0f16] border-[#e11d48] text-white shadow-md'
                        : 'bg-[#10080b] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-rose-400" />
                    <span>TAKEAWAY</span>
                  </button>
                </div>

                {config.enableCurbside && (
                  <button
                    type="button"
                    onClick={() => setOrderType('curbside')}
                    className={`w-full p-2.5 rounded-xl text-center border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      orderType === 'curbside'
                        ? 'bg-[#2b0f16] border-[#e11d48] text-white shadow-md'
                        : 'bg-[#10080b] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Car className="w-4 h-4 text-amber-300" />
                    <span>CURBSIDE PICKUP</span>
                  </button>
                )}
              </div>

              {/* Customer Information Fields (Section 22) */}
              <div className="p-4 rounded-2xl bg-[#160e12] border border-[#2d141b] space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 block">
                  Customer Information
                </span>

                {orderType === 'dine_in' && (
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Table Number *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.tableNumber || ''}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })
                      }
                      placeholder="E.g., Table #12 or FUEGO Terrace"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#10090c] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#e11d48]"
                    />
                  </div>
                )}

                {(orderType === 'takeaway' || orderType === 'delivery' || orderType === 'curbside') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.fullName}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                        }
                        placeholder="Your first and last name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#10090c] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                        Mobile Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        placeholder="E.g., 311 279 4447"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#10090c] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                        Delivery Address in Ibagué *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address || ''}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, address: e.target.value })
                        }
                        placeholder="E.g., Calle 60 # 7-12, Apt 402"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#10090c] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                          Neighborhood / Sector *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.neighborhood || ''}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, neighborhood: e.target.value })
                          }
                          placeholder="E.g., Mirolindo, Cádiz, Prados, Macarena..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#10090c] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#e11d48]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                          Reference Point / Landmark
                        </label>
                        <input
                          type="text"
                          value={customerInfo.locationReference || ''}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              locationReference: e.target.value,
                            })
                          }
                          placeholder="Opposite the park, building entrance..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#10090c] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#e11d48]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Kitchen Instructions (Section 23) */}
              <div className="p-4 rounded-2xl bg-[#160e12] border border-[#2d141b] space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-300 block">
                  SPECIAL KITCHEN INSTRUCTIONS
                </label>
                <input
                  type="text"
                  value={specialKitchenNotes}
                  onChange={(e) => setSpecialKitchenNotes(e.target.value)}
                  placeholder="Example: No onions, sauce on the side, less salt…"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10090c] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              {/* Payment Methods (Section 24 & 25) */}
              <div className="p-4 rounded-2xl bg-[#160e12] border border-[#2d141b] space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block">
                  Payment Method
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-[#2b0f16] border-[#e11d48] text-white shadow-md'
                        : 'bg-[#10080b] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>CASH</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-[#2b0f16] border-[#e11d48] text-white shadow-md'
                        : 'bg-[#10080b] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>BANK TRANSFER</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#2b0f16] border-[#e11d48] text-white shadow-md'
                        : 'bg-[#10080b] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-rose-400" />
                    <span>CARD TERMINAL</span>
                  </button>
                </div>

                {/* Cash payment specific inputs & automatic change calculator (Section 25) */}
                {paymentMethod === 'cash' && (
                  <div className="p-3.5 rounded-xl bg-[#10080b] border border-[#3b151e] space-y-2 mt-2">
                    <label className="text-xs font-bold text-amber-200 block">
                      “How much cash will you pay with?”
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-zinc-500 font-bold">$</span>
                      <input
                        type="number"
                        value={cashAmountInput}
                        onChange={(e) => setCashAmountInput(e.target.value)}
                        placeholder={`${finalTotal}`}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#1a0f14] border border-zinc-700 text-white font-bold text-sm focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-zinc-400">Total to Pay:</span>
                      <span className="text-white font-bold">{formatCOP(finalTotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-1 border-t border-zinc-800 font-bold">
                      <span className="text-emerald-300">CHANGE DUE:</span>
                      <span
                        className={`${
                          cashNumber >= finalTotal ? 'text-emerald-400' : 'text-zinc-500'
                        }`}
                      >
                        {formatCOP(changeDue)}
                      </span>
                    </div>

                    {cashNumber > 0 && cashNumber < finalTotal && (
                      <span className="text-[11px] text-rose-400 block font-medium">
                        ⚠️ The cash amount must be equal to or greater than the order total.
                      </span>
                    )}
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-3 rounded-xl bg-[#10080b] border border-zinc-800 text-xs text-zinc-300 space-y-1">
                    <span className="font-bold text-amber-200 block">
                      Immediate Bank Transfer Details:
                    </span>
                    <p>• Bancolombia Savings: <strong>[ACCOUNT SHARED VIA WHATSAPP]</strong></p>
                    <p>• Nequi / Daviplata: <strong>{config.phone}</strong></p>
                    <p className="text-[10px] text-zinc-400 italic">
                      Please send payment confirmation screenshot directly to our WhatsApp chat.
                    </p>
                  </div>
                )}
              </div>

              {/* Validation error banner (Section 22 & 43) */}
              {validationError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Real-Time Price Calculator Breakdown & Action Bar (Section 15 & 16) */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-[#0d070a] border-t border-[#2e1218] space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-semibold text-white">{formatCOP(subtotal)}</span>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between">
                  <span>EXTRAS</span>
                  <span className="font-semibold text-amber-300">+{formatCOP(extrasTotal)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>DISCOUNT {appliedPromoCode ? `(${appliedPromoCode})` : ''}</span>
                  <span className="font-semibold">-{formatCOP(discountAmount)}</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>DELIVERY FEE</span>
                  <span className="font-semibold text-white">{formatCOP(deliveryFee)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-base font-extrabold text-white">
                <span className="text-amber-300 font-serif-brand tracking-wider">TOTAL</span>
                <span className="text-amber-300 text-lg sm:text-xl font-bold">
                  {formatCOP(finalTotal)}
                </span>
              </div>
            </div>

            <button
              id="cart-review-order-btn"
              onClick={handleValidateAndProceed}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#c22026] to-[#e11d48] hover:from-[#991b1b] hover:to-[#be123c] text-white font-bold text-sm tracking-wider shadow-2xl fire-glow flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>REVIEW AND CONFIRM ORDER</span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
