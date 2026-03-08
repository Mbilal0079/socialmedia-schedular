import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  createPostDialogOpen: boolean;
  selectedPostId: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCreatePostDialogOpen: (open: boolean) => void;
  setSelectedPostId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  createPostDialogOpen: false,
  selectedPostId: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCreatePostDialogOpen: (open) => set({ createPostDialogOpen: open }),
  setSelectedPostId: (id) => set({ selectedPostId: id }),
}));
