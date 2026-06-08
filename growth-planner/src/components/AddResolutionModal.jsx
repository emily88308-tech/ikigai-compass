import { useState } from "react";
import { CATS, RES_TYPES, RES_TYPE_KEYS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useUiStore } from "../store/uiStore";
import { useIsMobile } from "../hooks/useWindowSize";

export default function AddResolutionModal() {
  const goals = useGoalsStore(s=>s.goals);
  const addResolution = useGoalsStore(s=>s.addResolution);
  const updateResolution = useGoalsStore(s=>s.updateResolution);
  const ctx = useUiStore(s=>s.addResCtx) || {};
  const onClose = useUiStore(s=>s.closeAddRes);
  const isMobile = useIsMobile();
  const edit = ctx.edit;

  // When editing, keep the resolution's own goal selectable even if it's no
  // longer active, so the link isn't silently lost.
  const activeGoals = goals.filter(g=>g.status==="active");
  const selectableGoals = edit && !activeGoals.some(g=>g.id===edit.goalId)
    ? [...activeGoals, goals.find(g=>g.id===edit.goalId)].filter(Boolean)
    : activeGoals;
  const [goalId,setGoalId]=useState(ctx.goalId||activeGoals[0]?.id||""),[type,setType]=useState(ctx.type||"monthly"),[title,setTitle]=useState(edit?.title||"");
  const goal=selectableGoals.find(g=>g.id===goalId), c=goal?CATS[goal.category]:{color:"#7F77DD",bg:"#EEEDFE"};
  function submit(){
    if(!title.trim()||!goalId) return;
    if(edit) updateResolution({...edit,goalId,type,title:title.trim()}); // preserves id, done, createdAt
    else addResolution({goalId,type,title:title.trim()});
    onClose();
  }
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",zIndex:200,animation:"overlay-fade .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#ffffff",borderRadius:isMobile?"20px 20px 0 0":20,padding:isMobile?"24px 20px calc(24px + env(safe-area-inset-bottom))":28,width:isMobile?"100%":"min(420px,94vw)",border:"0.5px solid #e0e0e0",maxHeight:isMobile?"90svh":"92vh",overflowY:"auto",boxSizing:"border-box",color:"#1a1a1a",animation:isMobile?"sheet-up .28s ease":"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 style={{margin:0,fontSize:17,fontWeight:500}}>{edit?"Edit resolution":"New resolution"}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:22,lineHeight:1}}>×</button>
        </div>
        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>Linked goal</div>
        <select value={goalId} onChange={e=>setGoalId(e.target.value)} style={{display:"block",width:"100%",marginBottom:18,fontSize:13,padding:"9px 12px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",boxSizing:"border-box"}}>
          {selectableGoals.map(g=><option key={g.id} value={g.id}>{CATS[g.category].label} — {g.title}</option>)}
        </select>
        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:8}}>When</div>
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {RES_TYPE_KEYS.map(t=><button key={t} onClick={()=>setType(t)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`1.5px solid ${type===t?c.color:"var(--color-border-tertiary)"}`,background:type===t?c.bg:"transparent",color:type===t?c.color:"var(--color-text-secondary)",cursor:"pointer",fontSize:13,fontWeight:type===t?500:400}}>{RES_TYPES[t].label}</button>)}
        </div>
        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>Resolution</div>
        <input autoFocus value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="e.g. Read one book this month" style={{display:"block",width:"100%",marginBottom:24,fontSize:14,padding:"10px 13px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"9px 20px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"none",cursor:"pointer",fontSize:13,color:"var(--color-text-secondary)"}}>Cancel</button>
          <button onClick={submit} disabled={!title.trim()||!goalId} style={{padding:"9px 24px",borderRadius:10,border:"none",background:title.trim()&&goalId?c.color:"var(--color-background-secondary)",color:title.trim()&&goalId?"#fff":"var(--color-text-tertiary)",cursor:title.trim()&&goalId?"pointer":"default",fontSize:13,fontWeight:500}}>{edit?"Save":"Add"}</button>
        </div>
      </div>
    </div>
  );
}
