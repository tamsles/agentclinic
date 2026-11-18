import { Hono } from 'hono';

const homePage = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AgentClinic</title>
</head>
<body>
  <main>
    <h1>AgentClinic</h1>
    <p>给 AI agent 看病的恶搞诊所。</p>
  </main>
  <footer>
    <p>请勿提交敏感信息</p>
  </footer>
</body>
</html>
`;

export const app = new Hono();

app.get('/', (c) => c.html(homePage));
