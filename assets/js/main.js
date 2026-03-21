// ===== MUSIC TOGGLE =====
const audio = document.getElementById('background-music');
const toggleBtn = document.getElementById('music-toggle');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
let isPlaying = false;

function startMusic() {
    audio.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        toggleBtn.classList.remove('vibrating');
    }).catch(() => {});
}

// Auto play on first user interaction (including scroll)
const firstInteraction = () => {
    if (!isPlaying) startMusic();
    ['click', 'touchstart', 'keydown', 'scroll', 'wheel', 'touchmove'].forEach(e =>
        document.removeEventListener(e, firstInteraction)
    );
    window.removeEventListener('scroll', firstInteraction);
};
['click', 'touchstart', 'keydown', 'wheel', 'touchmove'].forEach(e =>
    document.addEventListener(e, firstInteraction, { once: true })
);
window.addEventListener('scroll', firstInteraction, { once: true });

toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        toggleBtn.classList.add('vibrating');
    } else {
        startMusic();
    }
});

// ===== CALENDAR =====
(function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const year = 2026, month = 3;
    const highlightDays = [16, 17];
    const dowsVi = ['T2','T3','T4','T5','T6','T7','CN'];
    const heartSrc = 'https://content.pancake.vn/1/59/9d/0d/23/829a2a25903e5b03a029f62911ad0300b2c875df84e143b3258f9633-w:3600-h:3600-l:165926-t:image/png.png';

    dowsVi.forEach(d => {
        const div = document.createElement('div');
        div.className = 'cal-dow';
        div.textContent = d;
        grid.appendChild(div);
    });

    const first = new Date(year, month - 1, 1);
    const total = new Date(year, month, 0).getDate();
    const offset = (first.getDay() + 6) % 7;

    for (let i = 0; i < offset; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        grid.appendChild(empty);
    }

    for (let d = 1; d <= total; d++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        const col = (offset + d - 1) % 7;
        if (col === 6) cell.classList.add('sunday');

        const span = document.createElement('span');
        span.textContent = d;
        cell.appendChild(span);

        if (highlightDays.includes(d)) {
            cell.classList.add('selected');
            const img = document.createElement('img');
            img.src = heartSrc;
            img.className = 'cal-heart';
            cell.appendChild(img);
        }
        grid.appendChild(cell);
    }
})();

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

// ===== LIGHTBOX =====
const lightboxSrcs = [
    'assets/images/album-full/_MID4876.webp',
    'assets/images/album-full/_MID4814.webp',
    'assets/images/album-full/_MID4522%20%2060x90.webp',
    'assets/images/album-full/_MID4635.webp',
    'assets/images/album-full/_MID4780.webp',
    'assets/images/album-full/_MID4909%20%2060x90.webp',
    'assets/images/album-full/_MID4946.webp',
    'assets/images/album-full/_MID5269.webp',
    'assets/images/album-full/_MID5281.webp',
    'assets/images/album-full/_MID5288.webp',
    'assets/images/album-full/_MID5295.webp',
    'assets/images/album-full/_MID5425.webp',
    'assets/images/album-full/_MID5484.webp',
    'assets/images/album-full/_MID5515.webp',
    'assets/images/album-full/_MID5553.webp',
    'assets/images/album-full/_MID5594.webp'
];
let lbIndex = 0;
let lbTouchStartX = 0;
let lbNavigating = false;
const lbCache = {};

function lbPreload(index) {
    const i = (index + lightboxSrcs.length) % lightboxSrcs.length;
    if (!lbCache[i]) {
        const img = new Image();
        img.src = lightboxSrcs[i];
        lbCache[i] = img;
    }
}

function lbApplyImage(index) {
    const imgEl = document.getElementById('lightboxImg');
    imgEl.style.opacity = '0';
    const src = lightboxSrcs[index];
    const cached = lbCache[index];
    document.getElementById('lightboxCounter').textContent = (index + 1) + ' / ' + lightboxSrcs.length;

    const show = () => {
        imgEl.src = src;
        imgEl.style.opacity = '1';
        lbNavigating = false;
        lbPreload(index + 1);
        lbPreload(index - 1);
    };

    if (cached && cached.complete && cached.naturalWidth > 0) {
        setTimeout(show, 180);
    } else {
        const loader = cached || new Image();
        lbCache[index] = loader;
        if (!loader.src) loader.src = src;
        const done = () => setTimeout(show, 180);
        loader.onload = done;
        loader.onerror = done;
        if (loader.complete) done();
    }
}

