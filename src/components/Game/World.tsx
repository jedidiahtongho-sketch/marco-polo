import { usePlane, useBox } from '@react-three/cannon'
import { useGameStore } from '@/store/gameStore'
import { useState, useRef } from 'react'
import { Html } from '@react-three/drei'

export default function World({ onGameComplete }: { onGameComplete: () => void }) {
  const { keysCollected, collectKey, totalKeys, poloCoinsCollected, collectPoloCoin } = useGameStore()
  const [keyPositions] = useState(() => generateKeyPositions())
  const [poloCoinPositions] = useState(() => generatePoloCoinPositions())

  const groundRef = useRef<THREE.Mesh>(null)
  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0]
  }))

  // Load textures (placeholder - in real app, add texture files)
  // const floorTexture = useTexture('/textures/floor.jpg', (texture) => {
  //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  //   texture.repeat.set(10, 10)
  // })

  return (
    <>
      {/* TERRIFYING FOG - makes everything mysterious and scary */}
      <fog attach="fog" args={['#1a0a0a', 3, 15]} />

      {/* Ground - now blood-stained */}
      <mesh ref={groundRef} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          roughness={0.9}
          metalness={0.05}
          color="#2a1a1a"
        />
      </mesh>

      {/* Room walls */}
      {generateRoomWalls().map((wall, i) => (
        <Wall key={i} position={wall.position} size={wall.size} />
      ))}

      {/* Furniture */}
      {generateFurniture().map((item, i) => (
        <Furniture key={i} {...item} />
      ))}

      {/* Keys */}
      {keyPositions.map((keyPos, i) => (
        <Key
          key={i}
          position={keyPos}
          collected={keysCollected > i}
          onCollect={() => collectKey()}
        />
      ))}

      {/* Polo Coins */}
      {poloCoinPositions.map((coinPos, i) => (
        <PoloCoin
          key={i}
          position={coinPos}
          collected={poloCoinsCollected > i}
          onCollect={() => collectPoloCoin()}
        />
      ))}

      {/* Exit door - only visible when all keys collected */}
      {keysCollected >= totalKeys && (
        <ExitDoor position={[0, 2, -20]} onGameComplete={onGameComplete} />
      )}

      {/* Point light that follows the player */}
      {/* TERRIFYING LIGHTING - 1000x darker and more blood-red */}
      <ambientLight intensity={0.02} color="#330000" /> {/* Extremely dim blood-red ambient */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.1}
        color="#8B0000"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.03} distance={20} color="#DC143C" castShadow /> {/* Very dim blood-red overhead */}

      {/* TERRIFYING BLOOD PARTICLES floating in the air */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 30,
          Math.random() * 8 + 1,
          (Math.random() - 0.5) * 30
        ]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial
            color="#8B0000"
            emissive="#8B0000"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}

      {/* Floating demonic whispers in the air */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`whisper-${i}`} position={[
          Math.cos((i / 8) * Math.PI * 2) * 12,
          4 + Math.sin(i) * 2,
          Math.sin((i / 8) * Math.PI * 2) * 12
        ]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#DC143C"
            emissiveIntensity={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  )
}

function Wall({ position, size }: any) {
  const wallRef = useRef<THREE.Mesh>(null)
  useBox(() => ({
    position,
    args: size.args,
    type: 'Static'
  }))

  return (
    <mesh ref={wallRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size.args} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  )
}

function Furniture({ position, size, color }: any) {
  const [ref] = useBox(() => ({
    position,
    args: size,
    type: 'Static'
  }))

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Key({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [0.2, 0.1, 0.5],
    type: 'Static',
    isTrigger: true,
    onCollide: (e: any) => {
      if (!collected && e.body.userData?.type === 'player') {
        onCollect()
      }
    }
  }))

  if (collected) return null

  return (
    <group position={position}>
      {/* Key glow effect */}
      <pointLight position={[0, 0, 0]} intensity={0.1} distance={2} color="#ffff00" />
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.1, 0.5]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Key handle */}
      <mesh position={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
    </group>
  )
}

function PoloCoin({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [0.3, 0.05, 0.3],
    type: 'Static',
    isTrigger: true,
    onCollide: (e: any) => {
      if (!collected && e.body.userData?.type === 'player') {
        onCollect()
      }
    }
  }))

  if (collected) return null

  return (
    <group position={position}>
      {/* Polo Coin glow effect */}
      <pointLight position={[0, 0, 0]} intensity={0.05} distance={1.5} color="#00ffff" />
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Coin engraving */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.01]} />
        <meshStandardMaterial color="#0080ff" />
      </mesh>
    </group>
  )
}

