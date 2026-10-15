/* 9 个模块：L0–L7 从入门到求职，L8 起是专题。color 用于徽章和卡片左边框 */
SITE.level({
  id: 'L0', stage: '入门', color: '#0f766e',
  title: '行业认知与定位',
  short: '先想清楚去哪一层、为什么、凭什么',
  desc: '产业链、2026 年行业态势、岗位地图和三条入场路径。读完你会知道自己该瞄准什么岗位，算法要懂到什么程度。',
});
SITE.level({
  id: 'L1', stage: '基础', color: '#2563eb',
  title: '核心概念：用嵌入式类比看懂',
  short: '预训练、微调、训练环境、数据、推理',
  desc: '把「模型训练、部署、预训练环境」翻译成你熟悉的工具链、固件、DMA buffer、定点化移植。',
});
SITE.level({
  id: 'L2', stage: '动手', color: '#0891b2',
  title: 'Mac 动手实验',
  short: '不买硬件，跑通数据 → 训练 → 推理 → 延迟',
  desc: '在一台 Apple 芯片 Mac（M4，24GB）上实测跑通的三个实验，每张图都教你怎么读。',
});
SITE.level({
  id: 'L3', stage: '实战', color: '#ea580c',
  title: '真机 SO-101：飞书教程逐章',
  short: '组装、校准、遥操作、采集、训练、推理 + 版本坑',
  desc: '对照同济子豪兄《LeRobot 具身智能》飞书教程，每章告诉你做不做、重点在哪、新版 LeRobot 哪里会报错。',
});
SITE.level({
  id: 'L4', stage: '进阶', color: '#9333ea',
  title: '训练进阶',
  short: '数据质量、读曲线、VLA 微调、云 GPU、评估',
  desc: '从「能训出来」到「能向客户解释为什么只有 70%、怎么提到 90%」。',
});
SITE.level({
  id: 'L5', stage: '精通', color: '#dc2626',
  title: '部署与实时',
  short: '动作分块、异步 / RTC、边缘量化、端到端延迟',
  desc: '你的主场：把推理当成实时系统来分析，这是你和算法背景候选人拉开差距的地方。',
});
SITE.level({
  id: 'L6', stage: '精通', color: '#4f46e5',
  title: '系统与架构',
  short: '人形分层、数采系统、仿真、语音、交付量产',
  desc: '解决方案架构师要能画的几张图：大脑 / 小脑 / 关节、数采系统、sim2real、机器人语音、POC 到量产。',
});
SITE.level({
  id: 'L7', stage: '求职', color: '#7c3aed',
  title: '杭州求职实战',
  short: '岗位地图、简历、面试、谈薪、反问',
  desc: '以杭州为主、上海一小时高铁圈为辅：公司地图、一句话定位、STAR 故事、14 道高频题、谈薪方法论和反问清单。',
});
SITE.level({
  id: 'L8', stage: '专题', color: '#be185d',
  title: '专题：开源腿式小机器人（Microduck / 跳跳 / Open Duck Mini）',
  short: '自由度、仿真里强化学习、训练环境、算力、上真机、「在线训练」',
  desc: '把三个热门开源小机器人拆开讲：自由度怎么数、「训练环境开源」开了什么、要什么电脑、策略怎么上真机、「在线训练」指什么，外加 Mac 上实测 Open Duck Mini 的结果和杭州腿式机器人公司的求职视角。学完 L5 部署与实时之后看最顺，也可以单独看。',
});
