# 计划:验证 `node:sqlite` + 最小首页

分支:`2026-11-18-verify-node-sqlite`。按顺序做,每组做完再做下一组。

## 1. 安装测试工具

1. `npm install -D vitest`
2. 在 `package.json` 的 `scripts` 里加 `"test": "vitest run"`
3. 确认 `npm test` 能启动(此时没有测试文件,报"no test files"也算启动成功)

## 2. 写验证测试

新建 `tests/sqlite.test.ts`:

1. `import { DatabaseSync } from 'node:sqlite'`
2. 每个测试里新建 `new DatabaseSync(':memory:')`,结束时关闭
3. 测试用例:
   - 建一张演示表(如 `demo(id INTEGER PRIMARY KEY, text TEXT)`)
   - 用带参数的 `prepare(...).run(...)` 写入一行
   - 用 `prepare(...).get(...)` 读出,断言内容与写入一致
   - 建表语句用 `CREATE TABLE IF NOT EXISTS`,执行两次不报错(为第 5 步"可重复执行"铺路)
4. 运行 `npm test`

## 3. 分支判断

- **通过**:进入第 4 组
- **不通过**:
  1. 把错误信息原文记到 requirements.md 的"背景"里
  2. 改用 `better-sqlite3`:安装依赖和类型,改写测试,直到通过
  3. 更新 tech-stack.md 的选型表和"待验证"一节
  4. 数据库驱动定下来之后,再进入第 4 组

## 4. 最小 AgentClinic 首页

首页是纯静态页面,不连数据库。只做"打开浏览器能看到诊所门面",其他功能留给路线图后面的步骤。

1. 安装运行依赖:`npm install hono @hono/node-server`
2. 新建 `src/app.ts`:创建并导出 Hono 应用,只有一个路由 `GET /`,
   返回 HTML 字符串(不用 JSX),内容包括:
   - 页面标题和一级标题:AgentClinic
   - 一句话介绍:给 AI agent 看病的恶搞诊所(取自 specs/mission.md)
   - 页脚:请勿提交敏感信息
3. 改写 `src/index.ts`:从 `app.ts` 引入应用,用 `@hono/node-server` 启动;
   端口读环境变量 `PORT`,默认 3000;启动时打印访问地址
4. 新建 `tests/home.test.ts`:用 `app.request('/')` 测试(不开端口):
   - 返回 200,`Content-Type` 含 `text/html`
   - 页面包含 "AgentClinic"
   - 页面包含 "请勿提交敏感信息"
5. 运行 `npm test` 和 `npm run build`,都要通过
6. 手动检查:`npm run build` 后 `npm start`,浏览器或 curl 打开 `http://localhost:3000/`,
   看到首页,然后停掉服务

## 5. 主布局组件(Header / Main / Footer)和样式表

把第 4 组里写死在 `app.ts` 里的 HTML 拆成"主布局组件 + 三个子组件"。
这里的"组件"就是返回 HTML 字符串的普通 TypeScript 函数,不用 JSX、不改 `tsconfig.json`
(JSX 是路线图第 17 步的内容)。

1. 在 `src/views/` 下新建四个文件,**每个组件各占一个文件**,各自只导出一个函数:
   - `src/views/header.ts`:导出 `Header()`,输出 `<header>`,
     内含品牌名链接 `<a class="brand" href="/">AgentClinic</a>`
   - `src/views/main.ts`:导出 `Main(content)`,输出 `<main>`,把传入的 HTML 片段放进去
   - `src/views/footer.ts`:导出 `Footer()`,输出 `<footer>`,内含"请勿提交敏感信息"
   - `src/views/layout.ts`:导出 `Layout({ title, content })`,即主布局;
     从上面三个文件分别 `import` 三个子组件,输出完整 HTML 文档,
     按顺序拼 `Header()`、`Main(content)`、`Footer()`,
     `<head>` 里用 `<link rel="stylesheet" href="/styles.css">` 链接样式表
   - 三个子组件文件互不引用,只有 `layout.ts` 把它们组合起来;`app.ts` 只引入 `Layout`
   - `content` 视为已写好的可信 HTML 片段(目前只有静态首页内容);
     以后要放用户输入的文字时,必须先转义(tech-stack.md "安全与输入限制")
2. 新建样式表 `public/styles.css`(放在项目根目录的 `public/`,不放 `src/`,
   因为 `tsc` 不会把 CSS 复制到 `dist/`):
   - 只写让页面"能读、有三段式布局"的基础样式:字体、最大宽度居中、
     header/footer 的底色和内边距、`main` 撑满剩余高度(footer 贴底)
   - 响应式、手机优先(规则见 tech-stack.md "响应式设计"):
     基础样式针对 320px 宽;`@media (min-width: 48em)` 里才加大间距;
     不写固定像素的 `width`;`img`、`svg`、`video` 设 `max-width: 100%`;
     标题字号用 `clamp()`;品牌链接至少 `2.75rem` 高;页面高度用 `100dvh`(退回 `100vh`)
   - `layout.ts` 的 `<head>` 里要有 `<meta name="viewport" content="width=device-width, initial-scale=1">`
   - 不做医院主题设计(第 17 步)
3. 在 `src/app.ts` 里"导入"样式表并提供链接地址:
   - 用 `node:fs` 的 `readFileSync` 和 `node:path` 的 `join(__dirname, '../public/styles.css')` 读入 CSS 文本
     (`src/` 和 `dist/` 都在项目根目录下一层,同一个相对路径两边都能用)
   - 新增路由 `GET /styles.css`,返回这段文本,`Content-Type` 为 `text/css`
   - 首页改成 `c.html(Layout({ title: 'AgentClinic', content: ... }))`,
     `content` 只含 `<h1>` 和一句话介绍;页脚提醒现在由 `Footer()` 负责
4. 扩充 `tests/home.test.ts`:
   - 页面里依次出现 `<header`、`<main`、`<footer`
   - 页面含 `<link rel="stylesheet" href="/styles.css">`
   - `GET /styles.css` 返回 200,`Content-Type` 含 `text/css`,内容非空
   - 响应式测试(布局本身测不出来,只检查让它响应式的规则):
     页面含 viewport 标签;样式表含 `@media (min-width: ...)`;
     样式表没有固定像素的 `width`;样式表里 `img` 设了 `max-width: 100%`
   - 原有 3 个测试保持不变且仍然通过
5. 运行 `npm run validate`(类型检查加测试)和 `npm run build`,都要通过
6. 手动检查:`npm run build` 后 `npm start`,浏览器打开 `http://localhost:3000/`,
   看到顶部品牌名、中间内容、底部提醒,并且样式生效(开发者工具里 `styles.css` 为 200);
   再打开开发者工具的设备模式,分别看 320px、768px、1280px 宽:
   没有横向滚动条,文字不用放大就能读,页脚始终贴底;然后停掉服务

## 6. 更新文档并收尾

1. tech-stack.md:
   - 把"待验证"一节改成"已验证",写明 Node 版本 v26.13.1 和结论(若换了库,按第 3 组的要求更新)
   - 把"依赖都还没装"一句改成实际状态:已装 Vitest、Hono、@hono/node-server
2. roadmap.md:勾上第 1 步;在第 2、3 步下面各加一行备注,说明哪些已在本分支提前完成
   (Hono 已装;`app.ts` 与 `index.ts` 已分开,`PORT` 已读取),避免重复劳动
3. 依照 validation.md 逐项自检(新增的 `src/views/` 下四个文件、`public/styles.css`
   已在 validation.md 的改动范围里补上)
4. 不自动提交;把改动清单告诉用户,由用户决定是否提交和合并
