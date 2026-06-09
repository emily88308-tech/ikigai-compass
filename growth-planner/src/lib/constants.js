export const CATS = {
  career:       { label: "Career",          color: "#7F77DD", bg: "#EEEDFE", short: "Career" },
  health:       { label: "Health & beauty", color: "#1D9E75", bg: "#E1F5EE", short: "Health" },
  hobby:        { label: "Hobby",           color: "#BA7517", bg: "#FAEEDA", short: "Hobby"  },
  relationship: { label: "Relationship",    color: "#D4537E", bg: "#FBEAF0", short: "Relate" },
  inner:        { label: "Inner world",     color: "#378ADD", bg: "#E6F1FB", short: "Inner"  },
  wealth:       { label: "Wealth",          color: "#639922", bg: "#EAF3DE", short: "Wealth" },
};

export const CAT_KEYS = Object.keys(CATS);

// "achieved" is the terminal state for finite (outcome) goals — labelled "Done".
// "archived" is the terminal state for ongoing goals — retired, kept for history.
export const STATUS = {
  active:   { label: "Active",   color: "#7F77DD", bg: "#EEEDFE" },
  someday:  { label: "Someday",  color: "#BA7517", bg: "#FAEEDA" },
  achieved: { label: "Done",     color: "#1D9E75", bg: "#E1F5EE" },
  archived: { label: "Archived", color: "#6E7787", bg: "#EEF0F3" },
};

// The status options a goal can move through depend on its kind: ongoing goals
// never "finish" (they Archive); outcome goals complete (they're Done).
export const statusesForKind = (kind) =>
  kind === "ongoing" ? ["active", "someday", "archived"] : ["active", "someday", "achieved"];

// Goal kinds. "outcome" goals have a finish line (can be completed, may carry a
// target date); "ongoing" goals have no end — they're measured by the output
// they accumulate, not by completion.
export const GOAL_KINDS = {
  outcome: { label: "Outcome",  desc: "Has a finish line",       color: "#7F77DD" },
  ongoing: { label: "Ongoing",  desc: "Keeps producing, no end", color: "#378ADD" },
};
export const GOAL_KIND_KEYS = Object.keys(GOAL_KINDS);

// Resolution buckets. monthly/weekly are recurring cadences; "anytime" is for
// one-off tasks with no fixed schedule (do it when the moment is right).
export const RES_TYPES = {
  monthly: { label: "Monthly", color: "#1D9E75" },
  weekly:  { label: "Weekly",  color: "#378ADD" },
  anytime: { label: "Anytime", color: "#BA7517" },
};
export const RES_TYPE_KEYS = Object.keys(RES_TYPES);
