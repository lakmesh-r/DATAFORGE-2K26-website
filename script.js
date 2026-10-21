/* ===== DATA FORGE-2K26 — SCRIPT ===== */

/* ---------- EASY-TO-EDIT CONFIG ---------- */
// Replace with the official Google Form link before publishing.
const GOOGLE_FORM_URL = "https://forms.gle/ZC7jbax8YS8VXK1z5";
// Event local time: Asia/Kolkata (UTC+05:30)
const EVENT_START = "2026-10-27T08:45:00+05:30"; // registration opens
const EVENT_END   = "2026-10-27T16:15:00+05:30"; // vote of thanks ends

// [name, category, format, description, icon]
const EVENTS = [
  ["Paper Presentation", "Technical", "Individual / Team", "Present technical ideas, research, and innovative project concepts.", "&#128196;"],
  ["Code Clash", "Technical", "Coding Competition", "Demonstrate programming skills, logical reasoning, and problem-solving abilities.", "&lt;/&gt;"],
  ["Tech Quiz", "Technical", "Team", "Challenge your technical knowledge and compete through a team-based quiz.", "&#129504;"],
  ["Connections", "Non-Technical", "Team", "Test observation, logical thinking, and the ability to identify connections.", "&#129513;"],
  ["Meme Crowd", "Creative", "Open to All", "Express creativity and humor through memes.", "&#128526;"],
  ["Video Editing Championship", "Creative", "Individual", "Showcase video-editing skills, storytelling, and visual creativity.", "&#127916;"],
  ["Gaming Arena \u2014 Chess", "Non-Technical", "Team", "Demonstrate strategic thinking and competitive chess skills.", "&#9822;"]
];

// [time, activity, icon]
const SCHEDULE = [
  ["8:45 AM \u2013 10:20 AM", "Registration / Inauguration", "&#129534;"],
  ["10:25 AM \u2013 10:35 AM", "Break", "&#9749;"],
  ["10:35 AM \u2013 12:15 PM", "Paper Presentation", "&#128196;"],
  ["12:15 PM \u2013 12:45 PM", "Lunch", "&#127869;&#65039;"],
  ["12:45 PM \u2013 1:45 PM", "Code Clash + Tech Quiz + Gaming Arena", "&lt;/&gt;"],
  ["1:45 PM \u2013 2:50 PM", "Meme Crowd + Connections + Video Editing Championship", "&#127916;"],
  ["2:50 PM \u2013 3:00 PM", "Break", "&#9749;"],
  ["3:00 PM \u2013 4:00 PM", "Prize Distribution", "&#127942;"],
  ["4:00 PM \u2013 4:15 PM", "Vote of Thanks", "&#128591;"]
];

/* ---------- HELPERS ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- RENDER EVENTS + TIMELINE ---------- */
$("#ev-grid").innerHTML = EVENTS.map(([n, cat, fmt, d, ic]) => `
  <article class="card ev rv" data-cat="${cat}">
    <div class="ico" aria-hidden="true">${ic}</div>
    <h3>${n}</h3>
    <span class="badge">${cat}</span>
    <p class="fmt">Format: ${fmt}</p>
    <p>${d}</p>
    <button type="button" class="btn sm register-btn" aria-label="Register for ${n}">Register Now</button>
  </article>`).join("");

$("#tl").innerHTML = SCHEDULE.map(([t, a, ic]) => `
  <li class="rv"><div class="card"><span class="ico" aria-hidden="true">${ic}</span>
    <div><time>${t}</time><b>${a}</b></div></div></li>`).join("");

/* ---------- REGISTRATION (Google Form only; no fake form) ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 4500);
}
function register() {
  if (!GOOGLE_FORM_URL || GOOGLE_FORM_URL === "YOUR_GOOGLE_FORM_URL") {
    toast("The official registration link is not available yet. Please check back soon.");
    return;
  }
  window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
}
// One delegated listener covers every .register-btn (nav, hero, cards, registration, footer)
document.addEventListener("click", e => { if (e.target.closest(".register-btn")) register(); });

/* ---------- EVENT FILTER ---------- */
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  $$("#filters button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
  let n = 0;
  $$(".ev").forEach(c => {
    const show = b.dataset.f === "all" || c.dataset.cat === b.dataset.f;
    c.hidden = !show; if (show) n++;
  });
  $("#ev-count").textContent = n;
});

/* ---------- MOBILE MENU ---------- */
const menu = $("#menu"), burger = $("#burger");
const setMenu = open => { menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---------- SCROLL PROGRESS ---------- */
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement;
    $("#progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
    ticking = false;
  });
}, { passive: true });

/* ---------- COUNTDOWN ---------- */
const t0 = new Date(EVENT_START), t1 = new Date(EVENT_END);
const pad = n => String(n).padStart(2, "0");
function tick() {
  const now = Date.now(), ms = t0 - now;
  if (ms <= 0) {
    $("#countdown").hidden = true;
    $("#cd-msg").textContent = now < t1
      ? "Event day is here. See you at the West Block Auditorium!"
      : "DATA FORGE-2K26 has concluded. Thank you for being part of it!";
    return;
  }
  const s = Math.floor(ms / 1000);
  $("#cd-d").textContent = pad(Math.floor(s / 86400));
  $("#cd-h").textContent = pad(Math.floor(s % 86400 / 3600));
  $("#cd-m").textContent = pad(Math.floor(s % 3600 / 60));
  $("#cd-s").textContent = pad(s % 60);
}
tick(); setInterval(tick, 1000);

/* ---------- ANIMATED COUNTERS ---------- */
function count(el) {
  const end = +el.dataset.count;
  if (reduce) { el.textContent = end; return; }
  const t = performance.now();
  (function step(now) {
    const p = Math.min((now - t) / 900, 1);
    el.textContent = Math.round(end * p);
    if (p < 1) requestAnimationFrame(step);
  })(t);
}

/* ---------- INTERSECTION OBSERVERS ---------- */
// Reveal on scroll (+ start counters)
const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  $$("[data-count]", e.target).forEach(count);
  revealIO.unobserve(e.target);
}), { threshold: 0.15 });
$$(".rv").forEach(el => revealIO.observe(el));

// Active nav link
const links = $$("#menu a");
const navIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main > section").forEach(s => navIO.observe(s));

// Highlight the timeline entry nearest the middle of the viewport
const tlIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("active", e.isIntersecting)),
  { rootMargin: "-40% 0px -40% 0px" });
$$("#tl li").forEach(li => tlIO.observe(li));

/* ---------- HERO NODE NETWORK (canvas, skipped for reduced motion) ---------- */
(() => {
  const c = $("#net");
  if (!c || reduce) return;
  const x = c.getContext("2d");
  let w, h, P = [];
  const init = () => {
    w = c.width = c.offsetWidth; h = c.height = c.offsetHeight;
    P = Array.from({ length: Math.min(60, w / 22 | 0) }, () => ({
      x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
  };
  init(); addEventListener("resize", init);
  (function frame() {
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#22e4ff";
    for (const p of P) { p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h; x.fillRect(p.x, p.y, 2, 2); }
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
      if (d < 120) {
        x.strokeStyle = `rgba(47,140,255,${.28 * (1 - d / 120)})`;
        x.beginPath(); x.moveTo(P[i].x, P[i].y); x.lineTo(P[j].x, P[j].y); x.stroke();
      }
    }
    requestAnimationFrame(frame);
  })();
})();
