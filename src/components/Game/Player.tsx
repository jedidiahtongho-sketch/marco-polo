import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { Vector3 } from 'three'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { usePlayerControls } from '@/hooks/usePlayerControls'

interface PlayerProps {}

export default function Player({}: PlayerProps) {
  const { camera } = useThree()
  
  const { forward, backward, left, right, jump } = usePlayerControls()

  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition)
  const flashlightOn = useGameStore((state) => state.flashlightOn)
  const shouldTeleport = useGameStore((state) => state.shouldTeleport)
  const currentWorld = useGameStore((state) => state.currentWorld)
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [0.5],
    userData: { type: 'player' }
  }))

  const velocity = useRef([0, 0, 0])
  const position = useRef([0, 5, 0])
  const flashlightRef = useRef<THREE.SpotLight>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const isPointerLocked = useRef(false)

  // Subscribe to physics body changes
  useEffect(() => {
    const unsubscribeVel = api.velocity.subscribe((v) => {
      velocity.current = v
    })
    const unsubscribePos = api.position.subscribe((p) => {
      position.current = p
    })
    return () => {
      unsubscribeVel()
      unsubscribePos()
    }
  }, [api])

  // Reset position if stuck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyR') {
        console.log('Resetting player position')
        api.position.set(0, 5, 0)
        api.velocity.set(0, 0, 0)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [api])

  // Mouse controls
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked.current) return
      
      const sensitivity = 0.002
      mouse.current.x -= event.movementX * sensitivity
      mouse.current.y -= event.movementY * sensitivity
      
      // Limit vertical rotation
      mouse.current.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouse.current.y))
      
      camera.rotation.set(mouse.current.y, mouse.current.x, 0, 'YXZ')
    }

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === document.body
    }

    const handleClick = () => {
      if (!isPointerLocked.current) {
        document.body.requestPointerLock()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      document.removeEventListener('click', handleClick)
    }
  }, [camera])

  useFrame(() => {
    // Calculate movement direction relative to camera
    const direction = new Vector3()
    
    // Get camera forward and right vectors
    const cameraDirection = new Vector3(0, 0, -1)
    cameraDirection.applyEuler(camera.rotation)
    
    const cameraRight = new Vector3(1, 0, 0)
    cameraRight.applyEuler(camera.rotation)
    
    // Apply movement inputs
    if (forward) direction.add(cameraDirection)
    if (backward) direction.sub(cameraDirection)
    if (left) direction.sub(cameraRight)
    if (right) direction.add(cameraRight)
    
    // Normalize and scale
    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(5)
      // Only log when direction changes significantly
      if (Math.abs(direction.x) > 0.1 || Math.abs(direction.z) > 0.1) {
        console.log('Movement debug:', { forward, backward, left, right, direction })
      }
    }

    // Apply movement velocity
    api.velocity.set(direction.x, velocity.current[1], direction.z)

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 10.47, velocity.current[2])
      console.log('JUMP! (6 feet high)')
    }

    // Update player position in store
    setPlayerPosition(position.current as [number, number, number])
    camera.position.set(position.current[0], position.current[1] + 1, position.current[2])

    // Check for teleport to different world
    if (shouldTeleport) {
      console.log('🌍 TELEPORTING TO DIFFERENT WORLD!')
      if (currentWorld === 'forest') {
        // Teleport to forest starting position
        api.position.set(0, 5, 0)
      } else {
        // Teleport to room starting position
        api.position.set(0, 5, 0)
      }
      api.velocity.set(0, 0, 0) // Reset velocity
      // Reset the teleport flag
      useGameStore.setState({ shouldTeleport: false })
    }

    // Debug physics occasionally
    if (Math.random() < 0.01) { // Only log 1% of frames
      console.log('Physics debug:', {
        position: position.current,
        velocity: velocity.current,
        controls: { forward, backward, left, right, jump }
      })
    }

    // Update flashlight direction to follow camera
    const flashlightDirection = new Vector3(0, 0, -1)
    flashlightDirection.applyEuler(camera.rotation)
    flashlightDirection.multiplyScalar(10)
    
    if (flashlightRef.current) {
      flashlightRef.current.target.position.set(
        position.current[0] + flashlightDirection.x,
        position.current[1] + 1 + flashlightDirection.y,
        position.current[2] + flashlightDirection.z
      )
      flashlightRef.current.target.updateMatrixWorld()
    }
  })

  return (
    <mesh ref={ref as any}>
      {/* Player body - visible for debugging */}
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial 
        color={jump ? "yellow" : "red"} 
        emissive={jump ? "yellow" : "darkred"}
        emissiveIntensity={jump ? 0.3 : 0.1}
      />

      {/* Flashlight */}
      <spotLight
        ref={flashlightRef}
        position={[0, 1, 0]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={flashlightOn ? 2 : 0}
        distance={20}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-fov={30}
      />
      {flashlightRef.current?.target && (
        <primitive object={flashlightRef.current.target} />
      )}
    </mesh>
  )
}