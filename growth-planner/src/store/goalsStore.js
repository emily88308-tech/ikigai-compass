import { create } from "zustand";
import * as db from "../lib/db";
import { uid, today } from "../lib/utils";

const logFail = (e) => console.error("Supabase write failed", e);

// Domain state: goals, resolutions, reviews. Every mutation updates local state
// optimistically and then persists to Supabase (logging, not throwing, on failure).
export const useGoalsStore = create((set, get) => ({
  goals: [],
  resolutions: [],
  reviews: [],
  userId: null,

  reset: () => set({ goals: [], resolutions: [], reviews: [], userId: null }),

  load: async (userId) => {
    set({ userId });
    try {
      const d = await db.fetchAll(userId);
      if (get().userId !== userId) return; // user changed mid-fetch — drop stale data
      set({ goals: d.goals, resolutions: d.resolutions, reviews: d.reviews });
    } catch (e) {
      console.error("Load failed", e);
    }
  },

  addGoal: (fields) => {
    const goal = { id: uid(), status: "active", reflections: [], createdAt: Date.now(), ...fields };
    set((s) => ({ goals: [...s.goals, goal] }));
    db.saveGoal(get().userId, goal).catch(logFail);
  },

  updateGoal: (goal) => {
    set((s) => ({ goals: s.goals.map((g) => (g.id === goal.id ? goal : g)) }));
    db.saveGoal(get().userId, goal).catch(logFail);
  },

  deleteGoal: (id) => {
    set((s) => ({
      goals: s.goals.filter((g) => g.id !== id),
      resolutions: s.resolutions.filter((r) => r.goalId !== id),
    }));
    db.removeGoal(id).catch(logFail);
  },

  addResolution: (fields) => {
    const res = { id: uid(), done: false, createdAt: Date.now(), ...fields };
    set((s) => ({ resolutions: [...s.resolutions, res] }));
    db.saveResolution(get().userId, res).catch(logFail);
  },

  toggleResolution: (id) => {
    const cur = get().resolutions.find((r) => r.id === id);
    if (!cur) return;
    const next = { ...cur, done: !cur.done };
    set((s) => ({ resolutions: s.resolutions.map((r) => (r.id === id ? next : r)) }));
    db.saveResolution(get().userId, next).catch(logFail);
  },

  deleteResolution: (id) => {
    set((s) => ({ resolutions: s.resolutions.filter((r) => r.id !== id) }));
    db.removeResolution(id).catch(logFail);
  },

  saveReview: (fields) => {
    const review = { id: uid(), createdAt: Date.now(), date: today(), ...fields };
    set((s) => ({ reviews: [...s.reviews, review] }));
    db.saveReview(get().userId, review).catch(logFail);
  },
}));
