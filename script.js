const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (location.hash) {
  document.querySelector(location.hash)?.scrollIntoView({ behavior: "auto", block: "start" });
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

const sections = [
  ["#home", document.querySelector("#home")],
  ["#skills", document.querySelector("#skills")],
  ["#gallery", document.querySelector("#gallery")],
  ["#contact", document.querySelector("#contact")],
];

const setActiveNav = () => {
  const y = window.scrollY + 120;
  let current = "#home";
  sections.forEach(([hash, el]) => {
    if (el && el.offsetTop <= y) current = hash;
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === current);
  });
};

window.addEventListener("scroll", setActiveNav);
setActiveNav();

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
const cards = document.querySelectorAll(".work-card");

cards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
});

const setGalleryCategory = (category) => {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.category === category)));
  cards.forEach((card) => {
    const match = category === "all" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !match);
  });
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setGalleryCategory(tab.dataset.category));
});

const startCategory = new URLSearchParams(location.search).get("cat");
if (startCategory) setGalleryCategory(startCategory);

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
    return "EmailJS blocked this website origin. In Account → Security, allow this site origin.";
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

const lightbox = document.querySelector("#lightbox");
const lightboxImg = lightbox?.querySelector("img");
const lightboxCap = lightbox?.querySelector("figcaption");
let galleryItems = [];
let galleryIndex = 0;

const visibleGalleryItems = () =>
  [...document.querySelectorAll(".work-card")].filter((card) => !card.classList.contains("is-hidden"));

const openLightbox = (index) => {
  galleryItems = visibleGalleryItems();
  if (!lightbox || !galleryItems.length) return;
  galleryIndex = (index + galleryItems.length) % galleryItems.length;
  const card = galleryItems[galleryIndex];
  const img = card.querySelector("img");
  const title = card.querySelector("h3")?.textContent || "";
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || "";
  lightboxCap.textContent = `${title}  ·  ${galleryIndex + 1} / ${galleryItems.length}`;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = "";
};

cards.forEach((item) => {
  const open = () => {
    const items = visibleGalleryItems();
    openLightbox(items.indexOf(item));
  };
  item.addEventListener("click", open);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => openLightbox(galleryIndex - 1));
lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => openLightbox(galleryIndex + 1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (lightbox?.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") openLightbox(galleryIndex - 1);
  if (event.key === "ArrowRight") openLightbox(galleryIndex + 1);
});
