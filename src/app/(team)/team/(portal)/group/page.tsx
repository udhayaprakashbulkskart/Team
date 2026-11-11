import type { Metadata } from 'next';
import Link from 'next/link';
import { requireTeamPage } from '@/lib/team/session';
import { getGroup } from '@/lib/team/chat';
import { getLang } from '@/lib/i18n/server';
import { makeT } from '@/lib/i18n';
import { card, Notice } from '@/components/team/ui';
import { GroupChat } from '@/components/team/group-panel';

export const metadata: Metadata = { title: 'Team Group' };
export const dynamic = 'force-dynamic';

export default async function TeamGroupPage() {
  const actor = await requireTeamPage();
  const t = makeT(getLang());
  const group = await getGroup(actor);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <header className="mb-5">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t('group.title')}</h1>
          <p className="mt-1 text-sm text-tp-muted">{t('group.subtitle')}</p>
        </header>
        {group.isMember ? (
          <div className={`${card} flex h-[calc(100dvh-13rem)] min-h-[420px] flex-col overflow-hidden lg:h-[calc(100dvh-10rem)]`}>
            <GroupChat meId={actor.id} memberCount={group.memberCount} members={group.members} />
          </div>
        ) : (
          <Notice>{t('dir.notInGroup')}</Notice>
        )}
      </div>
      <aside className={`${card} hidden h-fit p-5 lg:block`}>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-tp-muted">{t('group.membersHeading', { count: group.memberCount })}</h2>
        <ul className="space-y-3">
          {group.members.map((m) => (
            <li key={m.id}>
              <Link href={`/team/members/${m.id}`} className="block truncate text-sm font-semibold hover:text-tp-purple">
                {m.fullName}
              </Link>
              <span className="block truncate text-xs text-tp-muted">{m.jobTitle ?? t('role.default')}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
