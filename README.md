# F1 Web Color Guidelines Skill

一个面向网页设计与前端实现的 Codex skill，用来把 F1 车队的视觉语言转成可执行的网页配色规范。

当前版本已完整覆盖 2026 赛季全阵容全部 11 支车队：

- Mercedes-AMG PETRONAS (W17)
- Scuderia Ferrari (SF-26)
- McLaren Mastercard F1 Team (MCL40)
- Aston Martin Aramco F1 Team (AMR26)
- Cadillac Formula 1 Team (MAC-26)
- Atlassian Williams F1 Team (FW48)
- Oracle Red Bull Racing (RB22)
- Audi Revolut F1 Team (R26)
- BWT Alpine F1 Team (A526)
- Visa Cash App Racing Bulls (VCARB 03)
- TGR Haas F1 Team (VF-26)

这个 skill 适合以下任务：

- 设计或改造车队风格网页
- 生成网页配色方案和 design tokens
- 输出 CSS variables / Tailwind 颜色映射
- 生成给 AI 设计工具使用的提示词
- 审查现有页面是否“像这支车队”，而不是只是“换了个颜色”

## 仓库内容

```text
。
├─ README.md
├─ SKILL.md
├─ references/
│  ├─ 11 支车队 2026 视觉设计指引 (aston-martin, mercedes, mclaren, ferrari, cadillac, williams, red-bull, audi, alpine, racing-bulls, haas)
│  ├─ web-craft.md              ← 字体/形状/材质/动效/构图的跨车队配方
│  ├─ cross-team-methodology.md
│  └─ official-2026-sources.md
├─ assets/
│  ├─ surface/                  ← 共享核心：WebGL PBR 车漆、PMREM 摄影棚天穹、SVG 贯穿赛道线与车队预设
│  └─ templates/                ← 可直接双击打开的单文件 HTML 基准模板
│     ├─ <team>-surface.html    ← 连续车身 PBR + 贯穿涂装线模式（双击直接运行）
│     ├─ <team>-editorial.html  ← 11 队各一个浅色杂志模式（默认主参考）
│     └─ aston-martin.html      ← 深色 Mission Control（dashboard 场景）
├─ showcase/                    ← React + Vite + Tailwind CSS + React Bits 动效工程化 Showcase
├─ tokens/                      ← 色板单一来源：<team>.json，tokens.css 由脚本生成（[data-f1-team="…"] 作用域的 CSS 变量）
├─ scripts/
│  ├─ build-templates.mjs       ← 递归内联生成单文件模板的构建脚本
│  ├─ sync-showcase-templates.mjs ← 把模板同步到 showcase（predev/prebuild 自动调用）
│  └─ package-quickshare.mjs    ← 自动化打包 QuickShare 专用 ZIP 压缩包脚本
├─ QUICKSHARE_DEPLOY.md         ← QuickShare 部署与使用完整指南
├─ (f1-surface-quickshare.zip)  ← 运行 npm run package:quickshare 生成，不入库
└─ evals/
   └─ evals.json
```

## Skill 能做什么

这个 skill 不只是提供几个色号，而是把每支车队拆成一套网页设计规则：

- 核心颜色 token（深色工程模式 + 浅色编辑模式）
- 页面配色占比
- 组件级映射
- 材质与渐变逻辑（车漆受光、碳纤维、chevron 暗纹等 CSS 配方）
- 字体、形状、动效与页面构图方法（`web-craft.md`）
- 可运行的基准模板（`assets/templates/`）
- Prompt 模板
- 反模式与常见误区

它还会强调不同车队之间的根本差异，避免把所有页面都做成同一套“深色 F1 科技风”模板换色。所有模板的定位是"把车队配色迁移到普通网页"——内容与赛车无关，视觉身份依然成立。

## 2026 资料校对

Aston Martin、Mercedes、McLaren、Ferrari、Cadillac 按 2026-03-09 可核实到的官方 2026 发布资料校对；Williams 于 2026-09-26 补充；Red Bull、Audi、Alpine、Racing Bulls、Haas 及全部队名/车型名于 2026-10-24 对照参赛名单与官方/主流媒体发布报道重新核对（来源见 `references/official-2026-sources.md`）。网页 HEX 为复现建议值，非官方 token。

