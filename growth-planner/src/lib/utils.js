export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function today() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
