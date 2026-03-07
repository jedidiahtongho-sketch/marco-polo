import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import Player from './Player'
import World from './World'
import Hunter from './Hunter'
import GameUI from '../UI/GameUI'
import { useGameStore } from '@/store/gameStore'
import { useEffect } from 'react'

interface GameProps {
  onGameOver: () => void
  onGameComplete: () => void
}

export default function Game({ onGameOver, onGameComplete }: GameProps) {
  const { 
    isGameOver, 
    isGameComplete,
    currentWorld, 
    roomTimeLeft, 
    leviathanActive, 
    leviathanAttackTime, 
    updateRoomTimer, 
    resetRoomTimer,
    health,
    keysCollected,
    totalKeys,
    poloCoins,
    collectedCodes,
    monsterType
  } = useGameStore()

  // Room timer logic - only active in room world
  useEffect(() => {
    if (currentWorld === 'room' && roomTimeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        updateRoomTimer()
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentWorld, roomTimeLeft, isGameOver, updateRoomTimer])

  // Reset room timer when entering room
  useEffect(() => {
    if (currentWorld === 'room') {
      resetRoomTimer()
    }
  }, [currentWorld, resetRoomTimer])

  // Leviathan attack timer
  useEffect(() => {
    if (leviathanActive && leviathanAttackTime > 0 && currentWorld === 'room') {
      // Leviathan attacks every second during attack period
      const attackTimer = setInterval(() => {
        // Damage player during leviathan attack
        const damage = 10 // Leviathan deals 10 damage per second
        // This would need to be implemented in the store
        console.log(`🐙 LEVIATHAN ATTACK! Dealing ${damage} damage!`)
      }, 1000)
      return () => clearInterval(attackTimer)
    }
  }, [leviathanActive, leviathanAttackTime, currentWorld])

  useEffect(() => {
    if (isGameOver) {
      setTimeout(onGameOver, 3000)
    }
  }, [isGameOver, onGameOver])

  useEffect(() => {
    if (isGameComplete) {
      setTimeout(onGameComplete, 3000)
    }
  }, [isGameComplete, onGameComplete])

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        className="w-full h-full"
        style={{ width: '100vw', height: '100vh', background: '#1a1a2a' }}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.0}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Physics gravity={[0, -30, 0]}>
          <Player />
          <World onGameComplete={onGameComplete} />
          <Hunter />
        </Physics>
      </Canvas>
      
      <GameUI 
        health={health} 
        keysCollected={keysCollected} 
        totalKeys={totalKeys} 
        poloCoins={poloCoins} 
        collectedCodes={collectedCodes} 
        monsterType={monsterType}
        currentWorld={currentWorld}
        roomTimeLeft={roomTimeLeft}
        leviathanActive={leviathanActive}
      />
    </>
  )
}