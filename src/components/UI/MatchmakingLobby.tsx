import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface MatchmakingLobbyProps {
  onBackToMenu: () => void
  onStartGame: () => void
}

interface CircleData {
  name: string
  maxPlayers: number
  currentPlayers: number
  description: string
}

export default function MatchmakingLobby({ onBackToMenu, onStartGame }: MatchmakingLobbyProps) {
  const [circles, setCircles] = useState<CircleData[]>([
    { name: 'Solo', maxPlayers: 1, currentPlayers: 1, description: '1 Player' },
    { name: 'Duo', maxPlayers: 2, currentPlayers: 2, description: '2 Players' },
    { name: 'Trio', maxPlayers: 3, currentPlayers: 3, description: '3 Players' },
    { name: 'Quad', maxPlayers: 4, currentPlayers: 3, description: '4 Players' },
    { name: 'Group', maxPlayers: 6, currentPlayers: 4, description: '5-6 Players' }
  ])

  const [selectedCircle, setSelectedCircle] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Simulate player count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCircles(prev => prev.map(circle => ({
        ...circle,
        currentPlayers: Math.min(circle.maxPlayers, circle.currentPlayers + Math.floor(Math.random() * 3) - 1)
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleJoinQueue = (circleName: string) => {
    setSelectedCircle(circleName)
    setIsSearching(true)
    
    // Simulate matchmaking (2-5 seconds)
    setTimeout(() => {
      setIsSearching(false)
      onStartGame()
    }, 2000 + Math.random() * 3000)
  }

  const getCircleSize = (index: number) => {
    const sizes = ['w-32 h-32', 'w-40 h-40', 'w-48 h-48', 'w-56 h-56', 'w-64 h-64']
    return sizes[index] || 'w-32 h-32'
  }

  const getCircleColor = (circle: CircleData) => {
    if (circle.currentPlayers >= circle.maxPlayers) return 'border-red-500 bg-red-900/20'
    if (circle.currentPlayers > circle.maxPlayers * 0.7) return 'border-yellow-500 bg-yellow-900/20'
    return 'border-blue-500 bg-blue-900/20'
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-black via-gray-900 to-blood-900 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold text-blood-500 mb-8 text-center"
      >
        MATCHMAKING LOBBY
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-gray-300 mb-12 text-center max-w-2xl"
      >
        Choose your circle size to find other survivors. The smaller the circle, the faster you'll find a match.
      </motion.p>

      {isSearching ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blood-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-2xl mb-2">Searching for {selectedCircle}...</p>
          <p className="text-gray-400">Finding other survivors...</p>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center space-y-8">
          {/* Circles */}
          <div className="flex items-center justify-center space-x-8 flex-wrap">
            {circles.map((circle, index) => (
              <motion.div
                key={circle.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => circle.currentPlayers < circle.maxPlayers && handleJoinQueue(circle.name)}
              >
                <motion.div
                  className={`rounded-full border-4 ${getCircleSize(index)} flex items-center justify-center ${getCircleColor(circle)} transition-all duration-300`}
                  animate={circle.currentPlayers >= circle.maxPlayers ? {} : {
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 40px rgba(59, 130, 246, 0.6)',
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{circle.name}</div>
                    <div className="text-sm text-gray-300">{circle.description}</div>
                    <div className="text-lg font-semibold text-white mt-1">
                      {circle.currentPlayers}/{circle.maxPlayers}
                    </div>
                  </div>
                </motion.div>
                
                {/* Progress bar */}
                <div className="w-24 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(circle.currentPlayers / circle.maxPlayers) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-900/20 border border-blue-500 rounded-full"></div>
              <span className="text-gray-300">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-900/20 border border-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Filling Up</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-900/20 border border-red-500 rounded-full"></div>
              <span className="text-gray-300">Full</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 flex space-x-4"
      >
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Back to Menu
        </button>
        <button
          onClick={() => setCircles([...circles])} // Refresh
          className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Refresh
        </button>
      </motion.div>
    </div>
  )
}