/* 工具箱：实时预算计算器、成功率置信区间、JD 关键词统计、涨幅与 offer 现金对比 */
(function () {
  'use strict';

  const { h, icon } = App;
  const fmt = (x, d) => (isFinite(x) ? Number(x).toFixed(d == null ? 1 : d) : '—');

  /* ======================= 工具箱首页 ======================= */
  const TOOLS = [
    ['#/tools/budget', 'gauge', '实时预算计算器', '控制频率 + 推理延迟 + chunk 步数 → 会不会顿、多久顿一次、怎么改。默认值是本机实测的 1080p 场景。'],
    ['#/tools/success', 'chart', '成功率置信区间', '20 次里成功 14 次，真实成功率可能是多少？两个方案的差距是真的吗？'],
    ['#/tools/jd', 'search', 'JD 关键词统计', '粘贴 5–10 份 JD，统计高频词，看哪些是你的强项、哪些要补。'],
    ['#/tools/offer', 'tools', '涨幅与 offer 现金对比', '按涨幅逻辑算目标区间，把不同 offer 的现金部分放在一起比。'],
  ];

  App.route(/^\/tools$/, () => {
    const html =
      '<h1 class="page-title">工具箱</h1><p class="muted">所有输入都保存在本机浏览器，可在「设置」里清空。</p><div class="grid">' +
      TOOLS.map(([href, ic, t, d]) => '<a class="card tool-card" href="' + href + '">' + icon(ic) + '<div><b>' + t + '</b><span>' + d + '</span></div></a>').join('') +
      '</div>';
    return { title: '工具箱', html, nav: 'tools' };
  });

  /* ======================= 实时预算计算器 ======================= */
  const PRESETS = [
    { label: 'Mac GPU 216×384', p50: 12.2, p99: 15.9 },
    { label: 'Mac GPU 480×640', p50: 23.6, p99: 24.6 },
    { label: 'Mac GPU 1080p', p50: 174.2, p99: 175.9 },
    { label: 'CPU 216×384', p50: 19.7, p99: 20.7 },
    { label: 'CPU 480×640', p50: 55.1, p99: 56.0 },
    { label: 'CPU 1080p', p50: 404.5, p99: 440.4 },
  ];
  const DEFAULTS = { f: 30, L: 174.2, n: 100, mode: 'sync', other: 0, p99: false };

  /* 纯函数：输入 → 指标。同步模式按 LeRobot 默认控制循环建模：每个 tick 时长 = max(T, 本 tick 工作量) */
  function analyze(v) {
    const T = 1000 / v.f;
    const L = v.L;
    const n = Math.max(1, Math.round(v.n));
    const r = { T, L, n, ratio: L / T, mode: v.mode };
    r.reaction = n * T + L + (v.other || 0);
    r.stale = Math.ceil(L / T);
    if (v.mode === 'sync') {
      r.missed = L > T ? Math.floor(L / T) : 0;
      if (n === 1) {
        r.kind = L > T ? 'slow' : 'ok';
        r.effHz = 1000 / Math.max(T, L);
        r.stallMs = 0;
        r.every = null;
        r.stallFrac = L > T ? 1 - T / L : 0;
      } else {
        r.kind = L > T ? 'stall' : 'jitter';
        r.stallMs = L > T ? L : 0;
        r.every = n * T;
        r.cycle = (n - 1) * T + Math.max(T, L);
        r.stallFrac = L > T ? L / (n * T + L) : 0;
        r.effHz = (n / r.cycle) * 1000;
      }
    } else {
      const budget = n * T;
      r.missed = 0;
      if (L > budget) {
        r.kind = 'underrun';
        r.stallMs = L - budget;
        r.every = budget;
        r.cycle = L;
        r.stallFrac = r.stallMs / L;
        r.missed = Math.floor(r.stallMs / T);
      } else {
        r.kind = 'ok';
        r.stallMs = 0;
        r.every = null;
        r.stallFrac = 0;
        r.margin = budget - L;
      }
      r.effHz = r.kind === 'ok' ? v.f : (n / r.cycle) * 1000;
    }
    return r;
  }

  function advice(v, r) {
    const out = [];
    const T = r.T;
    if (v.mode === 'sync') {
      if (r.kind === 'stall') {
        out.push(['bad', '同步推理 + 推理比控制周期长：每用完一个动作块，控制回路就停下来等 ' + fmt(r.L) + ' ms（错过约 ' + r.missed + ' 帧）。这就是音频里的 buffer underrun，真机上表现为「每 ' + fmt(r.every / 1000, 2) + ' 秒顿一下」。']);
        out.push(['info', '首选改法：改成异步推理（一边执行一边算下一块，相当于双缓冲）。新版 LeRobot 用 `lerobot-rollout --inference.type=rtc`，或 `async_inference` 的 policy server + robot client。切到上面的「异步」看效果。']);
      }
      if (r.kind === 'slow') {
        out.push(['bad', '每帧都推理（n=1）但单次推理 ' + fmt(r.L) + ' ms > 周期 ' + fmt(T) + ' ms：控制频率被拖到约 ' + fmt(r.effHz) + ' Hz，整体变慢变卡。temporal ensembling 要求 p99 推理 < ' + fmt(T) + ' ms。']);
      }
      if (r.kind === 'jitter' && v.n > 1) {
        out.push(['ok', '推理能在一个控制周期内完成，不会顿。注意推理那一帧会晚发 ' + fmt(r.L) + ' ms，等于周期性抖动；周期余量 ' + fmt(T - r.L) + ' ms。']);
      }
      if (r.kind === 'ok') out.push(['ok', '每帧推理也赶得上：余量 ' + fmt(T - r.L) + ' ms。记得用 p99 而不是 p50 校核，并留出相机采集和总线通信的时间。']);
    } else {
      if (r.kind === 'underrun') {
        out.push(['bad', '异步也来不及：动作块只够执行 ' + fmt(r.n * T) + ' ms，推理却要 ' + fmt(r.L) + ' ms，每次还是会断流 ' + fmt(r.stallMs) + ' ms。增大执行步数 n，或者把推理降到 ' + fmt(r.n * T) + ' ms 以内。']);
      } else {
        out.push(['ok', '异步推理赶得上：执行一个块需要 ' + fmt(r.n * T) + ' ms，推理 ' + fmt(r.L) + ' ms，余量 ' + fmt(r.margin) + ' ms，不会顿。']);
      }
      out.push(['warn', '新块算出来时已经过去约 ' + r.stale + ' 步（' + fmt(r.L) + ' ms）：块里前 ' + r.stale + ' 步对应的是过去的时刻，要丢掉或和旧块平滑衔接，否则衔接处会「抖」。RTC（Real-Time Chunking）就是做这件事的。']);
    }
    if (r.L > T && v.L >= 100) {
      out.push(['info', '降分辨率是最直接的降延迟手段：本机实测 Mac GPU 上 1080p 是 174.2 ms，480×640 只要 23.6 ms（训练、采集、推理三处分辨率必须一致）。其次是量化、换更快的硬件。']);
    }
    if (v.n >= 50) {
      out.push(['warn', '执行步数 n=' + v.n + '：最坏情况下场景变了要 ' + fmt(r.reaction / 1000, 2) + ' 秒后才有反应（「闭眼执行」），而且块切换处容易跳变。实测 chunk100 最大单帧跳变 72.05，是人类示教（5.44）的 13 倍；chunk10 是 42.04，ensemble 是 2.78。']);
    } else if (v.n > 1 && v.n <= 10 && v.mode === 'sync' && r.L > T) {
      out.push(['warn', 'n 小、推理又慢：顿的频率更高（每 ' + fmt(r.every / 1000, 2) + ' 秒一次），停顿时间占比 ' + fmt(r.stallFrac * 100, 0) + '%。小 n 必须配合快推理或异步。']);
    }
    if (!v.p99) out.push(['info', '你现在用的是 p50（中位数）。实时系统要按最坏情况设计：勾选「用 p99」再看一遍，并把相机、总线延迟加进「其他链路延迟」。']);
    return out;
  }

  function timeline(v, r) {
    const T = r.T;
    const segs = [];
    let window;
    if (v.mode === 'sync' && r.n === 1) {
      window = Math.max(1500, Math.min(6000, 20 * Math.max(T, r.L)));
      let t = 0;
      while (t < window && segs.length < 400) {
        if (r.L > T) { segs.push(['infer', r.L - T]); segs.push(['run', T]); t += r.L; }
        else { segs.push(['run', T]); t += T; }
      }
    } else if (v.mode === 'sync') {
      const cycle = r.n * T + (r.L > T ? r.L : 0);
      window = Math.max(2000, Math.min(60000, 2.3 * cycle));
      let t = 0;
      while (t < window && segs.length < 400) {
        if (r.L > T) { segs.push(['stall', r.L]); t += r.L; }
        else { segs.push(['infer', Math.max(r.L, window / 400)]); t += r.L; }
        segs.push(['run', r.n * T]);
        t += r.n * T;
      }
    } else {
      const cycle = Math.max(r.n * T, r.L);
      window = Math.max(2000, Math.min(60000, 2.3 * cycle));
      let t = 0;
      if (r.L > 0) { segs.push(['stall', r.L]); t += r.L; }
      while (t < window && segs.length < 400) {
        segs.push(['run', r.n * T]);
        t += r.n * T;
        if (r.kind === 'underrun') { segs.push(['stall', r.stallMs]); t += r.stallMs; }
        else { segs.push(['infer', Math.max(2, window / 300)]); }
      }
    }
    let used = 0;
    const html = segs.map(([k, ms]) => {
      if (used >= window) return '';
      const w = Math.min(ms, window - used);
      used += w;
      return '<i class="' + k + '" style="flex:0 0 ' + ((w / window) * 100).toFixed(3) + '%"></i>';
    }).join('');
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((x) => '<span>' + fmt((x * window) / 1000, window < 3000 ? 2 : 1) + 's</span>').join('');
    return (
      '<div class="timeline"><div class="tl-bar" aria-label="控制回路时间线">' + html + '</div><div class="tl-axis">' + ticks + '</div>' +
      '<div class="tl-legend"><span><i style="background:color-mix(in srgb,var(--ok) 70%,transparent)"></i>正常执行动作</span>' +
      '<span><i style="background:var(--bad)"></i>等推理（机械臂停住）</span>' +
      '<span><i style="background:color-mix(in srgb,var(--accent) 80%,transparent)"></i>推理（不卡回路 / 降频）</span></div></div>'
    );
  }

  App.route(/^\/tools\/budget$/, () => {
    const v = Object.assign({}, DEFAULTS, Store.state.budget || {});
    const html =
      '<div class="crumbs"><a href="#/tools">工具箱</a><span>/</span><span>实时预算计算器</span></div>' +
      '<h1 class="page-title">实时预算计算器</h1>' +
      '<p class="muted">把机器人推理当成实时系统来算：控制周期是 deadline，推理延迟是任务执行时间，动作队列是 DMA buffer。默认值是本机实测「飞书教程 Mac 命令：1080p 相机 + 同步推理 + chunk100」。</p>' +
      '<div class="card"><div class="form-grid">' +
      field('f', '控制频率（Hz）', v.f, '30Hz → 每 33.3 ms 下发一次动作（教程和本 lab 都是 30Hz）', 1, 2000, 1) +
      field('L', '单次推理延迟（ms）', v.L, '一次输出整个动作块的时间。点下面的实测值快速填入', 0.1, 5000, 0.1) +
      field('n', '每次推理后执行的步数 n', v.n, 'ACT 一次输出 100 步。n=100 是 LeRobot 默认，n=1 即每帧推理（temporal ensembling）', 1, 1000, 1) +
      field('other', '其他链路延迟（ms，可选）', v.other, '相机曝光与传输、串口总线、舵机响应。本 lab 的延迟数据不含这部分，真机要加上（见 L5-4）', 0, 5000, 1) +
      '</div>' +
      '<div class="field" style="margin-top:12px"><label>本机实测推理延迟（ACT，' + (v.p99 ? 'p99' : 'p50') + '）</label><div class="chips" id="presets">' +
      PRESETS.map((p, i) => '<button type="button" class="chip" data-preset="' + i + '">' + h(p.label) + ' · ' + (v.p99 ? p.p99 : p.p50) + '</button>').join('') +
      '</div><label class="check-row"><input type="checkbox" id="p99"' + (v.p99 ? ' checked' : '') + '>用 p99（最坏 1%）而不是 p50</label></div>' +
      '<div class="field" style="margin-top:6px"><label>推理方式</label><div class="seg" id="modeSeg">' +
      '<button type="button" data-mode="sync"' + (v.mode === 'sync' ? ' class="on"' : '') + '>同步（LeRobot 默认）</button>' +
      '<button type="button" data-mode="async"' + (v.mode === 'async' ? ' class="on"' : '') + '>异步 / RTC（双缓冲）</button></div></div>' +
      '<div class="chips"><button type="button" class="chip" data-n="100">n=100</button><button type="button" class="chip" data-n="25">n=25</button><button type="button" class="chip" data-n="10">n=10</button><button type="button" class="chip" data-n="1">n=1 每帧</button>' +
      '<button type="button" class="btn small" id="resetBudget">恢复实测默认值</button></div></div>' +
      '<div id="budgetOut"></div>' +
      '<div class="card prose" style="margin-top:14px">' + MD.render(EXPLAIN) + '</div>';

    return {
      title: '实时预算计算器',
      html,
      nav: 'tools',
      after(root) {
        const get = () => ({
          f: Math.max(1, +root.querySelector('#f').value || DEFAULTS.f),
          L: Math.max(0, +root.querySelector('#L').value),
          n: Math.max(1, Math.round(+root.querySelector('#n').value || 1)),
          other: Math.max(0, +root.querySelector('#other').value || 0),
          mode: root.querySelector('#modeSeg .on').dataset.mode,
          p99: root.querySelector('#p99').checked,
        });
        const paint = () => {
          const val = get();
          Store.setBudget(val);
          const r = analyze(val);
          root.querySelector('#budgetOut').innerHTML = renderResult(val, r);
        };
        root.addEventListener('input', (e) => { if (e.target.matches('input[type=number]')) paint(); });
        root.querySelector('#p99').addEventListener('change', () => {
          const p99 = root.querySelector('#p99').checked;
          root.querySelectorAll('[data-preset]').forEach((b) => {
            const p = PRESETS[+b.dataset.preset];
            b.textContent = p.label + ' · ' + (p99 ? p.p99 : p.p50);
          });
          root.querySelector('#presets').previousElementSibling.textContent = '本机实测推理延迟（ACT，' + (p99 ? 'p99' : 'p50') + '）';
          const curL = +root.querySelector('#L').value;
          const match = PRESETS.find((p) => p.p50 === curL || p.p99 === curL);
          if (match) root.querySelector('#L').value = p99 ? match.p99 : match.p50;
          paint();
        });
        root.addEventListener('click', (e) => {
          const pre = e.target.closest('[data-preset]');
          if (pre) {
            const p = PRESETS[+pre.dataset.preset];
            root.querySelector('#L').value = root.querySelector('#p99').checked ? p.p99 : p.p50;
            paint();
            return;
          }
          const nb = e.target.closest('[data-n]');
          if (nb) { root.querySelector('#n').value = nb.dataset.n; paint(); return; }
          const mb = e.target.closest('[data-mode]');
          if (mb) {
            root.querySelectorAll('#modeSeg button').forEach((b) => b.classList.toggle('on', b === mb));
            paint();
            return;
          }
          if (e.target.closest('#resetBudget')) {
            Store.setBudget(null);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }
        });
        paint();
      },
    };
  });

  function field(id, label, value, hint, min, max, step) {
    return (
      '<div class="field"><label for="' + id + '">' + label + '</label>' +
      '<input type="number" inputmode="decimal" id="' + id + '" value="' + value + '" min="' + min + '" max="' + max + '" step="' + step + '">' +
      '<div class="hint">' + h(hint) + '</div></div>'
    );
  }

  function result(cls, big, label) {
    return '<div class="result ' + cls + '"><b>' + big + '</b><span>' + label + '</span></div>';
  }

  function renderResult(v, r) {
    let everyText, everyCls;
    if (r.kind === 'stall' || r.kind === 'underrun') { everyText = '每 ' + fmt(r.every / 1000, 2) + ' s'; everyCls = 'bad'; }
    else if (r.kind === 'slow') { everyText = '持续降频'; everyCls = 'bad'; }
    else { everyText = '不会顿'; everyCls = 'ok'; }
    const html =
      '<div class="section-title"><h2>结果</h2><span class="small muted">' + (v.mode === 'sync' ? '同步推理' : '异步 / RTC') + '</span></div>' +
      '<div class="results">' +
      result('', fmt(r.T) + ' ms', '控制周期 T = 1000 / ' + v.f + ' Hz') +
      result(r.ratio > 1 ? 'warn' : 'ok', fmt(r.ratio, 2) + ' 个周期', '一次推理占用的控制周期数（L / T）') +
      result(r.missed ? 'bad' : 'ok', r.missed + ' 帧', '每次推理会错过的控制帧') +
      result(everyCls, everyText, r.kind === 'slow' ? '每帧都在等推理' : '多久「顿」一次（每用完一个动作块）') +
      result(r.stallMs ? 'bad' : 'ok', r.kind === 'slow' ? fmt(r.effHz) + ' Hz' : fmt(r.stallMs, 0) + ' ms', r.kind === 'slow' ? '实际控制频率' : '每次停顿时长（机械臂停住）') +
      result(r.reaction > 1000 ? 'warn' : '', fmt(r.reaction / 1000, 2) + ' s', '最坏反应时间 ≈ n×T + L + 其他链路') +
      '</div>' +
      '<div class="card">' + '<b class="small">前几秒的控制回路时间线</b>' + timeline(v, r) +
      '<div class="small muted" style="margin-top:6px">停顿时间占比约 ' + fmt(r.stallFrac * 100, 1) + '%' + (v.mode === 'async' ? '；新块到达时已过时约 ' + r.stale + ' 步' : '') + '</div></div>' +
      '<div class="section-title"><h2>诊断与建议</h2></div><ul class="advice">' +
      advice(v, r).map(([c, t]) => '<li class="' + c + '">' + MD.inline(t) + '</li>').join('') + '</ul>';
    return html;
  }

  const EXPLAIN = md`
### 怎么算的
- **同步推理（LeRobot 默认）**：动作队列空了才推理，推理期间控制回路停住。推理 L 超过周期 T 时，机械臂停住约 L 毫秒、错过 ⌊L/T⌋ 帧；每用完 n 步（n×T 秒）发生一次。
- **异步 / RTC**：一边执行当前块一边算下一块。只要 L < n×T 就不会断流；但新块算出来时已经过去 ⌈L/T⌉ 步，需要丢弃或平滑衔接。
- **最坏反应时间**：场景刚变化时模型还在「闭眼」执行旧块，最多要等 n×T 才重新看一眼，再加上推理 L 和相机、总线等链路延迟。

### 本机实测（ACT，51.6M 参数，一次输出 100 步）
| 设备 | 输入分辨率 | p50 | p99 | 每帧推理（<33ms） | chunk10（<333ms） |
|---|---|---|---|---|---|
| Mac GPU | 216×384（lab 训练用） | 12.2 ms | 15.9 ms | 可以 | 可以 |
| Mac GPU | 480×640（教程 Ubuntu 命令） | 23.6 ms | 24.6 ms | 可以 | 可以 |
| Mac GPU | 1080×1920（教程 Mac 命令） | 174.2 ms | 175.9 ms | 不行 | 可以 |
| CPU | 216×384 | 19.7 ms | 20.7 ms | 可以 | 可以 |
| CPU | 480×640 | 55.1 ms | 56.0 ms | 不行 | 可以 |
| CPU | 1080×1920 | 404.5 ms | 440.4 ms | 不行 | 不行 |

> 这组数据不含相机采集、图像传输、舵机总线通信，真机要把整条链路加起来看。方法见 [L5-4 端到端延迟测量](#/lesson/l5-4)。

### 练习
1. 保持默认值，切到「异步 / RTC」，看「顿」消失了吗？新块过时几步？
2. 点「Mac GPU 480×640」，同步模式下还会顿吗？再把 n 改成 1。
3. 点「CPU 1080p」并勾选 p99，n=10，同步和异步分别是什么结果？面试时你会怎么讲？
`;

  /* ======================= 成功率置信区间 ======================= */
  function wilson(k, n, z) {
    if (!n) return [0, 0, 0];
    const p = k / n;
    const z2 = z * z;
    const den = 1 + z2 / n;
    const center = (p + z2 / (2 * n)) / den;
    const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / den;
    return [p, Math.max(0, center - half), Math.min(1, center + half)];
  }

  App.route(/^\/tools\/success$/, () => {
    const html =
      '<div class="crumbs"><a href="#/tools">工具箱</a><span>/</span><span>成功率置信区间</span></div>' +
      '<h1 class="page-title">成功率置信区间</h1>' +
      '<p class="muted">真机评测次数有限，「70%」可能只是运气。用 Wilson 区间估计真实成功率的 95% 范围，判断两个方案的差距是不是真的。售前和交付岗和客户约定验收标准时特别有用。</p>' +
      '<div class="card"><div class="form-grid">' +
      field('k1', '方案 A：成功次数', 14, '例如 ACT 握手 20 次成功 14 次', 0, 100000, 1) +
      field('n1', '方案 A：总试验次数', 20, '', 1, 100000, 1) +
      field('k2', '方案 B：成功次数', 18, '例如补采数据重训后', 0, 100000, 1) +
      field('n2', '方案 B：总试验次数', 20, '', 1, 100000, 1) +
      '</div></div><div id="sOut"></div>';
    return {
      title: '成功率置信区间',
      html,
      nav: 'tools',
      after(root) {
        const paint = () => {
          const k1 = +root.querySelector('#k1').value, n1 = +root.querySelector('#n1').value;
          const k2 = +root.querySelector('#k2').value, n2 = +root.querySelector('#n2').value;
          const a = wilson(Math.min(k1, n1), n1, 1.96);
          const b = wilson(Math.min(k2, n2), n2, 1.96);
          const overlap = a[2] >= b[1] && b[2] >= a[1];
          const pct = (x) => fmt(x * 100, 0) + '%';
          const bar = (r, color) =>
            '<div style="position:relative;height:24px;background:var(--surface-2);border-radius:6px;margin:6px 0">' +
            '<div style="position:absolute;left:' + r[1] * 100 + '%;width:' + Math.max(0.5, (r[2] - r[1]) * 100) + '%;top:5px;bottom:5px;background:' + color + ';border-radius:4px;opacity:.55"></div>' +
            '<div style="position:absolute;left:calc(' + r[0] * 100 + '% - 2px);width:4px;top:0;bottom:0;background:' + color + '"></div></div>';
          let need = '';
          if (overlap) {
            let m = Math.max(n1, n2);
            for (; m < 2000; m += 5) {
              const aa = wilson(Math.round(a[0] * m), m, 1.96), bb = wilson(Math.round(b[0] * m), m, 1.96);
              if (!(aa[2] >= bb[1] && bb[2] >= aa[1])) break;
            }
            need = a[0] === b[0] ? '两者点估计相同，无法区分。' : '如果成功率保持不变，每个方案大约要各测 ' + (m >= 2000 ? '2000 次以上' : m + ' 次') + '，区间才不重叠。';
          }
          root.querySelector('#sOut').innerHTML =
            '<div class="results">' +
            result('', pct(a[0]), '方案 A 点估计') + result('', pct(a[1]) + '–' + pct(a[2]), '方案 A 95% 区间') +
            result('', pct(b[0]), '方案 B 点估计') + result('', pct(b[1]) + '–' + pct(b[2]), '方案 B 95% 区间') +
            result(overlap ? 'warn' : 'ok', overlap ? '区间重叠' : '区间不重叠', overlap ? '差距可能只是运气' : '差距大概率是真的') + '</div>' +
            '<div class="card"><b class="small">A（青）与 B（紫）的 95% 区间，竖线为点估计</b>' + bar(a, 'var(--primary)') + bar(b, 'var(--hz)') +
            '<div class="tl-axis"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div></div>' +
            '<ul class="advice"><li class="' + (overlap ? 'warn' : 'ok') + '">' + (overlap ? '现在还不能说 B 比 A 好。' + need : 'B 和 A 的差距在统计上站得住，可以写进周报或给客户看。') + '</li>' +
            '<li class="info">和客户约定验收时：先固定试验协议（物体、初始位置、光照、次数、成功判据），再谈百分比。20 次试验得到 70%，真实值可能在约 48%–85% 之间。</li></ul>';
        };
        root.addEventListener('input', paint);
        paint();
      },
    };
  });

  /* ======================= JD 关键词统计 ======================= */
  const KEYWORDS = {
    '你的强项': ['嵌入式', 'RTOS', 'FreeRTOS', '实时', '多核', 'DMA', '驱动', '音频', '语音', 'DSP', '通信', '无线', '时钟同步', '时间同步', '低延迟', '延迟', 'SDK', '量产', '客户', '导入', '交付', '问题定位', '调试', '芯片', 'SoC', 'MCU', 'ARM', 'C/C++', 'C++'],
    '机器人技术': ['ROS', 'ROS2', 'Linux', 'Python', '运动控制', '控制', 'EtherCAT', 'CAN', 'SLAM', '导航', '视觉', '感知', '标定', '传感器', '机械臂', '人形', '四足', '灵巧手', '关节', '电机', '仿真', 'Isaac', 'MuJoCo', '强化学习', '模仿学习', 'VLA', '大模型', '具身', '数据采集', '数采', '遥操作', 'Jetson', 'Orin', 'NPU', '量化', 'TensorRT', 'ONNX', '部署', '推理', 'PyTorch', 'LeRobot'],
    '客户面能力': ['解决方案', '方案', '售前', '技术支持', 'FAE', 'POC', '演示', 'demo', '需求', '招投标', '投标', '项目', '项目管理', '培训', '文档', '沟通', '协调', '出差', '英语', '海外', '生态', '开发者', '合作伙伴', '产品', '规划'],
    '行业场景': ['工业', '制造', '电力', '巡检', '物流', '仓储', '教育', '科研', '医疗', '康复', '养老', '商业服务', '安防', '汽车', '3C'],
  };

  App.route(/^\/tools\/jd$/, () => {
    const html =
      '<div class="crumbs"><a href="#/tools">工具箱</a><span>/</span><span>JD 关键词统计</span></div>' +
      '<h1 class="page-title">JD 关键词统计</h1>' +
      '<p class="muted">把 5–10 份目标岗位 JD 的「岗位职责 + 任职要求」粘贴进来（文本只在本机处理，不会上传）。出现最多的词就是简历和面试要覆盖的内容。</p>' +
      '<textarea class="input" id="jdText" placeholder="粘贴 JD 文本…"></textarea>' +
      '<div class="btn-row"><button class="btn primary" type="button" id="jdRun">统计</button><button class="btn" type="button" id="jdDemo">填入示例</button></div>' +
      '<div id="jdOut"></div>';
    return {
      title: 'JD 关键词统计',
      html,
      nav: 'tools',
      after(root) {
        const ta = root.querySelector('#jdText');
        const run = () => {
          const text = ta.value;
          const low = text.toLowerCase();
          const rows = [];
          for (const [group, words] of Object.entries(KEYWORDS)) {
            for (const w of words) {
              const k = w.toLowerCase();
              let c = 0, i = 0;
              while ((i = low.indexOf(k, i)) !== -1) { c++; i += k.length; }
              if (c) rows.push({ w, c, group });
            }
          }
          rows.sort((a, b) => b.c - a.c);
          if (!rows.length) { root.querySelector('#jdOut').innerHTML = '<div class="empty">没有命中词表里的关键词。</div>'; return; }
          const max = rows[0].c;
          const top = rows.slice(0, 20);
          const strong = rows.filter((r) => r.group === '你的强项').length;
          root.querySelector('#jdOut').innerHTML =
            '<div class="section-title"><h2>Top ' + top.length + '</h2><span class="small muted">命中强项词 ' + strong + ' 个</span></div><div class="card">' +
            top.map((r) =>
              '<div style="display:flex;align-items:center;gap:10px;margin:6px 0"><span style="width:6.5em;flex:none;font-weight:600">' + h(r.w) + '</span>' +
              '<div style="flex:1;height:12px;background:var(--surface-2);border-radius:6px;overflow:hidden"><div style="height:100%;width:' + (r.c / max) * 100 + '%;background:' +
              (r.group === '你的强项' ? 'var(--ok)' : r.group === '客户面能力' ? 'var(--hz)' : 'var(--primary)') + '"></div></div>' +
              '<span class="small" style="width:2.5em;text-align:right">' + r.c + '</span></div>').join('') +
            '<div class="tl-legend"><span><i style="background:var(--ok)"></i>你的强项</span><span><i style="background:var(--primary)"></i>机器人技术</span><span><i style="background:var(--hz)"></i>客户面能力</span></div></div>' +
            '<ul class="advice"><li class="info">把 Top 10 里「机器人技术」类的词各对应到一课（用全站搜索），把「你的强项」类的词各配一个 STAR 故事（见 L7-3）。</li></ul>';
        };
        root.querySelector('#jdRun').addEventListener('click', run);
        root.querySelector('#jdDemo').addEventListener('click', () => {
          ta.value = DEMO_JD;
          run();
        });
      },
    };
  });

  const DEMO_JD =
    '【示例，非真实招聘】具身智能解决方案工程师（杭州）\n岗位职责：1. 负责机器人产品在工业、教育科研客户的售前技术方案、POC 演示和交付；2. 与客户沟通需求，输出解决方案文档；3. 协调研发团队解决现场问题，推动量产交付；4. 支持开发者生态和培训。\n' +
    '任职要求：1. 熟悉 Linux、ROS/ROS2、Python 或 C++；2. 了解机器人运动控制、视觉感知、遥操作与数据采集；3. 有嵌入式、通信或芯片 FAE 经验优先；4. 了解大模型、VLA、模仿学习，有 Jetson 部署经验优先；5. 沟通能力强，能接受出差。';

  /* ======================= 涨幅与 offer 现金对比 ======================= */
  App.route(/^\/tools\/offer$/, () => {
    const html =
      '<div class="crumbs"><a href="#/tools">工具箱</a><span>/</span><span>涨幅与 offer 现金对比</span></div>' +
      '<h1 class="page-title">涨幅与 offer 现金对比</h1>' +
      '<div class="callout warn"><div class="co-body">这是<strong>方法论计算器</strong>，不提供任何市场报价：当前总包和 offer A / B 的默认值都只是示例输入，请换成你自己的真实数字。真实行情去问至少三个做机器人方向的猎头。期权按 0 计入现金，单独评估。</div></div>' +
      '<div class="card"><div class="form-grid">' +
      field('cur', '当前年总包（万元，示例）', 25, '示例输入，请换成你自己的年总包（固定 + 年终 + 其他现金）', 0, 1000, 0.5) +
      field('lo', '目标涨幅下限（%）', 30, '常见谈判锚点是 30%–50%（见 L7-5）', 0, 300, 1) +
      field('hi', '目标涨幅上限（%）', 50, '', 0, 300, 1) +
      '</div></div><div id="oTarget"></div>' +
      '<div class="section-title"><h2>offer 现金对比</h2></div><div class="card"><div class="form-grid">' +
      field('a_m', 'offer A：月薪（万元）', 2.5, '示例输入，不是行情', 0, 100, 0.1) + field('a_n', 'offer A：发几个月', 14, '13 薪 / 14 薪 / 16 薪…', 12, 24, 1) +
      field('a_b', 'offer A：年终 / 提成目标（万元）', 3, '客户面岗位常有提成，问清考核方式和历史兑现率', 0, 500, 0.5) +
      field('b_m', 'offer B：月薪（万元）', 2.9, '示例输入，不是行情', 0, 100, 0.1) + field('b_n', 'offer B：发几个月', 13, '', 12, 24, 1) +
      field('b_b', 'offer B：年终 / 提成目标（万元）', 0, '', 0, 500, 0.5) +
      '</div></div><div id="oOut"></div>';
    return {
      title: '涨幅与 offer 现金对比',
      html,
      nav: 'tools',
      after(root) {
        const val = (id) => +root.querySelector('#' + id).value || 0;
        const paint = () => {
          const cur = val('cur');
          root.querySelector('#oTarget').innerHTML =
            '<div class="results">' + result('', fmt(cur * (1 + val('lo') / 100)) + ' 万', '涨 ' + val('lo') + '% 的目标总包') +
            result('', fmt(cur * (1 + val('hi') / 100)) + ' 万', '涨 ' + val('hi') + '% 的目标总包') + '</div>';
          const A = val('a_m') * val('a_n') + val('a_b');
          const B = val('b_m') * val('b_n') + val('b_b');
          const rate = (x) => (cur ? fmt(((x - cur) / cur) * 100, 0) + '%' : '—');
          root.querySelector('#oOut').innerHTML =
            '<div class="results">' + result(A >= cur * (1 + val('lo') / 100) ? 'ok' : 'warn', fmt(A) + ' 万', 'offer A 现金总包（涨幅 ' + rate(A) + '）') +
            result(B >= cur * (1 + val('lo') / 100) ? 'ok' : 'warn', fmt(B) + ' 万', 'offer B 现金总包（涨幅 ' + rate(B) + '）') + '</div>' +
            '<ul class="advice"><li class="info">现金只是一半。再比：职级（比 title 重要）、岗位能否接触客户和负责模块、团队所处阶段、期权五问（融资轮次、授予比例、行权价、成熟期、离职回购）。详见 <a href="#/lesson/l7-5">L7-5 谈薪方法论</a>。</li></ul>';
        };
        root.addEventListener('input', paint);
        paint();
      },
    };
  });

  App.analyzeBudget = analyze;
})();
