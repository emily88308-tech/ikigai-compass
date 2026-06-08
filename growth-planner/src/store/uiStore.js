import { create } from "zustand";

// Navigation + modal state. Kept separate from domain data so components can
// open modals / switch pages without prop-drilling through the tree.
export const useUiStore = create((set) => ({
  page: "active", // "active" | "cat:<key>" | "someday" | "achieved" | "monthly" | "weekly" | "anytime" | "review" | "coach"
  addGoalOpen: false,
  editGoal: null, // existing goal being edited (reuses AddGoalModal) | null
  addResCtx: null, // { goalId, type, edit? } | null — `edit` holds a resolution being edited
  toast: null, // { type: 'error' | 'info', text } | null — surfaced globally by <Toast/>

  setPage: (page) => set({ page }),
  openAddGoal: () => set({ addGoalOpen: true, editGoal: null }),
  openEditGoal: (goal) => set({ addGoalOpen: true, editGoal: goal }),
  closeAddGoal: () => set({ addGoalOpen: false, editGoal: null }),
  openAddRes: (goalId, type) => set({ addResCtx: { goalId, type } }),
  openEditRes: (res) => set({ addResCtx: { goalId: res.goalId, type: res.type, edit: res } }),
  closeAddRes: () => set({ addResCtx: null }),
  showToast: (text, type = "error") => set({ toast: { text, type } }),
  dismissToast: () => set({ toast: null }),
}));
