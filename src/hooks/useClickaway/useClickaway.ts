import React, { useEffect, useRef } from 'react';

import usePrevious from 'hooks/usePrevious';

export default function useClickaway<V extends HTMLElement>(
  ref: React.RefObject<V>,
  onClickaway: () => void,
  deps: (boolean | null | undefined)[] = [true]
) {
  const timer = useRef<Partial<number>>();
  const { current: tabindexPrev } = usePrevious(ref.current?.tabIndex);

  useEffect(() => {
    const { current: node } = ref;

    function handleFocus() {
      window.clearTimeout(timer.current);
    }
    function handleBlur() {
      timer.current = window.setTimeout(() => {
        if (deps.every(Boolean)) onClickaway?.();
      });
    }

    if (node?.tabIndex === -1) node?.setAttribute('tabIndex', '0');
    node?.addEventListener('focusin', handleFocus);
    node?.addEventListener('focusout', handleBlur);

    return () => {
      if (tabindexPrev === -1) node?.setAttribute('tabIndex', '-1');
      node?.removeEventListener('focusin', handleFocus);
      node?.removeEventListener('focusout', handleBlur);
    };
  }, [deps, onClickaway, ref, tabindexPrev]);
}
