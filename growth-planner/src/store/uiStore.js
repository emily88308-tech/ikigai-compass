import { create } from "zustand";

// Navigation + modal state. Kept separate from domain data so components can
// open modals / switch pages without prop-drilling through the tree.
export const useUiStore = create((set) => ({
  page: "active", // "active" | "cat:<key>" | "someday" | "achieved" | "monthly" | "weekly" | "review" | "coach"
  addGoalOpen: false,
  addResCtx: null, // { goalId, type } | null

  setPage: (page) => set({ page }),
  openAddGoal: () => set({ addGoalOpen: true }),
  closeAddGoal: () => set({ addGoalOpen: false }),
  openAddRes: (goalId, type) => set({ addResCtx: { goalId, type } }),
  closeAddRes: () => set({ addResCtx: null }),
}));
