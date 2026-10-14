/* L3 真机 SO-101：飞书教程逐章（来源：README.md 逐章建议与版本坑；命令参数已在本机 LeRobot 0.6.1 的 --help 中核对） */

SITE.lesson({
  id: 'l3-1', level: 'L3', minutes: 15,
  title: '教程总览 + 第零步：买买买',
  goals: [
    '知道飞书教程每一章做不做、重点在哪、面试价值是什么',
    '列出真机实验的采购清单和预算',
    '理解为什么真机视频是作品集里最直观的一项',
  ],
  body: md`
## 教程地址
同济子豪兄《LeRobot 具身智能》飞书知识库：<https://zihao-ai.feishu.cn/wiki/TS6swApHbinx01kHDi5cf5n5n8c>

## 逐章建议

| 章节 | 建议 | 重点 / 面试价值 | 本站对应 |
|---|---|---|---|
| 基础知识 | 读 | 建立名词印象，深入理解靠 L1 | [L1](#/level/L1) |
| 第零步：买买买 | **建议买** | SO-ARM101 套件是千元级，再加一个相机。真机视频是作品集里最直观的一项 | 本课 |
| 第一步：组装机械臂 | 做 | 舵机是飞特 STS3215 串行总线舵机，ID 配置和中位校准就像给总线设备分地址，你会很快 | [L3-2](#/lesson/l3-2) |
| 第二步：安装环境 | **只看 Mac 章节** | 可以直接用 \`lab/.venv\`，先补装硬件依赖 | [L3-2](#/lesson/l3-2) |
| 第三步到第六步：串口、校准、遥操作、摄像头 | 做，只看 Mac 章节 | 你的舒适区，快速过。遥操作时留意主从臂的跟随延迟 | [L3-3](#/lesson/l3-3) |
| 第七步：采集数据集（真机） | **重点做** | 采 50 条，注意动作一致性 | [L3-4](#/lesson/l3-4) |
| 第七步：LeIsaac 仿真遥操作 | 跳过 | 需要 NVIDIA 显卡，Mac 跑不了；知道仿真的用途即可 | [L6-3](#/lesson/l6-3) |
| 第八步：训练模型 | ACT 在 Mac 本地训；SmolVLA 租云 GPU 试一次 | 理解从零训练和微调的区别；云 GPU 一次几十元 | [L3-5](#/lesson/l3-5) |
| 第九步：模型推理 | **重点做**，并加一个延迟测量实验 | 这是你和算法背景的人拉开差距的地方 | [L3-6](#/lesson/l3-6) |
| DGX Spark / RDK S100 推理 | 读懂流程 | 面试讲边缘部署用，类比 DSP 定点化移植 | [L3-7](#/lesson/l3-7) |
| 蚂蚁灵波 LingBot-VLA 后训练 | 读，可选在云 GPU 上跑 | 理解「基座模型 + 后训练」，这是行业主流做法 | [L3-7](#/lesson/l3-7) |

## 第零步：采购清单和预算

| 项 | 大约花费 |
|---|---|
| SO-ARM101 套件（主动臂 + 从动臂，飞特 STS3215 舵机） | 千元级（以商家报价为准） |
| 俯拍相机 + 支架 | 一两百元 |
| 云 GPU | 每次训练几十元 |
| **合计** | **两三千元以内**，相对你的涨薪目标，投入产出比很高 |

:::tip 为什么值得买
Mac 上的 lab 能让你讲清原理，但**真机视频 + 真机延迟测量**才是作品集里最有说服力的两项：面试官一眼就能看到你真的做过。买之前先把 L2 的三个实验跑完。
:::

## 两套 LeRobot：官方版和矽递 fork
教程推荐矽递科技（Seeed）维护的 fork，本 lab 用的是官方版 0.6.1。截至本站核实时，矽递 fork 已同步到 0.6.2。两者在第七步采集上基本一致，但**第九步的推理命令都变了**，见 [L3-6](#/lesson/l3-6)。

## 人脉要从这时候开始
加教程里的微信群和 QQ 群；关注矽递科技、Hugging Face、英伟达办的黑客松和线下活动。**人脉从第 4 周就开始，不要等到第 9 周。**
`,
  tasks: md`
- [ ] 跑完 L2 的三个实验后，下单 SO-ARM101 套件 + 相机 + 支架
- [ ] 加入教程的微信群 / QQ 群，潜水看大家常遇到什么问题
- [ ] 建一个文件夹专门放真机照片、视频和日志，作品集从第一天开始积累
`,
  quiz: [
    {
      q: '在 Mac 上，飞书教程哪一章建议直接跳过？',
      options: ['第一步组装', '第七步 LeIsaac 仿真遥操作（需要 NVIDIA 显卡）', '第九步推理', '第零步买买买'],
      answer: 1,
      explain: 'LeIsaac 基于 Isaac Sim，需要 NVIDIA 显卡。知道仿真的用途即可。',
    },
    {
      q: '真机实验的总预算大约是？',
      options: ['两三百元', '两三千元以内', '两三万元', '二三十万元'],
      answer: 1,
      explain: '套件千元级 + 相机一两百 + 云 GPU 每次几十元。',
    },
    {
      q: '按本站建议，哪两章是「重点做」？',
      options: ['基础知识和组装', '第七步真机采集和第九步推理（加延迟测量）', 'DGX Spark 和 RDK S100', '安装环境和串口'],
      answer: 1,
      explain: '数据质量和部署实时性，正是你和算法背景候选人拉开差距的地方。',
    },
  ],
  interview: [
    {
      q: '你为什么自己花钱买机械臂做实验？',
      a: md`
- 「转行要拿出证据，不是只看视频。两三千元的投入，换来一套完整的数采、训练、部署链路。」
- 「真机上我重点做了两件事：采集 50 条高一致性的示教，和测端到端延迟。」
- 「过程中踩到新版 LeRobot 推理命令失效的坑，自己读源码解决了。」
- 体现的是：主动性、动手能力、能把问题讲清楚。
`,
    },
  ],
  hangzhou: md`
**典型场景：教育科研客户。** 浙大等高校和职业院校在建设具身智能相关的课程和教学实验室（专业设置以学校官网为准），这是一个真实的市场。SO-101 这类千元级套件 + LeRobot 教程，正是这类客户的入门方案。

你亲手做过一遍，就能回答客户最关心的问题：一套要多少钱、学生多久能跑通、最常见的坑在哪、需要什么算力。这是 [L6-5](#/lesson/l6-5) 里「20 台机械臂教学方案」那道售前题的基础。
`,
});

