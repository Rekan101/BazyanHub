import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function createSupabaseServerClient() {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabasePublishableKey = getEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );

  return createClient<Database>(
    supabaseUrl,
    supabasePublishableKey
  );
} 