# Marco's Curse

A first-person horror game built with React, Three.js, and spatial audio.

## 🎮 Game Concept

You're trapped in a dark maze with a malevolent entity hunting you. The entity periodically calls out "Marco!" and you must use spatial audio cues to locate and avoid it. When you respond with "Polo!" (by pressing SPACE), you can momentarily see your surroundings, but you also reveal your location to the hunter.

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics
- **Howler.js** - Spatial audio system
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## 🎮 Controls

- **WASD / Arrow Keys** - Move
- **Mouse** - Look around
- **Space** - Call "Polo!" (reveals your position)
- **ESC** - Exit pointer lock

## 🎯 Game Features

- ✅ First-person 3D movement
- ✅ Spatial audio (use headphones!)
- ✅ Dynamic lighting system
- ✅ AI-controlled hunter
- ✅ Procedural maze
- ✅ Health system
- ✅ Atmospheric horror effects

## 📁 Project Structure

```
src/
├── components/
│   ├── Game/          # Game world components
│   └── UI/            # UI components
├── game/
│   ├── entities/      # Game entities
│   ├── systems/       # Game systems
│   └── world/         # World generation
├── store/             # State management
├── hooks/             # Custom React hooks
├── audio/             # Audio management
└── styles/            # CSS styles
```

## 🔊 Audio Setup

The game uses spatial audio for immersion. For the best experience:

1. Use headphones
2. Place audio files in `public/audio/`:
   - `ambiance.mp3` - Background ambiance
   - `marco.mp3` - Hunter's call
   - `polo.mp3` - Player's response
   - `footsteps.mp3` - Movement sounds
   - `heartbeat.mp3` - Tension indicator
   - `jumpscare.mp3` - Game over sound

## 🎨 Customization

### Adjusting Difficulty

Edit `src/components/Game/Hunter.tsx`:
- Change `marcoInterval` for frequency of Marco calls
- Adjust `speed` for hunter movement speed
- Modify damage amount in collision detection

### Visual Effects

Edit `src/components/Game/Game.tsx`:
- Adjust fog density
- Change ambient light intensity
- Modify camera FOV

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## ⚠️ Note

This is a horror game with jump scares and intense audio. Play at your own risk!
