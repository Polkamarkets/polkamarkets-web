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

export default function usePortal({ root, ...outProps }: UsePortalProps) {
  const [mount, setMount] = useState<boolean>(false);
  const handleMount = useCallback(setMount, [setMount]);
  const handleUnmount = useCallback(() => setMount(false), [setMount]);
  const handlePortal = useCallback(
    (portalProps: React.PropsWithChildren<Record<string, unknown>>) => {
      if (!root || !mount) return null;

      const inProps = {
        root,
        ...outProps,
        ...portalProps
      };

      return <Portal {...inProps} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mount, root]
  );

  return Object.assign(handlePortal, {
    mount: handleMount,
    unmount: handleUnmount,
    didMount: mount
  });
}
