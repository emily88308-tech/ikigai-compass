import { useState } from "react";
import { CATS } from "../lib/constants";
import { useGoalsStore } from "../store/goalsStore";
import { fmtDateStr, todayISO } from "../lib/utils";

const ACCENT = "#7F77DD";
const WEEKDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const pad = (x) => String(x).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// A month grid of resolution completions. Each day shows a coloured dot per
// life area completed that day; tapping a day lists what was completed.
export default function CalendarView() {
  const goals = useGoalsStore(s=>s.goals);
  const resolutions = useGoalsStore(s=>s.resolutions);

  const now = new Date();
  const [y,setY]=useState(now.getFullYear());
  const [m,setM]=useState(now.getMonth()); // 0-11
  const [sel,setSel]=useState(todayISO());

  // date(YYYY-MM-DD) → [{ title, cat, goalTitle }]
  const byDate = {};
  for (const r of resolutions) {
    const goal = goals.find(g=>g.id===r.goalId);
    if (!goal) continue;
    for (const comp of (r.completions||[])) {
      (byDate[comp.date] ||= []).push({ title: r.title, cat: goal.category, goalTitle: goal.title });
    }
  }

  const startDow = (new Date(y, m, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(startDow).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const monthLabel = new Date(y, m, 1).toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const today = todayISO();

  function shift(delta){
    let nm=m+delta, ny=y;
    if(nm<0){nm=11;ny--;} else if(nm>11){nm=0;ny++;}
    setM(nm); setY(ny); setSel(null);
  }
  function goToday(){ setY(now.getFullYear()); setM(now.getMonth()); setSel(today); }

  const selEntries = sel ? (byDate[sel]||[]) : [];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100%"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexShrink:0}}>
        <div>
          <h2 style={{margin:0,fontSize:17,fontWeight:500,color:ACCENT}}>Calendar</h2>
          <p style={{margin:"3px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>When you completed what, across your Ikigai compass</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={()=>shift(-1)} aria-label="Previous month" style={navBtn}>‹</button>
          <span style={{fontSize:13,fontWeight:500,minWidth:120,textAlign:"center"}}>{monthLabel}</span>
          <button onClick={()=>shift(1)} aria-label="Next month" style={navBtn}>›</button>
          <button onClick={goToday} style={{...navBtn,width:"auto",padding:"0 12px",fontSize:12,fontWeight:500,color:ACCENT}}>Today</button>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        {/* Weekday header */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",gap:6,marginBottom:6}}>
          {WEEKDAYS.map(w=><div key={w} style={{textAlign:"center",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.04em"}}>{w}</div>)}
        </div>

        {/* Day grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",gap:6}}>
          {cells.map((d,i)=>{
            if(d===null) return <div key={`b${i}`}/>;
            const date=iso(y,m,d);
            const entries=byDate[date]||[];
            const cats=[...new Set(entries.map(e=>e.cat))];
            const isToday=date===today, isSel=date===sel;
            return (
              <button key={date} onClick={()=>setSel(isSel?null:date)} style={{
                aspectRatio:"1",border:`1px solid ${isSel?ACCENT:"var(--color-border-tertiary)"}`,
                borderRadius:10,background:isSel?"#EEEDFE":isToday?"var(--color-background-secondary)":"var(--color-background-primary)",
                cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",
                padding:"5px 2px",gap:3,minWidth:0,position:"relative",
              }}>
                <span style={{fontSize:12,fontWeight:isToday?600:400,color:isToday?ACCENT:"var(--color-text-secondary)"}}>{d}</span>
                <div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center"}}>
                  {cats.slice(0,4).map(k=><span key={k} style={{width:6,height:6,borderRadius:"50%",background:CATS[k].color}}/>)}
                  {cats.length>4&&<span style={{fontSize:8,color:"var(--color-text-tertiary)",lineHeight:1}}>+{cats.length-4}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected-day detail */}
        {sel && (
          <div style={{marginTop:18}}>
            <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:10}}>{fmtDateStr(sel)}</div>
            {selEntries.length===0
              ? <div style={{fontSize:13,color:"var(--color-text-tertiary)",fontStyle:"italic"}}>Nothing completed this day.</div>
              : selEntries.map((e,i)=>{
                  const c=CATS[e.cat];
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,background:"var(--color-background-secondary)",marginBottom:7}}>
                      <span style={{color:"#1D9E75",fontSize:13}}>✓</span>
                      <span style={{flex:1,minWidth:0,fontSize:13,color:"var(--color-text-primary)"}}>{e.title}</span>
                      <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:c.bg,color:c.color,fontWeight:500,whiteSpace:"nowrap"}}>{c.short}</span>
                    </div>
                  );
                })}
          </div>
        )}
      </div>
    </div>
  );
}

const navBtn = {width:30,height:30,borderRadius:8,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:16,color:"var(--color-text-secondary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0};