SITE.lesson({
  id: 'l3-2', level: 'L3', minutes: 25,
  title: '第一步组装 + 第二步装环境',
  goals: [
    '理解 STS3215 串行总线舵机的 ID 配置和中位校准，并用总线设备类比',
    '在已有的 lab 环境上补装真机依赖',
    '找到主从臂的串口',
  ],
  body: md`
## 第一步：组装机械臂
SO-ARM101 一套是**两只机械臂**：
- **主动臂（leader）**：人手拖动，读出每个关节的位置，相当于「遥控器」。
- **从动臂（follower）**：跟随主动臂运动，装相机，是真正干活的那只。

每只臂 6 个舵机：\`shoulder_pan\`、\`shoulder_lift\`、\`elbow_flex\`、\`wrist_flex\`、\`wrist_roll\`、\`gripper\`。舵机是**飞特 STS3215 串行总线舵机**：一根总线串起所有舵机，每个舵机有自己的 ID。

:::analogy 你会很快
给舵机配 ID，就像给 I2C / RS-485 总线上的设备分地址：出厂时 ID 都一样，必须**一个一个单独接上总线**去改 ID，否则会地址冲突。中位校准就像给 ADC 做零点校准。
:::

LeRobot 提供了配置舵机 ID 的命令（组装前按教程的顺序逐个接舵机）：

~~~bash 配置从动臂 / 主动臂的舵机 ID（端口换成你自己的）
lerobot-setup-motors --robot.type=so101_follower --robot.port=/dev/tty.usbmodemXXXX
lerobot-setup-motors --teleop.type=so101_leader --teleop.port=/dev/tty.usbmodemYYYY
~~~

## 第二步：安装环境（只看 Mac 章节）
可以直接复用 \`lab/.venv\`，补装舵机驱动、硬件和可视化依赖：

~~~bash 给 lab 环境补装真机依赖
cd lab
uv pip install --python .venv/bin/python "lerobot[training,matplotlib-dep,feetech,hardware,viz]==0.6.1"
~~~

## 找串口
两只臂各有一块 USB 转串口板。Mac 上的串口名形如 \`/dev/tty.usbmodemXXXX\`。用 LeRobot 自带的工具找：运行后按提示拔掉 USB 线，它会告诉你是哪个端口。

~~~bash 找串口
lerobot-find-port
~~~

:::warn 常见坑
- 两只臂的串口板长得一样，**贴标签**：哪根线是 leader、哪根是 follower。
- 舵机供电不足会导致掉线或抖动，用套件配的电源，不要只靠 USB 供电。
- 遇到参数报错，先跑 \`<命令> --help\` 对照参数，本页命令已在 LeRobot 0.6.1 上核对过。
:::
`,
  tasks: md`
- [ ] 按教程组装主动臂和从动臂，给两只臂的串口线贴标签
- [ ] 运行 \`lerobot-setup-motors\` 给 12 个舵机配好 ID
- [ ] 在 \`lab/.venv\` 里补装真机依赖，运行 \`lerobot-find-port\` 找到两个串口并记下来
`,
  quiz: [
    {
      q: 'SO-ARM101 的主动臂（leader）是做什么的？',
      options: ['装相机执行任务', '人手拖动，读出关节位置，作为遥控器', '只负责供电', '跑模型推理'],
      answer: 1,
      explain: '从动臂（follower）跟随主动臂运动，装相机，真正干活。',
    },
    {
      q: '为什么配置舵机 ID 时要一个一个单独接上总线？',
      options: ['为了省电', '出厂 ID 相同，同时接会地址冲突', '因为总线太短', '没有原因'],
      answer: 1,
      explain: '和给 I2C / RS-485 设备分地址一样。',
    },
    {
      q: 'Mac 上找机械臂串口用哪个命令？',
      options: ['lerobot-train', 'lerobot-find-port', 'lerobot-rollout', 'pip list'],
      answer: 1,
      explain: '运行后按提示拔插 USB，它会识别出端口。',
    },
  ],
  interview: [
    {
      q: '如果让你给客户写一份机械臂上手指南，你会怎么组织？',
      a: md`
- **按用户旅程**：开箱清单 → 组装 → 配 ID → 装环境 → 找串口 → 校准 → 遥操作 → 采集 → 训练 → 推理。
- **每一步给「完成标准」**：例如「两个串口都能被识别」「遥操作时从动臂跟随无明显抖动」。
- **把常见坑前置**：供电、串口贴标签、版本锁定。
- **锁版本 + 提供一键脚本 / 镜像**，并写清楚和教程版本的差异（例如推理命令的变化）。
- 类比：「这就是我做芯片 SDK 的 Quick Start Guide 的方法。」
`,
    },
  ],
  hangzhou: md`
**典型场景：本体公司的技术支持 / 交付岗。** 无论是四足、人形还是机械臂，客户到货后的第一周都会集中出现组装、通信、供电、驱动问题。

宇树、云深处这类面向开发者和行业客户的公司，技术支持团队每天都在处理这类问题。能把这些问题**分层归类并写成标准排查手册**，是从「接电话的技术支持」升级为「交付负责人」的关键一步。
`,
});

