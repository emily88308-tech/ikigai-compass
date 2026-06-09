import { STATUS, statusesForKind } from "../lib/constants";

const ICON = { active: "▶", someday: "◷", achieved: "✓", archived: "▤" };

// A compact dropdown for a goal's status. Options are scoped to the goal's kind
// (ongoing → Archived, outcome → Done) and the control is tinted to the current
// status's colour.
export default function StatusPicker({ current, kind, onChange }) {
  const opts = statusesForKind(kind);
  const v = STATUS[current] || STATUS.active;
  return (
    <div style={{position:"relative",display:"inline-block",marginBottom:14}}>
      <select
        value={current}
        onChange={(e)=>onChange(e.target.value)}
        aria-label="Goal status"
        style={{
          appearance:"none",WebkitAppearance:"none",MozAppearance:"none",
          padding:"7px 34px 7px 14px",borderRadius:20,cursor:"pointer",
          border:`1.5px solid ${v.color}`,background:v.bg,color:v.color,
          fontSize:13,fontWeight:500,lineHeight:1.2,outline:"none",
        }}
      >
        {opts.map((k)=>(
          <option key={k} value={k}>{ICON[k]} {STATUS[k].label}</option>
        ))}
      </select>
      <span style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fontSize:10,color:v.color}}>▾</span>
    </div>
  );
}
