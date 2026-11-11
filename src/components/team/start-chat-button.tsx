'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { teamApi } from '@/lib/team/client';
import { btnPrimary, Notice } from './ui';
import { useT } from './i18n';

/** Opens (or creates) the private conversation with a member, then opens the chat screen. */
export function StartChatButton({ memberId, className = btnPrimary, label }: { memberId: string; className?: string; label?: string }) {
  const { t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setBusy(true);
    setError(null);
    try {
      const convo = await teamApi<{ id: string }>('/api/team/conversations', { body: { memberId } });
      router.push(`/team/chat/${convo.id}`);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('dir.openChatError'));
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={open} disabled={busy} className={className}>
        {busy ? t('common.opening') : (label ?? t('dir.chat'))}
      </button>
      {error && (
        <div className="mt-2">
          <Notice>{error}</Notice>
        </div>
      )}
    </div>
  );
}
