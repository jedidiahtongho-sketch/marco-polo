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
  shouldTeleport: boolean
  isGameComplete: boolean
  currentWorld: 'room' | 'forest' | 'dungeon' | 'cave' | 'kennel' | 'orchard'
  monsterAwakened: boolean
  planksCollected: number
  totalPlanks: number
  blackDoorVisible: boolean
  lastJumpTime: number
  jumpCooldown: number
  roomTimeLeft: number
  leviathanActive: boolean
  leviathanAttackTime: number
  crystalsCollected: number
  totalCrystals: number
  bonesCollected: number
  totalBones: number
  grapeVinesCollected: number
  totalGrapeVines: number
  
  setHealth: (health: number) => void
  decreaseHealth: (amount: number) => void
  increaseScore: (points: number) => void
  setGameOver: (isOver: boolean) => void
  setGameComplete: (complete: boolean) => void
  setHunterPosition: (position: [number, number, number]) => void
  setPlayerPosition: (position: [number, number, number]) => void
  collectKey: () => void
  collectMysteryBox: () => { type: 'key' | 'coins' | 'monster', amount?: number }
  setCurrentStage: (stage: number) => void
  setMonsterType: (type: string) => void
  setTimeDilation: (dilation: number) => void
  collectPoloCoin: () => void
  addFriend: (code: string) => void
  removeFriend: (code: string) => void
  toggleFlashlight: () => void
  incrementDoorUnlockAttempt: () => void
  resetDoorUnlock: () => void
  teleportPlayer: () => void
  setCurrentWorld: (world: 'room' | 'forest' | 'dungeon' | 'cave' | 'kennel' | 'orchard') => void
  awakenMonster: () => void
  collectPlank: () => void
  showBlackDoor: () => void
  canJump: () => boolean
  recordJump: () => void
  updateRoomTimer: () => void
  triggerLeviathanAttack: () => void
  resetRoomTimer: () => void
  collectCrystal: () => void
  collectBone: () => void
  collectGrapeVine: () => void
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
  shouldTeleport: false,
  isGameComplete: false,
  currentWorld: 'room' as 'room' | 'forest' | 'dungeon' | 'cave' | 'kennel' | 'orchard',
  monsterAwakened: false,
  planksCollected: 0,
  totalPlanks: 7,
  blackDoorVisible: false,
  lastJumpTime: 0,
  jumpCooldown: 5000, // 5 seconds in milliseconds
  roomTimeLeft: 30, // 30 seconds for room escape
  leviathanActive: false,
  leviathanAttackTime: 0,
  crystalsCollected: 0,
  totalCrystals: 8,
  bonesCollected: 0,
  totalBones: 9,
  grapeVinesCollected: 0,
  totalGrapeVines: 10,
  canJump: () => false,
  recordJump: () => {},
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
  
  setGameComplete: (complete) => set({ isGameComplete: complete }),
  
  setHunterPosition: (position) => set({ hunterPosition: position }),
  
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  collectKey: () => set((state) => ({
    keysCollected: state.keysCollected + 1,
    score: state.score + 100
  })),
  
  collectMysteryBox: () => {
    const outcomes = ['key', 'coins', 'monster'] as const
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)]
    
    if (randomOutcome === 'key') {
      set((state) => ({
        keysCollected: state.keysCollected + 1,
        score: state.score + 100
      }))
      return { type: 'key' as const }
    } else if (randomOutcome === 'coins') {
      const coinAmount = Math.floor(Math.random() * 3) + 1 // 1-3 coins
      set((state) => {
        const codes = []
        for (let i = 0; i < coinAmount; i++) {
          codes.push(`POLO${Math.random().toString(36).substr(2, 6).toUpperCase()}`)
        }
        return {
          poloCoinsCollected: state.poloCoinsCollected + coinAmount,
          poloCoins: state.poloCoins + coinAmount,
          score: state.score + (coinAmount * 10),
          collectedCodes: [...state.collectedCodes, ...codes]
        }
      })
      return { type: 'coins' as const, amount: coinAmount }
    } else {
      // Monster awakening
      set((state) => ({
        monsterAwakened: true,
        score: state.score - 50 // Penalty for awakening monster
      }))
      return { type: 'monster' as const }
    }
  },
  
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
  
  teleportPlayer: () => set({ shouldTeleport: true }),
  
  setCurrentWorld: (world) => set({ 
    currentWorld: world,
    isGameOver: false,
    isGameComplete: false,
    keysCollected: world === 'forest' ? 0 : world === 'dungeon' ? 0 : world === 'cave' ? 0 : world === 'kennel' ? 0 : world === 'orchard' ? 0 : 0, // Reset keys when entering new worlds
    totalKeys: world === 'forest' ? 7 : world === 'dungeon' ? 10 : world === 'cave' ? 8 : world === 'kennel' ? 9 : world === 'orchard' ? 10 : 5, // 7 planks in forest, 10 treasures in dungeon, 8 crystals in cave, 9 bones in kennel, 10 grape vines in orchard, 5 boxes in room
    planksCollected: world === 'forest' ? 0 : 0,
    crystalsCollected: world === 'cave' ? 0 : 0,
    bonesCollected: world === 'kennel' ? 0 : 0,
    grapeVinesCollected: world === 'orchard' ? 0 : 0,
  }),
  
  awakenMonster: () => set({ monsterAwakened: true }),
  
  collectPlank: () => set((state) => ({
    planksCollected: state.planksCollected + 1,
    score: state.score + 150,
    blackDoorVisible: state.planksCollected + 1 >= state.totalPlanks
  })),
  
  showBlackDoor: () => set({ blackDoorVisible: true }),
  
  updateRoomTimer: () => set((state) => {
    const newTime = Math.max(0, state.roomTimeLeft - 1)
    return {
      roomTimeLeft: newTime,
      isGameOver: newTime <= 0
    }
  }),
  
  triggerLeviathanAttack: () => set({ 
    leviathanActive: true,
    leviathanAttackTime: 4 // 4 seconds of attack
  }),
  
  resetRoomTimer: () => set({ 
    roomTimeLeft: 30,
    leviathanActive: false,
    leviathanAttackTime: 0
  }),
  
  collectCrystal: () => set((state) => ({
    crystalsCollected: state.crystalsCollected + 1,
    score: state.score + 200
  })),
  
  collectBone: () => set((state) => ({
    bonesCollected: state.bonesCollected + 1,
    score: state.score + 250
  })),
  
  collectGrapeVine: () => set((state) => ({
    grapeVinesCollected: state.grapeVinesCollected + 1,
    score: state.score + 300
  })),
  
  reset: () => set(initialState),
}))