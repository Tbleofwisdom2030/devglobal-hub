// UI state store
// TODO: Add UI store
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileNavOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileNav: () => void;
  closeSidebar: () => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileNavOpen: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  closeSidebar: () => set({ isSidebarOpen: false }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
}));