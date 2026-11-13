import { AlertCircle, Building2, CheckCircle2 } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '../config/hotels';
import type { TranslationKeys } from '../i18n/ar';
import type { HotelBranch, HotelBranchId, Language } from '../types/guest';

interface HotelSelectorProps {
  hotels: HotelBranch[];
  selectedHotelId: HotelBranchId | null;
  onSelectHotel: (id: HotelBranchId) => void;
  lang: Language;
  t: TranslationKeys;
}

export function HotelSelector({
  hotels,
  selectedHotelId,
  onSelectHotel,
  lang,
  t,
}: HotelSelectorProps) {
  const selectedHotel = hotels.find((h) => h.id === selectedHotelId) ?? null;
  const isSelectedUnconfigured =
    selectedHotel !== null && !sanitizeWhatsAppNumber(selectedHotel.whatsappNumber);

  return (
    <section
      aria-labelledby="hotel-section-title"
      className="rounded-2xl border border-[#2C2C2C]/10 bg-[#FAF7F2] p-4 shadow-[var(--shadow-card)] sm:rounded-3xl sm:p-6"
    >
      <div className="mb-4">
        <h2
          id="hotel-section-title"
          className="text-lg font-bold text-[#2C2C2C] sm:text-xl"
        >
          {t.sectionHotelTitle}
        </h2>
        <p className="mt-1 text-sm text-[#685F58]">{t.sectionHotelDesc}</p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => {
          const isSelected = hotel.id === selectedHotelId;
          const isConfigured = Boolean(sanitizeWhatsAppNumber(hotel.whatsappNumber));
          const primaryName = lang === 'ar' ? hotel.nameAr : hotel.nameEn;
          const secondaryName = lang === 'ar' ? hotel.nameEn : hotel.nameAr;

          return (
            <button
              key={hotel.id}
              type="button"
              onClick={() => onSelectHotel(hotel.id)}
              aria-pressed={isSelected}
              className={`flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C58B6D] active:scale-[0.99] ${
                isSelected
                  ? 'border-[#C58B6D] bg-[#E8A588]/25 shadow-sm'
                  : 'border-[#2C2C2C]/10 bg-[#F4EFEA]/60 hover:border-[#C58B6D]/60 hover:bg-[#F4EFEA]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Building2
                    className={`h-4 w-4 shrink-0 ${
                      isSelected ? 'text-[#8C5338]' : 'text-[#685F58]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm font-bold text-[#2C2C2C]">
                    {primaryName}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#685F58]">
                  <span className="truncate">{secondaryName}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`shrink-0 font-medium ${
                      isConfigured ? 'text-[#2E6B47]' : 'text-[#8C5338]'
                    }`}
                  >
                    {isConfigured ? t.branchReady : t.branchNotConfigured}
                  </span>
                </div>
              </div>

              {isSelected && (
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-[#8C5338]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {isSelectedUnconfigured && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#C58B6D]/50 bg-[#E8A588]/15 p-3.5 text-sm text-[#2C2C2C]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#8C5338]" aria-hidden="true" />
          <p className="m-0 font-medium">{t.branchNotConfiguredBanner}</p>
        </div>
      )}
    </section>
  );
}
