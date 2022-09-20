import React, { useEffect, useRef } from 'react';

import usePrevious from 'hooks/usePrevious';

import { focusEdge, insertTrappers } from './useTrapfocus.util';

export default function useTrapfocus<V extends HTMLElement>(
  ref: React.RefObject<V>
) {
  const timer = useRef<Partial<number>>();
  const { current: focusPrev } = usePrevious<Element | null>(
    document.activeElement
  );

  useEffect(() => {
    const { current: node } = ref;
    const trap = insertTrappers(node);

    trap.start?.focus();

    return () => {
      (focusPrev as HTMLElement)?.focus();
    };
  }, [focusPrev, ref]);
  useEffect(() => {
    const { current: node } = ref;
    const edge = focusEdge(node);
    const trapStart = node?.querySelector('[data-trap="start"]') as V;
    const trapEnd = node?.querySelector('[data-trap="end"]') as V;

    function handleBlur() {
      window.clearTimeout(timer.current);
    }
    function handleFocus(event: FocusEvent) {
      if (event.target === trapStart) {
        window.requestAnimationFrame(() => {
          timer.current = window.setTimeout(() => edge.end.focus());
        });
      }
      if (event.target === trapEnd) {
        window.requestAnimationFrame(() => {
          timer.current = window.setTimeout(() => edge.start.focus());
        });
      }
    }

    node?.addEventListener('focusout', handleBlur);
    node?.addEventListener('focusin', handleFocus);

    return () => {
      node?.removeEventListener('focusout', handleBlur);
      node?.removeEventListener('focusin', handleFocus);
    };
  });
}
