import React, { useEffect, useMemo } from 'react';

import usePrevious from 'hooks/usePrevious';
import useTimeoutEffect from 'hooks/useTimeoutEffect';

/**
 * Trap focus inside a specific node.
 * @param {{ current: HTMLElement }} ref React ref object forked from the specified node. See [useRef](https://reactjs.org/docs/hooks-reference.html#useref).
 * @param focusableElements List of elements CSS-like to be focus when it is trapped.
 * @param trappersId The IDs for the required trappers elements. This is usefull for tests.
 */
export default function useFocustrap<V extends HTMLElement>(
  ref: React.RefObject<V>,
  focusableElements: string[],
  trappersId: Record<'start' | 'end', string>
) {
  const focusTrap = useMemo(() => {
    return Object.keys(trappersId).reduce((acc, cur) => {
      const trapEl = document.createElement('span');

      trapEl.setAttribute('tabIndex', '0');
      trapEl.dataset.testid = trappersId[cur];

      return {
        ...acc,
        [cur]: trapEl
      };
    }, {} as Record<'start' | 'end', HTMLSpanElement>);
  }, [trappersId]);
  const timeoutEffect = useTimeoutEffect();
  const { current: focusPrev } = usePrevious<Element | null>(
    document.activeElement
  );

  useEffect(() => () => (focusPrev as HTMLElement)?.focus(), [focusPrev]);
  useEffect(() => {
    const { current: node } = ref;
    const els = node?.querySelectorAll(focusableElements?.join(', '));
    const focusEdge = {
      start: els?.[0] as HTMLElement,
      end: els?.[els.length - 1] as HTMLElement
    };

    function handleBlur() {
      timeoutEffect.clear();
    }
    function handleFocus(event: FocusEvent) {
      if (event.target === focusTrap.start) {
        window.requestAnimationFrame(() => {
          timeoutEffect(() => focusEdge.end?.focus());
        });
      }
      if (event.target === focusTrap.end) {
        window.requestAnimationFrame(() => {
          timeoutEffect(() => focusEdge.start?.focus());
        });
      }
    }

    node?.addEventListener('focusout', handleBlur);
    node?.addEventListener('focusin', handleFocus);
    node?.insertBefore(focusTrap.start, node.firstChild);
    node?.appendChild(focusTrap.end);
    focusTrap.start?.focus();

    return () => {
      node?.removeEventListener('focusout', handleBlur);
      node?.removeEventListener('focusin', handleFocus);
      node?.removeChild(focusTrap.start);
      node?.removeChild(focusTrap.end);
    };
  });
}
