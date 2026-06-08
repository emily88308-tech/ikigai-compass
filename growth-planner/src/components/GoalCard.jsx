import { useState } from "react";
import { CATS, STATUS, RES_TYPES, RES_TYPE_KEYS, GOAL_KINDS } from "../lib/constants";
import { uid, today, fmtTs, fmtDateStr, todayISO } from "../lib/utils";
import { useGoalsStore } from "../store/goalsStore";
import { useUiStore } from "../store/uiStore";
import StatusPicker from "./StatusPicker";

export default function GoalCard({ goal, showStatus }) {
  const [expanded,setExpanded]=useState(false),[newNote,setNewNote]=useState("");
  const allRes = useGoalsStore(st=>st.resolutions);
  const toggleResolution = useGoalsStore(st=>st.toggleResolution);
  const deleteResolution = useGoalsStore(st=>st.deleteResolution);
  const deleteGoal = useGoalsStore(st=>st.deleteGoal);
  const updateGoal = useGoalsStore(st=>st.updateGoal);
  const openAddRes = useUiStore(st=>st.openAddRes);
  const openEditRes = useUiStore(st=>st.openEditRes);
  const openEditGoal = useUiStore(st=>st.openEditGoal);

  const c=CATS[goal.category], s=STATUS[goal.status||"active"];
  const myRes=allRes.filter(r=>r.goalId===goal.id);
  const resByType=(t)=>myRes.filter(r=>r.type===t);
  const done=myRes.filter(r=>r.done).length,pct=myRes.length?Math.round(done/myRes.length*100):null;
  const reflections=goal.reflections||[];

  function addReflection(){ if(!newNote.trim()) return; updateGoal({...goal,reflections:[...reflections,{id:uid(),text:newNote.trim(),date:today()}]}); setNewNote(""); }
  function deleteReflection(id){ updateGoal({...goal,reflections:reflections.filter(r=>r.id!==id)}); }
  const isActive = goal.status==="active" || !goal.status;
  const isOngoing = goal.kind==="ongoing";
  const overdue = goal.targetDate && goal.status!=="achieved" && goal.targetDate < todayISO();

  return (
    <div style={{background:"var(--color-background-primary)",borderRadius:14,border:"0.5px solid var(--color-border-tertiary)",overflow:"hidden",marginBottom:12,borderTop:`3px solid ${c.color}`,opacity:goal.status==="achieved"?.85:1}}>
      <div style={{padding:"14px 16px",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start"}} onClick={()=>setExpanded(x=>!x)}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:c.bg,color:c.color,fontWeight:500}}>{c.label}</span>
            {showStatus&&<span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:s.bg,color:s.color,fontWeight:500}}>{s.label}</span>}
            {pct!=null&&<span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{pct}% complete</span>}
            {reflections.length>0&&<span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>· {reflections.length} note{reflections.length!==1?"s":""}</span>}
            {isOngoing&&<span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:GOAL_KINDS.ongoing.color+"14",color:GOAL_KINDS.ongoing.color,fontWeight:500}}>Ongoing</span>}
            {goal.status==="achieved"&&goal.achievedAt&&<span style={{fontSize:11,color:"#1D9E75",fontWeight:500}}>✓ {fmtTs(goal.achievedAt)}</span>}
            {goal.targetDate&&goal.status!=="achieved"&&<span style={{fontSize:11,fontWeight:500,color:overdue?"#D4537E":"var(--color-text-tertiary)"}}>{overdue?"⚑ Overdue · ":"◷ By "}{fmtDateStr(goal.targetDate)}</span>}
          </div>
          <div style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)",lineHeight:1.3,marginBottom:5,textDecoration:goal.status==="achieved"?"line-through":"none"}}>{goal.title}</div>
          <div style={{fontSize:12,color:"var(--color-text-secondary)",display:"flex",gap:10,flexWrap:"wrap"}}>
            {RES_TYPE_KEYS.map(t=>{const n=resByType(t).length;return n>0&&<span key={t} style={{color:c.color,fontWeight:500}}>{n} {RES_TYPES[t].label.toLowerCase()}</span>;})}
            {myRes.length===0&&<span>No resolutions</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0,marginTop:2}}>
          <button onClick={e=>{e.stopPropagation();openEditGoal(goal);}} title="Edit goal" style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:13,padding:"2px 5px",lineHeight:1}}>✎</button>
          <button onClick={e=>{e.stopPropagation();deleteGoal(goal.id);}} title="Delete goal" style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:17,padding:"2px 5px",lineHeight:1}}>×</button>
          <span style={{color:"var(--color-text-tertiary)",fontSize:11}}>{expanded?"▲":"▼"}</span>
        </div>
      </div>

      {expanded&&(
        <div style={{borderTop:"0.5px solid var(--color-border-tertiary)"}}>
          <div style={{padding:"14px 16px 0"}}>
            <StatusPicker current={goal.status||"active"} onChange={st=>updateGoal({...goal,status:st})}/>
          </div>

          {goal.description&&<div style={{padding:"0 16px 0",fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.65}}>{goal.description}</div>}
          {goal.why&&(
            <div style={{margin:"12px 16px 0",padding:"12px 16px",borderLeft:`3px solid ${c.color}`,background:c.bg,borderRadius:"0 10px 10px 0"}}>
              <div style={{fontSize:10,fontWeight:500,color:c.color,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Why this matters to me</div>
              <div style={{fontSize:13,color:"var(--color-text-primary)",lineHeight:1.7,fontStyle:"italic"}}>{goal.why}</div>
            </div>
          )}

          {isActive&&<div style={{padding:"14px 16px 0"}}>
            {RES_TYPE_KEYS.map((type)=>{
              const list=resByType(type);
              return (
                <div key={type} style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:7}}>{type}</div>
                  {list.length===0&&<div style={{fontSize:12,color:"var(--color-text-tertiary)",fontStyle:"italic",marginBottom:6}}>No {type} resolutions</div>}
                  {list.map(r=>(
                    <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:"var(--color-background-secondary)",marginBottom:5}}>
                      <input type="checkbox" checked={r.done} onChange={()=>toggleResolution(r.id)} style={{accentColor:c.color,width:14,height:14,cursor:"pointer",flexShrink:0}}/>
                      <span style={{flex:1,fontSize:13,color:r.done?"var(--color-text-tertiary)":"var(--color-text-primary)",textDecoration:r.done?"line-through":"none"}}>{r.title}</span>
                      <button onClick={()=>openEditRes(r)} title="Edit resolution" style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:12,lineHeight:1,padding:"0 2px"}}>✎</button>
                      <button onClick={()=>deleteResolution(r.id)} title="Delete resolution" style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:14,lineHeight:1,padding:"0 2px"}}>×</button>
                    </div>
                  ))}
                  <button onClick={()=>openAddRes(goal.id,type)} style={{fontSize:12,color:c.color,background:c.bg,border:`0.5px solid ${c.color}33`,cursor:"pointer",padding:"5px 14px",borderRadius:20,fontWeight:500}}>+ Add {type}</button>
                </div>
              );
            })}
          </div>}

          <div style={{margin:"4px 16px 16px",padding:"14px",background:"var(--color-background-secondary)",borderRadius:12}}>
            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Reflection log</div>
            {reflections.length===0&&<div style={{fontSize:12,color:"var(--color-text-tertiary)",fontStyle:"italic",marginBottom:10}}>No reflections yet.</div>}
            {reflections.map(r=>(
              <div key={r.id} style={{marginBottom:10,paddingBottom:10,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:c.color,fontWeight:500}}>{r.date}</span>
                  <button onClick={()=>deleteReflection(r.id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:13,lineHeight:1}}>×</button>
                </div>
                <div style={{fontSize:13,color:"var(--color-text-primary)",lineHeight:1.65}}>{r.text}</div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <textarea value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="How is this goal going? What are you learning?" rows={2} style={{flex:1,fontSize:13,padding:"8px 10px",borderRadius:8,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",resize:"none",lineHeight:1.55}}/>
              <button onClick={addReflection} disabled={!newNote.trim()} style={{padding:"8px 14px",borderRadius:8,border:"none",background:newNote.trim()?c.color:"var(--color-border-tertiary)",color:newNote.trim()?"#fff":"var(--color-text-tertiary)",cursor:newNote.trim()?"pointer":"default",fontSize:13,fontWeight:500,flexShrink:0}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
