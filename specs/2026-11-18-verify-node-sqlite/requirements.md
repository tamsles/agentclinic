# 需求:验证 `node:sqlite` + 最小首页(路线图阶段 A 第 1 步,外加提前做的一小块)

## 目标

1. 确认 `node:sqlite` 能在 Vitest 里使用:打开内存库、建表、写入、读出。
   结论决定整个项目的数据库驱动(见 tech-stack.md "待验证")。
2. 做一个最小的 AgentClinic 首页,让项目第一次有可以在浏览器里看到的东西。

## 范围

做:

- 安装 `vitest`、`hono`、`@hono/node-server`
- 加 `npm test` 脚本(`vitest run`)
- 写 `tests/sqlite.test.ts`,保留在仓库里
- 新建 `src/app.ts`(Hono 应用,只有 `GET /`)并改写 `src/index.ts`(启动服务,读 `PORT`)
- 写 `tests/home.test.ts`,用 `app.request()` 测首页
- 更新 tech-stack.md 和 roadmap.md

不做:

- 不装 tsx,不加 `dev`、`typecheck` 脚本(第 2 步)
- 不做 `/health`、请求日志、`.gitignore` 加 `data/`(第 3 步)
- 不做 404/500 错误处理(第 4 步和第 21 步)
- 不用 JSX、不改 `tsconfig.json`(第 17 步);首页用 HTML 字符串
- 不展示诊断书、排行榜等内容(第 18、20 步);首页是纯静态的,不连数据库
- 不建 `src/db/`,不写 visits 表(第 5 步);测试里的表只是演示用的临时表

## 决定

| 问题 | 决定 | 原因 |
|---|---|---|
| 依赖范围 | Vitest(验证用)加 Hono 与 @hono/node-server(首页用) | 首页需要 Web 框架;Node 上跑 Hono 需要 node-server 适配器 |
| 测试是否保留 | 保留 `tests/sqlite.test.ts` | 以后升级 Node 时可以重跑,确认驱动没坏 |
| 测试位置 | `tests/`,平铺 | 符合 tech-stack.md 目录约定 |
| 数据库 | 只用内存库 `:memory:` | 不碰磁盘,不访问网络,每个测试独立 |
| 失败预案 | 同一分支内改用 `better-sqlite3`,并更新 tech-stack.md | 路线图原文要求 |
| 首页渲染 | HTML 字符串,不用 JSX | JSX 配置是第 17 步的内容 |
| 文件拆分 | `app.ts` 与 `index.ts` 分开 | 符合 tech-stack.md 架构,测试直接用 `app.request()`,不开端口 |
| 端口 | 读 `PORT`,默认 3000 | tech-stack.md 已规定 |
| 运行方式 | `npm run build` 后 `npm start` | 不装 tsx,`npm run dev` 留给第 2 步 |
| 首页是否连库 | 不连 | 保持首页独立于数据库驱动验证的结果 |

## 首页内容

- 标题 / 一级标题:AgentClinic
- 一句话介绍:给 AI agent 看病的恶搞诊所
- 页脚:请勿提交敏感信息(specs/mission.md 要求页面有此提醒)
- 样式:不做主题设计,只要能读;医院主题布局留给第 17 步

## 背景

- 本机 Node 是 v26.13.1;用 `require('node:sqlite')` 已确认能加载,导出里有 `DatabaseSync`
- 但"能加载"不等于"在 Vitest 里能用":Vitest 默认通过 Vite 处理模块,
  对 `node:` 内置模块的处理可能有差异,所以必须在 Vitest 里实际跑一遍
- 项目当前是 CommonJS(`package.json` 的 `"type": "commonjs"`,tsconfig `module: commonjs`);
  Vitest 是 ESM 工具,但测试文件用 `import` 写即可,先不改模块设置,
  如果真的冲突,把冲突记在这里并问用户再决定
- 同样的风险也适用于 Hono 和 `@hono/node-server`:它们同时提供 ESM 和 CJS,
  但 tsconfig 的模块解析方式可能让 `tsc` 找不到类型;
  遇到时先记在这里并问用户,不要自行改 `tsconfig.json`
- 本分支会让第 2、3 步的一部分提前完成(装 Hono、`app.ts`/`index.ts` 拆分、读 `PORT`),
  做完后在 roadmap.md 里注明,不重复做
- 分支和目录名里只写了 `verify-node-sqlite`,没有提到首页;名字不改,以免打乱已有引用

## 参考

- specs/mission.md:本地运行、`npm install` 加 `npm start` 能跑、页面提醒请勿提交敏感信息
- specs/tech-stack.md:"选型"和"待验证"两节、架构、"测试"原则(不访问网络、每个测试独立内存库)
- specs/roadmap.md:阶段 A 第 1、2、3 步
