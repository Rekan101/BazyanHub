"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import {
  getSupabaseClient,
  isSupabaseConfigured,
  signOut as signOutHelper,
} from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/types";

/*
|--------------------------------------------------------------------------
| Auth context
|--------------------------------------------------------------------------
|
| Entirely client-side, on purpose. Reading the session on the server means
| cookies(), and one cookies() call in the root layout makes EVERY route
| dynamic — which would undo the static rendering built in the previous
| pass. See the `cookies()` rule in CLAUDE.md §8.
|
| The cost of that choice is that the server cannot know who is signed in,
| so the first client paint is an unknown state. `isLoading` exists for
| exactly that window, and consumers render a skeleton rather than guessing
| "signed out" and flashing.
|
| Two things are tracked:
|   * `user`    — from Supabase Auth, the source of truth for "signed in".
|   * `profile` — the public.profiles row, which is where username and
|                 full_name live (Auth itself has neither).
|
*/

interface AuthContextValue {
  user: User | null;
  profile: ProfileRow | null;

  /* True only while the initial session lookup is in flight. */
  isLoading: boolean;

  isAuthenticated: boolean;

  signOut: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<ProfileRow | null>(null);

  /*
   * Seeded from a synchronous, build-time-inlined check rather than
   * defaulting to `true`. With no Supabase credentials there is nothing to
   * wait for, so consumers skip the skeleton entirely and render the
   * signed-out state on the very first paint — no flash.
   *
   * Safe against hydration mismatch: NEXT_PUBLIC_* values are inlined at
   * build time and identical on server and client.
   */
  const [isLoading, setIsLoading] = useState(
    () => isSupabaseConfigured()
  );

  /* ---------------------------------------------------------
     Initial session + live auth state
  --------------------------------------------------------- */

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        setUser(data.session?.user ?? null);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    /*
     * Keeps the UI honest after sign-in, sign-out, token refresh, and the
     * OAuth redirect back from /auth/callback — without this the profile
     * card would only update on a full reload.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) {
          return;
        }

        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  /* ---------------------------------------------------------
     Profile row, keyed to the signed-in user
  --------------------------------------------------------- */

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled || error) {
          return;
        }

        setProfile(data);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  /* ---------------------------------------------------------
     Sign out
  --------------------------------------------------------- */

  const signOut = useCallback(async () => {
    await signOutHelper();

    /*
     * onAuthStateChange fires on sign-out and would clear this anyway, but
     * doing it here too means the UI updates even if the listener has been
     * torn down mid-navigation.
     */
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: user !== null,
      signOut,
    }),
    [user, profile, isLoading, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
