import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  Navigation,
  Instagram,
  Facebook,
  Flame,
  Edit3,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { RestaurantConfig } from '../types';
import { formatCOP } from '../utils/formatters';

interface RestaurantInfoSectionProps {
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
}

export const RestaurantInfoSection: React.FC<RestaurantInfoSectionProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<RestaurantConfig>(config);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(editForm);
    setIsEditing(false);
  };

  return (
    <section id="information" className="py-16 sm:py-24 bg-[#0a0708] border-b border-[#240d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#240c11] border border-[#e11d48]/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#f43f5e]" />
              <span>Location & Brand Culture</span>
            </div>
            <h2 className="font-serif-brand text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
              {config.name}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
              {config.location} • A culinary experience where open fire takes center stage.
            </p>
          </div>

          <button
            onClick={() => {
              setEditForm(config);
              setIsEditing(!isEditing);
            }}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#1c0d12] hover:bg-[#2e131b] border border-[#e11d48]/40 text-amber-200 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Gastrobar Details'}</span>
          </button>
        </div>

        {/* Live Editing Drawer/Form if toggled */}
        {isEditing && (
          <form
            onSubmit={handleSave}
            className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#140c0f] border border-[#e11d48]/50 shadow-2xl space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                FUEGO Editable Configuration Panel
              </span>
              <span className="text-xs text-zinc-400">
                (Changes take effect immediately on menu & WhatsApp)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Opening Hours</label>
                <input
                  type="text"
                  value={editForm.openingHours}
                  onChange={(e) => setEditForm({ ...editForm, openingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value, whatsAppNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Delivery Fee (COP)</label>
                <input
                  type="number"
                  value={editForm.deliveryFee}
                  onChange={(e) => setEditForm({ ...editForm, deliveryFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Instagram URL</label>
                <input
                  type="url"
                  value={editForm.instagramUrl}
                  onChange={(e) => setEditForm({ ...editForm, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold text-xs">
                Restaurant Description
              </label>
              <textarea
                value={editForm.brandStatement}
                onChange={(e) => setEditForm({ ...editForm, brandStatement: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Info Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card: Address */}
          <div className="p-6 rounded-3xl bg-[#120b0e] border border-[#271015] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#290d13] border border-[#e11d48]/40 flex items-center justify-center text-[#f43f5e] mb-4 fire-glow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Address
              </h3>
              <p className="text-base font-semibold text-white leading-relaxed mb-2">
                {config.address}
              </p>
              <span className="text-xs text-amber-300 font-medium">{config.location}</span>
            </div>

            {/* GET DIRECTIONS Button (Section 31) */}
            <div className="pt-4 mt-4 border-t border-zinc-800/80">
              <a
                id="get-directions-btn"
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#260f15] hover:bg-[#38141d] border border-[#e11d48]/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#f43f5e]" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>
          </div>

          {/* Card: Hours */}
          <div className="p-6 rounded-3xl bg-[#120b0e] border border-[#271015] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#290d13] border border-[#e11d48]/40 flex items-center justify-center text-amber-400 mb-4 fire-glow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Opening Hours
              </h3>
              <p className="text-base font-semibold text-white leading-relaxed mb-2">
                {config.openingHours}
              </p>
              <span className="text-xs text-zinc-400">Lunch, dinner, and gastrobar service</span>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800/80 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Kitchen & Bar Active</span>
            </div>
          </div>

          {/* Card: Direct WhatsApp & Phone */}
          <div className="p-6 rounded-3xl bg-[#120b0e] border border-[#271015] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#290d13] border border-[#e11d48]/40 flex items-center justify-center text-emerald-400 mb-4 fire-glow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Reservations & Orders
              </h3>
              <p className="text-base font-bold text-white tracking-wide mb-1">
                {config.whatsAppNumber}
              </p>
              <span className="text-xs text-zinc-400">{config.email}</span>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80">
              <a
                href={`https://wa.me/${config.whatsAppDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>CONTACT VIA WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Card: Social Media & Delivery (Section 32) */}
          <div className="p-6 rounded-3xl bg-[#120b0e] border border-[#271015] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#290d13] border border-[#e11d48]/40 flex items-center justify-center text-rose-400 mb-4 fire-glow-sm">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Social & Coverage
              </h3>
              <p className="text-xs text-zinc-300 mb-3">
                Standard delivery fee:{' '}
                <strong className="text-amber-200">{formatCOP(config.deliveryFee)}</strong>
              </p>
              <span className="text-xs text-zinc-400">
                Coverage throughout the Ibagué metropolitan area.
              </span>
            </div>

            {/* Social Media Buttons (Section 32) */}
            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center gap-2">
              <a
                id="social-instagram-btn"
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#1f0d14] hover:bg-[#33141f] border border-[#e11d48]/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                aria-label="Instagram Fuego Gastrobar"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>

              <a
                id="social-facebook-btn"
                href={config.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#14121f] hover:bg-[#1f1a33] border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                aria-label="Facebook Fuego Gastrobar"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact / Footer Brand Banner */}
        <div id="contact" className="text-center pt-8 border-t border-[#240d12]">
          <div className="inline-flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-flame-subtle" />
            <span className="font-serif-brand font-bold text-lg text-white tracking-widest">
              FUEGO GASTROBAR
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-rose-300/80 mb-2">
            WHERE EVERY BITE IGNITES AN EXPERIENCE.
          </p>
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} FUEGO Gastrobar. Ibagué, Tolima, Colombia. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};
