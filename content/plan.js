/* 12 周计划（来源：README.md「12 周计划」四个阶段，拆成每周可打勾的任务）。item.id 一旦发布不要改，否则打卡记录会丢 */
SITE.plan = {
  intro: md`
每周 8 到 10 小时。四个阶段：**概念 + Mac 实验 → 真机 → 训练 + 部署实验 → 求职**。每完成一项就打勾，进度保存在本机浏览器。

:::tip 人脉要从第 4 周就开始，不要等到第 9 周
加教程里的微信群和 QQ 群，参加黑客松或线下活动，在 LinkedIn 和脉脉上联系目标公司做解决方案或售前的人，请他们喝杯咖啡聊 20 分钟。**这是转行最大的杠杆。**
:::
`,
  phases: [
    {
      title: '阶段 1：概念 + Mac 实验（第 1–2 周）',
      goal: '跑完 lab 三个实验，读完 L0、L1，答出综合自测，下单 SO-101。',
      weeks: [
        {
          n: 1, title: '跑通三个实验',
          say: '我自己跑通过数据、训练、推理全流程，知道推理为什么会抖',
          items: [
            { id: 'w1-1', text: '读完 L0 三课，写下目标岗位和保底岗位', link: '#/level/L0' },
            { id: 'w1-2', text: '跑实验 1：读懂一条示教数据，看懂关节曲线', link: '#/lesson/l2-2' },
            { id: 'w1-3', text: '跑实验 2：在 Mac GPU 上训练 ACT，看懂 loss 曲线', link: '#/lesson/l2-3' },
            { id: 'w1-4', text: '跑实验 3：动作分块对比 + 推理延迟', link: '#/lesson/l2-4' },
            { id: 'w1-5', text: '在实时预算计算器里完成 3 道练习', link: '#/tools/budget' },
          ],
        },
        {
          n: 2, title: '概念打通 + 下单',
          say: '我能用嵌入式的语言讲清楚预训练、微调、部署和实时',
          items: [
            { id: 'w2-1', text: '读完 L1 七课，综合自测 10 题全对', link: '#/lesson/l1-7' },
            { id: 'w2-2', text: '看子豪兄 B 站的 LeRobot 视频，对照飞书教程目录', link: '#/lesson/l3-1' },
            { id: 'w2-3', text: '下单 SO-ARM101 套件 + 相机 + 支架', link: '#/lesson/l3-1' },
            { id: 'w2-4', text: '收集 10 份杭州 JD，用 JD 关键词统计找出 Top 10', link: '#/tools/jd' },
            { id: 'w2-5', text: '把 3 分钟 lab 演示脚本换成自己的话，录一遍', link: '#/lesson/l2-1' },
          ],
        },
      ],
    },
    {
      title: '阶段 2：真机（第 3–5 周）',
      goal: '飞书教程第一步到第七步：组装、校准、遥操作、采集 50 条自己的数据。',
      weeks: [
        {
          n: 3, title: '组装和环境',
          say: '',
          items: [
            { id: 'w3-1', text: '组装主从臂，配置 12 个舵机 ID，串口线贴标签', link: '#/lesson/l3-2' },
            { id: 'w3-2', text: '在 lab 环境里补装真机依赖，找到两个串口', link: '#/lesson/l3-2' },
            { id: 'w3-3', text: '完成主从臂校准，记下两只臂的 id', link: '#/lesson/l3-3' },
          ],
        },
        {
          n: 4, title: '遥操作、相机，开始人脉',
          say: '',
          items: [
            { id: 'w4-1', text: '遥操作 + 相机（640×480@30fps），写采集前健康检查清单', link: '#/lesson/l3-3' },
            { id: 'w4-2', text: '用手机慢动作测主从臂跟随延迟', link: '#/lesson/l3-3' },
            { id: 'w4-3', text: '加入教程微信群 / QQ 群，发出 3 条约咖啡的消息', link: '#/lesson/l7-6' },
          ],
        },
        {
          n: 5, title: '采集 50 条',
          say: '我从零搭过一套主从臂数采系统',
          items: [
            { id: 'w5-1', text: '用 lerobot-record 采集 50 条示教', link: '#/lesson/l3-4' },
            { id: 'w5-2', text: '跑数据质检脚本，剔除可疑示教', link: '#/lesson/l4-1' },
            { id: 'w5-3', text: '拍一段 30 秒采集视频放进作品集', link: '#/lesson/l7-2' },
          ],
        },
      ],
    },
    {
      title: '阶段 3：训练 + 部署实验（第 6–8 周）',
      goal: '训练 ACT 并真机推理、统计成功率；租云 GPU 训一次 SmolVLA；测真机端到端延迟；写一篇技术文章。',
      weeks: [
        {
          n: 6, title: 'ACT 真机推理',
          say: '',
          items: [
            { id: 'w6-1', text: '用 lerobot-train 训练自己的 ACT', link: '#/lesson/l3-5' },
            { id: 'w6-2', text: '用 lerobot-rollout 真机推理，录 30 秒视频', link: '#/lesson/l3-6' },
            { id: 'w6-3', text: '按评测协议握手 20 次，算成功率置信区间', link: '#/lesson/l4-5' },
          ],
        },
        {
          n: 7, title: 'SmolVLA + RTC',
          say: '',
          items: [
            { id: 'w7-1', text: '租云 GPU 微调一次 SmolVLA，记下花费和时长', link: '#/lesson/l4-4' },
            { id: 'w7-2', text: '真机上对比 sync 和 rtc 两种推理方式', link: '#/lesson/l5-2' },
            { id: 'w7-3', text: '读完 L5-3 边缘部署，准备 DSP 定点化的 STAR 故事', link: '#/lesson/l5-3' },
          ],
        },
        {
          n: 8, title: '延迟测量 + 技术文章',
          say: '我对比过 ACT 和 VLA，测过真机延迟链路，还写过分析文章',
          items: [
            { id: 'w8-1', text: '测真机端到端延迟，写一页延迟分析报告', link: '#/lesson/l5-4' },
            { id: 'w8-2', text: '发表技术文章《嵌入式工程师视角：机械臂推理为什么会抖》', link: '#/lesson/l7-2' },
            { id: 'w8-3', text: '读完 L6 的人形分层和数采系统设计', link: '#/lesson/l6-2' },
          ],
        },
      ],
    },
    {
      title: '阶段 4：求职（第 9–12 周）',
      goal: '改简历；投递路径 1 和路径 3；每周 3 到 5 场面试；每场复盘，持续更新面试卡片。',
      weeks: [
        {
          n: 9, title: '简历和故事',
          say: '',
          items: [
            { id: 'w9-1', text: '按路径 1 和路径 3 各写一版简历，每条带数字', link: '#/lesson/l7-2' },
            { id: 'w9-2', text: '写好 30 秒 / 2 分钟自我介绍和 5 个 STAR 故事', link: '#/lesson/l7-3' },
            { id: 'w9-3', text: '选 5 家目标公司，到官网和招聘页核实', link: '#/hangzhou' },
          ],
        },
        {
          n: 10, title: '投递 + 模拟面试',
          say: '',
          items: [
            { id: 'w10-1', text: '投递路径 1 和路径 3', link: '#/lesson/l0-3' },
            { id: 'w10-2', text: '14 道高频题逐题口述并录音', link: '#/lesson/l7-4' },
            { id: 'w10-3', text: '找朋友做一次 45 分钟模拟面试', link: '#/interview' },
          ],
        },
        {
          n: 11, title: '面试 + 复盘',
          say: '',
          items: [
            { id: 'w11-1', text: '完成 3–5 场面试，每场 24 小时内复盘', link: '#/lesson/l7-6' },
            { id: 'w11-2', text: '把复盘里的新问题补进面试卡片', link: '#/interview' },
            { id: 'w11-3', text: '读完 L6 剩余三课（仿真、语音、交付量产）', link: '#/lesson/l6-5' },
          ],
        },
        {
          n: 12, title: 'offer 比较和谈薪',
          say: '拿到 offer 并比较',
          items: [
            { id: 'w12-1', text: '问至少三个做机器人方向的猎头，记下来源和日期', link: '#/lesson/l7-5' },
            { id: 'w12-2', text: '用 offer 对比工具算现金部分，单独评估期权和职级', link: '#/tools/offer' },
            { id: 'w12-3', text: '谈薪并做决定', link: '#/lesson/l7-5' },
          ],
        },
      ],
    },
  ],
};