function openLightbox(index) {
    lbIndex = index;
    lbNavigating = false;
    const overlay = document.getElementById('lightboxOverlay');
    const imgEl = document.getElementById('lightboxImg');
    imgEl.style.opacity = '1';
    imgEl.src = lightboxSrcs[lbIndex];
    document.getElementById('lightboxCounter').textContent = (lbIndex + 1) + ' / ' + lightboxSrcs.length;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbPreload(lbIndex + 1);
    lbPreload(lbIndex - 1);
}
function closeLightbox() {
    document.getElementById('lightboxOverlay').classList.remove('active');
    document.body.style.overflow = '';
    lbNavigating = false;
}
function lightboxNav(dir) {
    if (lbNavigating) return;
    lbNavigating = true;
    lbIndex = (lbIndex + dir + lightboxSrcs.length) % lightboxSrcs.length;
    lbApplyImage(lbIndex);
}
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightboxOverlay').classList.contains('active')) return;
    if (e.key === 'ArrowRight') lightboxNav(1);
    else if (e.key === 'ArrowLeft') lightboxNav(-1);
    else if (e.key === 'Escape') closeLightbox();
});
document.getElementById('lightboxOverlay').addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].clientX;
}, { passive: true });
document.getElementById('lightboxOverlay').addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1);
}, { passive: true });

function openBank(side) {
    openModal(side === 'groom' ? 'bankGroomModal' : 'bankBrideModal');
    trackBankClick(side);
}
function copyAccount(id, btn) {
    const text = document.getElementById(id).textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.title = 'Đã sao chép!';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.title = 'Sao chép';
        }, 2000);
    }).catch(() => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
    });
}
function openRSVP(side) {
    openModal(side === 'groom' ? 'rsvpGroomModal' : 'rsvpBrideModal');
}
function openWishOnly() {
    openModal('wishOnlyModal');
}
async function submitWishOnly(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.full_name.value.trim();
    const wish = form.wish.value.trim();
    if (!name || !wish) return;

    const btn = form.querySelector('.rsvp-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Đang gửi...';
    btn.disabled = true;

    try {
        await _saveRemoteEntry({
            name,
            relation: form.relation.value.trim(),
            wish,
            side: '',
            attending: '',
            time: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
        });
        closeModal('wishOnlyModal');
        form.reset();
        openModal('thankyouModal');
        loadWishes();
    } catch {
        btn.textContent = '✗ Lỗi! Thử lại';
        btn.style.background = '#e53935';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// ===== GOOGLE SHEETS CONFIG =====
const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzEUcYDSl1TwKoBafrnLWw2g2CW0Ife8F6t28chsS-wQs9py3IV0kSrdyTg1ACHmzby/exec';

// ===== WISHES =====
const _wishEsc = s => String(s ?? '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const _wishGetField = (obj, ...keys) => {
    for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '') return obj[k];
    }
    return '';
};

function _wishCardHTML(w) {
    return `<div class="wish-card">
                <div class="wish-meta">
                    <div class="wish-author">
                        <span class="wish-name">${_wishEsc(w.name)}</span>
                        ${w.relation ? `<span class="wish-relation">${_wishEsc(w.relation)}</span>` : ''}
                    </div>
                    ${w.side ? `<span class="wish-side-badge${w.side === 'Nhà Trai' ? ' groom' : ''}">${_wishEsc(w.side)}</span>` : ''}
                </div>
                <p class="wish-text">${_wishEsc(w.wish)}</p>
            </div>`;
}

let _wishUpdateFade = null;
function _wishSetupFade(container) {
    const wrap = container.closest('.wishes-scroll-wrap');
    if (!wrap) return;
    if (!_wishUpdateFade) {
        _wishUpdateFade = () => {
            const canScroll = container.scrollHeight > container.clientHeight;
            const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 4;
            wrap.classList.toggle('can-fade', canScroll && !atBottom);
        };
        container.addEventListener('scroll', _wishUpdateFade, { passive: true });
    }
    requestAnimationFrame(() => requestAnimationFrame(_wishUpdateFade));
}

// ===== JSONBIN.IO CONFIG =====
const JSONBIN_BIN_ID = '69be3e5cc3097a1dd5458eae';
const JSONBIN_KEY    = '$2a$10$IYBkxQE/HV6s948xpTc14.nXZ1qbBvf/uxxptpZj3QcwWNUFIynVe';
const JSONBIN_URL    = 'https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID;

async function _fetchBinRecord() {
    const res = await fetch(JSONBIN_URL + '/latest', {
        headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    const json = await res.json();
    return json.record || {};
}

async function _putBinRecord(record) {
    await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY },
        body: JSON.stringify(record)
    });
}

async function _getRemoteEntries() {
    const record = await _fetchBinRecord();
    return Array.isArray(record.entries) ? record.entries : [];
}

