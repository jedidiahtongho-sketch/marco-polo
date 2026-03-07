import { usePlane, useBox } from '@react-three/cannon'
import { useGameStore } from '@/store/gameStore'
import { useState, useRef } from 'react'
import { Html, useTexture } from '@react-three/drei'
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

function RealisticTable({ position }: { position: [number, number, number] }) {
  // Create wood-like material with procedural properties
  const woodMaterial = {
    color: '#8B4513',
    roughness: 0.8,
    metalness: 0.1,
    // Add some variation to simulate wood grain
    normalScale: new THREE.Vector2(0.5, 0.5),
  }

  const legPositions = [
    [-0.9, 0.5, -0.4], // front left
    [0.9, 0.5, -0.4],  // front right
    [-0.9, 0.5, 0.4],  // back left
    [0.9, 0.5, 0.4],   // back right
  ]

  // Physics for table top
  useBox(() => ({
    position: [position[0], position[1] + 1, position[2]],
    args: [2, 0.1, 1],
    type: 'Static'
  }))

  // Physics for legs
  legPositions.forEach((legPos) => {
    useBox(() => ({
      position: [position[0] + legPos[0], position[1] + legPos[1], position[2] + legPos[2]],
      args: [0.05, 1, 0.05],
      type: 'Static'
    }))
  })

  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial {...woodMaterial} />
      </mesh>

      {/* Table legs */}
      {legPositions.map((legPos, index) => (
        <mesh key={index} position={legPos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial {...woodMaterial} />
        </mesh>
      ))}
    </group>
  )
}

