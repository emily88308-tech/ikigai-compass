import { CATS, CAT_KEYS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import GoalCard from "./GoalCard";

export default function GoalListPane({ title, subtitle, filterStatus, accentColor, emptyIcon, emptyMsg }) {
  const goals = useGoalsStore(s=>s.goals);
  const shown = goals.filter(g=>(g.status||"active")===filterStatus);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100%"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexShrink:0}}>
        <div>
          <h2 style={{margin:0,fontSize:17,fontWeight:500,color:accentColor||"var(--color-text-primary)"}}>{title}</h2>
          <p style={{margin:"3px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>{subtitle}</p>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {shown.length===0?(
          <div style={{textAlign:"center",padding:"50px 20px"}}>
            <div style={{fontSize:34,marginBottom:12,opacity:.2}}>{emptyIcon||"◈"}</div>
            <div style={{fontSize:14,color:"var(--color-text-tertiary)",lineHeight:1.7}}>{emptyMsg}</div>
          </div>
        ):CAT_KEYS.map(k=>{
          const gs=shown.filter(g=>g.category===k);
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
        })}
      </div>
    </div>
  );
}