SITE.lesson({
  id: 'l3-3', level: 'L3', minutes: 25,
  title: '第三到第六步：串口、校准、遥操作、摄像头',
  goals: [
    '完成主从臂校准和遥操作，并观察跟随延迟',
    '配置相机，并定下「采集、训练、推理三处分辨率一致」的规则',
    '知道腕部相机线缆这类硬件问题会如何影响数据',
  ],
  body: md`
## 第三、四步：串口和校准
校准让软件知道每个关节的零位和行程范围。主从臂**分别校准**，并给每只臂起一个固定的 \`id\`：LeRobot 会按 id 保存校准文件，之后采集和推理都要用同一个 id。

~~~bash 校准从动臂和主动臂（端口换成你自己的）
lerobot-calibrate --robot.type=so101_follower --robot.port=/dev/tty.usbmodemXXXX --robot.id=my_follower_arm
lerobot-calibrate --teleop.type=so101_leader --teleop.port=/dev/tty.usbmodemYYYY --teleop.id=my_leader_arm
~~~

## 第五步：遥操作

~~~bash 遥操作：拖动主动臂，从动臂跟随
lerobot-teleoperate \
  --robot.type=so101_follower --robot.port=/dev/tty.usbmodemXXXX --robot.id=my_follower_arm \
  --teleop.type=so101_leader --teleop.port=/dev/tty.usbmodemYYYY --teleop.id=my_leader_arm
~~~

:::tip 遥操作时留意跟随延迟
快速甩动主动臂，看从动臂慢多少。L2 的数据里实测是 1–3 帧（33–100 ms）。可以用手机慢动作（240fps，每帧约 4.2 ms）同时拍两只臂，数帧估算延迟，这是 [L5-4 端到端延迟测量](#/lesson/l5-4) 的预演。
:::

## 第六步：摄像头
先列出相机并抓几张图，确认索引号和画面：

~~~bash 查找相机
lerobot-find-cameras opencv
~~~

遥操作时带上相机并打开显示：

~~~bash 遥操作 + 相机 + 实时显示
lerobot-teleoperate \
  --robot.type=so101_follower --robot.port=/dev/tty.usbmodemXXXX --robot.id=my_follower_arm \
  --robot.cameras="{ front: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}}" \
  --teleop.type=so101_leader --teleop.port=/dev/tty.usbmodemYYYY --teleop.id=my_leader_arm \
  --display_data=true
~~~

:::warn 一条要从第六步就定下来的规则
**采集时就把相机设成 640×480**（教程 Ubuntu 命令的配置）。这样采集、训练、推理三处分辨率一致，Mac GPU 上单次推理约 24 ms，能每帧推理。教程 Mac 命令里用的 1080p 会让推理变成 174 ms（见 [L2-5](#/lesson/l2-5)）。
:::

## 硬件问题会变成数据问题
- 飞书教程提到腕部相机的线「非常容易接触不良」：采集时偶发丢帧、花屏，模型就会学到错误的画面。
- 相机支架松动：训练和推理时视角不同，相当于换了场景。
- 舵机发热：长时间采集后跟随变慢，示教动作的时序就变了。
采集前做一次 5 分钟的「健康检查」：画面、帧率、跟随延迟、温度。
`,
  tasks: md`
- [ ] 完成主从臂校准，记下两只臂的 id
- [ ] 遥操作 5 分钟，用手机慢动作拍一段主从臂，估算跟随延迟
- [ ] 用 \`lerobot-find-cameras opencv\` 确认相机索引，设置 640×480@30fps
- [ ] 写一份你自己的「采集前健康检查清单」
`,
  quiz: [
    {
      q: '为什么主从臂校准时要指定固定的 id？',
      options: ['没有作用', 'LeRobot 按 id 保存校准文件，之后采集和推理都要用同一个 id', '为了联网', '为了加速训练'],
      answer: 1,
      explain: 'id 不一致会加载错误的校准文件，关节零位就错了。',
    },
    {
      q: '为什么建议采集时就把相机设成 640×480？',
      options: ['画质更好', '采集、训练、推理三处分辨率一致，且推理延迟低（Mac GPU 约 24 ms）', '因为 1080p 不能录', '因为 Mac 不支持 1080p'],
      answer: 1,
      explain: '1080p 推理约 174 ms，超过控制周期 5 倍以上。',
    },
    {
      q: '手机 240fps 慢动作，每帧大约对应多少毫秒？',
      options: ['约 33 ms', '约 4.2 ms', '约 0.24 ms', '约 240 ms'],
      answer: 1,
      explain: '1000 ÷ 240 ≈ 4.2 ms，足够分辨 33–100 ms 级别的延迟。',
    },
  ],
  interview: [
    {
      q: '遥操作的延迟是怎么来的？你会怎么测？',
      a: md`
- 组成：主动臂编码器读取 → 总线通信 → 控制周期（30Hz 每帧 33 ms）→ 从动臂舵机伺服响应。
- 实测：数据里 action → state 的延迟 1–3 帧（33–100 ms），用互相关估计。
- 测法：① 软件时间戳分段打点；② 手机 240fps 慢动作同时拍主从臂；③ 在关节上贴标记，用高速相机。
- 影响：示教延迟会被模型学进去，部署链路必须一致；无线遥操作还要关注抖动。
`,
    },
  ],
  hangzhou: md`
**模拟案例：遥操作数采设备的方案。** 杭州的本体公司和数据服务商在建数采中心时，常用数据手套、VR 或主从臂做遥操作。如果遥操作走无线，链路延迟和抖动直接决定示教质量。

如果你做过低延迟无线链路，可以把这段经验讲成：「我能把遥操作链路的端到端延迟和抖动做成可测、可控的指标，并在采集时实时监控。」这是数采系统设计（[L6-2](#/lesson/l6-2)）里最能体现你背景的一块。
`,
});

