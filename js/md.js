/*
 * 极简 Markdown 渲染器（够用即可，无外部依赖）。
 * 支持：## 标题、段落（行内换行保留）、**粗体**、==高亮==、`代码`、[链接](url)、<https://...>
 *       - / 1. 列表（可嵌套、可 - [ ] 任务）、| 表格 |、~~~ 代码块（带复制按钮）、> 引用、--- 分割线
 *       ![说明](图片 "图注")（连续多张自动成组）、:::类型 标题 ... ::: 提示框
 * 提示框类型：tip / warn / analogy（嵌入式类比）/ data（实测数据）/ hz（杭州就业场景）/ info
 */
(function () {
  'use strict';

  const CALLOUT_TITLES = {
    tip: '提示',
    warn: '注意',
    analogy: '嵌入式类比',
    data: '实测数据',
    hz: '杭州就业场景',
    info: '说明',
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function inline(text) {
    const codes = [];
    let s = text.replace(/`([^`]+)`/g, (_, c) => {
      codes.push(c);
      return '\u0000' + (codes.length - 1) + '\u0000';
    });
    s = esc(s);
    s = s.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, (_, u) => link(u, u));
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => link(u, t));
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + esc(codes[+i]) + '</code>');
    return s;
  }

  function link(url, text) {
    const ext = /^https?:/.test(url) && url.indexOf(location.host || '\u0000') === -1;
    return '<a href="' + url + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + text + '</a>';
  }

  function dedent(src) {
    const lines = src.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
    let min = Infinity;
    for (const l of lines) {
      if (!l.trim()) continue;
      min = Math.min(min, l.match(/^ */)[0].length);
    }
    if (!isFinite(min) || min === 0) return lines.join('\n');
    return lines.map((l) => l.slice(min)).join('\n');
  }

  const RE = {
    fence: /^\s*(~~~|```)\s*([\w+.-]*)\s*(.*)$/,
    callout: /^:::(\w+)\s*(.*)$/,
    heading: /^(#{2,4})\s+(.*)$/,
    hr: /^-{3,}\s*$/,
    image: /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/,
    tableSep: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
    quote: /^>\s?/,
    item: /^(\s*)([-*]|\d+\.)\s+(.*)$/,
  };

  function isBlockStart(line, next) {
    return (
      RE.fence.test(line) ||
      RE.callout.test(line) ||
      RE.heading.test(line) ||
      RE.hr.test(line) ||
      RE.image.test(line) ||
      RE.quote.test(line) ||
      RE.item.test(line) ||
      (/^\s*\|/.test(line) && next !== undefined && RE.tableSep.test(next))
    );
  }

  function codeBlock(code, lang, title) {
    const label = title || lang || '';
    return (
      '<div class="code"><div class="code-bar"><span>' + esc(label) + '</span>' +
      '<button class="copy-btn" type="button" data-copy>复制</button></div>' +
      '<pre><code>' + esc(code) + '</code></pre></div>'
    );
  }

  function figure(src, alt, cap) {
    return (
      '<figure class="fig"><a href="' + esc(src) + '" target="_blank" rel="noopener" title="点击查看原图">' +
      '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async"></a>' +
      (cap ? '<figcaption>' + inline(cap) + '</figcaption>' : '') +
      '</figure>'
    );
  }

  function table(rows, sepRow) {
    const split = (r) => {
      let t = r.trim();
      if (t.startsWith('|')) t = t.slice(1);
      if (t.endsWith('|')) t = t.slice(0, -1);
      return t.split('|').map((c) => c.trim());
    };
    const aligns = split(sepRow).map((c) => (c.startsWith(':') && c.endsWith(':') ? 'c' : c.endsWith(':') ? 'r' : ''));
    const head = split(rows[0]);
    const cls = (i) => (aligns[i] ? ' class="' + aligns[i] + '"' : '');
    let html = '<div class="table-wrap' + (head.length >= 5 ? ' wide' : '') + '"><table><thead><tr>';
    head.forEach((c, i) => (html += '<th' + cls(i) + '>' + inline(c) + '</th>'));
    html += '</tr></thead><tbody>';
    for (const r of rows.slice(1)) {
      html += '<tr>';
      split(r).forEach((c, i) => (html += '<td' + cls(i) + '>' + inline(c) + '</td>'));
      html += '</tr>';
    }
    return html + '</tbody></table></div>';
  }

  function list(lines, start) {
    const first = lines[start].match(RE.item);
    const base = first[1].length;
    const ordered = /\d+\./.test(first[2]);
    const items = [];
    let i = start;
    while (i < lines.length) {
      const ln = lines[i];
      if (!ln.trim()) {
        const nx = lines[i + 1];
        const m = nx !== undefined && nx.match(RE.item);
        if (m && m[1].length === base) { i++; continue; }
        if (nx !== undefined && nx.trim() && nx.match(/^ */)[0].length > base && items.length) { items[items.length - 1].push(''); i++; continue; }
        break;
      }
      const m = ln.match(RE.item);
      const ind = ln.match(/^ */)[0].length;
      if (m && ind === base) { items.push([m[3]]); i++; continue; }
      if (ind > base && items.length) { items[items.length - 1].push(ln); i++; continue; }
      break;
    }
    const startNum = ordered ? parseInt(first[2], 10) : 1;
    let html = ordered ? '<ol' + (startNum !== 1 ? ' start="' + startNum + '"' : '') + '>' : '<ul>';
    for (const parts of items) {
      let head = parts[0];
      const rest = parts.slice(1).join('\n');
      const task = head.match(/^\[( |x)\]\s+(.*)$/i);
      if (task) {
        const key = 't' + hash(task[2]);
        html +=
          '<li class="task"><label class="task-label"><input type="checkbox" data-task="' + key + '"' +
          (task[1].toLowerCase() === 'x' ? ' data-default="1"' : '') + '><span>' + inline(task[2]) + '</span></label>' +
          (rest.trim() ? render(rest) : '') + '</li>';
        continue;
      }
      html += '<li>' + inline(head) + (rest.trim() ? render(rest) : '') + '</li>';
    }
    html += ordered ? '</ol>' : '</ul>';
    return { html, next: i };
  }

  function render(src) {
    if (!src) return '';
    const lines = dedent(src).split('\n');
    let html = '';
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      let m;

      if ((m = line.match(RE.fence))) {
        const fence = m[1];
        const buf = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith(fence)) buf.push(lines[i++]);
        i++;
        html += codeBlock(dedent(buf.join('\n')), m[2], m[3]);
        continue;
      }

      if ((m = line.match(RE.callout))) {
        const type = m[1];
        const title = m[2] || CALLOUT_TITLES[type] || '';
        const buf = [];
        i++;
        let inFence = false;
        while (i < lines.length) {
          const t = lines[i].trim();
          if (RE.fence.test(lines[i])) inFence = !inFence;
          if (!inFence && t === ':::') break;
          buf.push(lines[i++]);
        }
        i++;
        html +=
          '<div class="callout ' + esc(type) + '">' +
          (title ? '<div class="co-title">' + inline(title) + '</div>' : '') +
          '<div class="co-body">' + render(buf.join('\n')) + '</div></div>';
        continue;
      }

      if ((m = line.match(RE.heading))) {
        const lv = m[1].length;
        html += '<h' + lv + '>' + inline(m[2]) + '</h' + lv + '>';
        i++;
        continue;
      }

      if (RE.hr.test(line)) { html += '<hr>'; i++; continue; }

      if (RE.image.test(line)) {
        const figs = [];
        while (i < lines.length && (m = lines[i].match(RE.image))) { figs.push(figure(m[2], m[1], m[3])); i++; }
        html += figs.length > 1 ? '<div class="gallery">' + figs.join('') + '</div>' : figs[0];
        continue;
      }

      if (/^\s*\|/.test(line) && i + 1 < lines.length && RE.tableSep.test(lines[i + 1])) {
        const rows = [line];
        const sep = lines[i + 1];
        i += 2;
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
        html += table(rows, sep);
        continue;
      }

      if (RE.quote.test(line)) {
        const buf = [];
        while (i < lines.length && RE.quote.test(lines[i])) buf.push(lines[i++].replace(RE.quote, ''));
        html += '<blockquote>' + render(buf.join('\n')) + '</blockquote>';
        continue;
      }

      if (RE.item.test(line)) {
        const r = list(lines, i);
        html += r.html;
        i = r.next;
        continue;
      }

      const buf = [];
      while (i < lines.length && lines[i].trim() && !(buf.length && isBlockStart(lines[i], lines[i + 1]))) {
        buf.push(lines[i++].trim());
      }
      html += '<p>' + buf.map(inline).join('<br>') + '</p>';
    }
    return html;
  }

  /* 纯文本（用于搜索索引） */
  function plain(src) {
    if (!src) return '';
    return String(src)
      .replace(/^:::\w*\s*/gm, '')
      .replace(/^~~~.*$/gm, '')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*=`#>|]/g, ' ')
      .replace(/-{3,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  window.MD = { render, inline, esc, plain, hash };
})();
