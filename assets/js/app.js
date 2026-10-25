/* 松鼠兽牌 toy
 * 基于 GPL-3.0 开源的 Android 版「松鼠兽牌」复刻
 * 原始项目：https://github.com/LaoFang114514/songshu-phone-badge
 */
(function () {
  'use strict';

  /* ============================================================
   * 基础工具
   * ============================================================ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  const ICONS = {
    add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    image: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
    video: 'M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z',
    tune: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    qr: 'M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 19h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z',
    palette: 'M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16a5 5 0 005-5c0-4.42-4.03-8-9-8zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z',
    help: 'M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14a4 4 0 00-4 4h2a2 2 0 114 0c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 00-4-4z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    phone: 'M17 1H7a2 2 0 00-2 2v18a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2zm0 18H7V5h10v14z',
    settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.33-.02-.64-.07-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54c-.59.24-1.13.55-1.62.94l-2.39-.96a.5.5 0 00-.61.22L2.07 8.9a.5.5 0 00.12.64l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32c.13.22.39.3.61.22l2.39-.96c.5.39 1.03.7 1.62.94l.36 2.54c.05.24.25.42.5.42h3.84c.25 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.55 1.62-.94l2.39.96c.22.08.48 0 .61-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z',
    photo: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
    school: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L21 9l-9-6zm6.82 9L12 15.72 5.18 12 12 8.28 18.82 12zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
    chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'
  };

  function icon(name, cls = '') {
    return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name] || ''}"/></svg>`;
  }

  const QR_PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9e9e9e"><path d="${ICONS.qr}"/></svg>`
  );

  const COLORS = [
    { light: '#1565c0', dark: '#90caf9', sLight: '#42a5f5', sDark: '#64b5f6', tLight: '#1e88e5', tDark: '#42a5f5' },
    { light: '#2e7d32', dark: '#a5d6a7', sLight: '#66bb6a', sDark: '#81c784', tLight: '#43a047', tDark: '#66bb6a' },
    { light: '#e65100', dark: '#ffcc80', sLight: '#ff9800', sDark: '#ffb74d', tLight: '#f57c00', tDark: '#ff9800' },
    { light: '#c2185b', dark: '#f48fb1', sLight: '#f06292', sDark: '#f06292', tLight: '#d81b60', tDark: '#ec407a' },
    { light: '#6a1b9a', dark: '#ce93d8', sLight: '#ab47bc', sDark: '#ba68c8', tLight: '#8e24aa', tDark: '#ab47bc' },
    { light: '#00695c', dark: '#80cbc4', sLight: '#26a69a', sDark: '#4db6ac', tLight: '#00897b', tDark: '#26a69a' },
    { light: '#d32f2f', dark: '#ef9a9a', sLight: '#ef5350', sDark: '#e57373', tLight: '#e53935', tDark: '#ef5350' },
    { light: '#f9a825', dark: '#e6ee9c', sLight: '#ffee58', sDark: '#dce775', tLight: '#fdd835', tDark: '#ffee58' }
  ];

  const COLOR_ORDER = [
    { idx: 6, label: 'color_red' },
    { idx: 2, label: 'color_orange' },
    { idx: 7, label: 'color_yellow' },
    { idx: 1, label: 'color_green' },
    { idx: 5, label: 'color_teal' },
    { idx: 0, label: 'color_blue' },
    { idx: 4, label: 'color_purple' },
    { idx: 3, label: 'color_pink' }
  ];

  /* 原版 Theme.kt 的基准色与中性表面色：toy 直接写入 MDUI 令牌，避免生成调色板偏色 */
  const M3_BASE = {
    light: {
      secondaryContainer: '#e8def8', onSecondaryContainer: '#1d192b',
      tertiaryContainer: '#ffd8e4', onTertiaryContainer: '#31111d',
      error: '#b3261e', onError: '#ffffff', errorContainer: '#f9dedc', onErrorContainer: '#410e0b',
      inversePrimary: '#d0bcff', inverseSurface: '#313033', inverseOnSurface: '#f4eff4',
      outline: '#79747e', outlineVariant: '#cac4d0'
    },
    dark: {
      secondaryContainer: '#4a4458', onSecondaryContainer: '#e8def8',
      tertiaryContainer: '#633b48', onTertiaryContainer: '#ffd8e4',
      error: '#f2b8b5', onError: '#601410', errorContainer: '#8c1d18', onErrorContainer: '#f9dedc',
      inversePrimary: '#6750a4', inverseSurface: '#e6e1e5', inverseOnSurface: '#313033',
      outline: '#938f99', outlineVariant: '#49454f'
    }
  };

  const NEUTRAL_SURFACES = {
    light: {
      background: '#ffffff', onBackground: '#000000', surface: '#ffffff', onSurface: '#000000',
      surfaceVariant: '#f5f5f5', onSurfaceVariant: '#757575',
      surfaceDim: '#f0f0f0', surfaceBright: '#ffffff',
      surfaceContainerLowest: '#ffffff', surfaceContainerLow: '#f9f9f9',
      surfaceContainer: '#f3f3f3', surfaceContainerHigh: '#ededed', surfaceContainerHighest: '#e8e8e8'
    },
    dark: {
      background: '#000000', onBackground: '#ffffff', surface: '#000000', onSurface: '#ffffff',
      surfaceVariant: '#1e1e1e', onSurfaceVariant: '#bdbdbd',
      surfaceDim: '#000000', surfaceBright: '#303030',
      surfaceContainerLowest: '#0a0a0a', surfaceContainerLow: '#121212',
      surfaceContainer: '#1a1a1a', surfaceContainerHigh: '#222222', surfaceContainerHighest: '#2a2a2a'
    }
  };

  function rgbTriple(hex) {
    const n = parseInt(hex.slice(1), 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }

  function onColorTriple(hex) {
    return luminance(hex) > 0.3 ? '0,0,0' : '255,255,255';
  }

  function mixTriple(hex, baseHex, alpha) {
    const a = parseInt(hex.slice(1), 16);
    const b = parseInt(baseHex.slice(1), 16);
    const ch = shift => Math.round((((a >> shift) & 255) * alpha) + (((b >> shift) & 255) * (1 - alpha)));
    return `${ch(16)},${ch(8)},${ch(0)}`;
  }

  function applyOriginalPalette(c, dark) {
    const mode = dark ? 'dark' : 'light';
    const base = M3_BASE[mode];
    const surfaces = NEUTRAL_SURFACES[mode];
    const primary = dark ? c.dark : c.light;
    const secondary = dark ? c.sDark : c.sLight;
    const tertiary = dark ? c.tDark : c.tLight;
    const tokens = {
      'primary': rgbTriple(primary),
      'on-primary': onColorTriple(primary),
      'primary-container': mixTriple(primary, surfaces.background, 0.15),
      'on-primary-container': dark ? '38,38,38' : onColorTriple(primary),
      'inverse-primary': rgbTriple(base.inversePrimary),
      'secondary': rgbTriple(secondary),
      'on-secondary': onColorTriple(secondary),
      'secondary-container': rgbTriple(base.secondaryContainer),
      'on-secondary-container': rgbTriple(base.onSecondaryContainer),
      'tertiary': rgbTriple(tertiary),
      'on-tertiary': onColorTriple(tertiary),
      'tertiary-container': rgbTriple(base.tertiaryContainer),
      'on-tertiary-container': rgbTriple(base.onTertiaryContainer),
      'error': rgbTriple(base.error),
      'on-error': rgbTriple(base.onError),
      'error-container': rgbTriple(base.errorContainer),
      'on-error-container': rgbTriple(base.onErrorContainer),
      'background': rgbTriple(surfaces.background),
      'on-background': rgbTriple(surfaces.onBackground),
      'surface': rgbTriple(surfaces.surface),
      'on-surface': rgbTriple(surfaces.onSurface),
      'surface-variant': rgbTriple(surfaces.surfaceVariant),
      'on-surface-variant': rgbTriple(surfaces.onSurfaceVariant),
      'surface-dim': rgbTriple(surfaces.surfaceDim),
      'surface-bright': rgbTriple(surfaces.surfaceBright),
      'surface-container-lowest': rgbTriple(surfaces.surfaceContainerLowest),
      'surface-container-low': rgbTriple(surfaces.surfaceContainerLow),
      'surface-container': rgbTriple(surfaces.surfaceContainer),
      'surface-container-high': rgbTriple(surfaces.surfaceContainerHigh),
      'surface-container-highest': rgbTriple(surfaces.surfaceContainerHighest),
      'outline': rgbTriple(base.outline),
      'outline-variant': rgbTriple(base.outlineVariant),
      'inverse-surface': rgbTriple(base.inverseSurface),
      'inverse-on-surface': rgbTriple(base.inverseOnSurface),
      'surface-tint-color': rgbTriple(primary),
      'scrim': '0,0,0',
      'shadow': '0,0,0'
    };
    const root = document.documentElement;
    Object.keys(tokens).forEach(k => root.style.setProperty('--mdui-color-' + k, tokens[k]));
  }

  function luminance(hex) {
    const n = parseInt(hex.slice(1), 16);
    const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 3);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  const ls = {
    get(k, d = null) { try { return localStorage.getItem(k) ?? d; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, String(v)); } catch (_) {} },
    remove(k) { try { localStorage.removeItem(k); } catch (_) {} }
  };

  /* ============================================================
   * 设置
   * ============================================================ */
  const SETTINGS_KEY = 'ssp_web_settings_v1';
  const DEFAULT_SETTINGS = {
    defaultOrientation: false,
    keepScreenOn: false,
    showBattery: false,
    antiBurnIn: false,
    muteVideo: false,
    languageIndex: 0,
    themeColorIndex: 0,
    darkMode: 0,
    showQrCode: false,
    qrSwipeSwitch: false
  };

  function readSettings() {
    const out = Object.assign({}, DEFAULT_SETTINGS);
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return out;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.keys(DEFAULT_SETTINGS).forEach(k => {
          if (parsed[k] !== undefined && typeof parsed[k] === typeof DEFAULT_SETTINGS[k]) out[k] = parsed[k];
        });
      }
    } catch (_) {}
    return out;
  }

  const settings = readSettings();

  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
  }

  function t(key, ...args) {
    const dict = window.I18N[settings.languageIndex === 1 ? 'en' : 'zh'];
    let s = dict && dict[key] != null ? dict[key] : (window.I18N.zh[key] != null ? window.I18N.zh[key] : key);
    return String(s).replace(/\{(\d+)\}/g, (_, i) => args[Number(i)] != null ? args[Number(i)] : '');
  }

  const SWITCH_FIELDS = {
    reverse_display: 'defaultOrientation',
    keep_screen_on: 'keepScreenOn',
    show_battery: 'showBattery',
    anti_burn_in: 'antiBurnIn',
    mute_video: 'muteVideo',
    swipe_show_qr: 'showQrCode',
    qr_swipe_switch: 'qrSwipeSwitch'
  };

  function isDarkTheme() {
    if (settings.darkMode === 2) return true;
    if (settings.darkMode === 1) return false;
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (_) { return false; }
  }

  function applyTheme() {
    const dark = isDarkTheme();
    const c = COLORS[settings.themeColorIndex] || COLORS[0];
    const root = document.documentElement;
    root.classList.remove('mdui-theme-light', 'mdui-theme-dark', 'mdui-theme-auto');
    root.classList.add(settings.darkMode === 0
      ? 'mdui-theme-auto'
      : (dark ? 'mdui-theme-dark' : 'mdui-theme-light'));
    root.dataset.theme = dark ? 'dark' : 'light';
    applyOriginalPalette(c, dark);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#000000' : '#ffffff');
  }

  /* ============================================================
   * IndexedDB
   * ============================================================ */
  const DB_NAME = 'songshu_badge_web';
  let db = null;
  let dbBroken = false;

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) { reject(new Error('no indexedDB')); return; }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains('badges')) d.createObjectStore('badges', { keyPath: 'id' });
        if (!d.objectStoreNames.contains('qrcodes')) d.createObjectStore('qrcodes', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('indexedDB error'));
    });
  }

  function txStore(name, mode) {
    return db.transaction(name, mode).objectStore(name);
  }

  function dbGetAll(name) {
    return new Promise((resolve) => {
      if (!db) { resolve([]); return; }
      try {
        const req = txStore(name, 'readonly').getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (_) { resolve([]); }
    });
  }

  function dbPut(name, value) {
    return new Promise((resolve) => {
      if (!db) { resolve(false); return; }
      try {
        const req = txStore(name, 'readwrite').put(value);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (_) { resolve(false); }
    });
  }

  function dbDelete(name, id) {
    return new Promise((resolve) => {
      if (!db) { resolve(false); return; }
      try {
        const req = txStore(name, 'readwrite').delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (_) { resolve(false); }
    });
  }

  /* ============================================================
   * 应用状态
   * ============================================================ */
  let badges = [];
  let qrs = [];
  const urlCache = new Map();
  const qrUrlCache = new Map();

  const State = {
    view: 'home',
    sub: null,
    selectedBadgeId: ls.get('ssp_selected_badge', ''),
    selectedQrId: ls.get('ssp_selected_qr', ''),
    tutOpen: { basic: true }
  };

  const fsState = {
    open: false,
    rotation: 0,
    qrOpen: false,
    burnTimer: null,
    hintTimer: null,
    flipHintTimer: null,
    battery: null,
    batteryCleanup: null,
    batteryLevel: -1,
    toyImmersive: false,
    toyAttempted: false,
    toyOff: null
  };

  let cropState = null;

  function genId(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function sortByOrder(list) {
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list;
  }

  function displayBadges() {
    if (badges.length) return badges;
    return [{
      id: 'default',
      name: t('default_badge'),
      type: 'image',
      blob: null,
      cover: null,
      order: 0,
      virtual: true
    }];
  }

  function selectedBadge() {
    const list = displayBadges();
    return list.find(b => b.id === State.selectedBadgeId) || list[0];
  }

  function badgeIndex(id) {
    return badges.findIndex(b => b.id === id);
  }

  function badgeUrl(b, full) {
    if (!b || b.id === 'default' || !b.blob) return './assets/img/shili.png';
    const key = b.id + (full ? ':full' : ':cover');
    if (urlCache.has(key)) return urlCache.get(key);
    const blob = full ? b.blob : (b.type === 'video' ? (b.cover || b.blob) : b.blob);
    if (!blob) return './assets/img/shili.png';
    const u = URL.createObjectURL(blob);
    urlCache.set(key, u);
    return u;
  }

  function revokeBadgeUrls(id) {
    for (const key of Array.from(urlCache.keys())) {
      if (key.indexOf(id + ':') === 0) {
        try { URL.revokeObjectURL(urlCache.get(key)); } catch (_) {}
        urlCache.delete(key);
      }
    }
  }

  function qrUrl(q) {
    if (!q || !q.blob) return QR_PLACEHOLDER;
    if (qrUrlCache.has(q.id)) return qrUrlCache.get(q.id);
    const u = URL.createObjectURL(q.blob);
    qrUrlCache.set(q.id, u);
    return u;
  }

  function revokeQrUrl(id) {
    if (qrUrlCache.has(id)) {
      try { URL.revokeObjectURL(qrUrlCache.get(id)); } catch (_) {}
      qrUrlCache.delete(id);
    }
  }

  async function loadData() {
    try {
      db = await openDB();
    } catch (_) {
      dbBroken = true;
      db = null;
    }
    const b = await dbGetAll('badges');
    const q = await dbGetAll('qrcodes');
    badges = sortByOrder(b);
    qrs = sortByOrder(q);
    if (State.selectedBadgeId && !badges.some(x => x.id === State.selectedBadgeId)) {
      State.selectedBadgeId = badges.length ? badges[0].id : '';
    }
    if (State.selectedQrId && !qrs.some(x => x.id === State.selectedQrId)) {
      State.selectedQrId = qrs.length ? qrs[0].id : '';
    }
  }

  function selectBadge(id) {
    State.selectedBadgeId = id;
    ls.set('ssp_selected_badge', id);
  }

  /* ============================================================
   * 渲染：框架 / 页面
   * ============================================================ */
  const SUB_TITLES = {
    basic: 'basic_settings',
    qrcode: 'qrcode_settings',
    theme: 'theme_settings',
    about: 'about_settings',
    tutorial: 'tutorial_settings',
    license: 'open_source_license'
  };

  function renderChrome() {
    const titleKey = State.sub ? SUB_TITLES[State.sub] : 'app_name';
    const title = t(titleKey || 'app_name');
    $('#title').textContent = title;
    document.title = title === t('app_name') ? t('app_name') : title + ' · ' + t('app_name');
    const backBtn = $('#backBtn');
    backBtn.hidden = !State.sub;
    $('#appbar').classList.toggle('has-back', !!State.sub);
    const active = fsState.open ? 'start' : (State.view === 'settings' ? 'settings' : 'home');
    $$('#bottomnav .nav-item').forEach(el => {
      const on = el.dataset.nav === active;
      el.classList.toggle('on', on);
      if (on) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
      const key = el.dataset.nav === 'home' ? 'nav_home' : (el.dataset.nav === 'start' ? 'nav_start' : 'nav_settings');
      el.setAttribute('aria-label', t(key));
    });
    document.documentElement.lang = settings.languageIndex === 1 ? 'en' : 'zh-CN';
  }

  function renderPage(opts) {
    opts = opts || {};
    const page = $('#page');
    const scroll = page.scrollTop;
    page.className = 'page' + (State.view === 'settings' ? ' settings-page' : '');
    if (State.view === 'home') {
      page.innerHTML = renderHome();
    } else if (State.sub) {
      page.innerHTML = renderSub(State.sub);
    } else {
      page.innerHTML = renderSettings();
    }
    if (opts.keepScroll) page.scrollTop = scroll;
    else page.scrollTop = 0;
  }

  /* 页面切换动画：子页面右进右出；主页与设置之间淡入淡出 */
  let pageAnimCleanup = null;

  function transitionPage(direction, opts) {
    const oldPage = $('#page');
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!oldPage || reduced) {
      renderPage(opts);
      return;
    }
    if (pageAnimCleanup) pageAnimCleanup();

    const parent = oldPage.parentNode;
    const rect = oldPage.getBoundingClientRect();
    const page = oldPage.cloneNode(false);
    page.id = 'page';
    page.className = 'page' + (State.view === 'settings' ? ' settings-page' : '');
    parent.insertBefore(page, oldPage);

    /* 把原页面定格成快照，避免重绘过程中丢滚动位置或组件状态 */
    oldPage.removeAttribute('id');
    oldPage.classList.add('page-anim-layer');
    oldPage.setAttribute('aria-hidden', 'true');
    try { oldPage.inert = true; } catch (_) {}
    oldPage.style.top = rect.top + 'px';
    oldPage.style.left = rect.left + 'px';
    oldPage.style.width = rect.width + 'px';
    oldPage.style.height = rect.height + 'px';
    document.body.appendChild(oldPage);
    const snapshot = oldPage;

    renderPage(opts);

    if (direction === 'enter') {
      page.classList.add('page-slide-in');
    } else if (direction === 'fade') {
      page.classList.add('page-fade-in');
      snapshot.classList.add('fade-out');
    } else {
      snapshot.classList.add('slide-out');
    }

    let done = false;
    let timer = 0;
    const cleanup = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      page.removeEventListener('animationend', onAnimEnd);
      if (snapshot.parentNode) snapshot.parentNode.removeChild(snapshot);
      page.classList.remove('page-slide-in', 'page-fade-in');
      if (pageAnimCleanup === cleanup) pageAnimCleanup = null;
    };
    const onAnimEnd = e => {
      if (e.target === page) cleanup();
    };
    timer = setTimeout(cleanup, 340);
    if (direction === 'enter' || direction === 'fade') page.addEventListener('animationend', onAnimEnd);
    else snapshot.addEventListener('animationend', cleanup);
    pageAnimCleanup = cleanup;
  }

  function renderHome() {
    const list = displayBadges();
    const sel = selectedBadge();
    const cards = list.map(b => {
      const isSel = sel && b.id === sel.id;
      const sub = isSel ? t('currently_in_use') : (b.type === 'video' ? t('video') : t('image'));
      const menu = b.virtual ? '' : `<button class="more-btn" data-action="badge-menu" data-id="${esc(b.id)}" aria-label="${esc(t('more_options'))}">${icon('more')}</button>`;
      return `<div class="badge-card${isSel ? ' selected' : ''}" data-action="select-badge" data-id="${esc(b.id)}" role="button" tabindex="0">
        <div class="thumb">
          <img src="${badgeUrl(b, false)}" alt="${esc(b.name)}" loading="lazy" onerror="this.src='./assets/img/shili.png'">
          ${isSel ? '<span class="selected-dot"></span>' : ''}
        </div>
        <div class="badge-info">
          <div class="badge-name">${esc(b.name)}</div>
          <div class="badge-sub">${esc(sub)}</div>
        </div>
        ${menu}
      </div>`;
    }).join('');

    return `<div class="badge-list">
      ${cards}
      <button class="add-card" data-action="add-badge">
        <span class="plus">${icon('add')}</span>
        <span>${esc(t('add_badge'))}</span>
      </button>
    </div>`;
  }

  function settingsNavRow(iconName, labelKey, sub) {
    return `<button class="nav-row" data-action="sub" data-sub="${sub}">
      <span class="nav-ico">${icon(iconName)}</span>
      <span class="nav-text">${esc(t(labelKey))}</span>
      <span class="chev">▶</span>
    </button>`;
  }

  /* ============================================================
   * 关注作者卡片
   * 跳转走 Toy 官方 navigate（SDK 里的路由表：space -> //space.bilibili.com/{id}），
   * 它要求点击手势内的 transient activation，所以在事件里同步调用、失败再兜底复制链接。
   * ============================================================ */
  const AUTHOR_UID = '631041617';
  const AUTHOR_NAME = '松鼠老方';
  const ORIGINAL_VIDEO = 'BV1mj3t6sES3';
  let authorProfile = null;

  function authorMid() {
    return String((authorProfile && authorProfile.mid) || AUTHOR_UID);
  }

  function spaceUrl() {
    return 'https://space.bilibili.com/' + authorMid();
  }

  function videoUrl() {
    return 'https://m.bilibili.com/video/' + ORIGINAL_VIDEO;
  }

  function loadAuthorProfile() {
    if (authorProfile || !window.toy || typeof window.toy.getAuthorProfile !== 'function') {
      if (!authorProfile) authorProfile = { mid: AUTHOR_UID, name: '', face: '' };
      return;
    }
    Promise.resolve(window.toy.getAuthorProfile()).then(p => {
      const d = (p && (p.data || p)) || {};
      authorProfile = {
        mid: String(d.mid || d.id || d.uid || d.mid_str || AUTHOR_UID),
        name: String(d.name || d.uname || d.nickname || ''),
        face: String(d.face || d.avatar || d.header_url || '')
      };
      if (State.view === 'settings' && !State.sub) renderPage({ keepScroll: true });
    }).catch(() => {
      authorProfile = { mid: AUTHOR_UID, name: '', face: '' };
    });
  }

  /* 跳转没成时给一个可点/可复制的链接面板：
     复制链接需要用户手势，超时后再调 copyToClipboard 已经没手势了，必须让用户再点一下。 */
  function showLinkPanel(url) {
    openDialog({
      title: t('follow_space_title'),
      body: `<p>${esc(t('follow_space_desc'))}</p><p class="follow-link"><a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a></p>`,
      actions: [
        { label: t('close'), className: 'outlined' },
        { label: t('desktop_gate_copy'), onClick: () => { copyToClipboard(url); } }
      ]
    });
  }

  /* App 内走 Toy 官方 navigate（SDK 路由表：space -> //space.bilibili.com/{id}、
     video -> //www.bilibili.com/video/{id}）。容器可能不回 promise，也可能直接压出新页：
     所以既等超时也盯 visibility —— 页面被盖住就说明跳成功了，回来时不再补弹面板。 */
  function biliJump(navType, navId, url) {
    const inApp = /BiliApp|bilibili/i.test(String(navigator.userAgent || ''));
    if (inApp && window.toy && typeof window.toy.navigate === 'function') {
      try {
        const r = window.toy.navigate({ type: navType, id: navId });
        if (r && typeof r.then === 'function') {
          let done = false;
          const onHide = () => { if (document.hidden) done = true; };
          const settle = ok => {
            if (done) return;
            done = true;
            document.removeEventListener('visibilitychange', onHide);
            clearTimeout(timer);
            if (!ok) showLinkPanel(url);
          };
          const timer = setTimeout(() => settle(false), 2200);
          document.addEventListener('visibilitychange', onHide);
          r.then(() => settle(true), () => settle(false));
          return;
        }
        return;
      } catch (_) {
        showLinkPanel(url);
        return;
      }
    }
    /* 桌面/普通浏览器：手势还在，直接开新标签 */
    let w = null;
    try { w = window.open(url, '_blank'); } catch (_) {}
    if (!w) showLinkPanel(url);
  }

  function followAuthor() {
    biliJump('space', authorMid(), spaceUrl());
  }

  function watchOriginalVideo() {
    biliJump('video', ORIGINAL_VIDEO, videoUrl());
  }

  function renderFollowCard() {
    const name = (authorProfile && authorProfile.name) || AUTHOR_NAME;
    const face = authorProfile && authorProfile.face;
    return `<div class="settings-card follow-card">
      <div class="follow-head">
        ${face ? `<img class="follow-face" src="${esc(face)}" alt="">` : ''}
        <span class="follow-title">${esc(t('follow_title'))}</span>
        <span class="about-ver">v1.0</span>
      </div>
      <div class="small-note">${esc(t('follow_desc', name))}</div>
      <div class="follow-row">
        <mdui-button variant="outlined" data-action="follow-author">${esc(t('follow_btn'))}</mdui-button>
        <mdui-button variant="outlined" data-action="watch-video">${esc(t('follow_video'))}</mdui-button>
      </div>
    </div>`;
  }

  function renderSettings() {
    loadAuthorProfile();
    return `<div class="settings-wrap">
      ${renderFollowCard()}
      <div class="nav-list">
        ${settingsNavRow('tune', 'basic_settings', 'basic')}
        ${settingsNavRow('qr', 'qrcode_settings', 'qrcode')}
        ${settingsNavRow('palette', 'theme_settings', 'theme')}
        ${settingsNavRow('help', 'tutorial_settings', 'tutorial')}
        ${settingsNavRow('info', 'about_settings', 'about')}
      </div>
    </div>`;
  }

  function renderSub(sub) {
    switch (sub) {
      case 'basic': return renderBasic();
      case 'qrcode': return renderQrSettings();
      case 'theme': return renderTheme();
      case 'about': return renderAbout();
      case 'tutorial': return renderTutorial();
      case 'license': return renderLicense();
      default: return renderSettings();
    }
  }

  function switchRow(labelKey, descKey, field, disabled) {
    /* 常亮显示在 B站 Toy 容器里做不到（见 i18n 说明），所以永远按关闭显示且禁用 */
    const on = field === 'keepScreenOn' ? false : !!settings[field];
    return `<div class="row">
      <div class="row-text">
        <div class="row-title">${esc(t(labelKey))}</div>
        <div class="row-desc">${esc(t(descKey))}</div>
      </div>
      <mdui-switch data-key="${labelKey}" aria-label="${esc(t(labelKey))}" ${on ? 'checked' : ''} ${disabled ? 'disabled' : ''}></mdui-switch>
    </div>`;
  }

  function renderBasic() {
    const lang = settings.languageIndex === 1 ? 1 : 0;
    return `<div class="settings-wrap">
      <div class="settings-card">
        <div class="row">
          <div class="row-text">
            <div class="row-title">${esc(t('language'))}</div>
            <div class="row-desc">${esc(t('language_desc'))}</div>
          </div>
          <select class="select" id="langSelect" aria-label="${esc(t('language'))}">
            <option value="0"${lang === 0 ? ' selected' : ''}>${esc(t('lang_chinese'))}</option>
            <option value="1"${lang === 1 ? ' selected' : ''}>${esc(t('lang_english'))}</option>
          </select>
        </div>
        <div class="divider"></div>
        ${switchRow('reverse_display', 'reverse_display_desc', 'defaultOrientation')}
        <div class="divider"></div>
        ${switchRow('keep_screen_on', 'keep_screen_on_desc', 'keepScreenOn', true)}
        <div class="divider"></div>
        ${switchRow('show_battery', 'show_battery_desc', 'showBattery')}
        <div class="divider"></div>
        ${switchRow('anti_burn_in', 'anti_burn_in_desc', 'antiBurnIn')}
        <div class="divider"></div>
        ${switchRow('mute_video', 'mute_video_desc', 'muteVideo')}
      </div>
    </div>`;
  }

  function qrCard(q, i) {
    const enabled = !!settings.showQrCode;
    const isSel = State.selectedQrId === q.id;
    return `<div class="qr-card${isSel ? ' selected' : ''}${enabled ? '' : ' disabled'}" data-action="select-qr" data-id="${esc(q.id)}" data-disabled="${enabled ? '0' : '1'}" role="button" tabindex="0">
      <div class="thumb qr-thumb">
        <img src="${qrUrl(q)}" alt="${esc(q.name)}" loading="lazy" onerror="this.style.opacity='0'">
        ${isSel ? '<span class="selected-dot"></span>' : ''}
      </div>
      <div class="badge-info">
        <div class="badge-name">${esc(q.name)}</div>
        ${q.link ? `<div class="badge-sub">${esc(q.link)}</div>` : ''}
      </div>
      <button class="more-btn" data-action="qr-menu" data-id="${esc(q.id)}" ${enabled ? '' : 'disabled'} aria-label="${esc(t('more_options'))}">${icon('more')}</button>
    </div>`;
  }

  function renderQrSettings() {
    const enabled = !!settings.showQrCode;
    return `<div class="settings-wrap">
      <div class="settings-card">
        ${switchRow('swipe_show_qr', 'swipe_show_qr_desc', 'showQrCode')}
        <div class="divider"></div>
        ${switchRow('qr_swipe_switch', 'qr_swipe_switch_desc', 'qrSwipeSwitch', !enabled)}
      </div>
      <div class="qr-toolbar">
        <mdui-button variant="outlined" data-action="qr-from-link" ${enabled ? '' : 'disabled'}>${esc(t('qr_from_link'))}</mdui-button>
        <mdui-button variant="outlined" data-action="qr-import" ${enabled ? '' : 'disabled'}>${esc(t('import_qr'))}</mdui-button>
      </div>
      <div class="qr-list">
        ${qrs.length
          ? qrs.map(qrCard).join('')
          : `<div class="qr-empty">
              <span class="qr-empty-icon">${icon('qr')}</span>
              <span class="qr-empty-title">${esc(t('qr_empty'))}</span>
              <span class="small-note">${esc(t('qr_empty_hint'))}</span>
            </div>`}
      </div>
    </div>`;
  }

  function renderTheme() {
    const modes = [
      { v: 0, label: 'follow_system' },
      { v: 1, label: 'light_mode' },
      { v: 2, label: 'dark_mode_label' }
    ];
    return `<div class="settings-wrap">
      <div class="settings-card">
        <div class="section-title">${esc(t('dark_mode'))}</div>
        <div class="seg">
          ${modes.map(m => `<button class="${settings.darkMode === m.v ? 'on' : ''}" data-action="dark-mode" data-mode="${m.v}">${esc(t(m.label))}</button>`).join('')}
        </div>
        <div class="divider" style="margin:16px 0"></div>
        <div class="section-title">${esc(t('theme_color'))}</div>
        <div>
          ${COLOR_ORDER.map(o => `<button class="color-row${settings.themeColorIndex === o.idx ? ' on' : ''}" data-action="theme-color" data-index="${o.idx}">
            <span class="sw" style="background:${COLORS[o.idx].light}"></span>
            <span class="color-name">${esc(t(o.label))}</span>
            ${settings.themeColorIndex === o.idx ? '<span class="tick">✓</span>' : ''}
          </button>`).join('')}
        </div>
      </div>
    </div>`;
  }

  function renderAbout() {
    return `<div class="settings-wrap">
      <div class="about-hero">
        <div class="about-logo" data-action="egg-sudoku" role="button" tabindex="0" aria-label="${esc(t('about_app_name'))}"><img src="./assets/img/qidong.png" alt="${esc(t('about_app_name'))}"></div>
        <div class="about-name">${esc(t('about_app_name'))}</div>
        <div class="about-ver">v1.0</div>
        <div class="about-desc">${esc(t('app_desc'))}</div>
        <div class="link-list">
          <mdui-button variant="outlined" data-action="sub" data-sub="license">${esc(t('open_source_license'))}</mdui-button>
        </div>
      </div>
    </div>`;
  }

  function renderLicense() {
    const libs = [
      { name: 'lib_self', desc: 'lib_self_desc', author: 'lib_self_author', tag: 'GPL-3.0' },
      { name: 'lib_mdui', desc: 'lib_mdui_desc', author: 'lib_mdui_author', tag: 'MIT' },
      { name: 'lib_qr', desc: 'lib_qr_desc', author: 'lib_qr_author', tag: 'MIT' },
      { name: 'lib_icons', desc: 'lib_icons_desc', author: 'lib_icons_author', tag: 'Apache-2.0' }
    ];
    return `<div class="settings-wrap">
      ${libs.map(l => `<div class="lib-card">
        <span class="lib-main">
          <span class="lib-name">${esc(t(l.name))}</span>
          <span class="lib-desc" style="display:block">${esc(t(l.desc))}</span>
          <span class="lib-meta"><span>${esc(t('author_by', t(l.author)))}</span><span class="tag">${l.tag}</span></span>
        </span>
      </div>`).join('')}
      <div class="small-note center" style="padding:8px 12px">${esc(t('license_note'))}</div>
    </div>`;
  }

  const TUT_SECTIONS = [
    {
      id: 'basic', title: 'tutorial_section_basic', icon: 'photo', steps: [
        ['tut_add_image_title', 'tut_add_image_desc'],
        ['tut_add_video_title', 'tut_add_video_desc'],
        ['tut_manage_title', 'tut_manage_desc'],
        ['tut_select_title', 'tut_select_desc']
      ]
    },
    {
      id: 'display', title: 'tutorial_section_display', icon: 'phone', steps: [
        ['tut_start_title', 'tut_start_desc'],
        ['tut_gesture_exit_title', 'tut_gesture_exit_desc'],
        ['tut_gesture_rotate_title', 'tut_gesture_rotate_desc'],
        ['tut_gesture_qr_title', 'tut_gesture_qr_desc'],
        ['tut_qr_swipe_title', 'tut_qr_swipe_desc'],
        ['tut_battery_title', 'tut_battery_desc']
      ]
    },
    {
      id: 'settings', title: 'tutorial_section_settings', icon: 'settings', steps: [
        ['tut_reverse_title', 'tut_reverse_desc'],
        ['tut_screen_on_title', 'tut_screen_on_desc'],
        ['tut_anti_burnin_title', 'tut_anti_burnin_desc'],
        ['tut_qr_code_title', 'tut_qr_code_desc'],
        ['tut_theme_title', 'tut_theme_desc'],
        ['tut_language_title', 'tut_language_desc']
      ]
    },
  ];

  function renderTutorial() {
    const sections = TUT_SECTIONS.map(sec => {
      const open = !!State.tutOpen[sec.id];
      return `<div class="tut-section${open ? ' open' : ''}">
        <button class="tut-head" data-action="tut-toggle" data-id="${sec.id}">
          <span class="tutorial-badge">${icon(sec.icon)}</span>
          <span class="tut-title">${esc(t(sec.title))}</span>
          <span class="tut-count">${sec.steps.length}</span>
          <span class="tut-arrow">${icon('chevronDown')}</span>
        </button>
        <div class="tut-body">
          ${sec.steps.map((s, i) => `<div class="tut-step">
            <span class="tut-num">${i + 1}</span>
            <div><h4>${esc(t(s[0]))}</h4><p>${esc(t(s[1]))}</p></div>
          </div>`).join('')}
        </div>
      </div>`;
    }).join('');

    return `<div class="settings-wrap">
      <div class="tutorial-banner">
        <span class="tutorial-badge">${icon('school')}</span>
        <div>
          <h3>${esc(t('tutorial_welcome_title'))}</h3>
          <p>${esc(t('tutorial_welcome_desc'))}</p>
        </div>
      </div>
      ${sections}
    </div>`;
  }

  /* ============================================================
   * 弹窗 / 操作表 / 吐司
   * ============================================================ */
  let activeDialog = null;
  let menuCleanup = null;

  function closeDialog() {
    if (activeDialog) {
      try { activeDialog.open = false; } catch (_) {}
      activeDialog = null;
    }
    if (menuCleanup) {
      const fn = menuCleanup;
      menuCleanup = null;
      try { fn(); } catch (_) {}
    }
    $('#modalRoot').innerHTML = '';
  }

  function openDialog(opts) {
    closeDialog();
    const actions = (opts.actions || []).map(a => ({
      text: a.label,
      onClick: () => {
        if (a.onClick) {
          const keep = a.onClick();
          if (keep === false) return false;
        }
        return true;
      }
    }));
    const dlg = mdui.dialog({
      headline: opts.title || '',
      body: opts.body || '',
      actions: actions,
      closeOnEsc: true,
      closeOnOverlayClick: opts.dismissible !== false,
      onOpened: () => {
        const field = dlg.querySelector('input, textarea');
        if (field) setTimeout(() => { try { field.focus(); } catch (_) {} }, 80);
      },
      onClosed: () => {
        if (activeDialog === dlg) activeDialog = null;
      }
    });
    activeDialog = dlg;
    return dlg;
  }

  function showSheet(title, items) {
    const root = $('#modalRoot');
    root.innerHTML = `<div class="sheet-backdrop">
      <div class="sheet" role="dialog" aria-modal="true">
        ${title ? `<div class="sheet-title">${esc(title)}</div>` : ''}
        ${items.map((it, i) => `<button data-sheet="${i}" class="${it.danger ? 'danger' : ''}" ${it.disabled ? 'disabled' : ''}>${esc(it.label)}</button>`).join('')}
        <button data-sheet="cancel" class="sheet-cancel">${esc(t('cancel'))}</button>
      </div>
    </div>`;
    const backdrop = root.firstElementChild;
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeDialog(); });
    items.forEach((it, i) => {
      const btn = root.querySelector(`[data-sheet="${i}"]`);
      if (btn) btn.addEventListener('click', () => {
        if (it.disabled) return;
        closeDialog();
        if (it.onClick) setTimeout(it.onClick, 0);
      });
    });
    const cancel = root.querySelector('[data-sheet="cancel"]');
    if (cancel) cancel.addEventListener('click', closeDialog);
  }

  // 原版 DropdownMenu：菜单紧贴“三个点”展开，而不是底部操作表
  function showMenu(anchor, items) {
    if (!anchor) return;
    closeDialog();
    const root = $('#modalRoot');
    const layer = document.createElement('div');
    layer.className = 'menu-layer';
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.setAttribute('role', 'menu');
    items.forEach((it, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.menu = String(i);
      btn.textContent = it.label;
      btn.disabled = !!it.disabled;
      btn.setAttribute('role', 'menuitem');
      menu.appendChild(btn);
    });
    layer.appendChild(menu);
    root.appendChild(layer);

    const place = () => {
      const ar = anchor.getBoundingClientRect();
      const mw = menu.offsetWidth;
      const mh = menu.offsetHeight;
      let left = ar.right - mw;
      left = Math.max(8, Math.min(left, window.innerWidth - mw - 8));
      let top = ar.bottom + 4;
      if (top + mh > window.innerHeight - 8) top = Math.max(8, ar.top - mh - 4);
      menu.style.left = Math.round(left) + 'px';
      menu.style.top = Math.round(top) + 'px';
    };
    place();

    const onDown = e => { if (!menu.contains(e.target)) closeDialog(); };
    const onKey = e => { if (e.key === 'Escape') closeDialog(); };
    const onView = () => closeDialog();
    layer.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onView);
    menuCleanup = () => {
      layer.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onView);
    };

    menu.addEventListener('click', e => {
      const btn = e.target.closest('button[data-menu]');
      if (!btn || btn.disabled) return;
      const it = items[Number(btn.dataset.menu)];
      closeDialog();
      if (it && it.onClick) setTimeout(it.onClick, 0);
    });
  }

  let activeSnackbar = null;
  function toast(msg) {
    try {
      if (activeSnackbar) {
        try { activeSnackbar.open = false; } catch (_) {}
      }
      activeSnackbar = mdui.snackbar({ message: msg, autoCloseDelay: 2600 });
    } catch (_) {}
  }

  function showBusy(text) {
    hideBusy();
    const d = document.createElement('div');
    d.className = 'busy';
    d.innerHTML = `<mdui-circular-progress></mdui-circular-progress><div>${esc(text || t('processing'))}</div>`;
    document.body.appendChild(d);
  }

  function hideBusy() {
    $$('.busy').forEach(el => el.remove());
  }

  /* ============================================================
   * 兽牌操作
   * ============================================================ */
  function openAddDialog() {
    const dlg = openDialog({
      title: t('pick_display_mode'),
      body: `<div class="pick-row">
        <button class="pick-card image-pick" data-action="pick-image">${icon('image')}<span class="pick-label">${esc(t('image'))}</span></button>
        <button class="pick-card video-pick" data-action="pick-video">${icon('video')}<span class="pick-label">${esc(t('video'))}</span></button>
      </div>`,
      actions: [{ label: t('cancel'), className: 'outlined block' }]
    });
    const cancel = dlg.querySelector('mdui-button[slot="action"]');
    if (cancel) {
      cancel.setAttribute('variant', 'filled');
      cancel.classList.add('dialog-action-full');
    }
  }

  function nextBadgeName() {
    return t('badge_default_name', badges.length + 1);
  }

  function nextOrder(list) {
    return list.reduce((m, x) => Math.max(m, typeof x.order === 'number' ? x.order : 0), -1) + 1;
  }

  async function addBadgeRecord(rec) {
    if (rec.order == null) rec.order = nextOrder(badges);
    try {
      const ok = await dbPut('badges', rec);
      if (!ok && dbBroken) toast(t('storage_error'));
    } catch (e) {
      if (e && (e.name === 'QuotaExceededError' || e.code === 22)) toast(t('storage_quota'));
      else toast(t('storage_error'));
    }
    badges.push(rec);
    sortByOrder(badges);
    selectBadge(rec.id);
    renderChrome();
    renderPage({ keepScroll: true });
    toast(t(rec.type === 'video' ? 'video_added' : 'image_added'));
  }

  function promptRenameBadge(id) {
    const b = badges.find(x => x.id === id);
    if (!b) return;
    openDialog({
      title: t('rename'),
      body: `<label class="field-label" for="renameInput">${esc(t('name_label'))}</label>
        <input id="renameInput" class="field" maxlength="40" value="${esc(b.name)}">`,
      actions: [
        { label: t('cancel'), className: 'outlined' },
        {
          label: t('confirm'), onClick: () => {
            const input = $('#renameInput');
            const v = input ? input.value.trim() : '';
            if (!v) return false;
            b.name = v;
            dbPut('badges', b);
            renderPage({ keepScroll: true });
            return true;
          }
        }
      ]
    });
  }

  function confirmDeleteBadge(id) {
    const b = badges.find(x => x.id === id);
    if (!b) return;
    openDialog({
      title: t('confirm_delete'),
      body: `<p>${esc(t('confirm_delete_msg', b.name))}</p>`,
      actions: [
        { label: t('cancel'), className: 'outlined' },
        {
          label: t('delete'), className: 'danger', onClick: () => {
            dbDelete('badges', id);
            revokeBadgeUrls(id);
            badges = badges.filter(x => x.id !== id);
            if (State.selectedBadgeId === id) {
              selectBadge(badges.length ? badges[0].id : 'default');
            }
            renderChrome();
            renderPage({ keepScroll: true });
            return true;
          }
        }
      ]
    });
  }

  function moveBadge(id, dir) {
    const list = badges;
    const i = list.findIndex(x => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    const a = list[i];
    const b = list[j];
    const ao = a.order;
    a.order = b.order;
    b.order = ao;
    dbPut('badges', a);
    dbPut('badges', b);
    sortByOrder(list);
    renderPage({ keepScroll: true });
  }

  function openBadgeMenu(id, anchor) {
    const i = badgeIndex(id);
    if (i < 0) return;
    showMenu(anchor, [
      { label: t('rename'), onClick: () => promptRenameBadge(id) },
      { label: t('move_up'), disabled: i === 0, onClick: () => moveBadge(id, -1) },
      { label: t('move_down'), disabled: i === badges.length - 1, onClick: () => moveBadge(id, 1) },
      { label: t('delete'), onClick: () => confirmDeleteBadge(id) }
    ]);
  }

  /* ============================================================
   * 视频封面 & 图片裁剪
   * ============================================================ */
  function captureVideoCover(file) {
    return new Promise(resolve => {
      let url;
      try { url = URL.createObjectURL(file); } catch (_) { resolve(null); return; }
      const v = document.createElement('video');
      let finished = false;
      let grabbed = false;
      const finish = blob => {
        if (finished) return;
        finished = true;
        try { v.removeAttribute('src'); v.load(); } catch (_) {}
        try { URL.revokeObjectURL(url); } catch (_) {}
        resolve(blob || null);
      };
      const grab = () => {
        if (grabbed) return;
        grabbed = true;
        try {
          const vw = v.videoWidth || 720;
          const vh = v.videoHeight || 1280;
          const max = 720;
          const s = Math.min(1, max / Math.max(vw, vh));
          const c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(vw * s));
          c.height = Math.max(1, Math.round(vh * s));
          c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
          c.toBlob(b => finish(b), 'image/jpeg', 0.85);
        } catch (_) {
          finish(null);
        }
      };
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.preload = 'auto';
      v.addEventListener('loadeddata', () => {
        try {
          const target = Math.min(0.1, (v.duration || 0.2) / 2);
          v.currentTime = target;
        } catch (_) { grab(); }
        setTimeout(grab, 900);
      }, { once: true });
      v.addEventListener('seeked', grab, { once: true });
      v.addEventListener('error', () => finish(null), { once: true });
      setTimeout(() => finish(null), 8000);
      v.src = url;
    });
  }

  async function addVideoFromFile(file) {
    if (!file) return;
    if (!file.type || file.type.indexOf('video/') !== 0) { toast(t('video_load_failed')); return; }
    showBusy(t('processing'));
    try {
      const cover = await captureVideoCover(file);
      if (!cover) toast(t('video_cover_failed'));
      await new Promise(r => setTimeout(r, 60));
      await addBadgeRecord({
        id: genId('b'),
        name: nextBadgeName(),
        type: 'video',
        blob: file,
        cover: cover || null,
        order: nextOrder(badges),
        createdAt: Date.now()
      });
    } catch (_) {
      toast(t('video_load_failed'));
    } finally {
      hideBusy();
    }
  }

  let cropPickPending = false;
  /* 系统相册打开中；相册会顺带让浏览器退出全屏 */
  let cropPickerActive = false;
  let cropPreFsTimer = 0;
  let cropPickerTimer = 0;

  function openImagePicker() {
    cropPickerActive = true;
    /* 兜底：个别 WebView 不派发 cancel，避免状态永远停在「相册打开中」 */
    clearTimeout(cropPickerTimer);
    cropPickerTimer = setTimeout(() => {
      cropPickerTimer = 0;
      cropPickerActive = false;
      cropPickPending = false;
    }, 600000);
    $('#fileImage').click();
  }

  /* 进入全屏前先藏起裁剪框，避免「先按窗口比例摆一次、全屏后再变一次」的跳闪 */
  function setCropPreFs(on) {
    const overlay = $('#crop');
    if (!overlay) return;
    clearTimeout(cropPreFsTimer);
    cropPreFsTimer = 0;
    if (on) {
      overlay.classList.add('pre-fs');
      cropPreFsTimer = setTimeout(() => { if (!$('#crop').hidden) setCropPreFs(false); }, 420);
    } else {
      overlay.classList.remove('pre-fs');
    }
  }

  /* 相册返回后补回全屏（相册会打断浏览器全屏） */
  function resumeCropFullscreen() {
    if ($('#crop').hidden) return;
    if (cropState) resizeCrop();
    else layoutCropFrame();
    enterCropFullscreen();
  }

  /* 用户点「图片」时立刻进入裁剪页并全屏，等系统相册返回后直接画图，避免选完图才跳全屏 */
  function primeCropView() {
    cropPickPending = true;
    const overlay = $('#crop');
    if (!overlay.hidden) {
      /* 重新选择：保持裁剪页与画面，只把相册拉起来 */
      resumeCropFullscreen();
      return;
    }
    const hint = $('#cropHint');
    if (hint) hint.classList.add('hide');
    overlay.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    setCropPreFs(true);
    layoutCropFrame();
    enterCropFullscreen();
  }

  /* 相册取消：首次进入时没图就直接关掉；重新选择时保留原图 */
  function settleCropPicker(hasFile) {
    const pending = cropPickPending;
    cropPickPending = false;
    cropPickerActive = false;
    clearTimeout(cropPickerTimer);
    cropPickerTimer = 0;
    if (hasFile) return;
    /* 已经选到图的会话忽略迟到的 cancel/空 change */
    if (!pending) return;
    if ($('#crop').hidden) return;
    if (!cropState) { closeCrop(); return; }
    /* 重新选择取消：保留原图，相册打断的全屏补回来 */
    resumeCropFullscreen();
  }

  function openCrop(file) {
    if (!file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) { toast(t('image_load_failed')); settleCropPicker(false); return; }
    if ($('#crop').hidden) primeCropView();
    cropPickPending = false;
    cropPickerActive = false;
    clearTimeout(cropPickerTimer);
    cropPickerTimer = 0;
    const url = URL.createObjectURL(file);
    const img = new Image();
    const prev = cropState;
    img.onload = () => {
      if (prev && prev.url) { try { URL.revokeObjectURL(prev.url); } catch (_) {} }
      $('#cropHint').textContent = t('crop_hint');
      $('#cropHint').classList.remove('hide');
      cropState = {
        file, img, url,
        w: 0, h: 0, dpr: 1,
        fit: 1, scale: 1, ox: 0, oy: 0,
        frame: { x: 0, y: 0, w: 0, h: 0 },
        ptrs: new Map(), pinch: null
      };
      requestAnimationFrame(() => {
        resizeCrop();
        /* 相册打断过全屏的话，这里趁有用户激活补回来 */
        if (!document.fullscreenElement) enterCropFullscreen();
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      if (prev) { toast(t('image_load_failed')); return; }
      closeCrop();
      toast(t('image_load_failed'));
    };
    img.src = url;
  }

  /* 裁剪页全屏：浏览器 Fullscreen API + Toy 容器沉浸并行，退出裁剪时一并释放 */
  let cropToyOff = null;
  let cropToyAttempted = false;
  let cropToyImmersive = false;

  function requestCropToyImmersive(toy) {
    if ($('#crop').hidden || !toy || typeof toy.setContainerMode !== 'function') return;
    if (!cropToyOff) {
      try {
        cropToyOff = toy.onContainerChange(state => {
          if (!state) return;
          if (state.immersive) {
            applyToySafeArea(state.safeArea);
            cropToyImmersive = true;
          } else {
            clearToySafeArea();
            cropToyImmersive = false;
            /* 沉浸被相册或宿主收回只是状态变化，不再当成返回去关裁剪页 */
          }
          /* 先按新视口摆好再揭掉遮挡，避免露出旧尺寸 */
          requestAnimationFrame(() => {
            if (cropState) resizeCrop();
            else layoutCropFrame();
            if (cropToyImmersive) setCropPreFs(false);
          });
        });
      } catch (_) {}
    }
    cropToyAttempted = true;
    try {
      const p = toy.setContainerMode({ immersive: true });
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }

  function enterCropToyImmersive() {
    if (!inToyPage()) return;
    if (window.toy && typeof window.toy.setContainerMode === 'function') {
      requestCropToyImmersive(window.toy);
    } else {
      loadToySdk().then(toy => requestCropToyImmersive(toy)).catch(() => {});
    }
  }

  function exitCropToyImmersive() {
    if (cropToyOff) {
      try { cropToyOff(); } catch (_) {}
      cropToyOff = null;
    }
    clearToySafeArea();
    const attempted = cropToyAttempted;
    cropToyAttempted = false;
    cropToyImmersive = false;
    if (!attempted) return;
    const toy = window.toy;
    if (!toy || typeof toy.setContainerMode !== 'function') return;
    try {
      const p = toy.setContainerMode({ immersive: false });
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }

  let cropFsRetryArmed = false;
  function cropFsRetry() {
    cropFsRetryArmed = false;
    enterCropFullscreen();
  }

  /* 部分 WebView 在选图回调里不认全屏请求，首次触摸裁剪区时再补一次 */
  function armCropFsRetry() {
    if (cropFsRetryArmed) return;
    /* 只挂在画布区：点「取消/确认」不该顺手触发一次全屏 */
    const el = $('#cropStage');
    if (!el) return;
    cropFsRetryArmed = true;
    el.addEventListener('pointerdown', cropFsRetry, { once: true });
  }

  function enterCropFullscreen() {
    const el = $('#crop');
    if (!el || el.hidden) return;
    if (!document.fullscreenElement) {
      const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (fn) {
        try {
          const p = fn.call(el);
          if (p && p.catch) p.catch(() => {});
        } catch (_) {}
      }
      armCropFsRetry();
    }
    enterCropToyImmersive();
  }

  function exitCropFullscreen() {
    releaseNativeFullscreen();
    exitCropToyImmersive();
  }

  /* 只按屏幕比例摆放裁剪框；有无图片都先摆好，避免选完图才变尺寸造成跳闪 */
  function layoutCropFrame() {
    const stage = $('#cropStage');
    if (!stage) return null;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return null;
    const vw = window.innerWidth || w;
    const vh = window.innerHeight || h;
    const aspect = Math.max(0.2, Math.min(5, vw / vh));
    const availW = Math.max(1, w - 24);
    const availH = Math.max(1, h - 24);
    let fw = Math.min(availW, availH * aspect);
    let fh = fw / aspect;
    if (fh > availH) { fh = availH; fw = fh * aspect; }
    const fx = (w - fw) / 2;
    const fy = (h - fh) / 2;
    const frameEl = $('.crop-frame');
    if (frameEl) {
      frameEl.style.left = fx + 'px';
      frameEl.style.top = fy + 'px';
      frameEl.style.width = fw + 'px';
      frameEl.style.height = fh + 'px';
    }
    const hintEl = $('#cropHint');
    if (hintEl) hintEl.style.top = Math.max(fy + 10, fy + fh - 46) + 'px';
    return { x: fx, y: fy, w: fw, h: fh };
  }

  function resizeCrop() {
    if (!cropState) return;
    const stage = $('#cropStage');
    const cv = $('#cropCanvas');
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cropState.w = w;
    cropState.h = h;
    cropState.dpr = dpr;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';

    const frame = layoutCropFrame();
    if (!frame) return;
    cropState.frame = frame;
    cropState.fit = Math.min(frame.w / cropState.img.naturalWidth, frame.h / cropState.img.naturalHeight);
    drawCrop();
  }

  function drawCrop() {
    if (!cropState) return;
    const cv = $('#cropCanvas');
    const ctx = cv.getContext('2d');
    const { img, w, h, dpr, fit, scale, ox, oy, frame } = cropState;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const s = fit * scale;
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    const dx = frame.x + frame.w / 2 - dw / 2 + ox;
    const dy = frame.y + frame.h / 2 - dh / 2 + oy;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function closeCrop() {
    const overlay = $('#crop');
    overlay.hidden = true;
    setCropPreFs(false);
    cropPickPending = false;
    cropPickerActive = false;
    clearTimeout(cropPickerTimer);
    cropPickerTimer = 0;
    document.documentElement.style.overflow = '';
    if (cropState) {
      try { URL.revokeObjectURL(cropState.url); } catch (_) {}
      cropState = null;
    }
    const cv = $('#cropCanvas');
    const ctx = cv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    exitCropFullscreen();
  }

  async function confirmCrop() {
    if (!cropState) return;
    const { img, fit, scale, ox, oy, frame } = cropState;
    const s = fit * scale;
    const dx = frame.x + frame.w / 2 - img.naturalWidth * s / 2 + ox;
    const dy = frame.y + frame.h / 2 - img.naturalHeight * s / 2 + oy;
    const overlapW = Math.min(frame.x + frame.w, dx + img.naturalWidth * s) - Math.max(frame.x, dx);
    const overlapH = Math.min(frame.y + frame.h, dy + img.naturalHeight * s) - Math.max(frame.y, dy);
    if (overlapW < 2 || overlapH < 2) {
      toast(t('crop_empty'));
      return;
    }
    showBusy(t('processing'));
    try {
      const maxDim = Math.max(frame.w / s, frame.h / s);
      const outScale = Math.min(1, 2048 / maxDim);
      const cw = Math.max(1, Math.round(frame.w / s * outScale));
      const ch = Math.max(1, Math.round(frame.h / s * outScale));
      const c = document.createElement('canvas');
      c.width = cw;
      c.height = ch;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        img,
        (dx - frame.x) * outScale / s,
        (dy - frame.y) * outScale / s,
        img.naturalWidth * outScale,
        img.naturalHeight * outScale
      );
      const mime = cropState.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise(resolve => c.toBlob(resolve, mime, 0.92));
      const file = cropState.file;
      if (!blob) { hideBusy(); toast(t('processing')); return; }
      closeCrop();
      await addBadgeRecord({
        id: genId('b'),
        name: nextBadgeName(),
        type: 'image',
        blob,
        cover: null,
        order: nextOrder(badges),
        createdAt: Date.now()
      });
    } catch (_) {
      toast(t('image_load_failed'));
    } finally {
      hideBusy();
    }
  }

  function bindCrop() {
    const cv = $('#cropCanvas');
    const stage = $('#cropStage');

    stage.addEventListener('pointerdown', e => {
      if (!cropState) return;
      const hintEl = $('#cropHint');
      if (hintEl) hintEl.classList.add('hide');
      try { cv.setPointerCapture(e.pointerId); } catch (_) {}
      cropState.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (cropState.ptrs.size === 2) {
        const [a, b] = Array.from(cropState.ptrs.values());
        cropState.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: cropState.scale };
      }
    });

    stage.addEventListener('pointermove', e => {
      if (!cropState || !cropState.ptrs.has(e.pointerId)) return;
      const prev = cropState.ptrs.get(e.pointerId);
      cropState.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (cropState.ptrs.size === 1) {
        cropState.ox += e.clientX - prev.x;
        cropState.oy += e.clientY - prev.y;
        drawCrop();
      } else if (cropState.ptrs.size === 2 && cropState.pinch) {
        const [a, b] = Array.from(cropState.ptrs.values());
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        cropState.scale = clamp(cropState.pinch.s * d / cropState.pinch.d, 1, 5);
        drawCrop();
      }
    });

    function up(e) {
      if (!cropState) return;
      cropState.ptrs.delete(e.pointerId);
      if (cropState.ptrs.size < 2) cropState.pinch = null;
    }
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);

    stage.addEventListener('wheel', e => {
      if (!cropState) return;
      e.preventDefault();
      cropState.scale = clamp(cropState.scale * Math.exp(-e.deltaY * 0.0015), 1, 5);
      drawCrop();
    }, { passive: false });

    const onViewportChange = () => {
      if ($('#crop').hidden) return;
      if (cropState) resizeCrop();
      else layoutCropFrame();
    };
    const onFsChange = () => {
      if ($('#crop').hidden) return;
      if (!document.fullscreenElement) {
        /* 退出全屏（相册拉起、系统收回、用户按返回）不再等同于返回，只按新视口重排 */
        if (cropState) resizeCrop();
        else layoutCropFrame();
        return;
      }
      /* 真正进了全屏，裁剪框可以露面了 */
      setCropPreFs(false);
      if (cropState) resizeCrop();
      else layoutCropFrame();
    };
    /* 个别 WebView 从相册回来不派发 cancel/change：回到前台后自己把状态解开 */
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || $('#crop').hidden) return;
      if (!cropPickPending && !cropPickerActive) return;
      setTimeout(() => {
        if (document.visibilityState !== 'visible' || $('#crop').hidden) return;
        if (!cropPickPending && !cropPickerActive) return;
        cropPickPending = false;
        cropPickerActive = false;
        clearTimeout(cropPickerTimer);
        cropPickerTimer = 0;
        /* 回来仍没有图：当作用户取消了相册 */
        if (!cropState) { closeCrop(); return; }
        resumeCropFullscreen();
      }, 3000);
    };
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('visibilitychange', onVisible);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange);
      window.visualViewport.addEventListener('scroll', onViewportChange);
    }
  }

  /* ============================================================
   * 二维码操作
   * ============================================================ */
  function openQrLinkDialog() {
    openDialog({
      title: t('qr_generate_from_link'),
      body: `<label class="field-label" for="qrLinkInput">${esc(t('qr_input_link'))}</label>
        <input id="qrLinkInput" class="field" inputmode="url" placeholder="https://" autocomplete="off">`,
      actions: [
        { label: t('cancel'), className: 'outlined' },
        {
          label: t('confirm'), onClick: () => {
            const el = $('#qrLinkInput');
            const link = el ? el.value.trim() : '';
            if (!link) return false;
            setTimeout(() => generateQrAndAdd(link), 0);
            return true;
          }
        }
      ]
    });
  }

  async function generateQrAndAdd(link) {
    showBusy(t('processing'));
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        try {
          const qr = window.qrcode(0, 'M');
          qr.addData(link);
          qr.make();
          resolve(qr.createDataURL(10, 4));
        } catch (e) { reject(e); }
      });
      const blob = await (await fetch(dataUrl)).blob();
      await addQrBlob(blob, t('qr_default_name', qrs.length + 1), link);
    } catch (_) {
      toast(t('qr_generate_failed'));
    } finally {
      hideBusy();
    }
  }

  async function addQrBlob(blob, name, link) {
    const rec = {
      id: genId('q'),
      name: name || t('qr_default_name', qrs.length + 1),
      order: nextOrder(qrs),
      blob,
      link: link || ''
    };
    const ok = await dbPut('qrcodes', rec);
    if (!ok && dbBroken) toast(t('storage_error'));
    qrs.push(rec);
    sortByOrder(qrs);
    State.selectedQrId = rec.id;
    ls.set('ssp_selected_qr', rec.id);
    renderChrome();
    renderPage({ keepScroll: true });
    toast(t('qr_generated'));
  }

  function openQrMenu(id) {
    const i = qrs.findIndex(x => x.id === id);
    if (i < 0) return;
    showSheet(null, [
      { label: t('rename'), onClick: () => promptRenameQr(id) },
      { label: t('move_up'), disabled: i === 0, onClick: () => moveQr(id, -1) },
      { label: t('move_down'), disabled: i === qrs.length - 1, onClick: () => moveQr(id, 1) },
      { label: t('delete'), danger: true, onClick: () => confirmDeleteQr(id) }
    ]);
  }

  function promptRenameQr(id) {
    const q = qrs.find(x => x.id === id);
    if (!q) return;
    openDialog({
      title: t('rename'),
      body: `<label class="field-label" for="renameQrInput">${esc(t('name_label'))}</label>
        <input id="renameQrInput" class="field" maxlength="40" value="${esc(q.name)}">`,
      actions: [
        { label: t('cancel'), className: 'outlined' },
        {
          label: t('confirm'), onClick: () => {
            const el = $('#renameQrInput');
            const v = el ? el.value.trim() : '';
            if (!v) return false;
            q.name = v;
            dbPut('qrcodes', q);
            renderPage({ keepScroll: true });
            return true;
          }
        }
      ]
    });
  }

  function confirmDeleteQr(id) {
    const q = qrs.find(x => x.id === id);
    if (!q) return;
    openDialog({
      title: t('confirm_delete'),
      body: `<p>${esc(t('confirm_delete_msg', q.name))}</p>`,
      actions: [
        { label: t('cancel'), className: 'outlined' },
        {
          label: t('delete'), className: 'danger', onClick: () => {
            dbDelete('qrcodes', id);
            revokeQrUrl(id);
            qrs = qrs.filter(x => x.id !== id);
            if (State.selectedQrId === id) {
              State.selectedQrId = qrs.length ? qrs[0].id : '';
              ls.set('ssp_selected_qr', State.selectedQrId);
            }
            renderPage({ keepScroll: true });
            return true;
          }
        }
      ]
    });
  }

  function moveQr(id, dir) {
    const i = qrs.findIndex(x => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= qrs.length) return;
    const a = qrs[i], b = qrs[j];
    const ao = a.order;
    a.order = b.order;
    b.order = ao;
    dbPut('qrcodes', a);
    dbPut('qrcodes', b);
    sortByOrder(qrs);
    renderPage({ keepScroll: true });
  }

  function selectQr(id) {
    if (!settings.showQrCode) return;
    State.selectedQrId = id;
    ls.set('ssp_selected_qr', id);
    renderPage({ keepScroll: true });
  }

  function importQrFile(file) {
    if (!file) return;
    addQrBlob(file, t('qr_default_name', qrs.length + 1), '');
  }

  /* ============================================================
   * 全屏展示
   * ============================================================ */
  const fsEl = () => $('#fullscreen');

  function showFsHint() {
    const hint = $('#fsHint');
    hint.textContent = t('pinch_to_exit');
    hint.classList.add('show');
    clearTimeout(fsState.hintTimer);
    fsState.hintTimer = setTimeout(() => hint.classList.remove('show'), 2000);
  }

  function showFlipHint() {
    const hint = $('#fsFlipHint');
    if (!hint) return;
    hint.textContent = t('badge_flipped');
    hint.classList.add('show');
    clearTimeout(fsState.flipHintTimer);
    fsState.flipHintTimer = setTimeout(() => hint.classList.remove('show'), 1600);
  }

  function updateFsRotation() {
    const fs = fsEl();
    fs.style.setProperty('--fs-rot', fsState.rotation + 'deg');
    const rotated = fsState.rotation === 180;
    $('#fsBattery').classList.toggle('rot', rotated);
    $('#fsHint').classList.toggle('rot', rotated);
    const flipHint = $('#fsFlipHint');
    if (flipHint) flipHint.classList.toggle('rot', rotated);
  }

  function openQrOverlay() {
    if (!settings.showQrCode) return;
    if (!qrs.length) {
      toast(t('qr_empty_hint'));
      return;
    }
    fsState.qrOpen = true;
    const list = qrs;
    let idx = 0;
    const found = list.findIndex(q => q.id === State.selectedQrId);
    idx = found >= 0 ? found : 0;
    State.selectedQrId = list[idx].id;
    ls.set('ssp_selected_qr', State.selectedQrId);
    $('#fsQrImg').src = qrUrl(list[idx]);
    $('#fsQrStage').classList.remove('slide-next', 'slide-prev');
    $('#fsQr').classList.add('show');
  }

  function closeQrOverlay() {
    fsState.qrOpen = false;
    $('#fsQr').classList.remove('show');
  }

  function switchQr(dir) {
    if (!qrs.length || qrs.length < 2 || !settings.qrSwipeSwitch) return;
    let cur = qrs.findIndex(q => q.id === State.selectedQrId);
    if (cur < 0) cur = 0;
    const next = (cur + dir + qrs.length) % qrs.length;
    const q = qrs[next];
    State.selectedQrId = q.id;
    ls.set('ssp_selected_qr', q.id);
    const img = $('#fsQrImg');
    img.src = qrUrl(q);
    const stage = $('#fsQrStage');
    stage.classList.remove('slide-next', 'slide-prev');
    void stage.offsetWidth;
    stage.classList.add(dir > 0 ? 'slide-next' : 'slide-prev');
  }

  function setupBattery() {
    const el = $('#fsBattery');
    el.hidden = true;
    if (!settings.showBattery) return;
    if (!navigator.getBattery) return;
    navigator.getBattery().then(b => {
      if (!fsState.open) return;
      fsState.battery = b;
      const update = () => {
        fsState.batteryLevel = Math.round(b.level * 100);
        el.textContent = t('battery_level', fsState.batteryLevel);
        el.hidden = !settings.showBattery;
      };
      update();
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingchange', update);
      fsState.batteryCleanup = () => {
        b.removeEventListener('levelchange', update);
        b.removeEventListener('chargingchange', update);
      };
    }).catch(() => {});
  }

  function startBurnIn() {
    const media = $('#fsMedia');
    media.style.transform = 'translateY(0px)';
    if (!settings.antiBurnIn) {
      media.style.transition = 'none';
      return;
    }
    media.style.transition = 'transform 3s linear';
    let step = 0;
    fsState.burnTimer = setInterval(() => {
      const h = window.innerHeight;
      step = (step + 1) % 3;
      const y = step === 1 ? -h * 0.03 : step === 2 ? h * 0.03 : 0;
      media.style.transform = `translateY(${y}px)`;
    }, 5 * 60 * 1000);
  }

  function requestNativeFullscreen() {
    const targets = [fsEl(), document.documentElement];
    const attempt = i => {
      if (i >= targets.length) return;
      const el = targets[i];
      const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (!fn) { attempt(i + 1); return; }
      let p;
      try {
        p = fn.call(el);
      } catch (_) {
        attempt(i + 1);
        return;
      }
      if (p && p.catch) p.catch(() => attempt(i + 1));
    };
    attempt(0);
  }

  function releaseNativeFullscreen() {
    const active = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (!active) return;
    const fn = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!fn) return;
    try {
      const p = fn.call(document);
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }

  /* Toy 官方 SDK：预览页与正式页都可请求容器沉浸，失败再退回 Fullscreen API */
  let toySdkPromise = null;
  function inToyPage() {
    return /^\/toy\//.test(location.pathname);
  }
  function loadToySdk() {
    if (window.toy && typeof window.toy.setContainerMode === 'function') return Promise.resolve(window.toy);
    if (toySdkPromise) return toySdkPromise;
    toySdkPromise = new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve(window.toy || null);
      };
      const existing = document.querySelector('script[src*="toy-sdk.js"]');
      if (existing) {
        if (window.toy) { finish(); return; }
        existing.addEventListener('load', finish, { once: true });
        existing.addEventListener('error', finish, { once: true });
        setTimeout(finish, 4000);
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://s1.hdslb.com/bfs/seed/toy/app/sdk/toy-sdk.js';
      s.async = true;
      s.addEventListener('load', finish, { once: true });
      s.addEventListener('error', finish, { once: true });
      setTimeout(finish, 4000);
      document.head.appendChild(s);
    });
    return toySdkPromise;
  }
  function applyToySafeArea(sa) {
    if (!sa) return;
    const root = document.documentElement.style;
    root.setProperty('--toy-safe-top', Math.max(0, Number(sa.top) || 0) + 'px');
    root.setProperty('--toy-safe-right', Math.max(0, Number(sa.right) || 0) + 'px');
    root.setProperty('--toy-safe-bottom', Math.max(0, Number(sa.bottom) || 0) + 'px');
    root.setProperty('--toy-safe-left', Math.max(0, Number(sa.left) || 0) + 'px');
  }
  function clearToySafeArea() {
    const root = document.documentElement.style;
    ['top', 'right', 'bottom', 'left'].forEach(k => root.removeProperty('--toy-safe-' + k));
  }
  function requestToyImmersive(toy) {
    return new Promise(resolve => {
      if (!fsState.open || !toy || typeof toy.setContainerMode !== 'function') {
        resolve(false);
        return;
      }
      let settled = false;
      let timer = null;
      const finish = ok => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        resolve(ok);
      };
      try {
        fsState.toyOff = toy.onContainerChange(state => {
          if (!state) return;
          if (state.immersive) {
            applyToySafeArea(state.safeArea);
            fsState.toyImmersive = true;
            finish(true);
          } else {
            clearToySafeArea();
            /* 系统手势/宿主退出了沉浸，展示层也要跟着退出 */
            if (fsState.toyImmersive) {
              fsState.toyImmersive = false;
              if (fsState.open) exitFullscreen();
            }
          }
        });
      } catch (_) {}
      /* 直接尝试：isSupport 在部分旧客户端会漏报容器能力，不能当硬闸门 */
      fsState.toyAttempted = true;
      try {
        const p = toy.setContainerMode({ immersive: true });
        if (p && typeof p.then === 'function') {
          p.then(() => {
            /* Promise 只代表调用返回；真正生效以 onContainerChange 为准 */
          }).catch(() => finish(false));
        }
      } catch (_) {
        finish(false);
      }
      timer = setTimeout(() => {
        if (!fsState.toyImmersive) finish(false);
      }, 1500);
    });
  }
  function enterToyImmersive() {
    if (!inToyPage()) return Promise.resolve(false);
    if (window.toy && typeof window.toy.setContainerMode === 'function') {
      return requestToyImmersive(window.toy);
    }
    return loadToySdk().then(toy => requestToyImmersive(toy)).catch(() => false);
  }
  function exitToyImmersive() {
    if (fsState.toyOff) {
      try { fsState.toyOff(); } catch (_) {}
      fsState.toyOff = null;
    }
    clearToySafeArea();
    const attempted = fsState.toyAttempted;
    fsState.toyAttempted = false;
    fsState.toyImmersive = false;
    if (!attempted) return;
    const toy = window.toy;
    if (!toy || typeof toy.setContainerMode !== 'function') return;
    try {
      const p = toy.setContainerMode({ immersive: false });
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }

  function startFullscreen() {
    if (fsState.open) return;
    closeDialog();
    const b = selectedBadge();
    fsState.open = true;
    fsState.rotation = settings.defaultOrientation ? 180 : 0;
    fsState.qrOpen = false;
    const fs = fsEl();
    fs.hidden = false;
    fs.style.opacity = '1';
    /* 两条路并行：WebView 里 Fullscreen API 可能不可用，App 内靠容器沉浸兜底 */
    requestNativeFullscreen();
    enterToyImmersive();
    const rotator = $('#fsRotator');
    rotator.innerHTML = '';

    if (b.type === 'video' && b.blob) {
      const v = document.createElement('video');
      v.src = badgeUrl(b, true);
      v.loop = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.muted = !!settings.muteVideo;
      v.addEventListener('error', () => {
        const img = document.createElement('img');
        img.src = './assets/img/shili.png';
        rotator.innerHTML = '';
        rotator.appendChild(img);
      });
      rotator.appendChild(v);
      const p = v.play();
      if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
    } else {
      const img = document.createElement('img');
      img.src = badgeUrl(b, false);
      img.alt = b.name || '';
      img.addEventListener('error', () => { img.src = './assets/img/shili.png'; });
      rotator.appendChild(img);
    }

    updateFsRotation();
    $('#fsQr').classList.remove('show');
    showFsHint();
    setupBattery();
    startBurnIn();
    document.documentElement.style.overflow = 'hidden';
    renderChrome();
  }

  function exitFullscreen() {
    if (!fsState.open) return;
    fsState.open = false;
    releaseNativeFullscreen();
    exitToyImmersive();
    closeQrOverlay();
    clearTimeout(fsState.hintTimer);
    clearTimeout(fsState.flipHintTimer);
    clearInterval(fsState.burnTimer);
    fsState.burnTimer = null;
    if (fsState.batteryCleanup) { fsState.batteryCleanup(); fsState.batteryCleanup = null; }
    fsState.battery = null;
    const rotator = $('#fsRotator');
    const video = rotator.querySelector('video');
    if (video) {
      try { video.pause(); } catch (_) {}
      try { video.removeAttribute('src'); video.load(); } catch (_) {}
    }
    rotator.innerHTML = '';
    $('#fsBattery').hidden = true;
    $('#fsHint').classList.remove('show');
    const flipHint = $('#fsFlipHint');
    if (flipHint) flipHint.classList.remove('show');
    const fs = fsEl();
    fs.hidden = true;
    fs.style.opacity = '';
    $('#fsMedia').style.transform = 'translateY(0px)';
    document.documentElement.style.overflow = '';
    renderChrome();
  }

  function bindFullscreenGestures() {
    const g = $('#fsGesture');
    let pts = new Map();
    let start = null;
    let pinchStart = 0;
    let pinchDone = false;
    let lpTimer = 0;

    function dist() {
      const arr = Array.from(pts.values());
      if (arr.length < 2) return 0;
      return Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y) || 1;
    }

    function clearLongPress() {
      clearTimeout(lpTimer);
      lpTimer = 0;
    }

    function armLongPress() {
      clearLongPress();
      lpTimer = setTimeout(() => {
        lpTimer = 0;
        if (!fsState.open || !start || start.moved || start.longPressed || pts.size !== 1) return;
        start.longPressed = true;
        fsState.rotation = fsState.rotation === 180 ? 0 : 180;
        updateFsRotation();
        showFlipHint();
        try { if (navigator.vibrate) navigator.vibrate(20); } catch (_) {}
      }, 500);
    }

    g.addEventListener('pointerdown', e => {
      if (!fsState.open) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try { g.setPointerCapture(e.pointerId); } catch (_) {}
      if (pts.size === 1) {
        start = { x: e.clientX, y: e.clientY, time: Date.now(), moved: false, longPressed: false, multi: false };
        pinchDone = false;
        pinchStart = 0;
        armLongPress();
      } else if (pts.size === 2) {
        clearLongPress();
        if (start) { start.moved = true; start.multi = true; }
        pinchStart = dist();
      }
    });

    g.addEventListener('pointermove', e => {
      if (!fsState.open || !pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size >= 2) {
        if (start) start.moved = true;
        clearLongPress();
        if (pinchStart > 0 && !pinchDone) {
          const ratio = dist() / pinchStart;
          const threshold = selectedBadge().type === 'video' ? 0.7 : 0.5;
          if (ratio < threshold) {
            pinchDone = true;
            exitFullscreen();
          }
        }
        return;
      }
      if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12 && !start.moved) {
        start.moved = true;
        clearLongPress();
      }
    });

    function up(e) {
      clearLongPress();
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size === 0) {
        if (fsState.open && start) {
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (!start.moved && !start.longPressed && Date.now() - start.time < 500) {
            showFsHint();
          } else if (!start.multi && !start.longPressed && Math.abs(dy) >= 150 && Math.abs(dy) > Math.abs(dx) * 1.5 && settings.showQrCode) {
            openQrOverlay();
          }
        }
        start = null;
        pinchStart = 0;
      } else if (pts.size === 1) {
        pinchStart = 0;
      }
    }

    g.addEventListener('pointerup', up);
    g.addEventListener('pointercancel', up);
    g.addEventListener('contextmenu', e => e.preventDefault());

    /* 二维码覆盖层手势 */
    const qr = $('#fsQr');
    let qp = null;
    qr.addEventListener('pointerdown', e => {
      if (!fsState.qrOpen) return;
      qp = { x: e.clientX, y: e.clientY, moved: false };
      try { qr.setPointerCapture(e.pointerId); } catch (_) {}
    });
    qr.addEventListener('pointermove', e => {
      if (qp && Math.hypot(e.clientX - qp.x, e.clientY - qp.y) > 15) qp.moved = true;
    });
    qr.addEventListener('pointerup', e => {
      if (!qp) return;
      const dx = e.clientX - qp.x;
      const dy = e.clientY - qp.y;
      const moved = qp.moved;
      qp = null;
      if (moved && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.1 && settings.qrSwipeSwitch && qrs.length > 1) {
        switchQr(dx < 0 ? 1 : -1);
      } else if (!moved) {
        closeQrOverlay();
      }
    });
    qr.addEventListener('pointercancel', () => { qp = null; });
    qr.addEventListener('contextmenu', e => e.preventDefault());
  }

  /* ============================================================
   * 关于页彩蛋
   * ============================================================ */
  const SUDOKU_TARGET = [
    '00000000000000',
    '00011110000000',
    '00011110000000',
    '00011110000000',
    '00011110010000',
    '00011111111000',
    '00011111111000',
    '00011111111000',
    '00011111111000',
    '00000001111000',
    '00000001111000',
    '00000001111000',
    '00000001111000',
    '00000000000000'
  ];
  let eggTapCounts = { sudoku: 0 };
  let sudokuState = null;
  let sudokuTimers = [];

  function clearEggTimers() {
    sudokuTimers.forEach(clearTimeout);
    sudokuTimers = [];
  }

  function openSudoku() {
    clearEggTimers();
    sudokuState = {
      grid: SUDOKU_TARGET.map(() => new Array(14).fill(false)),
      solved: false
    };
    const grid = $('#eggGrid');
    grid.className = 'sudoku-grid';
    grid.innerHTML = '';
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'sudoku-cell';
        cell.dataset.r = String(r);
        cell.dataset.c = String(c);
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `${r + 1},${c + 1}`);
        grid.appendChild(cell);
      }
    }
    $('#eggResult').textContent = '';
    const close = $('#eggSudoku .egg-close');
    if (close) close.setAttribute('aria-label', t('close'));
    $('#eggSudoku').hidden = false;
    document.documentElement.style.overflow = 'hidden';
  }

  function toggleSudokuCell(cell) {
    if (!sudokuState || sudokuState.solved) return;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    sudokuState.grid[r][c] = !sudokuState.grid[r][c];
    cell.classList.toggle('on', sudokuState.grid[r][c]);
    const done = sudokuState.grid.every((row, ri) =>
      row.every((v, ci) => v === (SUDOKU_TARGET[ri].charAt(ci) === '1'))
    );
    if (done) {
      sudokuState.solved = true;
      finishSudoku();
    }
  }

  function finishSudoku() {
    const grid = $('#eggGrid');
    let step = 0;
    const flash = () => {
      grid.classList.remove('flash1', 'flash2');
      if (step >= 6) {
        grid.classList.add('solved');
        $$('.sudoku-cell', grid).forEach(cell => {
          const r = Number(cell.dataset.r);
          const c = Number(cell.dataset.c);
          if (SUDOKU_TARGET[r].charAt(c) === '1') cell.classList.add('hint');
        });
        $('#eggResult').textContent = '老方-LaoFang';
        return;
      }
      grid.classList.add(step % 2 === 0 ? 'flash1' : 'flash2');
      step++;
      sudokuTimers.push(setTimeout(flash, 200));
    };
    flash();
  }

  function closeEggScreens() {
    clearEggTimers();
    sudokuState = null;
    $('#eggSudoku').hidden = true;
    if ($('#eggGrid')) {
      $('#eggGrid').className = 'sudoku-grid';
      $('#eggGrid').innerHTML = '';
      $('#eggResult').textContent = '';
    }
    document.documentElement.style.overflow = '';
  }

  /* ============================================================
   * 事件
   * ============================================================ */
  async function handleAction(action, el) {
    switch (action) {
      case 'nav-home':
        if (State.view === 'home' && !State.sub) break;
        State.view = 'home';
        State.sub = null;
        renderChrome();
        transitionPage('fade');
        break;
      case 'nav-settings':
        if (State.view === 'settings' && !State.sub) break;
        State.view = 'settings';
        State.sub = null;
        renderChrome();
        transitionPage('fade');
        break;
      case 'open-start':
        startFullscreen();
        break;
      case 'back':
        if (State.sub) {
          State.sub = State.sub === 'license' ? 'about' : null;
          renderChrome();
          transitionPage('exit');
        }
        break;
      case 'sub': {
        const sub = el.dataset.sub;
        if (sub) {
          if (sub === 'about') eggTapCounts = { sudoku: 0 };
          State.view = 'settings';
          State.sub = sub;
          renderChrome();
          transitionPage('enter');
        }
        break;
      }
      case 'egg-sudoku':
        eggTapCounts.sudoku++;
        if (eggTapCounts.sudoku >= 7) {
          eggTapCounts.sudoku = 0;
          openSudoku();
        }
        break;
      case 'egg-close':
        closeEggScreens();
        break;
      case 'add-badge':
        openAddDialog();
        break;
      case 'pick-image':
        closeDialog();
        primeCropView();
        openImagePicker();
        break;
      case 'pick-video':
        closeDialog();
        $('#fileVideo').click();
        break;
      case 'select-badge': {
        const id = el.dataset.id;
        if (id) {
          selectBadge(id);
          renderPage({ keepScroll: true });
        }
        break;
      }
      case 'badge-menu':
        openBadgeMenu(el.dataset.id, el);
        break;
      case 'dark-mode':
        settings.darkMode = Number(el.dataset.mode) || 0;
        saveSettings();
        applyTheme();
        renderPage({ keepScroll: true });
        break;
      case 'theme-color':
        settings.themeColorIndex = Number(el.dataset.index) || 0;
        saveSettings();
        applyTheme();
        renderPage({ keepScroll: true });
        break;
      case 'qr-from-link':
        if (settings.showQrCode) openQrLinkDialog();
        break;
      case 'qr-import':
        if (settings.showQrCode) $('#fileQr').click();
        break;
      case 'select-qr':
        if (settings.showQrCode) selectQr(el.dataset.id);
        break;
      case 'qr-menu':
        if (settings.showQrCode) openQrMenu(el.dataset.id);
        break;
      case 'tut-toggle': {
        const id = el.dataset.id;
        State.tutOpen[id] = !State.tutOpen[id];
        renderPage({ keepScroll: true });
        break;
      }
      case 'crop-close':
        closeCrop();
        break;
      case 'crop-reselect':
        /* 保持裁剪页与全屏，只重新拉起相册；取消则保留当前图片 */
        primeCropView();
        openImagePicker();
        break;
      case 'crop-confirm':
        confirmCrop();
        break;
      case 'copy-gate-url':
        copyGateUrl();
        break;
      case 'follow-author':
        followAuthor();
        break;
      case 'watch-video':
        watchOriginalVideo();
        break;
      default:
        break;
    }
  }

  function bindEvents() {
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      if (el.dataset.disabled === '1') return;
      const action = el.dataset.action;
      if (!action) return;
      e.preventDefault();
      handleAction(action, el);
    });

    document.addEventListener('change', e => {
      const sw = e.target && e.target.closest ? e.target.closest('mdui-switch[data-key]') : null;
      if (sw) {
        const field = SWITCH_FIELDS[sw.dataset.key];
        if (field) {
          settings[field] = !!sw.checked;
          saveSettings();
          /* 只有「上划展示二维码」会影响同页其他控件；延迟一帧，避开 MDUI 开关自身的异步校验 */
          if (field === 'showQrCode') setTimeout(() => renderPage({ keepScroll: true }), 0);
        }
        return;
      }
      if (e.target.id === 'langSelect') {
        settings.languageIndex = Number(e.target.value) === 1 ? 1 : 0;
        saveSettings();
        renderChrome();
        renderPage({ keepScroll: true });
      }
    });

    $('#fileImage').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      cropPickerActive = false;
      if (f) {
        /* 在 change 的用户激活里同步补全屏，rAF 里再请求容易被拒 */
        if (!document.fullscreenElement) enterCropFullscreen();
        openCrop(f);
      } else {
        settleCropPicker(false);
      }
    });
    $('#fileImage').addEventListener('cancel', () => {
      cropPickerActive = false;
      settleCropPicker(false);
    });
    $('#fileVideo').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (f) addVideoFromFile(f);
    });
    $('#fileQr').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (f) importQrFile(f);
    });

    $('#backBtn').addEventListener('click', () => {});
    bindFullscreenGestures();
    bindCrop();

    $('#eggGrid').addEventListener('click', e => {
      const cell = e.target.closest('.sudoku-cell');
      if (cell) toggleSudokuCell(cell);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (!$('#eggSudoku').hidden) { closeEggScreens(); return; }
        const modal = $('#modalRoot');
        if (modal.children.length) { closeDialog(); return; }
        if (cropState) { closeCrop(); return; }
        if (fsState.qrOpen) { closeQrOverlay(); return; }
        if (fsState.open) exitFullscreen();
      }
    });

    const onNativeFullscreenChange = () => {
      const active = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      if (active || !fsState.open) return;
      /* App 内容器沉浸已接管时，Fullscreen API 失败不应关闭展示层 */
      if (fsState.toyImmersive) return;
      exitFullscreen();
    };
    document.addEventListener('fullscreenchange', onNativeFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onNativeFullscreenChange);

    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', () => { if (settings.darkMode === 0) applyTheme(); });
    } catch (_) {}
  }

  /* ============================================================
   * 电脑访问提示
   * ============================================================ */
  /* 扫码地址固定为线上 Toy，不再跟随预览链接变化 */
  const TOY_HOME_URL = 'https://www.bilibili.com/toy/songshushoupai';

  function gateTargetUrl() {
    return TOY_HOME_URL;
  }

  async function copyToClipboard(text) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (_) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        ta.remove();
      } catch (_) {}
    }
    toast(ok ? t('copy_success') : text);
    return ok;
  }

  async function copyGateUrl() {
    await copyToClipboard(gateTargetUrl());
  }

  function setupDesktopGate() {
    const url = gateTargetUrl();
    const urlEl = $('#gateUrl');
    if (urlEl) urlEl.textContent = url;
    const card = $('.gate-card');
    if (card) {
      const nameEl = card.querySelector('.gate-name');
      const titleEl = card.querySelector('h1');
      const descEl = card.querySelector('p');
      const hintEl = card.querySelector('.gate-hint');
      if (nameEl) nameEl.textContent = t('app_name');
      if (titleEl) titleEl.textContent = t('desktop_gate_title');
      if (descEl) descEl.textContent = t('desktop_gate_desc');
      if (hintEl) hintEl.textContent = t('desktop_gate_scan');
    }
    const copyBtn = $('#gateCopy');
    if (copyBtn) {
      copyBtn.textContent = t('desktop_gate_copy');
      copyBtn.addEventListener('click', copyGateUrl);
    }
    const qrBox = $('#gateQr');
    if (qrBox) {
      try {
        const qr = window.qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        qrBox.innerHTML = `<img src="${qr.createDataURL(6, 4)}" alt="">`;
      } catch (_) {}
    }
    const splash = $('#splash');
    if (splash) splash.remove();
  }

  /* ============================================================
   * 初始化
   * ============================================================ */
  async function init() {
    applyTheme();
    if (document.documentElement.getAttribute('data-access') === 'desktop') {
      setupDesktopGate();
      return;
    }
    bindEvents();
    await loadData();
    if (inToyPage()) loadToySdk();
    renderChrome();
    renderPage();
    // 开屏：logo 淡入/缩放 → 整层淡出
    setTimeout(() => {
      const splash = $('#splash');
      if (!splash) return;
      splash.classList.add('hide');
      setTimeout(() => { try { splash.remove(); } catch (_) {} }, 600);
    }, 1000);
  }

  init();
})();
