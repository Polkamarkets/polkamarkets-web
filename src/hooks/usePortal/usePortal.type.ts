import React from 'react';

export type UsePortalProps = {
  onEffect?: React.EffectCallback;
  root: Element | null;
};
export type PortalProps = {
  root: Element;
  onEffect: UsePortalProps['onEffect'];
};
