/* ── VoxPopulAI — main.js ─────────────────────────
   Shared JS: nav, donate modal, cookies, utilities
   ─────────────────────────────────────────────── */

'use strict';

/* ── Cookies ──────────────────────────────────────── */
const Cookie = {
  set(name, value, days = 30) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; SameSite=Lax; path=/`;
  },
  get(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },
  remove(name) {
    document.cookie = `${name}=; max-age=0; path=/`;
  }
};

/* ── State Labels ─────────────────────────────────── */
const STATE_LABELS = {
  CA: 'California', CO: 'Colorado', IL: 'Illinois',
  NY: 'New York',   TX: 'Texas',    WA: 'Washington'
};

/* ── Navigation ───────────────────────────────────── */
function initNav() {
  const ham = document.querySelector('.nav__hamburger');
  const menu = document.querySelector('.nav__mobile-menu');
  if (!ham || !menu) return;

  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('open');
    });
  });

  // Highlight active page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });
}

/* ── Donate Modal ─────────────────────────────────── */
let donateState = { amount: 3, freq: 'once', custom: null };

function initDonate() {
  const overlay = document.getElementById('donate-overlay');
  if (!overlay) return;

  // Open
  document.querySelectorAll('[data-donate-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeDonate();
  });

  // Close button
  document.querySelectorAll('[data-donate-close]').forEach(btn => {
    btn.addEventListener('click', closeDonate);
  });

  // Frequency
  document.querySelectorAll('.donate-freq__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.donate-freq__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      donateState.freq = btn.dataset.freq;
      updateDonateBtn();
    });
  });

  // Amounts
  document.querySelectorAll('.donate-amt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.donate-amt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      donateState.amount = parseInt(btn.dataset.amount);
      donateState.custom = null;
      const customInput = document.getElementById('donate-custom-input');
      if (customInput) customInput.value = '';
      updateDonateBtn();
      updateImpactMsg();
    });
  });

  // Custom amount
  const customInput = document.getElementById('donate-custom-input');
  if (customInput) {
    customInput.addEventListener('input', () => {
      const val = parseFloat(customInput.value);
      if (val > 0) {
        document.querySelectorAll('.donate-amt').forEach(b => b.classList.remove('active'));
        donateState.amount = val;
        donateState.custom = val;
        updateDonateBtn();
        updateImpactMsg(true);
      }
    });
  }

  // Confirm donate
  const confirmBtn = document.getElementById('donate-confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      document.getElementById('donate-form-content').style.display = 'none';
      document.getElementById('donate-thanks').style.display = 'block';
    });
  }

  // Default active state
  document.querySelector('.donate-amt[data-amount="3"]')?.classList.add('active');
  document.querySelector('.donate-freq__btn[data-freq="once"]')?.classList.add('active');
  updateDonateBtn();
  updateImpactMsg();
}

function closeDonate() {
  const overlay = document.getElementById('donate-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  // Reset thanks state
  setTimeout(() => {
    const form = document.getElementById('donate-form-content');
    const thanks = document.getElementById('donate-thanks');
    if (form) form.style.display = 'block';
    if (thanks) thanks.style.display = 'none';
  }, 300);
}

function updateDonateBtn() {
  const btn = document.getElementById('donate-confirm');
  if (!btn) return;
  const suffix = donateState.freq === 'monthly' ? ' / month' : '';
  const amt = donateState.custom
    ? `$${donateState.custom.toFixed(2)}`
    : `$${donateState.amount}`;
  btn.textContent = `Donate ${amt}${suffix} →`;
}

const IMPACTS = {
  1: '$1 helps deliver The Brief to 4 readers for a day.',
  3: '$3 covers one day of The Brief for 12 readers.',
  5: '$5 funds a full week of newsletter delivery.',
};

function updateImpactMsg(custom = false) {
  const el = document.getElementById('donate-impact-msg');
  if (!el) return;
  el.textContent = custom || !IMPACTS[donateState.amount]
    ? 'Every dollar keeps VoxPopulAI free and independent.'
    : IMPACTS[donateState.amount];
}

/* ── Bill expand/collapse ─────────────────────────── */
function initBills() {
  document.querySelectorAll('.bill__expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.closest('.bill').querySelector('.bill__details');
      if (!details) return;
      const open = details.classList.toggle('open');
      btn.textContent = open ? '− Close' : '+ Details';
    });
  });
}

/* ── Location (Policy Watch + Take Action) ────────── */
function initLocation({ onSet } = {}) {
  const saved = Cookie.get('vpa_loc');
  const select = document.querySelector('.location-select');

  if (saved && STATE_LABELS[saved]) {
    if (select) select.value = saved;
    setLocation(saved, onSet);
  }

  if (select) {
    select.addEventListener('change', () => {
      if (select.value) setLocation(select.value, onSet);
    });
  }

  const detectBtn = document.getElementById('detect-location-btn');
  if (detectBtn) {
    detectBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => { /* Reverse-geocode requires API key — prompt user to confirm state */ showLocationPrompt(); },
          () => showLocationPrompt()
        );
      } else {
        showLocationPrompt();
      }
    });
  }

  const clearBtn = document.getElementById('clear-location-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Cookie.remove('vpa_loc');
      if (select) select.value = '';
      const setEl = document.querySelector('.location-bar__set');
      const defaultEl = document.querySelector('.location-bar__default');
      if (setEl) setEl.classList.remove('visible');
      if (defaultEl) defaultEl.classList.remove('hidden');
      if (onSet) onSet(null);
    });
  }
}

function setLocation(code, callback) {
  Cookie.set('vpa_loc', code);
  const label = STATE_LABELS[code] || code;
  const labelEl = document.getElementById('location-label');
  const setEl = document.querySelector('.location-bar__set');
  const defaultEl = document.querySelector('.location-bar__default');
  if (labelEl) labelEl.textContent = label;
  if (setEl) setEl.classList.add('visible');
  if (defaultEl) defaultEl.classList.add('hidden');
  if (callback) callback(code);
}

function showLocationPrompt() {
  alert('Location detected. Please confirm your state from the dropdown to load local policies.');
}

/* ── Filter pills ─────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const groupName = group.dataset.filterGroup;
    group.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.filter;
        document.querySelectorAll(`[data-filter-target="${groupName}"]`).forEach(el => {
          const status = (el.dataset.status || '').toLowerCase();
          if (val === 'all') { el.style.display = ''; return; }
          const show =
            (val === 'active'   && (status.includes('active') || status.includes('committee'))) ||
            (val === 'force'    && (status.includes('force') || status.includes('signed') || status.includes('adopted'))) ||
            (val === 'passed'   && (status.includes('passed') || status.includes('signed'))) ||
            (val === 'pending'  && (status.includes('pending') || status.includes('proposed') || status.includes('development')));
          el.style.display = show ? '' : 'none';
        });
      });
    });
  });
}

/* ── Action tabs ──────────────────────────────────── */
function initActionTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const groupName = group.dataset.tabGroup;
    group.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panelId = btn.dataset.tab;
        document.querySelectorAll(`[data-tab-panel="${groupName}"]`).forEach(panel => {
          panel.style.display = panel.id === panelId ? '' : 'none';
        });
      });
    });
  });
}

/* ── Copy to clipboard ────────────────────────────── */
function copyToClipboard(text, confirmEl) {
  navigator.clipboard?.writeText(text).then(() => showCopyConfirm(confirmEl))
    .catch(() => { legacyCopy(text); showCopyConfirm(confirmEl); });
}

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:absolute;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function showCopyConfirm(el) {
  if (!el) return;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

/* ── Smooth anchor scroll ─────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDonate();
  initBills();
  initFilters();
  initActionTabs();
  initSmoothScroll();
});
