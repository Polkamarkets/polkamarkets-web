import { create } from 'zustand';

type DrawerState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const useDrawer = create<DrawerState>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}));

export default useDrawer;
