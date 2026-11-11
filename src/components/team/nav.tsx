'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { teamApi } from '@/lib/team/client';
import { LangSwitch, useT } from './i18n';

type Item = { href: string; key: 'nav.directory' | 'nav.chat' | 'nav.group' | 'nav.admin' | 'nav.profile'; short?: 'nav.groupShort'; icon: React.ReactNode; admin?: boolean; match: (p: string) => boolean };

const I = {
  team: <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
  chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  group: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />,
  admin: <path d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />,
  user: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />,
};

const ITEMS: Item[] = [
  { href: '/team', key: 'nav.directory', icon: I.team, match: (p) => p === '/team' || p.startsWith('/team/members') },
  { href: '/team/chat', key: 'nav.chat', icon: I.chat, match: (p) => p.startsWith('/team/chat') },
  { href: '/team/group', key: 'nav.group', short: 'nav.groupShort', icon: I.group, match: (p) => p.startsWith('/team/group') },
  { href: '/team/admin', key: 'nav.admin', icon: I.admin, admin: true, match: (p) => p.startsWith('/team/admin') },
  { href: '/team/profile', key: 'nav.profile', icon: I.user, match: (p) => p.startsWith('/team/profile') },
];

function Icon({ children, size = 18 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

/** Signs out and returns to the login page. Used in the sidebar, the phone header and the profile page. */
export function SignOutButton({ className }: { className: string }) {
  const { t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    await teamApi('/api/team/auth/logout', { body: {} }).catch(() => undefined);
    router.replace('/team/login');
    router.refresh();
  }
  return (
    <button type="button" onClick={signOut} disabled={busy} className={className}>
      {busy ? t('common.signingOut') : t('common.signOut')}
    </button>
  );
}

export function PortalSidebar({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const pathname = usePathname();
  const { t } = useT();
  const items = ITEMS.filter((i) => !i.admin || isAdmin);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-tp-navy px-4 py-6 text-white lg:flex">
      <Link href="/team" className="mb-10 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tp-purple text-sm font-extrabold shadow-[0_10px_24px_-8px_rgba(109,77,242,0.9)]">TP</span>
        <span className="text-base font-bold tracking-tight">{t('nav.portalName')}</span>
      </Link>
      <nav className="flex flex-col gap-1" aria-label={t('nav.label')}>
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                active ? 'bg-tp-purple text-white shadow-[0_10px_24px_-12px_rgba(109,77,242,1)]' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon>{item.icon}</Icon>
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3">
        <div className="rounded-2xl bg-tp-navy2 p-4">
          <p className="mb-2 text-xs text-white/60">{t('common.language')}</p>
          <LangSwitch className="w-full justify-center" />
        </div>
        <div className="rounded-2xl bg-tp-navy2 p-4">
          <p className="text-xs text-white/60">{t('nav.signedInAs')}</p>
          <p className="truncate text-sm font-semibold">{name}</p>
          <SignOutButton className="mt-3 w-full rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10 disabled:opacity-60" />
        </div>
      </div>
    </aside>
  );
}

/** Phone and tablet top bar: brand, language switch and a sign-out button, always visible. */
export function PortalMobileHeader({ name }: { name: string }) {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-tp-line bg-white/95 px-3 py-2.5 backdrop-blur lg:hidden">
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tp-purple text-xs font-extrabold text-white">TP</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold leading-tight">{t('nav.portalName')}</span>
          <span className="block truncate text-[11px] text-tp-muted">{name}</span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <LangSwitch />
        <SignOutButton className="rounded-lg border border-tp-line bg-white px-3 py-1.5 text-xs font-semibold text-tp-ink transition hover:border-tp-purple/40 hover:text-tp-purple disabled:opacity-60" />
      </span>
    </header>
  );
}

/** Compact bottom navigation for phones and tablets. */
export function PortalBottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const { t } = useT();
  const items = ITEMS.filter((i) => !i.admin || isAdmin);
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-tp-line bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg justify-around">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold ${active ? 'text-tp-purple' : 'text-tp-muted'}`}
              >
                <span className={`flex h-8 w-12 items-center justify-center rounded-full ${active ? 'bg-tp-lilac' : ''}`}>
                  <Icon size={20}>{item.icon}</Icon>
                </span>
                {t(item.short ?? item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
