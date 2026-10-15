/* L8 专题：开源腿式小机器人（来源：docs/04_开源小机器人_自由度_训练环境_部署_在线训练.md、lab/duck/README.md；资料核实 2026-10-15） */

SITE.lesson({
  id: 'l8-1', level: 'L8', minutes: 12,
  title: '认识三台机器人 + 自由度是什么',
  body: md`
:::info 这节课回答什么
网上说的「小鸭子」「螃蟹机器人」到底是哪几个开源项目？「22 自由度」是什么意思，和你的 SO-101 差在哪？
:::

## 先对上号：三个项目
- **Microduck**：Hugging Face 旗下 Pollen Robotics 2026 年 8 月发布的双足小鸭子，高 25 cm。[GitHub](https://github.com/pollen-robotics/microduck)
- **Open Duck Mini**：同一位作者 Antoine Pirrone 2024 年开始做的 DIY 小鸭子，硬件全开源，可以看成 Microduck 的「全开源前代」。[GitHub](https://github.com/apirrone/Open_Duck_Mini)
- **跳跳 Jumper**：北京**金钢科技**（英文 KingKong）的 22 自由度螃蟹机器人，2026-09-28 开源。[GitHub](https://github.com/KingKongRobotics/jumper)

热度（2026-10-15）：Microduck 主仓库约 9.4k 星，Open Duck Mini 约 4.3k 星，跳跳约 2.7k 星。星数变化很快，以链接为准。

:::tip 名字容易认错
- 「micro duck」指 Microduck 是**判断**：名字、时间、「开源虚拟训练环境」「可以在云端训练」这些说法都对得上，把握较高。你看到的也可能是 Open Duck Mini 的旧视频，所以两只鸭子都讲。
- 「金刚科技」是同音字，正确写法是**金钢**（「钢」不是「刚」）。有的媒体写成「[北京金刚机器人](https://agihunt.info/p/1a119f99d9d82df7e672565a96e)」，很容易混（[官网](https://kingkong.tech/zh/jumper)）。
:::

## 三台机器的关键规格

### Microduck（Pollen Robotics / Hugging Face）

| 项 | 规格 |
|---|---|
| 尺寸 / 重量 | 高 25 cm、宽 14 cm，不到 800 g |
| 电机 | 15 个 Dynamixel XL330 |
| 主控 | 瑞芯微 RK3566（Radxa Zero 3W），1 GB 内存 |
| 传感器 | 摄像头、8×8 ToF 测距、2 个 IMU（机身、头部各一） |
| 控制 | 50 Hz 控制环 |
| 电池 | NP-F550 相机电池，约 1 小时 |

- Pollen Robotics 是法国波尔多的机器人团队，2025 年 4 月加入 Hugging Face，上一款产品是 Reachy Mini。
- 2026-08-27 [正式发布](https://pollen-robotics.com/microduck/blog/introducing-microduck/)，引入价 399 美元（不含税和运费），首批目标 2026 年圣诞前交付北美、欧洲和英国。国内什么时候能买、怎么买，**没查到官方说法**。
- 来源：[新闻稿规格页](https://pollen-robotics.com/microduck/press-kit/)、[microduck README](https://github.com/pollen-robotics/microduck)。

### Open Duck Mini v2（社区全开源）

| 项 | 规格 |
|---|---|
| 尺寸 | 腿伸直约 42 cm 高 |
| 成本 | 官方称整套 BOM 低于 400 美元（以官方 BOM 和淘宝实际为准） |
| 电机 | 14 个飞特 STS3215，和 SO-101 同款 |
| 主控 | 树莓派 Zero 2W |
| 传感器 | BNO055 IMU（I²C）、两只脚底开关（GPIO） |
| 控制 | 50 Hz |

- 原型是迪士尼星战机器人 BD-X，项目受过 Hugging Face 和 Pollen 赞助。作者现在是 Microduck 的主要贡献者之一。
- 来源：[Open_Duck_Mini](https://github.com/apirrone/Open_Duck_Mini)、[Open_Duck_Mini_Runtime](https://github.com/apirrone/Open_Duck_Mini_Runtime)。

### 跳跳 Jumper（金钢科技）

| 项 | 规格 |
|---|---|
| 尺寸 / 重量 | 400×400×200 mm，1.8 kg |
| 电机 | 22 个自研「触觉舵机」，每个有电机端、关节端两枚编码器 |
| 主控 | 瑞芯微 RK3576，6 TOPS NPU，4 GB / 64 GB |
| 传感器 | 6 轴 IMU、dToF 深度、500 万像素摄像头、4 麦克风 |
| 性能 | 跳高 ≥400 mm，速度 ≥0.5 m/s，续航约 2 小时 |
| 控制 | 策略 50–200 Hz（按动作不同），控制器 1 kHz |

- 公司在北京昌平。据[量子位的报道（转载）](https://www.tokendh.com/news/efe5202332)，产品路线是「磁编码器 → 双编码器 → 触觉舵机 → 小机器人」，之前主要给别的机器人厂商供编码器和舵机。
- 官方在 [BE UNLIMITED 社区](https://beunlimited.me/zh/events/crab-robot-challenge-2026)办「螃蟹机器人开源动作大赛」，页面标题写着「免费送 100 台」；具体规则页面要登录加载，**没读到**。零售价**没查到**。
- 来源：[HARDWARE.zh.md](https://github.com/KingKongRobotics/jumper/blob/main/docs/HARDWARE.zh.md)、[官网](https://kingkong.tech/zh/jumper)。

## 自由度：能独立驱动的关节数
一个能被独立驱动的关节，就是一个自由度。这几台机器人都是一个关节一个舵机，所以**自由度 ≈ 舵机个数**。

:::analogy
自由度 ≈ **独立控制的执行器通道数**。就像多通道音频里每个声道都要独立的增益和时序：22 自由度，就是 22 路要同步的执行器通道挂在总线上，每个控制周期都要全部读一遍、写一遍。
:::

| 机器人 | 自由度 | 怎么数 |
|---|---|---|
| SO-101 | 6 | 5 个臂关节 + 夹爪 |
| Open Duck Mini | 14 | 每条腿 5 个 × 2 + 头颈 4 个 |
| Microduck | 15 | 腿 5 × 2 + 头颈 4 + 第 15 个（应该是嘴，**推断**） |
| 跳跳 | 22 | 两条前臂各 5 个（含爪子手指）+ 四条腿各 3 个 |

- 鸭子腿上的 5 个：髋的三个方向、膝、踝。跳跳腿上的 3 个：髋、大腿、小腿（见 [jumper.xml](https://github.com/KingKongRobotics/jumper/blob/main/assets/jumper/jumper.xml)）。
- Microduck 官方只说有「15 个电机」和「可开合抓东西的鸭嘴」，没列出第 15 个关节的名字，所以「第 15 个是嘴」是**推断**。

:::tip 很「嵌入式」的细节
Open Duck Mini 的舵机总线 ID 是这样分的：左腿 20–24、右腿 10–14、头 30–33（[configure_motors.md](https://github.com/apirrone/Open_Duck_Mini/blob/v2/docs/configure_motors.md)）。和你装 SO-101 时给 STS3215 配 ID 是同一件事。
:::

## 三个容易混的点
1. **自由度 ≠ 策略输出维度。** 跳跳 22 个自由度，行走策略只输出 20 维（两个手指不参与，跳舞才用全部 22 个）；Microduck 15 个电机，策略输出 14 维。
2. **被动关节不算。** Microduck 穿轮滑时脚下的轮子、仿真里模拟齿隙的「假关节」，名字都是 \`passive_*\`，没有电机。机身漂在空中的 6 个自由度也不算可控自由度。
3. **越多不一定越好。** 多一个关节，总线上就多一路要读写，仿真里多一个要建模的舵机，sim2real 也多一份误差。金钢的创始人在报道里说过：「机器人每增加一个自由度，就会增加一层机械、控制和感知难题。」

:::tip 一句话记住
自由度 = 能独立驱动的关节数 ≈ 舵机个数 ≈ 总线上要同步读写的执行器通道。但**策略不一定控制全部通道**，被动关节也不算。
:::
`,
  tasks: md`
- [ ] 打开 [jumper.xml](https://github.com/KingKongRobotics/jumper/blob/main/assets/jumper/jumper.xml)，搜 \`<joint\`，自己数一遍跳跳的关节，找出不参与行走的那两个
- [ ] 用 30 秒向朋友解释「22 自由度」，用「22 路执行器通道」的说法
`,
  quiz: [
    {
      q: '在这几台小机器人上，「自由度」最接近什么？',
      options: ['传感器的个数', '能独立驱动的关节数，基本等于舵机个数', '控制频率', '神经网络的层数'],
      answer: 1,
      explain: '一个关节一个舵机，所以自由度 ≈ 舵机个数 ≈ 独立控制的执行器通道。',
    },
    {
      q: '跳跳有 22 个自由度，它的行走策略输出几维？',
      options: ['22', '14', '20', '6'],
      answer: 2,
      explain: '两个爪子手指不参与行走，跳舞时才用全部 22 个。自由度 ≠ 策略输出维度。',
    },
    {
      q: '下面哪一个「不算」可控自由度？',
      options: ['Open Duck Mini 的膝关节舵机', 'SO-101 的夹爪', 'Microduck 穿轮滑时脚下的被动轮子（`passive_*`）', '跳跳爪子上的手指'],
      answer: 2,
      explain: '被动关节没有电机驱动。机身漂在空中的 6 个自由度也不算。',
    },
    {
      q: 'Open Duck Mini 的舵机和你的 SO-101 是什么关系？',
      options: ['同款飞特 STS3215，配 ID、校零位的方法一样', '完全不同的协议，经验用不上', 'Open Duck 用的是 Dynamixel XL330', 'Open Duck 不用舵机，用无刷电机'],
      answer: 0,
      explain: 'Dynamixel XL330 是 Microduck 用的。Open Duck 和 SO-101 都是 STS3215，这一步你会比大多数人快。',
    },
  ],
  interview: [
    {
      q: '什么是自由度？是不是越多越好？',
      a: md`
- **定义**：能独立驱动的关节数。这类小机器人一个关节一个舵机，自由度 ≈ 舵机个数。
- **三个区分**：总自由度 ≠ 策略输出维度（跳跳 22 个，行走策略只输出 20 维）；被动关节（轮子、齿隙假关节）不算；机身浮动的 6 个自由度也不算。
- **不是越多越好**：每多一个，总线上多一路读写，仿真里多一个要建模的执行器，sim2real 多一份误差。
- 类比：「自由度就是独立控制的执行器通道数。通道越多，同步、带宽和标定的工作量越大。」
`,
    },
  ],
  hangzhou: md`
**模拟案例：腿式机器人公司的技术支持。** 杭州的宇树（四足、人形）、云深处（四足）都做腿式机器人。客户拿到机器人后常会问：「宣传说 N 个自由度，为什么 SDK 里的关节数对不上？策略到底控制哪几个？」

好的回答分三层：总自由度（电机个数）→ 策略实际输出的维度 → 不算数的被动关节和机身浮动自由度。讲清之后，再陪客户对一遍关节顺序和 ID 映射表（以官方 SDK 文档为准）。这和做 SDK 客户导入时对引脚表、寄存器表是同一种基本功。
`,
});

