import React from 'react';

export type UsePortalProps = {
  root: Element | null;
  onEffect?: React.EffectCallback;
};
export type PortalProps = {
  root: Element;
  onEffect?: React.EffectCallback;
};
