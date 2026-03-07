import { create } from 'zustand'

interface GameState {
  health: number
  score: number
  isGameOver: boolean
  hunterPosition: [number, number, number]
  playerPosition: [number, number, number]
  keysCollected: number
  totalKeys: number
  currentStage: number
  monsterType: string
  timeDilation: number
  poloCoins: number
  poloCoinsCollected: number
  totalPoloCoins: number
  collectedCodes: string[]
  playerCode: string
  friends: string[]
  flashlightOn: boolean
  doorUnlockAttempts: number
  doorUnlockRequired: number
  
  setHealth: (health: number) => void
  decreaseHealth: (amount: number) => void
  increaseScore: (points: number) => void
  setGameOver: (isOver: boolean) => void
  setHunterPosition: (position: [number, number, number]) => void
  setPlayerPosition: (position: [number, number, number]) => void
  collectKey: () => void
  setCurrentStage: (stage: number) => void
  setMonsterType: (type: string) => void
  setTimeDilation: (dilation: number) => void
  collectPoloCoin: () => void
  addFriend: (code: string) => void
  removeFriend: (code: string) => void
  toggleFlashlight: () => void
  incrementDoorUnlockAttempt: () => void
  resetDoorUnlock: () => void
  reset: () => void
}

const initialState = {
  health: 100,
  score: 0,
  isGameOver: false,
  hunterPosition: [0, 0, 0] as [number, number, number],
  playerPosition: [0, 0, 0] as [number, number, number],
  keysCollected: 0,
  totalKeys: 5,
  currentStage: 1,
  monsterType: 'stalker',
  timeDilation: 1,
  poloCoins: 0,
  poloCoinsCollected: 0,
  totalPoloCoins: 10,
  collectedCodes: [],
  playerCode: `${Math.random().toString(36).substr(2, 5).toUpperCase()}`.toUpperCase(),
  friends: [],
  flashlightOn: true,
  doorUnlockAttempts: 0,
  doorUnlockRequired: 3,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  
  setHealth: (health) => set({ health }),
  
  decreaseHealth: (amount) => set((state) => {
    const newHealth = Math.max(0, state.health - amount)
    return {
      health: newHealth,
      isGameOver: newHealth <= 0
    }
  }),
  
  increaseScore: (points) => set((state) => ({
    score: state.score + points
  })),
  
  setGameOver: (isOver) => set({ isGameOver: isOver }),
  
  setHunterPosition: (position) => set({ hunterPosition: position }),
  
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  collectKey: () => set((state) => ({
    keysCollected: state.keysCollected + 1,
    score: state.score + 100
  })),
  
  setCurrentStage: (stage) => set({ currentStage: stage }),
  
  setMonsterType: (type) => set({ monsterType: type }),
  
  setTimeDilation: (dilation) => set({ timeDilation: dilation }),
  
  collectPoloCoin: () => set((state) => {
    const code = `POLO${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    return {
      poloCoinsCollected: state.poloCoinsCollected + 1,
      poloCoins: state.poloCoins + 1,
      score: state.score + 10,
      collectedCodes: [...state.collectedCodes, code]
    }
  }),
  addFriend: (code: string) => set((state) => ({
    friends: state.friends.includes(code) ? state.friends : [...state.friends, code]
  })),
  removeFriend: (code: string) => set((state) => ({
    friends: state.friends.filter(f => f !== code)
  })),
  toggleFlashlight: () => set((state) => ({
    flashlightOn: !state.flashlightOn
  })),
  
  incrementDoorUnlockAttempt: () => set((state) => ({
    doorUnlockAttempts: state.doorUnlockAttempts + 1
  })),
  
  resetDoorUnlock: () => set({
    doorUnlockAttempts: 0
  }),
  
  reset: () => set(initialState),
}))