SITE.lesson({
  id: 'l8-2', level: 'L8', minutes: 15,
  title: '两条路线：模仿学习 vs 仿真里强化学习',
  body: md`
:::info 这节课回答什么
你在 SO-101 上用 ACT 做的是「模仿学习」，这几台腿式小机器人走的是另一条路：在仿真里强化学习。两条路差在哪？为什么腿式机器人几乎都走仿真？
:::

## 你做过的：模仿学习（离线训练）
人拖主动臂示教 → 录成 LeRobot 数据集 → 训练网络「模仿」人 → 用 \`lerobot-rollout\` 部署。

数据是**事先录好、训练时不变**的，这叫离线训练。复习见 [L1-1](#/lesson/l1-1) 和 [L2 Mac 实验](#/level/L2)。

## 这几台：在仿真里强化学习，再搬到真机
- 在 MuJoCo 物理仿真器里同时放**几千只**虚拟机器人（跳跳和 Microduck 的示例命令都是 4096 只），并行试错。
- 不给示范，只给**奖励函数**：跟上速度指令加分，摔倒扣分，动作抖扣分……
- 网络从上亿次试错里自己学会走。训好后搬到真机，这一步叫 **sim2real**（仿真到现实）。

:::analogy 奖励函数像什么
像给自动调参脚本写的**代价函数**：你不告诉它参数怎么调，只定义「什么算好」。比如 EQ 自动调优时只规定目标曲线和容差，让优化器自己去搜。奖励写偏了，策略会「钻空子」，就像代价函数写偏了，优化器会找到奇怪的解。
:::

## 为什么腿式机器人基本都走这条路
1. **腿没法遥操作示教。** 机械臂有主动臂可以拖；14 到 22 个关节协调着保持平衡，人手拖不出来。
2. **身体是「浮」着的。** 机身在空间里的 6 个自由度没有电机直接管，只能靠脚和地面的接触间接控制。平衡是动态的，每个控制周期都要修正。
3. **要试几百万次，真机摔不起。** 仿真里摔一万次不花钱，还能并行。
4. **反过来**，抓取要看懂场景、理解人的意图，示教数据也好采，所以操作类任务主要走模仿学习 / VLA（见 [L1-7](#/lesson/l1-7)、[L6-3](#/lesson/l6-3)）。

:::info 它们也借了一点「示范」
Open Duck Mini 先用[步态生成器](https://github.com/apirrone/Open_Duck_reference_motion_generator)生成参考步态，再用迪士尼 BDX 论文里的「模仿奖励」让策略贴着参考走；跳跳的跳跃和舞蹈也是先给一段录好的参考动作，策略只学「修正量」。准确说是**强化学习为主，参考动作为辅**。
:::

## 用你熟悉的流程对照

| 环节 | ACT（你做过的） | 腿式机器人 RL |
|---|---|---|
| 数据 | 固定数据集，只读 | 训练中由仿真器现场产生 |
| 看曲线 | loss 往下走 | 奖励往上走、回合变长（不摔了）、速度跟踪误差变小 |
| 检查点 | \`.pt\` 之类，能续训 | 一样 |
| 推理 | 带视觉骨干，一次几十毫秒，要动作分块 | 只吃关节角和 IMU，ONNX 约 1 MB，**每周期推理一次** |
| 部署 | \`lerobot-rollout\` | 机器人自己的运行时程序 |

## 用芯片验证的眼光看 sim2real

:::analogy 嵌入式类比速查
- **仿真器** ≈ 流片前的芯片仿真 / FPGA 原型：先在模型里把功能和时序跑通。
- **sim2real 差距** ≈ 仿真模型和真实硅片、真实板子的差距：寄生参数、器件离散、温漂，模型里都没有。
- **执行器建模** ≈ 给器件建准 SPICE 模型。
- **域随机化** ≈ **PVT / corner 测试**：训练时故意把电池电压、摩擦、延迟、质量在一个范围里随机，让策略在所有 corner 下都能用。
- **50 Hz 策略** ≈ **20 ms 的定时中断**：每个周期读传感器、推理、写舵机，必须在 deadline 内完成。
:::

sim2real 能不能过，主要看两件事：
- **先把执行器建准。** Microduck 的原话是「在这个尺度上，执行器的保真度就是 sim2real 差距的大头」，所以把舵机建模到电压控制律那一层（用的是 [BAM](https://github.com/Rhoban/bam)）。
- **再用域随机化兜住剩下的不确定。** Microduck 随机化的正是电池电压、负载下的压降、指令延迟和摩擦。

**你的加分点**：仿真里默认「零延迟、完美定时」，指令延迟、电压跌落的**真实分布**要靠实测（测法见 [L5-4](#/lesson/l5-4)）。能把实测分布变成随机化范围，就是嵌入式背景能直接贡献的地方。

:::tip 一句话记住
抓取靠人教（模仿学习，数据事先录好）；走路靠自己在仿真里摔（强化学习，数据现场产生），再靠「执行器建模 + 域随机化」过 sim2real。
:::
`,
  tasks: md`
- [ ] 用 2 分钟口述「腿式机器人为什么用仿真 + 强化学习」，四个理由各配一个例子
- [ ] Microduck 随机化的四个参数（电池电压、压降、指令延迟、摩擦），各写一句你会怎么在真机上测
- [ ] 在浏览器里打开 [Microduck Sandbox](https://huggingface.co/spaces/pollen-robotics/microduck-simulator) 玩几分钟仿真鸭（不用装任何东西）
`,
  quiz: [
    {
      q: '腿式机器人为什么很少用遥操作示教来训练行走？',
      options: ['舵机太贵', '十几个关节要协调着保持平衡，人手拖不出来；而且要试几百万次，真机摔不起', '仿真画面更好看', '模仿学习不能输出关节角'],
      answer: 1,
      explain: '机身的 6 个浮动自由度没有电机直接管，平衡是动态的，每个控制周期都要修正。',
    },
    {
      q: '强化学习训练时，「数据」从哪来？',
      options: ['事先录好的示教数据集', '从互联网下载', '训练中由仿真器现场产生，策略变了数据也跟着变', '真机边跑边录'],
      answer: 2,
      explain: 'ACT 读固定数据集（离线）；强化学习边和环境交互边产生数据（在线）。',
    },
    {
      q: '域随机化最贴切的嵌入式类比是？',
      options: ['代码覆盖率统计', 'PVT / corner 测试', '看门狗', '烧录后的校验和'],
      answer: 1,
      explain: '故意让电压、摩擦、延迟在一个范围里变，策略在所有 corner 下都要能用。',
    },
    {
      q: 'Microduck 团队认为，在这个尺度上 sim2real 差距的大头来自？',
      options: ['渲染画质', '网络层数不够', '执行器（舵机）建模的保真度', '相机分辨率'],
      answer: 2,
      explain: '所以他们把舵机建模到电压控制律那一层（BAM），再用域随机化兜住剩下的不确定。',
    },
  ],
  interview: [
    {
      q: '你怎么理解 sim2real？怎么让仿真里训的策略在真机上也能用？',
      a: md`
- **定义**：在仿真里训练策略，再迁到真机。差距来自物理参数、执行器、传感器噪声和延迟，就像仿真模型和真实硅片之间的差距。
- **第一手：把模型建准。** 尤其是执行器；Microduck 认为这是小尺度机器人 sim2real 差距的大头，所以把舵机建模到电压控制律。
- **第二手：域随机化。** 电池电压、压降、指令延迟、摩擦在范围内随机，「就像芯片做 PVT corner 测试」。
- **验证**：同一组输入下对比仿真和真机的关节响应；上机前做参考帧逐项比对。
- **我的视角**：「仿真里默认零延迟。我会把真机实测的延迟分布放进随机化范围。」
`,
    },
    {
      q: '腿式机器人为什么用强化学习，而不是模仿学习？',
      a: md`
- **示教难**：十几个关节协调平衡，人手拖不出来；机械臂有主动臂，腿没有。
- **动态平衡**：机身 6 个自由度靠脚和地面接触间接控制，每个周期都要修正。
- **试错多**：要几百万次，真机摔不起；仿真里 4096 只并行，几小时出可用步态（Microduck 官方说法）。
- **不是纯 RL**：Open Duck 用参考步态 + 模仿奖励，跳跳的跳跃和舞蹈学的是参考动作的修正量，强化学习为主、参考动作为辅。
- **对照**：抓取类任务要看懂场景、示教数据好采，所以主要走模仿学习 / VLA。
`,
    },
  ],
  hangzhou: md`
**模拟面试：宇树、云深处这类腿式机器人公司的运控 / 技术支持方向。** 面试官问：「我们的机器狗为什么用强化学习训练，而不是让人示教？」

答题思路：先给本课的四个理由，再讲 sim2real 的两手（执行器建模 + 域随机化），最后落到自己：「仿真里要随机化的指令延迟和电压跌落，真实分布要靠实测。我会用测音频链路延迟的方法把它测出来，变成随机化范围。」
`,
});

