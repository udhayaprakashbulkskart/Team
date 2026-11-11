'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { teamApi } from '@/lib/team/client';
import { btnPrimary, card, inputBase, Notice } from './ui';
import { useT } from './i18n';

const EMPTY = { fullName: '', phone: '', password: '', jobTitle: '', role: 'MEMBER' as 'MEMBER' | 'ADMIN' };

export function AdminAddMember() {
  const { t } = useT();
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      await teamApi('/api/team/members', { body: form });
      setDone(t('add.done', { name: form.fullName }));
      setForm(EMPTY);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('add.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={`${card} space-y-5 p-6`}>
      <div>
        <h2 className="text-lg font-bold">{t('add.title')}</h2>
        <p className="text-sm text-tp-muted">{t('add.note')}</p>
      </div>
      {error && <Notice>{error}</Notice>}
      {done && <Notice tone="success">{done}</Notice>}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('add.fullName')}>
          <input className={inputBase} required minLength={2} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </Field>
        <Field label={t('add.phone')}>
          <input className={inputBase} required inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label={t('add.jobTitle')}>
          <input className={inputBase} value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
        </Field>
        <Field label={t('add.password')}>
          <input className={inputBase} type="password" required minLength={10} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <Field label={t('add.role')}>
          <select className={inputBase} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'MEMBER' | 'ADMIN' })}>
            <option value="MEMBER">{t('role.MEMBER')}</option>
            <option value="ADMIN">{t('role.ADMIN')}</option>
          </select>
        </Field>
      </div>
      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy ? t('add.adding') : t('add.submit')}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-tp-muted">{label}</span>
      {children}
    </label>
  );
}
