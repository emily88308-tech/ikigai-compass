import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useGoalsStore } from "./goalsStore";

// Auth/session state. `init()` wires up the Supabase listener and returns an
// unsubscribe fn (call it from an effect cleanup). When the user changes it
// drives the goals store: load their data on sign-in, clear it on sign-out.
export const useAuthStore = create((set) => ({
  user: null,
  authReady: !isSupabaseConfigured, // nothing to wait for when unconfigured

  init: () => {
    if (!isSupabaseConfigured) return () => {};
    const apply = (session) => {
      const u = session?.user ?? null;
      set({ user: u });
      if (u) useGoalsStore.getState().load(u.id);
      else useGoalsStore.getState().reset();
    };
    supabase.auth.getSession().then(({ data }) => {
      apply(data.session);
      set({ authReady: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => apply(session));
    return () => sub.subscription.unsubscribe();
  },

  signOut: () => supabase.auth.signOut(),
}));
