// `content` is trusted HTML. Escape any user-provided text before putting it in here.
export function Main(content: string): string {
  return `<main class="site-main">
    ${content}
  </main>`;
}
