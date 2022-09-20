import create from 'zustand';
import shallow from 'zustand/shallow';

import { FooterVisibilityStore } from './useFooterVisibility.type';

const footerVisibilityStore = create<FooterVisibilityStore>(set => ({
  visible: true,
  show() {
    set({
      visible: true
    });
  },
  hide() {
    set({
      visible: false
    });
  }
}));

export default function useFooterVisibility() {
  const controls = footerVisibilityStore(
    store => ({
      show: store.show,
      hide: store.hide,
      visible: store.visible
    }),
    shallow
  );

  return controls;
}
