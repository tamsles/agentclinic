# AgentClinic 技术方案

## 选型

| 方面 | 选择 | 备注 |
|---|---|---|
| 语言和运行时 | TypeScript(严格模式)、Node.js | 骨架已就绪 |
| Web 框架 | Hono | API 和页面同一个服务 |
| 页面 | Hono JSX,服务端渲染 | 无前端构建工具;需在 tsconfig 加 `"jsx": "react-jsx"`、`"jsxImportSource": "hono/jsx"` |
| 数据库 | SQLite 文件 | 驱动优先 `node:sqlite`,见下方"待验证" |
| 校验 | Zod | |
| 随机数 | 自写带种子的小函数 | `Math.random` 不能设种子 |
| 测试 | Vitest | |
| 开发运行 | tsx | |

已装依赖:Vitest、Hono、@hono/node-server。其余(tsx、Zod 等)到对应路线图步骤再装。

**已验证**:`node:sqlite` 能在 Vitest 里使用(Node v26.13.1,Vitest 5.1.1;
内存库建表、带参数写入、读出、`CREATE TABLE IF NOT EXISTS` 重复执行都通过,
测试输出没有 ExperimentalWarning)。结论:数据库驱动用 `node:sqlite`,不换库。
验证测试保留在 `tests/sqlite.test.ts`,以后升级 Node 时可重跑。

## 架构

```
请求 -> Hono 路由 (routes/api, routes/pages) -> db/ 读写 SQLite
                                             -> diagnosis/ 生成诊断(纯函数)
```

- routes:收请求、校验、调用 db 和 diagnosis、返回。不单独拆 services 层
- db:唯一写 SQL 的地方,只暴露具名函数
- diagnosis:纯函数,不碰数据库和 HTTP
- 某段逻辑真变复杂了再拆,不提前拆

## 数据模型

**patients**:`id`(随机 UUID)、`name`(最长 40)、`token_hash`、`created_at`

**visits**:`id`(随机)、`patient_id`(阶段 B 前可空)、`symptom_text`(最长 500)、
`tags`(JSON 数组)、`diagnosis_name`、`severity`(1 到 5)、`analysis`、
`prescription`(JSON 数组)、`created_at`

- 时间统一存 UTC;启用 WAL 和外键
- 建表用 `CREATE TABLE IF NOT EXISTS`
- 练习阶段不做迁移:表结构变了就删 `data/` 里的库文件重建
- 以后有真实数据要保留时,再用 `PRAGMA user_version` 做迁移

## 令牌

- `crypto.randomBytes(32)`,base64url;只在挂号响应里显示一次
- 库里只存 SHA-256 哈希;永不过期;丢了不找回
- 请求头:`Authorization: Bearer <token>`

## 诊断生成器

- 输入:标签、该病人最近 3 次的病名(复诊用)、整数种子
- 输出:病名、严重程度、病因分析、处方列表
- 种子由就诊 id 计算,同一个 id 永远得到同样的诊断
- 症状原文不放进诊断书

## API 与错误处理

- 前缀 `/api/v1`,JSON 进出;列表必须分页(`limit` 默认 20,最大 50)
- 错误格式:`{ "error": { "code", "message", "details": [{ "field", "problem" }] } }`,message 写明怎么改
- `app.onError` 和 `app.notFound` 统一兜底:`/api/` 返回 JSON,其他路径返回恶搞错误页
- 500 对外只给通用信息,详情写日志;请求日志用 Hono 自带 logger

## 安全与输入限制

- 公开页只展示生成的诊断内容和名字,不展示症状原文(防提示词注入)
- 输出到 HTML 的文本都转义,不用绕过转义的写法
- 名字:最长 40,拒绝控制字符;症状:最长 500;标签:只能取自固定列表,最多 5 个
- 请求体最大 4 KB;超限返回 400 或 413
- 限流前不上公网

## 运行与部署

- 目前只在本机运行:`npm run dev` 开发,`npm run build` 后 `npm start` 运行
- 环境变量:`PORT`(默认 3000)、`DATABASE_PATH`(默认 `data/agentclinic.db`)
- 公网部署前要解决:托管平台的磁盘是否持久、数据库备份、迁移办法

## 目录

```
specs/        三份文档
src/
  index.ts    启动服务
  app.ts      创建 Hono 应用(测试直接用它,不开端口)
  config.ts
  routes/api/  routes/pages/
  views/      JSX 组件
  diagnosis/  生成器、词库、随机函数
  db/         client.ts  schema.sql  queries.ts
tests/        平铺,文件名对应被测模块
data/         SQLite 文件(进 .gitignore)
```

## 测试

Vitest,`npm test`。另加 `npm run typecheck`(`tsc --noEmit`,覆盖 tests)。

测:

- 生成器:同输入同种子结果一致、严重程度在 1 到 5、词库无空项、诊断书不含症状原文
- db:建表可重复执行、读写一致、库里只有令牌哈希
- API(内存库加 `app.request()`):完整流程,以及缺字段、令牌错误、超长、标签非法、分页超限
- 错误处理:API 404 返回 JSON、页面 404 返回错误页、500 不泄露细节
- 页面:返回 200、看不到症状原文、名字被转义
- 限流:超限返回 429 加重试时间

不测:截图、第三方库自身、文案好不好笑;不设覆盖率指标。

原则:不访问网络;时间和种子都作为参数传入;每个测试用独立内存库。
