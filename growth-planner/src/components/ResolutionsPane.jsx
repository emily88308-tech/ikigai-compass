import { useState } from "react";
import { CATS, RES_TYPES, EFFORTS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useUiStore } from "../store/uiStore";
import { isDoneNow, recurrenceCaption } from "../lib/recurrence";

export default function ResolutionsPane({ type }) {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);
  const onToggle = useGoalsStore(s=>s.toggleResolution);
  const onDelete = useGoalsStore(s=>s.deleteResolution);
  const setRetired = useGoalsStore(s=>s.setResolutionRetired);
  const openAddRes = useUiStore(s=>s.openAddRes);
  const openEditRes = useUiStore(s=>s.openEditRes);
  const focusGoal = useUiStore(s=>s.focusGoal);
  const [showRetired,setShowRetired]=useState(false);

  const activeGoalIds=new Set(goals.filter(g=>(g.status||"active")==="active").map(g=>g.id));
  const mine=resolutions.filter(r=>r.type===type&&activeGoalIds.has(r.goalId));
  const filtered=mine.filter(r=>!r.retired);
  const retiredList=mine.filter(r=>r.retired);
  const done=filtered.filter(isDoneNow).length;

  function confirmDelete(r){
    const n=(r.completions||[]).length;
    const msg = n>0
      ? `Delete "${r.title}"?\n\nThis also permanently removes ${n} logged completion${n!==1?"s":""} and their calendar entries — it can't be undone.\n\nTip: "Retire" instead keeps the history and just hides this from your active list.`
      : `Delete "${r.title}"? This can't be undone.`;
    if(window.confirm(msg)) onDelete(r.id);
  }

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
                {goal&&<button onClick={()=>focusGoal(goal.id,goal.category)} title="Go to goal" style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:c.bg,color:c.color,fontWeight:500,border:"none",cursor:"pointer"}}>{goal.title} ↗</button>}
                {r.effort&&r.effort!=="medium"&&<span style={{fontSize:10,color:"var(--color-text-tertiary)",marginLeft:6}}>· {EFFORTS[r.effort].label} effort</span>}
                {recurrenceCaption(r)&&<div style={{fontSize:10.5,color:dn?"#1D9E75":"var(--color-text-tertiary)",marginTop:5}}>{recurrenceCaption(r)}</div>}
              </div>
              <button onClick={()=>openEditRes(r)} title="Edit resolution" style={iconBtn}>✎</button>
              <button onClick={()=>setRetired(r.id,true)} title="Retire (stop tracking, keep history)" style={iconBtn}>⊘</button>
              <button onClick={()=>confirmDelete(r)} title="Delete resolution" style={{...iconBtn,fontSize:16}}>×</button>
            </div>
          );
        })}

        {retiredList.length>0 && (
          <div style={{marginTop:8}}>
            <button onClick={()=>setShowRetired(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.05em",padding:"6px 0",display:"flex",alignItems:"center",gap:6}}>
              {showRetired?"▾":"▸"} Retired ({retiredList.length}) · history kept
            </button>
            {showRetired && retiredList.map(r=>{
              const goal=goals.find(g=>g.id===r.goalId),c=goal?CATS[goal.category]:{color:"#888",bg:"#f0f0f0"};
              const n=(r.completions||[]).length;
              return (
                <div key={r.id} style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12,opacity:.85}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:3,lineHeight:1.3}}>{r.title}</div>
                    <span style={{fontSize:10.5,color:"var(--color-text-tertiary)"}}>{goal?CATS[goal.category].short:"—"} · {n} completion{n!==1?"s":""} kept</span>
                  </div>
                  <button onClick={()=>setRetired(r.id,false)} title="Restore to active" style={{...iconBtn,width:"auto",padding:"4px 10px",fontSize:12,color:c.color}}>Restore</button>
                  <button onClick={()=>confirmDelete(r)} title="Delete permanently" style={{...iconBtn,fontSize:16}}>×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const iconBtn = {background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:13,padding:"2px 4px",flexShrink:0,lineHeight:1};
