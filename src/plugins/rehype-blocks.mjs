// Wraps rendered markdown elements in the chrome the article design expects:
//   <pre><code>   → .code box with "CODE  <LANG>" header and a COPY button
//   <table>       → .table-wrap box
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

const LANGS = {
  cpp: 'C++', 'c++': 'C++', c: 'C', js: 'JS', javascript: 'JS', ts: 'TS', typescript: 'TS',
  py: 'PYTHON', python: 'PYTHON', sh: 'SHELL', bash: 'SHELL', zsh: 'SHELL', shell: 'SHELL',
  md: 'MARKDOWN', yml: 'YAML', swift: 'SWIFT', json: 'JSON', html: 'HTML', css: 'CSS',
};

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

// Full-line comments get the muted colour, as in the mock; everything else stays ink.
function shadeComments(source) {
  const lines = source.replace(/\n$/, '').split('\n');
  const out = [];
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|#(?!include|define|if|endif|pragma)|--|;)/.test(line)) {
      out.push(h('span.c', line));
    } else {
      out.push({ type: 'text', value: line });
    }
    if (i < lines.length - 1) out.push({ type: 'text', value: '\n' });
  });
  return out;
}

export default function rehypeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return;

      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        const code = node.children[0];
        const cls = [].concat(code.properties?.className ?? []);
        const lang = cls.find((c) => String(c).startsWith('language-'))?.slice(9) ?? '';
        const label = LANGS[lang.toLowerCase()] ?? lang.toUpperCase();
        code.children = shadeComments(textOf(code));
        parent.children[index] = h('div.code', [
          h('div.code-head', [
            h('span', [h('strong', 'CODE'), label ? '  ' + label : '']),
            h('button.copy', { type: 'button' }, 'COPY'),
          ]),
          node,
        ]);
        return 'skip';
      }

      if (node.tagName === 'table') {
        parent.children[index] = h('div.table-wrap', [node]);
        return 'skip';
      }
    });
  };
}
