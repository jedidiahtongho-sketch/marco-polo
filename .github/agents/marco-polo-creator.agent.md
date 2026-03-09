# Marco Polo Horror Game Creator - Copilot Agent

## Project Overview

This is a code generator agent that creates complete React-based horror games using spatial audio mechanics inspired by the Marco Polo game. The agent generates full-stack web applications with 3D graphics, physics, and immersive sound design.

## Technology Stack

### Core Technologies
- **React 18** with TypeScript
- **Three.js** with React Three Fiber for 3D rendering
- **Howler.js** for spatial/3D audio (CRITICAL - this is the core mechanic)
- **Zustand** for state management
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Cannon.js** (via @react-three/cannon) for physics

### Key Dependencies
```json
{
  "react": "^18.2.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0",
  "three": "^0.160.0",
  "howler": "^2.2.4",
  "framer-motion": "^10.16.0",
  "zustand": "^4.4.0"
}
```

## Code Patterns & Conventions

### Component Structure
- Use functional components with TypeScript
- Hooks for game logic (`useFrame`, `useThree`, custom hooks)
- Props interfaces defined above components
- Export default for main components

### State Management
- Zustand stores in `src/store/`
- Pattern: `useGameStore` with selectors
- Keep game state flat and focused

### 3D Components Pattern
```typescript
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'

export default function Entity() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 0, 0],
    args: [0.5]
  }))
  
  useFrame(() => {
    // Game loop logic here
  })
  
  return <mesh ref={ref}>...</mesh>
}
```

### Audio Pattern
```typescript
import { audioManager } from '@/audio/AudioManager'

// Load sounds
audioManager.loadSound('key', '/audio/file.mp3', { spatial: true })

// Play with 3D position
audioManager.play('key')
audioManager.set3DPosition('key', x, y, z)
```

## Generator Architecture

### Main Script: `marco-polo-creator.js`
- Node.js script using CommonJS
- Class-based architecture: `MarcoPoleCreator`
- Methods for each generation phase:
  - `createProjectStructure()` - Creates folders
  - `generateConfigFiles()` - Vite, TS, Tailwind configs
  - `createGameFiles()` - React components
  - `createAudioSystem()` - Howler.js wrapper
  - `createGameLogic()` - Zustand stores, game mechanics

### Generation Flow
1. Create folder structure
2. Generate config files (vite, tsconfig, tailwind)
3. Create package.json with dependencies
4. Generate main app files (App.tsx, main.tsx)
5. Create game components (Player, Hunter, World)
6. Create UI components (Menu, HUD)
7. Generate audio system
8. Create game logic (stores, hooks)
9. Add styles and assets

## Game Architecture

### Component Hierarchy
```
App
├── MainMenu (Framer Motion)
├── LoadingScreen
└── Game
    ├── Canvas (R3F)
    │   ├── World (Maze)
    │   ├── Player (Controller)
    │   ├── Hunter (AI)
    │   └── Effects
    └── GameUI (HUD)
```

### State Structure
```typescript
interface GameState {
  health: number
  score: number
  isGameOver: boolean
  hunterPosition: [number, number, number]
  playerPosition: [number, number, number]
  lastMarcoTime: number
}
```

## Core Mechanics

### Spatial Audio (CRITICAL)
- Hunter calls "Marco!" from its 3D position
- Player hears direction and distance via stereo panning
- Player responds with "Polo!" to see but reveals location
- All implemented via Howler.js 3D audio API

### AI Behavior
- Hunter moves toward player position
- Periodic "Marco!" calls at random intervals
- Collision detection for damage
- Pathfinding through maze

### Player Controls
- WASD for movement
- Mouse for camera (pointer lock)
- SPACE for "Polo!" response
- First-person perspective

## When Assisting with Code

