import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTeamActor } from '@/lib/team/session';
import { getLang } from '@/lib/i18n/server';
import { makeT } from '@/lib/i18n';
import { LoginForm } from '@/components/team/login-form';
import { LangProvider, LangSwitch } from '@/components/team/i18n';

export const metadata: Metadata = { title: { absolute: 'Team sign in · Team Portal' }, robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function TeamLoginPage() {
  if (await getTeamActor()) redirect('/team');
  const lang = getLang();
  const t = makeT(lang);
  return (
    <LangProvider lang={lang}>
      <main className="flex min-h-dvh items-center justify-center bg-tp-canvas px-4 py-10 text-tp-ink">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tp-purple text-lg font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(109,77,242,0.9)]">TP</span>
              <div>
                <p className="text-lg font-bold leading-tight">{t('nav.portalName')}</p>
                <p className="text-sm text-tp-muted">{t('nav.tagline')}</p>
              </div>
            </div>
            <LangSwitch />
          </div>
          <div className="rounded-3xl border border-tp-line bg-white p-6 shadow-[0_24px_60px_-30px_rgba(40,30,110,0.35)] md:p-8">
            <h1 className="mb-6 text-2xl font-extrabold tracking-tight">{t('login.welcome')}</h1>
            <LoginForm />
          </div>
        </div>
      </main>
    </LangProvider>
  );
}
