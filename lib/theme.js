export const DEFAULTS = { navBg: "#0f1423", navText: "#9aa4b8", navFont: "Inter", navSize: 16, navPad: 10, nameFont: "Inter", nameSize: 84, nameColor: "#ffffff", imgWidth: 420, imgRadius: 22, hFont: "Inter", hSize: 38, hColor: "#ffffff", skCols: 3, skGap: 18, skPad: 18, skBg: "#0d1426" };
export const FONT_LIST = ["Inter", "Arial", "Georgia", "Times New Roman", "Verdana", "Trebuchet MS", "Courier New", "Poppins", "Montserrat"];
export function buildCss(input) {
  let o = {}; try { o = typeof input === "string" ? JSON.parse(input || "{}") : input || {}; } catch {}
  const s = { ...DEFAULTS, ...o };
  const ch = (k) => s[k] !== DEFAULTS[k];
  const ff = (k) => (ch(k) ? `font-family:"${s[k]}",system-ui,sans-serif;` : "");
  const cl = (k, prop) => (ch(k) ? `${prop}:${s[k]};` : "");
  return `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Montserrat:wght@400;700&display=swap');
.navin{${cl("navBg", "background")}padding:${s.navPad}px 12px ${s.navPad}px 24px}
.logo,.links a{${ff("navFont")}font-size:${s.navSize}px}
.links a{${cl("navText", "color")}}
h1{${ff("nameFont")}${cl("nameColor", "color")}font-size:clamp(36px,7vw,${s.nameSize}px)}
@media(min-width:801px){.hgrid{grid-template-columns:1fr minmax(0,${s.imgWidth}px)}}
.card{max-width:${s.imgWidth}px;margin-left:auto;margin-right:auto;width:100%}
.photo{border-radius:${s.imgRadius}px}
h2{${ff("hFont")}${cl("hColor", "color")}font-size:${s.hSize}px}
.skills{grid-template-columns:repeat(${s.skCols},1fr);gap:${s.skGap}px}
.sk{${cl("skBg", "background")}padding:${s.skPad}px 20px}
@media(max-width:800px){.skills{grid-template-columns:1fr}}
.certs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.cert img{width:100%;height:180px;object-fit:cover;border-radius:12px;display:block;margin-bottom:12px}`;
}
