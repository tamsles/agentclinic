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

## 5. 更新文档并收尾

1. tech-stack.md:
   - 把"待验证"一节改成"已验证",写明 Node 版本 v26.13.1 和结论(若换了库,按第 3 组的要求更新)
   - 把"依赖都还没装"一句改成实际状态:已装 Vitest、Hono、@hono/node-server
2. roadmap.md:勾上第 1 步;在第 2、3 步下面各加一行备注,说明哪些已在本分支提前完成
   (Hono 已装;`app.ts` 与 `index.ts` 已分开,`PORT` 已读取),避免重复劳动
3. 依照 validation.md 逐项自检
4. 不自动提交;把改动清单告诉用户,由用户决定是否提交和合并
