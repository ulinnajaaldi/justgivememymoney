"use client";

import { create } from "zustand";

interface DrawerState {
  id?: string;
  isOpen: boolean;
  type: string | null;
  openDrawer: (type: string, id?: string) => void;
  closeDrawer: () => void;
}

const useDrawer = create<DrawerState>((set) => ({
  id: undefined,
  type: null,
  isOpen: false,
  openDrawer: (type, id) => set({ isOpen: true, type, id }),
  closeDrawer: () => set({ isOpen: false, type: null, id: undefined }),
}));

export default useDrawer;
