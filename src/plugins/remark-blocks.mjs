// Markdown directives used in writing/ and projects/:
//
//   :::note                 → "▲ NOTE" callout
//   Body text.
//   :::
//
//   ::figure[Caption text]{src="/img/x.jpg" alt="…"}   (root-relative srcs get the deploy base)
//   ::figure[Caption text]{placeholder="PHOTO — DEVICE ON THE DESK"}
//
// Anything else that remark-directive happens to parse is turned back into text.
import { visit } from 'unist-util-visit';

const el = (hName, className, children = [], extra = {}) => ({
  type: 'paragraph',
  data: { hName, hProperties: className ? { className: [className], ...extra } : extra },
  children,
});
const text = (value) => ({ type: 'text', value });

export default function remarkBlocks({ base = '/' } = {}) {
  const prefix = base.replace(/\/$/, '');
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined) return;

      if (node.type === 'containerDirective' && node.name === 'note') {
        node.data = { hName: 'div', hProperties: { className: ['callout'] } };
        node.children.unshift(el('span', 'callout-label', [text('▲ NOTE')]));
        return;
      }

      if (node.type === 'leafDirective' && node.name === 'figure') {
        const { src, alt = '', placeholder = 'PHOTO / RENDER' } = node.attributes ?? {};
        const media = src
          ? { type: 'image', url: src.startsWith('/') ? prefix + src : src, alt }
          : el('div', 'ph', [el('span', null, [text(`[ ${placeholder} ]`)])]);
        const caption = node.children.length ? [el('figcaption', null, node.children)] : [];
        node.data = { hName: 'figure' };
        node.children = [media, ...caption];
        return;
      }

      if (node.type === 'textDirective') {
        parent.children.splice(index, 1, text(':' + node.name), ...(node.children ?? []));
        return index;
      }
      if (node.type === 'leafDirective' || node.type === 'containerDirective') {
        // Unknown block directive: keep its content, drop the wrapper.
        parent.children.splice(index, 1, ...(node.children ?? []));
        return index;
      }
    });
  };
}
