# 验收:验证 `node:sqlite` + 最小首页

全部满足即可合并。

## 必须通过

- [ ] `npm test` 全绿,包括:
  - `tests/sqlite.test.ts`:在 Vitest 里能打开内存库、建表、写入、读出,读出的值与写入的一致
  - `tests/home.test.ts`:`GET /` 返回 200,`Content-Type` 含 `text/html`,
    页面含 "AgentClinic" 和 "请勿提交敏感信息"
- [ ] 响应式测试通过(在 `tests/home.test.ts` 里):
  - 页面含 `<meta name="viewport" content="width=device-width, initial-scale=1">`
  - `styles.css` 含 `@media (min-width: ...)`
  - `styles.css` 没有固定像素的 `width`,`img` 设了 `max-width: 100%`
- [ ] 重复执行 `CREATE TABLE IF NOT EXISTS` 不报错
- [ ] 测试之间互相独立:每个测试用自己的内存库,不依赖执行顺序
- [ ] `npm run build` 通过(新增了 Hono 代码,要确认 `tsc` 能编译)

## 首页手动检查

1. `npm run build`,然后 `npm start`,终端打印出访问地址
2. 浏览器或 curl 打开 `http://localhost:3000/`,能看到 AgentClinic 标题、一句话介绍和页脚提醒
3. 设置 `PORT=3100` 再启动,服务改在 3100 端口
4. 响应式检查:浏览器开发者工具开设备模式,依次看 320px、768px、1280px 宽
   - 三种宽度下都没有横向滚动条
   - 文字不用放大就能读,左右有留白,不贴边
   - 页脚始终贴在页面底部
   - 顶部品牌名好点(高度不小于 44px)
5. 检查完停掉服务

## 文档与范围检查

- [ ] tech-stack.md 的"待验证"已改为结论(已验证,或已换库并更新选型表),
      "依赖都还没装"一句已改成实际状态
- [ ] roadmap.md 第 1 步已勾选;第 2、3 步下面有"已在本分支提前完成"的备注,但没有勾选
- [ ] 改动只包含:`package.json`、`package-lock.json`、`src/app.ts`、`src/index.ts`、
      `src/views/header.ts`、`src/views/main.ts`、`src/views/footer.ts`、`src/views/layout.ts`、
      `public/styles.css`、
      `tests/sqlite.test.ts`、`tests/home.test.ts`、tech-stack.md、roadmap.md 和本目录
- [ ] `Header`、`Main`、`Footer` 三个子组件各自在独立文件里(`header.ts`、`main.ts`、`footer.ts`),
      互不引用;`layout.ts` 从这三个文件导入并拼成 `Layout`,`app.ts` 只引入 `Layout`
- [ ] 首页由 `Layout` 拼出三个子组件,`<head>` 里链接 `/styles.css`,
      `GET /styles.css` 返回 `text/css`
- [ ] `<head>` 里有 viewport 标签;`styles.css` 是手机优先(基础样式不依赖媒体查询,
      宽屏规则放在 `@media (min-width: 48em)` 里)
- [ ] 没有装 tsx,没有新增 `dev`、`typecheck` 脚本,没有改 `tsconfig.json`
- [ ] 没有 `/health`、请求日志、错误处理、JSX(这些属于后面的步骤)
- [ ] 首页没有连数据库,没有生成 `data/` 下的库文件(测试只用内存库)

## 其他检查

- 运行 `git status`,确认只有上面列出的文件有变化
- 看一眼测试输出,若出现 ExperimentalWarning 等警告,记在 requirements.md 的"背景"里
  (不作为不通过的理由)

## 不通过时

- 测试失败或无法加载 `node:sqlite`:按 plan.md 第 3 组改用 `better-sqlite3`,
  换库后重新按本文件检查一遍
- Hono 在 CommonJS 配置下编译或运行出错:停下来,把错误记进 requirements.md 并问用户,
  不要自行改 `tsconfig.json` 或 `package.json` 的模块类型
