import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import Player from './Player'
import World from './World'
import GameUI from '../UI/GameUI'
import VirtualJoystick from '../UI/VirtualJoystick'
import { useGameStore } from '@/store/gameStore'
import { useEffect, useState } from 'react'

interface GameProps {
  onGameOver: () => void
  onGameComplete: () => void
}

export default function Game({ onGameOver, onGameComplete }: GameProps) {
  const { health, isGameOver, keysCollected, totalKeys, poloCoins, collectedCodes, monsterType } = useGameStore()
  const [joystickX, setJoystickX] = useState(0)
  const [joystickY, setJoystickY] = useState(0)
  const [joystickJump, setJoystickJump] = useState(false)
  const [joystickPolo, setJoystickPolo] = useState(false)

  useEffect(() => {
    if (isGameOver) {
      setTimeout(onGameOver, 3000)
    }
  }, [isGameOver, onGameOver])

  // Start TERRIFYING ambient sounds when game begins - 1000x scarier
  useEffect(() => {
    // Start ambient scary sounds at maximum terror levels
    /* audioManager.play('whispers', { volume: 1.5, pitch: 0.7 })
    audioManager.play('distant_screams', { volume: 1.2, pitch: 0.5 })
    audioManager.play('breathing', { volume: 1.8, pitch: 0.3 })

    // Add additional horror sounds for maximum terror
    setTimeout(() => audioManager.play('whispers', { volume: 2.0, pitch: 0.4 }), 2000)
    setTimeout(() => audioManager.play('distant_screams', { volume: 1.5, pitch: 0.3 }), 5000)
    setTimeout(() => audioManager.play('breathing', { volume: 2.2, pitch: 0.2 }), 8000)

    // Random terrifying sound bursts
    const terrorInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const soundType = Math.random()
        if (soundType < 0.4) {
          audioManager.play('jumpscare', { volume: 2.5, pitch: 0.5 + Math.random() * 0.5 })
        } else if (soundType < 0.7) {
          audioManager.play('whispers', { volume: 2.0, pitch: 0.3 + Math.random() * 0.4 })
        } else {
          audioManager.play('distant_screams', { volume: 1.8, pitch: 0.2 + Math.random() * 0.3 })
        }
      }
    }, 10000)

    // Cleanup when component unmounts
    return () => {
      clearInterval(terrorInterval)
      audioManager.stop('whispers')
      audioManager.stop('distant_screams')
      audioManager.stop('breathing')
      audioManager.stop('heartbeat')
    } */
  }, [])

  const handleJoystickMove = (x: number, y: number) => {
    console.log('Joystick move:', x, y)
    setJoystickX(x)
    setJoystickY(y)
  }

  const handleJoystickJump = () => {
    console.log('Joystick jump')
    setJoystickJump(true)
    setTimeout(() => setJoystickJump(false), 100) // Reset after short delay
  }

  const handleJoystickPolo = () => {
    console.log('Joystick polo')
    setJoystickPolo(true)
    setTimeout(() => setJoystickPolo(false), 100) // Reset after short delay
  }

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        className="w-full h-full"
        style={{ width: '100vw', height: '100vh' }}
      >
        <Sky sunPosition={[0, -1, 0]} />
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <fog attach="fog" args={['#ffffff', 30, 50]} />
        
        {/* Test cube to ensure rendering */}
        <mesh position={[0, 0, -2]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
        
        {/* Simple ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="green" />
        </mesh>
        
        <Physics gravity={[0, -9.81, 0]}>
          <World onGameComplete={onGameComplete} />
          <Player />
          {/* <Hunter /> */}
        </Physics>

        {/* Camera controls are handled by Player component */}

        {/* Temporarily disabled EffectComposer for debugging */}
        {/* <EffectComposer>
          <Bloom intensity={2.0} luminanceThreshold={0.1} />
          <SSAO
            samples={63}
            radius={0.5}
            intensity={50}
            worldDistanceThreshold={2}
            worldDistanceFalloff={0.5}
            worldProximityThreshold={0.1}
            worldProximityFalloff={2}
          />
          <DepthOfField
            focusDistance={0.5}
            focalLength={0.01}
            bokehScale={5}
          />
          <Vignette
            eskil={false}
            offset={0.3}
            darkness={1.5}
          />
        </EffectComposer> */}
      </Canvas>
      
      <GameUI health={health} keysCollected={keysCollected} totalKeys={totalKeys} poloCoins={poloCoins} collectedCodes={collectedCodes} monsterType={monsterType} />
      <VirtualJoystick
        onMove={handleJoystickMove}
        onJump={handleJoystickJump}
        onPolo={handleJoystickPolo}
      />
    </>
  )
}