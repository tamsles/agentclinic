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

  it('uses the header / main / footer layout in order', async () => {
    const html = await (await app.request('/')).text();
    const header = html.indexOf('<header');
    const main = html.indexOf('<main');
    const footer = html.indexOf('<footer');
    expect(header).toBeGreaterThan(-1);
    expect(main).toBeGreaterThan(header);
    expect(footer).toBeGreaterThan(main);
  });

  it('links to the stylesheet', async () => {
    const html = await (await app.request('/')).text();
    expect(html).toContain('<link rel="stylesheet" href="/styles.css">');
  });
});

describe('GET /styles.css', () => {
  it('returns non-empty CSS', async () => {
    const res = await app.request('/styles.css');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/css');
    expect((await res.text()).length).toBeGreaterThan(0);
  });
});

// Responsive design: layout can't be rendered in these tests, so we check the
// rules that make it responsive. Real screen widths are checked by hand.
describe('responsive design', () => {
  async function getCss(): Promise<string> {
    return (await app.request('/styles.css')).text();
  }

  it('home page sets the viewport meta tag', async () => {
    const html = await (await app.request('/')).text();
    expect(html).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
    );
  });

  it('stylesheet adds wide-screen rules with a min-width media query', async () => {
    expect(await getCss()).toMatch(/@media\s*\(min-width:\s*[\d.]+(em|rem)\)/);
  });

  it('stylesheet has no fixed pixel widths', async () => {
    // max-width / min-width in px are fine to read, but a plain `width: 800px` would overflow phones.
    expect(await getCss()).not.toMatch(/(^|[\s;{])width:\s*\d+px/);
  });

  it('stylesheet keeps media from overflowing the screen', async () => {
    expect(await getCss()).toMatch(/img[^{]*\{[^}]*max-width:\s*100%/);
  });
});
