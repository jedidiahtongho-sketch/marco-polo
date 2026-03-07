import { motion } from 'framer-motion'

interface MainMenuProps {
  onStart: () => void
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-b from-black via-gray-900 to-blood-900">
      {/* Relantro Helper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4"
      >
        <motion.img
          src="/logos/relantro-helper.svg"
          alt="Relantro Helper"
          className="w-16 h-16 opacity-80 drop-shadow-2xl relative z-10"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
            y: [0, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* 4D Dimensional rifts */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-2 left-2 w-1 h-8 bg-cyan-400 opacity-60"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="absolute top-4 right-1 w-6 h-1 bg-magenta-400 opacity-60"
            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-2 left-4 w-1 h-6 bg-yellow-400 opacity-60"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
        <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <motion.h1
          className="text-8xl font-bold mb-8 text-blood-500"
          animate={{ 
            textShadow: [
              '0 0 20px rgba(239, 68, 68, 0.5)',
              '0 0 40px rgba(239, 68, 68, 0.8)',
              '0 0 20px rgba(239, 68, 68, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          MARCO'S CURSE
        </motion.h1>
        
        <motion.p
          className="text-2xl text-gray-300 mb-12"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Listen carefully... respond wisely... survive.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStart}
          className="px-12 py-4 bg-blood-600 hover:bg-blood-700 text-white text-2xl font-bold rounded-lg shadow-lg transition-all"
        >
          START GAME
        </motion.button>

        <div className="mt-16 text-gray-500">
          <p className="text-sm">Use WASD to move • Mouse to look</p>
          <p className="text-sm">Press SPACE when you hear "Marco!"</p>
          <p className="text-sm mt-4">⚠️ Headphones recommended</p>
        </div>
      </motion.div>
    </div>
  )
}