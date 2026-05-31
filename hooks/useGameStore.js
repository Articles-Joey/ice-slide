import { createWithEqualityFn as create } from 'zustand/traditional'

export const useGameStore = create((set) => ({
    gameState: {},
    setGameState: (newValue) => {
        set((prev) => ({
            gameState: typeof newValue === 'function' ? newValue(prev.gameState) : newValue
        }))
    },
}))