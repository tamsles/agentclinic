# 计划:工具链

分支:`2026-11-18-toolchain`。按顺序做,每组做完再做下一组。

## 1. 安装 tsx 并加 dev 脚本

1. `npm install -D tsx`
2. 在 `package.json` 的 `scripts` 里加 `"dev": "tsx watch src/index.ts"`
3. 运行 `npm run dev`,看到终端打印访问地址;用 curl 打开 `http://localhost:3000/`
   返回首页;改一下 `src/` 里的文件确认自动重启;然后停掉服务

## 2. 脚本检查测试

1. 新建 `tests/scripts.test.ts`,读取 `package.json`
2. 断言:
   - `scripts` 里有 `dev`(内容含 `tsx`)、`test`、`typecheck`、`validate`
   - `devDependencies` 里有 `tsx`、`vitest`;`dependencies` 里有 `hono`
3. 运行 `npm test`,全部通过

## 3. 全部脚本跑一遍

1. `npm run typecheck`
2. `npm test`
3. `npm run validate`
4. `npm run build`(确认加了 tsx 没影响构建)

## 4. 更新文档并收尾

1. roadmap.md:勾上第 2 步,删掉那条"已提前完成"备注里关于 tsx 的"还没做"
2. tech-stack.md:"已装依赖"一句补上 tsx
3. 依照 validation.md 逐项自检
4. 不自动提交;把改动清单告诉用户,由用户决定是否提交和合并
