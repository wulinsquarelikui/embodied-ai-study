/* 页面视图：首页、课程、单课、测验、面试卡片、杭州、12 周计划、术语表、搜索、设置 */
(function () {
  'use strict';

  const { h, icon } = App;
  const R = (s) => MD.render(s);
  const LETTERS = 'ABCDEFG';

  /* ---------- 统计 ---------- */
  function quizStats(lessons) {
    let total = 0, answered = 0, correct = 0;
    for (const l of lessons) {
      l.quiz.forEach((q, i) => {
        total++;
        const a = Store.quizAnswer(l.id, i);
        if (a !== undefined) { answered++; if (a === q.answer) correct++; }
      });
    }
    return { total, answered, correct };
  }

  function allCards() {
    const out = [];
    for (const l of SITE.lessons) l.interview.forEach((c, i) => out.push({ id: l.id + '#' + i, lesson: l, card: c }));
    return out;
  }

  function planItems() {
    const out = [];
    if (!SITE.plan) return out;
    SITE.plan.phases.forEach((p) => p.weeks.forEach((w) => w.items.forEach((it) => out.push(it))));
    return out;
  }

  /* ---------- 首页 ---------- */
  App.route(/^\/$/, () => {
    const p = App.progress();
    const qs = quizStats(SITE.lessons);
    const cards = allCards();
    const mastered = cards.filter((c) => Store.isMastered(c.id)).length;
    const plan = planItems();
    const planDone = plan.filter((it) => Store.planDone(it.id)).length;
    const next = App.nextLesson();
    const acc = qs.answered ? Math.round((qs.correct / qs.answered) * 100) + '%' : '—';

    let html =
      '<section class="hero"><h1>从嵌入式到具身智能<br>杭州求职学习站</h1>' +
      '<p>写给嵌入式（音频 / 无线 / SoC 方向）工程师：用 DSP、RTOS、低延迟链路、客户导入这些熟悉的工程概念讲清楚训练、部署和实时，目标是客户面技术岗。</p>' +
      '<div class="btn-row">' +
      (next ? '<a class="btn primary" href="' + App.lessonUrl(next.id) + '">' + (p.done ? '继续学习：' : '从这里开始：') + h(next.title) + '</a>'
            : '<a class="btn primary" href="#/courses">全部完成，去复习</a>') +
      '<a class="btn" href="#/plan">12 周计划</a></div>' +
      '<div class="quote">一句话定位（模板）：[X] 年芯片级嵌入式和客户导入经验，做过低延迟实时系统和端侧算法部署，现在把这套能力带到具身智能的数采、部署和客户交付上。</div></section>';

    html +=
      '<div class="card"><div class="section-title" style="margin-top:0"><h2>我的进度</h2><a class="small" href="#/settings">备份 / 重置</a></div>' +
      App.progressBar(p.pct) +
      '<div class="stat-row"><div class="stat"><b>' + p.done + '/' + p.total + '</b><span>课程完成</span></div>' +
      '<div class="stat"><b>' + acc + '</b><span>测验正确率（已答 ' + qs.answered + '/' + qs.total + '）</span></div>' +
      '<div class="stat"><b>' + planDone + '/' + plan.length + '</b><span>12 周计划打卡</span></div></div>' +
      '<div class="small muted">面试卡片已掌握 ' + mastered + ' / ' + cards.length + ' 张</div></div>';

    html += '<div class="section-title"><h2>课程地图：入门到精通</h2><a class="small" href="#/courses">全部课程</a></div><div class="grid grid-2">';
    for (const lv of SITE.levels) {
      const lp = App.progress(lv.id);
      html +=
        '<a class="card level-card" style="--lv:' + lv.color + '" href="#/level/' + lv.id + '">' +
        '<div class="lv-top">' + App.lvBadge(lv) + '</div><h3>' + h(lv.title) + '</h3><p>' + h(lv.short) + '</p>' +
        '<div class="lv-foot">' + App.progressBar(lp.pct, true) + '<span>' + lp.done + '/' + lp.total + ' 课</span></div></a>';
    }
    html += '</div>';

    html +=
      '<div class="section-title"><h2>互动工具</h2></div><div class="grid grid-2">' +
      toolCard('#/tools/budget', 'gauge', '实时预算计算器', '输入控制频率、推理延迟、chunk 步数，算出会不会「顿」、多久顿一次') +
      toolCard('#/interview', 'cards', '面试题卡片', '点击翻面看答题要点，标记已掌握') +
      toolCard('#/hangzhou', 'pin', '杭州公司与岗位地图', '宇树、云深处、海康机器人、强脑、蚂蚁灵波、群核、国芯…') +
      toolCard('#/quiz', 'quiz', '测验总览 / 错题本', '每课自测题即时判分，错题集中复习') +
      '</div>';

    html +=
      '<div class="section-title"><h2>本机实测关键数字</h2><a class="small" href="#/level/L2">去实验课</a></div><div class="facts">' +
      fact('30 条 / 10113 帧', '握手示教数据集，30Hz，每条约 11 秒') +
      fact('33–100 ms', '从动臂跟随主动臂延迟（1–3 帧）') +
      fact('51.6M 参数', 'ACT，checkpoint 207MB，Mac GPU 每步约 260ms') +
      fact('13.3 分钟', '3000 步训练；验证 L1 0.66 → 0.50') +
      fact('72.05 → 2.78', 'chunk100 vs ensemble 最大单帧跳变（人类 5.44）') +
      fact('12.2 / 23.6 / 174.2 ms', 'Mac GPU 推理 p50：216×384 / 480×640 / 1080p') +
      fact('33 ms', '30Hz 控制周期，1080p 推理≈5 个以上周期') +
      fact('每 3.3 秒顿一下', '1080p + 同步推理 + chunk100 的根因') +
      '</div>';

    html +=
      '<div class="section-title"><h2>推荐路线</h2></div><div class="grid grid-2">' +
      '<div class="card"><b>快速路线（约 2 周，先有面试谈资）</b><p class="small muted">L0 全部 → L1-1 → L2 五个实验 → L1 其余 → L5-1、L5-4 → L7</p>' +
      '<a class="btn small" href="' + App.lessonUrl('l0-1') + '">开始</a></div>' +
      '<div class="card"><b>完整路线（12 周，每周 8–10 小时）</b><p class="small muted">按 12 周计划打卡：Mac 实验 → 真机 → 训练与部署实验 → 求职</p>' +
      '<a class="btn small" href="#/plan">打开计划</a></div></div>';

    return { title: '首页', html, nav: 'home' };
  });

  function toolCard(href, ic, title, desc) {
    return '<a class="card tool-card" href="' + href + '">' + icon(ic) + '<div><b>' + h(title) + '</b><span>' + h(desc) + '</span></div></a>';
  }
  function fact(b, s) {
    return '<div class="fact"><b>' + h(b) + '</b><span>' + h(s) + '</span></div>';
  }

  /* ---------- 全部课程 / 单个模块 ---------- */
  function lessonList(lessons) {
    let html = '<ul class="lesson-list">';
    lessons.forEach((l) => {
      const lv = App.level(l.level);
      const n = lv.lessons.indexOf(l) + 1;
      const done = Store.isDone(l.id);
      html +=
        '<li><a href="' + App.lessonUrl(l.id) + '"><span class="num' + (done ? ' on' : '') + '">' + (done ? '✓' : n) + '</span>' +
        '<span class="t"><b>' + h(l.title) + '</b><span>约 ' + (l.minutes || 20) + ' 分钟 · ' + l.quiz.length + ' 道自测 · ' + l.interview.length + ' 张面试卡</span></span></a></li>';
    });
    return html + '</ul>';
  }

  App.route(/^\/courses$/, () => {
    let html = '<h1 class="page-title">全部课程</h1><p class="muted">' + SITE.lessons.length + ' 课，分 ' + SITE.levels.length + ' 个模块。每课包含：学习目标、讲解（嵌入式类比）、动手任务、自测题、面试话术、杭州就业场景。</p>';
    for (const lv of SITE.levels) {
      const lp = App.progress(lv.id);
      html +=
        '<div class="card" style="margin:14px 0;border-left:5px solid ' + lv.color + '">' +
        '<div class="lv-top" style="display:flex;gap:8px;align-items:center">' + App.lvBadge(lv) + '<span class="small muted">' + lp.done + '/' + lp.total + '</span></div>' +
        '<h2 style="margin:6px 0 2px;font-size:18px"><a href="#/level/' + lv.id + '" style="color:inherit;text-decoration:none">' + h(lv.title) + '</a></h2>' +
        '<p class="small muted" style="margin:0 0 6px">' + h(lv.short) + '</p>' + lessonList(lv.lessons) + '</div>';
    }
    return { title: '全部课程', html, nav: 'courses' };
  });

  App.route(/^\/level\/(\w+)$/, ([id]) => {
    const lv = App.level(id);
    if (!lv) return null;
    const lp = App.progress(id);
    const qs = quizStats(lv.lessons);
    const html =
      '<div class="crumbs"><a href="#/courses">全部课程</a><span>/</span><span>' + lv.id + '</span></div>' +
      '<h1 class="page-title">' + h(lv.id + ' ' + lv.title) + '</h1>' +
      '<div class="lesson-meta">' + App.lvBadge(lv) + '<span class="badge">' + lv.lessons.length + ' 课</span><span class="badge">测验 ' + qs.correct + '/' + qs.total + '</span></div>' +
      '<p>' + h(lv.desc) + '</p>' + App.progressBar(lp.pct) +
      '<div class="card" style="margin-top:14px">' + lessonList(lv.lessons) + '</div>';
    return { title: lv.title, html, nav: 'level' };
  });

  /* ---------- 单课 ---------- */
  function renderQuiz(lesson) {
    let html = '<div class="quiz" data-lesson="' + lesson.id + '">';
    lesson.quiz.forEach((q, qi) => {
      html += '<div class="quiz-q" data-q="' + qi + '"><p class="q-title">' + (qi + 1) + '. ' + MD.inline(q.q) + '</p><div class="opts">';
      q.options.forEach((o, oi) => {
        html += '<button type="button" class="opt" data-opt="' + oi + '"><span class="k">' + LETTERS[oi] + '</span><span>' + MD.inline(o) + '</span></button>';
      });
      html += '</div><div class="explain" hidden></div></div>';
    });
    html += '<div class="quiz-foot"><span class="score small muted"></span><button type="button" class="btn small" data-quiz-reset>重做本课测验</button></div></div>';
    return html;
  }

  function bindQuiz(root, lesson) {
    const box = root.querySelector('.quiz[data-lesson="' + lesson.id + '"]');
    if (!box) return;
    const paint = () => {
      let answered = 0, correct = 0;
      box.querySelectorAll('.quiz-q').forEach((qEl) => {
        const qi = +qEl.dataset.q;
        const q = lesson.quiz[qi];
        const a = Store.quizAnswer(lesson.id, qi);
        const ex = qEl.querySelector('.explain');
        qEl.querySelectorAll('.opt').forEach((b) => {
          const oi = +b.dataset.opt;
          b.disabled = a !== undefined;
          b.classList.toggle('right', a !== undefined && oi === q.answer);
          b.classList.toggle('wrong', a !== undefined && oi === a && a !== q.answer);
        });
        if (a === undefined) { ex.hidden = true; return; }
        answered++;
        const ok = a === q.answer;
        if (ok) correct++;
        ex.hidden = false;
        ex.innerHTML =
          '<span class="verdict ' + (ok ? 'ok">答对了。' : 'no">不对，正确答案是 ' + LETTERS[q.answer] + '。') + '</span> ' + MD.inline(q.explain || '');
      });
      box.querySelector('.score').textContent = '已答 ' + answered + '/' + lesson.quiz.length + '，答对 ' + correct;
    };
    box.addEventListener('click', (e) => {
      const opt = e.target.closest('.opt');
      if (opt && !opt.disabled) {
        const qi = +opt.closest('.quiz-q').dataset.q;
        Store.setQuizAnswer(lesson.id, qi, +opt.dataset.opt);
        paint();
        return;
      }
      if (e.target.closest('[data-quiz-reset]')) { Store.resetQuiz(lesson.id); paint(); }
    });
    paint();
  }

  function renderCard(entry, showSource) {
    const { id, card, lesson } = entry;
    const m = Store.isMastered(id);
    return (
      '<div class="flip' + (m ? ' mastered' : '') + '" data-card="' + h(id) + '"><div class="flip-inner">' +
      '<button type="button" class="flip-front" aria-expanded="false"><span class="q">' + MD.inline(card.q) + '</span>' +
      '<span class="hint">' + (m ? '已掌握 · ' : '') + '点击翻面看答题要点' + (showSource ? ' · 来自 ' + h(lesson.level + ' ' + lesson.title) : '') + '</span></button>' +
      '<div class="flip-back prose" hidden>' + R(card.a) +
      '<div class="card-actions"><button type="button" class="btn small" data-master>' + (m ? '取消已掌握' : '标记已掌握') + '</button>' +
      '<button type="button" class="btn small" data-flip-back>收起</button>' +
      (showSource ? '<a class="btn small" href="' + App.lessonUrl(lesson.id) + '">去这一课</a>' : '') + '</div></div></div></div>'
    );
  }

  function bindCards(root, onChange) {
    root.addEventListener('click', (e) => {
      const flip = e.target.closest('.flip');
      if (!flip) return;
      const back = flip.querySelector('.flip-back');
      const front = flip.querySelector('.flip-front');
      if (e.target.closest('.flip-front') || e.target.closest('[data-flip-back]')) {
        const open = back.hidden;
        back.hidden = !open;
        flip.classList.toggle('flipped', open);
        front.setAttribute('aria-expanded', String(open));
        if (!open) front.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (e.target.closest('[data-master]')) {
        const id = flip.dataset.card;
        const on = !Store.isMastered(id);
        Store.setMastered(id, on);
        flip.classList.toggle('mastered', on);
        e.target.closest('[data-master]').textContent = on ? '取消已掌握' : '标记已掌握';
        flip.querySelector('.hint').textContent = (on ? '已掌握 · ' : '') + '点击翻面看答题要点';
        if (onChange) onChange();
      }
    });
  }

  App.route(/^\/lesson\/([\w-]+)$/, ([id]) => {
    const l = SITE.byId[id];
    if (!l) return null;
    const lv = App.level(l.level);
    const all = SITE.lessons;
    const idx = all.indexOf(l);
    const prev = all[idx - 1];
    const next = all[idx + 1];
    const n = lv.lessons.indexOf(l) + 1;
    Store.setLast(id);

    const sections = [];
    if (l.goals && l.goals.length) sections.push(['s-goals', '目标']);
    sections.push(['s-body', '讲解']);
    if (l.tasks) sections.push(['s-tasks', '动手']);
    if (l.quiz.length) sections.push(['s-quiz', '自测']);
    if (l.interview.length) sections.push(['s-iv', '面试']);
    if (l.hangzhou) sections.push(['s-hz', '杭州']);

    let html =
      '<div class="crumbs"><a href="#/level/' + lv.id + '">' + h(lv.id + ' ' + lv.title) + '</a><span>/</span><span>第 ' + n + ' 课（共 ' + lv.lessons.length + '）</span></div>' +
      '<h1 class="page-title">' + h(l.title) + '</h1>' +
      '<div class="lesson-meta">' + App.lvBadge(lv) + '<span class="badge">约 ' + (l.minutes || 20) + ' 分钟</span>' +
      (Store.isDone(id) ? '<span class="badge ok">已完成</span>' : '') + '</div>' +
      '<nav class="jump" aria-label="本课目录">' + sections.map(([sid, t]) => '<button type="button" data-jump="' + sid + '">' + t + '</button>').join('') + '</nav>';

    if (l.goals && l.goals.length) {
      html += '<section class="block" id="s-goals"><div class="goals"><b>学完这一课你能</b><ul>' + l.goals.map((g) => '<li>' + MD.inline(g) + '</li>').join('') + '</ul></div></section>';
    }
    html += '<section class="block prose" id="s-body">' + R(l.body) + '</section>';
    if (l.tasks) html += '<section class="block" id="s-tasks"><h2>动手任务<span class="tag">做完打勾</span></h2><div class="prose">' + R(l.tasks) + '</div></section>';
    if (l.quiz.length) html += '<section class="block" id="s-quiz"><h2>自测题<span class="tag">即时判分</span></h2>' + renderQuiz(l) + '</section>';
    if (l.interview.length) {
      html += '<section class="block" id="s-iv"><h2>面试话术<span class="tag">点击翻面</span></h2><div class="cards">' +
        l.interview.map((c, i) => renderCard({ id: l.id + '#' + i, card: c, lesson: l }, false)).join('') + '</div></section>';
    }
    if (l.hangzhou) {
      html += '<section class="block" id="s-hz"><div class="callout hz"><div class="co-title">' + icon('pin') + '杭州就业场景</div><div class="co-body prose">' +
        R(l.hangzhou) + App.verifyNote() + '</div></div></section>';
    }
    const done = Store.isDone(id);
    html +=
      '<div class="done-box"><button type="button" class="btn ' + (done ? 'ok' : 'primary') + '" id="doneBtn">' + (done ? '✓ 本课已完成（点击取消）' : '标记本课已完成') + '</button>' +
      '<div class="small muted" style="margin-top:8px">总进度 ' + App.progress().done + '/' + all.length + '</div></div>' +
      '<nav class="pager">' +
      (prev ? '<a class="prev" href="' + App.lessonUrl(prev.id) + '"><small>上一课</small>' + h(prev.title) + '</a>' : '') +
      (next ? '<a class="next" href="' + App.lessonUrl(next.id) + '"><small>下一课</small>' + h(next.title) + '</a>' : '') + '</nav>';

    return {
      title: l.title,
      html,
      lesson: id,
      nav: 'lesson',
      scope: id,
      after(root) {
        bindQuiz(root, l);
        const cardsBox = root.querySelector('#s-iv');
        if (cardsBox) bindCards(cardsBox);
        root.querySelector('#doneBtn').addEventListener('click', () => {
          const on = !Store.isDone(id);
          Store.setDone(id, on);
          if (on) App.toast(next ? '已完成，下一课：' + next.title : '恭喜，全部课程完成！');
          const y = window.scrollY;
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          window.scrollTo(0, y);
        });
      },
    };
  });

  /* ---------- 测验总览 / 错题本 ---------- */
  App.route(/^\/quiz$/, () => {
    const s = quizStats(SITE.lessons);
    let html =
      '<h1 class="page-title">测验总览 / 错题本</h1>' +
      '<p class="muted">共 ' + s.total + ' 道自测题，已答 ' + s.answered + '，答对 ' + s.correct + '。答错的题会列在下面，点进去重做。</p>' +
      App.progressBar(s.total ? Math.round((s.correct / s.total) * 100) : 0);
    const wrong = [];
    for (const l of SITE.lessons) l.quiz.forEach((q, i) => { const a = Store.quizAnswer(l.id, i); if (a !== undefined && a !== q.answer) wrong.push({ l, q }); });
    html += '<div class="section-title"><h2>错题（' + wrong.length + '）</h2></div>';
    html += wrong.length
      ? '<div class="card">' + wrong.map(({ l, q }) => '<a class="result-item" href="' + App.lessonUrl(l.id) + '"><b>' + MD.inline(q.q) + '</b><p>' + h(l.level + ' ' + l.title) + '</p></a>').join('') + '</div>'
      : '<div class="card empty">暂无错题。</div>';
    html += '<div class="section-title"><h2>各模块</h2></div>';
    for (const lv of SITE.levels) {
      html += '<div class="card" style="margin:10px 0"><b>' + h(lv.id + ' ' + lv.title) + '</b><ul class="lesson-list">';
      lv.lessons.forEach((l) => {
        const st = quizStats([l]);
        html += '<li><a href="' + App.lessonUrl(l.id) + '"><span class="num' + (st.answered === st.total && st.total ? ' on' : '') + '">' + st.correct + '</span><span class="t"><b>' + h(l.title) + '</b><span>已答 ' + st.answered + '/' + st.total + '，答对 ' + st.correct + '</span></span></a></li>';
      });
      html += '</ul></div>';
    }
    html += '<div class="btn-row"><button class="btn danger" type="button" id="resetQuiz">清空全部测验作答</button></div>';
    return {
      title: '测验总览',
      html,
      nav: 'quiz',
      after(root) {
        root.querySelector('#resetQuiz').addEventListener('click', () => {
          if (confirm('确定清空全部测验作答？')) { Store.reset('quiz'); window.dispatchEvent(new HashChangeEvent('hashchange')); }
        });
      },
    };
  });

  /* ---------- 面试题卡片 ---------- */
  App.route(/^\/interview$/, (_, params) => {
    const filter = params.get('f') || 'all';
    const cards = allCards();
    const mastered = cards.filter((c) => Store.isMastered(c.id)).length;
    const shown = cards.filter((c) =>
      filter === 'all' ? true : filter === 'todo' ? !Store.isMastered(c.id) : c.lesson.level === filter);
    let html =
      '<h1 class="page-title">面试题卡片</h1>' +
      '<p class="muted">共 ' + cards.length + ' 张，来自每一课的「面试话术」和 L7 的 14 道高频题。先自己口述 1 分钟，再点开对照要点。已掌握 <b id="mCount">' + mastered + '</b> 张。</p>' +
      '<div class="chips">' + chip('all', '全部', filter) + chip('todo', '只看未掌握', filter) +
      SITE.levels.map((lv) => chip(lv.id, lv.id, filter)).join('') + '</div>' +
      '<div class="cards two" id="cardList">' + (shown.map((c) => renderCard(c, true)).join('') || '<div class="empty">这个筛选下没有卡片。</div>') + '</div>';
    return {
      title: '面试题卡片',
      html,
      nav: 'interview',
      after(root) {
        bindCards(root.querySelector('#cardList'), () => {
          root.querySelector('#mCount').textContent = allCards().filter((c) => Store.isMastered(c.id)).length;
        });
      },
    };
  });

  function chip(val, label, cur) {
    return '<a class="chip' + (val === cur ? ' on' : '') + '" href="#/interview?f=' + val + '" style="text-decoration:none;display:inline-flex;align-items:center">' + h(label) + '</a>';
  }

  /* ---------- 杭州 ---------- */
  App.route(/^\/hangzhou$/, (_, params) => {
    const H = SITE.hangzhou;
    if (!H) return null;
    const g = params.get('g') || 'all';
    let html =
      '<h1 class="page-title">杭州公司与岗位地图</h1>' +
      '<div class="callout hz"><div class="co-title">' + icon('pin') + '怎么用这一页</div><div class="co-body prose">' + R(H.intro) + '</div></div>' +
      '<div class="chips">' +
      [['all', '全部']].concat(H.groups.map((x) => [x.id, x.name])).map(([id, name]) =>
        '<a class="chip' + (id === g ? ' on' : '') + '" style="text-decoration:none;display:inline-flex;align-items:center" href="#/hangzhou?g=' + id + '">' + h(name) + '</a>').join('') +
      '</div><div class="grid">';
    H.companies.filter((c) => g === 'all' || c.group === g).forEach((c) => {
      const grp = H.groups.find((x) => x.id === c.group);
      html +=
        '<details class="card co-card"><summary><div><div class="co-name">' + h(c.name) + '</div><div class="co-sub">' + h(c.oneLine) + '</div>' +
        '<div class="chips" style="margin:6px 0 0">' + (grp ? '<span class="badge">' + h(grp.name) + '</span>' : '') + (c.area ? '<span class="badge">' + h(c.area) + '</span>' : '') + '</div></div>' +
        icon('chevron', 'arrow') + '</summary><div class="co-body">' +
        '<h4>公开定位（概括）</h4><div class="prose">' + R(c.facts) + '</div>' +
        (c.check ? '<h4>投递前自己核实</h4><div class="prose">' + R(c.check) + '</div>' : '') +
        '<h4>可关注的岗位方向</h4><div class="prose">' + R(c.roles) + '</div>' +
        '<h4>典型场景 / 模拟案例</h4><div class="prose">' + R(c.scenario) + '</div>' +
        '<h4>你的切入点</h4><div class="prose">' + R(c.angle) + '</div>' +
        (c.sources && c.sources.length ? '<h4>核实入口（官网，' + SITE.verified + ' 确认可访问）</h4><ul class="src-list">' +
          c.sources.map((s) => '<li><a href="' + h(s.u) + '" target="_blank" rel="noopener">' + h(s.t) + '</a></li>').join('') + '</ul>' : '') +
        App.verifyNote() + '</div></details>';
    });
    html += '</div>';
    if (H.outro) html += '<div class="prose" style="margin-top:18px">' + R(H.outro) + '</div>';
    return { title: '杭州公司与岗位地图', html, nav: 'hangzhou' };
  });

  /* ---------- 12 周计划 ---------- */
  App.route(/^\/plan$/, () => {
    const P = SITE.plan;
    if (!P) return null;
    const items = planItems();
    const done = items.filter((it) => Store.planDone(it.id)).length;
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;
    let html =
      '<h1 class="page-title">12 周计划打卡</h1><div class="prose">' + R(P.intro) + '</div>' +
      '<div class="card"><div class="small muted" style="margin-bottom:6px">已完成 <b id="planCount">' + done + '/' + items.length + '</b></div>' + App.progressBar(pct) + '</div>';
    P.phases.forEach((ph) => {
      html += '<section class="phase"><h3>' + h(ph.title) + '</h3><p class="small muted" style="margin:0 0 6px">' + h(ph.goal) + '</p>';
      ph.weeks.forEach((w) => {
        const wd = w.items.filter((it) => Store.planDone(it.id)).length;
        html +=
          '<div class="card week" data-week="' + w.n + '"><div class="week-head"><b>第 ' + w.n + ' 周 · ' + h(w.title) + '</b><span class="badge' + (wd === w.items.length ? ' ok' : '') + '">' + wd + '/' + w.items.length + '</span></div><ul>';
        w.items.forEach((it) => {
          const on = Store.planDone(it.id);
          html +=
            '<li><label class="' + (on ? 'on' : '') + '"><input type="checkbox" data-plan="' + it.id + '"' + (on ? ' checked' : '') + '>' +
            '<span>' + MD.inline(it.text) + (it.link ? ' <a href="' + it.link + '">→ 相关课程</a>' : '') + '</span></label></li>';
        });
        html += '</ul>' + (w.say ? '<div class="say">完成后你能说：「' + h(w.say) + '」</div>' : '') + '</div>';
      });
      html += '</section>';
    });
    html += '<div class="btn-row"><button class="btn danger" type="button" id="resetPlan">清空计划打卡</button></div>';
    return {
      title: '12 周计划',
      html,
      nav: 'plan',
      after(root) {
        root.addEventListener('change', (e) => {
          const cb = e.target.closest('input[data-plan]');
          if (!cb) return;
          Store.setPlan(cb.dataset.plan, cb.checked);
          cb.closest('label').classList.toggle('on', cb.checked);
          const week = cb.closest('.week');
          const boxes = week.querySelectorAll('input[data-plan]');
          const wd = [...boxes].filter((b) => b.checked).length;
          const badge = week.querySelector('.week-head .badge');
          badge.textContent = wd + '/' + boxes.length;
          badge.classList.toggle('ok', wd === boxes.length);
          const all = planItems();
          const d = all.filter((it) => Store.planDone(it.id)).length;
          root.querySelector('#planCount').textContent = d + '/' + all.length;
          root.querySelector('.progress > i').style.width = Math.round((d / all.length) * 100) + '%';
        });
        root.querySelector('#resetPlan').addEventListener('click', () => {
          if (confirm('确定清空 12 周计划的全部打卡？')) { Store.reset('plan'); window.dispatchEvent(new HashChangeEvent('hashchange')); }
        });
      },
    };
  });

  /* ---------- 术语表 ---------- */
  App.route(/^\/glossary$/, () => {
    const items = SITE.glossary;
    const html =
      '<h1 class="page-title">术语表：AI / 机器人词汇 ↔ 嵌入式对照</h1>' +
      '<div class="search-box">' + icon('search') + '<input class="input" id="glq" type="search" placeholder="过滤术语，例如 chunk、量化、PTP"></div>' +
      '<div class="card" id="glList">' +
      items.map((g, i) =>
        '<div class="gl-item" data-i="' + i + '"><b>' + h(g.term) + '</b>' + (g.en ? '<span class="en">' + h(g.en) + '</span>' : '') +
        '<p>' + MD.inline(g.plain) + '</p>' + (g.analogy ? '<p class="an">嵌入式类比：' + MD.inline(g.analogy) + '</p>' : '') +
        (g.link ? '<p class="small"><a href="' + g.link + '">→ 相关课程</a></p>' : '') + '</div>').join('') + '</div>';
    return {
      title: '术语表',
      html,
      nav: 'glossary',
      after(root) {
        const input = root.querySelector('#glq');
        input.addEventListener('input', () => {
          const q = input.value.trim().toLowerCase();
          root.querySelectorAll('.gl-item').forEach((el) => {
            const g = items[+el.dataset.i];
            const text = (g.term + ' ' + (g.en || '') + ' ' + g.plain + ' ' + (g.analogy || '')).toLowerCase();
            el.hidden = q && text.indexOf(q) === -1;
          });
        });
      },
    };
  });

  /* ---------- 搜索 ---------- */
  let index = null;
  function buildIndex() {
    index = [];
    for (const l of SITE.lessons) {
      const text = [
        l.title, (l.goals || []).join(' '), MD.plain(l.body), MD.plain(l.tasks), MD.plain(l.hangzhou),
        l.interview.map((c) => c.q + ' ' + MD.plain(c.a)).join(' '),
        l.quiz.map((q) => q.q + ' ' + q.options.join(' ') + ' ' + (q.explain || '')).join(' '),
      ].join(' ');
      index.push({ title: l.title, sub: l.level + ' ' + App.level(l.level).title, href: App.lessonUrl(l.id), text });
    }
    if (SITE.hangzhou) {
      for (const c of SITE.hangzhou.companies) {
        index.push({ title: c.name, sub: '杭州公司与岗位地图', href: '#/hangzhou', text: [c.name, c.oneLine, MD.plain(c.facts), MD.plain(c.check), MD.plain(c.roles), MD.plain(c.scenario), MD.plain(c.angle)].join(' ') });
      }
    }
    for (const g of SITE.glossary) index.push({ title: g.term, sub: '术语表', href: '#/glossary', text: [g.term, g.en, g.plain, g.analogy].join(' ') });
  }

  function snippet(text, terms) {
    const low = text.toLowerCase();
    let pos = low.indexOf(terms[0]);
    if (pos < 0) pos = 0;
    const start = Math.max(0, pos - 30);
    let s = (start > 0 ? '…' : '') + text.slice(start, pos + 70) + (pos + 70 < text.length ? '…' : '');
    s = h(s);
    for (const t of terms) {
      if (!t) continue;
      const re = new RegExp(h(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      s = s.replace(re, (x) => '<mark>' + x + '</mark>');
    }
    return s;
  }

  App.route(/^\/search$/, (_, params) => {
    const q = (params.get('q') || '').trim();
    const html =
      '<h1 class="page-title">全站搜索</h1>' +
      '<form class="search-box" id="sform" role="search">' + icon('search') +
      '<input class="input" name="q" type="search" value="' + h(q) + '" placeholder="例如：rollout、量化、宇树、p99、时钟同步" autocomplete="off"></form>' +
      '<div id="sres"></div>';
    return {
      title: '搜索',
      html,
      nav: 'search',
      after(root) {
        const form = root.querySelector('#sform');
        const input = form.q;
        const out = root.querySelector('#sres');
        const run = () => {
          const query = input.value.trim().toLowerCase();
          if (!query) { out.innerHTML = '<p class="muted">输入关键词，课程正文、命令、面试题、公司和术语都会被搜索。</p>'; return; }
          if (!index) buildIndex();
          const terms = query.split(/\s+/);
          const hits = index.filter((it) => {
            const t = (it.title + ' ' + it.text).toLowerCase();
            return terms.every((x) => t.indexOf(x) !== -1);
          });
          hits.sort((a, b) => (b.title.toLowerCase().indexOf(terms[0]) !== -1) - (a.title.toLowerCase().indexOf(terms[0]) !== -1));
          out.innerHTML =
            '<p class="small muted">找到 ' + hits.length + ' 条结果</p><div class="card">' +
            (hits.map((it) => '<a class="result-item" href="' + it.href + '"><b>' + h(it.title) + '</b><span class="small muted">' + h(it.sub) + '</span><p>' + snippet(it.text, terms) + '</p></a>').join('') ||
              '<div class="empty">没有找到，换个关键词试试。</div>') + '</div>';
        };
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          history.replaceState(null, '', '#/search?q=' + encodeURIComponent(input.value.trim()));
          run();
        });
        let t;
        input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, 200); });
        run();
        if (!q) input.focus();
      },
    };
  });

  /* ---------- 设置 ---------- */
  App.route(/^\/settings$/, () => {
    const theme = Store.state.theme || 'auto';
    let html =
      '<h1 class="page-title">设置、备份与重置</h1>' +
      (Store.available ? '' : '<div class="callout warn"><div class="co-body">当前浏览器禁止了本地存储（可能是隐私模式），进度刷新后不会保留。</div></div>') +
      '<div class="card"><b>外观</b><p class="small muted">默认跟随系统深浅色。</p><div class="seg" id="themeSeg">' +
      [['auto', '跟随系统'], ['light', '浅色'], ['dark', '深色']].map(([v, t]) => '<button type="button" data-v="' + v + '"' + (v === theme ? ' class="on"' : '') + '>' + t + '</button>').join('') +
      '</div></div>' +
      '<div class="card" style="margin-top:12px"><b>备份 / 在手机和电脑之间同步进度</b>' +
      '<p class="small muted">进度只存在当前浏览器里。手机和电脑各有一份：在一端点「生成进度码」，复制后到另一端粘贴「导入」。</p>' +
      '<div class="btn-row"><button class="btn" type="button" id="expBtn">生成进度码并复制</button></div>' +
      '<textarea class="input" id="codeBox" placeholder="把进度码粘贴到这里，然后点导入"></textarea>' +
      '<div class="btn-row"><button class="btn" type="button" id="impBtn">导入进度码</button></div></div>' +
      '<div class="card" style="margin-top:12px"><b>重置</b><p class="small muted">按需清空某一类记录，或全部清空。</p><div class="btn-row">' +
      Object.entries(Store.PARTS).map(([k, v]) => '<button class="btn small danger" type="button" data-reset="' + k + '">清空' + v + '</button>').join('') +
      '<button class="btn danger" type="button" data-reset="__all">全部重置</button></div></div>' +
      '<div class="card prose" style="margin-top:12px">' + R(SITE.about || '') + '</div>';
    return {
      title: '设置',
      html,
      nav: 'settings',
      after(root) {
        root.querySelector('#themeSeg').addEventListener('click', (e) => {
          const b = e.target.closest('button');
          if (!b) return;
          Store.setTheme(b.dataset.v);
          App.applyTheme();
          root.querySelectorAll('#themeSeg button').forEach((x) => x.classList.toggle('on', x === b));
        });
        root.querySelector('#expBtn').addEventListener('click', () => {
          const code = Store.exportCode();
          root.querySelector('#codeBox').value = code;
          App.copy(code).then((ok) => App.toast(ok ? '进度码已复制' : '已生成，请手动全选复制'));
        });
        root.querySelector('#impBtn').addEventListener('click', () => {
          const v = root.querySelector('#codeBox').value;
          if (!v.trim()) { App.toast('先粘贴进度码'); return; }
          try {
            Store.importCode(v);
            App.applyTheme();
            App.toast('导入成功');
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          } catch (err) {
            App.toast('导入失败：进度码不完整或格式不对');
          }
        });
        root.querySelectorAll('[data-reset]').forEach((b) =>
          b.addEventListener('click', () => {
            const k = b.dataset.reset;
            const label = k === '__all' ? '全部记录' : Store.PARTS[k];
            if (!confirm('确定清空' + label + '？此操作不能撤销。')) return;
            Store.reset(k === '__all' ? null : k);
            App.applyTheme();
            App.toast('已清空' + label);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }));
      },
    };
  });
})();
