import { useEffect, useState } from 'react'
import { audioManager } from '@/audio/AudioManager'
import { useGameStore } from '@/store/gameStore'

export function usePlayerControls() {
  const { currentWorld, triggerLeviathanAttack } = useGameStore()

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    polo: false
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: true }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: true }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: true }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: true }))
          break
        case 'Space':
          setMovement((m) => ({ ...m, jump: true }))
          // Trigger leviathan attack if in room
          if (currentWorld === 'room') {
            triggerLeviathanAttack()
          }
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, polo: true }))
          // Trigger leviathan attack if in room
          if (currentWorld === 'room') {
            triggerLeviathanAttack()
          }
          // Play terrifying polo response with random scary effects
          audioManager.play('polo', {
            pitch: 0.9 + Math.random() * 0.3, // Slightly varied pitch
            volume: 0.8 + Math.random() * 0.4, // Louder
            distortion: Math.random() > 0.8 ? 0.3 : 0 // 20% chance of distortion
          })
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: false }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: false }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: false }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: false }))
          break
        case 'Space':
          setMovement((m) => ({ ...m, jump: false }))
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, polo: false }))
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Combine keyboard and joystick input
  const forward = movement.forward ? 1 : 0
  const backward = movement.backward ? 1 : 0
  const left = movement.left ? 1 : 0
  const right = movement.right ? 1 : 0
  const jump = movement.jump
  const polo = movement.polo

  return {
    forward,
    backward,
    left,
    right,
    jump,
    polo
  }
}