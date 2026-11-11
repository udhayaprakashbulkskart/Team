'use client';

import { useState } from 'react';
import { teamApi } from '@/lib/team/client';
import { btnPrimary, card, inputBase, Notice } from './ui';
import { useT } from './i18n';

export function ChangePassword() {
  const { t } = useT();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (next !== confirm) return setError(t('pw.mismatch'));
    setBusy(true);
    try {
      await teamApi('/api/team/auth/password', { body: { currentPassword: current, newPassword: next } });
      setDone(true);
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('pw.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={`${card} max-w-lg space-y-4 p-6`}>
      <h2 className="text-lg font-bold">{t('pw.title')}</h2>
      <p className="text-sm text-tp-muted">{t('pw.note')}</p>
      {error && <Notice>{error}</Notice>}
      {done && <Notice tone="success">{t('pw.done')}</Notice>}
      <input className={inputBase} type="password" placeholder={t('pw.current')} autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
      <input className={inputBase} type="password" placeholder={t('pw.new')} autoComplete="new-password" minLength={10} required value={next} onChange={(e) => setNext(e.target.value)} />
      <input className={inputBase} type="password" placeholder={t('pw.confirm')} autoComplete="new-password" minLength={10} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy ? t('pw.saving') : t('pw.submit')}
      </button>
    </form>
  );
}
