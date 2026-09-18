import React, { useState } from 'react';
import { Tag, Sparkles, Gift, Check, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { PROMOTIONS_DATA } from '../data/restaurantData';

interface PromotionsSectionProps {
  onApplyPromoCode: (code: string) => { success: boolean; message: string };
  appliedPromo: string | null;
  onExploreMenu: () => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  onApplyPromoCode,
  appliedPromo,
  onExploreMenu,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApply = (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setFeedback({ text: 'Please enter a promotional code.', isError: true });
      return;
    }

    const res = onApplyPromoCode(code);
    setFeedback({
      text: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setInputCode(code);
    }
  };

  return (
    <section id="promotions" className="py-16 sm:py-24 bg-[#0b0809] border-b border-[#240d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#260c11] border border-[#e11d48]/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Tag className="w-3.5 h-3.5 text-[#f43f5e]" />
            <span>Promotions & Special Offers</span>
          </div>
          <h2 className="font-serif-brand text-3xl sm:text-5xl font-extrabold text-white tracking-wide mb-3">
            EXCLUSIVE OFFERS & PERKS
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Take advantage of our discount codes, birthday celebrations, and chef perks.
          </p>
        </div>

        {/* Promo Code Input Box (Section 17) */}
        <div className="max-w-xl mx-auto mb-14 p-6 rounded-3xl bg-[#140c0f] border border-[#33141b] shadow-2xl">
          <label
            htmlFor="promo-code-input"
            className="block text-xs uppercase font-extrabold tracking-wider text-amber-200 mb-2"
          >
            PROMOTIONAL CODE
          </label>

          <div className="flex gap-2 sm:gap-3">
            <input
              id="promo-code-input"
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setFeedback(null);
              }}
              placeholder="Enter promotional code (e.g. FUEGO10)"
              className="flex-1 px-4 py-3 rounded-xl bg-[#1a0e13] border border-[#3d161f] text-white placeholder-zinc-500 text-sm sm:text-base font-semibold tracking-wider focus:outline-none focus:border-[#e11d48]"
            />
            <button
              id="apply-promo-code-btn"
              type="button"
              onClick={() => handleApply()}
              className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-[#c22026] to-[#e11d48] hover:from-[#9f1239] hover:to-[#be123c] text-white font-bold text-xs sm:text-sm tracking-wider shadow-lg active:scale-95 transition-all"
            >
              APPLY
            </button>
          </div>

          {feedback && (
            <div
              className={`mt-3 text-xs font-semibold flex items-center gap-1.5 ${
                feedback.isError ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {feedback.isError ? (
                <span>⚠️ {feedback.text}</span>
              ) : (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {feedback.text}
                </span>
              )}
            </div>
          )}

          {appliedPromo && (
            <div className="mt-2 text-[11px] text-amber-300 font-medium">
              Currently applied code: <strong>{appliedPromo}</strong>
            </div>
          )}
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROMOTIONS_DATA.map((promo) => {
            const isBirthday = promo.isBirthdayDessert;
            return (
              <div
                key={promo.id}
                className={`p-6 sm:p-7 rounded-3xl flex flex-col justify-between border transition-all duration-300 ${
                  isBirthday
                    ? 'bg-gradient-to-br from-[#2b0e15] to-[#16080b] border-amber-500/40 fire-glow-sm'
                    : 'bg-[#120b0e] border-[#291116] hover:border-[#e11d48]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#351017] text-amber-300 border border-amber-500/20">
                      {promo.badge}
                    </span>
                    {isBirthday ? (
                      <Gift className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-[#f43f5e]" />
                    )}
                  </div>

                  <h3 className="font-serif-brand text-xl font-bold text-white mb-2.5">
                    {promo.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    {promo.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block font-semibold">
                      Code
                    </span>
                    <span className="text-sm font-extrabold text-amber-300 tracking-wider">
                      {promo.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleApply(promo.code)}
                    className="px-4 py-2 rounded-xl bg-[#230e14] hover:bg-[#38131d] text-amber-100 text-xs font-bold border border-[#e11d48]/40 transition-colors flex items-center gap-1.5"
                  >
                    <span>APPLY</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