SITE.lesson({
  id: 'l8-3', level: 'L8', minutes: 12,
  title: '「训练环境开源」到底开了什么',
  body: md`
:::info 这节课回答什么
宣传里说「开源了预训练环境」，到底开源了什么？和 π0、SmolVLA 那种「预训练模型」是一回事吗？
:::

## 先纠正一个词
网上说的「预训练环境」，准确叫法是**训练环境**或**仿真环境**。Microduck 新闻稿的原话是 "virtual training environments"（虚拟训练环境）。

## 一个训练环境 = 四样东西
1. **机器人仿真模型**（MJCF / URDF 文件）：每个零件的质量、惯量、关节限位、舵机参数。
2. **场景**：地面、坡道、冰面、台阶。
3. **任务定义**：观测什么、输出什么、奖励怎么算、什么时候算摔倒重来、随机化哪些参数。
4. **训练和导出脚本。**

有时还附带**训好的策略**（ONNX 权重文件），那才是「预训练」的部分。

:::analogy 像一套芯片验证平台
- 机器人模型 ≈ 器件的仿真模型（SPICE / 行为模型）
- 场景 ≈ testbench 里的激励环境
- 任务和奖励 ≈ 测试用例 + 打分标准
- 训练脚本 ≈ 跑回归的脚本
- 训好的策略 ≈ 原厂给的参考固件
:::

## 和「预训练模型」不是一回事
- π0、SmolVLA 那种是大公司用海量数据训出来的**基座模型**，你拿来微调（[L1-1](#/lesson/l1-1)）。
- 这里的行走策略是很小的网络，每个任务**从零开始**在仿真里训几个小时，没有「基座 → 微调」这一层。
- 最接近「微调」的，是在别人的策略上接着训：Microduck 发布策略时可以用 \`--base-model\` 标注「基于谁的策略改的」，跳跳可以 \`--resume\` 续训。

## 三家各开源了什么

| 项目 | 开源了 | 没开源 / 限制 |
|---|---|---|
| Open Duck Mini | 几乎全部：CAD、STL、BOM、组装接线图、树莓派运行时、训练环境、参考步态生成器、两份行走策略 | 基本没有；但主仓库最后提交在 2026-01-31，项目已不太活跃 |
| Microduck | 机器人全部软件、训练环境、官方策略、「仿真鸭」 | 机械和电子设计；STL 网格是 CC BY-NC-SA 4.0，**不能商用** |
| 跳跳 | 机器人模型、场景、任务和奖励、训练框架、导出和部署工具、示例策略包、Colab | 机械 CAD、生产 BOM、PCB、电气原理图、舵机制造资料 |

### 跳跳：链路最完整，真机部分还在打通
- **模型和场景**：MuJoCo 模型 \`jumper.xml\`、URDF、网格，含舵机曲线、dToF 和机载相机；摄影棚、崎岖地面、冰面、沙滩、足球场、绳索秋千等场景（[项目指南](https://github.com/KingKongRobotics/jumper/blob/main/docs/PROJECT_GUIDE.zh.md)）。
- **任务**：四种六足步态、姿态控制、跳跃、5 支舞、4 个手势、单侧爪子抓取，每个都带奖励函数和配置。
- **训练框架**：内置 [mjlab](https://github.com/mujocolab/mjlab) 和 [rsl_rl](https://github.com/leggedrobotics/rsl_rl) 的副本，同一套任务能跑 GPU 和 CPU 两个后端。
- **示例策略包** \`jumper.app\`：走、跳、4 支舞、4 个手势、左右爪，每个都有 ONNX 和 RKNN 两份。
- 许可证 Apache-2.0。量子位的原话是「不足以支持普通开发者直接从零复刻一台」。

:::warn 官方写明的边界（截至 2026-10-15）
训练、仿真、导出已有测试覆盖；但 **RKNN 在板子上的推理还没验证，1 kHz 控制循环也还没真正驱动过电机总线**（[项目指南·项目状态](https://github.com/KingKongRobotics/jumper/blob/main/docs/PROJECT_GUIDE.zh.md)、[部署文档·未决](https://github.com/KingKongRobotics/jumper/blob/main/deploy/README.zh.md)）。教程里又提到板上回放参考帧结果为 0，两处说法有出入，**未核实**，以官方后续更新为准。
:::

### Microduck：软件全开，硬件不开
- **机器人软件**（Apache-2.0）：一组 Rust 守护进程。\`robotd\` 管 50 Hz 控制环和舵机总线，\`updaterd\` 管签名升级和回滚，还有蓝牙、手柄、摄像头（WebRTC）、ToF 等（[microduck](https://github.com/pollen-robotics/microduck)）。
- **训练环境** [microduck_rl](https://github.com/pollen-robotics/microduck_rl)：MJCF 模型（从 Onshape 导出）、十几种任务（行走、摔倒爬起、坐下站起、踢球、前滚翻、轮滑……）、舵机模型、域随机化、齿隙仿真。
- **官方策略**在 Hugging Face：[microduck-policies](https://huggingface.co/pollen-robotics/microduck-policies)。
- **仿真鸭** \`scripts/duck-sim\`：真实的机器人守护进程接一个 MuJoCo 身体，没有真机也能开发（[simulation.md](https://github.com/pollen-robotics/microduck/blob/main/docs/robot/simulation.md)）。
- 官方新闻稿特意写了「请不要称它为开源硬件」。国内的复刻项目，例如 [microduck-replica](https://github.com/fanhao375/microduck-replica)、[fanduck「超能花钱鸭」](https://github.com/7757/fanduck)、改用飞特舵机的 [microduck-hd1910m](https://github.com/zhuoligetu123/microduck-hd1910m)，是根据官方 MJCF 和源码反推的**社区项目**，不是官方，质量和合规要自己判断。

### Open Duck Mini：最适合拆开学
训练环境是 [Open_Duck_Playground](https://github.com/apirrone/Open_Duck_Playground)。中文 BOM 和组装指南在子豪兄的飞书上，和你那份 SO-101 教程是同一个飞书域名（链接见 [README](https://github.com/apirrone/Open_Duck_Mini)）。训练仓库停在 2025-08，作者的精力已经转到 Microduck，现在主要靠社区。

:::tip 一句话记住
「训练环境开源」= 开源了仿真里的**机器人模型 + 场景 + 任务和奖励 + 训练脚本**（常附带训好的策略）。它不等于硬件开源，也不是 VLA 那种「预训练基座」。
:::
`,
  tasks: md`
- [ ] 打开 [microduck_rl](https://github.com/pollen-robotics/microduck_rl) 的 README，按「模型 / 场景 / 任务 / 脚本 / 策略」五类各找一个例子
- [ ] 用一句话向朋友解释「训练环境开源」和「预训练模型开源」的区别
`,
  quiz: [
    {
      q: '下列哪一项「不属于」训练环境？',
      options: ['机器人的 MJCF / URDF 模型', '任务和奖励函数', '训练和导出脚本', '机械 CAD 和 PCB 设计文件'],
      answer: 3,
      explain: '那是硬件设计。跳跳和 Microduck 都没开源硬件设计，只有 Open Duck Mini 连 CAD、BOM 都开源了。',
    },
    {
      q: '三个项目里，硬件设计（CAD、BOM）也开源的是？',
      options: ['Microduck', '跳跳', 'Open Duck Mini', '三个都开源了'],
      answer: 2,
      explain: 'Microduck 新闻稿特意写了「请不要称它为开源硬件」；跳跳没开源 CAD、BOM、PCB。',
    },
    {
      q: '这些行走策略和 π0 的训练方式有什么不同？',
      options: ['一样，都是基座 + 微调', '行走策略是小网络，每个任务从零在仿真里训几个小时，没有基座这一层', '行走策略需要更多真机示教', 'π0 只在仿真里训练'],
      answer: 1,
      explain: '最接近「微调」的是在别人的策略上续训：Microduck 的 `--base-model`、跳跳的 `--resume`。',
    },
    {
      q: 'Microduck 的 3D 网格文件（STL）用 CC BY-NC-SA 4.0 许可，意味着？',
      options: ['可以随便商用', '不能商用', '只能在欧洲使用', '必须付费下载'],
      answer: 1,
      explain: 'NC 就是 NonCommercial。做复刻或产品之前，先看清每个文件的许可证。',
    },
  ],
  interview: [
    {
      q: '「开源训练环境」和「开源预训练模型」有什么区别？',
      a: md`
- **训练环境** = 机器人仿真模型（MJCF / URDF）+ 场景 + 任务和奖励 + 训练导出脚本，常附带训好的策略。拿到它，你能**自己训**新动作。
- **预训练模型**（π0、SmolVLA）= 大公司用海量数据训的基座，你拿来**微调**。
- 腿式小机器人的策略是小网络，每个任务从零在仿真里训几个小时；最接近微调的是续训（\`--resume\`、\`--base-model\`）。
- **边界**：训练环境开源 ≠ 硬件开源。Microduck 官方明确说别称它开源硬件；跳跳没开源 CAD、BOM、PCB。
`,
    },
  ],
  hangzhou: md`
**模拟案例：开发者生态 / 技术支持。** 杭州的宇树在 GitHub 上开源了 [unitree_rl_gym](https://github.com/unitreerobotics/unitree_rl_gym) 和基于 Isaac Lab 的 [unitree_rl_lab](https://github.com/unitreerobotics/unitree_rl_lab)，云深处有基于 Isaac Lab 的 [rl_training](https://github.com/DeepRoboticsLab/rl_training)（以仓库现状为准）。它们本质上就是本课说的「训练环境」，只是仿真器换成了英伟达的 Isaac。

客户问：「你们开源的训练环境，能直接用在我加了机械臂、换了电池的机器人上吗？」答题思路：训练环境里的机器人模型描述的是**出厂状态**；改了质量分布或执行器，就要先更新模型、重新训练，再按上机检查清单部署（[L8-5](#/lesson/l8-5)）。
`,
});

