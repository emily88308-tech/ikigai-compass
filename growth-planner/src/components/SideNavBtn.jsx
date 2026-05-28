import { CATS } from "../lib/constants";

export default function SideNavBtn({ id, label, cat, count, active, onClick, indent }) {
  const color = cat ? CATS[cat].color : "#7F77DD";
  return (
    <button onClick={()=>onClick(id)} style={{display:"flex",alignItems:"center",gap:9,padding:`8px 14px 8px ${indent?24:16}px`,border:"none",width:"100%",textAlign:"left",cursor:"pointer",fontSize:13,
      background:active?"var(--color-background-primary)":"transparent",
      color:active?color:"var(--color-text-secondary)",fontWeight:active?500:400,
      borderLeft:active?`2.5px solid ${color}`:"2.5px solid transparent"}}>
      {cat&&<span style={{width:8,height:8,borderRadius:"50%",background:CATS[cat].color,flexShrink:0}}/>}
      <span style={{flex:1}}>{label}</span>
      {count!=null&&<span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{count}</span>}
    </button>
  );
}
