/* 学习进度存储：全部放在本机浏览器 localStorage，可导出/导入进度码在手机和电脑之间同步 */
(function () {
  'use strict';

  const KEY = 'eai-study-v1';
  const PARTS = {
    done: '课程完成记录',
    quiz: '测验作答',
    cards: '面试卡片掌握状态',
    plan: '12 周计划打卡',
    tasks: '课内任务清单',
    budget: '计算器输入',
  };

  function defaults() {
    return { done: {}, quiz: {}, cards: {}, plan: {}, tasks: {}, budget: null, last: null, theme: 'auto' };
  }

  let state = defaults();
  let available = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(defaults(), JSON.parse(raw));
  } catch (e) {
    available = false;
  }

  const listeners = new Set();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      available = false;
    }
    listeners.forEach((fn) => fn(state));
  }

  window.Store = {
    PARTS,
    get available() { return available; },
    get state() { return state; },
    onChange(fn) { listeners.add(fn); },

    isDone: (id) => !!state.done[id],
    setDone(id, on) {
      if (on) state.done[id] = Date.now();
      else delete state.done[id];
      save();
    },

    quizAnswer: (lessonId, qi) => (state.quiz[lessonId] || {})[qi],
    setQuizAnswer(lessonId, qi, opt) {
      (state.quiz[lessonId] = state.quiz[lessonId] || {})[qi] = opt;
      save();
    },
    resetQuiz(lessonId) {
      delete state.quiz[lessonId];
      save();
    },

    isMastered: (id) => !!state.cards[id],
    setMastered(id, on) {
      if (on) state.cards[id] = 1;
      else delete state.cards[id];
      save();
    },

    planDone: (id) => !!state.plan[id],
    setPlan(id, on) {
      if (on) state.plan[id] = 1;
      else delete state.plan[id];
      save();
    },

    taskDone: (id) => state.tasks[id],
    setTask(id, on) {
      state.tasks[id] = on ? 1 : 0;
      save();
    },

    setBudget(v) { state.budget = v; save(); },
    setLast(id) { state.last = id; save(); },
    setTheme(t) { state.theme = t; save(); },

    reset(part) {
      if (!part) state = defaults();
      else state[part] = defaults()[part];
      save();
    },

    exportCode() {
      return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    },
    importCode(code) {
      const obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if (!obj || typeof obj !== 'object' || !obj.done) throw new Error('进度码格式不对');
      state = Object.assign(defaults(), obj);
      save();
    },
  };
})();