SITE.lesson({
  id: 'l3-4', level: 'L3', minutes: 30,
  title: '第七步：采集数据集（真机 / LeIsaac 仿真）',
  goals: [
    '用 lerobot-record 采集 50 条高一致性的示教',
    '知道新版 lerobot-record 的命名限制',
    '用 lab 的脚本检查自己采集的数据',
  ],
  body: md`
## 真机采集：重点做
目标：**采 50 条**，注意动作一致性。第七步用的 \`lerobot-record\` 在新版 LeRobot 里**不变**：

~~~bash 采集 50 条握手示教（端口、用户名换成你自己的）
lerobot-record \
  --robot.type=so101_follower --robot.port=/dev/tty.usbmodemXXXX --robot.id=my_follower_arm \
  --robot.cameras="{ front: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}}" \
  --teleop.type=so101_leader --teleop.port=/dev/tty.usbmodemYYYY --teleop.id=my_leader_arm \
  --dataset.repo_id=<你的HF用户名>/so101_shake_hands \
  --dataset.single_task="Shake Hands" \
  --dataset.num_episodes=50 --dataset.episode_time_s=15 --dataset.reset_time_s=10 \
  --dataset.push_to_hub=false --display_data=true
~~~

参数说明：\`episode_time_s\` 是每条示教的录制时长，\`reset_time_s\` 是两条之间让你把场景复位的时间。

:::warn 新版命名限制
新版的 \`lerobot-record\` 只负责采集，会**拒绝 \`eval_\` 开头的数据集名**。旧教程第九步用 \`eval_xxx\` 作为推理记录，在新版里要改用 \`lerobot-rollout\`（见 [L3-6](#/lesson/l3-6)）。
:::

## 一致性比数量更重要
- **起始姿态一致**：每条示教从同一个初始位置开始。
- **动作策略一致**：握手的路径、速度、力度尽量一样，不要这条快那条慢。
- **失败的示教要删**：中途碰撞、抓空、停顿过久的，当场重录。
- **有变化的地方要有覆盖**：如果推理时人的手会出现在不同位置，采集时就要覆盖这些位置；光照和背景也要有变化。

更系统的方法见 [L4-1 数据质量工程](#/lesson/l4-1)。

## 用 lab 脚本检查自己的数据
改 \`lab/common.py\` 里的三项，然后跑 \`01_inspect_dataset.py\`：

~~~python lab/common.py 需要改的三项
REPO_ID = "<你的HF用户名>/so101_shake_hands"
DATASET_ROOT = DATA_DIR / "so101_shake_hands"     # 改成你的数据所在目录
CAMERA_KEY = "observation.images.front"
~~~

重点看：每条帧数是否接近、跟随延迟是否和子豪兄的数据一致（1–3 帧）、关节曲线是否平滑。

## LeIsaac 仿真遥操作：跳过
光轮智能的 LeIsaac 基于 Isaac Sim，需要 NVIDIA 显卡，Mac 跑不了。知道仿真的用途（合成数据、评测、强化学习）即可，见 [L6-3](#/lesson/l6-3)。
`,
  tasks: md`
- [ ] 先试录 3 条，检查画面和曲线，再正式录 50 条
- [ ] 每录 10 条休息一下，检查舵机温度和相机画面
- [ ] 改 \`common.py\` 后用 \`01_inspect_dataset.py\` 检查自己的数据，记下帧数分布和跟随延迟
- [ ] 把采集过程拍成 30 秒的视频，放进作品集
`,
  quiz: [
    {
      q: '新版 lerobot-record 会拒绝什么样的数据集名？',
      options: ['包含数字的', '以 eval_ 开头的', '包含下划线的', '超过 10 个字符的'],
      answer: 1,
      explain: '新版 lerobot-record 只负责采集；推理改用 lerobot-rollout。',
    },
    {
      q: '中途碰撞或抓空的示教应该怎么处理？',
      options: ['保留，越多越好', '当场删掉重录', '训练时加大权重', '改成验证集'],
      answer: 1,
      explain: '失败示教会教模型学坏动作。',
    },
    {
      q: '--dataset.reset_time_s 参数的作用是？',
      options: ['每条示教的录制时长', '两条示教之间留给你复位场景的时间', '重置舵机 ID', '重置 GPU'],
      answer: 1,
      explain: '录制时长是 episode_time_s。',
    },
  ],
  interview: [
    {
      q: '你采集真机数据时，怎么保证数据质量？',
      a: md`
- 采集前：健康检查（画面、帧率、跟随延迟、舵机温度），分辨率定为 640×480 并保持一致。
- 采集中：起始姿态一致、动作策略一致、失败当场重录、场景变化有覆盖。
- 采集后：用脚本检查帧数分布、帧间隔、跟随延迟、最大单帧跳变，异常的剔除。
- 一句话：「数据质量大于数量，这和音频数据采集的规范是同一个思路。」
`,
    },
  ],
  hangzhou: md`
**典型场景：数据采集训练场 / 仿真数据。** 真机数采贵、慢，仿真合成数据便宜但有 sim2real 差距。杭州的群核科技在做后者（空间智能和面向 AI 训练的 3D 仿真数据，具体产品以官方发布为准）。

面试解决方案或产品岗时，常被问「真机数据和仿真数据怎么配比」。好的回答不是给一个比例，而是讲方法：**用真机数据定义任务和验收标准，用仿真数据扩充场景多样性，用真机评测来判断仿真数据是否有帮助。**
`,
});

