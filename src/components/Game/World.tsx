import { usePlane, useBox } from '@react-three/cannon'
import { useGameStore } from '@/store/gameStore'
import { useState, useRef } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

function Tree({ position, height }: { position: [number, number, number], height: number }) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, height/2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, height, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Tree foliage */}
      <mesh position={[0, height + 1, 0]} castShadow>
        <sphereGeometry args={[2, 8, 6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, height + 2.5, 0]} castShadow>
        <sphereGeometry args={[1.5, 8, 6]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
    </group>
  )
}

function Rock({ position, size }: { position: [number, number, number], size: number }) {
  return (
    <mesh position={position} castShadow>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color="#696969" roughness={0.9} />
    </mesh>
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

function Box({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [1, 1, 1], // Larger box
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
      {/* Box glow effect */}
      <pointLight position={[0, 0, 0]} intensity={0.2} distance={3} color="#ff6b35" />
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#8B4513"
          emissive="#8B4513"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Box label */}
      <mesh position={[0, 0.6, 0.51]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#ff6b35', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>
            MYSTERY BOX
          </div>
        </Html>
      </mesh>
    </group>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Plank({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [2, 0.1, 0.5], // Longer, thinner plank
    type: 'Static',
    isTrigger: true,
    onCollide: (e: any) => {
      if (!collected && e.body.userData?.type === 'player') {
        onCollect() // Used here
      }
    }
  }))

  if (collected) return null

  return (
    <group position={position}>
      {/* Plank glow effect */}
      <pointLight position={[0, 0, 0]} intensity={0.3} distance={4} color="#8B4513" />
      <mesh castShadow>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial
          color="#654321"
          emissive="#654321"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Plank label */}
      <mesh position={[0, 0.2, 0.26]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#8B4513', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
            WOODEN PLANK
          </div>
        </Html>
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
      <pointLight position={[0, 0, 0]} intensity={0.1} distance={2} color="#ffff00" />
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

function ExitDoor({ position }: any) {
  const { keysCollected, totalKeys, teleportPlayer, setCurrentWorld, currentWorld } = useGameStore()
  const [isShaking, setIsShaking] = useState(false)
  const glowIntensity = 0.5 // Fixed glow intensity

  const handleDoorInteraction = () => {
    if (keysCollected < totalKeys) {
      // Not enough keys - play locked sound and shake
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    // Door unlocked - TELEPORT TO DIFFERENT WORLD!
    console.log('🌍 TELEPORTING TO DIFFERENT WORLD! All keys collected!')
    if (currentWorld === 'room') {
      setCurrentWorld('forest')
    } else {
      setCurrentWorld('room')
    }
    teleportPlayer()
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
        onClick={handleDoorInteraction}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
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
            <div style={{ color: '#00ff00', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
              CLICK TO TELEPORT TO {currentWorld === 'room' ? 'STAGE 2 - FOREST' : 'STAGE 1 - ROOM'}!
            </div>
          </Html>
        </mesh>
      )}
    </group>
  )
}

function generateBoxPositions() {
  // Mystery boxes hidden in various locations around the room
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

function generateForestTrees() {
  // Random trees scattered in the forest
  return [
    { position: [-20, 0, -20] as [number, number, number], height: 8 },
    { position: [15, 0, -25] as [number, number, number], height: 12 },
    { position: [-30, 0, 10] as [number, number, number], height: 10 },
    { position: [25, 0, 15] as [number, number, number], height: 9 },
    { position: [0, 0, -35] as [number, number, number], height: 11 },
    { position: [-15, 0, 30] as [number, number, number], height: 7 },
    { position: [35, 0, -10] as [number, number, number], height: 13 },
    { position: [-25, 0, -5] as [number, number, number], height: 8 },
  ]
}

function generateForestRocks() {
  // Random rocks and boulders
  return [
    { position: [10, 0, 10] as [number, number, number], size: 2 },
    { position: [-10, 0, -15] as [number, number, number], size: 1.5 },
    { position: [20, 0, -5] as [number, number, number], size: 3 },
    { position: [-5, 0, 20] as [number, number, number], size: 1 },
    { position: [30, 0, 25] as [number, number, number], size: 2.5 },
  ]
}

function generateForestPlankPositions() {
  // Wooden planks scattered in the forest - need 7 to build something
  return [
    [-15, 1, -10] as [number, number, number],    // Near a tree
    [20, 1, 20] as [number, number, number],      // In a clearing
    [-25, 1, 15] as [number, number, number],     // Behind rocks
    [10, 1, -30] as [number, number, number],     // Near forest edge
    [30, 1, 5] as [number, number, number],       // By a large tree
    [-5, 1, 25] as [number, number, number],      // Hidden in bushes
    [5, 1, -15] as [number, number, number],      // Under fallen log
  ]
}

export default function World({ onGameComplete }: { onGameComplete: () => void }) {
  const { keysCollected, collectKey, totalKeys, poloCoinsCollected, collectPoloCoin, currentWorld } = useGameStore()
  const [keyPositions] = useState(() => generateBoxPositions())
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
      <fog attach="fog" args={currentWorld === 'room' ? ['#1a0a0a', 3, 15] : ['#2d5a3d', 10, 50]} />

      {/* Ground */}
      {currentWorld === 'room' ? (
        <mesh ref={groundRef} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            roughness={0.9}
            metalness={0.05}
            color="#2a1a1a"
          />
        </mesh>
      ) : (
        <mesh ref={groundRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial
            color="#4a7c59"
            roughness={0.8}
          />
        </mesh>
      )}

      {/* Room-specific elements */}
      {currentWorld === 'room' && (
        <>
          {/* Room walls */}
          {generateRoomWalls().map((wall, i) => (
            <Wall key={i} position={wall.position} size={wall.size} />
          ))}

          {/* Furniture */}
          {generateFurniture().map((item, i) => (
            <Furniture key={i} {...item} />
          ))}
        </>
      )}

      {/* Forest-specific elements */}
      {currentWorld === 'forest' && (
        <>
          {/* Trees scattered around */}
          {generateForestTrees().map((tree, i) => (
            <Tree key={i} position={tree.position} height={tree.height} />
          ))}

          {/* Rocks and boulders */}
          {generateForestRocks().map((rock, i) => (
            <Rock key={i} position={rock.position} size={rock.size} />
          ))}
        </>
      )}

      {/* Collectibles - Boxes in room, Planks in forest */}
      {currentWorld === 'room' ? (
        keyPositions.map((keyPos, i) => (
          <Box
            key={i}
            position={keyPos}
            collected={keysCollected > i}
            onCollect={() => collectKey()}
          />
        ))
      ) : (
        generateForestPlankPositions().map((plankPos, i) => (
          <Plank
            key={i}
            position={plankPos}
            collected={keysCollected > i}
            onCollect={() => collectKey()}
          />
        ))
      )}

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
        <ExitDoor position={[8, 2, 3]} onGameComplete={onGameComplete} />
      )}

      {/* Point light that follows the player */}
      {/* TERRIFYING LIGHTING - 1000x darker and more blood-red */}
      <ambientLight intensity={currentWorld === 'room' ? 0.02 : 0.1} color={currentWorld === 'room' ? "#330000" : "#4a7c59"} />
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