import { CATS, CAT_KEYS } from "../lib/constants";
import { useUiStore } from "../store/uiStore";

const ACCENT = "#7F77DD";

// Horizontal scrollable filter row shown on the Goals tab (mobile). Replaces
// the vertical category list from the desktop sidebar.
export default function CategoryPills() {
  const page = useUiStore((s) => s.page);
  const setPage = useUiStore((s) => s.setPage);

  const pills = [
    { id: "active", label: "All", color: ACCENT },
    ...CAT_KEYS.map((k) => ({ id: `cat:${k}`, label: CATS[k].label, color: CATS[k].color, dot: true })),
    { id: "someday", label: "Someday", color: "#BA7517" },
    { id: "achieved", label: "Done", color: "#1D9E75" },
    { id: "archived", label: "Archive", color: "#6E7787" },
  ];

  return (
    <div className="no-scrollbar" style={{
      flexShrink: 0,
      display: "flex",
      gap: 8,
      overflowX: "auto",
      padding: "10px 14px",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
    }}>
      {pills.map(({ id, label, color, dot }) => {
        const active = page === id;
        return (
          <button key={id} onClick={() => setPage(id)} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            whiteSpace: "nowrap",
            padding: "6px 14px",
            borderRadius: 20,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: active ? 600 : 400,
            border: `1px solid ${active ? color : "var(--color-border-secondary)"}`,
            background: active ? color : "transparent",
            color: active ? "#fff" : "var(--color-text-secondary)",
            transition: "background .15s, color .15s",
          }}>
            {dot && (
              <span style={{
                width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                background: active ? "#fff" : color,
              }} />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
