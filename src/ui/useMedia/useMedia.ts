import { useLayoutEffect, useState } from 'react';

export default function useMedia(query: string) {
  const [media] = useState(() => window.matchMedia(query));
  const [matches, setMatches] = useState(() => media.matches);

  useLayoutEffect(() => {
    function handleMedia(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }
    media.addEventListener('change', handleMedia);

    return () => media.removeEventListener('change', handleMedia);
  });

  return matches;
}
