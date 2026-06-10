import { useEffect } from "react";
import { isSupabaseConfigured } from "./lib/supabase";
import { useAuthStore } from "./store/authStore";
import { useUiStore } from "./store/uiStore";
import { useIsMobile } from "./hooks/useWindowSize";
import Auth from "./components/Auth";
import SetupNeeded from "./components/SetupNeeded";
import Sidebar from "./components/Sidebar";
import MobileLayout from "./components/MobileLayout";
import ActiveGoalsView from "./components/ActiveGoalsView";
import GoalListPane from "./components/GoalListPane";
import ResolutionsPane from "./components/ResolutionsPane";
import ReviewPane from "./components/ReviewPane";
import AchievementsView from "./components/AchievementsView";
import CalendarView from "./components/CalendarView";
import AICoach from "./components/AICoach";
import AddGoalModal from "./components/AddGoalModal";
import AddResolutionModal from "./components/AddResolutionModal";
import Toast from "./components/Toast";

// Maps the current page to its view. Shared by the desktop and mobile shells.
function PageContent({ page }) {
  if (page === "coach") return <AICoach/>;
  if (page === "achievements") return <AchievementsView/>;
  if (page === "calendar") return <CalendarView/>;
  if (page === "review") return <ReviewPane/>;
  if (page === "monthly" || page === "weekly" || page === "anytime") return <ResolutionsPane type={page}/>;
  if (page === "someday") return <GoalListPane title="Someday" subtitle="Goals parked for later — revisit when the time is right" filterStatus="someday" accentColor="#BA7517" emptyIcon="◷" emptyMsg={"No goals here yet.\nPark a goal as Someday when you're not ready to pursue it."}/>;
  if (page === "achieved") return <GoalListPane title="Done" subtitle="Goals you've completed — a record of your growth" filterStatus="achieved" accentColor="#1D9E75" emptyIcon="✓" emptyMsg={"Nothing here yet.\nMark a goal as Done when you complete it."}/>;
  if (page === "archived") return <GoalListPane title="Archived" subtitle="Ongoing goals you've retired — kept for history, out of your active view" filterStatus="archived" accentColor="#6E7787" emptyIcon="▤" emptyMsg={"Nothing archived.\nArchive an ongoing goal when you stop tracking it."}/>;
  return <ActiveGoalsView/>;
}

export default function App() {
  const authReady = useAuthStore(s=>s.authReady);
  const user = useAuthStore(s=>s.user);
  const init = useAuthStore(s=>s.init);
  const page = useUiStore(s=>s.page);
  const addGoalOpen = useUiStore(s=>s.addGoalOpen);
  const addResCtx = useUiStore(s=>s.addResCtx);
  const isMobile = useIsMobile();

  useEffect(()=>init(),[init]);

  if(!authReady) return null;
  if(!isSupabaseConfigured) return <SetupNeeded/>;
  if(!user) return <Auth/>;

  const modals = (
    <>
      {addGoalOpen && <AddGoalModal/>}
      {addResCtx && <AddResolutionModal/>}
      <Toast/>
    </>
  );

  if (isMobile) {
    return (
      <>
        <MobileLayout><PageContent page={page}/></MobileLayout>
        {modals}
      </>
    );
  }

  return (
    <div style={{display:"flex",height:"100svh",fontFamily:"var(--font-sans)",background:"var(--color-background-primary)",overflow:"hidden",position:"relative"}}>
      <Sidebar/>
      <div style={{flex:1,minWidth:0,padding:"22px 22px 18px",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <PageContent page={page}/>
      </div>
      {modals}
    </div>
  );
}
