'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LANG_COOKIE, localeOf, makeT, type T } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/messages';

type Ctx = { lang: Lang; t: T; locale: string };
const LangContext = createContext<Ctx | null>(null);

/** Provides the language chosen on the server (from the cookie) to every client component below it. */
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const value = useMemo<Ctx>(() => ({ lang, t: makeT(lang), locale: localeOf(lang) }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useT(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useT must be used inside LangProvider');
  return ctx;
}

/** EN / 中文 switch. Saves the choice in a cookie, then refreshes server-rendered pages. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  function choose(next: Lang) {
    if (next === lang || busy) return;
    setBusy(true);
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
    setTimeout(() => setBusy(false), 400);
  }

  return (
    <div className={`inline-flex rounded-lg border border-tp-line bg-white p-0.5 text-xs font-semibold ${className}`} role="group" aria-label={t('common.language')}>
      {(['en', 'zh'] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => choose(code)}
          aria-pressed={lang === code}
          className={`rounded-md px-2.5 py-1 transition ${lang === code ? 'bg-tp-purple text-white' : 'text-tp-muted hover:text-tp-ink'}`}
        >
          {code === 'en' ? 'EN' : '中文'}
        </button>
      ))}
    </div>
  );
}