SITE.lesson({
  id: 'l3-5', level: 'L3', minutes: 25,
  title: '第八步：训练（ACT 本地 / SmolVLA 云 GPU）',
  goals: [
    '用 lerobot-train 在 Mac 上训练自己的 ACT',
    '用云 GPU 微调一次 SmolVLA，体会从零训练和微调的区别',
    '知道训练产物要怎么保存和交接',
  ],
  body: md`
## ACT：在 Mac 本地训
ACT 是从零训练的小模型，Mac GPU（MPS）就能训。教程推荐约 2 万步；按 L2 实测每步约 260 ms 估算，大约一个半小时（你的数据是 640×480，比 lab 的 216×384 大，每步会更慢，以实测为准）。

~~~bash 在 Mac 上训练 ACT（用户名换成你自己的）
lerobot-train \
  --dataset.repo_id=<你的HF用户名>/so101_shake_hands \
  --policy.type=act --policy.device=mps \
  --output_dir=outputs/train/act_so101 --job_name=act_so101 \
  --steps=20000 --batch_size=8 --save_freq=5000 \
  --policy.push_to_hub=false --wandb.enable=false
~~~

\`--save_freq\` 控制多久存一次 checkpoint，方便挑验证效果最好的那个。中途断了可以用 \`--resume=true\` 续训（以 \`--help\` 说明为准）。

## SmolVLA：租云 GPU 试一次
SmolVLA 约 4.5 亿参数，是在基座模型上**微调**：起点是 Hugging Face 发布的 \`lerobot/smolvla_base\`，而不是随机初始化。

~~~bash 在云 GPU 上微调 SmolVLA
lerobot-train \
  --policy.path=lerobot/smolvla_base \
  --dataset.repo_id=<你的HF用户名>/so101_shake_hands \
  --policy.device=cuda --batch_size=32 --steps=20000 \
  --output_dir=outputs/train/smolvla_so101 --job_name=smolvla_so101 \
  --policy.push_to_hub=false --wandb.enable=false
~~~

教程用的是 Featurize 云 GPU，也可以用 AutoDL 等平台，一次几十元。云 GPU 的完整流程（上传数据、tmux、下载模型、关机停止计费）见 [L4-4](#/lesson/l4-4)。

## 从零训练 vs 微调：你会体会到的区别

| | ACT（从零） | SmolVLA（微调） |
|---|---|---|
| 起点 | 随机初始化（视觉骨干用 ImageNet 权重） | \`smolvla_base\` 预训练权重 |
| 输入 | 图像 + 关节 | 图像 + 关节 + **语言指令**（\`--dataset.single_task\` 里写的那句话） |
| 硬件 | Mac 就能训 | 建议 NVIDIA 显卡，租云 GPU |
| 推理 | 快，适合每帧或小 chunk | 慢，部署时建议用 RTC（见 [L3-6](#/lesson/l3-6)） |

:::warn 训练产物要完整交接
最终要用的是 \`<output_dir>/checkpoints/<步数>/pretrained_model/\` 这个目录（或 \`last\`）。它包含权重、配置和**归一化参数**，少一个都跑不对（见 [L1-4](#/lesson/l1-4)）。从云上下载时整个目录一起拿。
:::
`,
  tasks: md`
- [ ] 先用 \`--steps=2000\` 在 Mac 上跑通 ACT，再跑 2 万步
- [ ] 记录每步耗时，和 L2 的 260 ms 对比，解释差异（分辨率、数据量）
- [ ] 租一次云 GPU 微调 SmolVLA，记下花费和时长
- [ ] 确认下载回来的 \`pretrained_model/\` 目录文件齐全
`,
  quiz: [
    {
      q: '微调 SmolVLA 时，--policy.path=lerobot/smolvla_base 的作用是？',
      options: ['指定输出目录', '从预训练基座权重开始训练（微调），而不是随机初始化', '指定数据集', '指定显卡'],
      answer: 1,
      explain: '这就是「在基座上后训练」。ACT 用的是 --policy.type=act 从零训练。',
    },
    {
      q: '--save_freq 参数的作用是？',
      options: ['控制学习率', '每隔多少步保存一次 checkpoint', '控制 batch size', '控制显卡频率'],
      answer: 1,
      explain: '方便挑选验证效果最好的 checkpoint。',
    },
    {
      q: '和 ACT 相比，SmolVLA 多了哪一种输入？',
      options: ['深度图', '语言指令', '力传感器', '音频'],
      answer: 1,
      explain: 'VLA = Vision-Language-Action。',
    },
  ],
  interview: [
    {
      q: 'ACT 和 SmolVLA 的训练过程有什么不同？',
      a: md`
- **起点**：ACT 从零（视觉骨干用 ImageNet 权重）；SmolVLA 从 \`smolvla_base\` 预训练权重微调。
- **输入**：SmolVLA 多了语言指令。
- **硬件**：ACT 在 Mac 上就能训；SmolVLA 建议租云 GPU，一次几十元。
- **部署**：SmolVLA 推理慢，要用异步推理 / RTC。
- 一句话：「ACT 像专用 DSP 算法，SmolVLA 像在大厂通用算法库上做客户适配。」
`,
    },
  ],
  hangzhou: md`
**模拟案例：给客户报训练成本和周期。** 一家杭州的科研客户问：「我们想用自己的 50 条数据做一个 VLA，要花多少钱、多久？」

回答框架：① 数据：50 条起步，任务越难越多；② 算力：小 VLA（SmolVLA）租单张云 GPU，一次几十元到上百元；更大的基座（π0、LingBot-VLA）需要更大显存；③ 周期：采集 1–2 天、训练半天到一天、真机评测 1 天；④ 风险：先用 ACT 把链路跑通。**给区间、给假设、给验证计划**，不要给拍脑袋的单一数字。
`,
});