SITE.lesson({
  id: 'l8-4', level: 'L8', minutes: 12,
  title: '训练要什么电脑：Mac、NVIDIA 显卡、云 GPU',
  body: md`
:::info 这节课回答什么
你的 Apple 芯片 Mac（M4）能做到哪一步？什么时候必须要 NVIDIA 显卡？没有显卡怎么办？
:::

## 先看结论

| 项目 | Mac 上能做什么 | 按官方流程训练 |
|---|---|---|
| Open Duck Mini | 跑官方策略看效果（**已实测**，见 [L8-6](#/lesson/l8-6)） | 要 CUDA（依赖 \`jax[cuda12]\`） |
| Microduck | CPU 回放策略、跑仿真鸭、浏览器 Sandbox（**未实测**） | 官方写明「需要 CUDA 显卡」 |
| 跳跳 | 跑示例策略包；CPU 后端也能训（**未实测**） | 推荐 CUDA；CPU 官方实测慢约 32 倍 |

**推理 Mac 够用，训练要 NVIDIA（CUDA）。** 跳跳官方安装文档写明 macOS「没有 CUDA，没有例外」，要用 \`--backend native --device cpu\`（[AGENT_SETUP.zh.md](https://github.com/KingKongRobotics/jumper/blob/main/docs/AGENT_SETUP.zh.md)）。

## 官方给的训练算力数字

:::data 跳跳的官方实测（三家里数字最全）
同一台机器、4096 个并行环境（[DESIGN.md](https://github.com/KingKongRobotics/jumper/blob/main/docs/DESIGN.md)）：

| 硬件 | 每次迭代 | 占用 |
|---|---|---|
| RTX 5090 | 0.82 秒 | 5.4 GiB 显存 |
| i9-14900KF，32 线程 | 26 秒 | 20 GiB 内存 |

GPU 快约 32 倍。显卡支持 Ampere / Ada（CUDA 12.6 以上）和 RTX 50 系（必须 CUDA 12.8）。
:::

- **推断**：跳跳的三足步态任务默认 10,000 次迭代。按上面的数字，RTX 5090 约 2.3 小时，32 线程 CPU 约 72 小时。官方没说要跑满才能用，这只是量级参考。
- Colab 的 T4 跑通过 256 个环境、500 次迭代，但官方自己说这么短的训练「不代表步态收敛」。
- **Microduck**：要 CUDA 显卡；4096 个环境「约 1–2 小时得到可用步态」，没说用的什么显卡。
- **Open Duck Mini**：依赖 \`jax[cuda12]\`；README 推荐训练 3 亿步，没给耗时和显存要求。

:::analogy 为什么 GPU 快这么多
4096 只机器人同时在仿真里试错，就像同一个 testbench 同时起 4096 个实例跑回归。CPU 只有几十个线程分着跑，GPU 把它们摊到上万个计算核上一起跑。
:::

## 四种搞算力的办法

### A. 本地 NVIDIA 台式机
- 三个项目都**没写最低显卡**。**推断**：按跳跳 4096 环境实测占 5.4 GiB 显存，**8 GB 以上显存的 RTX 30 / 40 / 50 系**应该够入门；想多开环境、跑得舒服，选 16–24 GB。
- 系统：Linux 最省事。跳跳官方也支持 Windows；Open Duck 用的 JAX CUDA 版只有 Linux 安装包，Windows 要走 WSL2。

### B. 国内云 GPU（AutoDL 等）
- 按小时计费，用完关机就停止计费，适合「先训一次看看」。单价以平台实时价格为准。
- 选带 CUDA 12 的镜像，训练时可以不开画面（headless）。
- 跳跳的「打包上板」要用 Docker（转 RKNN、交叉编译）。云 GPU 实例本身一般就是容器，里面通常跑不了 Docker（以平台说明为准）。这一步可以回到 Mac 上用 Docker Desktop 做，官方说 Docker 在任何系统上都能做转换。
- 流程和租卡训 SmolVLA 一样：传代码、\`tmux\` 里开训、下载检查点、关机（[L4-4](#/lesson/l4-4)）。

### C. 官方的云端入口
- **跳跳**：[Colab 笔记本](https://colab.research.google.com/github/KingKongRobotics/jumper/blob/main/notebooks/jumper_colab.ipynb)，「你的电脑只需要浏览器」。需要能访问 Google。
- **Microduck**：训练命令后面加 \`--hf-jobs\`，在 Hugging Face 托管 GPU 上跑（默认 L4，可选 A10G、A100），费用记在你的 Hugging Face 账户（[HF Jobs 说明](https://github.com/pollen-robotics/microduck_rl/blob/develop/scripts/hf/README.md)）。需要能访问 Hugging Face。

### D. 硬用 Mac CPU
只有跳跳官方支持。适合跑通流程，或者改了奖励函数后先跑几轮看有没有报错。想训出能用的步态，还是上 GPU。

:::warn 网上的「8 GB 显存」说法
有资料说 Open Duck 训练要「8 GB 以上显存」，出处是 AI 生成的 DeepWiki，不是官方，这里没有采用。本课的 8 GB 是根据跳跳官方显存数字做的**推断**。
:::

:::tip 一句话记住
推理 Mac 够用；训练要 NVIDIA（CUDA）。没卡就先租云 GPU 或用 Colab / HF Jobs 跑通一次，Mac CPU 只适合冒烟测试。
:::
`,
  tasks: md`
- [ ] 用跳跳的官方数字，算一下 2000 次迭代在 RTX 5090 和 32 线程 CPU 上各要多久（答案：约 27 分钟 vs 约 14.4 小时）
- [ ] 查一下你常用的云 GPU 平台：有没有带 CUDA 12 的镜像，容器里能不能跑 Docker，记进笔记
- [ ] 给自己定一个「什么时候值得买 NVIDIA 台式机」的标准，例如每月租卡超过多少小时
`,
  quiz: [
    {
      q: '跳跳官方实测（4096 个环境），RTX 5090 比 32 线程 CPU 快约多少？',
      options: ['约 2 倍', '约 32 倍', '约 1000 倍', '一样快'],
      answer: 1,
      explain: '每次迭代 0.82 秒 vs 26 秒。',
    },
    {
      q: '根据官方显存数字推断，入门够用的显卡大约是？',
      options: ['任意集成显卡', '8 GB 以上显存的 RTX 30 / 40 / 50 系', '必须 80 GB 的数据中心卡', 'Mac 的 GPU 就够'],
      answer: 1,
      explain: '这是推断：4096 环境实测占 5.4 GiB 显存。三个项目都没写最低显卡。',
    },
    {
      q: '想在云端训练 Microduck，官方入口是？',
      options: ['Colab 笔记本', '训练命令加 `--hf-jobs`，跑在 Hugging Face 托管 GPU 上', '只能买官方服务器', '直接在鸭子上训'],
      answer: 1,
      explain: 'Colab 是跳跳的入口。HF Jobs 默认 L4 显卡，费用记在你的 Hugging Face 账户。',
    },
    {
      q: '在云 GPU 容器里做跳跳的「打包上板」，常见问题是？',
      options: ['没有 Python', '容器里通常跑不了 Docker；转 RKNN 和交叉编译可以回 Mac 用 Docker Desktop 做', 'GPU 太快', '不能上传代码'],
      answer: 1,
      explain: '以平台说明为准。官方说 Docker 在任何系统上都能做转换。',
    },
  ],
  interview: [
    {
      q: '客户问：训练你们机器人的行走策略，要配什么电脑？',
      a: md`
- **先拆开推理和训练**：推理在机器人上跑，小网络，算力很宽裕；训练才要 GPU。
- **训练按官方框架来**：MuJoCo Warp、JAX、Isaac 这类 GPU 仿真都要 NVIDIA（CUDA）。给个数量级：跳跳官方 4096 环境，RTX 5090 每次迭代 0.82 秒，CPU 慢约 32 倍。
- **建议路径**：先租云 GPU 或用官方云端入口跑通一次，再按每月训练时长决定买不买工作站；显存 8 GB 起步、16–24 GB 舒服（推断，以官方要求为准）。
- **落地细节**：Linux 最省事；云容器里一般跑不了 Docker，打包上板放到本地做。
`,
    },
  ],
  hangzhou: md`
**模拟案例：高校客户的采购咨询。** 一个实验室买了宇树或云深处的四足，想自己训步态，问「要配什么电脑？」宇树的 unitree_rl_lab、云深处的 rl_training 都基于英伟达 Isaac Lab（见 [L8-3](#/lesson/l8-3)），需要 NVIDIA 显卡。

好的回答不是报一个型号，而是给一条路径：先拆开推理和训练 → 用官方数字估训练时长 → 先租云 GPU 跑通 → 再决定买不买工作站。能把这笔账算清楚，客户才会信你后面的建议。这正是技术支持 / 解决方案岗每天在做的事。
`,
});

