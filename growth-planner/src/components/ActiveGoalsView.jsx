import { CATS, CAT_KEYS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useUiStore } from "../store/uiStore";
import GoalCard from "./GoalCard";
import LifeBalanceCard from "./LifeBalanceCard";

export default function ActiveGoalsView() {
  const goals = useGoalsStore(s=>s.goals);
  const page = useUiStore(s=>s.page);
  const openAddGoal = useUiStore(s=>s.openAddGoal);

  const activeCat = page.startsWith("cat:") ? page.slice(4) : null;
  const activeGoals = goals.filter(g=>(g.status||"active")==="active");
  const shownGoals = activeCat ? activeGoals.filter(g=>g.category===activeCat) : activeGoals;

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100%"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexShrink:0}}>
        <div>
          <h2 style={{margin:0,fontSize:17,fontWeight:500,color:activeCat?CATS[activeCat].color:"var(--color-text-primary)"}}>{activeCat?CATS[activeCat].label:"All active goals"}</h2>
          <p style={{margin:"3px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>{shownGoals.length} goal{shownGoals.length!==1?"s":""}</p>
        </div>
        <button onClick={openAddGoal} style={{padding:"7px 18px",borderRadius:8,border:"none",background:activeCat?CATS[activeCat].color:"#7F77DD",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500,flexShrink:0}}>+ New goal</button>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {page==="active"&&<LifeBalanceCard/>}
        {shownGoals.length===0?(
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:34,marginBottom:12,opacity:.2}}>◈</div>
            <div style={{fontSize:14,color:"var(--color-text-tertiary)",lineHeight:1.7}}>No active goals here yet.<br/>Add one — or activate a goal from your Someday list.</div>
          </div>
        ):page==="active"?(
          CAT_KEYS.map(k=>{
            const gs=shownGoals.filter(g=>g.category===k);
            if(!gs.length) return null;
            return (
              <div key={k} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:8,borderBottom:`0.5px solid ${CATS[k].color}33`}}>
                  <span style={{width:9,height:9,borderRadius:"50%",background:CATS[k].color,display:"inline-block",flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:500,color:CATS[k].color,textTransform:"uppercase",letterSpacing:"0.05em"}}>{CATS[k].label}</span>
                  <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{gs.length}</span>
                </div>
                {gs.map(g=><GoalCard key={g.id} goal={g} showStatus={false}/>)}
              </div>
            );
          })
        ):(
          shownGoals.map(g=><GoalCard key={g.id} goal={g} showStatus={false}/>)
        )}
      </div>
    </div>
  );
}
