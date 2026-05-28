import { STATUS } from "../lib/constants";

export default function StatusPicker({ current, onChange }) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {Object.entries(STATUS).map(([k,v])=>(
        <button key={k} onClick={()=>onChange(k)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${current===k?v.color:"var(--color-border-tertiary)"}`,background:current===k?v.bg:"transparent",color:current===k?v.color:"var(--color-text-secondary)",cursor:"pointer",fontSize:12,fontWeight:current===k?500:400,transition:"all .15s"}}>
          {current===k&&<span style={{marginRight:4}}>{k==="active"?"▶":k==="someday"?"◷":"✓"}</span>}
          {v.label}
        </button>
      ))}
    </div>
  );
}
