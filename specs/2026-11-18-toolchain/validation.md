# 验收:工具链

全部满足即可合并。

## 必须通过

- [ ] `npm test` 全绿,包括新增的 `tests/scripts.test.ts`:
  - `scripts` 含 `dev`(含 `tsx`)、`test`、`typecheck`、`validate`
  - `devDependencies` 含 `tsx`、`vitest`;`dependencies` 含 `hono`
- [ ] `npm run typecheck` 通过
- [ ] `npm run validate` 通过
- [ ] `npm run build` 通过
- [ ] 原有测试(`sqlite`、`home`、`views`)保持通过,没有被改动

## 手动检查

1. `npm run dev`,终端打印访问地址
2. curl 或浏览器打开 `http://localhost:3000/`,看到首页
3. 修改 `src/` 下某个文件并保存,服务自动重启;改回去
4. 设置 `PORT=3100` 再 `npm run dev`,服务改在 3100 端口
5. 检查完停掉服务

## 文档与范围检查

- [ ] roadmap.md 第 2 步已勾选;第 3 步没勾选
- [ ] tech-stack.md 的已装依赖里有 tsx
- [ ] 改动只包含:`package.json`、`package-lock.json`、`tests/scripts.test.ts`、
      roadmap.md、tech-stack.md 和本目录
- [ ] 没有提前做 `/health`、请求日志或 `.gitignore` 改动
