import { useRef, useState } from "react";
import { CATS, CAT_KEYS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import SideNavBtn from "./SideNavBtn";

const MIN_W = 180, MAX_W = 420, DEFAULT_W = 208, STORE_KEY = "sidebarWidth";

const initialWidth = () => {
  const saved = Number(localStorage.getItem(STORE_KEY));
  return saved >= MIN_W && saved <= MAX_W ? saved : DEFAULT_W;
};

export default function Sidebar() {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);
  const email = useAuthStore(s=>s.user?.email);
  const signOut = useAuthStore(s=>s.signOut);
  const page = useUiStore(s=>s.page);
  const setPage = useUiStore(s=>s.setPage);

  const [width,setWidth]=useState(initialWidth);
  const widthRef=useRef(width);

  // Drag the right edge to resize. Listeners are attached only for the duration
  // of the drag, and the final width is persisted so it survives reloads.
  function startDrag(e){
    e.preventDefault();
    document.body.style.cursor="col-resize";
    document.body.style.userSelect="none";
    const onMove=(ev)=>{ const w=Math.min(MAX_W,Math.max(MIN_W,ev.clientX)); widthRef.current=w; setWidth(w); };
    const onUp=()=>{
      window.removeEventListener("mousemove",onMove);
      window.removeEventListener("mouseup",onUp);
      document.body.style.cursor="";
      document.body.style.userSelect="";
      localStorage.setItem(STORE_KEY,String(widthRef.current));
    };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
  }

  const activeGoals = goals.filter(g=>(g.status||"active")==="active");

  return (
    <div style={{position:"relative",width,flexShrink:0,height:"100%",background:"var(--color-background-secondary)",borderRight:"0.5px solid var(--color-border-tertiary)"}}>
      <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"18px 16px 16px"}}>
          <div style={{fontWeight:500,fontSize:15,color:"var(--color-text-primary)",marginBottom:3}}>Growth planner</div>
          <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:12}}>Goals · Resolutions · Wisdom</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4, minmax(0, 1fr))",gap:6}}>
            {[["Active",activeGoals.length,"#7F77DD"],["Monthly",resolutions.filter(r=>r.type==="monthly").length,"#1D9E75"],["Weekly",resolutions.filter(r=>r.type==="weekly").length,"#378ADD"],["Anytime",resolutions.filter(r=>r.type==="anytime").length,"#BA7517"]].map(([l,n,c])=>(
              <div key={l} style={{background:"var(--color-background-primary)",borderRadius:8,padding:"7px 4px",textAlign:"center",border:"0.5px solid var(--color-border-tertiary)",minWidth:0}}>
                <div style={{fontSize:16,fontWeight:500,color:c}}>{n}</div>
                <div style={{fontSize:10,color:"var(--color-text-tertiary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{padding:"6px 16px 5px",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Active goals</div>
        <SideNavBtn id="active" label="All active" active={page==="active"} onClick={setPage}/>
        {CAT_KEYS.map(k=><SideNavBtn key={k} id={`cat:${k}`} label={CATS[k].label} cat={k} count={activeGoals.filter(g=>g.category===k).length} active={page===`cat:${k}`} onClick={setPage}/>)}

        <div style={{padding:"14px 16px 5px",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Backlog</div>
        <SideNavBtn id="someday" label="Someday" count={goals.filter(g=>g.status==="someday").length} active={page==="someday"} onClick={setPage}/>

        <div style={{padding:"14px 16px 5px",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Closed</div>
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

      {/* Resize handle — sits over the right edge, full height. */}
      <div onMouseDown={startDrag} title="Drag to resize" style={{position:"absolute",top:0,right:-2,width:6,height:"100%",cursor:"col-resize",zIndex:10}}/>
    </div>
  );
}
