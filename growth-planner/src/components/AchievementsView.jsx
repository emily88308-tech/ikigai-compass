import { CATS, CAT_KEYS, GOAL_KINDS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { fmtTs, monthLabel } from "../lib/utils";
import LifeBalanceCard from "./LifeBalanceCard";

const ACCENT = "#1D9E75";

// A read-only "what I've accomplished" dashboard. Outcome goals contribute a
// completed-goals timeline; ongoing goals (which never "finish") earn their
// place through the volume of resolutions they've produced.
export default function AchievementsView() {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);

  const doneRes = resolutions.filter(r=>r.done);
  const achieved = goals.filter(g=>g.status==="achieved")
    .sort((a,b)=>(b.achievedAt||0)-(a.achievedAt||0));
  const activeCount = goals.filter(g=>(g.status||"active")==="active").length;
  const thisYear = new Date().getFullYear();
  const achievedThisYear = achieved.filter(g=>g.achievedAt && new Date(g.achievedAt).getFullYear()===thisYear).length;

  // Completed resolutions per life area — counts across goals of every status,
  // since output accumulates whether or not the parent goal is "done".
  const byCat = CAT_KEYS.map(k=>{
    const ids = new Set(goals.filter(g=>g.category===k).map(g=>g.id));
    const rs = resolutions.filter(r=>ids.has(r.goalId));
    return { k, done: rs.filter(r=>r.done).length, total: rs.length };
  });
  const maxDone = Math.max(1, ...byCat.map(c=>c.done));

  // Ongoing goals ranked by output produced.
  const ongoing = goals.filter(g=>g.kind==="ongoing").map(g=>({
    g, done: resolutions.filter(r=>r.goalId===g.id && r.done).length,
  })).sort((a,b)=>b.done-a.done);

  // Group the achieved goals into month buckets, preserving newest-first order.
  const buckets = [];
  for (const g of achieved) {
    const label = monthLabel(g.achievedAt);
    let b = buckets.find(x=>x.label===label);
    if (!b) { b={label,items:[]}; buckets.push(b); }
    b.items.push(g);
  }

  const tiles = [
    ["Goals achieved", achieved.length, ACCENT],
    [`Achieved in ${thisYear}`, achievedThisYear, "#7F77DD"],
    ["Resolutions done", doneRes.length, "#378ADD"],
    ["Active goals", activeCount, "#BA7517"],
  ];

  const nothingYet = achieved.length===0 && doneRes.length===0;

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100%"}}>
      <div style={{marginBottom:16,flexShrink:0}}>
        <h2 style={{margin:0,fontSize:17,fontWeight:500,color:ACCENT}}>Achievements</h2>
        <p style={{margin:"3px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>A record of what you've completed and produced across your Ikigai compass</p>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        {/* Headline counters */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:8,marginBottom:20}}>
          {tiles.map(([label,n,color])=>(
            <div key={label} style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:600,color}}>{n}</div>
              <div style={{fontSize:10.5,color:"var(--color-text-tertiary)",marginTop:3,lineHeight:1.3}}>{label}</div>
            </div>
          ))}
        </div>

        {nothingYet ? (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:34,marginBottom:12,opacity:.2}}>✦</div>
            <div style={{fontSize:14,color:"var(--color-text-tertiary)",lineHeight:1.7}}>Nothing to summarize yet.<br/>Complete a resolution or mark a goal Achieved, and it'll show up here.</div>
          </div>
        ) : (
          <>
            {/* Balance snapshot */}
            <LifeBalanceCard/>

            {/* Output by life area */}
            <div style={{background:"var(--color-background-secondary)",borderRadius:14,padding:16,marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>Output by life area</div>
              {byCat.every(c=>c.total===0)
                ? <div style={{fontSize:12,color:"var(--color-text-tertiary)",fontStyle:"italic"}}>No resolutions yet.</div>
                : byCat.map(({k,done,total})=>{
                    const c=CATS[k];
                    return (
                      <div key={k} style={{marginBottom:9}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:11,color:c.color,fontWeight:500}}>{c.label}</span>
                          <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{done} done{total?` / ${total}`:""}</span>
                        </div>
                        <div style={{height:5,background:"var(--color-border-tertiary)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${(done/maxDone)*100}%`,background:c.color,borderRadius:3,transition:"width .4s"}}/>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Ongoing momentum */}
            {ongoing.length>0 && (
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Ongoing momentum</div>
                {ongoing.map(({g,done})=>{
                  const c=CATS[g.category];
                  return (
                    <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"10px 14px",marginBottom:8}}>
                      <span style={{width:9,height:9,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                      <span style={{flex:1,minWidth:0,fontSize:13,color:"var(--color-text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.title}</span>
                      <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:GOAL_KINDS.ongoing.color+"14",color:GOAL_KINDS.ongoing.color,fontWeight:500,flexShrink:0}}>{done} output{done!==1?"s":""}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Completed goals timeline */}
            <div style={{marginBottom:8}}>
              <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Completed goals</div>
              {achieved.length===0
                ? <div style={{fontSize:12,color:"var(--color-text-tertiary)",fontStyle:"italic"}}>No goals marked Achieved yet.</div>
                : buckets.map(b=>(
                    <div key={b.label} style={{marginBottom:16}}>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)",fontWeight:500,marginBottom:8}}>{b.label}</div>
                      {b.items.map(g=>{
                        const c=CATS[g.category];
                        return (
                          <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderLeft:`3px solid ${c.color}`,marginBottom:8}}>
                            <span style={{flex:1,minWidth:0}}>
                              <span style={{display:"block",fontSize:13,color:"var(--color-text-primary)",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.title}</span>
                              <span style={{fontSize:11,color:c.color}}>{c.label}{g.kind==="ongoing"?" · ongoing":""}</span>
                            </span>
                            <span style={{fontSize:11,color:"var(--color-text-tertiary)",flexShrink:0}}>{g.achievedAt?fmtTs(g.achievedAt):"—"}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
