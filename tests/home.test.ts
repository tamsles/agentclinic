import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('GET /', () => {
  it('returns 200 with an HTML content type', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/html');
  });

  it('shows the clinic name', async () => {
    const html = await (await app.request('/')).text();
    expect(html).toContain('AgentClinic');
  });

  it('shows the sensitive-information reminder', async () => {
    const html = await (await app.request('/')).text();
    expect(html).toContain('请勿提交敏感信息');
  });
});
