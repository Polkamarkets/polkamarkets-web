import React, { useEffect, useRef } from 'react';

export default function usePrevious<V>(value: V): React.RefObject<V> {
  const ref = useRef<V | null>(null);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
}