SITE.lesson({
  id: 'l3-6', level: 'L3', minutes: 30,
  title: '第九步：推理（版本坑：lerobot-rollout）',
  goals: [
    '知道旧教程第九步的推理命令为什么在新版 LeRobot 里失效',
    '会用 lerobot-rollout 在真机上推理，并知道什么时候加 RTC',
    '会统计真机成功率，并把这次踩坑讲成面试故事',
  ],
  body: md`
## 版本坑：教程第九步的推理命令在新版 LeRobot 里已经失效
教程写于 2026 年 1 月前后，用的是当时的 LeRobot。现在无论装官方版（本 lab 用的 0.6.1）还是教程推荐的矽递 fork（已同步到 0.6.2）：
- 第七步采集用的 \`lerobot-record\` **不变**。
- 第九步推理用的 \`lerobot-record --policy.path=... --dataset.repo_id=.../eval_xxx\` **会报错**。新版的 \`lerobot-record\` 只负责采集，还会拒绝 \`eval_\` 开头的数据集名；**推理部署改成了 \`lerobot-rollout\`**。

~~~bash 新版推理命令：lerobot-rollout
lerobot-rollout \
  --strategy.type=base \
  --policy.path=<你的模型目录>/pretrained_model \
  --robot.type=so101_follower \
  --robot.port=/dev/tty.usbmodemXXXX \
  --robot.id=my_follower_arm \
  --robot.cameras="{ front: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}}" \
  --task="Shake Hands" --duration=60
~~~

## VLA 这类慢模型：加 RTC
\`--inference.type\` 可选 \`sync\`（同步）和 \`rtc\`（Real-Time Chunking，实时分块）。RTC 用后台线程一边执行一边算下一块，并把新块和旧块剩余的部分平滑衔接，正好对应 L2 讨论的动作块衔接问题。官方文档推荐给 π0、π0.5、SmolVLA 这类大模型使用。

~~~bash 慢模型加 RTC
lerobot-rollout \
  --strategy.type=base \
  --inference.type=rtc \
  --policy.path=<你的 SmolVLA 模型目录>/pretrained_model \
  --robot.type=so101_follower \
  --robot.port=/dev/tty.usbmodemXXXX \
  --robot.id=my_follower_arm \
  --robot.cameras="{ front: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}}" \
  --task="Shake Hands" --duration=60
~~~

RTC 还有执行窗口等细节参数（官方文档示例里有 \`--inference.rtc.execution_horizon\`），具体以你安装版本的 \`lerobot-rollout --help\` 和官方文档为准。原理见 [L5-2](#/lesson/l5-2)。

:::info 其他策略
本机 0.6.1 的 \`lerobot-rollout --help\` 里，\`--strategy.type\` 除了 \`base\`，还有 \`sentry\`、\`highlight\`、\`episodic\`、\`dagger\` 等选项。其中 DAgger 是一种人在回路中纠正、把纠正数据加回训练集的方法（见 [L4-1](#/lesson/l4-1)）。用之前先看 \`--help\` 和文档。
:::

## 一个很有用的日志
控制循环跑不满目标帧率时，LeRobot 会打印类似这样的警告（摘自 0.6.1 源码）：

~~~text lerobot-rollout 的帧率警告
Record loop is running slower (xx Hz) than the target FPS (30 Hz).
Dataset frames might be dropped and robot control might be unstable.
Common causes are: 1) Camera FPS not keeping up 2) Policy inference taking too long 3) CPU starvation
~~~

看到它就说明回路超了 deadline：相机、推理、CPU 三选一。这正是你在 [实时预算计算器](#/tools/budget) 里算过的东西。

## 常见 Bug 速查

| 现象 | 先查什么 |
|---|---|
| 一启动就报参数错误 | 是不是还在用旧的 \`lerobot-record --policy.path\`；对照 \`--help\` |
| 机械臂动作偏、幅度不对 | \`robot.id\` 是否和校准时一致；模型目录是否完整（含归一化参数） |
| 动作一顿一顿 | 相机分辨率是否和训练一致；推理耗时；是否该用 RTC |
| 衔接处抖 | chunk 执行步数；是否开启平滑 / RTC |
| 偶发卡住或花屏 | 相机线缆（腕部相机线容易接触不良）、USB 带宽 |
| 学的模型完全不动 | 数据里静止段过长、任务描述和训练不一致 |

## 真机成功率怎么统计
握手 20 次，记成功几次；固定初始姿态和人手出现的位置；记录失败的类型（没反应、方向错、动作卡顿）。20 次里成功 14 次，真实成功率的 95% 区间大约是 48%–85%，用 [成功率置信区间](#/tools/success) 工具自己算。

## 把踩坑讲成面试故事
**遇到版本坑、自己查源码解决，本身就是面试时能讲的故事**：现象（教程命令报错）→ 定位（读 \`--help\` 和源码，发现推理拆到了 \`lerobot-rollout\`）→ 解决（改命令、对齐参数）→ 沉淀（写成迁移说明分享给群友）。这正是开发者生态和技术支持岗位每天做的事。
`,
  tasks: md`
- [ ] 用 \`lerobot-rollout\` 跑通 ACT 的真机推理，录一段 30 秒视频
- [ ] 握手 20 次，记录成功次数和失败类型，用 [成功率置信区间](#/tools/success) 算区间
- [ ] 留意终端有没有「running slower than the target FPS」的警告，如果有，按三个原因逐个排查
- [ ] 把版本坑写成一段 200 字的迁移说明（可以发到教程群里）
`,
  quiz: [
    {
      q: '新版 LeRobot 里，真机推理部署应该用哪个命令？',
      options: ['lerobot-record --policy.path=...', 'lerobot-rollout --strategy.type=base ...', 'lerobot-train --eval', 'lerobot-replay'],
      answer: 1,
      explain: 'lerobot-record 只负责采集，推理改用 lerobot-rollout。',
    },
    {
      q: '什么时候建议加 --inference.type=rtc？',
      options: ['所有情况都不需要', '推理慢的大模型（π0、π0.5、SmolVLA 等），避免控制回路卡顿、让块衔接平滑', '只在采集时', '只在 CPU 上'],
      answer: 1,
      explain: 'RTC 一边执行一边算下一块，并平滑衔接。',
    },
    {
      q: '日志提示 Record loop is running slower than the target FPS，常见原因不包括？',
      options: ['相机帧率跟不上', '推理太慢', 'CPU 资源不足', '数据集名字太长'],
      answer: 3,
      explain: '日志本身列出的三个原因是相机、推理、CPU。',
    },
  ],
  interview: [
    {
      q: '讲一个你自己解决技术问题的例子。（版本坑 STAR）',
      a: md`
- **S**：按飞书教程第九步在真机上推理，命令直接报错，教程群里很多人卡在这里。
- **T**：要在新版 LeRobot 上把推理跑通，并找到稳定的方案。
- **A**：先对照 \`--help\`，发现 \`lerobot-record\` 拒绝 \`eval_\` 数据集名；再读源码和官方文档，确认推理拆到了 \`lerobot-rollout\`，参数结构也变了；对齐 robot id、相机分辨率；慢模型加 RTC。
- **R**：真机推理跑通，握手 20 次成功 [N] 次；写了迁移说明分享到群里。
- **连接**：「这和我做芯片 SDK 升级时帮客户迁移 API 是同一件事，也是开发者生态岗位的日常。」
`,
    },
  ],
  hangzhou: md`
**模拟案例：开发者生态 / DevRel。** 一家杭州的机器人公司开源了 SDK 和教程，新版本发布后社区里大量用户反馈「教程命令报错」。DevRel 的工作就是：复现 → 定位版本差异 → 写迁移指南 → 更新教程 → 在社区里答疑 → 把高频问题反馈给研发。

蚂蚁灵波开源了 LingBot-VLA 的权重和后训练代码，宇树等公司也有面向开发者的产品线，这类岗位在杭州是真实存在的方向（具体以招聘页为准）。你亲手处理过 \`lerobot-rollout\` 这个版本坑，就是最好的面试素材。
`,
});

