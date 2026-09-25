# F1 2026 Continuous Surface - QuickShare 部署与使用指南

本项目（F1 2026 五大车队双阶段连续车身 PBR 材质与 React Bits 动效库）已针对 [QuickShare (gzsteven666/quickshare)](https://github.com/gzsteven666/quickshare) 静态托管服务完成完整适配。

构建与打包脚本已生成零绝对路径、自包含静态包：`f1-surface-quickshare.zip`（仅约 450 KB）。

---

## 🌟 为什么适合在 QuickShare 运行与预览？

1. **全相对路径基准 (`base: './'`)**
   - 构建产物中所有 JS/CSS/SVG 资源均采用相对路径引用（`./assets/...`）。
   - 无论挂载在 QuickShare 的根目录（`/`）还是任意子路由（如 `/f1-surface/`、`/s/<分享ID>/public/`），都不会触发任何资源 404 错误。
2. **双栈同源支持**
   - **交互式展厅主程序 (`index.html`)**：React 19 + Three.js + React Bits 动效组件，支持 5 大车队 3D PBR 车漆与遥测参数实时切换。
   - **5 支车队纯原生单文件模板 (`templates/`)**：内联全部依赖，纯 HTML+JS，既可通过导航栏直接跳转，也可脱离框架独立运行。
3. **体积精简高效**
   - 开启 Gzip 压缩后核心包仅 ~270 KB，全量 ZIP 包仅 450 KB，在内网或局域网中实现秒级拉取与渲染。

---

## 🚀 三种部署 / 预览方式

### 方式 A：作为 QuickShare 子路径应用（推荐）

在保留 QuickShare 原有文件共享功能的同时，将 F1 动态展厅作为专属子页面访问：

1. 进入你运行 QuickShare 的服务器或本地目录，定位到 `public` 文件夹：
   ```bash
   cd quickshare/public
   ```
2. 创建 `f1-surface` 子目录：
   ```bash
   mkdir f1-surface
   ```
3. 将根目录的 `f1-surface-quickshare.zip` 解压到 `quickshare/public/f1-surface/` 下：
   ```bash
   # Windows PowerShell
   Expand-Archive -Path path/to/f1-surface-quickshare.zip -DestinationPath quickshare/public/f1-surface/

   # 或 Linux / macOS
   unzip path/to/f1-surface-quickshare.zip -d quickshare/public/f1-surface/
   ```
4. 启动 QuickShare 服务：
   ```bash
   npm start
   ```
5. 浏览器直接访问：
   ```text
   http://<你的QuickShare服务器IP或域名>:<端口>/f1-surface/
   ```

---

### 方式 B：作为 QuickShare 根目录默认首页

如果你希望将该展厅直接作为 QuickShare 服务的默认着陆页：

1. 将 `f1-surface-quickshare.zip` 中的全部文件直接解压到 QuickShare 的 `public/` 目录下（覆盖默认的 `index.html`）。
2. 启动 QuickShare：
   ```bash
   npm start
   ```
3. 打开浏览器访问：
   ```text
   http://<你的QuickShare服务器IP或域名>:<端口>/
   ```

---

### 方式 C：通过 QuickShare 传输并本地秒级预览

1. 在 QuickShare 网页中将 `f1-surface-quickshare.zip` 直接拖拽上传并生成分享码/链接。
2. 接收方下载 ZIP 包后解压到任意文件夹。
3. 在该文件夹下使用任意静态服务器运行（因为浏览器对本地 `file://` 协议下的 ES Module 有 CORS 限制）：
   ```bash
   # 方案 1: npx
   npx serve .

   # 方案 2: Python
   python -m http.server 8080

   # 方案 3: VS Code Live Server 插件直接右键 index.html 运行
   ```
4. **单文件原生模板（免静态服务器）**：
   - 若不启动服务器，可直接进入 `templates/` 目录，双击任一车队的 `*-surface.html`，可在浏览器中直接离线运行 3D PBR 渲染！

---

## 🛠️ 如何重新生成部署压缩包

若后续修改了材质参数、CSS 或 React 组件，只需在项目根目录运行：

```bash
# 一键自动构建、同步单文件模板并生成 f1-surface-quickshare.zip
npm run package:quickshare
```

该命令将自动完成以下 4 个阶段：
1. 同步 `assets/templates/*.html` 到 `showcase/public/templates/`。
2. 以 `base: './'` 运行 Vite 生产构建。
3. 注入 `QUICKSHARE_DEPLOY.txt` 部署指引。
4. 使用标准 ZIP 算法打包为体积最小化的分发包。
