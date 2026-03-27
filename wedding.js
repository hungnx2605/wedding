/* ===== ALBUM PHOTOS ===== */
const BASE = "https://wedding.truongvathom.online/";
const albumPhotos = [
  "assets/images/album-thumbs/_MID4876.webp",
  "assets/images/album-thumbs/_MID4814.webp",
  "assets/images/album-thumbs/_MID4522 60x90.webp",
  "assets/images/album-thumbs/_MID4635.webp",
  "assets/images/album-thumbs/_MID4780.webp",
  "assets/images/album-thumbs/_MID4909 60x90.webp",
  "assets/images/album-thumbs/_MID4946.webp",
  "assets/images/album-thumbs/_MID5269.webp",
  "assets/images/album-thumbs/_MID5281.webp",
  "assets/images/album-thumbs/_MID5288.webp",
  "assets/images/album-thumbs/_MID5295.webp",
  "assets/images/album-thumbs/_MID5425.webp",
  "assets/images/album-thumbs/_MID5484.webp",
  "assets/images/album-thumbs/_MID5515.webp",
  "assets/images/album-thumbs/_MID5553.webp",
  "assets/images/album-thumbs/_MID5594.webp",
];
const albumFull = albumPhotos.map((p) =>
  p.replace("album-thumbs", "album-full"),
);

function buildAlbum() {
  const grid = document.getElementById("album-grid");
  albumPhotos.forEach((src, i) => {
    const img = document.createElement("img");
    img.className = "album-thumb animate-on-scroll fadeInUp";
    img.src = BASE + src;
    img.alt = "Ảnh cưới " + (i + 1);
    img.loading = "lazy";
    img.onclick = () => openLightbox(i);
    grid.appendChild(img);
  });
}

/* ===== LIGHTBOX ===== */
let currentLbIdx = 0;

function openLightbox(i) {
  currentLbIdx = i;
  updateLightbox();
  document.getElementById("lightbox").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}

function updateLightbox() {
  const img = document.getElementById("lightbox-img");
  img.style.opacity = 0;
  setTimeout(() => {
    img.src = BASE + albumFull[currentLbIdx];
    img.onload = () => {
      img.style.opacity = 1;
    };
  }, 100);
  document.getElementById("lightbox-counter").textContent =
    currentLbIdx + 1 + " / " + albumFull.length;
}

function lightboxNav(dir) {
  currentLbIdx = (currentLbIdx + dir + albumFull.length) % albumFull.length;
  updateLightbox();
}

document.getElementById("lightbox").addEventListener("click", function (e) {
  if (e.target === this) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  const lb = document.getElementById("lightbox");
  if (!lb.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lightboxNav(-1);
  if (e.key === "ArrowRight") lightboxNav(1);
});

/* ===== CALENDAR ===== */
function buildCalendar() {
  const cal = document.getElementById("calendar");
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  // Header
  days.forEach((d, i) => {
    const h = document.createElement("div");
    h.className = "cal-header" + (i === 0 ? " sunday" : "");
    h.textContent = d;
    cal.appendChild(h);
  });
  // March 2026: starts on Sunday (day 0)
  // March 1, 2026 is a Sunday
  const firstDay = new Date(2026, 2, 1).getDay(); // 0 = Sunday
  const totalDays = 31;
  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement("div");
    e.className = "cal-day empty";
    cal.appendChild(e);
  }
  for (let d = 1; d <= totalDays; d++) {
    const dow = (firstDay + d - 1) % 7;
    const cell = document.createElement("div");
    cell.className = "cal-day" + (dow === 0 ? " sunday" : "");
    cell.textContent = d;
    if (d === 16 || d === 17) {
      cell.classList.add("highlighted");
      const heart = document.createElement("span");
      heart.className = "heart-icon";
      heart.textContent = "❤";
      cell.appendChild(heart);
    }
    cal.appendChild(cell);
  }
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

/* ===== INTRO CURTAIN ===== */
function startIntro() {
  const curtain = document.getElementById("intro-curtain");
  setTimeout(() => {
    curtain.classList.add("open");
    setTimeout(() => {
      curtain.style.display = "none";
      document.body.style.overflow = "";
    }, 1100);
  }, 1400);
  document.body.style.overflow = "hidden";
}

/* ===== MUSIC ===== */
let musicStarted = false;
const audio = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

function startMusicOnce() {
  if (!musicStarted) {
    musicStarted = true;
    audio.volume = 0.4;
    audio
      .play()
      .then(() => {
        musicBtn.textContent = "🎵";
        musicBtn.classList.add("playing");
      })
      .catch(() => {});
  }
}

function toggleMusic() {
  if (audio.paused) {
    audio.play().then(() => {
      musicBtn.textContent = "🎵";
      musicBtn.classList.add("playing");
    });
  } else {
    audio.pause();
    musicBtn.textContent = "🎵";
    musicBtn.classList.remove("playing");
  }
}

document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("scroll", startMusicOnce, { once: true });

/* ===== MODALS ===== */
function openBankModal(who) {
  document.getElementById("modal-" + who).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
  document.body.style.overflow = "";
}

document.querySelectorAll(".modal-overlay").forEach((m) => {
  m.addEventListener("click", function (e) {
    if (e.target === this) closeModal(this.id);
  });
});

/* ===== COPY TO CLIPBOARD ===== */
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = "✓ Đã sao chép!";
    btn.style.color = "#4CAF50";
    btn.style.borderColor = "#4CAF50";
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.color = "";
      btn.style.borderColor = "";
    }, 2000);
  });
}

