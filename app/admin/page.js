"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { buildCss, DEFAULTS, FONT_LIST } from "../../lib/theme";

const TABS = [["dashboard", "Dashboard"], ["profile", "Profile"], ["skills", "Skills"], ["projects", "Projects"], ["css", "CSS"], ["certificates", "Certificates"], ["requests", "Requests"]];

export default function Admin() {
  const [tab, setTab] = useState("dashboard"); const [user, setUser] = useState(null); const [cred, setCred] = useState({ email: "", password: "" });
  const [p, setP] = useState({}); const [skills, setSkills] = useState([]); const [projects, setProjects] = useState([]); const [reqs, setReqs] = useState([]);
  const [vis, setVis] = useState({ total: 0, unique: 0, today: 0 }); const [msg, setMsg] = useState("");
  const [sk, setSk] = useState({ name: "", description: "" }); const [pr, setPr] = useState({ title: "", description: "", link: "", image_url: "" });
  const [certs, setCerts] = useState([]); const [ct, setCt] = useState({ title: "", image_url: "" }); const [st, setSt] = useState({ ...DEFAULTS });
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 2500); };
  const load = async () => {
    const pf = (await supabase.from("profile").select("*").eq("id", 1).single()).data || {}; setP(pf);
    try { setSt({ ...DEFAULTS, ...JSON.parse(pf.style_json || "{}") }); } catch {}
    setCerts((await supabase.from("certificates").select("*").order("id", { ascending: false })).data || []);
    setSkills((await supabase.from("skills").select("*").order("id")).data || []);
    setProjects((await supabase.from("projects").select("*").order("id", { ascending: false })).data || []);
    setReqs((await supabase.from("requests").select("*").order("id", { ascending: false })).data || []);
    const v = (await supabase.rpc("visit_stats")).data; if (v) setVis(v);
  };
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user || null); if (data.session) load(); }); }, []);
  const login = async () => { const { data, error } = await supabase.auth.signInWithPassword(cred); if (error) return setMsg(error.message); setUser(data.user); load(); };
  const upImg = async (e, prefix, done) => { const f = e.target.files[0]; if (!f) return; const path = prefix + Date.now() + "-" + f.name;
    const { error } = await supabase.storage.from("avatars").upload(path, f); if (error) return flash(error.message);
    done(supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl); };
  const save = async () => { const { error } = await supabase.from("profile").upsert({ ...p, id: 1 }); flash(error ? error.message : "Saved ✓"); };
  const saveCss = async () => { const { error } = await supabase.from("profile").update({ custom_css: p.custom_css || "", style_json: JSON.stringify(st) }).eq("id", 1); flash(error ? error.message : "Design saved ✓"); };
  const addCert = async () => { if (!ct.title || !ct.image_url) return flash("Add a title and an image"); await supabase.from("certificates").insert(ct); setCt({ title: "", image_url: "" }); load(); };
  const num = (k, l, min, max, u = "px") => <label key={k}>{l}: <b>{st[k]}{u}</b><input type="range" min={min} max={max} value={st[k]} onChange={e => setSt({ ...st, [k]: +e.target.value })} /></label>;
  const col = (k, l) => <label key={k}>{l}<input type="color" value={st[k]} onChange={e => setSt({ ...st, [k]: e.target.value })} /></label>;
  const fnt = (k, l) => <label key={k}>{l}<select value={st[k]} onChange={e => setSt({ ...st, [k]: e.target.value })}>{FONT_LIST.map(f => <option key={f}>{f}</option>)}</select></label>;
  const addSkill = async () => { if (!sk.name) return; await supabase.from("skills").insert(sk); setSk({ name: "", description: "" }); load(); };
  const addProj = async () => { if (!pr.title) return; await supabase.from("projects").insert(pr); setPr({ title: "", description: "", link: "", image_url: "" }); load(); };
  const del = async (t, id) => { await supabase.from(t).delete().eq("id", id); load(); };
  const setStatus = async (id, status) => { await supabase.from("requests").update({ status }).eq("id", id); load(); };
  const copy = (t) => { navigator.clipboard.writeText(t); flash("Email copied ✓"); };
  const F = (k, label, area) => (<label>{label}{area ? <textarea rows={3} value={p[k] || ""} onChange={e => setP({ ...p, [k]: e.target.value })} /> : <input value={p[k] || ""} onChange={e => setP({ ...p, [k]: e.target.value })} />}</label>);
  const S = (n, l) => <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>;
  const solved = reqs.filter(r => r.status === "solved").length, pending = reqs.length - solved;

  const style = <style>{`.anav{position:sticky;top:0;z-index:20;display:flex;gap:8px;flex-wrap:wrap;padding:12px;margin-bottom:24px;border-radius:20px;background:rgba(15,20,35,.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1)}
  .anav button{padding:10px 18px;border-radius:999px;border:0;background:transparent;color:#9aa4b8;font:inherit;cursor:pointer}.anav button.on{background:#2f6bff;color:#fff}
  .admin select{width:100%;padding:12px;margin:6px 0 12px;border-radius:12px;border:1px solid #26314f;background:#0d1426;color:#fff;font:inherit}.admin input[type=color]{height:44px;padding:4px}.admin input[type=range]{padding:0}.admin label{display:block}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px}.stat{padding:20px;border-radius:18px;background:#0d1426;border:1px solid rgba(255,255,255,.08)}
  .stat b{display:block;font-size:34px;color:#2f8bff}.stat span{color:#8d97ab}.tag{padding:2px 12px;border-radius:999px;font-size:13px}.ok{background:#0b3d22;color:#00e676}.pend{background:#4a3a0a;color:#ffc107}`}</style>;

  if (!user) return (<div className="admin">{style}<div className="box"><h2>Admin Login</h2>
    <input placeholder="Email" onChange={e => setCred({ ...cred, email: e.target.value })} />
    <input type="password" placeholder="Password" onChange={e => setCred({ ...cred, password: e.target.value })} />
    <button className="btn pri" onClick={login}>Login</button><p style={{ color: "#ff6b6b" }}>{msg}</p></div></div>);

  return (<div className="admin">{style}{msg && <div className="toast">{msg}</div>}
    <div className="anav">{TABS.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}{k === "requests" && pending > 0 ? " (" + pending + ")" : ""}</button>)}
      <button style={{ marginLeft: "auto" }} onClick={async () => { await supabase.auth.signOut(); setUser(null); }}>Logout</button></div>

    {tab === "dashboard" && <><h2>Dashboard</h2>
      <h3 style={{ margin: "12px 0" }}>Visitors</h3><div className="stats">{S(vis.total, "Total visits")}{S(vis.unique, "People visited")}{S(vis.today, "Visits today")}</div>
      <h3 style={{ margin: "12px 0" }}>Requests</h3><div className="stats">{S(reqs.length, "Total requests")}{S(solved, "Solved")}{S(pending, "Pending")}</div></>}

    {tab === "profile" && <div className="box"><h3>Profile</h3>
      {p.avatar_url && <img src={p.avatar_url} width={120} style={{ borderRadius: 14, marginBottom: 10 }} />}
      <input type="file" accept="image/*" onChange={e => upImg(e, "", async url => { setP({ ...p, avatar_url: url }); await supabase.from("profile").upsert({ ...p, id: 1, avatar_url: url }); flash("Photo updated ✓"); })} />
      {F("name", "Name")}{F("title", "Title")}{F("bio", "Bio", 1)}{F("status", "Status badge")}{F("tags", "Tags")}
      {F("email", "Email")}{F("phone", "Phone")}{F("github", "GitHub URL")}{F("linkedin", "LinkedIn URL")}
      <button className="btn pri" onClick={save}>Save</button></div>}

    {tab === "skills" && <div className="box"><h3>Skills</h3>
      <input placeholder="Skill name" value={sk.name} onChange={e => setSk({ ...sk, name: e.target.value })} />
      <textarea placeholder="Skill description" rows={2} value={sk.description} onChange={e => setSk({ ...sk, description: e.target.value })} />
      <button className="btn pri" onClick={addSkill}>Add Skill</button>
      {skills.map(s => <div className="item" key={s.id}><span><b>{s.name}</b> — {s.description}</span><button className="btn" onClick={() => del("skills", s.id)}>Delete</button></div>)}</div>}

    {tab === "projects" && <div className="box"><h3>Projects</h3>
      <input placeholder="Title" value={pr.title} onChange={e => setPr({ ...pr, title: e.target.value })} />
      <textarea placeholder="Description" rows={3} value={pr.description} onChange={e => setPr({ ...pr, description: e.target.value })} />
      {pr.image_url && <img src={pr.image_url} width={140} style={{ borderRadius: 10, display: "block", marginBottom: 8 }} />}
      <input type="file" accept="image/*" onChange={e => upImg(e, "proj-", url => { setPr({ ...pr, image_url: url }); flash("Project image added ✓"); })} />
      <input placeholder="Link (https://...)" value={pr.link} onChange={e => setPr({ ...pr, link: e.target.value })} />
      <button className="btn pri" onClick={addProj}>Add Project</button>
      {projects.map(x => <div className="item" key={x.id}><span>{x.title}</span><button className="btn" onClick={() => del("projects", x.id)}>Delete</button></div>)}</div>}

    {tab === "css" && <div><h2>Design / CSS</h2>
      <div className="box"><h3>Navbar</h3>{col("navBg", "Background color")}{col("navText", "Text color")}{fnt("navFont", "Font")}{num("navSize", "Font size", 12, 26)}{num("navPad", "Navbar height", 4, 30)}</div>
      <div className="box"><h3>Name (main heading)</h3>{fnt("nameFont", "Font")}{num("nameSize", "Font size", 32, 120)}{col("nameColor", "Color")}</div>
      <div className="box"><h3>Image</h3>{num("imgWidth", "Image width", 240, 600)}{num("imgRadius", "Corner roundness", 0, 60)}</div>
      <div className="box"><h3>Headings (My Skills, My Projects...)</h3>{fnt("hFont", "Font")}{num("hSize", "Font size", 20, 64)}{col("hColor", "Color")}</div>
      <div className="box"><h3>Skills blocks</h3>{num("skCols", "Blocks per row", 1, 4, "")}{num("skGap", "Gap between blocks", 4, 50)}{num("skPad", "Block size", 8, 50)}{col("skBg", "Block color")}</div>
      <div className="box"><h3>Advanced CSS (optional)</h3>
        <textarea rows={10} spellCheck={false} style={{ fontFamily: "Consolas, monospace", fontSize: 14 }} placeholder={"/* your own CSS */\n.btn.pri { background: #ff5722; }"} value={p.custom_css || ""} onChange={e => setP({ ...p, custom_css: e.target.value })} /></div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="btn pri" onClick={saveCss}>Save All</button><button className="btn" onClick={() => { setSt({ ...DEFAULTS }); flash("Reset - press Save All"); }}>Reset to default</button><a className="btn" href="/" target="_blank">Open Portfolio ↗</a></div></div>}

    {tab === "certificates" && <div className="box"><h3>Certificates</h3>
      <input placeholder="Certificate title" value={ct.title} onChange={e => setCt({ ...ct, title: e.target.value })} />
      {ct.image_url && <img src={ct.image_url} width={160} style={{ borderRadius: 10, display: "block", marginBottom: 8 }} />}
      <input type="file" accept="image/*" onChange={e => upImg(e, "cert-", url => { setCt({ ...ct, image_url: url }); flash("Certificate image added ✓"); })} />
      <button className="btn pri" onClick={addCert}>Add Certificate</button>
      {certs.map(c => <div className="item" key={c.id}><span><img src={c.image_url} width={60} style={{ borderRadius: 6, verticalAlign: "middle", marginRight: 10 }} />{c.title}</span><button className="btn" onClick={() => del("certificates", c.id)}>Delete</button></div>)}</div>}

    {tab === "requests" && <><h2>Requests</h2><div className="stats">{S(reqs.length, "Total")}{S(solved, "Solved")}{S(pending, "Pending")}</div>
      {reqs.map(r => <div className="box" key={r.id}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><b>{r.name}</b><span className={"tag " + (r.status === "solved" ? "ok" : "pend")}>{r.status === "solved" ? "Solved" : "Pending"}</span></div>
        <p style={{ margin: "8px 0" }}>{r.message}</p>
        <p style={{ color: "#8d97ab" }}><span style={{ cursor: "pointer", color: "#2f8bff", textDecoration: "underline" }} title="Click to copy" onClick={() => copy(r.email)}>{r.email}</span> • {new Date(r.created_at).toLocaleString()}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setStatus(r.id, r.status === "solved" ? "pending" : "solved")}>{r.status === "solved" ? "Mark Pending" : "Mark Solved ✓"}</button>
          <a className="btn pri" href={"mailto:" + r.email + "?subject=Reply to your message"}>Reply by Email</a>
          <button className="btn" onClick={() => del("requests", r.id)}>Delete</button></div></div>)}</>}
  </div>);
}
