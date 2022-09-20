export const focusEls =
  'a[href], button:not([disabled]), textarea, input, select';

export function focusEdge<V extends HTMLElement | null>(node?: V) {
  const els = node?.querySelectorAll(focusEls);
  const start = els?.[0] as HTMLElement;
  const end = els?.[els.length - 1] as HTMLElement;

  return { start, end };
}
export function insertTrappers<V extends HTMLElement | null>(node?: V) {
  const start = document.createElement('span');
  const end = document.createElement('span');

  start.setAttribute('tabIndex', '0');
  end.setAttribute('tabIndex', '0');
  start.dataset.trap = 'start';
  end.dataset.trap = 'end';
  node?.insertBefore(start, node.firstChild);
  node?.appendChild(end);

  return { start, end };
}
