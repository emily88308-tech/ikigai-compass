import { useState, useEffect, useRef } from "react";
import { CATS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";

export default function AICoach() {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);

  const [msgs,setMsgs]=useState([{role:"assistant",text:"Hi! I'm your personal growth coach. I know your goals and what drives them — ask me anything. I can help you reflect, stay motivated, or plan your next step."}]);
  const [input,setInput]=useState(""),[loading,setLoading]=useState(false);
  const bottomRef=useRef();
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  async function send(){
    if(!input.trim()||loading) return;
    const userMsg=input.trim(); setInput(""); setLoading(true);
    setMsgs(m=>[...m,{role:"user",text:userMsg}]);
    try {
      const ctx=goals.length?goals.map(g=>{
        const res=resolutions.filter(r=>r.goalId===g.id);
        return `[${CATS[g.category].label}][${g.status||"active"}] "${g.title}"${g.why?` (Why: "${g.why}")`:""}. Resolutions: ${res.map(r=>`${r.type}: "${r.title}" (${r.done?"done":"pending"})`).join(", ")||"none"}`;
      }).join("\n"):"No goals yet.";
      const history=msgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const res=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({context:ctx,messages:[...history,{role:"user",content:userMsg}]})});
      const data=await res.json();
      setMsgs(m=>[...m,{role:"assistant",text:data.reply||"Something went wrong."}]);
    } catch { setMsgs(m=>[...m,{role:"assistant",text:"Something went wrong. Try again?"}]); }
    setLoading(false);
  }
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",height:"100%",minWidth:0}}>
      <div style={{marginBottom:16,flexShrink:0}}>
        <h2 style={{margin:0,fontSize:17,fontWeight:500}}>AI coach</h2>
        <p style={{margin:"3px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>Knows your goals and your why</p>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingBottom:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"10px 14px",fontSize:13,lineHeight:1.7,
              borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
              background:m.role==="user"?"#7F77DD":"var(--color-background-secondary)",
              color:m.role==="user"?"#fff":"var(--color-text-primary)"}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex"}}><div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",fontSize:13,background:"var(--color-background-secondary)",color:"var(--color-text-tertiary)"}}>Thinking…</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,paddingTop:10,borderTop:"0.5px solid var(--color-border-tertiary)",flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask your coach…" style={{flex:1,fontSize:13,padding:"9px 12px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)"}}/>
        <button onClick={send} disabled={!input.trim()||loading} style={{padding:"9px 18px",borderRadius:10,border:"none",background:input.trim()&&!loading?"#7F77DD":"var(--color-background-secondary)",color:input.trim()&&!loading?"#fff":"var(--color-text-tertiary)",cursor:input.trim()&&!loading?"pointer":"default",fontSize:13,fontWeight:500}}>Send</button>
      </div>
    </div>
  );
}
