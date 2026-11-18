# 需求:工具链(路线图第 2 步)

## 范围

只做路线图第 2 步剩下的部分:安装 tsx,加 `npm run dev`,
并确认 `dev`、`test`、`typecheck`、`validate` 四个脚本都能运行。

不做:`/health`、请求日志、`.gitignore` 加 `data/`(第 3 步);不碰词库、数据库、路由。

## 决策

- `dev` 脚本用 `tsx watch src/index.ts`:改代码后自动重启
- tsx 作为 devDependency 安装(不进运行依赖)
- 不新增 `start` 之外的运行方式;`npm start` 仍是 `node dist/index.js`
- 新增一个 Vitest 测试 `tests/scripts.test.ts`,读取 `package.json`,检查脚本和依赖存在
- 验证方式:Vitest 检查脚本 + 手动启动 `npm run dev`;不写真正启动进程的冒烟测试(慢且不稳定)

## 背景

- 已提前完成:Hono、Vitest 已装;`test`、`typecheck`、`validate` 脚本已有;
  `tsconfig.json` 覆盖 `tests/`,构建用 `tsconfig.build.json`
- 缺:tsx 和 `dev` 脚本
- `src/index.ts` 读取 `PORT`,默认 3000
- 参考:specs/mission.md、specs/tech-stack.md("开发运行:tsx")
