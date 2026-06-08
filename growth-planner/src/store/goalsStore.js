import { create } from "zustand";
import * as db from "../lib/db";
import { useUiStore } from "./uiStore";
import { uid, today } from "../lib/utils";

// A failed write means the change lives only in local state and will vanish on
// refresh — so we make it loud (visible banner) instead of swallowing it.
const logFail = (e) => {
  console.error("Supabase write failed", e);
  useUiStore.getState().showToast(
    `Couldn't save your change — it may be lost on refresh. (${e?.message || "unknown error"})`
  );
};

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
      useUiStore.getState().showToast(
        `Couldn't load your goals — ${e?.message || "unknown error"}. Try refreshing.`
      );
    }
  },

  addGoal: (fields) => {
    const goal = { id: uid(), status: "active", kind: "outcome", reflections: [], createdAt: Date.now(), ...fields };
    if (goal.status === "achieved" && !goal.achievedAt) goal.achievedAt = Date.now();
    set((s) => ({ goals: [...s.goals, goal] }));
    db.saveGoal(get().userId, goal).catch(logFail);
  },

  updateGoal: (goal) => {
    // Stamp achievedAt the moment a goal first becomes "achieved", and clear it
    // if it's moved back out — so the Achievements timeline reflects real dates.
    const prev = get().goals.find((g) => g.id === goal.id);
    let next = goal;
    if (goal.status === "achieved" && prev?.status !== "achieved") {
      next = { ...goal, achievedAt: goal.achievedAt || Date.now() };
    } else if (goal.status !== "achieved" && goal.achievedAt) {
      next = { ...goal, achievedAt: null };
    }
    set((s) => ({ goals: s.goals.map((g) => (g.id === next.id ? next : g)) }));
    db.saveGoal(get().userId, next).catch(logFail);
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

  updateResolution: (res) => {
    set((s) => ({ resolutions: s.resolutions.map((r) => (r.id === res.id ? res : r)) }));
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