function RealisticBookshelf({ position }: { position: [number, number, number] }) {
  const woodMaterial = {
    color: '#654321',
    roughness: 0.7,
    metalness: 0.05,
  }

  // Physics for main frame
  useBox(() => ({
    position: [position[0], position[1] + 2, position[2]],
    args: [1, 4, 3],
    type: 'Static'
  }))

  // Physics for shelves
  const shelfHeights = [0.5, 1.5, 2.5, 3.5]
  shelfHeights.forEach((y) => {
    useBox(() => ({
      position: [position[0], position[1] + y, position[2]],
      args: [0.9, 0.05, 2.8],
      type: 'Static'
    }))
  })

  return (
    <group position={position}>
      {/* Main bookshelf frame */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 4, 3]} />
        <meshStandardMaterial {...woodMaterial} />
      </mesh>

      {/* Shelves */}
      {shelfHeights.map((y, index) => (
        <mesh key={index} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.05, 2.8]} />
          <meshStandardMaterial {...woodMaterial} />
        </mesh>
      ))}

      {/* Books (simulated with different colored boxes) */}
      {Array.from({ length: 12 }, (_, i) => {
        const shelf = Math.floor(i / 3)
        const bookInShelf = i % 3
        const x = (bookInShelf - 1) * 0.3
        const y = 0.5 + shelf * 1
        const z = (Math.random() - 0.5) * 0.1
        const height = 0.8 + Math.random() * 0.4
        const color = ['#8B0000', '#000080', '#006400', '#8B4513'][Math.floor(Math.random() * 4)]

        return (
          <mesh key={i} position={[x, y + height/2, z]} castShadow>
            <boxGeometry args={[0.2, height, 0.15]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

function RealisticBed({ position }: { position: [number, number, number] }) {
  const woodMaterial = {
    color: '#654321',
    roughness: 0.8,
    metalness: 0.1,
  }

  const fabricMaterial = {
    color: '#4169E1',
    roughness: 0.9,
    metalness: 0.0,
  }

  // Physics for bed frame
  useBox(() => ({
    position: [position[0], position[1] + 0.3, position[2]],
    args: [3, 0.6, 2],
    type: 'Static'
  }))

  // Physics for mattress
  useBox(() => ({
    position: [position[0], position[1] + 0.7, position[2]],
    args: [2.8, 0.4, 1.8],
    type: 'Static'
  }))

  // Physics for bed legs
  const bedLegPositions = [
    [-1.3, 0.15, -0.8],
    [1.3, 0.15, -0.8],
    [-1.3, 0.15, 0.8],
    [1.3, 0.15, 0.8]
  ]
  bedLegPositions.forEach((legPos) => {
    useBox(() => ({
      position: [position[0] + legPos[0], position[1] + legPos[1], position[2] + legPos[2]],
      args: [0.05, 0.3, 0.05],
      type: 'Static'
    }))
  })

  return (
    <group position={position}>
      {/* Bed frame */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.6, 2]} />
        <meshStandardMaterial {...woodMaterial} />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.4, 1.8]} />
        <meshStandardMaterial {...fabricMaterial} />
      </mesh>

      {/* Pillows */}
      <mesh position={[-1, 0.9, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      <mesh position={[1, 0.9, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>

      {/* Bed legs */}
      {bedLegPositions.map((legPos, index) => (
        <mesh key={index} position={legPos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
          <meshStandardMaterial {...woodMaterial} />
        </mesh>
      ))}
    </group>
  )
}

function RealisticCouch({ position }: { position: [number, number, number] }) {
  const woodMaterial = {
    color: '#654321',
    roughness: 0.8,
    metalness: 0.1,
  }

  const fabricMaterial = {
    color: '#8B4513',
    roughness: 0.9,
    metalness: 0.0,
  }

  // Physics for couch base
  useBox(() => ({
    position: [position[0], position[1] + 0.4, position[2]],
    args: [4, 0.8, 2],
    type: 'Static'
  }))

  // Physics for cushions
  useBox(() => ({
    position: [position[0], position[1] + 0.8, position[2]],
    args: [3.8, 0.4, 1.8],
    type: 'Static'
  }))

  // Physics for back
  useBox(() => ({
    position: [position[0], position[1] + 1.2, position[2] - 0.8],
    args: [3.8, 1.2, 0.2],
    type: 'Static'
  }))

  // Physics for arms
  useBox(() => ({
    position: [position[0] - 1.9, position[1] + 0.8, position[2]],
    args: [0.2, 0.8, 1.8],
    type: 'Static'
  }))
  useBox(() => ({
    position: [position[0] + 1.9, position[1] + 0.8, position[2]],
    args: [0.2, 0.8, 1.8],
    type: 'Static'
  }))

  return (
    <group position={position}>
      {/* Couch base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.8, 2]} />
        <meshStandardMaterial {...woodMaterial} />
      </mesh>

      {/* Couch cushions */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.4, 1.8]} />
        <meshStandardMaterial {...fabricMaterial} />
      </mesh>

      {/* Couch back */}
      <mesh position={[0, 1.2, -0.8]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 1.2, 0.2]} />
        <meshStandardMaterial {...fabricMaterial} />
      </mesh>

      {/* Couch arms */}
      <mesh position={[-1.9, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.8, 1.8]} />
        <meshStandardMaterial {...woodMaterial} />
      </mesh>
      <mesh position={[1.9, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.8, 1.8]} />
        <meshStandardMaterial {...woodMaterial} />
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

function WaterWall({ position, size }: any) {
  const wallRef = useRef<THREE.Mesh>(null)
  useBox(() => ({
    position,
    args: size.args,
    type: 'Static'
  }))

  return (
    <mesh ref={wallRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size.args} />
      <meshStandardMaterial 
        color="#0066cc" 
        transparent 
        opacity={0.7}
        roughness={0.1}
        metalness={0.1}
      />
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
      <meshStandardMaterial color="#666666" />
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
  const { collectMysteryBox } = useGameStore()
  const [collectionResult, setCollectionResult] = useState<{ type: 'key' | 'coins' | 'monster', amount?: number } | null>(null)
  const [showResult, setShowResult] = useState(false)

  useBox(() => ({
    position,
    args: [1, 1, 1], // Larger box
    type: 'Static',
    isTrigger: true,
    onCollide: (e: any) => {
      if (!collected && e.body.userData?.type === 'player') {
        const result = collectMysteryBox()
        setCollectionResult(result)
        setShowResult(true)
        setTimeout(() => setShowResult(false), 2000) // Hide after 2 seconds
        onCollect()
      }
    }
  }))

  if (collected) return null

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Item label */}
      <mesh position={[0, 0.6, 0.51]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#ff6b35', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>
            MYSTERY BOX
          </div>
        </Html>
      </mesh>
      {/* Collection result popup */}
      {showResult && collectionResult && (
        <mesh position={[0, 1.2, 0.51]}>
          <planeGeometry args={[1.5, 0.4]} />
          <meshBasicMaterial 
            color={collectionResult.type === 'monster' ? '#ff0000' : collectionResult.type === 'coins' ? '#00ff00' : '#ffff00'} 
            transparent 
            opacity={0.9} 
          />
          <Html center>
            <div style={{ 
              color: '#000000', 
              fontSize: '14px', 
              textAlign: 'center', 
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255,255,255,0.5)'
            }}>
              {collectionResult.type === 'key' && '🔑 KEY FOUND!'}
              {collectionResult.type === 'coins' && `🪙 ${collectionResult.amount} POLO COINS!`}
              {collectionResult.type === 'monster' && '👹 MONSTER AWAKENED!'}
            </div>
          </Html>
        </mesh>
      )}
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
      <mesh castShadow>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial
          color="#654321"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>      {/* Item label */}
      <mesh position={[0, 0.2, 0.26]}>
        <planeGeometry args={[1.5, 0.15]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#ff6b35', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
            WOODEN PLANK
          </div>
        </Html>
      </mesh>    </group>
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
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

function GrapeVine({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [0.5, 0.5, 0.5], // Small vine cluster
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
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#228B22"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Item label */}
      <mesh position={[0, 0.3, 0.26]}>
        <planeGeometry args={[0.8, 0.15]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#ff6b35', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
            GRAPE VINE
          </div>
        </Html>
      </mesh>
    </group>
  )
}

function FruitTree({ position, type }: { position: [number, number, number], type: string }) {
  const colors = {
    apple: '#FF0000',
    orange: '#FFA500',
    lemon: '#FFFF00',
    kumquat: '#FFA07A',
    grape: '#800080'
  }

  const color = colors[type as keyof typeof colors] || '#00FF00'

  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Tree foliage */}
      <mesh position={[0, 4, 0]} castShadow>
        <sphereGeometry args={[2]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      {/* Fruit */}
      <mesh position={[0.5, 3.5, 0.5]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.3, 4.2, 0.3]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 3.8, -0.4]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function ExitDoor({ position }: any) {
  const { keysCollected, totalKeys, bonesCollected, totalBones, grapeVinesCollected, totalGrapeVines, teleportPlayer, setCurrentWorld, currentWorld, setGameComplete } = useGameStore()
  const [isShaking, setIsShaking] = useState(false)
  const glowIntensity = 0.5 // Fixed glow intensity

  const getRequiredCollectibles = () => {
    if (currentWorld === 'kennel') return { collected: bonesCollected, total: totalBones, name: 'bones' }
    if (currentWorld === 'orchard') return { collected: grapeVinesCollected, total: totalGrapeVines, name: 'grape vines' }
    return { collected: keysCollected, total: totalKeys, name: 'keys' }
  }

  const { collected, total, name } = getRequiredCollectibles()

  const handleDoorInteraction = () => {
    if (collected < total) {
      // Not enough collectibles - play locked sound and shake
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    // Door unlocked - TELEPORT TO DIFFERENT WORLD OR COMPLETE GAME!
    console.log('🌍 TELEPORTING! All collectibles collected!')
    if (currentWorld === 'room') {
      setCurrentWorld('forest')
    } else if (currentWorld === 'forest') {
      setCurrentWorld('dungeon')
    } else if (currentWorld === 'dungeon') {
      setCurrentWorld('cave')
    } else if (currentWorld === 'cave') {
      setCurrentWorld('kennel')
    } else if (currentWorld === 'kennel') {
      // Blue door to orchard!
      console.log('🔵 BLUE DOOR APPEARS! Teleporting to STAGE 5 - THE ORCHARD!')
      setCurrentWorld('orchard')
    } else if (currentWorld === 'orchard') {
      // Game completed!
      console.log('🏆 GAME COMPLETED! All grape vines collected!')
      setGameComplete(true)
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

  const doorColor = currentWorld === 'kennel' ? '#0000ff' : '#008000' // Blue for kennel exit, green otherwise
  const emissiveColor = currentWorld === 'kennel' ? '#0000ff' : '#008000'

  return (
    <group position={position}>
      {/* Door frame glow */}
      <pointLight position={[0, 0, 0]} intensity={glowIntensity} distance={3} color={doorColor} />
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
          color={doorColor}
          emissive={emissiveColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.5, 0, 0.15]} castShadow>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      {/* Progress indicator */}
      {collected >= total && (
        <mesh position={[0, -2.5, 0.15]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          <Html center>
            <div style={{ color: '#00ff00', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
              CLICK TO TELEPORT TO {
                currentWorld === 'room' ? 'STAGE 2 - FOREST' : 
                currentWorld === 'forest' ? 'STAGE 3 - DUNGEON' :
                currentWorld === 'dungeon' ? 'STAGE 4 - CAVE' :
                currentWorld === 'cave' ? 'STAGE 5 - KENNEL' :
                currentWorld === 'kennel' ? 'STAGE 6 - ORCHARD' :
                'VICTORY!'
              }!
            </div>
          </Html>
        </mesh>
      )}
    </group>
  )
}

function RedDoor({ position }: any) {
  const { crystalsCollected, totalCrystals, teleportPlayer, setCurrentWorld } = useGameStore()
  const [isShaking, setIsShaking] = useState(false)

  const handleDoorInteraction = () => {
    if (crystalsCollected < totalCrystals) {
      // Not enough crystals - play locked sound and shake
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    // Door unlocked - TELEPORT TO KENNEL!
    console.log('🏠 TELEPORTING TO STAGE 4 - THE GIANT DOG KENNEL! All crystals collected!')
    setCurrentWorld('kennel')
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
      {/* Red door frame glow - ominous red glow */}
      <pointLight position={[0, 0, 0]} intensity={1.2} distance={5} color="#DC143C" />
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
          color="#8B0000"
          emissive="#DC143C"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Door handle - glowing crystal */}
      <mesh position={[0.5, 0, 0.15]} castShadow>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial 
          color="#FF6347"
          emissive="#FF6347"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Progress indicator */}
      {crystalsCollected >= totalCrystals && (
        <mesh position={[0, -2.5, 0.15]}>
          <planeGeometry args={[2.5, 0.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
          <Html center>
            <div style={{ color: '#DC143C', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
              🏠 CLICK TO ENTER STAGE 4 - THE KENNEL!
            </div>
          </Html>
        </mesh>
      )}
      {/* Warning runes */}
      <mesh position={[0, 2.2, 0.16]}>
        <planeGeometry args={[1.8, 0.3]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#DC143C', fontSize: '12px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'serif' }}>
            ⚠️ BEWARE OF THE BEAST ⚠️
          </div>
        </Html>
      </mesh>
    </group>
  )
}

function Treasure({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [0.8, 0.8, 0.8], // Treasure chest size
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
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#DAA520"
          roughness={0.7}
          metalness={0.8}
        />
      </mesh>
      {/* Item label */}
      <mesh position={[0, 0.5, 0.41]}>
        <planeGeometry args={[1.2, 0.15]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#ff6b35', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
            TREASURE CHEST
          </div>
        </Html>
      </mesh>
    </group>
  )
}

function Bone({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [0.6, 0.2, 0.2], // Bone size
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
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.2, 0.2]} />
        <meshStandardMaterial
          color="#F5F5DC"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Item label */}
      <mesh position={[0, 0.2, 0.11]}>
        <planeGeometry args={[0.8, 0.12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#ff6b35', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>
            BONE
          </div>
        </Html>
      </mesh>
    </group>
  )
}

function Crystal({ position, collected, onCollect }: any) {
  useBox(() => ({
    position,
    args: [0.4, 0.8, 0.4], // Crystal size - tall and narrow
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
      <mesh castShadow>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#9370DB"
          emissive="#9370DB"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Item label */}
      <mesh position={[0, 0.5, 0.21]}>
        <planeGeometry args={[0.8, 0.12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <Html center>
          <div style={{ color: '#ff6b35', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>
            CRYSTAL
          </div>
        </Html>
      </mesh>
    </group>
  )
}

function BlackDoor({ position }: any) {
  const { planksCollected, totalPlanks, teleportPlayer, setCurrentWorld } = useGameStore()
  const [isShaking, setIsShaking] = useState(false)

  const handleDoorInteraction = () => {
    if (planksCollected < totalPlanks) {
      // Not enough planks - play locked sound and shake
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    // Door unlocked - TELEPORT TO DUNGEON!
    console.log('🏰 TELEPORTING TO STAGE 3 - THE DUNGEON! All planks collected!')
    setCurrentWorld('dungeon')
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
      {/* Black door frame glow - ominous dark glow */}
      <pointLight position={[0, 0, 0]} intensity={0.8} distance={4} color="#000000" />
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
          color="#1a1a1a"
          emissive="#333333"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Door handle - dark metal */}
      <mesh position={[0.5, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial 
          color="#333333"
          emissive="#666666"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Progress indicator */}
      {planksCollected >= totalPlanks && (
        <mesh position={[0, -2.5, 0.15]}>
          <planeGeometry args={[2.5, 0.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
          <Html center>
            <div style={{ color: '#666666', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
              🏰 CLICK TO ENTER STAGE 3 - THE DUNGEON!
            </div>
            <div style={{ color: '#666666', fontSize: '12px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'serif' }}>
              ⚠️ DARKNESS AWAITS ⚠️
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
  
  // Room boundaries (3.68x3.68x3.68 room = 50 cubic meters, centered at origin)
  const roomSize = 3.68
  const wallHeight = 3.68
  const wallThickness = 0.1
  
  // Front wall (negative Z) with door opening in center
  walls.push({ 
    position: [0, wallHeight/2, -roomSize/2], 
    size: { args: [roomSize - 1, wallHeight, wallThickness] } 
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
  // Generate 25 trees in the forest
  const trees = []
  const forestSize = 200 // 200x200 forest area
  
  for (let i = 0; i < 25; i++) { // 25 trees
    const x = (Math.random() - 0.5) * forestSize
    const z = (Math.random() - 0.5) * forestSize
    const height = 6 + Math.random() * 8 // Heights between 6-14
    
    // Avoid placing trees too close to the center (player spawn area)
    const distanceFromCenter = Math.sqrt(x * x + z * z)
    if (distanceFromCenter < 10) continue // Keep center area clear
    
    trees.push({
      position: [x, 0, z] as [number, number, number],
      height: height
    })
  }
  
  return trees
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

function generateForestWaterWalls() {
  const walls = []
  const forestSize = 200
  const wallHeight = 10
  const wallThickness = 2
  
  // Create a square boundary of water walls around the forest
  // Front wall (negative Z)
  walls.push({ 
    position: [0, wallHeight/2, -forestSize/2], 
    size: { args: [forestSize, wallHeight, wallThickness] } 
  })
  
  // Back wall (positive Z)
  walls.push({ 
    position: [0, wallHeight/2, forestSize/2], 
    size: { args: [forestSize, wallHeight, wallThickness] } 
  })
  
  // Left wall (negative X)
  walls.push({ 
    position: [-forestSize/2, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, forestSize] } 
  })
  
  // Right wall (positive X)
  walls.push({ 
    position: [forestSize/2, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, forestSize] } 
  })

  return walls
}

function generateDungeonWalls() {
  const walls = []
  
  // Dungeon boundaries (30x30 dungeon centered at origin)
  const dungeonSize = 30
  const wallHeight = 6
  const wallThickness = 1
  
  // Front wall (negative Z) with door opening in center
  walls.push({ 
    position: [0, wallHeight/2, -dungeonSize/2], 
    size: { args: [dungeonSize - 6, wallHeight, wallThickness] } 
  })
  
  // Back wall (positive Z)
  walls.push({ 
    position: [0, wallHeight/2, dungeonSize/2], 
    size: { args: [dungeonSize, wallHeight, wallThickness] } 
  })
  
  // Left wall (negative X)
  walls.push({ 
    position: [-dungeonSize/2, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, dungeonSize] } 
  })
  
  // Right wall (positive X)
  walls.push({ 
    position: [dungeonSize/2, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, dungeonSize] } 
  })

  // Inner walls to create maze-like corridors
  walls.push({ position: [0, wallHeight/2, -5], size: { args: [8, wallHeight, wallThickness] } })
  walls.push({ position: [-8, wallHeight/2, 5], size: { args: [wallThickness, wallHeight, 16] } })
  walls.push({ position: [8, wallHeight/2, 5], size: { args: [wallThickness, wallHeight, 16] } })
  walls.push({ position: [0, wallHeight/2, 12], size: { args: [16, wallHeight, wallThickness] } })
  
  return walls
}

function generateDungeonPillars() {
  // Stone pillars scattered throughout the dungeon
  return [
    { position: [-10, 3, -10] as [number, number, number], height: 6 },
    { position: [10, 3, -10] as [number, number, number], height: 6 },
    { position: [-10, 3, 10] as [number, number, number], height: 6 },
    { position: [10, 3, 10] as [number, number, number], height: 6 },
    { position: [0, 3, 0] as [number, number, number], height: 8 },
  ]
}

function generateDungeonTreasurePositions() {
  // Treasures hidden in the dungeon - need 10 to escape
  return [
    [-12, 1, -8] as [number, number, number],    // Behind pillar
    [12, 1, -8] as [number, number, number],     // Behind pillar
    [-12, 1, 8] as [number, number, number],     // Behind pillar
    [12, 1, 8] as [number, number, number],      // Behind pillar
    [0, 1, -12] as [number, number, number],     // In corridor
    [-6, 1, 2] as [number, number, number],      // In maze
    [6, 1, 2] as [number, number, number],       // In maze
    [0, 1, 8] as [number, number, number],       // Near back wall
    [-4, 1, 14] as [number, number, number],     // Hidden corner
    [4, 1, 14] as [number, number, number],      // Hidden corner
  ]
}

function generateCaveCrystalPositions() {
  // Crystals hidden in the cave - need 8 to make red door appear
  return [
    [-25, 1, -15] as [number, number, number],   // Deep in cave
    [20, 1, -20] as [number, number, number],    // Cave wall
    [-15, 1, 25] as [number, number, number],    // High ledge
    [30, 1, 10] as [number, number, number],     // Cave ceiling
    [0, 1, -35] as [number, number, number],     // Dark corner
    [-35, 1, 5] as [number, number, number],     // Hidden alcove
    [15, 1, 30] as [number, number, number],     // Crystal cluster
    [35, 1, -5] as [number, number, number],     // Final crystal
  ]
}

function generateKennelBonePositions() {
  // Bones scattered in the giant dog kennel - need 9 to complete game
  return [
    [-40, 1, -20] as [number, number, number],   // Under dog bed
    [35, 1, -25] as [number, number, number],    // Near water bowl
    [-20, 1, 40] as [number, number, number],    // Behind chew toy
    [45, 1, 15] as [number, number, number],     // In food bowl
    [0, 1, -50] as [number, number, number],     // Buried in dirt
    [-45, 1, 30] as [number, number, number],    // Under chain
    [25, 1, 45] as [number, number, number],     // Near fence
    [50, 1, -10] as [number, number, number],    // Hidden in grass
    [-10, 1, 55] as [number, number, number],    // Final bone
  ]
}

function generateCaveWalls() {
  const walls = []
  
  // Cave boundaries (80x80 cave centered at origin)
  const caveSize = 40
  const wallHeight = 12
  const wallThickness = 2
  
  // Create irregular cave walls with openings
  walls.push({ 
    position: [0, wallHeight/2, -caveSize], 
    size: { args: [caveSize * 1.5, wallHeight, wallThickness] } 
  })
  
  walls.push({ 
    position: [0, wallHeight/2, caveSize], 
    size: { args: [caveSize * 1.5, wallHeight, wallThickness] } 
  })
  
  walls.push({ 
    position: [-caveSize, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, caveSize * 1.5] } 
  })
  
  walls.push({ 
    position: [caveSize, wallHeight/2, 0], 
    size: { args: [wallThickness, wallHeight, caveSize * 1.5] } 
  })

  return walls
}

function generateCaveFormations(): { position: [number, number, number], type: 'stalactite' | 'stalagmite' }[] {
  // Stalactites (hanging from ceiling) and stalagmites (rising from floor)
  return [
    { position: [-20, 8, -15] as [number, number, number], type: 'stalactite' },
    { position: [25, 0, -20] as [number, number, number], type: 'stalagmite' },
    { position: [-15, 10, 20] as [number, number, number], type: 'stalactite' },
    { position: [30, 0, 15] as [number, number, number], type: 'stalagmite' },
    { position: [0, 9, -25] as [number, number, number], type: 'stalactite' },
    { position: [-30, 0, 10] as [number, number, number], type: 'stalagmite' },
  ]
}

function generateKennelFence() {
  const fences = []
  
  // Kennel fence boundaries (120x120 kennel centered at origin)
  const kennelSize = 60
  const fenceHeight = 8
  const fenceThickness = 0.5
  
  // Create chain-link fence around the kennel
  fences.push({ 
    position: [0, fenceHeight/2, -kennelSize], 
    size: { args: [kennelSize * 1.8, fenceHeight, fenceThickness] } 
  })
  
  fences.push({ 
    position: [0, fenceHeight/2, kennelSize], 
    size: { args: [kennelSize * 1.8, fenceHeight, fenceThickness] } 
  })
  
  fences.push({ 
    position: [-kennelSize, fenceHeight/2, 0], 
    size: { args: [fenceThickness, fenceHeight, kennelSize * 1.8] } 
  })
  
  fences.push({ 
    position: [kennelSize, fenceHeight/2, 0], 
    size: { args: [fenceThickness, fenceHeight, kennelSize * 1.8] } 
  })

  return fences
}

function generateKennelStructures() {
  // Dog kennel structures: dog house, water bowl, food bowl, etc.
  return [
    {
      position: [-40, 2, -30] as [number, number, number],
      size: [8, 4, 6],
      color: '#8B4513',
      type: 'doghouse'
    },
    {
      position: [40, 0.5, -35] as [number, number, number],
      size: [2, 1, 2],
      color: '#4169E1',
      type: 'waterbowl'
    },
    {
      position: [45, 0.5, -30] as [number, number, number],
      size: [2, 1, 2],
      color: '#FFD700',
      type: 'foodbowl'
    },
    {
      position: [0, 1, 50] as [number, number, number],
      size: [3, 2, 1],
      color: '#696969',
      type: 'chain'
    },
  ]
}

function generateOrchardGrapeVinePositions() {
  // Grape vines scattered in the orchard - need 10 to complete game
  return [
    [-30, 1, -20] as [number, number, number],   // Near apple tree
    [25, 1, -15] as [number, number, number],    // Near orange tree
    [-15, 1, 30] as [number, number, number],    // Near lemon tree
    [35, 1, 25] as [number, number, number],     // Near kumquat tree
    [0, 1, -35] as [number, number, number],     // Near grape tree
    [-40, 1, 10] as [number, number, number],    // Near apple tree
    [20, 1, 40] as [number, number, number],     // Hidden in bushes
    [-25, 1, -40] as [number, number, number],   // Under tree
    [45, 1, -5] as [number, number, number],     // Near edge
    [-5, 1, 50] as [number, number, number],     // Final grape vine
  ]
}

function generateOrchardFruitTrees(): { position: [number, number, number], type: string }[] {
  // Fruit trees in the orchard
  return [
    { position: [-30, 0, -20] as [number, number, number], type: 'apple' },
    { position: [25, 0, -15] as [number, number, number], type: 'orange' },
    { position: [-15, 0, 30] as [number, number, number], type: 'lemon' },
    { position: [35, 0, 25] as [number, number, number], type: 'kumquat' },
    { position: [0, 0, -35] as [number, number, number], type: 'grape' },
    { position: [-40, 0, 10] as [number, number, number], type: 'apple' },
    { position: [20, 0, 40] as [number, number, number], type: 'orange' },
    { position: [-25, 0, -40] as [number, number, number], type: 'lemon' },
    { position: [45, 0, -5] as [number, number, number], type: 'kumquat' },
    { position: [-5, 0, 50] as [number, number, number], type: 'grape' },
  ]
}

function Pillar({ position, height }: { position: [number, number, number], height: number }) {
  return (
    <group position={position}>
      {/* Pillar base */}
      <mesh position={[0, -height/2 + 0.5, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.5, 1, 12]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
      </mesh>
      {/* Pillar shaft */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1.2, height, 12]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.8} />
      </mesh>
      {/* Pillar capital */}
      <mesh position={[0, height/2 - 0.3, 0]} castShadow>
        <cylinderGeometry args={[1.0, 0.8, 0.6, 12]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function CaveFormation({ position, type }: { position: [number, number, number], type: 'stalactite' | 'stalagmite' }) {
  const height = type === 'stalactite' ? 4 : 3
  
  return (
    <group position={position}>
      <mesh 
        position={type === 'stalactite' ? [0, -height/2, 0] : [0, height/2, 0]} 
        castShadow
      >
        <coneGeometry args={[0.5, height, 6]} />
        <meshStandardMaterial 
          color="#8a8a8a" 
          roughness={0.9} 
        />
      </mesh>
    </group>
  )
}

function Fence({ position, size }: any) {
  const fenceRef = useRef<THREE.Mesh>(null)
  useBox(() => ({
    position,
    args: size.args,
    type: 'Static'
  }))

  return (
    <mesh ref={fenceRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size.args} />
      <meshStandardMaterial 
        color="#696969" 
        transparent 
        opacity={0.8}
        wireframe={true}
      />
    </mesh>
  )
}

function KennelStructure({ position, size, color, type }: any) {
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

export default function World({ onGameComplete }: { onGameComplete: () => void }) {
  const { keysCollected, collectKey, totalKeys, poloCoinsCollected, collectPoloCoin, currentWorld, planksCollected, collectPlank, blackDoorVisible, crystalsCollected, collectCrystal, bonesCollected, collectBone, grapeVinesCollected, collectGrapeVine, setGameComplete, totalBones, totalGrapeVines } = useGameStore()
  const [keyPositions] = useState(() => generateBoxPositions())
  const [poloCoinPositions] = useState(() => generatePoloCoinPositions())

  const groundRef = useRef<THREE.Mesh>(null)
  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0]
  }))

  return (
    <>
      {/* TERRIFYING FOG - makes everything mysterious and scary */}
      <fog attach="fog" args={
        currentWorld === 'room' ? ['#1a0a0a', 5, 25] : 
        currentWorld === 'forest' ? ['#2d5a3d', 15, 75] : 
        currentWorld === 'dungeon' ? ['#0a0a0a', 8, 35] :
        currentWorld === 'cave' ? ['#1a1a2e', 12, 50] :
        currentWorld === 'kennel' ? ['#8B4513', 8, 40] :
        ['#228B22', 10, 60] // Orchard fog - green and misty
      } />

      {/* Ground */}
      {currentWorld === 'room' ? (
        <mesh ref={groundRef} receiveShadow>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial
            roughness={0.9}
            metalness={0.05}
            color="#4a2a2a"
          />
        </mesh>
      ) : currentWorld === 'forest' ? (
        <mesh ref={groundRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial
            color="#4a7c59"
            roughness={0.8}
          />
        </mesh>
      ) : currentWorld === 'dungeon' ? (
        // Dungeon ground - stone floor
        <mesh ref={groundRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ) : currentWorld === 'cave' ? (
        // Cave ground - rocky terrain
        <mesh ref={groundRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      ) : currentWorld === 'orchard' ? (
        // Orchard ground - grassy field
        <mesh ref={groundRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[150, 150]} />
          <meshStandardMaterial
            color="#4a7c59"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>
      ) : (
        // Kennel ground - dirt and grass
        <mesh ref={groundRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.9}
            metalness={0.0}
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
          {generateFurniture().map((item, i) => {
            if (item.type === 'table') {
              return <RealisticTable key={i} position={item.position as [number, number, number]} />
            } else if (item.type === 'bookshelf') {
              return <RealisticBookshelf key={i} position={item.position as [number, number, number]} />
            } else if (item.type === 'bed') {
              return <RealisticBed key={i} position={item.position as [number, number, number]} />
            } else if (item.type === 'couch') {
              return <RealisticCouch key={i} position={item.position as [number, number, number]} />
            } else {
              return <Furniture key={i} {...item} />
            }
          })}
        </>
      )}

      {/* Forest-specific elements */}
      {currentWorld === 'forest' && (
        <>
          {/* Trees scattered around */}
          {/* {generateForestTrees().map((tree, i) => (
            <Tree key={i} position={tree.position as [number, number, number]} height={tree.height} />
          ))} */}

          {/* Rocks and boulders */}
          {/* {generateForestRocks().map((rock, i) => (
            <Rock key={i} position={rock.position} size={rock.size} />
          ))} */}

          {/* Water walls trapping the player */}
          {/* {generateForestWaterWalls().map((wall, i) => (
            <WaterWall key={i} position={wall.position} size={wall.size} />
          ))} */}
        </>
      )}

      {/* Dungeon-specific elements */}
      {currentWorld === 'dungeon' && (
        <>
          {/* Dungeon walls */}
          {generateDungeonWalls().map((wall, i) => (
            <Wall key={i} position={wall.position} size={wall.size} />
          ))}

          {/* Stone pillars */}
          {generateDungeonPillars().map((pillar, i) => (
            <Pillar key={i} position={pillar.position} height={pillar.height} />
          ))}
        </>
      )}

      {/* Cave-specific elements */}
      {currentWorld === 'cave' && (
        <>
          {/* Cave walls - irregular stone formations */}
          {generateCaveWalls().map((wall, i) => (
            <Wall key={i} position={wall.position} size={wall.size} />
          ))}

          {/* Stalactites and stalagmites */}
          {generateCaveFormations().map((formation, i) => (
            <CaveFormation key={i} position={formation.position} type={formation.type} />
          ))}
        </>
      )}

      {/* Kennel-specific elements */}
      {currentWorld === 'kennel' && (
        <>
          {/* Kennel fence walls */}
          {generateKennelFence().map((fence, i) => (
            <Fence key={i} position={fence.position} size={fence.size} />
          ))}

          {/* Kennel structures */}
          {generateKennelStructures().map((structure, i) => (
            <KennelStructure key={i} {...structure} />
          ))}
        </>
      )}

      {/* Orchard-specific elements */}
      {currentWorld === 'orchard' && (
        <>
          {/* Fruit trees */}
          {generateOrchardFruitTrees().map((tree, i) => (
            <FruitTree key={i} position={tree.position} type={tree.type} />
          ))}
        </>
      )}

      {/* Collectibles - Boxes in room, Planks in forest, Treasures in dungeon, Crystals in cave, Bones in kennel */}
      {currentWorld === 'room' ? (
        keyPositions.map((keyPos, i) => (
          <Box
            key={i}
            position={keyPos}
            collected={keysCollected > i}
            onCollect={() => collectKey()}
          />
        ))
      ) : currentWorld === 'forest' ? (
        generateForestPlankPositions().map((plankPos, i) => (
          <Plank
            key={i}
            position={plankPos}
            collected={planksCollected > i}
            onCollect={() => collectPlank()}
          />
        ))
      ) : currentWorld === 'dungeon' ? (
        generateDungeonTreasurePositions().map((treasurePos, i) => (
          <Treasure
            key={i}
            position={treasurePos}
            collected={keysCollected > i}
            onCollect={() => collectKey()}
          />
        ))
      ) : currentWorld === 'cave' ? (
        generateCaveCrystalPositions().map((crystalPos, i) => (
          <Crystal
            key={i}
            position={crystalPos}
            collected={crystalsCollected > i}
            onCollect={() => collectCrystal()}
          />
        ))
      ) : currentWorld === 'kennel' ? (
        generateKennelBonePositions().map((bonePos, i) => (
          <Bone
            key={i}
            position={bonePos}
            collected={bonesCollected > i}
            onCollect={() => collectBone()}
          />
        ))
      ) : currentWorld === 'orchard' ? (
        generateOrchardGrapeVinePositions().map((grapeVinePos, i) => (
          <GrapeVine
            key={i}
            position={grapeVinePos}
            collected={grapeVinesCollected > i}
            onCollect={() => collectGrapeVine()}
          />
        ))
      ) : (
        // Default to room boxes
        keyPositions.map((keyPos, i) => (
          <Box
            key={i}
            position={keyPos}
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

      {/* Exit door - only visible when all required collectibles collected */}
      {((currentWorld === 'room' || currentWorld === 'dungeon') && keysCollected >= totalKeys) ||
       (currentWorld === 'kennel' && bonesCollected >= totalBones) ||
       (currentWorld === 'orchard' && grapeVinesCollected >= totalGrapeVines) && (
        <ExitDoor position={[8, 2, 3]} onGameComplete={onGameComplete} />
      )}

      {/* Black door - only visible in forest when all planks collected */}
      {currentWorld === 'forest' && planksCollected >= 7 && (
        <BlackDoor position={[-8, 2, 3]} />
      )}

      {/* Red door - only visible in cave when all crystals collected */}
      {currentWorld === 'cave' && crystalsCollected >= 8 && (
        <RedDoor position={[0, 2, 35]} />
      )}

      {/* Point light that follows the player */}
      {/* TERRIFYING LIGHTING - 1000x darker and more blood-red */}
      <ambientLight 
        intensity={
          currentWorld === 'room' ? 0.02 : 
          currentWorld === 'forest' ? 0.1 : 
          currentWorld === 'orchard' ? 0.15 :
          0.01 // Dungeon - extremely dark
        } 
        color={
          currentWorld === 'room' ? "#330000" : 
          currentWorld === 'forest' ? "#4a7c59" : 
          currentWorld === 'orchard' ? "#228B22" :
          "#1a0033" // Dungeon - deep purple/black
        } 
      />
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