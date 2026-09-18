import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Clock,
  Flame,
  Sparkles,
  AlertTriangle,
  Info,
  Check,
  Ban,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { MenuItem, CustomizationOption, CartItem } from '../types';
import { formatCOP } from '../utils/formatters';

interface ProductDetailModalProps {
  item: MenuItem | null;
  allItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedCustomizations: CustomizationOption[],
    removedIngredients: string[],
    notes: string
  ) => void;
  onOpenPairing: (pairingItem: MenuItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  allItems,
  isOpen,
  onClose,
  onAddToCart,
  onOpenPairing,
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<CustomizationOption[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [showCustomizationTab, setShowCustomizationTab] = useState(false);

  // Initialize or reset default customizations when item changes
  const basePrice = item.price;

  // Real-time price calculation for this product
  const extrasTotal = useMemo(() => {
    return selectedCustomizations.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedCustomizations]);

  const unitPrice = basePrice + extrasTotal;
  const totalPrice = unitPrice * quantity;

  // Toggle customization extra option
  const toggleCustomization = (option: CustomizationOption, isSingleChoice = false) => {
    setSelectedCustomizations((prev) => {
      const exists = prev.some((o) => o.id === option.id);
      if (exists) {
        return prev.filter((o) => o.id !== option.id);
      } else {
        if (isSingleChoice) {
          // If options belong to same group, we replace
          return [...prev.filter((o) => o.category !== option.category), option];
        }
        return [...prev, option];
      }
    });
  };

  // Toggle ingredient removal
  const toggleRemovedIngredient = (ing: string) => {
    setRemovedIngredients((prev) => {
      if (prev.includes(ing)) {
        return prev.filter((i) => i !== ing);
      } else {
        return [...prev, ing];
      }
    });
  };

  const handleAddOrder = () => {
    if (!item.available) return;
    onAddToCart(item, quantity, selectedCustomizations, removedIngredients, kitchenNotes);
    onClose();
  };

  // Find paired item if exists
  const pairedItem = useMemo(() => {
    if (item.pairingIds && item.pairingIds.length > 0) {
      return allItems.find((i) => i.id === item.pairingIds![0]);
    }
    return null;
  }, [item, allItems]);

  const isSoldOut = !item.available;

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#120b0e] border border-[#2e1217] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header Close Button */}
        <button
          id="close-product-detail-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-[#381119] text-white flex items-center justify-center border border-white/10 transition-colors"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-0 flex-1">
          {/* Top Large Image Banner */}
          <div className="relative h-64 sm:h-80 w-full bg-black">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120b0e] via-transparent to-black/30" />

            {/* Badges on banner */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {item.badges &&
                item.badges.map((badge) => (
                  <span
                    key={badge}
                    className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-md bg-[#2d0f15]/90 text-amber-200 border border-amber-400/40 backdrop-blur-sm"
                  >
                    {badge}
                  </span>
                ))}
              {isSoldOut && (
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-md bg-red-950 text-red-200 border border-red-500/50">
                  SOLD OUT
                </span>
              )}
            </div>

            {/* Price overlay on image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-zinc-400 block tracking-wider">
                  {item.category.replace('-', ' ')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-white tracking-wide">
                  {item.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-bold text-amber-300 block">
                  {formatCOP(unitPrice)}
                </span>
                {extrasTotal > 0 && (
                  <span className="text-[11px] text-zinc-400">
                    Base: {formatCOP(basePrice)} + Extras: {formatCOP(extrasTotal)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Quick specifications row */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-1.5 bg-[#1a0e13] px-3 py-1.5 rounded-lg border border-[#35151c]">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Time: {item.prepTimeMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1a0e13] px-3 py-1.5 rounded-lg border border-[#35151c]">
                <Flame className="w-4 h-4 text-[#e11d48]" />
                <span>Portion: {item.portion}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1a0e13] px-3 py-1.5 rounded-lg border border-[#35151c]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Status: {item.available ? 'Available' : 'Sold Out'}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Culinary Description
              </h4>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
                {item.fullDescription}
              </p>
            </div>

            {/* Ingredients List */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Ingredients & Woodfire Notes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-zinc-300 bg-[#1c1115] px-3 py-1.5 rounded-lg border border-white/5"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergen Information (Section 14) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Allergen Information
              </h4>
              {item.allergens && item.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-950/40 text-amber-200 border border-amber-500/30"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  No common allergens declared in standard preparation.
                </p>
              )}
            </div>

            {/* Nutritional Information (Section 13) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-rose-400" />
                Nutritional Information (per serving)
              </h4>
              {item.nutrition ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#1a0f13] border border-[#2d1419] text-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Calories</span>
                    <span className="text-base font-bold text-white">{item.nutrition.calories} kcal</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1a0f13] border border-[#2d1419] text-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Protein</span>
                    <span className="text-base font-bold text-emerald-300">{item.nutrition.protein}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1a0f13] border border-[#2d1419] text-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Carbohydrates</span>
                    <span className="text-base font-bold text-amber-300">{item.nutrition.carbs}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1a0f13] border border-[#2d1419] text-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Fats</span>
                    <span className="text-base font-bold text-rose-300">{item.nutrition.fat}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#170e11] border border-zinc-800 text-xs text-zinc-400 italic">
                  Nutritional information not available.
                </div>
              )}
            </div>

            {/* Customization Options (Section 11) */}
            {item.customizationGroups && item.customizationGroups.length > 0 && (
              <div className="pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Customization & Add-ons
                  </h4>
                  <span className="text-[11px] text-zinc-400">Live price update</span>
                </div>

                <div className="space-y-4">
                  {item.customizationGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <span className="text-xs font-semibold text-zinc-300 block">
                        {group.groupName}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.options.map((opt) => {
                          const isSelected = selectedCustomizations.some((o) => o.id === opt.id);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleCustomization(opt)}
                              className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-[#291016] border-[#e11d48] text-white shadow-md'
                                  : 'bg-[#180f13] border-[#291319] text-zinc-300 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                    isSelected
                                      ? 'bg-[#e11d48] border-[#e11d48] text-white'
                                      : 'border-zinc-600'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                                <span className="text-xs font-medium">{opt.name}</span>
                              </div>
                              <span
                                className={`text-xs font-bold ${
                                  opt.price > 0 ? 'text-amber-300' : 'text-zinc-400'
                                }`}
                              >
                                {opt.price > 0 ? `+${formatCOP(opt.price)}` : 'Included — $0 COP'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredient Removal (Section 12) */}
            {item.removableIngredients && item.removableIngredients.length > 0 && (
              <div className="pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rose-300 flex items-center gap-1.5">
                    <Ban className="w-4 h-4 text-rose-400" />
                    Ingredient Removal
                  </h4>
                  <span className="text-[11px] text-zinc-400">Customize your recipe</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.removableIngredients.map((ing, idx) => {
                    const isRemoved = removedIngredients.includes(ing);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleRemovedIngredient(ing)}
                        className={`p-2.5 rounded-xl text-left border flex items-center justify-between text-xs transition-all ${
                          isRemoved
                            ? 'bg-red-950/40 border-red-500/60 text-red-200'
                            : 'bg-[#180f13] border-[#291319] text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Ban
                            className={`w-3.5 h-3.5 ${isRemoved ? 'text-red-400' : 'text-zinc-500'}`}
                          />
                          <span>No {ing}</span>
                        </span>
                        <span className="text-[10px] font-bold">
                          {isRemoved ? 'EXCLUDED' : 'REMOVE'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kitchen Special Instructions (Section 23) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Special Kitchen Instructions
              </h4>
              <input
                type="text"
                value={kitchenNotes}
                onChange={(e) => setKitchenNotes(e.target.value)}
                placeholder="E.g., Sauce on the side, light salt, specific doneness..."
                className="w-full px-4 py-3 rounded-xl bg-[#160e12] border border-[#2d1419] text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            {/* Intelligent Food & Beverage Pairing System (Section 19) */}
            {pairedItem && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#260f15] via-[#1d0d12] to-[#120b0e] border border-[#e11d48]/40 fire-glow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-flame-subtle" />
                    <span>🔥 PERFECT PAIRING — RECOMMENDED SOMMELIER PAIRING</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">Sommelier Suggestion</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  {item.pairingReason ||
                    `This dish pairs majestically with ${pairedItem.name}, balancing rich flavors and delicate smokiness.`}
                </p>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-3">
                    <img
                      src={pairedItem.image}
                      alt={pairedItem.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{pairedItem.name}</span>
                      <span className="text-xs text-amber-300 font-bold">
                        {formatCOP(pairedItem.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenPairing(pairedItem)}
                      className="px-3 py-1.5 rounded-lg bg-[#3d131b] hover:bg-[#521924] text-amber-200 text-xs font-semibold border border-amber-500/30 transition-colors"
                    >
                      CUSTOMIZE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(pairedItem, 1, [], [], '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#c22026] to-[#e11d48] hover:from-[#9f1239] hover:to-[#be123c] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-[#0d080a] border-t border-[#2d1217] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity selector (− QUANTITY +) */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center bg-[#1e1015] rounded-xl border border-[#3b151e] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isSoldOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isSoldOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full sm:w-auto flex-1 flex items-center justify-end gap-3">
            <button
              id="modal-add-to-order-btn"
              type="button"
              onClick={handleAddOrder}
              disabled={isSoldOut}
              className={`w-full sm:w-auto flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider shadow-xl transition-all duration-200 ${
                isSoldOut
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#b91c1c] via-[#c22026] to-[#e11d48] hover:from-[#991b1b] hover:to-[#be123c] text-white active:scale-98 fire-glow'
              }`}
            >
              <Plus className="w-4 h-4 text-amber-200" />
              <span>ADD TO ORDER • {formatCOP(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
