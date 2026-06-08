export const CATS = {
  career:       { label: "Career",          color: "#7F77DD", bg: "#EEEDFE", short: "Career" },
  health:       { label: "Health & beauty", color: "#1D9E75", bg: "#E1F5EE", short: "Health" },
  hobby:        { label: "Hobby",           color: "#BA7517", bg: "#FAEEDA", short: "Hobby"  },
  relationship: { label: "Relationship",    color: "#D4537E", bg: "#FBEAF0", short: "Relate" },
  inner:        { label: "Inner world",     color: "#378ADD", bg: "#E6F1FB", short: "Inner"  },
  wealth:       { label: "Wealth",          color: "#639922", bg: "#EAF3DE", short: "Wealth" },
};

export const CAT_KEYS = Object.keys(CATS);

export const STATUS = {
  active:   { label: "Active",   color: "#7F77DD", bg: "#EEEDFE" },
  someday:  { label: "Someday",  color: "#BA7517", bg: "#FAEEDA" },
  achieved: { label: "Achieved", color: "#1D9E75", bg: "#E1F5EE" },
};

// Resolution buckets. monthly/weekly are recurring cadences; "anytime" is for
// one-off tasks with no fixed schedule (do it when the moment is right).
export const RES_TYPES = {
  monthly: { label: "Monthly", color: "#1D9E75" },
  weekly:  { label: "Weekly",  color: "#378ADD" },
  anytime: { label: "Anytime", color: "#BA7517" },
};
export const RES_TYPE_KEYS = Object.keys(RES_TYPES);
