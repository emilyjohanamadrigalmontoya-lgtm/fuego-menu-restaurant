import React from 'react';
import { Clock, Plus, Sliders, Flame, Sparkles, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { formatCOP } from '../utils/formatters';

interface ProductCardProps {
  item: MenuItem;
  onOpenDetails: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onOpenDetails,
  onQuickAdd,
  onCustomize,
}) => {
  const isSoldOut = !item.available;

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "CHEF'S CHOICE":
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400/30';
      case 'POPULAR':
        return 'bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white border-rose-400/30';
      case 'RECOMMENDED':
        return 'bg-[#291016] text-amber-200 border-amber-400/40';
      case 'NEW':
        return 'bg-emerald-950 text-emerald-200 border-emerald-500/30';
      case 'PROMOTION':
        return 'bg-purple-950 text-purple-200 border-purple-400/30';
      default:
        return 'bg-zinc-800 text-zinc-200 border-zinc-700';
    }
  };

  return (
    <div
      id={`product-card-${item.id}`}
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#120c0e] border transition-all duration-300 overflow-hidden ${
        isSoldOut
          ? 'border-zinc-800/80 opacity-60 grayscale-[40%]'
          : 'border-[#281116] hover:border-[#e11d48]/50 hover:shadow-2xl hover:shadow-[#e11d48]/10'
      }`}
    >
      {/* Top Image Section */}
      <div
        className="relative h-52 sm:h-56 w-full overflow-hidden cursor-pointer bg-black"
        onClick={() => onOpenDetails(item)}
      >
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${
            !isSoldOut && 'group-hover:scale-105'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120c0e] via-transparent to-black/40" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {item.badges &&
            item.badges.map((badge) => (
              <span
                key={badge}
                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border shadow-md flex items-center gap-1 ${getBadgeStyle(
                  badge
                )}`}
              >
                {badge === "CHEF'S CHOICE" && <Flame className="w-3 h-3 fill-current" />}
                {badge === 'POPULAR' && <Sparkles className="w-3 h-3" />}
                {badge}
              </span>
            ))}
        </div>

        {/* Sold Out / Availability Tag */}
        {isSoldOut ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-lg bg-zinc-900/90 text-red-400 border border-red-500/40 text-xs uppercase font-extrabold tracking-widest flex items-center gap-1.5 shadow-lg">
              <AlertCircle className="w-3.5 h-3.5" />
              SOLD OUT
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              AVAILABLE
            </span>
          </div>
        )}

        {/* Prep Time & Portion Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[11px]">
            <Clock className="w-3 h-3 text-amber-400" />
            {item.prepTimeMinutes} min
          </span>
          <span className="text-[11px] text-zinc-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            {item.portion}
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onOpenDetails(item)}
              className="text-base sm:text-lg font-bold text-white tracking-wide hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
            >
              {item.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3">
            {item.shortDescription}
          </p>

          {/* Key ingredients preview */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.ingredients.slice(0, 3).map((ing, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-zinc-400 bg-[#1e1317] px-2 py-0.5 rounded border border-white/5"
                >
                  {ing}
                </span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="text-[10px] text-zinc-400 px-1 py-0.5">
                  +{item.ingredients.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-[#241216] flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-medium">Price</span>
            <span className="text-base sm:text-lg font-bold text-amber-200">
              {formatCOP(item.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Customize button */}
            <button
              id={`customize-btn-${item.id}`}
              onClick={() => onCustomize(item)}
              disabled={isSoldOut}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                isSoldOut
                  ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'border-[#3d161e] hover:border-[#e11d48]/70 bg-[#1c0c10] hover:bg-[#2c1017] text-zinc-200'
              }`}
              title="Customize ingredients and add-ons"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">CUSTOMIZE</span>
            </button>

            {/* Quick Add button */}
            <button
              id={`add-to-order-btn-${item.id}`}
              onClick={() => onQuickAdd(item)}
              disabled={isSoldOut}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-md transition-all ${
                isSoldOut
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#c22026] to-[#e11d48] hover:from-[#9f1239] hover:to-[#be123c] text-white active:scale-95 fire-glow-sm'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD TO ORDER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
