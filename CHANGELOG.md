# 更新日志

## 2026-11-18

- 新增 `npm run dev`(`tsx watch src/index.ts`),改代码后自动重启;安装 tsx 作为开发依赖(路线图第 2 步)
- 新增 `tests/scripts.test.ts`,检查 `dev`、`test`、`typecheck`、`validate` 脚本和 tsx、vitest、hono 依赖存在
- 把 `Layout` 的参数类型提取为导出的 `LayoutProps`
- 新增工具链功能的 spec 目录 `specs/2026-11-18-toolchain/`(`plan.md`、`requirements.md`、`validation.md`);路线图勾选第 2 步,tech-stack.md 的已装依赖补上 tsx
- 新增响应式、手机优先的规则(tech-stack.md "响应式设计")和 `public/styles.css`,新增响应式测试和视图测试 `tests/views.test.ts`
- 新增 `validate` 脚本(类型检查加测试),`tsconfig.json` 覆盖 `tests/`,构建改用 `tsconfig.build.json`
- 新增 `update-changelog` 技能,合并分支前用来更新本文件
- 新增主布局 `Layout` 和 `Header`、`Main`、`Footer` 三个子组件,首页通过 `GET /styles.css` 引用样式表
- 验证 `node:sqlite` 能在 Vitest 里使用(内存库建表、写入、读出),新增最小首页 `GET /` 和对应测试;`app.ts` 与 `index.ts` 分开,端口读 `PORT`
- 安装 Vitest、Hono 和 `@hono/node-server`
- 新增项目文档 `specs/mission.md`、`specs/roadmap.md`、`specs/tech-stack.md`,以及 `node:sqlite` 验证功能的 spec 目录
- 初始化 TypeScript 项目骨架(`package.json`、`tsconfig.json`、`.gitignore`)
