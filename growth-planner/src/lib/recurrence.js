import { todayISO } from "./utils";

// Completion-log model. A resolution carries `completions`: an array of
// { date: "YYYY-MM-DD", ts: epochMs } entries. Whether a resolution counts as
// "done" is *derived* from whether it has a completion in the current period —
// so weekly/monthly resolutions reset themselves when a new period begins.
//   weekly  → one period per Monday-based week
//   monthly → one period per calendar month
//   anytime → a single open-ended period (one-off; stays done once completed)

// Monday-based start of the week containing `iso`, as "YYYY-MM-DD".
export function weekStartISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = (dt.getDay() + 6) % 7; // Mon=0 … Sun=6
  dt.setDate(dt.getDate() - dow);
  const p = (x) => String(x).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

// The period bucket a given date falls into for a resolution type.
export function periodKey(type, iso) {
  if (type === "weekly") return "w:" + weekStartISO(iso);
  if (type === "monthly") return "m:" + iso.slice(0, 7); // YYYY-MM
  return "once"; // anytime — a single bucket
}

export const currentPeriodKey = (type) => periodKey(type, todayISO());

// Is this resolution complete for its *current* period?
export function isDoneNow(res) {
  const comps = res.completions || [];
  if (res.type === "anytime") return comps.length > 0;
  const cur = currentPeriodKey(res.type);
  return comps.some((c) => periodKey(res.type, c.date) === cur);
}

// Toggle completion for the current period: add a dated entry if not yet done,
// or remove the current period's entries if undoing. Returns a new resolution
// with `completions` updated and `done` kept in sync as a denormalised cache.
export function toggleCompletion(res) {
  const comps = res.completions || [];
  let next;
  if (isDoneNow(res)) {
    if (res.type === "anytime") next = [];
    else {
      const cur = currentPeriodKey(res.type);
      next = comps.filter((c) => periodKey(res.type, c.date) !== cur);
    }
  } else {
    next = [...comps, { date: todayISO(), ts: Date.now() }];
  }
  return withDone({ ...res, completions: next });
}

// Recompute the denormalised `done` flag from the completion log.
export function withDone(res) {
  return { ...res, done: isDoneNow(res) };
}