/* ===== ESCAPE HTML ===== */
function escHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ===== RSVP SUBMIT ===== */
function submitRsvp(e, who) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector(".btn-submit");
  const fb = document.getElementById("fb-" + who);
  btn.textContent = "Đang gửi...";
  btn.disabled = true;

  const data = {
    type: "rsvp",
    side: who,
    name: form.querySelector('input[type="text"]').value,
    relation: form.querySelectorAll('input[type="text"]')[1].value,
    wish: form.querySelector("textarea").value,
    attend: form.querySelector('input[name="attend-' + who + '"]:checked')
      .value,
  };

  fetch(
    "https://script.google.com/macros/s/AKfycbzEUcYDSl1TwKoBafrnLWw2g2CW0Ife8F6t28chsS-wQs9py3IV0kSrdyTg1ACHmzby/exec",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  )
    .then(() => {
      closeModal("modal-thankyou");
      document.getElementById("modal-thankyou").classList.add("active");
      document.body.style.overflow = "hidden";
      form.reset();
    })
    .catch(() => {
      fb.textContent = "✗ Lỗi! Thử lại";
      fb.className = "submit-feedback error";
    })
    .finally(() => {
      btn.textContent = "GỬI NGAY";
      btn.disabled = false;
    });
}

/* ===== WISH SUBMIT ===== */
function submitWish(e) {
  e.preventDefault();
  const name = document.getElementById("wish-name").value.trim();
  const text = document.getElementById("wish-text").value.trim();
  const fb = document.getElementById("fb-wish");
  if (!name || !text) return;

  const btn = e.target.querySelector(".btn-submit");
  btn.textContent = "Đang gửi...";
  btn.disabled = true;

  // Optimistic UI
  const card = document.createElement("div");
  card.className = "wish-card";
  card.innerHTML = `
    <div class="wish-author">${escHtml(name)}</div>
    <div class="wish-text">${escHtml(text)}</div>
    <div class="wish-time">Vừa gửi</div>`;
  const list = document.getElementById("wishes-list");
  list.prepend(card);

  document.getElementById("wish-name").value = "";
  document.getElementById("wish-text").value = "";
  btn.textContent = "Gửi Lời Chúc 💌";
  btn.disabled = false;

  fetch(
    "https://script.google.com/macros/s/AKfycbzEUcYDSl1TwKoBafrnLWw2g2CW0Ife8F6t28chsS-wQs9py3IV0kSrdyTg1ACHmzby/exec",
    {
      method: "POST",
      body: JSON.stringify({ type: "wish", name, wish: text }),
    },
  ).catch(() => {});
}

/* ===== TOUCH SWIPE FOR LIGHTBOX ===== */
let touchStartX = 0;
document.getElementById("lightbox").addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
document.getElementById("lightbox").addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1);
});

/* ===== INIT ===== */
startIntro();
buildAlbum();
buildCalendar();
window.addEventListener("load", initScrollAnimations);
