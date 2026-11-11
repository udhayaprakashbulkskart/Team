import { requireTeamPage } from '@/lib/team/session';
import { getLang } from '@/lib/i18n/server';
import { LangProvider } from '@/components/team/i18n';
import { PortalBottomNav, PortalMobileHeader, PortalSidebar } from '@/components/team/nav';

export const dynamic = 'force-dynamic';

/** Every portal page requires a signed-in, active team member. Sidebar on desktop; header and bottom bar on phones. */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireTeamPage();
  const lang = getLang();
  return (
    <LangProvider lang={lang}>
      <div className="flex min-h-dvh bg-tp-canvas text-tp-ink">
        <PortalSidebar name={actor.fullName} isAdmin={actor.isAdmin} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalMobileHeader name={actor.fullName} />
          <main className="flex-1 px-4 pb-28 pt-5 md:px-8 md:pt-8 lg:pb-10">{children}</main>
        </div>
        <PortalBottomNav isAdmin={actor.isAdmin} />
      </div>
    </LangProvider>
  );
}
