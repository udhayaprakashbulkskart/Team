import { MESSAGES, type Lang, type MessageKey } from './messages';

/** Client-safe i18n helpers. Server-only cookie reading lives in ./server.ts. */
export const LANGS: Lang[] = ['en', 'zh'];
export const DEFAULT_LANG: Lang = 'en';
export const LANG_COOKIE = 'tp_lang';

export function parseLang(value: string | null | undefined): Lang {
  return value === 'zh' ? 'zh' : DEFAULT_LANG;
}

export function localeOf(lang: Lang): string {
  return lang === 'zh' ? 'zh-CN' : 'en-IN';
}

export function makeT(lang: Lang) {
  return (key: MessageKey, vars?: Record<string, string | number>): string => {
    const table = MESSAGES[lang] as Record<string, string>;
    let text = table[key] ?? (MESSAGES.en as Record<string, string>)[key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) text = text.split(`{${name}}`).join(String(value));
    }
    return text;
  };
}

export type T = ReturnType<typeof makeT>;

export function formatTime(iso: string, lang: Lang) {
  return new Date(iso).toLocaleTimeString(localeOf(lang), { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string, lang: Lang, options: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString(localeOf(lang), options);
}

export function formatDay(iso: string, lang: Lang, t: T) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return t('common.today');
  if (d.toDateString() === yesterday.toDateString()) return t('common.yesterday');
  return d.toLocaleDateString(localeOf(lang), { day: 'numeric', month: 'short', year: 'numeric' });
}
