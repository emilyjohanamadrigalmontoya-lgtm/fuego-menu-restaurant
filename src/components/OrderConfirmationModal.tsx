import React, { useState } from 'react';
import {
  CheckCircle2,
  Send,
  Copy,
  Check,
  Flame,
  Clock,
  MapPin,
  Utensils,
  Share2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ConfirmedOrder, OrderStatus, RestaurantConfig } from '../types';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatCOP,
  getOrderTypeLabel,
  getPaymentMethodLabel,
} from '../utils/formatters';

interface OrderConfirmationModalProps {
  order: ConfirmedOrder | null;
  config: RestaurantConfig;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  config,
  isOpen,
  onClose,
  onNewOrder,
}) => {
  if (!isOpen || !order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [copied, setCopied] = useState(false);

  const whatsAppMessage = buildWhatsAppMessage(order, config);
  const whatsAppUrl = buildWhatsAppUrl(config.whatsAppDigits, whatsAppMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Status timeline steps (Section 29)
  const isDineIn = order.orderType === 'dine_in';
  const steps: OrderStatus[] = isDineIn
    ? ['ORDER RECEIVED', 'PREPARING', 'READY']
    : ['ORDER RECEIVED', 'PREPARING', 'READY', 'OUT FOR DELIVERY', 'DELIVERED'];

  const currentStepIndex = steps.indexOf(currentStatus);

  return (
    <div
      id="order-confirmation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in zoom-in-95 duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#120b0e] border border-[#3b151e] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Confirmed Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2a0e14] via-[#1c0a0e] to-[#120b0e] border-b border-[#3b151e] text-center relative overflow-hidden fire-glow">
          <div className="w-16 h-16 rounded-2xl bg-[#3d121b] border border-amber-400/40 flex items-center justify-center mx-auto mb-4 fire-glow-sm">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#f43f5e] block mb-1">
            FUEGO GASTROBAR • IBAGUÉ
          </span>

          <h2 className="font-serif-brand text-3xl sm:text-4xl font-extrabold text-white tracking-wide mb-2">
            ORDER CONFIRMED
          </h2>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-amber-400/40 text-amber-300 font-mono font-bold text-sm tracking-widest shadow-md">
            <span>{order.orderNumber}</span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mt-3 leading-relaxed">
            Your order has been successfully generated. Send it with one click to FUEGO's official WhatsApp to start immediate preparation on our woodfire grill.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* PRIMARY CORE ACTION: SEND ORDER VIA WHATSAPP (Section 28) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1b3320] via-[#142318] to-[#0f1712] border border-emerald-500/50 shadow-xl space-y-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Send className="w-4 h-4" />
                  Essential Step
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  Send Order to FUEGO WhatsApp
                </h4>
                <p className="text-xs text-zinc-300">
                  Official number: <strong className="text-emerald-300">{config.whatsAppNumber}</strong>
                </p>
              </div>

              <a
                id="send-order-via-whatsapp-btn"
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>SEND ORDER VIA WHATSAPP</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-xs">
              <span className="text-zinc-400 text-[11px]">
                The message includes all products, address, change calculation, and kitchen notes.
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          {/* ORDER STATUS TIMELINE (Section 29) */}
          <div className="p-5 rounded-2xl bg-[#170e13] border border-[#2d141b] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Order Status Timeline
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  Interactive local tracking simulator
                </span>
              </div>
              <span className="text-xs font-bold text-white bg-[#301118] px-2.5 py-1 rounded-lg border border-[#e11d48]/40">
                {currentStatus}
              </span>
            </div>

            {/* Stepper track */}
            <div className="relative pt-2 pb-2">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <button
                      key={step}
                      onClick={() => setCurrentStatus(step)}
                      className={`p-2 rounded-xl text-[10px] font-bold tracking-wider transition-all flex flex-col items-center gap-1 ${
                        isCurrent
                          ? 'bg-[#e11d48] text-white shadow-lg fire-glow-sm'
                          : isCompleted
                          ? 'bg-[#2b1016] text-amber-200 border border-amber-500/40'
                          : 'bg-[#10080a] text-zinc-600 border border-zinc-800'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] bg-black/40">
                        {idx + 1}
                      </span>
                      <span className="truncate max-w-full">{step}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Preparation & Delivery Times */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-[#11080b] border border-white/5">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">
                  Preparation Time
                </span>
                <span className="text-sm font-bold text-amber-200">
                  ~ {order.estimatedTimeMin} to {order.estimatedTimeMin + 10} minutes
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#11080b] border border-white/5">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">
                  {order.orderType === 'delivery' ? 'Estimated Delivery Time' : 'Table Service'}
                </span>
                <span className="text-sm font-bold text-white">
                  {order.orderType === 'delivery'
                    ? `~ ${order.estimatedTimeMin + 20} min (Ibagué)`
                    : 'Served hot to your table'}
                </span>
              </div>
            </div>
          </div>

          {/* Complete Order Summary (Section 27) */}
          <div className="p-5 rounded-2xl bg-[#160d11] border border-zinc-800/80 space-y-3 text-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
              Order Summary
            </span>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-zinc-300">
                  <div>
                    <span className="text-white font-semibold">
                      {item.product.name} × {item.quantity}
                    </span>
                    {item.selectedCustomizations.length > 0 && (
                      <span className="text-[10px] text-zinc-400 block">
                        + {item.selectedCustomizations.map((c) => c.name).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-amber-200">{formatCOP(item.itemSubtotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-800 space-y-1 text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCOP(order.subtotal)}</span>
              </div>
              {order.extrasTotal > 0 && (
                <div className="flex justify-between">
                  <span>Extras:</span>
                  <span>+{formatCOP(order.extrasTotal)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-{formatCOP(order.discount)}</span>
                </div>
              )}
              {order.orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{formatCOP(order.deliveryFee)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                <span className="text-amber-300">TOTAL:</span>
                <span className="text-amber-300 text-base">{formatCOP(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-between text-zinc-400">
              <span>Payment Method:</span>
              <span className="text-white font-semibold">
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#140c0f] border-t border-[#2e1319] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-bold hover:bg-white/5 transition-colors"
          >
            Close Window
          </button>

          <button
            onClick={onNewOrder}
            className="px-6 py-2.5 rounded-xl bg-[#2b0f16] border border-[#e11d48]/50 text-amber-200 text-xs font-bold hover:bg-[#3d141e] transition-colors"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );
};
