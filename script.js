
/* ===== DATA FORGE-2K26 — SCRIPT ===== */

/* ---------- CONFIGURATION ---------- */
const GOOGLE_FORM_URL = "https://forms.gle/ZC7jbax8YS8VXK1z5";
const EVENT_START = "2026-10-27T08:45:00+05:30";
const EVENT_END = "2026-10-27T16:15:00+05:30";

/* ---------- EVENT DETAILS ---------- */
// [name, category, format, description, icon]
const EVENTS = [
  ["Paper Presentation", "Technical", "Individual / Team",
    "Present technical ideas, research, and innovative project concepts.", "&#128196;"],
  ["Code Clash", "Technical", "Coding Competition",
    "Demonstrate programming skills, logical reasoning, and problem-solving abilities.", "&lt;/&gt;"],
  ["Tech Quiz", "Technical", "Team",
    "Challenge your technical knowledge and compete through a team-based quiz.", "&#129504;"],
  ["Connections", "Non-Technical", "Team",
    "Test observation, logical thinking, and the ability to identify connections.", "&#129513;"],
  ["Meme Crowd", "Creative", "Open to All",
    "Express creativity and humor through memes.", "&#128526;"],
  ["Video Editing Championship", "Creative", "Individual",
    "Showcase video-editing skills, storytelling, and visual creativity.", "&#127916;"],
  ["Gaming Arena — Chess", "Non-Technical", "Individual / Team",
    "Demonstrate strategic thinking and competitive chess skills.", "&#9822;"]
];

// [time, activity, icon]
const SCHEDULE = [
  ["8:45 AM – 10:20 AM", "Registration / Inauguration", "&#129534;"],
  ["10:25 AM – 10:35 AM", "Break", "&#9749;"],
  ["10:35 AM – 12:15 PM", "Paper Presentation", "&#128196;"],
  ["12:15 PM – 12:45 PM", "Lunch", "&#127869;&#65039;"],
  ["12:45 PM – 1:45 PM", "Code Clash + Tech Quiz + Gaming Arena", "&lt;/&gt;"],
  ["1:45 PM – 2:50 PM", "Meme Crowd + Connections + Video Editing Championship", "&#127916;"],
  ["2:50 PM – 3:00 PM", "Break", "&#9749;"],
  ["3:00 PM – 4:00 PM", "Prize Distribution", "&#127942;"],
  ["4:00 PM – 4:15 PM", "Vote of Thanks", "&#128591;"]
];

/* ---------- HELPERS ---------- */
const $ = (selector, context = document) =>
  context.querySelector(selector);

const $$ = (selector, context = document) =>
  [...context.querySelectorAll(selector)];

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- RENDER EVENTS ---------- */
const eventGrid = $("#ev-grid");

if (eventGrid) {
  eventGrid.innerHTML = EVENTS.map(([name, category, format, description, icon]) => `
    <article class="card ev rv" data-cat="${category}">
      <div class="ico" aria-hidden="true">${icon}</div>
      <h3>${name}</h3>
      <span class="badge">${category}</span>
      <p class="fmt">Format: ${format}</p>
      <p>${description}</p>
      <button
        type="button"
        class="btn sm register-btn"
        aria-label="Register for ${name}">
        Register Now
      </button>
    </article>
  `).join("");
}

/* ---------- RENDER TIMELINE ---------- */
const timeline = $("#tl");

if (timeline) {
  timeline.innerHTML = SCHEDULE.map(([time, activity, icon]) => `
    <li class="rv">
      <div class="card">
        <span class="ico" aria-hidden="true">${icon}</span>
        <div>
          <time>${time}</time>
          <b>${activity}</b>
        </div>
      </div>
    </li>
  `).join("");
}

/* ---------- REGISTRATION ---------- */
let toastTimer;

function toast(message) {
  const element = $("#toast");

  if (!element) {
    alert(message);
    return;
  }

  element.textContent = message;
  element.hidden = false;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.hidden = true;
  }, 4500);
}

function register() {
  if (
    !GOOGLE_FORM_URL ||
    GOOGLE_FORM_URL === "YOUR_GOOGLE_FORM_URL"
  ) {
    toast("The official registration link is not available yet.");
    return;
  }

  const newTab = window.open(
    GOOGLE_FORM_URL,
    "_blank",
    "noopener,noreferrer"
  );

  // Do not display a success message unless the form actually opens.
  if (!newTab) {
    toast("Please allow pop-ups or open the registration link directly.");
  }
}

document.addEventListener("click", event => {
  if (event.target.closest(".register-btn")) {
    register();
  }
});

/* ---------- EVENT FILTER ---------- */
const filters = $("#filters");

