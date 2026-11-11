import { cookies } from 'next/headers';
import { LANG_COOKIE, parseLang } from './index';
import type { Lang } from './messages';

/** The language the visitor picked (cookie), defaulting to English. */
export function getLang(): Lang {
  return parseLang(cookies().get(LANG_COOKIE)?.value);
}
