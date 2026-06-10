import { CATS, RES_TYPES, EFFORTS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useUiStore } from "../store/uiStore";
import { isDoneNow } from "../lib/recurrence";

export default function ResolutionsPane({ type }) {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);
  const onToggle = useGoalsStore(s=>s.toggleResolution);
  const onDelete = useGoalsStore(s=>s.deleteResolution);
  const openAddRes = useUiStore(s=>s.openAddRes);
  const openEditRes = useUiStore(s=>s.openEditRes);

  const activeGoalIds=new Set(goals.filter(g=>(g.status||"active")==="active").map(g=>g.id));
  const filtered=resolutions.filter(r=>r.type===type&&activeGoalIds.has(r.goalId));
  const done=filtered.filter(isDoneNow).length;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100%"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18,flexShrink:0}}>
        <div>
          <h2 style={{margin:0,fontSize:17,fontWeight:500}}>{RES_TYPES[type].label} resolutions</h2>
          <p style={{margin:"3px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>{done} of {filtered.length} completed · active goals only</p>
        </div>
        <button onClick={()=>openAddRes(null,type)} style={{padding:"7px 18px",borderRadius:8,border:"none",background:"#7F77DD",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500,flexShrink:0}}>+ Add</button>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:32,marginBottom:12,opacity:.25}}>◷</div>
            <div style={{fontSize:14,color:"var(--color-text-tertiary)"}}>No {type} resolutions yet.</div>
          </div>
        ):filtered.map(r=>{
          const goal=goals.find(g=>g.id===r.goalId),c=goal?CATS[goal.category]:{color:"#888",bg:"#f0f0f0"};
          const dn=isDoneNow(r);
          return (
            <div key={r.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${c.color}`}}>
              <input type="checkbox" checked={dn} onChange={()=>onToggle(r.id)} style={{accentColor:c.color,width:15,height:15,cursor:"pointer",flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,color:dn?"var(--color-text-tertiary)":"var(--color-text-primary)",textDecoration:dn?"line-through":"none",marginBottom:4,lineHeight:1.3}}>{r.title}</div>
                {goal&&<span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:c.bg,color:c.color,fontWeight:500}}>{goal.title}</span>}
                {r.effort&&r.effort!=="medium"&&<span style={{fontSize:10,color:"var(--color-text-tertiary)",marginLeft:6}}>· {EFFORTS[r.effort].label} effort</span>}
              </div>
              <button onClick={()=>openEditRes(r)} title="Edit resolution" style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:13,padding:"2px 4px",flexShrink:0}}>✎</button>
              <button onClick={()=>onDelete(r.id)} title="Delete resolution" style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:16,padding:"2px 4px",flexShrink:0}}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
