import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { useGameStore } from '@/store/gameStore'
import { audioManager } from '@/audio/AudioManager'
import * as THREE from 'three'

export default function Hunter() {
  const { playerPosition, setHunterPosition, monsterType, monsterAwakened } = useGameStore()
  const [, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [20, 5, 20],
    args: [0.8]
  }))
  const hunterPosition = useRef([20, 5, 20])
  const marcoInterval = useRef<number>(1000 + Math.random() * 2000) // Much more frequent - every 1-3 seconds instead of 5-10
  const lastMarcoCall = useRef(0)
  const headRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  
  // Enhanced movement variables
  const movementPattern = useRef<'direct' | 'circle' | 'zigzag' | 'hide' | 'lunge' | 'random'>('direct')
  const patternTimer = useRef(0)
  const patternDuration = useRef(3000 + Math.random() * 4000)
  const circleAngle = useRef(0)
  const zigzagDirection = useRef(1)
  const lastLungeTime = useRef(0)
  const randomTarget = useRef<[number, number, number]>([0, 0, 0])
  const idleTimer = useRef(0)

  useEffect(() => {
    api.position.subscribe((p) => {
      hunterPosition.current = p
      setHunterPosition([p[0], p[1], p[2]])
    })
  }, [api, setHunterPosition])

  // Function to switch movement patterns
  const switchMovementPattern = () => {
    const patterns: Array<'direct' | 'circle' | 'zigzag' | 'hide' | 'lunge' | 'random'> = 
      ['direct', 'circle', 'zigzag', 'hide', 'lunge', 'random']
    
    // Weight patterns based on monster type for more strategic behavior
    let weightedPatterns = [...patterns]
    
    // Add more aggressive patterns for certain monsters
    if (monsterType === 'stalker' || monsterType === 'predator') {
      weightedPatterns.push('lunge', 'zigzag')
    }
    
    // Add stealth patterns for others
    if (monsterType === 'whisperer' || monsterType === 'shadow') {
      weightedPatterns.push('circle', 'hide')
    }
    
    const newPattern = weightedPatterns[Math.floor(Math.random() * weightedPatterns.length)]
    movementPattern.current = newPattern
    patternTimer.current = 0
    patternDuration.current = 2000 + Math.random() * 5000 // 2-7 seconds per pattern
    
    // Reset pattern-specific variables
    if (newPattern === 'circle') {
      circleAngle.current = Math.random() * Math.PI * 2
    }
    if (newPattern === 'zigzag') {
      zigzagDirection.current = Math.random() > 0.5 ? 1 : -1
    }
    if (newPattern === 'hide') {
      idleTimer.current = 0
    }
  }

  useFrame((state) => {
    const clock = state.clock
    const now = clock.getElapsedTime() * 1000

    // Call "Marco!" periodically with terrifying effects
    if (now - lastMarcoCall.current > marcoInterval.current) {
      audioManager.playScaryMarco([hunterPosition.current[0], hunterPosition.current[1], hunterPosition.current[2]])
      lastMarcoCall.current = now
      marcoInterval.current = monsterAwakened ? 1000 + Math.random() * 1000 : 3000 + Math.random() * 4000 // AWAKENED: Every 1-2 seconds vs normal 3-7 seconds
    }

    // Terrifying heartbeat based on distance to player
    const distanceToPlayer = Math.sqrt(
      Math.pow(hunterPosition.current[0] - playerPosition[0], 2) +
      Math.pow(hunterPosition.current[1] - playerPosition[1], 2) +
      Math.pow(hunterPosition.current[2] - playerPosition[2], 2)
    )

    // Heartbeat intensity increases as monster gets closer
    const heartbeatIntensity = Math.max(0, Math.min(1, (20 - distanceToPlayer) / 15))
    if (heartbeatIntensity > 0.1) {
      audioManager.playTerrifyingHeartbeat(heartbeatIntensity)
    }

    // Proximity jumpscare - DISABLED for now
    // if (distanceToPlayer < 5 && now - lastLungeTime.current > 3000) {
    //   audioManager.playJumpscare()
    //   lastLungeTime.current = now
    //   decreaseHealth(30)
    //   setTimeout(() => audioManager.playJumpscare(), 200)
    //   setTimeout(() => audioManager.playJumpscare(), 400)
    // }

    // Enhanced movement patterns based on monster type
    const deltaTime = clock.getDelta()
    patternTimer.current += deltaTime

    // Switch patterns periodically
    if (patternTimer.current >= patternDuration.current) {
      switchMovementPattern()
    }

    let targetPosition = [playerPosition[0], playerPosition[1], playerPosition[2]]
    let speed = monsterAwakened ? 15 : 8 // AWAKENED: Extremely fast (15) vs normal (8)

    // Apply movement pattern
    switch (movementPattern.current) {
      case 'direct':
        // Direct pursuit - original behavior
        if (monsterAwakened) {
          speed = 18 // AWAKENED: Even faster direct pursuit
        }
        break

      case 'circle':
        // Circle around player at distance
        const circleRadius = monsterAwakened ? 4 : 8 // AWAKENED: Much closer circling
        const circleSpeed = monsterAwakened ? 12 : 6 // AWAKENED: Much faster circling
        circleAngle.current += circleSpeed * deltaTime
        targetPosition = [
          playerPosition[0] + Math.cos(circleAngle.current) * circleRadius,
          playerPosition[1],
          playerPosition[2] + Math.sin(circleAngle.current) * circleRadius
        ]
        speed = monsterAwakened ? 14 : 7 // AWAKENED: Much faster circling
        break

      case 'zigzag':
        // Zigzag movement toward player
        const zigzagSpeed = monsterAwakened ? 24 : 12 // AWAKENED: Extremely fast zigzag
        const zigzagAmplitude = monsterAwakened ? 2 : 4 // AWAKENED: Tighter zigzag
        zigzagDirection.current += zigzagSpeed * deltaTime
        const zigzagOffset = Math.sin(zigzagDirection.current) * zigzagAmplitude
        targetPosition = [
          playerPosition[0] + zigzagOffset,
          playerPosition[1],
          playerPosition[2]
        ]
        speed = monsterAwakened ? 16 : 9 // AWAKENED: Much faster zigzag
        break

      case 'hide':
        // Hide behind furniture or walls
        if (idleTimer.current > 2) {
          // Move to a hiding spot
          const hideSpots = [
            [-8, 0, -8], [8, 0, -8], [-8, 0, 8], [8, 0, 8],
            [0, 0, -10], [0, 0, 10], [-10, 0, 0], [10, 0, 0]
          ]
          const randomSpot = hideSpots[Math.floor(Math.random() * hideSpots.length)]
          targetPosition = randomSpot
          speed = 6 // Increased from 1.5 - much faster random movement
        } else {
          // Stay still while hiding
          targetPosition = [hunterPosition.current[0], hunterPosition.current[1], hunterPosition.current[2]]
          speed = 0
        }
        idleTimer.current += deltaTime
        break

      case 'lunge':
        // Sudden lunges toward player
        if (Date.now() - lastLungeTime.current > 3000) {
          lastLungeTime.current = Date.now()
          speed = 20 // Increased from 6 - EXTREMELY fast lunge
        } else {
          speed = 0.5 // Slow approach
        }
        break

      case 'random':
        // Random wandering with occasional rushes
        if (patternTimer.current % 2 < 1) {
          // Rush toward player
          speed = 12 // Increased from 3 - very fast random movement
        } else {
          // Wander randomly
          if (!randomTarget.current || Math.random() < 0.1) {
            randomTarget.current = [
              playerPosition[0] + (Math.random() - 0.5) * 20,
              playerPosition[1],
              playerPosition[2] + (Math.random() - 0.5) * 20
            ]
          }
          targetPosition = randomTarget.current
          speed = 1
        }
        break
    }

    // Calculate direction to target
    const direction = new THREE.Vector3(
      targetPosition[0] - hunterPosition.current[0],
      0,
      targetPosition[2] - hunterPosition.current[2]
    ).normalize()

    // Apply movement
    if (speed > 0) {
      api.velocity.set(direction.x * speed, hunterPosition.current[1], direction.z * speed)
    } else {
      api.velocity.set(0, hunterPosition.current[1], 0)
    }

    // Check collision with player - DISABLED for now
    // const distance = Math.sqrt(
    //   Math.pow(playerPosition[0] - hunterPosition.current[0], 2) +
    //   Math.pow(playerPosition[2] - hunterPosition.current[2], 2)
    // )

    // if (distance < 2) {
    //   decreaseHealth(0.5)
    // }

    // Animate head to look at player
    if (headRef.current) {
      const lookDirection = new THREE.Vector3(
        playerPosition[0] - hunterPosition.current[0],
        playerPosition[1] - hunterPosition.current[1] + 1,
        playerPosition[2] - hunterPosition.current[2]
      ).normalize()
      
      headRef.current.lookAt(
        hunterPosition.current[0] + lookDirection.x,
        hunterPosition.current[1] + lookDirection.y,
        hunterPosition.current[2] + lookDirection.z
      )
    }

    // Subtle arm swinging animation
    const time = clock.getElapsedTime()
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 2) * 0.1
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -Math.sin(time * 2) * 0.1
    }
  })

  return (
    <group castShadow position={[hunterPosition.current[0], hunterPosition.current[1], hunterPosition.current[2]]}>
      {/* Invisible collision sphere - physics handled separately */}
      <mesh visible={false}>
        <sphereGeometry args={[0.8, 32, 32]} />
      </mesh>

      {/* BODY */}
      <group position={[0, 0, 0]}>
        {/* Torso - now blood-red and terrifying */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.7, 1.2, 16]} />
          <meshStandardMaterial
            color="#8B0000"
            emissive="#8B0000"
            emissiveIntensity={0.3}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Belly patch - now bloody and pulsating */}
        <mesh position={[0, 0.3, 0.3]} castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color="#DC143C"
            emissive="#DC143C"
            emissiveIntensity={0.5}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* LEFT ARM */}
        <group ref={leftArmRef} position={[-0.8, 0.8, 0]}>
          {/* Upper arm */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.8, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Lower arm */}
          <mesh position={[0, -1.0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.6, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -1.4, 0]} castShadow>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial 
              color="#4a3326" 
              roughness={0.9} 
              metalness={0.05}
            />
          </mesh>
          {/* Fingers */}
          <group position={[0, -1.6, 0]}>
            {[-0.08, 0, 0.08].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
                <meshStandardMaterial color="#3d2817" />
              </mesh>
            ))}
          </group>
        </group>

        {/* RIGHT ARM */}
        <group ref={rightArmRef} position={[0.8, 0.8, 0]}>
          {/* Upper arm */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.8, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Lower arm */}
          <mesh position={[0, -1.0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.6, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -1.4, 0]} castShadow>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial 
              color="#4a3326" 
              roughness={0.9} 
              metalness={0.05}
            />
          </mesh>
          {/* Fingers */}
          <group position={[0, -1.6, 0]}>
            {[-0.08, 0, 0.08].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
                <meshStandardMaterial color="#3d2817" />
              </mesh>
            ))}
          </group>
        </group>

        {/* LEFT LEG */}
        <group position={[-0.3, -0.8, 0]}>
          {/* Upper leg */}
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.6, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Lower leg */}
          <mesh position={[0, -0.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.6, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.2, 0.1]} castShadow>
            <boxGeometry args={[0.25, 0.15, 0.4]} />
            <meshStandardMaterial 
              color="#4a3326" 
              roughness={0.9} 
              metalness={0.05}
            />
          </mesh>
        </group>

        {/* RIGHT LEG */}
        <group position={[0.3, -0.8, 0]}>
          {/* Upper leg */}
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.6, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Lower leg */}
          <mesh position={[0, -0.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.6, 12]} />
            <meshStandardMaterial 
              color="#5c4033" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.2, 0.1]} castShadow>
            <boxGeometry args={[0.25, 0.15, 0.4]} />
            <meshStandardMaterial 
              color="#4a3326" 
              roughness={0.9} 
              metalness={0.05}
            />
          </mesh>
        </group>
      </group>

      {/* HEAD */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Main head - now blood-red and terrifying */}
        <mesh castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color="#8B0000"
            emissive="#8B0000"
            emissiveIntensity={monsterAwakened ? 0.8 : 0.2}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* DEMONIC GLOWING EYES - 1000x more terrifying */}
        {/* Left eye */}
        <mesh position={[-0.12, 0.05, 0.3]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={monsterAwakened ? 5.0 : 2.0}
          />
        </mesh>
        {/* Right eye */}
        <mesh position={[0.12, 0.05, 0.3]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={monsterAwakened ? 5.0 : 2.0}
          />
        </mesh>

        {/* Inner eye glow */}
        <mesh position={[-0.12, 0.05, 0.32]} castShadow>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={monsterAwakened ? 8.0 : 3.0}
          />
        </mesh>
        <mesh position={[0.12, 0.05, 0.32]} castShadow>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={monsterAwakened ? 8.0 : 3.0}
          />
        </mesh>

        {/* Snout */}
        <mesh position={[0, -0.1, 0.25]} castShadow>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial 
            color="#7a5c4f" 
            roughness={0.9} 
            metalness={0.05}
          />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.05, 0.4]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* LEFT EAR */}
        <mesh position={[-0.25, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.08, 0.1, 12]} />
          <meshStandardMaterial 
            color="#5c4033" 
            roughness={0.8} 
            metalness={0.1}
          />
        </mesh>
        <mesh position={[-0.25, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.05, 0.08, 12]} />
          <meshStandardMaterial 
            color="#7a5c4f" 
            roughness={0.9} 
            metalness={0.05}
          />
        </mesh>

        {/* RIGHT EAR */}
        <mesh position={[0.25, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.08, 0.1, 12]} />
          <meshStandardMaterial 
            color="#5c4033" 
            roughness={0.8} 
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0.25, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.05, 0.08, 12]} />
          <meshStandardMaterial 
            color="#7a5c4f" 
            roughness={0.9} 
            metalness={0.05}
          />
        </mesh>

        {/* LEFT EYE */}
        <group position={[-0.15, 0.05, 0.25]}>
          {/* Eye socket */}
          <mesh castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          {/* Eye glow */}
          <mesh>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff" 
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* RIGHT EYE */}
        <group position={[0.15, 0.05, 0.25]}>
          {/* Eye socket */}
          <mesh castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          {/* Eye glow */}
          <mesh>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff" 
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Eyebrows */}
        <mesh position={[-0.15, 0.12, 0.2]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.02]} />
          <meshStandardMaterial color="#3d2817" />
        </mesh>
        <mesh position={[0.15, 0.12, 0.2]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.02]} />
          <meshStandardMaterial color="#3d2817" />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, -0.15, 0.3]} castShadow>
          <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Teeth */}
        <group position={[0, -0.12, 0.32]}>
          <mesh position={[-0.03, 0, 0]} castShadow>
            <boxGeometry args={[0.02, 0.04, 0.01]} />
            <meshStandardMaterial color="#e8e8e8" />
          </mesh>
          <mesh position={[0.03, 0, 0]} castShadow>
            <boxGeometry args={[0.02, 0.04, 0.01]} />
            <meshStandardMaterial color="#e8e8e8" />
          </mesh>
        </group>
      </group>

      {/* BOW TIE */}
      <group position={[0, 0.9, 0.4]}>
        <mesh position={[-0.08, 0, 0]} castShadow>
          <coneGeometry args={[0.06, 0.12, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.08, 0, 0]} castShadow>
          <coneGeometry args={[0.06, 0.12, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* TOP HAT */}
      <group position={[0, 1.8, 0]}>
        {/* Brim */}
        <mesh position={[0, -0.02, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.04, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Crown */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Band */}
        <mesh position={[0, 0.02, 0.26]} castShadow>
          <torusGeometry args={[0.26, 0.02, 8, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Damage and wear effects */}
      <group>
        {/* Scratches and dents */}
        <mesh position={[-0.2, 0.3, 0.5]} castShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.3, 0.5, 0.4]} castShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-0.1, -0.2, 0.6]} castShadow>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Ambient glow effect */}
      <pointLight 
        position={[0, 1.4, 0.3]} 
        intensity={0.1} 
        distance={2} 
        color="#ffcccc" 
      />
    </group>
  )
}