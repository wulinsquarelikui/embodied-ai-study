/* 术语表：AI / 机器人词汇 ↔ 嵌入式对照。link 指向最相关的一课 */
SITE.glossary = [
  { term: '预训练', en: 'Pre-training', plain: '大公司用海量数据和大规模 GPU 训练出「什么都会一点」的基座模型。', analogy: '芯片原厂的通用算法库和参考固件。', link: '#/lesson/l1-1' },
  { term: '后训练 / 微调', en: 'Post-training / Fine-tuning', plain: '用自己机器人、自己任务的几十到几百条示教，在基座上继续训练。', analogy: '客户导入时针对整机调 EQ、AEC 参数。', link: '#/lesson/l1-1' },
  { term: '从零训练', en: 'Training from scratch', plain: '小模型从随机初始化开始学，只会这一个任务（ACT、Diffusion）。', analogy: '为一个专用功能从头写算法。', link: '#/lesson/l1-1' },
  { term: '基座模型', en: 'Foundation model', plain: '预训练得到的通用模型，如 π0、GR00T、LingBot-VLA、SmolVLA。', analogy: '通用 SDK / 参考设计。', link: '#/lesson/l1-5' },
  { term: 'VLA', en: 'Vision-Language-Action', plain: '视觉语言大模型 + 动作头，能听懂语言指令并输出关节动作。', analogy: '高算力 SoC + 大模型：能做很多事，但功耗、成本、延迟都高。', link: '#/lesson/l1-5' },
  { term: 'ACT', en: 'Action Chunking with Transformers', plain: 'ResNet 看图 + Transformer 一次输出未来 100 步动作的小模型；lab 实测 51.6M 参数。', analogy: '专用 DSP 算法：便宜、快、只做一件事。', link: '#/lesson/l2-3' },
  { term: 'SmolVLA', en: '', plain: 'Hugging Face 的小型 VLA，约 4.5 亿参数，从 lerobot/smolvla_base 微调。', analogy: '', link: '#/lesson/l3-5' },
  { term: '模仿学习', en: 'Imitation Learning / Behavior Cloning', plain: '给模型看「画面 + 关节」，让它模仿人类示教接下来的动作。', analogy: '用 golden 输入输出对拟合一个系统。', link: '#/lesson/l1-4' },
  { term: 'action', en: '', plain: '主动臂位置，人手的意图，是模型要学的标准答案。', analogy: '主机发出的命令。', link: '#/lesson/l1-3' },
  { term: 'observation.state', en: '', plain: '从动臂实际到达的位置，是模型输入之一，比 action 慢 1–3 帧。', analogy: '从机的响应 / 回读值。', link: '#/lesson/l1-3' },
  { term: '示教 / episode', en: 'Episode', plain: '一次完整的任务演示，握手数据集每条约 11 秒。', analogy: '一段录音样本。', link: '#/lesson/l2-2' },
  { term: '归一化参数', en: 'Normalization stats', plain: '数据集的均值和方差，训练和推理必须用同一份（preprocessor / postprocessor）。', analogy: '传感器校准参数 / 执行器标定参数。', link: '#/lesson/l1-4' },
  { term: 'step', en: '', plain: '参数更新一次。', analogy: '一次迭代。', link: '#/lesson/l1-4' },
  { term: 'batch size', en: '', plain: '一次喂给模型的样本数，受显存限制。', analogy: '一次 DMA 搬几帧。', link: '#/lesson/l1-4' },
  { term: 'epoch', en: '', plain: '把全部训练数据过一遍。9454 帧、batch 8 约 1180 步。', analogy: '', link: '#/lesson/l1-4' },
  { term: 'loss / L1', en: '', plain: '预测和答案的差距。ACT 的 loss = L1 + 10 × KL 散度，看效果要看 L1。', analogy: '误差指标。', link: '#/lesson/l4-2' },
  { term: '过拟合', en: 'Overfitting', plain: '训练集 loss 很低、验证集很高：背答案，没学会泛化。', analogy: '只在 golden sample 上调通。', link: '#/lesson/l1-4' },
  { term: '验证集', en: 'Validation set', plain: '不参与训练、用来检验泛化的数据，lab 用第 28、29 条示教。', analogy: '实验室测试集 vs 客户现场。', link: '#/lesson/l2-3' },
  { term: 'checkpoint', en: '', plain: '训练中途存的模型目录，含权重、配置和归一化参数。', analogy: '固件版本快照。', link: '#/lesson/l1-4' },
  { term: '动作分块', en: 'Action chunking', plain: '一次预测未来一段动作（ACT 默认 100 步 = 3.3 秒）。', analogy: 'DMA buffer：大 buffer 稳但延迟大。', link: '#/lesson/l5-1' },
  { term: 'n_action_steps', en: '', plain: '每次推理后实际执行多少步，推理时可调。', analogy: '每次处理后消耗多少帧再刷新。', link: '#/lesson/l5-1' },
  { term: 'temporal ensembling', en: '', plain: '每帧推理，把同一时刻的多次预测按指数权重平均；平滑但滞后。', analogy: 'crossfade / 低通滤波，带相位滞后。', link: '#/lesson/l5-1' },
  { term: '同步推理', en: 'Synchronous inference', plain: '队列空了才推理，推理期间控制回路阻塞；LeRobot 默认。', analogy: '单缓冲，处理慢就 buffer underrun。', link: '#/lesson/l5-2' },
  { term: '异步推理', en: 'Asynchronous inference', plain: '一边执行当前块一边算下一块；LeRobot 有 async_inference（server / client）。', analogy: '乒乓双缓冲。', link: '#/lesson/l5-2' },
  { term: 'RTC', en: 'Real-Time Chunking', plain: '后台线程异步生成动作块，并把新块和旧块剩余部分平滑衔接；lerobot-rollout --inference.type=rtc。', analogy: '双缓冲 + crossfade 时间对齐。', link: '#/lesson/l5-2' },
  { term: 'lerobot-rollout', en: '', plain: '新版 LeRobot 的推理部署命令，替代旧教程的 lerobot-record --policy.path。', analogy: 'SDK 升级后改名的 API。', link: '#/lesson/l3-6' },
  { term: '开环评估', en: 'Open-loop evaluation', plain: '把录好的画面喂给模型比对输出，误差不会累积。', analogy: '离线仿真测试。', link: '#/lesson/l4-5' },
  { term: '闭环评估', en: 'Closed-loop evaluation', plain: '模型真的控制机器人，误差会滚雪球；看真机成功率。', analogy: '上板实测。', link: '#/lesson/l4-5' },
  { term: 'MPS / CUDA', en: '', plain: 'Mac 和 NVIDIA 的 GPU 加速后端；CUDA 版本要和驱动匹配。', analogy: '不同芯片的编译器和运行时。', link: '#/lesson/l1-2' },
  { term: 'ONNX', en: '', plain: '与训练框架无关的模型标准格式。部署到 NPU 前先导出；腿式小机器人的行走策略也直接用 ONNX 在 CPU 上跑。导出时要带上观测归一化，记下关节顺序和缩放。', analogy: '可移植的 C 参考实现；关节顺序表 ≈ 寄存器映射表。', link: '#/lesson/l5-3' },
  { term: 'RKNN', en: '', plain: '瑞芯微 NPU 的模型格式和工具链。跳跳把 ONNX 转成 RKNN（默认 fp16，int8 误差太大不默认用）在 RK3576 的 NPU 上跑。', analogy: '厂商 DSP 的专用编译器和库。', link: '#/lesson/l8-5' },
  { term: '量化', en: 'Quantization', plain: 'FP32 → INT8，需要校准数据统计激活范围；可能掉精度。', analogy: '定点化（Q15 / Q31）。', link: '#/lesson/l5-3' },
  { term: '混合精度', en: 'Mixed precision', plain: '敏感层保留高精度，其余量化。', analogy: '关键路径用 32 位、其余用 16 位定点。', link: '#/lesson/l5-3' },
  { term: '算子回退', en: 'Operator fallback', plain: 'NPU 不支持的算子回到 CPU 执行，延迟暴涨。', analogy: '没有 intrinsic 时退回标量 C 代码。', link: '#/lesson/l5-3' },
  { term: 'NPU / BPU', en: '', plain: '神经网络加速器；BPU 是地平线 / 地瓜 RDK 的叫法。', analogy: 'DSP 之于音频算法。', link: '#/lesson/l5-3' },
  { term: 'p50 / p99', en: '', plain: '延迟的中位数和 99 分位；实时系统按 p99 设计。', analogy: '最坏情况执行时间（WCET）。', link: '#/lesson/l2-5' },
  { term: '控制周期', en: 'Control period', plain: '30Hz 下 33.3 ms，是推理和下发的 deadline。', analogy: '音频帧周期。', link: '#/tools/budget' },
  { term: '端到端延迟', en: 'End-to-end latency', plain: '从场景变化到机械臂开始动作的总延迟：相机 + 预处理 + 推理 + 排队 + 总线 + 伺服。', analogy: 'mic in → speaker out 的总延迟。', link: '#/lesson/l5-4' },
  { term: '主动臂 / 从动臂', en: 'Leader / Follower', plain: '人拖动主动臂，从动臂跟随并装相机干活。', analogy: '主机 / 从机。', link: '#/lesson/l3-2' },
  { term: 'STS3215', en: '', plain: 'SO-ARM101 用的飞特串行总线舵机，每个有自己的 ID。', analogy: '总线上的从设备，要分地址。', link: '#/lesson/l3-2' },
  { term: '遥操作', en: 'Teleoperation', plain: '人远程操控机器人做示教，链路延迟和抖动决定数据质量。', analogy: '低延迟无线链路。', link: '#/lesson/l3-3' },
  { term: 'PTP', en: 'IEEE 1588', plain: '网络精确时间同步协议，用于多传感器时间对齐。', analogy: '多设备音频同步的主时钟。', link: '#/lesson/l6-2' },
  { term: 'sim2real', en: 'Sim-to-real', plain: '把仿真里训练的策略迁移到真机；差异来自物理、执行器、传感器、延迟、渲染。腿式机器人主要靠「执行器建模 + 域随机化」来过。', analogy: '流片前仿真 / FPGA 原型到真实硅片。', link: '#/lesson/l6-3' },
  { term: '域随机化', en: 'Domain randomization', plain: '训练时故意把摩擦、质量、电池电压、指令延迟等在一个范围内随机，让策略对仿真和现实的差异更鲁棒（Microduck 就随机化了电池电压、压降、延迟和摩擦）。', analogy: 'PVT / 工艺角（corner）测试。', link: '#/lesson/l8-2' },
  { term: '强化学习', en: 'Reinforcement learning, RL', plain: '不给示范，只给奖励函数，让策略在环境（通常是仿真器）里反复试错、自己学会；腿式机器人的行走基本靠它（仿真 + RL）。', analogy: '用代价函数驱动的自动调参：只定义什么算好，不告诉它怎么调。', link: '#/lesson/l8-2' },
  { term: '奖励函数', en: 'Reward function', plain: '强化学习的打分规则：跟上速度指令加分、摔倒扣分、动作抖扣分……写偏了策略会钻空子。', analogy: '自动调参的代价函数 / 验收打分表。', link: '#/lesson/l8-2' },
  { term: 'PPO', en: 'Proximal Policy Optimization', plain: '三个开源小机器人（Microduck、跳跳、Open Duck Mini）都用的强化学习算法，属于在线强化学习：边和仿真器交互边更新策略。', analogy: '', link: '#/lesson/l8-2' },
  { term: '策略', en: 'Policy', plain: '机器人的控制网络：输入观测（关节角、IMU、速度指令），输出关节目标。腿式行走策略很小（ONNX 约 1 MB），50 Hz 每周期推理一次。', analogy: '控制环里那段控制算法，跑在定时中断里。', link: '#/lesson/l8-2' },
  { term: '自由度', en: 'Degrees of Freedom, DoF', plain: '能独立驱动的关节数；小机器人上基本等于舵机个数（SO-101 6、Open Duck Mini 14、Microduck 15、跳跳 22）。策略输出维度可能更少，被动关节不算。', analogy: '独立控制的执行器通道数。', link: '#/lesson/l8-1' },
  { term: 'MuJoCo / MJX', en: '', plain: 'DeepMind 开源的物理仿真器，三个开源小机器人都用它。MJX 是它的 JAX 版，能在 GPU 上大批量并行（Open Duck 用的 MuJoCo Playground 基于它）；mjlab 用的是另一个 GPU 后端 MuJoCo Warp（Microduck、跳跳）。', analogy: '流片前的芯片仿真器。', link: '#/lesson/l8-3' },
  { term: 'URDF / MJCF', en: '', plain: '描述机器人的文件格式：零件质量、惯量、关节限位、舵机参数。URDF 是 ROS 通用格式，MJCF 是 MuJoCo 的原生格式。', analogy: '器件的 SPICE / 行为模型。', link: '#/lesson/l8-3' },
  { term: '在线 / 离线强化学习', en: 'Online / Offline RL', plain: '在线：一边和环境（仿真器）交互一边学，数据训练中现场产生（PPO）。离线：只用事先录好的数据集训练；ACT 模仿学习也是离线训练。宣传里的「在线训练」多半指在云端训练。', analogy: '在线 ≈ 接着硬件边跑边调参；离线 ≈ 拿录好的 log 回放调参。', link: '#/lesson/l8-5' },
  { term: '云端训练', en: 'Cloud training', plain: '把训练放到云 GPU 上：AutoDL 等按小时租卡，或用官方入口（跳跳的 Colab、Microduck 的 Hugging Face Jobs）。', analogy: '把仿真任务提交到服务器集群上跑。', link: '#/lesson/l8-4' },
  { term: 'DAgger', en: 'Dataset Aggregation', plain: '模型执行、人在出错时纠正，把纠正数据加回训练集。', analogy: '现场问题回灌到回归测试集。', link: '#/lesson/l4-1' },
  { term: '大脑 / 小脑 / 关节', en: '', plain: '人形分层：VLA 1–10 Hz、运动控制 100–1000 Hz、电机驱动 kHz 级。', analogy: 'AP / DSP / 外设控制器的分工。', link: '#/lesson/l6-1' },
  { term: 'EtherCAT / CAN-FD', en: '', plain: '关节控制器常用的实时总线。', analogy: '确定性的板级总线。', link: '#/lesson/l6-1' },
  { term: 'ego-noise', en: '', plain: '机器人自身电机、减速器、风扇产生的噪声。', analogy: '非平稳噪声，参考信号可用电机状态。', link: '#/lesson/l6-4' },
  { term: '开发态 / 部署态', en: '', plain: '卖给开发者和科研 vs 在真实场景常态化作业（行业里常用的一种区分）。', analogy: 'EVB 评估板 vs 客户整机量产。', link: '#/lesson/l0-2' },
  { term: 'POC', en: 'Proof of Concept', plain: '在客户现场证明方案可行，产出带置信区间的成功率和风险清单。', analogy: '客户样机验证。', link: '#/lesson/l6-5' },
  { term: 'NPI', en: 'New Product Introduction', plain: '新产品导入量产：一致性标定、出厂测试、良率。', analogy: '芯片 / 整机量产导入。', link: '#/lesson/l6-5' },
];

