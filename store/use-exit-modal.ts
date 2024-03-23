import { create } from 'zustand'

type ExitModalstate = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useExitModal = create<ExitModalstate>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}))
