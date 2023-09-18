import { useCallback } from 'react';

export default function useEnhancedRef<E extends HTMLElement>(
  forwardedRef: React.ForwardedRef<E>,
  objectRef?: React.Ref<E>
) {
  return useCallback(
    (originalRef: E | null) => {
      if (forwardedRef != null) {
        if (typeof forwardedRef === 'function') forwardedRef(originalRef);
        if (typeof forwardedRef === 'object' && 'current' in forwardedRef)
          // eslint-disable-next-line no-param-reassign
          forwardedRef.current = originalRef;
      }
      if (typeof objectRef === 'function') objectRef?.(originalRef);
    },
    [objectRef, forwardedRef]
  );
}
