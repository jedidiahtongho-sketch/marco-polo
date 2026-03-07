import { useRef, useState, useEffect } from 'react'

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void
  onJump: () => void
  onPolo: () => void
}

export default function VirtualJoystick({ onMove, onJump, onPolo }: VirtualJoystickProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Check if device is touch-enabled
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsVisible('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouchDevice()
    window.addEventListener('resize', checkTouchDevice)
    return () => window.removeEventListener('resize', checkTouchDevice)
  }, [])

  // Set joystick center position
  useEffect(() => {
    if (joystickRef.current && isVisible) {
      // Center position is calculated dynamically in updateJoystickPosition
    }
  }, [isVisible])

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updateJoystickPosition(e.touches[0])
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (isDragging) {
      updateJoystickPosition(e.touches[0])
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(false)
    resetJoystick()
    onMove(0, 0) // Stop movement
  }

  const updateJoystickPosition = (touch: React.Touch) => {
    if (!knobRef.current || !joystickRef.current) return

    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const maxDistance = rect.width / 2 - 15 // 15px padding for knob

    let deltaX = touch.clientX - centerX
    let deltaY = touch.clientY - centerY

    // Limit to circle
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance
      deltaY = (deltaY / distance) * maxDistance
    }

    // Move knob
    knobRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`

    // Normalize to -1 to 1 range
    const normalizedX = deltaX / maxDistance
    const normalizedY = deltaY / maxDistance

    onMove(normalizedX, normalizedY)
  }

  const resetJoystick = () => {
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)'
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Movement Joystick - Bottom Left */}
      <div
        ref={joystickRef}
        className="fixed bottom-20 left-6 w-24 h-24 bg-black/50 rounded-full border-2 border-white/30 backdrop-blur-sm z-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={knobRef}
          className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/80 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        />
      </div>

      {/* Action Buttons - Bottom Right */}
      <div className="fixed bottom-20 right-6 flex flex-col gap-4 z-50">
        {/* Jump Button */}
        <button
          className="w-16 h-16 bg-blue-600/80 rounded-full border-2 border-white/50 backdrop-blur-sm text-white font-bold text-lg active:bg-blue-700/90 transition-colors"
          onTouchStart={(e) => {
            e.preventDefault()
            onJump()
          }}
        >
          ↑
        </button>

        {/* Polo Button */}
        <button
          className="w-16 h-16 bg-red-600/80 rounded-full border-2 border-white/50 backdrop-blur-sm text-white font-bold text-sm active:bg-red-700/90 transition-colors"
          onTouchStart={(e) => {
            e.preventDefault()
            onPolo()
          }}
        >
          POLO
        </button>
      </div>
    </>
  )
}