重点更新包括：

- Aston Martin：强调 `considered` / `deliberate` 的整体工程秩序
- Mercedes：强调前银后黑、PETRONAS 流线、AMG rhombus 纹理
- McLaren：强调冠军延续下的 papaya / anthracite / teal 关系
- Ferrari：更新为 2026 的更亮 Rosso Scuderia、白色结构角色、gloss paint
- Cadillac：强调 `fast standing still` 与 chevron 渐变逻辑
- Williams：FW48 高光泽蓝、流动黑、白色结构面与极细红白历史描边
- Red Bull Racing：RB22 蓝与黑配色、浅蓝提花织纹、**回归高光泽**；红黄仅作品牌点缀
- Audi Revolut F1 Team：R26 钛金属饰面、外露碳纤维、Lava Red 点缀与 Revolut 冠名
- Alpine：A526 涂装与上一年相似（蓝色体系）；官方未给出更细色彩描述，色阶为网页复现建议
- Visa Cash App Racing Bulls：VCARB 03 白色设计加蓝色点缀（呼应福特合作）
- TGR Haas F1 Team：VF-26 白色与红色涂装（TGR 冠名合作）

## 如何使用

如果你已经在 Codex / skills 环境中使用 skill：

1. 安装或加载 `f1-web-color-guidelines.skill`
2. 在请求里明确说出车队或场景
3. 让 agent 输出配色规范、tokens、实现代码或审查意见

示例请求：

- “把这个 dashboard 改成 2026 Mercedes 风格”
- “给我一套 Ferrari 2026 的 CSS variables”
- “做一个 McLaren 风格的数据可视化 landing page”
- “用 Audi 风格做一个德系工业精密仪器监控台”
- “用 Red Bull 哑光质感做一个动量展示页面”

## 开发与检查

```bash
npm ci                          # 安装检查工具（仅 playwright）
npm run build:templates         # 由 src + 共享核心生成单文件模板
npm run check                   # 模板同步 + editorial 对比度（WCAG AA）+ 色板一致性
npm run tokens                  # 由 tokens/*.json 生成 tokens/tokens.css
npm run check:screenshots       # 用浏览器打开每个模板（桌面 + 手机），检查首屏标题可见、无横向溢出、无 JS 异常、截图非空白
```

`check:screenshots` 需要浏览器：`npx playwright install chromium`，或用本机已装的 Chrome：`PW_CHANNEL=chrome npm run check:screenshots`。PR 和推送到 main 时 GitHub Actions 会自动跑全部检查，并把截图作为产物上传。

**为什么加这些**：曾经有 5 个 surface 页黑屏（挂载参数写错、正文一直透明）进了主分支，构建与类型检查都通过，只有打开页面才看得到。截图冒烟检查对这类问题有效（用旧版黑屏页面验证过会报"标题仍是透明的"）。

**浏览器测试工具选型**（2026-11-01，数据来自 GitHub API）：

| 方案 | Stars | 最近提交 | 许可证 | 备注 |
|---|---|---|---|---|
| **Playwright** | ≈99.0k | 2026-10-31 | Apache-2.0 | 选用：官方 CI 支持与浏览器安装命令、`channel` 可直接用本机 Chrome、开放 issue 少（48） |
| Puppeteer | ≈95.8k | 2026-11-01 | Apache-2.0 | 同样成熟；主要面向 Chrome，开放 issue 218 |
| Cypress | ≈51.0k | 2026-11-01 | MIT | 偏应用端到端测试，体积大，开放 issue 1151，对"打开单文件页面看一眼"过重 |
| WebdriverIO | ≈9.9k | 2026-11-01 | MIT | 社区较小，需要额外驱动配置 |

## 许可与说明

**非官方声明**：本仓库是个人整理的网页视觉指引，与各 F1 车队、赞助商及其品牌权利人没有任何关联，也未获得其认可。队名、车型名、徽标与商标归各自权利人所有；本仓库不包含任何车队徽标。所有 HEX 都是依据公开发布的涂装信息得出的网页复现建议值，**不是官方色号**。

这个仓库当前主要包含 skill 源码、打包产物和设计指引整理文件。若你准备公开发布，建议再补一份明确的许可证说明。
