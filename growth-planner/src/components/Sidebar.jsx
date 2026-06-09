import { CATS, CAT_KEYS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import SideNavBtn from "./SideNavBtn";

export default function Sidebar() {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);
  const email = useAuthStore(s=>s.user?.email);
  const signOut = useAuthStore(s=>s.signOut);
  const page = useUiStore(s=>s.page);
  const setPage = useUiStore(s=>s.setPage);

  const activeGoals = goals.filter(g=>(g.status||"active")==="active");

  return (
    <div style={{width:196,flexShrink:0,background:"var(--color-background-secondary)",borderRight:"0.5px solid var(--color-border-tertiary)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <div style={{padding:"18px 16px 16px"}}>
        <div style={{fontWeight:500,fontSize:15,color:"var(--color-text-primary)",marginBottom:3}}>Growth planner</div>
        <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:12}}>Goals · Resolutions · Wisdom</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:6}}>
          {[["Active",activeGoals.length,"#7F77DD"],["Monthly",resolutions.filter(r=>r.type==="monthly").length,"#1D9E75"],["Weekly",resolutions.filter(r=>r.type==="weekly").length,"#378ADD"],["Anytime",resolutions.filter(r=>r.type==="anytime").length,"#BA7517"]].map(([l,n,c])=>(
            <div key={l} style={{background:"var(--color-background-primary)",borderRadius:8,padding:"7px 6px",textAlign:"center",border:"0.5px solid var(--color-border-tertiary)"}}>
              <div style={{fontSize:16,fontWeight:500,color:c}}>{n}</div>
              <div style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"6px 16px 5px",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Active goals</div>
      <SideNavBtn id="active" label="All active" active={page==="active"} onClick={setPage}/>
      {CAT_KEYS.map(k=><SideNavBtn key={k} id={`cat:${k}`} label={CATS[k].label} cat={k} count={activeGoals.filter(g=>g.category===k).length} active={page===`cat:${k}`} onClick={setPage}/>)}

      <div style={{padding:"14px 16px 5px",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Backlog</div>
      <SideNavBtn id="someday" label="Someday" count={goals.filter(g=>g.status==="someday").length} active={page==="someday"} onClick={setPage}/>
      <SideNavBtn id="achieved" label="Done" count={goals.filter(g=>g.status==="achieved").length} active={page==="achieved"} onClick={setPage}/>
      <SideNavBtn id="archived" label="Archived" count={goals.filter(g=>g.status==="archived").length} active={page==="archived"} onClick={setPage}/>

      <div style={{padding:"14px 16px 5px",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Resolutions</div>
      <SideNavBtn id="monthly" label="Monthly" active={page==="monthly"} onClick={setPage}/>
      <SideNavBtn id="weekly" label="Weekly" active={page==="weekly"} onClick={setPage}/>
      <SideNavBtn id="anytime" label="Anytime" active={page==="anytime"} onClick={setPage}/>

      <div style={{padding:"14px 16px 5px",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Reflect</div>
      <SideNavBtn id="achievements" label="Achievements" count={goals.filter(g=>g.status==="achieved").length} active={page==="achievements"} onClick={setPage}/>
      <SideNavBtn id="review" label="Review" active={page==="review"} onClick={setPage}/>
      <SideNavBtn id="coach" label="AI coach" active={page==="coach"} onClick={setPage}/>
      <div style={{flex:1}}/>
      <div style={{padding:"12px 16px",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
        <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</div>
        <button onClick={signOut} style={{fontSize:12,color:"var(--color-text-secondary)",background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>Sign out</button>
      </div>
    </div>
  );
}
