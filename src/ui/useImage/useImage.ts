import { useCallback, useState } from 'react';

type States = 'load' | 'error' | 'ok';

type UseImage = [
  States,
  Pick<
    React.ComponentPropsWithRef<'img'>,
    'ref' | 'onLoad' | 'onError' | 'loading'
  >
];

export default function useImage(): UseImage {
  const [state, setState] = useState<States>('load');

  return [
    state,
    {
      ref: useCallback((image: HTMLImageElement | null) => {
        if (image?.complete) {
          if (!image.naturalWidth || !image.naturalHeight) setState('error');
          else setState('ok');
        }
      }, []),
      onError: useCallback(() => setState('error'), []),
      onLoad: useCallback(() => setState('ok'), []),
      loading: 'lazy'
    }
  ];
}