SITE.lesson({
  id: 'l8-5', level: 'L8', minutes: 15,
  title: '训练好怎么上真机 + 「在线训练」是什么',
  body: md`
:::info 这节课回答什么
训练出来的策略怎么装到机器人上？宣传里的「支持在线训练」到底指什么？
:::

## 通用链路：和移植固件一个思路
1. 训练得到检查点（比如 \`model_N.pt\`），只能在训练环境里用。
2. **导出 ONNX**：与训练框架无关的推理文件。导出时要把「观测归一化」一起烘进去，并记下关节顺序、缩放、增益。
3. （可选）**转成 NPU 格式**：跳跳把 ONNX 转成瑞芯微的 RKNN。
4. **拷到机器人上**，由机器人的运行时程序加载。
5. **运行时以固定频率循环**：读关节编码器和 IMU → 拼成观测向量 → 跑一次网络 → 换算成舵机目标角 → 写总线。

:::analogy
- 导出 ONNX、跑在树莓派或 NPU 上 ≈ 把 MATLAB 算法**移植到目标板固件**。
- 关节顺序、缩放、增益 ≈ 固件里的**寄存器映射表**：错一个就全错。
- 转 RKNN 并选精度 ≈ 在 DSP 上做**定点化**。
- 50 Hz 循环 ≈ **20 ms 的定时中断**：错过 deadline，机器人就会抖或者摔。
:::

更通用的「ONNX → 量化 → 编译 → 板端」流程见 [L5-3](#/lesson/l5-3)。

## 三家怎么上真机

### Open Duck Mini：最朴素
在树莓派 Zero 2W 上（也可以直接刷官方的 SD 卡镜像）：

~~~bash Open Duck Mini 运行时
git clone https://github.com/apirrone/Open_Duck_Mini_Runtime && cd Open_Duck_Mini_Runtime
git checkout v2 && pip install -e .
# 检查 14 个舵机都在线
python scripts/check_motors.py
# 标定零位偏差，写进 ~/duck_config.json
cd scripts && python find_soft_offsets.py
# 加载策略，开始走
python v2_rl_walk_mujoco.py --onnx_model_path <路径>/BEST_WALK_ONNX_2.onnx
~~~

- 控制 50 Hz，手柄指令 20 Hz；IMU 是 I²C 的 BNO055，脚底是两个 GPIO 开关，舵机走 USB 串口。
- 一条很「嵌入式」的设置：把 USB 转串口芯片的 \`latency_timer\` 设成 1 ms，否则串口读写延迟会拖垮控制环。

### Microduck：从 Hugging Face 一条命令装

~~~bash Microduck 导出、发布、安装
# 在电脑上：导出 ONNX
uv run scripts/export.py Mjlab-Velocity-Flat-MicroDuck --wandb-run-path <...>
# 发布到你的 Hugging Face 仓库
uv run publish --onnx output.onnx --repo <你的用户名>/microduck-my-walk --kind perpetual --slot walk

# 在鸭子上：装进「行走」槽位
sudo robotctl policy load walk <你的用户名>/microduck-my-walk
~~~

- 所有策略共用同一个 61 维观测、输出 14 维动作，所以运行时可以随时热切换（走路 ↔ 摔倒爬起 ↔ 特技）。发布工具会检查维度、有没有 NaN，不合格就拒绝上传。
- 15 个 XL330 舵机加一块 IMU 转接板，共 16 个设备挂在同一条 Dynamixel 2.0 串口总线上。用「快速同步读」，让总线每个周期只翻转一次方向，而不是 16 次（[robotd.toml](https://github.com/pollen-robotics/microduck/blob/main/deploy/robotd.toml)）。

### 跳跳：链路最完整，检查也最严

~~~bash 跳跳导出、打包、上板
# 导出 ONNX 和「合约」
python scripts/export.py --task jumper.tripod --checkpoint logs/<...>/model_<N>.pt
# 转 RKNN、交叉编译、打包 jumper.app
# （这一步要 Docker）
python scripts/deploy.py

# 拷到机器人上，按这个顺序执行：
# 1) 只打印参数来源，不碰总线
./runtime/board/controller --bundle . --dry-run
# 2) 回放参考帧，和打包那台机器逐项比对
./runtime/board/controller --bundle . --check-reference
# 3) 真正驱动
./runtime/board/controller --bundle . --machine /etc/mjrl/machine.toml
~~~

- 一个 \`.app\` 包里有三份：板子用 RKNN + aarch64 控制器，浏览器用 ONNX + WebAssembly，桌面仿真用 ONNX + 本地库，三端跑的是**同一份控制器代码**（[TUTORIAL.zh.md](https://github.com/KingKongRobotics/jumper/blob/main/docs/TUTORIAL.zh.md)）。
- 每一跳都自检：PyTorch → ONNX 误差 3e-7；ONNX → RKNN 用 fp16，误差约 1.1e-3。int8 量化实测误差 0.27，约等于关节差 3.9°，所以**默认不让用 int8**。
- \`--check-reference\` 最值得你注意：打包时录下一组「输入 → 输出」参考帧，到板子上再回放一遍逐项比对。这就是 DSP 移植里的 **golden vector / bit-exact 测试**。
- 再提醒一次：官方写明板端 RKNN 推理和电机总线循环**还没在真机验证**（见 [L8-3](#/lesson/l8-3)）。

## 部署时最常见的「静默错误」
跳跳文档有一句话说得好：「这条路上没有任何东西会大声失败。」错了也照样跑，只是动作不对：
- 关节**按下标**而不是按名字对应：从第 5 个关节往后全错。
- 某个方向的**符号反了**：机器人往后走，其他一切正常。
- 宿主的**控制频率**比训练时低：跳跃变成慢动作。
- 策略观测了**真机测不到的量**（比如机身线速度，真机上没有状态估计器）：导出时就该拒绝。

这些正是你做客户导入和量产调试时最熟悉的那类问题。

## 「在线训练」到底是什么

### 在强化学习里，「在线」本来就有

| 类型 | 数据怎么来 | 例子 |
|---|---|---|
| 离线训练 | 事先准备好，训练时只读不写 | 你的 ACT：反复读录好的 LeRobot 数据集 |
| 在线训练 | 一边和环境交互一边学；策略变了，下一批数据也跟着变 | 这三个项目用的 PPO，「环境」就是仿真器 |

所以技术上说它们「支持在线训练」几乎是废话：强化学习本来就这么训。

### 宣传里多半指「在云端训练」
- **Microduck**：[官网](https://pollen-robotics.com/microduck/)原话 "Behaviours are learned in physics sim, on your machine or on Hugging Face Jobs"：动作在物理仿真里学，可以在你自己的电脑上，也可以在 Hugging Face Jobs 上。
- **跳跳**：仓库里没有「在线训练」这个词，最接近的是 Colab 笔记本。官网还有一个浏览器里的模拟器，可以点地面让跳跳走过去，那是「在线体验」，不是训练。

### 它不是「真机边跑边学」
- Microduck 的配置文件里写着 "The model is trained in simulation only"（模型只在仿真中训练）。
- 跳跳的板端推理链路还在验证中，更谈不上在真机上训练。
- 让真机自己摔着学的「真机在线学习」在研究里有，但这三个项目都没有。如果有人这么宣传，可以追问一句。
- 还有一种「在线」：Open Duck Mini 的运行时可以用手柄实时微调步频偏置。那是**在线调参**，不是训练。

### 云端训练怎么做

~~~bash Microduck：提交到 Hugging Face Jobs
# 登录 Hugging Face
# wandb 可选，用来实时看训练曲线
hf auth login
wandb login
# 先看要提交什么，不计费
uv run train Mjlab-Velocity-Flat-MicroDuck --env.scene.num-envs 4096 --hf-jobs --dry-run
# 真正提交
uv run train Mjlab-Velocity-Flat-MicroDuck --env.scene.num-envs 4096 --hf-jobs
~~~

背后发生的事：本地把代码打包上传 → Hugging Face 拉起一台 GPU 容器 → 训练中每 60 秒把新检查点推到你账户下的私有仓库 → 结束后你下载、导出、发布。默认 12 小时超时自动停。

**跳跳用 Colab**：打开 [Colab 笔记本](https://colab.research.google.com/github/KingKongRobotics/jumper/blob/main/notebooks/jumper_colab.ipynb)，选 GPU 运行时；表单里选任务（默认 \`jumper.tripod\`、256 个环境、500 次迭代）→ 训练 → 看曲线和回放 → 导出 ONNX → 下载备份 ZIP。会话断了，上传 ZIP 可以续训。

:::tip 一句话记住
部署 = 导出 ONNX（必要时转 NPU 格式）+ 机器人上固定频率的「读 → 算 → 写」循环，关节映射错了**不会报错**。「在线训练」在强化学习里本来就是边交互边学，宣传里多半指**在云端训**，不是真机边跑边学。
:::
`,
  tasks: md`
- [ ] 把「静默错误」四条改写成一张上机前检查表（关节名字映射、方向符号、控制频率、观测来源），每条配一个验证方法
- [ ] 对照 [L5-3](#/lesson/l5-3) 的五步流程，把跳跳的「导出 → 转 RKNN → 回放参考帧 → 真正驱动」逐步对上
- [ ] 读一遍 Microduck 的 [robotd.toml](https://github.com/pollen-robotics/microduck/blob/main/deploy/robotd.toml)，找到控制频率和总线相关的配置
`,
  quiz: [
    {
      q: '部署时关节「按下标」而不是「按名字」对应，通常会怎样？',
      options: ['程序直接报错退出', '不报错，照样跑，但从某个关节往后动作全错', '只影响速度', '没有影响'],
      answer: 1,
      explain: '跳跳文档的原话：「这条路上没有任何东西会大声失败。」',
    },
    {
      q: '跳跳的 `--check-reference` 最像嵌入式里的什么？',
      options: ['看门狗', 'golden vector / bit-exact 回归测试', '烧录后的校验和', '功耗测试'],
      answer: 1,
      explain: '打包时录下「输入 → 输出」参考帧，上板回放逐项比对。',
    },
    {
      q: '跳跳默认不让用 int8 量化，原因是？',
      options: ['NPU 不支持 int8', 'int8 实测误差 0.27，约等于关节差 3.9°；fp16 只有约 1.1e-3', 'int8 反而更慢', '许可证限制'],
      answer: 1,
      explain: '精度和算力的取舍，和 DSP 定点化时选 Q 格式是同一类决策。',
    },
    {
      q: '宣传说某个开源机器人「支持在线训练」，最可能指？',
      options: ['机器人在真机上边跑边学', '在云端（HF Jobs、Colab 等）训练；而且强化学习本来就是边和仿真器交互边学', '在网页上看训练视频', '训练不需要电脑'],
      answer: 1,
      explain: 'Microduck 配置写明 "trained in simulation only"。真机在线学习在研究里有，这三个项目都没有。',
    },
  ],
  interview: [
    {
      q: '策略部署到板端，你会注意什么？',
      a: md`
- **导出**：观测归一化烘进 ONNX；关节顺序、缩放、增益写成表，**按名字**对应，不按下标。这就是固件的寄存器映射表。
- **精度**：每一跳都比对误差。跳跳的数字：PyTorch → ONNX 3e-7，ONNX → RKNN fp16 约 1.1e-3，int8 误差 0.27（约 3.9°）所以默认不用。
- **上机顺序**：先 dry-run 只看参数 → 再回放参考帧逐项比对（bit-exact 思路）→ 最后才真驱动总线。
- **时序**：控制频率和训练时一致，留足 deadline 余量；串口延迟（\`latency_timer\` 设 1 ms）、总线同步读。
- **加一个自己的数字**：「我在 Mac 上测过 Open Duck 的策略，一次推理 11 µs，只占 20 ms 周期的 0.14%，所以瓶颈不在算力，在总线时序和 sim2real。」
`,
    },
    {
      q: '宣传说「支持在线训练」，你怎么理解？',
      a: md`
- **技术含义**：强化学习本身就是在线的，一边和环境（仿真器）交互一边学；区别于 ACT 那种读固定数据集的离线训练。
- **宣传含义**：多半指在云端训练。Microduck 官网原话 "on your machine or on Hugging Face Jobs"；跳跳最接近的是 Colab。
- **不是**真机边跑边学：Microduck 配置写明 "trained in simulation only"。
- 如果客户这么理解了，要主动澄清，避免他按「真机自学」去规划项目。
`,
    },
  ],
  hangzhou: md`
**模拟案例：四足公司的 FAE / 部署支持。** 杭州的云深处在 GitHub 上开源了做 sim-to-sim、sim-to-real 部署的 [sdk_deploy](https://github.com/DeepRoboticsLab/sdk_deploy)（以仓库现状为准）。假设客户反馈：「自己训的策略部署上去，机器狗往后走。」

你按本课的「静默错误」清单查：方向符号 → 关节按名字对应 → 控制频率 → 观测里有没有真机测不到的量。查清之后，把它写成开发者 FAQ 和上机检查表。这和做 SDK 客户导入时写 Known Issues、出导入检查表是同一件事。
`,
});

