// Main layout: plain functions that return HTML strings (no JSX yet).
// Each sub-component lives in its own file; only this file combines them.
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';

export type LayoutProps = {
  title: string;
  content: string;
};

export function Layout(props: LayoutProps): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${props.title}</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  ${Header()}
  ${Main(props.content)}
  ${Footer()}
</body>
</html>
`;
}
