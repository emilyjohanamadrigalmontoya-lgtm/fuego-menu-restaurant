import React from 'react';
import { Flame, Sparkles, Plus, ArrowRight, Utensils } from 'lucide-react';
import { MenuItem } from '../types';
import { formatCOP } from '../utils/formatters';

interface DiningExperienceSectionProps {
  allItems: MenuItem[];
  onAddExperience: (items: MenuItem[]) => void;
}

export const DiningExperienceSection: React.FC<DiningExperienceSectionProps> = ({
  allItems,
  onAddExperience,
}) => {
  // Selected 5-course complete dining experience
  const experienceItems = [
    { label: 'Starter', item: allItems.find((i) => i.id === 'starter-1') },
    { label: 'Main Course', item: allItems.find((i) => i.id === 'meat-1') },
    { label: 'Side Dish', item: allItems.find((i) => i.id === 'side-1') },
    { label: 'Beverage', item: allItems.find((i) => i.id === 'cocktail-1') },
    { label: 'Dessert', item: allItems.find((i) => i.id === 'dessert-1') },
  ].filter((entry) => Boolean(entry.item)) as { label: string; item: MenuItem }[];

  const rawTotal = experienceItems.reduce((acc, curr) => acc + curr.item.price, 0);
  const bundledPrice = 185000; // special experience price

  const handleAddAll = () => {
    onAddExperience(experienceItems.map((e) => e.item));
  };

  return (
    <section className="py-16 sm:py-20 bg-[#0a0709] border-b border-[#240d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#280c13] via-[#1a090e] to-[#100609] border border-[#e11d48]/40 shadow-2xl relative overflow-hidden fire-glow">
          {/* Subtle backdrop ember effect */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#e11d48]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
                <Flame className="w-3.5 h-3.5 fill-current text-rose-500" />
                <span>COMPLETE DINING EXPERIENCE</span>
              </div>
              <h3 className="font-serif-brand text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
                5-COURSE SENSORIAL EXPERIENCE
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm mt-1 max-w-2xl">
                “A balanced combination of smoky, fresh, savory, and sweet flavors crafted to ignite every sensory dimension of contemporary gastronomy.”
              </p>
            </div>

            <div className="text-left lg:text-right shrink-0">
              <span className="text-xs uppercase tracking-wider text-zinc-400 block font-semibold">
                Special Experience Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {formatCOP(bundledPrice)}
                </span>
                <span className="text-sm line-through text-zinc-500">
                  {formatCOP(rawTotal)}
                </span>
              </div>
              <button
                onClick={handleAddAll}
                className="mt-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c22026] to-[#e11d48] hover:from-[#9f1239] hover:to-[#be123c] text-white font-bold text-xs tracking-wider shadow-xl fire-glow-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 text-amber-200" />
                <span>ORDER COMPLETE EXPERIENCE</span>
              </button>
            </div>
          </div>

          {/* 5-Course Grid Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative z-10">
            {experienceItems.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-white/5 flex flex-col justify-between hover:border-[#e11d48]/40 transition-colors"
              >
                <div>
                  <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden mb-2.5">
                    <img
                      src={entry.item.image}
                      alt={entry.item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-white/10">
                      {entry.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white block line-clamp-1">
                    {entry.item.name}
                  </span>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                    {entry.item.shortDescription}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">Individual value</span>
                  <span className="text-xs font-bold text-amber-200">
                    {formatCOP(entry.item.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
