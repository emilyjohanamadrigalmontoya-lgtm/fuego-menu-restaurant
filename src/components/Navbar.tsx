import React, { useState } from 'react';
import { Flame, ShoppingBag, Menu as MenuIcon, X, Phone, MapPin, Sparkles, Tag, UtensilsCrossed } from 'lucide-react';
import { formatCOP } from '../utils/formatters';
import { RestaurantConfig } from '../types';

interface NavbarProps {
  config: RestaurantConfig;
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  cartItemCount,
  cartTotal,
  onOpenCart,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Flame },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'combos', label: 'Combos', icon: Sparkles },
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'my-order', label: 'My Order', icon: ShoppingBag, action: onOpenCart },
    { id: 'information', label: 'Information', icon: MapPin },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.action) {
      item.action();
    } else {
      onNavigate(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        id="fuego-navbar"
        className="sticky top-0 z-40 w-full bg-[#0d090b]/90 backdrop-blur-md border-b border-[#2d1217]/80 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#e11d48] to-[#9f1239] flex items-center justify-center fire-glow-sm group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-6 h-6 text-amber-200 fill-amber-300 animate-flame-subtle" />
              <div className="absolute inset-0 rounded-lg border border-amber-300/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-brand text-2xl font-bold tracking-wider text-white group-hover:text-amber-200 transition-colors">
                  FUEGO
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] px-2 py-0.5 rounded bg-[#381119] text-amber-300/90 border border-amber-500/20">
                  Gastrobar
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#e11d48]" />
                Ibagué, Tolima
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-[#280c12] border border-[#e11d48]/40 shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#f43f5e]' : 'text-zinc-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Cart Button */}
          <div className="flex items-center gap-3">
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2a0e14] to-[#1c0a0e] hover:from-[#3a141d] hover:to-[#280e14] border border-[#e11d48]/40 hover:border-[#e11d48]/80 text-white transition-all duration-200 fire-glow-sm group"
              aria-label="Open shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#e11d48] text-white text-[11px] font-bold flex items-center justify-center shadow-lg border border-[#0d090b]">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider">
                  My Order
                </span>
                <span className="text-xs font-bold text-amber-100">
                  {cartTotal > 0 ? formatCOP(cartTotal) : '$0 COP'}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="md:hidden bg-[#100b0e] border-b border-[#2d1217] px-4 pt-3 pb-5 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-[#2b0c13] text-white border border-[#e11d48]/40'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#f43f5e]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'my-order' && cartItemCount > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#e11d48] text-white font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-3 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
              Direct WhatsApp: <span className="text-amber-300 font-semibold">{config.whatsAppNumber}</span>
            </div>
          </div>
        )}
      </header>

      {/* Persistent Floating Cart Button on Mobile screens */}
      {cartItemCount > 0 && (
        <div className="md:hidden fixed bottom-5 left-4 right-4 z-40">
          <button
            id="mobile-floating-cart-bar"
            onClick={onOpenCart}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#9f1239] via-[#c22026] to-[#e11d48] text-white font-semibold shadow-2xl fire-glow flex items-center justify-between border border-amber-300/30 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center font-bold text-amber-200 text-sm">
                {cartItemCount}
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider block text-white/80">View My Order</span>
                <span className="text-sm font-bold text-white">{formatCOP(cartTotal)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider bg-black/20 px-3 py-1.5 rounded-xl text-amber-200">
              <ShoppingBag className="w-4 h-4" />
              <span>PROCEED</span>
            </div>
          </button>
        </div>
      )}
    </>
  );
};