function ExitDoor({ position }: any) {
  const { doorUnlockAttempts, doorUnlockRequired, incrementDoorUnlockAttempt, keysCollected, totalKeys, setCurrentStage } = useGameStore()
  const [isShaking, setIsShaking] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0.5)

  const handleDoorInteraction = () => {
    if (keysCollected < totalKeys) {
      // Not enough keys - play locked sound and shake
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    // Increment unlock attempts
    incrementDoorUnlockAttempt()

    // Visual feedback
    setIsShaking(true)
    setGlowIntensity(1.0)
    setTimeout(() => {
      setIsShaking(false)
      setGlowIntensity(0.5)
    }, 500)

    // Check if door is fully unlocked
    if (doorUnlockAttempts + 1 >= doorUnlockRequired) {
      // Door unlocked - progress to next stage
      setTimeout(() => {
        setCurrentStage(useGameStore.getState().currentStage + 1)
      }, 1000)
    }
  }

  const [ref] = useBox(() => ({
    position,
    args: [2, 4, 0.2],
    type: 'Static',
    onCollide: (e: any) => {
      // Check if player collided with door
      if (e.body.userData?.type === 'player') {
        handleDoorInteraction()
      }
    }
  }))

  return (
    <group position={position}>
      {/* Door frame glow */}
      <pointLight position={[0, 0, 0]} intensity={glowIntensity} distance={3} color="#00ff00" />
      <mesh 
        ref={ref as any} 
        castShadow
        position={isShaking ? [Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05, 0] : [0, 0, 0]}
      >
        <boxGeometry args={[2, 4, 0.2]} />
        <meshStandardMaterial
          color="#008000"
          emissive="#008000"
          emissiveIntensity={glowIntensity}
        />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.5, 0, 0.15]} castShadow>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      {/* Progress indicator */}
      {keysCollected >= totalKeys && (
        <mesh position={[0, -2.5, 0.15]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          <Html center>
            <div style={{ color: 'white', fontSize: '12px', textAlign: 'center' }}>
              Attempts: {doorUnlockAttempts}/{doorUnlockRequired}
            </div>
          </Html>
        </mesh>
      )}
    </group>
  )
}

function generateRoomWalls() {
  const walls = []
  
  // Room boundaries (20x20 room centered at origin)
  const roomSize = 20
  const wallHeight = 4
  const wallThickness = 0.5
  
  // Front wall (negative Z) with door opening in center
  walls.push({ 
    position: [0, wallHeight/2, -roomSize/2], 
    size: { args: [roomSize - 4, wallHeight, wallThickness] } 
  })
  
  // Back wall (positive Z)
  walls.push({ 
    position: [0, wallHeight/2, roomSize/2], 
    size: { args: [roomSize, wallHeight, wallThickness] } 
  })
  
  // Left wall (negative X)
  walls.push({ 
    position: [-roomSize/2, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, roomSize] } 
  })
  
  // Right wall (positive X)
  walls.push({ 
    position: [roomSize/2, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, roomSize] } 
  })

  return walls
}

function generateFurniture() {
  const furniture = []
  
  // Couch
  furniture.push({
    position: [-8, 1, 5],
    size: [4, 1, 2],
    color: '#8B4513',
    type: 'couch'
  })
  
  // Coffee table
  furniture.push({
    position: [-8, 0.5, 2],
    size: [2, 1, 1],
    color: '#654321',
    type: 'table'
  })
  
  // Bookshelf
  furniture.push({
    position: [8, 2, 5],
    size: [1, 4, 3],
    color: '#8B4513',
    type: 'bookshelf'
  })
  
  // Bed
  furniture.push({
    position: [8, 1, -5],
    size: [3, 1, 2],
    color: '#4169E1',
    type: 'bed'
  })
  
  // Nightstand
  furniture.push({
    position: [5, 0.5, -5],
    size: [1, 1, 1],
    color: '#8B4513',
    type: 'nightstand'
  })
  
  // Desk
  furniture.push({
    position: [-5, 1, -8],
    size: [2, 1, 1],
    color: '#8B4513',
    type: 'desk'
  })
  
  // Chair
  furniture.push({
    position: [-5, 1, -5],
    size: [1, 1, 1],
    color: '#654321',
    type: 'chair'
  })
  
  // Cabinet
  furniture.push({
    position: [0, 1.5, 8],
    size: [2, 3, 1],
    color: '#654321',
    type: 'cabinet'
  })
  
  return furniture
}

function generateKeyPositions() {
  // Keys hidden in various locations around the room
  return [
    [-8, 1.5, 5],    // On couch
    [8, 3, 5],       // Top shelf of bookshelf
    [8, 1.5, -5],    // Under bed
    [5, 1, -5],      // On nightstand
    [-5, 1.5, -8],   // On desk
  ]
}

function generatePoloCoinPositions() {
  // Polo Coins scattered around the room
  return [
    [-6, 1, 3],      // Near couch
    [6, 1, 3],       // Near bookshelf
    [6, 1, -3],      // Near bed
    [3, 1, -3],      // Near nightstand
    [-3, 1, -6],     // Near desk
    [0, 1, 6],       // Center area
    [-4, 1, 0],      // Left side
    [4, 1, 0],       // Right side
    [0, 1, -6],      // Back area
    [-2, 1, 4],      // Random spot
  ]
}