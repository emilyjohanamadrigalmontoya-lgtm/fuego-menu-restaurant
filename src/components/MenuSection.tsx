import React, { useState, useMemo } from 'react';
import { Search, Flame, Sparkles, Filter, X, Utensils, Wine, Star, AlertCircle } from 'lucide-react';
import { MenuItem, MenuCategoryType } from '../types';
import { MENU_CATEGORIES } from '../data/restaurantData';
import { ProductCard } from './ProductCard';

interface MenuSectionProps {
  items: MenuItem[];
  onOpenDetails: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
}

type FilterTag =
  | 'ALL'
  | 'BEST_SELLERS'
  | 'NEW'
  | 'RECOMMENDED'
  | 'CHEF_CHOICE'
  | 'PROMOTIONS'
  | 'VEGETARIAN'
  | 'SPICY'
  | 'FEATURED';

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  onOpenDetails,
  onQuickAdd,
  onCustomize,
}) => {
  const [activeGroup, setActiveGroup] = useState<'all' | 'food' | 'beverages'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<FilterTag>('ALL');

  // Filter categories according to selected group
  const visibleCategories = useMemo(() => {
    if (activeGroup === 'all') return MENU_CATEGORIES;
    return MENU_CATEGORIES.filter((c) => c.group === activeGroup);
  }, [activeGroup]);

  // Main filtered items logic combining search, category, group, and tag
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Group check
      if (activeGroup !== 'all' && item.sectionGroup !== activeGroup) {
        return false;
      }

      // 2. Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Search query check (name, ingredient, description, category)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.shortDescription.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesIngredients = item.ingredients.some((ing) =>
          ing.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesDesc && !matchesCategory && !matchesIngredients) {
          return false;
        }
      }

      // 4. Filter Tags check
      if (activeTag === 'BEST_SELLERS') {
        return item.badges?.includes('POPULAR');
      }
      if (activeTag === 'NEW') {
        return item.badges?.includes('NEW');
      }
      if (activeTag === 'RECOMMENDED') {
        return item.badges?.includes('RECOMMENDED');
      }
      if (activeTag === 'CHEF_CHOICE') {
        return item.badges?.includes("CHEF'S CHOICE");
      }
      if (activeTag === 'PROMOTIONS') {
        return item.badges?.includes('PROMOTION');
      }
      if (activeTag === 'VEGETARIAN') {
        return item.isVegetarian;
      }
      if (activeTag === 'SPICY') {
        return item.isSpicy;
      }
      if (activeTag === 'FEATURED') {
        return item.badges && item.badges.length > 0;
      }

      return true;
    });
  }, [items, activeGroup, selectedCategory, searchQuery, activeTag]);

  // Quick Featured Items for spotlight row
  const chefSpecials = useMemo(() => {
    return items.filter((item) => item.badges?.includes("CHEF'S CHOICE")).slice(0, 3);
  }, [items]);

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#0b0809] border-b border-[#240d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#240c11] border border-[#e11d48]/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>Signature Gastronomic Menu</span>
          </div>
          <h2 className="font-serif-brand text-3xl sm:text-5xl font-extrabold text-white tracking-wide mb-4">
            EXPLORE OUR MENU
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Dishes and cocktails crafted from passion for the grill, dry-aged cuts, fresh seafood, and avant-garde culinary techniques.
          </p>
        </div>

        {/* Search Bar (Section 7) */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
            <input
              id="menu-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks or ingredients…"
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#140d10] border border-[#33141b] text-zinc-100 placeholder-zinc-500 text-sm sm:text-base focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-zinc-400 hover:text-white p-1 rounded-md"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Group Filter Tabs (Food vs Beverages vs All) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
          <button
            id="group-all-btn"
            onClick={() => {
              setActiveGroup('all');
              setSelectedCategory('all');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all flex items-center gap-2 ${
              activeGroup === 'all'
                ? 'bg-gradient-to-r from-[#c22026] to-[#e11d48] text-white shadow-lg fire-glow-sm'
                : 'bg-[#160d10] text-zinc-400 hover:text-white border border-[#2b1218]'
            }`}
          >
            <span>ALL MENU</span>
          </button>
          <button
            id="group-food-btn"
            onClick={() => {
              setActiveGroup('food');
              setSelectedCategory('all');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all flex items-center gap-2 ${
              activeGroup === 'food'
                ? 'bg-gradient-to-r from-[#c22026] to-[#e11d48] text-white shadow-lg fire-glow-sm'
                : 'bg-[#160d10] text-zinc-400 hover:text-white border border-[#2b1218]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>FOOD & KITCHEN</span>
          </button>
          <button
            id="group-beverages-btn"
            onClick={() => {
              setActiveGroup('beverages');
              setSelectedCategory('all');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all flex items-center gap-2 ${
              activeGroup === 'beverages'
                ? 'bg-gradient-to-r from-[#c22026] to-[#e11d48] text-white shadow-lg fire-glow-sm'
                : 'bg-[#160d10] text-zinc-400 hover:text-white border border-[#2b1218]'
            }`}
          >
            <Wine className="w-4 h-4" />
            <span>COCKTAILS & DRINKS</span>
          </button>
        </div>

        {/* Quick Filter Chips (Section 8) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-zinc-500 uppercase pr-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Filters:</span>
          </div>

          {[
            { id: 'ALL', label: 'All' },
            { id: 'BEST_SELLERS', label: '🔥 Best Sellers' },
            { id: 'CHEF_CHOICE', label: "👨‍🍳 Chef's Choice" },
            { id: 'RECOMMENDED', label: '✨ Recommended' },
            { id: 'NEW', label: '🆕 New' },
            { id: 'VEGETARIAN', label: '🌱 Vegetarian' },
            { id: 'SPICY', label: '🌶️ Spicy' },
            { id: 'FEATURED', label: '⭐ Featured' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id as FilterTag)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTag === tag.id
                  ? 'bg-[#3b121b] text-amber-200 border border-[#e11d48]/70 shadow-sm'
                  : 'bg-[#140e11] text-zinc-400 hover:text-zinc-200 border border-[#241217]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Horizontal Category Pill Slider (Section 6) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-zinc-950 shadow-md font-bold'
                : 'bg-[#180e12] text-zinc-300 hover:text-white border border-[#2d1218]'
            }`}
          >
            All Categories
          </button>

          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-[#c22026] text-white shadow-md font-bold'
                    : 'bg-[#180e12] text-zinc-300 hover:text-white border border-[#2d1218]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Spotlight: Chef's Choice Row when no active search/sub-filters */}
        {selectedCategory === 'all' && searchQuery === '' && activeTag === 'ALL' && activeGroup === 'all' && (
          <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#200c11] via-[#160a0d] to-[#0e0709] border border-[#e11d48]/30 fire-glow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#f43f5e] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-current" />
                  SIGNATURE SELECTION
                </span>
                <h3 className="font-serif-brand text-2xl sm:text-3xl font-bold text-white tracking-wide mt-1">
                  CHEF'S SIGNATURE CREATIONS
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                Signature dishes celebrated for live woodfire intensity, Josper techniques, and exceptional flavor pairings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {chefSpecials.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onOpenDetails={onOpenDetails}
                  onQuickAdd={onQuickAdd}
                  onCustomize={onCustomize}
                />
              ))}
            </div>
          </div>
        )}

        {/* Products Grid (Section 9) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>Results</span>
              <span className="text-xs font-normal text-zinc-400">
                ({filteredItems.length} items available)
              </span>
            </h3>

            {(searchQuery || selectedCategory !== 'all' || activeTag !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setActiveTag('ALL');
                  setActiveGroup('all');
                }}
                className="text-xs font-semibold text-[#f43f5e] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#140c0f] border border-[#2b1218] p-8">
              <AlertCircle className="w-12 h-12 text-[#e11d48] mx-auto mb-3 opacity-80" />
              <h4 className="text-lg font-bold text-white mb-1">
                No products are available in this category.
              </h4>
              <p className="text-sm text-zinc-400 max-w-md mx-auto mb-4">
                Try searching for another ingredient or reset active filters to explore more culinary creations.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setActiveTag('ALL');
                }}
                className="px-5 py-2 rounded-xl bg-[#291016] border border-[#e11d48]/50 text-amber-200 text-xs font-bold hover:bg-[#3d1620] transition-colors"
              >
                View all dishes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onOpenDetails={onOpenDetails}
                  onQuickAdd={onQuickAdd}
                  onCustomize={onCustomize}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
