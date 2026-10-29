"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { buildCss } from "../lib/theme";

export default function Home() {
  const [p, setP] = useState({}); const [skills, setSkills] = useState([]); const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]); const [open, setOpen] = useState(false); const [toast, setToast] = useState("");
  useEffect(() => {
    try { let v = localStorage.getItem("vid"); if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("vid", v); } supabase.from("visits").insert({ visitor_id: v }).then(() => {}); } catch {}
    (async () => {
    const a = await supabase.from("profile").select("*").eq("id", 1).single(); if (a.data) setP(a.data);
    const b = await supabase.from("skills").select("*").order("id"); setSkills(b.data || []);
    const c = await supabase.from("projects").select("*").order("id", { ascending: false }); setProjects(c.data || []);
    const d = await supabase.from("certificates").select("*").order("id", { ascending: false }); setCerts(d.data || []);
  })(); }, []);
  const [year, setYear] = useState(2026);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);
  const [light, setLight] = useState(false);
  useEffect(() => { try { if (localStorage.getItem("theme") === "light") { setLight(true); document.documentElement.dataset.theme = "light"; } } catch {} }, []);
  const toggleTheme = () => { const n = !light; setLight(n); document.documentElement.dataset.theme = n ? "light" : "dark"; try { localStorage.setItem("theme", n ? "light" : "dark"); } catch {} };
  const copy = async (text, label) => { try { await navigator.clipboard.writeText(text); setToast(label + " copied!"); setTimeout(() => setToast(""), 2000); } catch {} };
  const [rq, setRq] = useState({ name: "", email: "", message: "" });
  const sendReq = async () => {
    if (!rq.name.trim() || !rq.message.trim() || !rq.email.includes("@")) { setToast("Please fill your name, a valid email and message"); setTimeout(() => setToast(""), 2500); return; }
    const { error } = await supabase.from("requests").insert({ name: rq.name, message: rq.message, email: rq.email });
    setToast(error ? "Error, please try again" : "Message sent ✓"); if (!error) setRq({ name: "", email: "", message: "" });
    setTimeout(() => setToast(""), 2500);
  };
  const nm = p.name || "";
  return (<div onClick={(e) => { const t = e.target.closest("h1,h2,h3,.photo"); if (t) t.classList.toggle("zoomed"); }}>
    <style>{`
    h1,h2,h3,.photo{cursor:pointer;transition:transform .35s ease,box-shadow .35s ease}
    h1,h2{transform-origin:left center}h3,.photo{transform-origin:center}
    h1.zoomed,h2.zoomed{transform:scale(1.12)}
    h3.zoomed{transform:scale(1.15)}
    .photo{position:relative;z-index:1}
    .pr .pimg{width:100%;max-width:260px;height:150px;aspect-ratio:auto;object-fit:cover;cursor:pointer;transition:transform .3s}
    .pr .pimg:hover{transform:scale(1.05)}
    #request h2{transform-origin:center}
    .rform{margin:0 auto !important;max-width:560px;text-align:left}
    .photo.zoomed{transform:scale(1.12);box-shadow:0 20px 50px rgba(47,107,255,.35)}
  
    body{transition:background .3s,color .3s}
    .tgl{width:40px;height:40px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;margin-left:auto}
    [data-theme="light"] body{background:#f5f7fb;color:#0b1020}
    [data-theme="light"] .navin{background:rgba(255,255,255,.85);border-color:rgba(0,0,0,.1);box-shadow:0 8px 30px rgba(0,0,0,.1)}
    [data-theme="light"] .links a{color:#4a5468}
    [data-theme="light"] .links a:hover{background:rgba(0,0,0,.06);color:#000}
    [data-theme="light"] .btn{color:#0b1020;border-color:rgba(0,0,0,.25)}
    [data-theme="light"] .btn.pri{color:#fff;border-color:#2f6bff}
    [data-theme="light"] .muted,[data-theme="light"] .ct small{color:#5b657a}
    [data-theme="light"] .badge{border-color:rgba(0,0,0,.15)}
    [data-theme="light"] .card{background:linear-gradient(160deg,#e6efff,#f9fbff);border-color:rgba(47,107,255,.3)}
    [data-theme="light"] .photo{background:#dbe6ff}
    [data-theme="light"] .sk,[data-theme="light"] .pr,[data-theme="light"] .ct,[data-theme="light"] .box{background:#fff;border-color:rgba(0,0,0,.08);color:#0b1020}
    [data-theme="light"] .ct:hover{background:#f0f5ff}
    [data-theme="light"] .rform textarea,[data-theme="light"] .rform input{background:#fff;color:#0b1020;border-color:#cdd6ea}
    [data-theme="light"] footer{border-color:rgba(0,0,0,.08);color:#5b657a}
    @media(max-width:800px){[data-theme="light"] .links{background:#fff;border-color:rgba(0,0,0,.1)}}
  `}</style>
    <style>{buildCss(p.style_json)}</style>
    <style>{p.custom_css || ""}</style>
    <header className="nav"><div className="navin">
      <a href="#" className="logo">{(nm.split(" ")[1] || nm.split(" ")[0] || "Ehsan").replace("Ehsanullah","Ehsan")}<span className="dot">.</span></a>
      <nav className={"links " + (open ? "open" : "")} onClick={() => setOpen(false)}>
        <a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#certificates">Certificates</a><a href="#contact">Contact</a></nav>
      <button className="btn tgl" onClick={toggleTheme} title="Light / Dark mode">{light ? "🌙" : "☀️"}</button>
      <a href="#contact" className="btn talk">Let's Talk ↗</a>
      <button className="btn menu" onClick={() => setOpen(!open)}>☰</button>
    </div></header>

    <section className="hero"><div className="wrap hgrid">
      <div>
        <div className="badge"><i /> {p.status}</div>
        <p className="hello">HELLO, I'M</p>
        <h1>{nm}<span className="dot">.</span></h1>
        <p className="role">{p.title}</p>
        <p className="muted" id="about" style={{ maxWidth: 560, fontSize: 18 }}>{p.bio}</p>
        <div className="row"><a href="#projects" className="btn pri">Explore My Work ↗</a><a href="#about" className="btn">About Me</a></div>
      </div>
      <div className="card">
        {p.avatar_url ? <img className="photo" src={p.avatar_url} alt={nm} /> : <div className="photo" />}
        <h3>{nm}</h3><p className="muted">{p.tags}</p>
      </div>
    </div></section>

    <section id="skills"><div className="wrap"><h2>My <span>Skills</span></h2>
      <div className="skills">{skills.map(s => (<div className="sk" key={s.id}><b style={{ fontSize: 18, display: "block" }}>{s.name}</b><p className="muted">{s.description}</p></div>))}</div></div></section>

    <section id="projects"><div className="wrap"><h2>My <span>Projects</span></h2>
      <div className="projs">{projects.map(x => (<div className="pr" key={x.id}>{x.image_url && (x.link ? <a href={x.link} target="_blank" rel="noreferrer"><img className="pimg" src={x.image_url} alt={x.title} /></a> : <img className="pimg" src={x.image_url} alt={x.title} />)}<h3>{x.title}</h3><p className="muted">{x.description}</p>{x.link && <a href={x.link} target="_blank" rel="noreferrer">View Project ↗</a>}</div>))}</div></div></section>

    <section id="certificates"><div className="wrap"><h2>My <span>Certificates</span></h2>
      {certs.length === 0 && <p className="muted">Certificates coming soon.</p>}
      <div className="certs">{certs.map(c => (<div className="pr cert" key={c.id}><a href={c.image_url} target="_blank" rel="noreferrer"><img src={c.image_url} alt={c.title} /></a><h3>{c.title}</h3></div>))}</div></div></section>

    <section id="contact"><div className="wrap"><h2>Get In <span>Touch</span></h2>
      <div className="contacts">
        <button className="ct" onClick={() => copy(p.email, "Email")}><small>Email (click to copy)</small>{p.email}</button>
        <button className="ct" onClick={() => copy(p.phone, "Number")}><small>Phone (click to copy)</small>{p.phone}</button>
        {p.github && <a className="ct" href={p.github} target="_blank" rel="noreferrer"><small>GitHub</small>{p.github}</a>}
        {p.linkedin && <a className="ct" href={p.linkedin} target="_blank" rel="noreferrer"><small>LinkedIn</small>{p.linkedin}</a>}
      </div></div></section>
    <section id="request"><div className="wrap" style={{ textAlign: "center" }}><h2>Send a <span>Message</span></h2>
      <div className="box rform">
        <input placeholder="Your name" value={rq.name} onChange={e => setRq({ ...rq, name: e.target.value })} />
        <input type="email" placeholder="Your email" value={rq.email} onChange={e => setRq({ ...rq, email: e.target.value })} />
        <textarea rows={5} placeholder="Write your message here..." value={rq.message} onChange={e => setRq({ ...rq, message: e.target.value })} />
        <button className="btn pri" onClick={sendReq}>Send Message</button>
      </div></div></section>
    <footer>© {year} {nm}</footer>
    {toast && <div className="toast">{toast}</div>}
  </div>);
}
