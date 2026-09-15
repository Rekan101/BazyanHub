import "server-only";

// lib/data/notifications.server.ts

import type { AppNotification } from "@/lib/data/notifications";
import { fetchNotifications } from "@/lib/supabase/queries";

/*
|--------------------------------------------------------------------------
| Notification lookup seam (server only)
|--------------------------------------------------------------------------
|
| Deliberately differs from the other seams in one way: there is no mock
| array to fall back to. An empty result is returned as an empty array, and
| NotificationPanel renders its built-in i18n welcome item in that case - so
| the panel looks identical to how it did before the database existed,
| without pretending a fake row came from Postgres.
|
| Both "no answer" (null) and "answered, nothing there" ([]) therefore
| collapse to [] here. The distinction still matters upstream, which is why
| fetchNotifications keeps it.
|
| Language note: rows carry title_ckb/ar/en, but this runs on the server
| where the user's chosen language is not known - it lives in localStorage
| and is applied by LanguageProvider on the client. Kurdish is requested
| here, matching the app's default; per-language notification text needs the
| panel to re-fetch client-side, which is a deliberate follow-up.
|
*/

export async function getNotifications(): Promise<
  AppNotification[]
> {
  const rows = await fetchNotifications("ckb");

  if (!rows) {
    return [];
  }

  return rows;
}
