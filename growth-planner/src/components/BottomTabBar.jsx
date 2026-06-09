import { useUiStore } from "../store/uiStore";

const ACCENT = "#7F77DD";

// Simple 24px stroke icons (inherit color via currentColor).
const Icon = ({ d, fill }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const GoalsIcon = () => <Icon d={<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/></>} />;
const MonthlyIcon = () => <Icon d={<><rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4"/></>} />;
const WeeklyIcon = () => <Icon d={<><rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4M8.5 14l2 2 4-4"/></>} />;
const AnytimeIcon = () => <Icon d={<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.2L5 21V4a1 1 0 0 1 1-1z"/>} />;
const StatsIcon = () => <Icon d={<><path d="M7 8a5 5 0 0 0 10 0V3H7v5z"/><path d="M5 3h2M17 3h2M9 13v3M15 13v3M8 21h8M9 21l.5-2h5l.5 2"/></>} />;
const ReviewIcon = () => <Icon d={<><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v4h-4"/></>} />;
const CoachIcon = () => <Icon d={<><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L4 21l1.1-3.8A8.4 8.4 0 1 1 21 11.5Z"/></>} />;

const TABS = [
  { key: "goals", label: "Goals", page: "active", Icon: GoalsIcon,
    match: (p) => p === "active" || p.startsWith("cat:") || p === "someday" || p === "achieved" || p === "archived" },
  { key: "monthly", label: "Monthly", page: "monthly", Icon: MonthlyIcon, match: (p) => p === "monthly" },
  { key: "weekly", label: "Weekly", page: "weekly", Icon: WeeklyIcon, match: (p) => p === "weekly" },
  { key: "anytime", label: "Anytime", page: "anytime", Icon: AnytimeIcon, match: (p) => p === "anytime" },
  { key: "achievements", label: "Wins", page: "achievements", Icon: StatsIcon, match: (p) => p === "achievements" },
  { key: "review", label: "Review", page: "review", Icon: ReviewIcon, match: (p) => p === "review" },
  { key: "coach", label: "Coach", page: "coach", Icon: CoachIcon, match: (p) => p === "coach" },
];

export default function BottomTabBar() {
  const page = useUiStore((s) => s.page);
  const setPage = useUiStore((s) => s.setPage);

  return (
    <nav style={{
      flexShrink: 0,
      display: "flex",
      borderTop: "0.5px solid var(--color-border-tertiary)",
      background: "var(--color-background-secondary)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {TABS.map(({ key, label, page: target, Icon: TabIcon, match }) => {
        const active = match(page);
        return (
          <button key={key} onClick={() => setPage(target)} style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "8px 0 7px",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: active ? ACCENT : "var(--color-text-tertiary)",
            transition: "color .15s",
          }}>
            <TabIcon />
            <span style={{ fontSize: 10.5, fontWeight: active ? 600 : 500 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
