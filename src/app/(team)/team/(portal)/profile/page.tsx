import type { Metadata } from 'next';
import { requireTeamPage } from '@/lib/team/session';
import { getMemberCard } from '@/lib/team/members';
import { getLang } from '@/lib/i18n/server';
import { makeT } from '@/lib/i18n';
import { Avatar, card, KycBadge } from '@/components/team/ui';
import { ChangePassword } from '@/components/team/change-password';
import { SignOutButton } from '@/components/team/nav';

export const metadata: Metadata = { title: 'My profile' };
export const dynamic = 'force-dynamic';

export default async function MyProfilePage() {
  const actor = await requireTeamPage();
  const t = makeT(getLang());
  const me = await getMemberCard(actor.id);
  if (!me) return null;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t('me.title')}</h1>
        <p className="mt-1 text-sm text-tp-muted">{t('me.subtitle')}</p>
      </header>
      <section className={`${card} flex flex-col gap-5 p-6 sm:flex-row sm:items-center`}>
        <Avatar name={me.fullName} initials={me.initials} photoUrl={me.photoUrl} size="xl" seed={me.id} />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xl font-bold">{me.fullName}</p>
          <p className="text-sm text-tp-muted">
            {me.jobTitle ?? t('role.default')} · {t(`role.${me.role}`)}
          </p>
          <p className="text-sm font-medium" dir="ltr">
            {me.phone}
          </p>
          <KycBadge status={me.kycStatus} label={t(`kyc.${me.kycStatus}`)} />
        </div>
      </section>
      <ChangePassword />
      <div className="sm:hidden">
        <SignOutButton className="w-full rounded-xl border border-tp-line bg-white px-4 py-3 text-sm font-semibold text-tp-ink transition hover:border-tp-purple/40 hover:text-tp-purple disabled:opacity-60" />
      </div>
    </div>
  );
}
