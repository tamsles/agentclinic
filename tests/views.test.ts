import { describe, expect, it } from 'vitest';
import { Footer } from '../src/views/footer';
import { Header } from '../src/views/header';
import { Layout } from '../src/views/layout';
import { Main } from '../src/views/main';

describe('Header', () => {
  it('renders a <header> with a brand link to the home page', () => {
    const html = Header();
    expect(html).toMatch(/^<header\b/);
    expect(html).toContain('<a class="brand" href="/">AgentClinic</a>');
    expect(html).toMatch(/<\/header>$/);
  });
});

describe('Main', () => {
  it('wraps the given content in <main>', () => {
    const html = Main('<p>hello</p>');
    expect(html).toMatch(/^<main\b/);
    expect(html).toContain('<p>hello</p>');
    expect(html).toMatch(/<\/main>$/);
  });

  it('puts the content between the opening and closing tags', () => {
    const html = Main('<p>hello</p>');
    expect(html.indexOf('<p>hello</p>')).toBeGreaterThan(html.indexOf('<main'));
    expect(html.indexOf('<p>hello</p>')).toBeLessThan(html.indexOf('</main>'));
  });

  it('renders an empty <main> when the content is empty', () => {
    const html = Main('');
    expect(html).toContain('<main');
    expect(html).toContain('</main>');
  });
});

describe('Footer', () => {
  it('renders a <footer> with the sensitive-information reminder', () => {
    const html = Footer();
    expect(html).toMatch(/^<footer\b/);
    expect(html).toContain('请勿提交敏感信息');
    expect(html).toMatch(/<\/footer>$/);
  });
});

describe('Layout', () => {
  const html = Layout({ title: 'Test Title', content: '<h1>Body marker</h1>' });

  it('is a complete HTML5 document', () => {
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<html lang="zh-CN">');
    expect(html).toContain('<meta charset="utf-8">');
    expect(html.trimEnd().endsWith('</html>')).toBe(true);
  });

  it('sets the viewport meta tag so phones use the real screen width', () => {
    expect(html).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
    );
  });

  it('puts the title in <title>', () => {
    expect(html).toContain('<title>Test Title</title>');
  });

  it('links the stylesheet inside <head>', () => {
    const link = html.indexOf('<link rel="stylesheet" href="/styles.css">');
    expect(link).toBeGreaterThan(html.indexOf('<head>'));
    expect(link).toBeLessThan(html.indexOf('</head>'));
  });

  it('renders header, then main with the content, then footer', () => {
    const header = html.indexOf('<header');
    const main = html.indexOf('<main');
    const content = html.indexOf('<h1>Body marker</h1>');
    const mainEnd = html.indexOf('</main>');
    const footer = html.indexOf('<footer');

    expect(header).toBeGreaterThan(html.indexOf('<body>'));
    expect(main).toBeGreaterThan(header);
    expect(content).toBeGreaterThan(main);
    expect(content).toBeLessThan(mainEnd);
    expect(footer).toBeGreaterThan(mainEnd);
  });

  it('renders each region exactly once', () => {
    expect(html.match(/<header\b/g)).toHaveLength(1);
    expect(html.match(/<main\b/g)).toHaveLength(1);
    expect(html.match(/<footer\b/g)).toHaveLength(1);
  });

  it('is deterministic: the same input gives the same output', () => {
    const props = { title: 'Same', content: '<p>same</p>' };
    expect(Layout(props)).toBe(Layout(props));
  });
});
