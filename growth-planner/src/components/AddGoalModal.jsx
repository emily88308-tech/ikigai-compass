import { useState } from "react";
import { CATS, CAT_KEYS, STATUS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useUiStore } from "../store/uiStore";
import { useIsMobile } from "../hooks/useWindowSize";

export default function AddGoalModal() {
  const addGoal = useGoalsStore(s=>s.addGoal);
  const updateGoal = useGoalsStore(s=>s.updateGoal);
  const editGoal = useUiStore(s=>s.editGoal);
  const onClose = useUiStore(s=>s.closeAddGoal);
  const isMobile = useIsMobile();

  const [cat,setCat]=useState(editGoal?.category||"career"),[title,setTitle]=useState(editGoal?.title||""),[desc,setDesc]=useState(editGoal?.description||""),[why,setWhy]=useState(editGoal?.why||""),[status,setStatus]=useState(editGoal?.status||"active");
  const c=CATS[cat];
  function submit(){
    if(!title.trim()) return;
    const fields={category:cat,title:title.trim(),description:desc.trim(),why:why.trim(),status};
    if(editGoal) updateGoal({...editGoal,...fields}); // preserves id, reflections, createdAt
    else addGoal(fields);
    onClose();
  }
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",zIndex:200,animation:"overlay-fade .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#ffffff",borderRadius:isMobile?"20px 20px 0 0":20,padding:isMobile?"24px 20px calc(24px + env(safe-area-inset-bottom))":28,width:isMobile?"100%":"min(480px,94vw)",border:"0.5px solid #e0e0e0",maxHeight:isMobile?"90svh":"92vh",overflowY:"auto",boxSizing:"border-box",color:"#1a1a1a",animation:isMobile?"sheet-up .28s ease":"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 style={{margin:0,fontSize:17,fontWeight:500}}>{editGoal?"Edit goal":"New goal"}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:22,lineHeight:1}}>×</button>
        </div>

        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:8}}>Life area</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
          {CAT_KEYS.map(k=><button key={k} onClick={()=>setCat(k)} style={{padding:"6px 16px",borderRadius:20,border:`1.5px solid ${cat===k?CATS[k].color:"var(--color-border-tertiary)"}`,background:cat===k?CATS[k].bg:"transparent",color:cat===k?CATS[k].color:"var(--color-text-secondary)",cursor:"pointer",fontSize:13,fontWeight:cat===k?500:400}}>{CATS[k].label}</button>)}
        </div>

        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:8}}>Status</div>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {Object.entries(STATUS).map(([k,v])=>(
            <button key={k} onClick={()=>setStatus(k)} style={{flex:1,padding:"7px 0",borderRadius:10,border:`1.5px solid ${status===k?v.color:"var(--color-border-tertiary)"}`,background:status===k?v.bg:"transparent",color:status===k?v.color:"var(--color-text-secondary)",cursor:"pointer",fontSize:13,fontWeight:status===k?500:400}}>{v.label}</button>
          ))}
        </div>

        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>Goal title</div>
        <input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Become a stronger communicator" style={{display:"block",width:"100%",marginBottom:18,fontSize:15,padding:"10px 13px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",boxSizing:"border-box"}}/>

        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>Description</div>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What does achieving this look like?" rows={2} style={{display:"block",width:"100%",marginBottom:18,fontSize:13,padding:"10px 13px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",resize:"none",boxSizing:"border-box",lineHeight:1.65}}/>

        <div style={{fontSize:11,fontWeight:500,color:c.color,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>Why this matters to me</div>
        <textarea value={why} onChange={e=>setWhy(e.target.value)} placeholder="This is important to me because…" rows={3} style={{display:"block",width:"100%",marginBottom:24,fontSize:13,padding:"10px 13px",borderRadius:10,border:`0.5px solid ${why?c.color:"var(--color-border-secondary)"}`,background:why?c.bg:"var(--color-background-secondary)",color:"var(--color-text-primary)",resize:"none",boxSizing:"border-box",lineHeight:1.65,transition:"border-color .2s,background .2s"}}/>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"9px 20px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"none",cursor:"pointer",fontSize:13,color:"var(--color-text-secondary)"}}>Cancel</button>
          <button onClick={submit} disabled={!title.trim()} style={{padding:"9px 24px",borderRadius:10,border:"none",background:title.trim()?c.color:"var(--color-background-secondary)",color:title.trim()?"#fff":"var(--color-text-tertiary)",cursor:title.trim()?"pointer":"default",fontSize:13,fontWeight:500}}>{editGoal?"Save changes":"Add goal"}</button>
        </div>
      </div>
    </div>
  );
}
