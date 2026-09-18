import React from 'react';
import { X, ArrowLeft, CheckCircle, Flame, MapPin, Phone, User, Utensils, Banknote, ShieldCheck } from 'lucide-react';
import { CartItem, CustomerInfo, OrderType, PaymentMethod } from '../types';
import { formatCOP, getOrderTypeLabel, getPaymentMethodLabel } from '../utils/formatters';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditOrder: () => void;
  onConfirmOrder: () => void;
  cartItems: CartItem[];
  orderType: OrderType;
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  cashGiven?: number;
  subtotal: number;
  extrasTotal: number;
  discount: number;
  appliedPromoCode: string | null;
  deliveryFee: number;
  finalTotal: number;
  specialKitchenNotes: string;
}

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  onEditOrder,
  onConfirmOrder,
  cartItems,
  orderType,
  customerInfo,
  paymentMethod,
  cashGiven,
  subtotal,
  extrasTotal,
  discount,
  appliedPromoCode,
  deliveryFee,
  finalTotal,
  specialKitchenNotes,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="order-review-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#120b0e] border border-[#2e1218] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#160d11] border-b border-[#2d1319] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onEditOrder}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
              title="Back to edit"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#f43f5e] block">
                FINAL REVIEW
              </span>
              <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-white tracking-wide">
                MY ORDER
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
            aria-label="Close review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Review Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* Order Type & Customer Details Summary */}
          <div className="p-4 rounded-2xl bg-[#170e13] border border-[#2c1319] space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Service Details
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#331118] text-rose-300 border border-[#e11d48]/30">
                {getOrderTypeLabel(orderType)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300 pt-1">
              {customerInfo.fullName && (
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Customer: <strong className="text-white">{customerInfo.fullName}</strong></span>
                </div>
              )}
              {customerInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Phone: <strong className="text-white">{customerInfo.phone}</strong></span>
                </div>
              )}
              {orderType === 'dine_in' && (
                <div className="flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>Table: <strong className="text-amber-300">#{customerInfo.tableNumber}</strong></span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Address: <strong className="text-white">{customerInfo.address}</strong></span>
                  </div>
                  <div className="text-[11px] text-zinc-400 pl-5">
                    Neighborhood: {customerInfo.neighborhood} {customerInfo.locationReference ? `(${customerInfo.locationReference})` : ''}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Products List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Products & Customizations ({cartItems.length})
            </h4>

            <div className="space-y-2.5">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#160d11] border border-zinc-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <span className="font-bold text-white text-sm block">
                      {idx + 1}. {item.product.name} × {item.quantity}
                    </span>

                    {/* Customizations */}
                    {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                      <div className="mt-1 space-y-0.5 text-zinc-400">
                        {item.selectedCustomizations.map((c) => (
                          <div key={c.id}>
                            + {c.name} {c.price > 0 ? `(+${formatCOP(c.price)})` : '(Included)'}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Removals */}
                    {item.removedIngredients && item.removedIngredients.length > 0 && (
                      <div className="mt-0.5 space-y-0.5 text-rose-300">
                        {item.removedIngredients.map((r, rIdx) => (
                          <div key={rIdx}>• No {r}</div>
                        ))}
                      </div>
                    )}

                    {item.kitchenNotes && (
                      <div className="text-[10px] text-amber-300 mt-1">
                        Note: {item.kitchenNotes}
                      </div>
                    )}
                  </div>

                  <span className="font-bold text-amber-200 text-sm shrink-0">
                    {formatCOP(item.itemSubtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kitchen Special Instructions */}
          {specialKitchenNotes && (
            <div className="p-3.5 rounded-xl bg-[#160d11] border border-zinc-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Special Kitchen Instructions
              </span>
              <p className="text-zinc-200 italic">“{specialKitchenNotes}”</p>
            </div>
          )}

          {/* Payment Details */}
          <div className="p-4 rounded-2xl bg-[#170e13] border border-[#2c1319] space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Selected Payment Method:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-400" />
                {getPaymentMethodLabel(paymentMethod)}
              </span>
            </div>

            {paymentMethod === 'cash' && cashGiven && (
              <div className="flex justify-between items-center pt-1 border-t border-zinc-800 text-zinc-300">
                <span>Cash tendered:</span>
                <span className="font-semibold text-white">{formatCOP(cashGiven)}</span>
              </div>
            )}
            {paymentMethod === 'cash' && cashGiven && cashGiven > finalTotal && (
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Change due:</span>
                <span>{formatCOP(cashGiven - finalTotal)}</span>
              </div>
            )}
          </div>

          {/* Financial Breakdown (Section 16) */}
          <div className="p-4 rounded-2xl bg-[#0e0709] border border-[#2d1217] space-y-2 text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>SUBTOTAL</span>
              <span className="font-semibold">{formatCOP(subtotal)}</span>
            </div>
            {extrasTotal > 0 && (
              <div className="flex justify-between text-zinc-300">
                <span>EXTRAS</span>
                <span className="font-semibold text-amber-300">+{formatCOP(extrasTotal)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>DISCOUNT {appliedPromoCode ? `(${appliedPromoCode})` : ''}</span>
                <span className="font-semibold">-{formatCOP(discount)}</span>
              </div>
            )}
            {orderType === 'delivery' && (
              <div className="flex justify-between text-zinc-300">
                <span>DELIVERY FEE</span>
                <span className="font-semibold">{formatCOP(deliveryFee)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-zinc-800 flex justify-between text-base font-extrabold text-white">
              <span className="text-amber-300 font-serif-brand">FINAL TOTAL</span>
              <span className="text-amber-300 text-xl font-bold">{formatCOP(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions (EDIT ORDER & CONFIRM ORDER) */}
        <div className="p-4 sm:p-6 bg-[#160d11] border-t border-[#2d1319] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="edit-order-btn"
            type="button"
            onClick={onEditOrder}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-[#1c0f14] text-zinc-200 font-bold text-xs sm:text-sm tracking-wider transition-colors text-center"
          >
            EDIT ORDER
          </button>

          <button
            id="confirm-order-btn"
            type="button"
            onClick={onConfirmOrder}
            className="w-full sm:w-auto flex-1 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#c22026] to-[#e11d48] hover:from-[#991b1b] hover:to-[#be123c] text-white font-bold text-sm tracking-wider shadow-2xl fire-glow flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Flame className="w-4 h-4 text-amber-200 fill-amber-200 animate-flame-subtle" />
            <span>CONFIRM ORDER • {formatCOP(finalTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
