import React from 'react';
import { Flame, ArrowRight, Sparkles, Utensils, MapPin, Clock } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeroProps {
  config: RestaurantConfig;
  onViewMenu: () => void;
  onOrderNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onViewMenu, onOrderNow }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0708] border-b border-[#250d12]"
    >
      {/* Background Image with Cinematic Dark Gradient & Fire Glow Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=2000&q=85"
          alt="Gastronomía contemporánea Fuego Gastrobar con cocción al fuego vivo"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-125"
          loading="eager"
        />
        {/* Multilayered radial gradients for dramatic fire embers & vignetting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0809] via-[#0b0809]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0809] via-transparent to-[#0b0809]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e11d48]/15 via-[#9f1239]/10 to-transparent" />
      </div>

      {/* Fire embers decorative particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-60">
        <div className="absolute bottom-10 left-1/4 w-2 h-2 rounded-full bg-amber-400 blur-[1px] animate-pulse" />
        <div className="absolute bottom-20 left-1/2 w-1.5 h-1.5 rounded-full bg-orange-400 blur-[1px] animate-ping" />
        <div className="absolute bottom-32 right-1/3 w-2 h-2 rounded-full bg-rose-500 blur-[1px] animate-pulse" />
        <div className="absolute bottom-16 right-1/4 w-1 h-1 rounded-full bg-yellow-300" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0e14]/90 border border-[#e11d48]/40 backdrop-blur-md mb-6 fire-glow-sm">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-flame-subtle" />
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-200">
            {config.location}
          </span>
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="text-xs sm:text-sm font-medium text-zinc-300">Woodfire Cuisine & Fine Mixology</span>
        </div>

        {/* Brand Name with Cinzel typography */}
        <div className="relative mb-4">
          <h1
            id="hero-title"
            className="font-serif-brand text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-wider text-white drop-shadow-2xl"
          >
            FUEGO
          </h1>
          <span className="block font-serif-brand text-xl sm:text-2xl lg:text-3xl tracking-[0.35em] text-amber-400/90 font-medium mt-1">
            GASTROBAR
          </span>
        </div>

        {/* Restaurant Slogan */}
        <div className="max-w-2xl mx-auto mb-6">
          <p className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-rose-300/90 mb-3">
            {config.slogan}
          </p>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            {config.brandStatement}
          </p>
        </div>

        {/* Quick Highlights info pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-400 mb-10">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <MapPin className="w-4 h-4 text-[#e11d48]" />
            <span>Av. Mirolindo Km 1, Ibagué</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Tue to Sun: 12:00 PM – 11:30 PM</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Direct WhatsApp +57 311 279 4447</span>
          </div>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            id="hero-view-menu-btn"
            onClick={onViewMenu}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#c22026] to-[#e11d48] hover:from-[#991b1b] hover:to-[#be123c] text-white font-bold tracking-wider text-sm sm:text-base shadow-2xl fire-glow transition-all duration-300 border border-amber-300/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Utensils className="w-4 h-4 text-amber-200" />
            <span>VIEW MENU</span>
            <ArrowRight className="w-4 h-4 text-amber-200" />
          </button>

          <button
            id="hero-order-now-btn"
            onClick={onOrderNow}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#1d0d11]/80 hover:bg-[#2b1016] border border-[#e11d48]/50 hover:border-[#e11d48] text-amber-100 font-bold tracking-wider text-sm sm:text-base backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-flame-subtle" />
            <span>ORDER NOW</span>
          </button>
        </div>
      </div>
    </section>
  );
};