if (filters) {
  filters.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button || !button.dataset.f) return;

    $$("#filters button").forEach(item => {
      const selected = item === button;

      item.classList.toggle("on", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    let visibleCount = 0;

    $$(".ev").forEach(card => {
      const show =
        button.dataset.f === "all" ||
        card.dataset.cat === button.dataset.f;

      card.hidden = !show;

      if (show) visibleCount++;
    });

    const countElement = $("#ev-count");

    if (countElement) {
      countElement.textContent = visibleCount;
    }
  });
}

/* ---------- MOBILE MENU ---------- */
const menu = $("#menu");
const burger = $("#burger");

function setMenu(open) {
  if (!menu || !burger) return;

  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
}

if (menu && burger) {
  burger.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });

  menu.addEventListener("click", event => {
    if (event.target.closest("a")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });

  // Close the mobile menu when switching to a wider layout.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setMenu(false);
    }
  });
}

/* ---------- SCROLL PROGRESS ---------- */
let ticking = false;

window.addEventListener("scroll", () => {
  if (ticking) return;

  ticking = true;

  requestAnimationFrame(() => {
    const progress = $("#progress");
    const root = document.documentElement;
    const scrollableHeight = root.scrollHeight - root.clientHeight;

    if (progress) {
      const percentage = scrollableHeight > 0
        ? (root.scrollTop / scrollableHeight) * 100
        : 0;

      progress.style.width = `${percentage}%`;
    }

    ticking = false;
  });
}, { passive: true });

/* ---------- COUNTDOWN ---------- */
const startTime = new Date(EVENT_START).getTime();
const endTime = new Date(EVENT_END).getTime();

const pad = number => String(number).padStart(2, "0");

function tick() {
  const countdown = $("#countdown");
  const message = $("#cd-msg");

  if (!countdown || !message) return;

  const now = Date.now();

  if (now >= startTime) {
    countdown.hidden = true;

    message.textContent = now < endTime
      ? "Event day is here. See you at the West Block Auditorium!"
      : "DATA FORGE-2K26 has concluded. Thank you for being part of it!";

    return;
  }

  countdown.hidden = false;
  message.textContent = "";

  const remainingSeconds = Math.floor(
    (startTime - now) / 1000
  );

  const values = {
    "#cd-d": Math.floor(remainingSeconds / 86400),
    "#cd-h": Math.floor((remainingSeconds % 86400) / 3600),
    "#cd-m": Math.floor((remainingSeconds % 3600) / 60),
    "#cd-s": remainingSeconds % 60
  };

  Object.entries(values).forEach(([selector, value]) => {
    const element = $(selector);

    if (element) {
      element.textContent = pad(value);
    }
  });
}

tick();
setInterval(tick, 1000);

/* ---------- ANIMATED COUNTERS ---------- */
function count(element) {
  const end = Number(element.dataset.count);

  if (!Number.isFinite(end)) return;

  if (reduceMotion) {
    element.textContent = end;
    return;
  }

  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / 900, 1);

    element.textContent = Math.round(end * progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* ---------- SCROLL REVEAL ---------- */
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("in");

      $$("[data-count]", entry.target).forEach(count);

      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  $$(".rv").forEach(element => {
    revealObserver.observe(element);
  });

  /* ---------- ACTIVE NAVIGATION ---------- */
  const navLinks = $$("#menu a");

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  $$("main > section").forEach(section => {
    if (section.id) navObserver.observe(section);
  });

  /* ---------- ACTIVE TIMELINE ---------- */
  const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle(
        "active",
        entry.isIntersecting
      );
    });
  }, { rootMargin: "-40% 0px -40% 0px" });

  $$("#tl li").forEach(item => {
    timelineObserver.observe(item);
  });
} else {
  // Keep content visible in browsers without IntersectionObserver.
  $$(".rv").forEach(element => element.classList.add("in"));
  $$("[data-count]").forEach(count);
}

/* ---------- HERO NODE NETWORK ---------- */
(() => {
  const canvas = $("#net");

  if (
    !canvas ||
    reduceMotion ||
    !canvas.getContext
  ) return;

  const context = canvas.getContext("2d");

  if (!context) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame;

  function init() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;

    const particleCount = Math.min(
      60,
      Math.floor(width / 22)
    );

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  }

  function frame() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#22e4ff";

    particles.forEach(particle => {
      particle.x = (particle.x + particle.vx + width) % width;
      particle.y = (particle.y + particle.vy + height) % height;

      context.fillRect(particle.x, particle.y, 2, 2);
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < 120) {
          context.strokeStyle =
            `rgba(47,140,255,${0.28 * (1 - distance / 120)})`;

          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    animationFrame = requestAnimationFrame(frame);
  }

  function resizeCanvas() {
    cancelAnimationFrame(animationFrame);
    init();
    frame();
  }

  init();
  frame();

  window.addEventListener("resize", resizeCanvas);

  // Stop unnecessary animation when the tab is hidden.
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(animationFrame);

    if (!document.hidden) {
      frame();
    }
  });
})();
