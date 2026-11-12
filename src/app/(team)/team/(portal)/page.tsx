import type { Metadata } from 'next';
import { requireTeamPage } from '@/lib/team/session';
import { listMembers } from '@/lib/team/members';
import { getLang } from '@/lib/i18n/server';
import { makeT } from '@/lib/i18n';
import { Directory } from '@/components/team/directory';
import { Notice } from '@/components/team/ui';

export const metadata: Metadata = { title: { absolute: 'Team directory · Team Portal' }, robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DirectoryPage({ searchParams }: { searchParams: { error?: string } }) {
  const actor = await requireTeamPage();
  const t = makeT(getLang());
  const members = await listMembers(actor);

  return (
    <div className="mx-auto max-w-6xl">
      <section className="min-w-0">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t('dir.title')}</h1>
          <p className="mt-1 text-sm text-tp-muted">{t('dir.subtitle')}</p>
        </header>
        {searchParams.error === 'admin-only' && (
          <div className="mb-5">
            <Notice>{t('dir.adminOnly')}</Notice>
          </div>
        )}
        <Directory members={members} meId={actor.id} />
      </section>
    </div>
  );
}