SITE.about = md`
## 关于这个学习站
- **内容来源**：学习包 \`README.md\`、\`docs/01–03\`、\`lab/\` 的脚本和实测日志（2026-09-24，Apple 芯片 Mac，M4，24GB）；L4–L6 的扩展内容来自公开资料；杭州公司信息只写概括性的公开定位和官网入口，不写型号参数、出货量、融资上市进展和地址，最后核实 2026-10。
- **实测数据**：数据集 30 条示教 / 10113 帧 / 30Hz；ACT 51.6M 参数，3000 步 13.3 分钟；chunk100 / chunk10 / ensemble 的最大单帧跳变 72.05 / 42.04 / 2.78（人类 5.44）；Mac GPU 推理 p50 12.2 / 23.6 / 174.2 ms（216×384 / 480×640 / 1080p）。原始日志：[train_log.txt](assets/logs/train_log.txt)、[inference_log.txt](assets/logs/inference_log.txt)。
- **飞书教程**：同济子豪兄《LeRobot 具身智能》<https://zihao-ai.feishu.cn/wiki/TS6swApHbinx01kHDi5cf5n5n8c>
- **免责**：公司相关内容是「公开定位概括 + 典型场景 / 模拟案例」，不代表任何公司的内部信息、在招岗位或薪资；投递前以官网和招聘页为准。

## 离线和更新
- 打开过的页面断网也能看，进度只保存在你自己的浏览器里。
- 手机访问：直接用手机浏览器打开本站网址，可以「添加到主屏幕」。
- 修改课程：编辑 \`site/content/\` 下对应模块的文件；改完后把 \`index.html\` 里所有 \`?v=\` 的值和 \`sw.js\` 里的 \`CACHE\` 版本号改成新的，旧缓存会被自动清掉。
`;
