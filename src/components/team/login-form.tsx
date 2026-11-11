'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { teamApi } from '@/lib/team/client';
import { btnPrimary, inputBase, Notice } from './ui';
import { useT } from './i18n';

export function LoginForm() {
  const { t } = useT();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await teamApi('/api/team/auth/login', { body: { name, phone, password } });
      router.replace('/team');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('login.failed'));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Notice>{error}</Notice>}
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-tp-ink">{t('login.fullName')}</span>
        <input className={inputBase} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder={t('login.fullNamePlaceholder')} required />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-tp-ink">{t('login.phone')}</span>
        <input className={inputBase} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="username" placeholder="+91 98765 43210" required />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-tp-ink">{t('login.password')}</span>
        <input className={inputBase} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      </label>
      <button type="submit" disabled={busy} className={`${btnPrimary} w-full py-3`}>
        {busy ? t('login.submitting') : t('login.submit')}
      </button>
      <p className="text-center text-xs text-tp-muted">{t('login.note')}</p>
    </form>
  );
}
