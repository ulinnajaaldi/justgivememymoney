"use client";

import { create } from "zustand";

interface DrawerState {
  isOpen: boolean;
  type: string | null;
  openDrawer: (type: string) => void;
  closeDrawer: () => void;
}

const useDrawer = create<DrawerState>((set) => ({
  isOpen: false,
  type: null,
  openDrawer: (type) => set({ isOpen: true, type }),
  closeDrawer: () => set({ isOpen: false, type: null }),
}));

export default useDrawer;