async function _saveRemoteEntry(entry) {
    const record = await _fetchBinRecord();
    const entries = Array.isArray(record.entries) ? record.entries : [];
    entries.unshift(entry);
    await _putBinRecord({ entries });
}

async function loadWishes() {
    const container = document.getElementById('wishes-list');
    if (!container) return;
    try {
        const entries = await _getRemoteEntries();
        const wishes = entries.filter(e => e.wish);
        container.innerHTML = wishes.length
            ? wishes.map(_wishCardHTML).join('')
            : '<p class="wishes-empty">Chưa có lời chúc nào.</p>';
        _wishSetupFade(container);
    } catch {
        if (!container.querySelector('.wish-card'))
            container.innerHTML = '<p class="wishes-empty">Không thể tải lời chúc.</p>';
    }
}

loadWishes();

async function submitRSVP(e, side) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.rsvp-submit');
    const originalText = btn.textContent;

    const sideName = side === 'groom' ? 'Nhà Trai' : 'Nhà Gái';
    const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const attending = form.attending.value === 'yes' ? 'Có' : (form.attending.value === 'no' ? 'Không' : 'Chưa xác định');

    const entry = {
        name:      form.full_name.value.trim(),
        relation:  form.relation.value.trim(),
        wish:      form.elements['wish'].value.trim(),
        side:      sideName,
        attending,
        time
    };

    btn.textContent = 'Đang gửi...';
    btn.disabled = true;

    try {
        await _saveRemoteEntry(entry);

        closeModal(side === 'groom' ? 'rsvpGroomModal' : 'rsvpBrideModal');
        form.reset();
        openModal('thankyouModal');
        if (entry.wish) loadWishes();
    } catch {
        btn.textContent = '✗ Lỗi! Thử lại';
        btn.style.background = '#e53935';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ===== INTRO CURTAIN ANIMATION =====
(function() {
    const overlay  = document.getElementById('intro-overlay');
    const seam     = overlay.querySelector('.intro-seam');
    const introTxt = overlay.querySelector('.intro-text');
    if (!overlay) return;

    document.body.style.overflow = 'hidden';

    setTimeout(function() {
        if (introTxt) introTxt.style.opacity = '0';
        if (seam) seam.style.opacity = '0';

        setTimeout(function() {
            overlay.classList.add('slide-open');

            setTimeout(function() {
                overlay.classList.add('done');
                document.body.style.overflow = '';
            }, 1050);
        }, 200);
    }, 1400);
})();

// ===== TRACKING =====
const TRACK_BIN_ID = '69be4217b7ec241ddc8ae0c4';
const TRACK_URL    = 'https://api.jsonbin.io/v3/b/' + TRACK_BIN_ID;

async function _fetchTrackRecord() {
    const res = await fetch(TRACK_URL + '/latest', {
        headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    const json = await res.json();
    const r = json.record || {};
    return {
        visits:      { total: 0, details: [], ...(r.visits      || {}) },
        bank_clicks: { groom: 0, bride:  0,  ...(r.bank_clicks || {}) }
    };
}

async function _putTrackRecord(record) {
    await fetch(TRACK_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY },
        body: JSON.stringify(record)
    });
}

function _getDeviceInfo() {
    const ua = navigator.userAgent;
    const device = /iPad/i.test(ua) ? 'Tablet' : /Mobi|Android|iPhone|iPod/i.test(ua) ? 'Mobile' : 'Desktop';
    const os = /Windows/i.test(ua) ? 'Windows'
             : /Android/i.test(ua) ? 'Android'
             : /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
             : /Mac OS X/i.test(ua) ? 'macOS'
             : /Linux/i.test(ua) ? 'Linux' : 'Unknown';
    const browser = /Edg/i.test(ua) ? 'Edge'
                  : /Chrome/i.test(ua) ? 'Chrome'
                  : /Firefox/i.test(ua) ? 'Firefox'
                  : /Safari/i.test(ua) ? 'Safari' : 'Unknown';
    return { device, os, browser };
}

async function trackVisit() {
    try {
        const record = await _fetchTrackRecord();
        record.visits.total += 1;
        record.visits.details.unshift({
            time: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
            ..._getDeviceInfo()
        });
        if (record.visits.details.length > 200) record.visits.details.length = 200;
        await _putTrackRecord(record);
    } catch {}
}

async function trackBankClick(side) {
    try {
        const record = await _fetchTrackRecord();
        record.bank_clicks[side] = (record.bank_clicks[side] || 0) + 1;
        await _putTrackRecord(record);
    } catch {}
}

trackVisit();
