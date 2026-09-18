import React, { useState } from 'react';
import { Sparkles, Flame, Plus, Check, ArrowRight } from 'lucide-react';
import { ComboItem, MenuItem } from '../types';
import { COMBOS } from '../data/restaurantData';
import { formatCOP } from '../utils/formatters';

interface CombosSectionProps {
  allItems: MenuItem[];
  onAddComboToOrder: (
    combo: ComboItem,
    selectedItems: MenuItem[]
  ) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({
  allItems,
  onAddComboToOrder,
}) => {
  const [activeComboId, setActiveComboId] = useState<string>(COMBOS[0].id);
  // Track selected item IDs for each slot of each combo
  const [selectedSlots, setSelectedSlots] = useState<{ [slotIndex: number]: string }>({
    0: 'burger-1',
    1: 'side-1',
    2: 'lemonade-1',
  });

  const currentCombo = COMBOS.find((c) => c.id === activeComboId) || COMBOS[0];

  const handleSelectSlotItem = (slotIdx: number, itemId: string) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slotIdx]: itemId,
    }));
  };

  const handleAddCombo = () => {
    const selectedItemsList: MenuItem[] = [];
    currentCombo.categoryOptions.forEach((slot, idx) => {
      const chosenId = selectedSlots[idx];
      const found = allItems.find((i) => i.id === chosenId);
      if (found) selectedItemsList.push(found);
    });

    onAddComboToOrder(currentCombo, selectedItemsList);
  };

  return (
    <section id="combos" className="py-16 sm:py-24 bg-[#0d080a] border-b border-[#240d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#240c11] border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Experiences</span>
          </div>
          <h2 className="font-serif-brand text-3xl sm:text-5xl font-extrabold text-white tracking-wide mb-3">
            FUEGO COMBOS & EXPERIENCES
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Multi-course pairings harmoniously curated by our culinary team at special pricing.
          </p>
        </div>

        {/* Combo Selector Tabs */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-10">
          {COMBOS.map((combo) => {
            const isActive = combo.id === activeComboId;
            return (
              <button
                key={combo.id}
                id={`combo-tab-${combo.id}`}
                onClick={() => {
                  setActiveComboId(combo.id);
                  if (combo.id === 'combo-fuego') {
                    setSelectedSlots({ 0: 'burger-1', 1: 'side-1', 2: 'lemonade-1' });
                  } else {
                    setSelectedSlots({ 0: 'starter-1', 1: 'meat-1', 2: 'cocktail-1', 3: 'dessert-1' });
                  }
                }}
                className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#9f1239] via-[#c22026] to-[#e11d48] text-white shadow-xl fire-glow-sm border border-amber-300/40'
                    : 'bg-[#150e11] text-zinc-400 hover:text-white border border-[#2b1218]'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>{combo.name}</span>
                <span className="text-[11px] opacity-80">({combo.tagline})</span>
              </button>
            );
          })}
        </div>

        {/* Active Combo Builder Card */}
        <div className="rounded-3xl bg-[#140c0f] border border-[#2e1319] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between pb-8 border-b border-zinc-800">
            <div className="flex-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#f43f5e] block mb-1">
                {currentCombo.tagline}
              </span>
              <h3 className="font-serif-brand text-3xl sm:text-4xl font-bold text-white mb-3">
                {currentCombo.name}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">
                {currentCombo.description}
              </p>
            </div>

            <div className="bg-[#1c0d12] border border-[#3b151e] p-5 rounded-2xl text-left lg:text-right shrink-0 w-full lg:w-auto">
              <span className="text-xs uppercase tracking-wider text-zinc-400 block font-medium">
                Special Combo Price
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {formatCOP(currentCombo.price)}
                </span>
                <span className="text-sm line-through text-zinc-500 font-medium">
                  {formatCOP(currentCombo.originalPrice)}
                </span>
              </div>
              <span className="inline-block mt-2 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                You save {formatCOP(currentCombo.originalPrice - currentCombo.price)}
              </span>
            </div>
          </div>

          {/* Slots Selection Interface */}
          <div className="py-8 space-y-8">
            <h4 className="text-sm uppercase font-bold tracking-widest text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Customize each course of your experience:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCombo.categoryOptions.map((slot, slotIdx) => {
                const allowedItems = allItems.filter(
                  (i) =>
                    (!slot.allowedItemIds || slot.allowedItemIds.includes(i.id)) &&
                    i.available
                );

                const currentSelectedId = selectedSlots[slotIdx] || allowedItems[0]?.id;

                return (
                  <div
                    key={slotIdx}
                    className="p-5 rounded-2xl bg-[#1a0e13] border border-[#33141b] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          {slot.slotName}
                        </span>
                        <span className="text-[10px] text-zinc-400">Course {slotIdx + 1}</span>
                      </div>

                      <div className="space-y-2.5">
                        {allowedItems.map((item) => {
                          const isSelected = currentSelectedId === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectSlotItem(slotIdx, item.id)}
                              className={`w-full p-2.5 rounded-xl text-left border flex items-center gap-3 transition-all ${
                                isSelected
                                  ? 'bg-[#2f1118] border-[#e11d48] text-white shadow-md'
                                  : 'bg-[#120b0d] border-[#221115] text-zinc-300 hover:border-zinc-700'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold block truncate">{item.name}</span>
                                <span className="text-[10px] text-zinc-400 block truncate">
                                  {item.shortDescription}
                                </span>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                                  isSelected
                                    ? 'bg-[#e11d48] border-[#e11d48] text-white'
                                    : 'border-zinc-600'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combo Add to Order CTA */}
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-400">
              ✓ Includes all selected courses with FUEGO's signature gourmet presentation.
            </div>

            <button
              id="add-combo-to-cart-btn"
              onClick={handleAddCombo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#c22026] to-[#e11d48] hover:from-[#991b1b] hover:to-[#be123c] text-white font-bold text-sm tracking-wider shadow-2xl fire-glow flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4 text-amber-200" />
              <span>ADD {currentCombo.name} • {formatCOP(currentCombo.price)}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