SITE.lesson({
  id: 'l3-7', level: 'L3', minutes: 20,
  title: '进阶章节：DGX Spark、RDK S100、LingBot-VLA 后训练',
  goals: [
    '读懂 DGX Spark 和 RDK S100 两章的流程，知道它们分别在解决什么问题',
    '用 DSP 定点化移植来讲边缘部署',
    '理解 LingBot-VLA 后训练那一章在行业里的意义',
  ],
  body: md`
这三章建议**读懂流程**，面试时用来讲边缘部署和基座后训练；有条件可以在云 GPU 上跑一次 LingBot-VLA。

## 英伟达 DGX Spark 推理
DGX Spark 是英伟达的桌面级 AI 计算机。这一章的关键坑是**要单独安装 \`cu130\` 版本的 PyTorch**：显卡驱动和 PyTorch 编译用的 CUDA 版本必须对上（见 [L1-2](#/lesson/l1-2)）。它在教程里的角色是「一台更强的推理主机」，解决的是 Mac 上推理慢的问题。

## 地瓜机器人 RDK S100 推理：边缘部署的完整流程

~~~text RDK S100 部署流程
PyTorch 模型 → 导出 ONNX → 量化（FP32 → INT8，需要校准数据）→ 编译成 BPU 指令 → 板端运行
~~~

对应你的经验：

~~~text 你做过的 DSP 移植
MATLAB / 浮点 C 算法 → 定点化（Q15 / Q31）→ DSP intrinsic / SIMD 优化 → 上板验证精度和 MCPS
~~~

这一章还要 \`git checkout\` 到 LeRobot 的一个旧 commit：数据集格式从 v2.1 升到 v3.0 后，板端工具链还没跟上；量化编译在 Docker 里做。深入版见 [L5-3 边缘芯片部署](#/lesson/l5-3)。

## 蚂蚁灵波 LingBot-VLA 后训练全流程
这一章就是「拿蚂蚁的基座模型，用子豪兄自己的握手数据做后训练」。LingBot-VLA 是开源的数十亿参数级 VLA 基座，仓库提供模型和后训练相关代码；具体版本、参数规模、许可证和支持的数据格式（例如是否已支持 LeRobot v3.0）以 [官方仓库](https://github.com/Robbyant/lingbot-vla) 的 README 为准，动手前先核对，这和 RDK 那章的版本坑是同一类问题。

它的意义在于：**基座 + 后训练**是行业主流做法。你不需要训出最好的效果，但要能讲清楚流程：准备数据（格式转换）→ 下载基座和依赖权重 → 配置后训练参数 → 云 GPU 训练 → 离线评估 → 真机部署（慢模型配合 RTC）。
`,
  tasks: md`
- [ ] 把 RDK S100 的五步流程和你做过的 DSP 移植流程并排写下来，每一步各举一个你遇到过的问题
- [ ] 打开 LingBot-VLA 的 GitHub 页面，记下后训练需要准备的数据格式和依赖权重
- [ ] （可选）在云 GPU 上跑一次 LingBot-VLA 后训练
`,
  quiz: [
    {
      q: 'RDK S100 部署流程的正确顺序是？',
      options: ['量化 → 导出 ONNX → 编译 → 板端', 'PyTorch → 导出 ONNX → 量化（需校准数据）→ 编译成 BPU 指令 → 板端', '编译 → 训练 → 量化', '直接拷贝权重到板子'],
      answer: 1,
      explain: '和浮点算法 → 定点化 → SIMD 优化 → 上板验证是同一套思路。',
    },
    {
      q: '量化（FP32 → INT8）为什么需要校准数据？',
      options: ['为了训练模型', '统计各层激活值的范围，确定缩放系数', '为了导出 ONNX', '为了联网下载'],
      answer: 1,
      explain: '就像定点化时要确定 Q 格式和动态范围。',
    },
    {
      q: 'LingBot-VLA 后训练那一章，本质是在做什么？',
      options: ['从零预训练一个大模型', '用自己的数据在开源基座上后训练（微调）', '仿真强化学习', '量化部署'],
      answer: 1,
      explain: '基座 + 后训练是行业主流做法。',
    },
  ],
  interview: [
    {
      q: '模型怎么部署到边缘芯片上？会遇到什么问题？（简版）',
      a: md`
- 流程：PyTorch → ONNX → 量化（INT8，需要校准集）→ 编译到 NPU（TensorRT / RKNN / 地平线 OE）→ 板端验证。
- 问题：量化掉精度、算子不支持回退 CPU、内存带宽、前后处理耗时。
- 类比：「这和我把浮点算法移植到 DSP 做定点化是同一套思路。」
- 完整版见 L5-3。
`,
    },
  ],
  hangzhou: md`
**模拟案例：蚂蚁灵波的生态 / 后训练合作方向。** 一家机器人厂商想用 LingBot-VLA 适配自家机械臂，你作为生态或解决方案的角色，要给出一份 POC 计划：

1. 数据：采集 / 转换成 LeRobot v3.0 格式，几十到几百条示教。
2. 算力：云 GPU 后训练，估算显存和时长。
3. 评测：离线指标 + 真机成功率（固定协议，20 次以上）。
4. 部署：推理平台选型、异步推理 / RTC、端到端延迟测量。
5. 交付：文档、培训、问题闭环机制。

这份计划的每一项，本站都有对应的课。
`,
});
