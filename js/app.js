/* 应用骨架：hash 路由、侧栏 / 抽屉 / 底部导航、复制按钮、主题、PWA 注册 */
(function () {
  'use strict';

  const ICONS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M8 7h7M8 11h7"/>',
    gauge: '<path d="M12 14l4-4"/><path d="M3.5 18a9 9 0 1 1 17 0"/><circle cx="12" cy="14" r="1.5"/>',
    cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><circle cx="12" cy="17" r=".6"/>',
    glossary: '<path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6M8 13h8M8 17h5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    tools: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16l4-5 3 3 5-7"/>',
  };

  function icon(name, cls) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : '') + '>' + (ICONS[name] || '') + '</svg>'
    );
  }

  const h = (s) => window.MD.esc(s == null ? '' : s);
  const routes = [];

  const App = (window.App = {
    icon,
    h,
    route(pattern, view) { routes.push([pattern, view]); },
    go(hash) { location.hash = hash; },
    lessonUrl: (id) => '#/lesson/' + id,
    level: (id) => SITE.levels.find((l) => l.id === id),
    lessonIndex(id) {
      const all = SITE.lessons;
      return all.findIndex((l) => l.id === id);
    },
    progress(levelId) {
      const list = levelId ? App.level(levelId).lessons : SITE.lessons;
      const done = list.filter((l) => Store.isDone(l.id)).length;
      return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
    },
    nextLesson() {
      const last = Store.state.last && SITE.byId[Store.state.last];
      if (last && !Store.isDone(last.id)) return last;
      return SITE.lessons.find((l) => !Store.isDone(l.id)) || null;
    },
    progressBar(pct, thin) {
      return '<div class="progress' + (thin ? ' thin' : '') + '" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>';
    },
    lvBadge(lv) {
      return '<span class="badge lv" style="--lv:' + lv.color + '">' + h(lv.id + ' · ' + lv.stage) + '</span>';
    },
    toast(msg) {
      let el = document.getElementById('toast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.className = 'toast';
        el.setAttribute('role', 'status');
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove('show'), 1800);
    },
    copy(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
      }
      return Promise.resolve(legacyCopy(text));
    },
    refreshChrome,
    verifyNote() {
      return '<div class="verify-note">典型场景 / 模拟案例，用于练习思路，不代表公司内部信息或在招岗位。公司信息以官网和招聘页为准，最后核实日期 ' + SITE.verified + '。</div>';
    },
  });

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------- 外框 ---------- */
  const NAV_LINKS = [
    ['#/plan', 'calendar', '12 周计划打卡'],
    ['#/tools', 'gauge', '工具箱（实时预算计算器等）'],
    ['#/interview', 'cards', '面试题卡片'],
    ['#/quiz', 'quiz', '测验总览'],
    ['#/hangzhou', 'pin', '杭州公司与岗位地图'],
    ['#/glossary', 'glossary', '术语表（嵌入式对照）'],
    ['#/search', 'search', '全站搜索'],
    ['#/settings', 'settings', '设置、备份与重置'],
  ];

  function buildChrome() {
    document.getElementById('app').innerHTML =
      '<header class="topbar">' +
      '<button class="icon-btn" id="menuBtn" type="button" aria-label="打开课程目录">' + icon('menu') + '</button>' +
      '<a class="brand" href="#/"><img src="assets/icons/favicon-64.png" alt=""><span>' + h(SITE.title) + '</span></a>' +
      '<span class="top-progress" id="topProgress"></span>' +
      '<form class="top-search" id="topSearch" role="search">' + icon('search') +
      '<input type="search" name="q" placeholder="搜索课程、命令、公司…" aria-label="搜索"></form>' +
      '<a class="icon-btn" href="#/search" aria-label="搜索" id="searchBtn">' + icon('search') + '</a>' +
      '</header>' +
      '<div class="layout"><aside class="sidebar" id="sidebar" aria-label="课程目录"></aside>' +
      '<main class="main" id="main" tabindex="-1"></main></div>' +
      '<nav class="bottomnav" aria-label="主导航">' +
      navItem('#/', 'home', '首页', 'home') +
      navItem('#/courses', 'book', '课程', 'courses') +
      navItem('#/tools', 'gauge', '工具', 'tools') +
      navItem('#/interview', 'cards', '面试', 'interview') +
      navItem('#/hangzhou', 'pin', '杭州', 'hangzhou') +
      '</nav><div class="scrim" id="scrim"></div>';
  }

  function navItem(href, ic, label, key) {
    return '<a href="' + href + '" data-nav="' + key + '">' + icon(ic) + '<span>' + label + '</span></a>';
  }

  function refreshChrome(activeLesson, activeNav) {
    const p = App.progress();
    document.getElementById('topProgress').textContent = p.done + '/' + p.total;
    const sb = document.getElementById('sidebar');
    let html =
      '<div class="side-head"><strong>课程目录</strong><button class="icon-btn side-close" type="button" aria-label="关闭目录">' + icon('x') + '</button></div>' +
      '<div class="side-progress"><div class="small muted" style="margin-bottom:6px">总进度 ' + p.done + ' / ' + p.total + ' 课（' + p.pct + '%）</div>' + App.progressBar(p.pct) + '</div>';
    for (const lv of SITE.levels) {
      const lp = App.progress(lv.id);
      html +=
        '<div class="side-level"><a href="#/level/' + lv.id + '"><span class="badge lv" style="--lv:' + lv.color + '">' + lv.id + '</span>' +
        h(lv.title) + '<span class="lv-count">' + lp.done + '/' + lp.total + '</span></a><ul class="side-lessons">';
      lv.lessons.forEach((l) => {
        html +=
          '<li><a href="' + App.lessonUrl(l.id) + '"' + (l.id === activeLesson ? ' class="active" aria-current="page"' : '') + '>' +
          '<span class="chk' + (Store.isDone(l.id) ? ' on' : '') + '"></span><span>' + h(l.title) + '</span></a></li>';
      });
      html += '</ul></div>';
    }
    html += '<ul class="side-links">';
    NAV_LINKS.forEach(([href, ic, label]) => {
      const on = activeNav && href === '#/' + activeNav;
      html += '<li><a href="' + href + '"' + (on ? ' class="active"' : '') + '>' + icon(ic) + label + '</a></li>';
    });
    html += '</ul>';
    sb.innerHTML = html;
    document.querySelectorAll('.bottomnav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === navGroup(activeNav)));
  }

  function navGroup(nav) {
    if (nav === 'lesson' || nav === 'level' || nav === 'courses' || nav === 'plan' || nav === 'quiz' || nav === 'glossary') return 'courses';
    if (nav === 'tools') return 'tools';
    return nav;
  }

  /* ---------- 路由 ---------- */
  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    const params = new URLSearchParams(qs || '');
    return { path: path || '/', params };
  }

  let lastPath = null;
  function render() {
    const { path, params } = parseHash();
    let view = null;
    let m = null;
    for (const [re, fn] of routes) {
      m = path.match(re);
      if (m) { view = fn; break; }
    }
    const main = document.getElementById('main');
    let out;
    try {
      out = view ? view(m.slice(1), params) : null;
    } catch (e) {
      console.error(e);
      out = { title: '出错了', html: '<div class="empty">页面渲染出错：' + h(e.message) + '</div>' };
    }
    if (!out) out = { title: '找不到页面', html: '<div class="empty">没有这个页面。<p><a class="btn" href="#/">回到首页</a></p></div>' };
    main.innerHTML = out.html + footer();
    document.title = (out.title ? out.title + ' · ' : '') + SITE.title;
    bindTasks(main, out.scope || path);
    if (out.after) out.after(main);
    refreshChrome(out.lesson || null, out.nav || null);
    closeDrawer();
    if (path !== lastPath) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
    lastPath = path;
  }

  function footer() {
    return '<div class="footer">进度只保存在本机浏览器 · 内容基于 Apple 芯片 Mac（M4）实测与公开资料 · 公司信息最后核实 ' + SITE.verified +
      '<br>站点版本 ' + SITE.version + ' · <a href="#/settings">设置与备份</a></div>';
  }

  function bindTasks(root, scope) {
    root.querySelectorAll('input[data-task]').forEach((cb) => {
      const id = scope + ':' + cb.dataset.task;
      const saved = Store.taskDone(id);
      cb.checked = saved === undefined ? cb.dataset.default === '1' : !!saved;
      cb.closest('.task-label').classList.toggle('on', cb.checked);
      cb.addEventListener('change', () => {
        Store.setTask(id, cb.checked);
        cb.closest('.task-label').classList.toggle('on', cb.checked);
      });
    });
  }

  /* ---------- 抽屉 ---------- */
  function openDrawer() {
    document.body.classList.add('drawer-open');
    const active = document.querySelector('.side-lessons a.active');
    if (active) active.scrollIntoView({ block: 'center' });
  }
  function closeDrawer() { document.body.classList.remove('drawer-open'); }

  /* ---------- 主题 ---------- */
  function applyTheme() {
    const t = Store.state.theme;
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  }
  App.applyTheme = applyTheme;

  /* ---------- 全局事件 ---------- */
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('#menuBtn')) { openDrawer(); return; }
      if (t.closest('.side-close') || t.id === 'scrim') { closeDrawer(); return; }
      const copyBtn = t.closest('[data-copy]');
      if (copyBtn) {
        const codeEl = copyBtn.closest('.code').querySelector('code');
        App.copy(codeEl.textContent).then((ok) => {
          if (!ok) {
            const range = document.createRange();
            range.selectNodeContents(codeEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
          copyBtn.textContent = ok ? '已复制' : '已选中，长按复制';
          copyBtn.classList.toggle('done', ok);
          setTimeout(() => { copyBtn.textContent = '复制'; copyBtn.classList.remove('done'); }, 1600);
        });
        return;
      }
      const jump = t.closest('[data-jump]');
      if (jump) {
        const el = document.getElementById(jump.dataset.jump);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
    document.getElementById('topSearch').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = e.target.q.value.trim();
      App.go('#/search?q=' + encodeURIComponent(q));
    });
    window.addEventListener('hashchange', render);
  }

  /* ---------- PWA：仅在 https 或 localhost 下启用；file:// 和局域网 http 下自动跳过 ---------- */
  function setupPwa() {
    if (!/^https?:$/.test(location.protocol)) return;
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = 'manifest.webmanifest';
    document.head.appendChild(link);
    if ('serviceWorker' in navigator && window.isSecureContext) {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Service worker 注册失败', err));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    buildChrome();
    bindGlobal();
    setupPwa();
    render();
  });
})();
