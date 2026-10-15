/*
 * 课程注册表。内容文件（content/*.js）只负责调用 SITE.level() / SITE.lesson() 注册数据，
 * 页面渲染全部在 js/ 下完成。新增一课：在对应 level 文件里加一个 SITE.lesson({...}) 即可。
 *
 * 正文用 md`...` 书写 Markdown（语法见 js/md.js 顶部注释）：
 *   - 代码块请用 ~~~ 围起来（模板字符串里不方便写三个反引号）
 *   - 行内代码写成 \`code\`，美元符号花括号写成 \${VAR}
 *   - md 标签按原样保留反斜杠，所以 shell 续行符 \ 可以直接写
 */
(function () {
  'use strict';

  const SITE = (window.SITE = {
    title: '具身智能转型学习站',
    version: '2026-10-15a',
    verified: '2026-10',
    levels: [],
    lessons: [],
    byId: {},
    hangzhou: null,
    plan: null,
    glossary: [],
  });

  window.md = function (strings) {
    return strings.raw.join('').replace(/\\`/g, '`').replace(/\\\$\{/g, '${');
  };

  SITE.level = function (lv) {
    lv.lessons = [];
    SITE.levels.push(lv);
  };

  SITE.lesson = function (lesson) {
    const lv = SITE.levels.find((x) => x.id === lesson.level);
    if (!lv) throw new Error('未知模块：' + lesson.level);
    if (SITE.byId[lesson.id]) throw new Error('课程 id 重复：' + lesson.id);
    lesson.quiz = lesson.quiz || [];
    lesson.interview = lesson.interview || [];
    lv.lessons.push(lesson);
    SITE.lessons.push(lesson);
    SITE.byId[lesson.id] = lesson;
  };
})();