SITE.lesson({
  id: 'l8-6', level: 'L8', minutes: 15,
  title: 'Mac 实测 Open Duck Mini + 入门路线 + 求职视角',
  body: md`
:::info 这节课回答什么
不买硬件、没有 NVIDIA 显卡，现在就能做什么？下一步怎么走？这些项目对在杭州找机器人岗位有什么用？
:::

## Mac 上实测：Open Duck Mini 官方行走策略
在 Apple 芯片 Mac（M4）的 CPU 上，用官方训好的策略 \`BEST_WALK_ONNX_2.onnx\` 跑了 14 秒仿真：站 2 秒、前进 8 秒、原地转 4 秒。

![Open Duck Mini v2 官方策略在 Mac CPU 上行走](assets/img/open_duck_walk_mac_cpu_2x2.png "从左到右、从上到下：t = 1、5、9、13 秒。相机跟随机身，最后一帧已转身。点图看大图。")

:::data 实测结果（2026-10-15，Apple 芯片 Mac，M4，CPU）
| 项 | 数值 |
|---|---|
| 策略频率 | 50 Hz（仿真步长 2 ms，每 10 步推理一次） |
| 单次推理 | 中位数 **11 µs**，p99 26 µs |
| 单个控制周期 | 拼观测 + 推理 + 限速共 28 µs，占 20 ms 的 **0.14%** |
| 仿真速度 | 14 秒仿真用 0.31 秒，约实时的 **45 倍** |
| 稳定性 | 全程没摔，最大倾角 7.3° |
| 速度跟踪 | 指令 0.15 m/s，实际约 0.09 m/s（仿真里也没完全跟上） |
:::

:::analogy 11 µs 对 20 ms 意味着什么
就像一个 20 ms 的定时中断，ISR 只用了 28 µs，CPU 占用 0.14%。**推理算力不是问题**，难的是训练（要 GPU）和 sim2real（要调模型和参数）。和做 DSP 一样：算法跑得动只是第一步，难的是在真实硬件上稳定。

对比 ACT：它带视觉骨干，Mac GPU 上一次 12–174 ms（[L2-5](#/lesson/l2-5)），所以才需要动作分块；行走策略只吃关节角和 IMU，每个控制周期推理一次就够。
:::

**怎么跑的**：官方推理脚本要开 MuJoCo 窗口，学习包里的 \`lab/duck/run_duck_headless.py\` 改成了无窗口版本，观测拼装和动作处理照搬官方代码。官方训练环境依赖 \`jax[cuda12]\`，Mac 装不上，这里只装 CPU 版 \`playground\` 满足 import，推理本身只用 MuJoCo + onnxruntime。依赖装好约 0.9 GB。

~~~bash 复现（在 lab/duck 目录）
git clone --depth 1 https://github.com/apirrone/Open_Duck_Playground.git
curl -L -o BEST_WALK_ONNX_2.onnx https://github.com/apirrone/Open_Duck_Mini/raw/v2/BEST_WALK_ONNX_2.onnx
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python "playground>=0.0.3" "onnxruntime>=1.20.1" pillow
.venv/bin/python run_duck_headless.py
~~~

## 入门路线：先软件后硬件，先鸭子后螃蟹
1. **Open Duck Mini 在 Mac 上回放**：已完成（就是上面的实测）。
2. **跳跳在 Mac CPU 上跑示例包，做一次冒烟训练**（仓库约 230 MB，**未实测**，命令见下）。
3. **租 GPU 训一个步态**：跳跳先训 \`jumper.tripod\`（Colab 或 AutoDL）；Microduck 用 \`--hf-jobs\` 训 \`Mjlab-Velocity-Flat-MicroDuck\`，官方说 4096 个环境 1–2 小时出可用步态；Open Duck 要 Linux + NVIDIA。
4. **再决定买哪台真机**（见下面的对比）。

~~~bash 第 2 步：跳跳在 Mac 上回放 + 冒烟训练（未实测）
git clone https://github.com/KingKongRobotics/jumper.git && cd jumper
python3.12 -m venv .venv && source .venv/bin/activate
# Mac 装 CPU 版 PyTorch，不要加 --index-url
pip install torch torchvision
pip install -e .
python scripts/train.py --list
# 回放官方示例包（Mac 开窗口要用 mjpython）
.venv/bin/mjpython scripts/play.py --app out/bundle_example/jumper.app
# 冒烟训练：CPU 后端、64 个环境、3 次迭代
python scripts/train.py --task jumper.flat --backend native --device cpu --num_envs 64 --max-iterations 3 --headless
~~~

Microduck 不想装东西：直接在浏览器里玩 [Microduck Sandbox](https://huggingface.co/spaces/pollen-robotics/microduck-simulator)。想在 Mac 上回放官方策略，可以跑 \`microduck_rl\` 的 \`scripts/infer_policy.py\`（**未实测**，可能要折腾依赖）。社区有在普通 Mac 上训 Microduck 的项目，例如 [microduck-lab](https://github.com/jonathanhawkins/microduck-lab)，非官方，**未验证**。

## 如果只选一台真机

| 选它 | 适合 | 缺点 |
|---|---|---|
| Open Duck Mini | 想最快上手、最懂底层：全开源，舵机和 SO-101 同款 | 项目已不太活跃，主要靠社区 |
| Microduck | 想要成品和最活跃的生态 | 国内购买渠道**没查到**；硬件设计不开源 |
| 跳跳 | 想研究六足、跳跃和 NPU 部署 | 真机链路官方还在打通；零售价**没查到**，现在的渠道是动作大赛和联系销售 |

Open Duck 可以自己造：按官方 BOM（中文版在子豪兄飞书）买件、3D 打印、组装。官方称整套低于 400 美元，以官方 BOM 和淘宝实际为准。你装 SO-101 时已经配过 STS3215 的 ID、校过零位，这一步会比大多数人快。

## 求职视角：哪些经验能直接迁移
- **舵机总线**：半双工串口、同步读写、ID 配置、总线利用率、USB 串口延迟。Microduck 为了让 16 个设备每周期只翻转一次总线方向，专门用了「快速同步读」。
- **实时控制环**：50 Hz / 1 kHz、抖动、deadline、看门狗。跳跳的文档自己承认还没做 \`SCHED_FIFO\`、\`mlockall\` 和抖动统计；Microduck 的配置里写着，50 Hz 是当年在树莓派上定的，换到 Radxa 板子后「从没重新推导过」。
- **IMU**：安装方向（Open Duck 有「IMU 倒装」配置项）、坐标系、采样率和滤波。
- **延迟和时序**：Microduck 把「指令延迟」放进了域随机化。你能讲清延迟从哪来、怎么测（[L5-4](#/lesson/l5-4)）。
- **NPU 部署和量化**：跳跳的 fp16 / int8 取舍，和 DSP 定点化是同一类决策。
- **OTA 和现场调试**：Microduck 的升级要签名、做健康检查、可回滚；跳跳的参考帧回放，就是量产测试里的 bit-exact 对比。

:::warn 没能核实、需要你留意的地方
- 「micro duck」指 Microduck 是判断，把握较高；也可能是 Open Duck Mini，所以两个都讲了。
- Microduck 第 15 个电机是嘴，是**推断**。
- 「8 GB 以上显存」是根据跳跳的实测显存**推断**的；跳跳 10,000 次迭代的耗时是用官方单次迭代时间乘出来的**推断**。
- 跳跳和 Microduck 在 Mac 上的回放和训练只读了文档，**未实测**；实测的只有 Open Duck Mini。
- 跳跳的价格和购买渠道、Microduck 的国内购买渠道，都**没查到**官方说法；动作大赛的具体规则页面要登录加载，没读到。
- 跳跳板端部署的状态：项目指南和部署文档写「尚未在真机验证」，教程里又提到板上回放参考帧结果为 0，两处说法有出入，以官方后续更新为准。
- 星数、价格、「尚未验证」这类状态变化很快。资料核实时间 2026-10-15，以链接里的最新内容为准。
:::

:::tip 一句话记住
推理 11 µs、只占 20 ms 周期的 0.14%：**瓶颈不在算力，在总线时序和 sim2real**。路线是先软件后硬件、先鸭子后螃蟹；求职时把舵机总线、实时控制环、bit-exact 验证这些经验翻译成机器人语言。
:::
`,
  tasks: md`
- [x] 在 Mac 上回放 Open Duck Mini 官方行走策略（学习包里已完成，数字见上）
- [ ] 打开 [Microduck Sandbox](https://huggingface.co/spaces/pollen-robotics/microduck-simulator) 玩 10 分钟，记下一个你觉得像「控制环问题」的现象
- [ ] 在 Mac 上跑一次跳跳的示例包回放和冒烟训练，记录耗时和报错
- [ ] 把「11 µs vs 20 ms」写成 3 句话的面试回答，练到 30 秒内说完
`,
  quiz: [
    {
      q: 'Mac 实测 Open Duck Mini 策略，单个控制周期（拼观测 + 推理 + 限速）占 20 ms 的多少？',
      options: ['约 50%', '约 14%', '约 0.14%', '超过 100%，会掉帧'],
      answer: 2,
      explain: '28 µs ÷ 20 ms ≈ 0.14%。推理算力不是瓶颈。',
    },
    {
      q: '为什么行走策略不需要像 ACT 那样做动作分块？',
      options: ['行走策略不用推理', '它只吃关节角和 IMU，网络很小（ONNX 约 1 MB），每个控制周期推理一次就够', '行走不需要实时', '因为它跑在 GPU 上'],
      answer: 1,
      explain: 'ACT 带视觉骨干，一次几十毫秒，所以一次出一串动作。',
    },
    {
      q: '「先软件后硬件，先鸭子后螃蟹」的第一步是？',
      options: ['直接买跳跳真机', '在 Mac 上回放 Open Duck Mini 官方策略', '租 8 张 GPU 训人形', '自己画 PCB'],
      answer: 1,
      explain: '零花费，而且已经实测跑通。',
    },
    {
      q: '客户说「仿真里走得好、真机上抖」，最先查什么？',
      options: ['换一个更大的网络', '控制环的真实频率、抖动和总线丢包', '重新采集示教数据', '换显卡'],
      answer: 1,
      explain: '先查时序和链路，再看增益、齿隙、电池电压，最后才怀疑策略本身。',
    },
  ],
  interview: [
    {
      q: '你测过策略推理吗？结果说明什么？',
      a: md`
- **数字**：在 Apple 芯片 Mac（M4）的 CPU 上跑 Open Duck Mini 官方行走策略，一次推理中位数 **11 µs**（p99 26 µs）；拼观测 + 推理 + 限速共 28 µs，只占 50 Hz（20 ms）周期的 **0.14%**；14 秒仿真全程没摔。
- **结论**：这类只吃关节角和 IMU 的小网络，算力不是瓶颈，官方在树莓派 Zero 2W 上就跑 50 Hz。瓶颈在总线时序（半双工舵机总线、USB 串口延迟）、控制环抖动和 sim2real。
- **对比**：ACT 带视觉骨干，一次几十毫秒，所以要动作分块；行走策略每周期推理一次就够。
- 收尾：「就像 DSP 算法 MCPS 余量很大时，问题往往出在 DMA 和中断时序上。」
`,
    },
    {
      q: '客户说机器人在仿真里走得好、真机上抖，你怎么排查？',
      a: md`
- **先查控制环**：真实频率和抖动、总线有没有丢包、USB 串口延迟（\`latency_timer\`）。
- **再对比响应**：同一组输入下，对比仿真和真机的关节响应（Microduck 的 \`infer_policy.py --save-csv\` 和仓库里的 sim2real 测试脚本就是干这个的）。
- **然后看硬件参数**：增益、齿隙、电池电压。
- **最后才怀疑策略**：要不要更准的执行器模型、更宽的域随机化范围。
- 收尾：「这就是量产问题定位的分层思路：先时序和链路，再器件，最后动算法。」
`,
    },
  ],
  hangzhou: md`
**杭州的腿式机器人公司，走的是同一套流程。**
- **宇树科技**（四足、人形）：开源了 [unitree_rl_gym](https://github.com/unitreerobotics/unitree_rl_gym) 和基于 Isaac Lab 的 [unitree_rl_lab](https://github.com/unitreerobotics/unitree_rl_lab)。
- **云深处科技**（四足）：GitHub 上有基于 Isaac Lab 的 [rl_training](https://github.com/DeepRoboticsLab/rl_training)，和做 sim-to-sim、sim-to-real 部署的 [sdk_deploy](https://github.com/DeepRoboticsLab/sdk_deploy)。

和本专题的小机器人一样，都是「仿真训练 → 导出 → 真机部署」，只是仿真器换成了英伟达的 Isaac。客户（开发者、高校、行业客户）买四足或人形回去，第一件事往往就是「用你们的仿真环境训一个策略，部署到真机上」。客户卡在哪一步，就是面向客户的技术岗要解决的问题。

**可关注的方向**：技术支持 / FAE、解决方案、开发者生态、技术产品（方向参考，以招聘页为准，见 [L7-1](#/lesson/l7-1) 和 [杭州公司地图](#/hangzhou)）。

**能带去面试的作品**：本课的 Mac 实测数字 + 一页「仿真策略上机检查表」（[L8-5](#/lesson/l8-5)），再配一个你自己的 bit-exact 验证故事（[L7-3](#/lesson/l7-3)）。
`,
});
