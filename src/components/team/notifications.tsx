'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { teamApi } from '@/lib/team/client';
import { btnGhost, btnPrimary, card, Notice } from './ui';
import { useT } from './i18n';

type UnreadItem = { key: string; href: string; fromName: string | null; preview: string | null; count: number };
type Summary = {
  total: number;
  private: { key: string; href: string; fromName: string; preview: string | null; unread: number }[];
  group: null | { key: string; href: string; unread: number; latest: { fromName: string; preview: string | null } };
};
type Toast = { id: number; key: string; href: string; title: string; body: string };

const APP_NAME = 'Team Portal';
const ACTIVE_MS = 4000;
const HIDDEN_MS = 10000;

/**
 * Watches for new unread messages and alerts the member: an in-app toast while the portal is open,
 * a device notification when the tab is in the background (if the member allowed notifications),
 * and an unread count in the tab title.
 */
export function NotificationWatcher() {
  const { t } = useT();
  const tRef = useRef(t);
  tRef.current = t;
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let baseline: Map<string, number> | null = null;

    const announce = (item: UnreadItem) => {
      const tt = tRef.current;
      const title = item.fromName ? tt('notif.newFrom', { name: item.fromName }) : tt('notif.groupNew');
      const body = item.preview ?? tt('chat.attachment');
      if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const n = new Notification(title, { body, tag: item.key });
          n.onclick = () => {
            window.focus();
            routerRef.current.push(item.href);
            n.close();
          };
        } catch {
          // Some browsers refuse notifications outside a user gesture; the in-app toast still shows.
        }
      }
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, key: item.key, href: item.href, title, body }]);
      setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 7000);
    };

    const poll = async () => {
      try {
        const data = await teamApi<Summary>('/api/team/unread');
        if (cancelled) return;
        const items: UnreadItem[] = data.private.map((p) => ({ key: p.key, href: p.href, fromName: p.fromName, preview: p.preview, count: p.unread }));
        if (data.group) {
          items.push({
            key: data.group.key,
            href: data.group.href,
            fromName: null,
            preview: data.group.latest.preview,
            count: data.group.unread,
          });
        }
        const counts = new Map(items.map((i) => [i.key, i.count]));
        if (baseline) {
          for (const item of items) {
            const before = baseline.get(item.key) ?? 0;
            // Only new arrivals alert, and not while the reader is already in that chat.
            if (item.count > before && pathRef.current !== item.href) announce(item);
          }
        }
        baseline = counts;
        document.title = data.total > 0 ? `(${data.total}) ${APP_NAME}` : APP_NAME;
      } catch {
        // Offline or signed out: try again on the next tick.
      }
      if (!cancelled) timer = setTimeout(poll, document.hidden ? HIDDEN_MS : ACTIVE_MS);
    };

    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.title = APP_NAME;
    };
  }, []);

  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-3 top-16 z-50 flex flex-col items-stretch gap-2 md:inset-x-auto md:right-6 md:top-6 md:w-96" aria-live="polite">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => setToasts((list) => list.filter((x) => x.id !== toast.id))} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { t } = useT();
  return (
    <div className="pointer-events-auto rounded-2xl border border-tp-line bg-white p-4 shadow-[0_18px_40px_-18px_rgba(40,30,110,0.45)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tp-lilac text-tp-purple" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{toast.title}</p>
          <p className="line-clamp-2 text-sm text-tp-muted">{toast.body}</p>
          <div className="mt-3 flex gap-2">
            <Link href={toast.href} onClick={onDismiss} className="rounded-lg bg-tp-purple px-3 py-1.5 text-xs font-semibold text-white">
              {t('notif.open')}
            </Link>
            <button type="button" onClick={onDismiss} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-tp-muted hover:text-tp-ink">
              {t('notif.dismiss')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Profile card that asks the browser for permission to show device notifications. */
export function NotificationSettings() {
  const { t } = useT();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPermission('Notification' in window ? Notification.permission : 'unsupported');
  }, []);

  async function enable() {
    setBusy(true);
    try {
      setPermission(await Notification.requestPermission());
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={`${card} max-w-lg space-y-3 p-6`}>
      <h2 className="text-lg font-bold">{t('notif.title')}</h2>
      <p className="text-sm text-tp-muted">{t('notif.note')}</p>
      {permission === 'unsupported' && <Notice tone="info">{t('notif.unsupported')}</Notice>}
      {permission === 'granted' && <Notice tone="success">{t('notif.enabled')}</Notice>}
      {permission === 'denied' && <Notice>{t('notif.blocked')}</Notice>}
      {permission === 'default' && (
        <button type="button" onClick={enable} disabled={busy} className={btnPrimary}>
          {t('notif.enable')}
        </button>
      )}
      {permission === 'granted' && <span className={`${btnGhost} cursor-default opacity-70`}>{t('notif.enabled')}</span>}
    </section>
  );
}
