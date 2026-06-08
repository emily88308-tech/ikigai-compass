export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function today() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Format an epoch-ms timestamp (e.g. achievedAt) as "Aug 2, 2026". Null-safe.
export function fmtTs(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Format a "YYYY-MM-DD" date string (from a native date input) as "Aug 2, 2026".
// Parsed as local time (not UTC) to avoid an off-by-one day shift.
export function fmtDateStr(s) {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Today as "YYYY-MM-DD" in local time — for comparing against a targetDate string.
export function todayISO() {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

// "June 2026" bucket key for grouping a timestamp into a month.
export function monthLabel(ms) {
  if (!ms) return "Earlier";
  return new Date(ms).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
