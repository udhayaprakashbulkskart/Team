import { handle, json } from '@/lib/http';
import { getUnreadSummary } from '@/lib/team/chat';
import { requireActor } from '@/lib/team/session';

export const dynamic = 'force-dynamic';

/** Unread messages for the signed-in member, used by the notification watcher. */
export const GET = handle(async () => {
  const actor = await requireActor();
  return json(await getUnreadSummary(actor));
});
