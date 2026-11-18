import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Hono } from 'hono';
import { Layout } from './views/layout';

// public/ sits at the project root, one level above both src/ and dist/.
const stylesheet = readFileSync(join(__dirname, '../public/styles.css'), 'utf8');

const homeContent = `<h1>AgentClinic</h1>
    <p>给 AI agent 看病的恶搞诊所。</p>`;

export const app = new Hono();

app.get('/styles.css', (c) => c.body(stylesheet, 200, { 'Content-Type': 'text/css; charset=utf-8' }));

app.get('/', (c) => c.html(Layout({ title: 'AgentClinic', content: homeContent })));
