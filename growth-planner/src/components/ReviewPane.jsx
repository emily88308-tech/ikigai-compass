import { useState } from "react";
import { CATS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { isDoneNow } from "../lib/recurrence";

export default function ReviewPane() {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);
  const reviews = useGoalsStore(s=>s.reviews);
  const onSaveReview = useGoalsStore(s=>s.saveReview);

  const [type,setType]=useState("monthly"),[note,setNote]=useState("");
  const activeIds=new Set(goals.filter(g=>(g.status||"active")==="active").map(g=>g.id));
  const filtered=resolutions.filter(r=>r.type===type&&activeIds.has(r.goalId)&&!r.retired);
  const done=filtered.filter(isDoneNow).length,total=filtered.length,pct=total?Math.round(done/total*100):0;
  const pastReviews=reviews.filter(r=>r.type===type).sort((a,b)=>b.createdAt-a.createdAt);
  function submit(){ if(!note.trim()) return; onSaveReview({type,note:note.trim(),done,total,pct}); setNote(""); }
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100%"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18,flexShrink:0}}>
        <div>
          <h2 style={{margin:0,fontSize:17,fontWeight:500}}>Review</h2>
          <p style={{margin:"3px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>Reflect on your progress and capture what you learned</p>
        </div>
        <div style={{display:"flex",gap:4,background:"var(--color-background-secondary)",borderRadius:8,padding:3}}>
          {["monthly","weekly"].map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:type===t?500:400,background:type===t?"var(--color-background-primary)":"transparent",color:type===t?"#7F77DD":"var(--color-text-secondary)",boxShadow:type===t?"0 0 0 0.5px var(--color-border-tertiary)":"none"}}>
              {t==="monthly"?"Monthly":"Weekly"}
            </button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{background:"var(--color-background-secondary)",borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:500}}>Current progress</span>
            <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{done}/{total} complete</span>
          </div>
          <div style={{height:6,background:"var(--color-border-tertiary)",borderRadius:4,overflow:"hidden",marginBottom:12}}>
            <div style={{height:"100%",width:`${pct}%`,background:"#7F77DD",borderRadius:4,transition:"width .4s"}}/>
          </div>
          {filtered.length===0?<div style={{fontSize:12,color:"var(--color-text-tertiary)",fontStyle:"italic"}}>No {type} resolutions from active goals.</div>
          :filtered.map(r=>{
            const goal=goals.find(g=>g.id===r.goalId),c=goal?CATS[goal.category]:{color:"#888",bg:"#f0f0f0"};
            const dn=isDoneNow(r);
            return (
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:14,color:dn?"#1D9E75":"var(--color-text-tertiary)"}}>{dn?"✓":"○"}</span>
                <span style={{flex:1,fontSize:13,color:dn?"var(--color-text-secondary)":"var(--color-text-primary)",textDecoration:dn?"line-through":"none"}}>{r.title}</span>
                {goal&&<span style={{fontSize:10,padding:"1px 8px",borderRadius:10,background:c.bg,color:c.color,whiteSpace:"nowrap"}}>{CATS[goal.category].short}</span>}
              </div>
            );
          })}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:8}}>Write your reflection</div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={`What went well this ${type==="monthly"?"month":"week"}? What did you learn? What will you do differently?`} rows={4} style={{display:"block",width:"100%",fontSize:13,padding:"12px 14px",borderRadius:12,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",resize:"none",boxSizing:"border-box",lineHeight:1.7}}/>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
            <button onClick={submit} disabled={!note.trim()} style={{padding:"8px 22px",borderRadius:8,border:"none",background:note.trim()?"#7F77DD":"var(--color-background-secondary)",color:note.trim()?"#fff":"var(--color-text-tertiary)",cursor:note.trim()?"pointer":"default",fontSize:13,fontWeight:500}}>Save reflection</button>
          </div>
        </div>
        {pastReviews.length>0&&(
          <div>
            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Past reflections</div>
            {pastReviews.map(r=>(
              <div key={r.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)"}}>{r.date}</span>
                  <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:"#EEEDFE",color:"#7F77DD",fontWeight:500}}>{r.pct}% complete</span>
                </div>
                <div style={{fontSize:13,color:"var(--color-text-primary)",lineHeight:1.7}}>{r.note}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
