import { STATUS, statusesForKind } from "../lib/constants";

const ICON = { active: "▶", someday: "◷", achieved: "✓", archived: "▤" };

export default function StatusPicker({ current, kind, onChange }) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {statusesForKind(kind).map((k)=>{
        const v=STATUS[k];
        return (
          <button key={k} onClick={()=>onChange(k)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${current===k?v.color:"var(--color-border-tertiary)"}`,background:current===k?v.bg:"transparent",color:current===k?v.color:"var(--color-text-secondary)",cursor:"pointer",fontSize:12,fontWeight:current===k?500:400,transition:"all .15s"}}>
            {current===k&&<span style={{marginRight:4}}>{ICON[k]}</span>}
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
