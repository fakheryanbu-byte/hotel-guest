import { Globe, RotateCcw } from 'lucide-react';
import type { Language } from '../types/guest';
import type { TranslationKeys } from '../i18n/ar';

interface HeaderBarProps {
  lang: Language;
  t: TranslationKeys;
  onToggleLanguage: () => void;
  onClearAll: () => void;
  hasSessionData: boolean;
}

export function HeaderBar({
  t,
  onToggleLanguage,
  onClearAll,
  hasSessionData,
}: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#2C2C2C]/10 bg-[#FAF7F2]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-tight text-[#2C2C2C] sm:text-lg">
            {t.appTitle}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {hasSessionData && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#8C5338] transition-colors hover:bg-[#E8A588]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C58B6D] whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.clearMyData}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#2C2C2C]/15 bg-[#F4EFEA] px-3.5 py-2 text-xs font-semibold text-[#2C2C2C] transition-colors hover:bg-[#E8A588]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C58B6D] whitespace-nowrap shrink-0"
            aria-label="العربية | English"
          >
            <Globe className="h-3.5 w-3.5 text-[#8C5338]" aria-hidden="true" />
            <span>العربية | English</span>
          </button>
        </div>
      </div>
    </header>
  );
}
