import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Box, Cylinder } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'

interface LobbyProps {
  onStartGame: () => void
  onBack: () => void
}

function LobbyPlayer() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 1, 0],
    args: [0.5]
  }))

  const [position, setPosition] = useState([0, 1, 0])
  const keysPressed = useRef<Set<string>>(new Set())

  useFrame(() => {
    const speed = 0.1
    const newPosition = [...position]

    if (keysPressed.current.has('KeyW') || keysPressed.current.has('ArrowUp')) {
      newPosition[2] -= speed
    }
    if (keysPressed.current.has('KeyS') || keysPressed.current.has('ArrowDown')) {
      newPosition[2] += speed
    }
    if (keysPressed.current.has('KeyA') || keysPressed.current.has('ArrowLeft')) {
      newPosition[0] -= speed
    }
    if (keysPressed.current.has('KeyD') || keysPressed.current.has('ArrowRight')) {
      newPosition[0] += speed
    }

    // Keep player within lobby bounds
    newPosition[0] = Math.max(-8, Math.min(8, newPosition[0]))
    newPosition[2] = Math.max(-8, Math.min(8, newPosition[2]))

    setPosition(newPosition)
    api.position.set(newPosition[0], newPosition[1], newPosition[2])
  })

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <mesh ref={ref as any} castShadow>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color="#4169E1" />
    </mesh>
  )
}

