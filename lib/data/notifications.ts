// lib/data/notifications.ts

/*
|--------------------------------------------------------------------------
| Notification types
|--------------------------------------------------------------------------
|
| KEEP THIS MODULE CLIENT-SAFE. It is imported by NotificationPanel and
| NotificationProvider, both client components. Nothing here may reach
| lib/supabase/server.ts or lib/supabase/queries.ts.
|
| Notifications are the one surface fetched in the BROWSER rather than on
| the server — see lib/supabase/queries.client.ts. There is deliberately no
| `notifications.server.ts` counterpart: a server read would call cookies()
| in the root layout and make every route in the app dynamic.
|
| Note there is no mock array here, unlike stories/categories/providers. The
| panel's fallback is not data: it is the built-in welcome item, whose text
| comes from the i18n dictionary (notificationWelcomeTitle / ...Body /
| ...Now) rather than from a row. The panel renders that item whenever this
| list is empty, which is exactly what it displayed before the database
| existed.
|
*/

export type AppNotification = {
  id: string;
  title: string;
  body: string;

  /*
   * lucide-react icon key from notifications.icon. The panel maps a small
   * allow-list of names to components and falls back to Sparkles, matching
   * the welcome item's glyph.
   */
  icon: string | null;

  linkUrl: string | null;
  isRead: boolean;

  /* ISO timestamp. Formatted for display by the panel. */
  createdAt: string;
};

export function countUnread(
  notifications: AppNotification[]
): number {
  return notifications.filter(
    (item) => !item.isRead
  ).length;
}
