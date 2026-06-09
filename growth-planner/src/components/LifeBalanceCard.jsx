import { CATS, CAT_KEYS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useIsMobile } from "../hooks/useWindowSize";
import { isDoneNow } from "../lib/recurrence";
import RadarChart from "./RadarChart";

export default function LifeBalanceCard() {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);
  const activeGoals = goals.filter(g=>(g.status||"active")==="active");
  const isMobile = useIsMobile();

  return (
    <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:isMobile?6:12,marginBottom:20,background:"var(--color-background-secondary)",borderRadius:14,padding:14,alignItems:"center"}}>
      <div style={{width:isMobile?220:180,maxWidth:"100%",flexShrink:0}}><RadarChart goals={goals} resolutions={resolutions}/></div>
      <div style={{flex:1,minWidth:0,width:isMobile?"100%":"auto"}}>
        <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>Life balance</div>
        {CAT_KEYS.map(k=>{
          const cg=activeGoals.filter(g=>g.category===k);
          const cr=resolutions.filter(r=>cg.some(g=>g.id===r.goalId));
          const pct=cr.length?Math.round(cr.filter(isDoneNow).length/cr.length*100):0;
          const c=CATS[k];
          return (
            <div key={k} style={{marginBottom:7}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:c.color,fontWeight:500}}>{c.short}</span>
                <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{cg.length} goal{cg.length!==1?"s":""}{cr.length?` · ${pct}%`:""}</span>
              </div>
              <div style={{height:4,background:"var(--color-border-tertiary)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:cr.length?`${pct}%`:cg.length?"12%":"0%",background:c.color,borderRadius:2,transition:"width .4s"}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
