import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { PortalProps, UsePortalProps } from './usePortal.type';

function Portal({
  children,
  root,
  onEffect
}: React.PropsWithChildren<PortalProps>) {
  useEffect(() => onEffect?.(), [onEffect]);

  return createPortal(children, root);
}

export default function usePortal({ onEffect, root }: UsePortalProps) {
  const [mount, setMount] = useState<boolean>(false);
  const handleMount = useCallback(setMount, [setMount]);
  const handleUnmount = useCallback(() => setMount(false), [setMount]);
  const handlePortal = useCallback(
    (_props: React.PropsWithChildren<Record<string, unknown>>) => {
      if (!root || !mount) return null;

      const props = { root, onEffect, ..._props };

      return <Portal {...props} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mount, root]
  );

  return Object.assign(handlePortal, {
    mount: handleMount,
    unmount: handleUnmount
  });
}
