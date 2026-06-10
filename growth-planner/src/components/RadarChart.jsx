import { CATS, CAT_KEYS, effortWeight } from "../lib/constants";
import { isDoneNow } from "../lib/recurrence";

export default function RadarChart({ goals, resolutions }) {
  const active = goals.filter(g=>g.status==="active");
  const W=260,H=232,cx=128,cy=114,maxR=62,labelR=86,n=CAT_KEYS.length;
  const scores = CAT_KEYS.map(k=>{
    const cg=active.filter(g=>g.category===k);
    if(!cg.length) return 0;
    const cr=resolutions.filter(r=>cg.some(g=>g.id===r.goalId));
    if(!cr.length) return 0.13;
    const totalW=cr.reduce((s,r)=>s+effortWeight(r.effort),0);
    const doneW=cr.reduce((s,r)=>s+(isDoneNow(r)?effortWeight(r.effort):0),0);
    return Math.max(0.08,totalW?doneW/totalW:0);
  });
  function pt(i,r){ const a=-Math.PI/2+(2*Math.PI/n)*i; return [cx+r*Math.cos(a),cy+r*Math.sin(a)]; }
  function poly(pts){ return pts.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z"; }
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}} role="img" aria-label="Life balance radar chart">
      {[.25,.5,.75,1].map(s=><path key={s} d={poly(CAT_KEYS.map((_,i)=>pt(i,maxR*s)))} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={s===1?1:0.5}/>)}
      {CAT_KEYS.map((_,i)=>{ const[x,y]=pt(i,maxR); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-border-tertiary)" strokeWidth={0.5}/>; })}
      <path d={poly(CAT_KEYS.map((_,i)=>pt(i,maxR*scores[i])))} fill="#7F77DD1A" stroke="#7F77DD" strokeWidth={2} strokeLinejoin="round"/>
      {CAT_KEYS.map((k,i)=>{ const[x,y]=pt(i,maxR*scores[i]); return <circle key={i} cx={x} cy={y} r={4} fill={CATS[k].color}/>; })}
      {CAT_KEYS.map((k,i)=>{ const[x,y]=pt(i,labelR); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fill={CATS[k].color} fontWeight="500">{CATS[k].short}</text>; })}
    </svg>
  );
}
