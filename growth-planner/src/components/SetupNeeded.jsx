export default function SetupNeeded() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"var(--font-sans)",background:"var(--color-background-secondary)",padding:20}}>
      <div style={{width:"min(520px,94vw)",background:"var(--color-background-primary)",borderRadius:18,border:"0.5px solid var(--color-border-tertiary)",padding:32,boxSizing:"border-box"}}>
        <div style={{fontWeight:500,fontSize:20,color:"var(--color-text-primary)",marginBottom:6}}>Growth planner — setup needed</div>
        <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,marginBottom:18}}>
          Supabase isn't configured yet, so there's nowhere to sign in or store data. Create a file named <code style={{background:"var(--color-background-secondary)",padding:"1px 6px",borderRadius:6}}>.env.local</code> inside the <code style={{background:"var(--color-background-secondary)",padding:"1px 6px",borderRadius:6}}>growth-planner</code> folder with:
        </div>
        <pre style={{fontSize:12,background:"var(--color-background-secondary)",borderRadius:10,padding:"14px 16px",overflowX:"auto",lineHeight:1.6,color:"var(--color-text-primary)",margin:"0 0 18px"}}>{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}</pre>
        <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7}}>
          Find both under <b>Supabase → Project Settings → API</b>. Then <b>restart the dev server</b> (Vite only reads env files at startup).
        </div>
      </div>
    </div>
  );
}
