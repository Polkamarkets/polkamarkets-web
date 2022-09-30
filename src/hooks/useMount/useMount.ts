import { useEffect, useRef } from 'react';

export default function useMount() {
  const didMount = useRef(false);

  useEffect(() => {
    didMount.current = true;

    return () => {
      didMount.current = false;
    };
  }, []);

  return didMount;
}