function LobbyEnvironment() {
  return (
    <>
      {/* Atmospheric fog with 4D distortion */}
      <fog attach="fog" args={['#1a0a0a', 5, 25]} />

      {/* Floor with horror texture and dimensional cracks */}
      <Box position={[0, -0.5, 0]} args={[20, 1, 20]}>
        <meshStandardMaterial color="#2a1a1a" />
      </Box>

      {/* Blood-stained walls with dimensional fractures */}
      <Box position={[0, 5, -10]} args={[20, 10, 1]}>
        <meshStandardMaterial color="#4a1a1a" />
      </Box>
      <Box position={[0, 5, 10]} args={[20, 10, 1]}>
        <meshStandardMaterial color="#4a1a1a" />
      </Box>
      <Box position={[-10, 5, 0]} args={[1, 10, 20]}>
        <meshStandardMaterial color="#4a1a1a" />
      </Box>
      <Box position={[10, 5, 0]} args={[1, 10, 20]}>
        <meshStandardMaterial color="#4a1a1a" />
      </Box>

      {/* 3D Relantro Helper */}
      <Relantro3D />

      {/* Dimensional rift portals in corners */}
      {[
        [-7, 2, -7], [7, 2, -7], [-7, 2, 7], [7, 2, 7]
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Rift portal */}
          <Cylinder args={[0.8, 0.8, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#000000"
              emissive="#00ffff"
              emissiveIntensity={0.3}
              transparent
              opacity={0.8}
            />
          </Cylinder>
          {/* Dimensional energy particles */}
          {Array.from({ length: 6 }, (_, j) => (
            <mesh key={j} position={[
              Math.cos((j / 6) * Math.PI * 2) * 0.5,
              Math.sin((j / 6) * Math.PI * 2) * 0.5,
              0
            ]}>
              <sphereGeometry args={[0.03, 4, 4]} />
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Central ritual pedestal with 4D dimensional effects */}
      <group>
        <Cylinder position={[0, 0.5, 0]} args={[1.2, 1.2, 1]}>
          <meshStandardMaterial
            color="#DC143C"
            emissive="#DC143C"
            emissiveIntensity={0.3}
          />
        </Cylinder>

        {/* 4D Dimensional runes orbiting the pedestal */}
        {Array.from({ length: 12 }, (_, i) => (
          <group key={i} position={[
            Math.cos((i / 12) * Math.PI * 2) * 1.8,
            0.8 + Math.sin(i * 0.5) * 0.2,
            Math.sin((i / 12) * Math.PI * 2) * 1.8
          ]}>
            <Cylinder args={[0.08, 0.08, 0.3]}>
              <meshStandardMaterial
                color="#FF0000"
                emissive="#FF0000"
                emissiveIntensity={0.6}
              />
            </Cylinder>
          </group>
        ))}

        {/* Inner dimensional core */}
        <Cylinder position={[0, 1.2, 0]} args={[0.3, 0.3, 0.4]}>
          <meshStandardMaterial
            color="#000000"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </Cylinder>
      </group>

      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color="#FF0000"
        anchorX="center"
        anchorY="middle"
      >
        STEP INTO THE VOID
      </Text>
      <Text
        position={[0, 2.1, 0]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        4D DIMENSIONS AWAIT
      </Text>

      {/* Enhanced dramatic lighting with 4D effects */}
      <ambientLight intensity={0.1} color="#330000" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.3}
        color="#8B0000"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#DC143C" />
      <pointLight position={[0, 3, 0]} intensity={1.0} color="#FF0000" distance={5} />

      {/* 4D Dimensional anomalies floating in space */}
      {Array.from({ length: 5 }, (_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 15,
          3 + Math.random() * 3,
          (Math.random() - 0.5) * 15
        ]}>
          <mesh>
            <torusGeometry args={[0.2, 0.05, 8, 16]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Floating horror text */}
      <group position={[0, 6, -8]}>
        <Text
          fontSize={0.3}
          color="#880000"
          anchorX="center"
          anchorY="middle"
        >
          THE 4TH DIMENSION CALLS
        </Text>
      </group>
    </>
  )
}

function Relantro3D() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x += 0.005
      meshRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      meshRef.current.position.x = 5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3
    }
  })

  return (
    <group position={[5, 2, 5]}>
      {/* 4D Dimensional hypercube layers */}
      {Array.from({ length: 4 }, (_, layer) => (
        <group key={layer} position={[layer * 0.15, layer * 0.15, layer * 0.15]}>
          {/* Main dimensional body */}
          <mesh ref={layer === 0 ? meshRef : null}>
            <sphereGeometry args={[0.4 - layer * 0.08, 20, 20]} />
            <meshStandardMaterial
              color={layer === 0 ? "#8B0000" : layer === 1 ? "#FF0000" : layer === 2 ? "#DC143C" : "#B22222"}
              emissive={layer === 0 ? "#8B0000" : layer === 1 ? "#FF0000" : layer === 2 ? "#DC143C" : "#B22222"}
              emissiveIntensity={0.5 - layer * 0.1}
              transparent
              opacity={0.85 - layer * 0.15}
            />
          </mesh>

          {/* Inner dimensional cores */}
          <mesh>
            <sphereGeometry args={[0.2 - layer * 0.04, 12, 12]} />
            <meshStandardMaterial
              color="#FF0000"
              emissive="#FF0000"
              emissiveIntensity={0.7 - layer * 0.1}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 4D Tesseract edges */}
          {Array.from({ length: 8 }, (_, edge) => (
            <mesh key={edge} position={[
              Math.cos((edge / 8) * Math.PI * 2) * (0.5 - layer * 0.05),
              Math.sin((edge / 8) * Math.PI * 2) * (0.5 - layer * 0.05),
              Math.sin((edge / 8) * Math.PI * 4) * (0.3 - layer * 0.03)
            ]}>
              <boxGeometry args={[0.02, 0.02, 0.1]} />
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Enhanced blood particle field */}
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[
          Math.cos((i / 24) * Math.PI * 2) * (0.8 + Math.sin(i * 0.1) * 0.3),
          Math.sin((i / 24) * Math.PI * 2) * (0.8 + Math.cos(i * 0.1) * 0.3),
          Math.sin((i / 24) * Math.PI * 4) * 0.4
        ]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color="#8B0000"
            emissive="#8B0000"
            emissiveIntensity={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* 4D Dimensional rift particles with enhanced effects */}
      {Array.from({ length: 12 }, (_, i) => (
        <group key={`rift-${i}`} position={[
          Math.cos((i / 12) * Math.PI * 2) * 1.0,
          Math.sin((i / 12) * Math.PI * 2) * 1.0,
          Math.sin((i / 12) * Math.PI * 4) * 0.5
        ]}>
          {/* Primary rift particle */}
          <mesh>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#ff00ff" : "#ffff00"}
              emissive={i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#ff00ff" : "#ffff00"}
              emissiveIntensity={1.2}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Secondary dimensional echoes */}
          <mesh position={[0.05, 0.05, 0.05]}>
            <sphereGeometry args={[0.008, 4, 4]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Central dimensional singularity */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Enhanced bloody illumination */}
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={10} color="#8B0000" />
      <pointLight position={[0.5, 0.5, 0.5]} intensity={1.5} distance={8} color="#FF0000" />
    </group>
  )
}

export default function Lobby({ onStartGame, onBack }: LobbyProps) {
  const [showInstructions, setShowInstructions] = useState(true)
  const [friendCode, setFriendCode] = useState('')
  const { playerCode, friends, addFriend, removeFriend } = useGameStore()

  const handleAddFriend = () => {
    const trimmedCode = friendCode.trim()
    if (trimmedCode.length !== 5) {
      alert('Friend code must be exactly 5 letters')
      return
    }
    if (trimmedCode === playerCode) {
      alert('You cannot add yourself as a friend')
      return
    }
    if (friends.includes(trimmedCode)) {
      alert('This friend is already in your list')
      return
    }
    addFriend(trimmedCode)
    setFriendCode('')
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-red-900 to-blue-900 overflow-hidden">
      {/* Atmospheric Background Effects */}
      <div className="absolute inset-0 opacity-40">
        {/* Multi-colored floating particles */}
        {Array.from({ length: 30 }, (_, i) => {
          const colors = ['bg-red-500', 'bg-purple-500', 'bg-blue-500', 'bg-cyan-400', 'bg-pink-500', 'bg-yellow-400', 'bg-green-400', 'bg-orange-500']
          const colorClass = colors[i % colors.length]
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${colorClass} rounded-full shadow-lg`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(0.5px)',
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.5, 2, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          )
        })}

        {/* Colorful energy waves */}
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute inset-0 border-2 border-transparent"
            style={{
              background: `conic-gradient(from ${i * 72}deg, transparent, rgba(255,0,255,0.1), rgba(0,255,255,0.1), rgba(255,255,0,0.1), transparent)`,
              borderRadius: '50%',
              width: '200px',
              height: '200px',
              left: `${20 + i * 15}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Rainbow fog effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-l from-red-500/5 via-yellow-500/5 to-green-500/5 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Relantro 4D Dimensional Scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-4 w-32 h-32"
      >
        {/* 4D Dimensional Grid Background */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0.5 opacity-40">
          {Array.from({ length: 16 }, (_, i) => {
            const colors = [
              'bg-red-400/30 border-red-400/50',
              'bg-purple-400/30 border-purple-400/50',
              'bg-blue-400/30 border-blue-400/50',
              'bg-cyan-400/30 border-cyan-400/50',
              'bg-pink-400/30 border-pink-400/50',
              'bg-yellow-400/30 border-yellow-400/50',
              'bg-green-400/30 border-green-400/50',
              'bg-orange-400/30 border-orange-400/50'
            ]
            const colorClass = colors[i % colors.length]
            return (
              <motion.div
                key={i}
                className={`${colorClass} shadow-lg`}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            )
          })}
        </div>

        {/* 4D Scale Indicators */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Primary Scale Ring */}
          <motion.div
            className="w-24 h-24 border-4 rounded-full relative shadow-2xl"
            style={{
              background: 'conic-gradient(from 0deg, #8B5CF6, #EC4899, #06B6D4, #8B5CF6)',
              border: '4px solid transparent',
              backgroundClip: 'padding-box',
              borderRadius: '50%'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {/* Dimensional Markers */}
            {Array.from({ length: 8 }, (_, i) => {
              const markerColors = ['bg-red-500', 'bg-purple-500', 'bg-blue-500', 'bg-cyan-400', 'bg-pink-500', 'bg-yellow-400', 'bg-green-400', 'bg-orange-500']
              const markerColor = markerColors[i % markerColors.length]
              return (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-8 ${markerColor} origin-bottom shadow-lg`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: '50% 100%',
                    transform: `translateX(-50%) translateY(-100%) rotate(${i * 45}deg)`
                  }}
                  animate={{
                    scaleY: [1, 2, 1],
                    opacity: [0.7, 1, 0.7],
                    boxShadow: ['0 0 5px currentColor', '0 0 20px currentColor', '0 0 5px currentColor']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              )
            })}

            {/* Inner Scale Ring */}
            <motion.div
              className="absolute inset-2 border border-cyan-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* 4D Dimensional Core */}
            <motion.div
              className="absolute inset-4 bg-gradient-radial from-blood-600/80 to-transparent rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
            >
              {/* Multi-dimensional Fractals */}
              {Array.from({ length: 4 }, (_, layer) => (
                <motion.div
                  key={layer}
                  className="absolute border border-cyan-300/60 rounded-full"
                  style={{
                    width: `${20 - layer * 3}px`,
                    height: `${20 - layer * 3}px`,
                  }}
                  animate={{
                    rotate: layer % 2 === 0 ? 360 : -360,
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 8 + layer * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}

              {/* Central Dimensional Node */}
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* 4D Coordinate Labels */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 text-xs text-cyan-400 font-mono">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            X
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            Y
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          >
            Z
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 3 }}
          >
            W
          </motion.span>
        </div>

        {/* Dimensional Energy Waves */}
        <motion.div
          className="absolute inset-0 border-2 border-blood-500/30 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute inset-0 border border-cyan-400/20 rounded-full"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1
          }}
        />
      </motion.div>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        className="w-full h-full"
        style={{ width: '100vw', height: '100vh' }}
      >
        <Physics gravity={[0, -9.81, 0]}>
          <LobbyEnvironment />
          <LobbyPlayer />
        </Physics>
        <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* UI Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-4 text-white"
      >
        <h1 className="text-4xl font-bold text-blood-500 mb-2">LOBBY</h1>
        <p className="text-lg text-gray-300">Explore the lobby and prepare for your journey</p>
      </motion.div>

      {/* Account Details Panel */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 p-4 rounded-lg max-w-sm"
      >
        <h3 className="text-white text-lg font-bold mb-3">Account Details</h3>

        {/* Username */}
        <div className="mb-3">
          <p className="text-gray-300 text-sm mb-1">Username:</p>
          <p className="text-blood-400 font-bold text-lg">
            {localStorage.getItem('username') || 'Not Set'}
          </p>
        </div>

        {/* Avatar Info */}
        <div className="mb-3">
          <p className="text-gray-300 text-sm mb-1">Avatar:</p>
          {(() => {
            try {
              const avatarData = JSON.parse(localStorage.getItem('avatar') || '{}')
              return (
                <div className="text-cyan-400 text-sm">
                  <p>Body: {avatarData.bodyColor || 'Default'}</p>
                  <p>Head: {avatarData.headShape || 'Default'}</p>
                  <p>Eyes: {avatarData.eyeColor || 'Default'}</p>
                </div>
              )
            } catch {
              return <p className="text-gray-500 text-sm">Not Set</p>
            }
          })()}
        </div>
      </motion.div>

      {/* Friends Panel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-64 right-4 bg-gray-900 bg-opacity-90 p-4 rounded-lg max-w-sm"
      >
        <h3 className="text-white text-lg font-bold mb-3">Friends</h3>
        
        {/* Your Code */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-1">Your Code:</p>
          <p className="text-cyan-400 font-mono text-sm bg-gray-800 p-2 rounded">{playerCode}</p>
        </div>
        
        {/* Add Friend */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-1">Add Friend:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
              placeholder="Enter 5-letter code"
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm font-mono"
              maxLength={5}
            />
            <button
              onClick={handleAddFriend}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Friends List */}
        <div>
          <p className="text-gray-300 text-sm mb-2">Friends ({friends.length}):</p>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {friends.length === 0 ? (
              <p className="text-gray-500 text-sm">No friends added yet</p>
            ) : (
              friends.map((friend, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="text-cyan-400 font-mono text-xs">{friend}</span>
                  <button
                    onClick={() => removeFriend(friend)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
      {/* Instructions */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg max-w-md text-center"
        >
          <h2 className="text-2xl text-white mb-4">Welcome to the Lobby</h2>
          <p className="text-gray-300 mb-4">
            Use WASD or arrow keys to move around. When you're ready, step on the red pedestal to begin your nightmare.
          </p>
          <button
            onClick={() => setShowInstructions(false)}
            className="px-4 py-2 bg-blood-600 hover:bg-blood-700 text-white rounded transition-colors"
          >
            Got it!
          </button>
        </motion.div>
      )}

      {/* Start Game Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 right-8"
      >
        <button
          onClick={onStartGame}
          className="px-8 py-4 bg-blood-600 hover:bg-blood-700 text-white text-xl font-bold rounded-lg transition-colors shadow-lg"
        >
          Begin the Nightmare
        </button>
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-8"
      >
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Back to Avatar Selection
        </button>
      </motion.div>
    </div>
  )
}