### Always Consider
1. **TypeScript types** - All components should be typed
2. **Performance** - Use `useFrame` carefully, avoid expensive operations
3. **Physics** - Collision bodies must match visual geometry
4. **Audio** - Spatial positioning is critical for gameplay
5. **Dark theme** - This is a horror game, keep it dark and atmospheric

### Common Tasks

#### Adding New Enemy Type
1. Create in `src/components/Game/NewEnemy.tsx`
2. Use `useSphere` or `useBox` for physics
3. Add to Zustand store for tracking
4. Load audio for enemy sounds
5. Add to `<Game>` component

#### Adding New Game Mechanic
1. Add state to `gameStore.ts`
2. Create hook in `src/hooks/`
3. Integrate in relevant component
4. Update UI to show new mechanic

#### Adjusting Difficulty
- Hunter speed: `src/components/Game/Hunter.tsx` → `speed` variable
- Marco frequency: `Hunter.tsx` → `marcoInterval`
- Fog visibility: `Game.tsx` → fog `args`
- Player health: `gameStore.ts` → initial `health`

### Code Style
- Use arrow functions for components
- Destructure props
- Keep components under 200 lines
- Extract complex logic to hooks
- Use TypeScript `interface` for props, `type` for unions

### File Naming
- Components: PascalCase (e.g., `GameUI.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `usePlayerControls.ts`)
- Stores: camelCase with 'Store' suffix (e.g., `gameStore.ts`)
- Utils: camelCase (e.g., `audioManager.ts`)

## Testing & Debugging

### Common Issues
- **Audio not working**: Check file paths, browser autoplay policy
- **Physics objects falling through floor**: Verify collision groups
- **Performance issues**: Reduce fog distance, simplify maze
- **TypeScript errors**: Check Three.js type imports

### Browser Requirements
- WebGL 2.0 support
- Web Audio API
- Pointer Lock API
- ES2020+ JavaScript

## Extending the Generator

### Adding New Templates
1. Create method in `MarcoPoleCreator` class
2. Add file generation in method
3. Call from `create()` method
4. Update console logging

### Adding Dependencies
1. Update `createPackageJson()` method
2. Add to `dependencies` or `devDependencies`
3. Document in README

### Configuration Changes
1. Update relevant config generator method
2. Test generated project builds
3. Update documentation

## Horror Game Design Principles

### Atmosphere
- Minimal lighting (ambient < 0.1)
- Fog for limited visibility
- Dark color palette (blacks, grays, blood reds)
- Eerie ambient audio

### Tension Building
- Unpredictable timing (random intervals)
- Sound as primary navigation
- Risk vs reward mechanics
- Limited resources (health)

### Audio Design
- 3D spatial positioning (Howler.js)
- Reverb and echo for atmosphere
- Heartbeat increases with danger
- Sudden loud sounds for scares

## Best Practices

### Performance
- Keep draw calls low
- Use instancing for repeated geometry
- Optimize fog distance
- Limit real-time shadows

### State Management
- Keep Zustand stores focused
- Use selectors to prevent re-renders
- Batch state updates

### Audio
- Preload all sounds
- Use audio sprites for small sounds
- Implement spatial audio for immersion
- Add fallbacks for browser compatibility

### Type Safety
- Define interfaces for all props
- Use strict TypeScript settings
- Avoid `any` type
- Leverage Three.js type definitions

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Manual](https://threejs.org/manual/)
- [Howler.js Documentation](https://howlerjs.com/)
- [Zustand Guide](https://docs.pmnd.rs/zustand)

## Agent Behavior

When helping with this project:
1. Maintain the horror atmosphere in all additions
2. Prioritize spatial audio functionality
3. Keep code TypeScript-strict
4. Follow React Three Fiber best practices
5. Optimize for browser performance
6. Document complex game mechanics
7. Consider gameplay balance in changes

---

**Remember**: The spatial audio is not just atmosphere - it's the core game mechanic. Every change should consider how it affects the player's ability to use sound for navigation and survival.
