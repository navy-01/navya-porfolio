const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const loader = document.querySelector("#lens-loader");
const openSite = () => {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  if (loader) {
    loader.classList.add("is-done");
    window.setTimeout(() => loader.remove(), 1000);
  }
};

if (reduceMotion) {
  openSite();
} else {
  window.setTimeout(openSite, 1800);
}

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
});

navToggle.addEventListener("click", () => {
  const open = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".stars").forEach((el) => {
  const rating = Number(el.dataset.rating || 0);
  el.innerHTML = "";
  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement("span");
    star.className = i <= rating ? "star is-on" : "star";
    star.textContent = "★";
    el.appendChild(star);
  }
});

const tabs = document.querySelectorAll(".gallery-tabs button");
const panels = document.querySelectorAll(".mosaic");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const category = tab.dataset.category;
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    panels.forEach((panel) => {
      const match = panel.dataset.category === category;
      panel.classList.remove("is-active");
      panel.hidden = !match;
      if (match) {
        void panel.offsetWidth;
        panel.classList.add("is-active");
      }
    });
  });
});

const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        reveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

const EMAILJS_SERVICE_ID = "service_dfaqemo";
const EMAILJS_TEMPLATE_ID = "template_5qfquvq";
const EMAILJS_PUBLIC_KEY = "vsfVeYnsMXSephrhy";

if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");
const submitBtn = form.querySelector('button[type="submit"]');

const emailjsHint = (error) => {
  const text = String(error?.text || error?.message || "");
  const status = Number(error?.status || 0);
  if (status === 412 || /invalid grant|insufficient authentication|reconnect/i.test(text)) {
    return "Gmail is not fully connected in EmailJS. Open Email Services, disconnect Gmail, connect again, and tick “Send email on your behalf”.";
  }
  if (status === 400 || /template/i.test(text)) {
    return "EmailJS rejected the template. Confirm Template ID template_5qfquvq is saved, with To Email set to navyaeditor01@gmail.com.";
  }
  if (status === 403 || /origin|referer|not allowed/i.test(text)) {
    return "EmailJS blocked this website origin. In Account → Security, allow http://127.0.0.1:8765 and localhost.";
  }
  if (text) return `EmailJS error: ${text}`;
  return "The message could not be sent. Check EmailJS → Email History for the failed request.";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const message = String(data.get("message") || "").trim();

  statusEl.hidden = false;
  statusEl.classList.remove("is-ok", "is-err");

  if (!name || !email || !phone || !message) {
    statusEl.textContent = "Please fill in every field so I can get back to you.";
    statusEl.classList.add("is-err");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    statusEl.textContent = "Please enter a valid Gmail / email address.";
    statusEl.classList.add("is-err");
    return;
  }

  if (!window.emailjs) {
    statusEl.textContent = "Email service could not load. Please refresh and try again.";
    statusEl.classList.add("is-err");
    return;
  }

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  statusEl.textContent = "Sending your message…";

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        title: "Portfolio inquiry",
        name,
        email,
        phone,
        message,
        time: new Date().toLocaleString(),
        reply_to: email,
        from_name: name,
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    );
    statusEl.textContent = "Your Message is send";
    statusEl.classList.add("is-ok");
    form.reset();
  } catch (error) {
    console.error("EmailJS failed", error);
    statusEl.textContent = emailjsHint(error);
    statusEl.classList.add("is-err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

const shutterFlash = document.createElement("div");
shutterFlash.className = "shutter-flash";
document.body.appendChild(shutterFlash);

document.querySelectorAll(".btn-shutter").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (reduceMotion) return;
    shutterFlash.classList.remove("is-on");
    void shutterFlash.offsetWidth;
    shutterFlash.classList.add("is-on");
  });
});

const cursor = document.querySelector("#lens-cursor");
const canHover = window.matchMedia("(pointer: fine)").matches && !reduceMotion;

if (cursor && canHover) {
  document.documentElement.classList.add("has-lens-cursor");
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cx = x;
  let cy = y;

  window.addEventListener("mousemove", (event) => {
    x = event.clientX;
    y = event.clientY;
    const focus = event.target.closest("a, button, input, textarea, .mosaic-item");
    cursor.classList.toggle("is-focus", Boolean(focus));
  });

  const follow = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    cursor.style.transform = `translate(${cx - 22}px, ${cy - 22}px)`;
    requestAnimationFrame(follow);
  };
  follow();
}
