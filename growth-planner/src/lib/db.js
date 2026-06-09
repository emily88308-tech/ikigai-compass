import { supabase } from "./supabase";

// Map between the app's camelCase shape and the snake_case columns in Postgres.
const goalToRow = (g, userId) => ({
  id: g.id, user_id: userId, category: g.category, title: g.title,
  description: g.description || "", why: g.why || "", status: g.status || "active",
  kind: g.kind || "outcome", target_date: g.targetDate || null, achieved_at: g.achievedAt || null,
  reflections: g.reflections || [], created_at: g.createdAt,
});
const rowToGoal = (r) => ({
  id: r.id, category: r.category, title: r.title, description: r.description || "",
  why: r.why || "", status: r.status || "active", kind: r.kind || "outcome",
  targetDate: r.target_date || "", achievedAt: r.achieved_at || null,
  reflections: r.reflections || [], createdAt: r.created_at,
});

const resToRow = (r, userId) => ({
  id: r.id, user_id: userId, goal_id: r.goalId, type: r.type,
  title: r.title, done: !!r.done, completions: r.completions || [],
  effort: r.effort || "medium", created_at: r.createdAt,
});
const rowToRes = (r) => ({
  id: r.id, goalId: r.goal_id, type: r.type, title: r.title,
  done: !!r.done, completions: r.completions || [], effort: r.effort || "medium",
  createdAt: r.created_at,
});

const reviewToRow = (r, userId) => ({
  id: r.id, user_id: userId, type: r.type, note: r.note,
  done: r.done, total: r.total, pct: r.pct, date: r.date, created_at: r.createdAt,
});
const rowToReview = (r) => ({
  id: r.id, type: r.type, note: r.note, done: r.done, total: r.total,
  pct: r.pct, date: r.date, createdAt: r.created_at,
});

// Load everything for the signed-in user in parallel.
export async function fetchAll(userId) {
  const [g, r, v] = await Promise.all([
    supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("resolutions").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("reviews").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
  ]);
  const err = g.error || r.error || v.error;
  if (err) throw err;
  return {
    goals: g.data.map(rowToGoal),
    resolutions: r.data.map(rowToRes),
    reviews: v.data.map(rowToReview),
  };
}

// upsert handles both insert (add) and update — the id is the conflict key.
export async function saveGoal(userId, goal) {
  const { error } = await supabase.from("goals").upsert(goalToRow(goal, userId));
  if (error) throw error;
}
export async function removeGoal(id) {
  // resolutions cascade-delete via the goal_id foreign key.
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
}
export async function saveResolution(userId, res) {
  const { error } = await supabase.from("resolutions").upsert(resToRow(res, userId));
  if (error) throw error;
}
export async function removeResolution(id) {
  const { error } = await supabase.from("resolutions").delete().eq("id", id);
  if (error) throw error;
}
export async function saveReview(userId, review) {
  const { error } = await supabase.from("reviews").upsert(reviewToRow(review, userId));
  if (error) throw error;
}
