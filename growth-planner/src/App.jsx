import { useEffect } from "react";
import { isSupabaseConfigured } from "./lib/supabase";
import { useAuthStore } from "./store/authStore";
import { useUiStore } from "./store/uiStore";
import Auth from "./components/Auth";
import SetupNeeded from "./components/SetupNeeded";
import Sidebar from "./components/Sidebar";
import ActiveGoalsView from "./components/ActiveGoalsView";
import GoalListPane from "./components/GoalListPane";
import ResolutionsPane from "./components/ResolutionsPane";
import ReviewPane from "./components/ReviewPane";
import AICoach from "./components/AICoach";
import AddGoalModal from "./components/AddGoalModal";
import AddResolutionModal from "./components/AddResolutionModal";

export default function App() {
  const authReady = useAuthStore(s=>s.authReady);
  const user = useAuthStore(s=>s.user);
  const init = useAuthStore(s=>s.init);
  const page = useUiStore(s=>s.page);
  const addGoalOpen = useUiStore(s=>s.addGoalOpen);
  const addResCtx = useUiStore(s=>s.addResCtx);

  useEffect(()=>init(),[init]);

  if(!authReady) return null;
  if(!isSupabaseConfigured) return <SetupNeeded/>;
  if(!user) return <Auth/>;

  return (
    <div style={{display:"flex",height:"100svh",fontFamily:"var(--font-sans)",background:"var(--color-background-primary)",overflow:"hidden",position:"relative"}}>
      <Sidebar/>
      <div style={{flex:1,minWidth:0,padding:"22px 22px 18px",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {page==="coach" ? <AICoach/>
        : page==="review" ? <ReviewPane/>
        : page==="monthly"||page==="weekly" ? <ResolutionsPane type={page}/>
        : page==="someday" ? <GoalListPane title="Someday" subtitle="Goals parked for later — revisit when the time is right" filterStatus="someday" accentColor="#BA7517" emptyIcon="◷" emptyMsg={"No goals here yet.\nPark a goal as Someday when you're not ready to pursue it."}/>
        : page==="achieved" ? <GoalListPane title="Achieved" subtitle="Goals you've accomplished — a record of your growth" filterStatus="achieved" accentColor="#1D9E75" emptyIcon="✓" emptyMsg={"Nothing here yet.\nMark a goal as Achieved when you reach it."}/>
        : <ActiveGoalsView/>}
      </div>

      {addGoalOpen && <AddGoalModal/>}
      {addResCtx && <AddResolutionModal/>}
    </div>
  );
}
