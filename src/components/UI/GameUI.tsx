import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

interface GameUIProps {
  health: number
  keysCollected: number
  totalKeys: number
  poloCoins: number
  collectedCodes: string[]
  monsterType: string
  currentWorld: 'room' | 'forest' | 'dungeon' | 'cave' | 'kennel' | 'orchard'
  roomTimeLeft: number
  leviathanActive: boolean
}

export default function GameUI({ health, keysCollected, totalKeys, poloCoins, collectedCodes, monsterType, currentWorld, roomTimeLeft, leviathanActive }: GameUIProps) {
  const flashlightOn = useGameStore((state) => state.flashlightOn)
  const toggleFlashlight = useGameStore((state) => state.toggleFlashlight)
  const getMonsterTip = (type: string) => {
    switch (type) {
      case 'stalker':
        return "The Stalker moves predictably. Listen for patterns in its calls and move opposite to its direction."
      case 'predator':
        return "The Predator is aggressive. Stay in open areas and use Polo calls to reveal its position briefly."
      case 'whisperer':
        return "The Whisperer whispers softly. Turn down your volume and focus on the main 'Marco!' calls."
      case 'shadow':
        return "The Shadow blends with darkness. Use your flashlight sparingly and move quickly between light sources."
      case 'phantom':
        return "The Phantom phases through walls. Keep moving and don't stay in one spot too long."
      default:
        return "Stay alert and listen carefully. Use Polo strategically to reveal the monster's position."
    }
  }
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Health bar */}
      <div className="absolute top-4 left-4">
        <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg">
          <p className="text-white text-sm mb-2">Health</p>
          <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blood-600 to-blood-400"
              initial={{ width: '100%' }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Room Timer - Only show in room world */}
      {currentWorld === 'room' && (
        <div className="absolute top-4 left-72">
          <div className={`bg-gray-900 bg-opacity-80 p-4 rounded-lg border-2 ${leviathanActive ? 'border-red-500 animate-pulse' : 'border-blue-500'}`}>
            <p className="text-white text-sm mb-2">Escape Time</p>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl ${leviathanActive ? 'text-red-400' : roomTimeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                {leviathanActive ? '🐙' : '⏰'}
              </span>
              <span className={`text-lg font-bold ${leviathanActive ? 'text-red-400' : roomTimeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`}>
                {roomTimeLeft}s
              </span>
            </div>
            {leviathanActive && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-400 text-xs mt-1 font-semibold"
              >
                LEVIATHAN ATTACKING!
              </motion.p>
            )}
            {roomTimeLeft <= 10 && !leviathanActive && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-400 text-xs mt-1 font-semibold animate-pulse"
              >
                TIME RUNNING OUT!
              </motion.p>
            )}
          </div>
        </div>
      )}

      {/* Flashlight Toggle */}
      <div className="absolute top-32 left-4">
        <motion.button
          onClick={toggleFlashlight}
          className={`bg-gray-900 bg-opacity-80 p-3 rounded-lg border-2 transition-all duration-200 ${
            flashlightOn 
              ? 'border-yellow-400 bg-yellow-400/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-2">
            <span className={`text-2xl ${flashlightOn ? 'text-yellow-400' : 'text-gray-500'}`}>
              🔦
            </span>
            <span className={`text-sm font-bold ${flashlightOn ? 'text-yellow-400' : 'text-gray-400'}`}>
              {flashlightOn ? 'ON' : 'OFF'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Keys and Polo Coins collected */}
      <div className="absolute top-4 right-4 space-y-4">
        <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg">
          <p className="text-white text-sm mb-2">Keys Found</p>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 text-xl">🗝️</span>
            <span className="text-white text-lg font-bold">
              {keysCollected} / {totalKeys}
            </span>
          </div>
          {keysCollected >= totalKeys && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-400 text-sm mt-2 font-semibold"
            >
              Exit Unlocked!
            </motion.p>
          )}
        </div>

        <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg">
          <p className="text-white text-sm mb-2">Polo Coins</p>
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 text-xl">🪙</span>
            <span className="text-white text-lg font-bold">
              {poloCoins}
            </span>
          </div>
        </div>
      </div>

      {/* Polo Coin Collection Notification */}
      {collectedCodes.length > 0 && collectedCodes[collectedCodes.length - 1] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-600 bg-opacity-90 p-6 rounded-lg text-center"
        >
          <p className="text-white text-xl font-bold mb-2">Polo Coin Collected!</p>
          <p className="text-cyan-200 text-lg font-mono">{collectedCodes[collectedCodes.length - 1]}</p>
          <p className="text-cyan-300 text-sm mt-2">Code sent to all players</p>
        </motion.div>
      )}

      {/* Collected Codes */}
      {collectedCodes.length > 0 && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg max-w-xs">
            <p className="text-white text-sm mb-2">Collected Codes</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {collectedCodes.map((code, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-cyan-400 text-xs font-mono bg-gray-800 p-2 rounded"
                >
                  {code}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relantro Helper with Monster Tip */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-4"
      >
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm p-4 rounded-xl max-w-xs flex items-start space-x-3 border border-red-500/30 shadow-2xl">
        {/* Relantro Helper - Commented out due to missing file */}
        {/*
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative"
        >
          <img
            src="/logos/relantro-helper.svg"
            alt="Relantro Helper"
            className="w-10 h-10 flex-shrink-0 drop-shadow-lg relative z-10"
          />
          // 4D Dimensional rifts
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1 left-1 w-0.5 h-4 bg-cyan-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute top-2 right-0.5 w-3 h-0.5 bg-magenta-400 opacity-60"
              animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-1 left-2 w-0.5 h-3 bg-yellow-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
          <div className="absolute inset-0 bg-red-600/20 rounded-full blur-md animate-pulse"></div>
        </motion.div>
        */}
          <div>
            <p className="text-red-400 text-sm font-bold mb-1 drop-shadow-sm">Relantro's Tip:</p>
            <p className="text-white text-xs leading-relaxed drop-shadow-sm">{getMonsterTip(monsterType)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}