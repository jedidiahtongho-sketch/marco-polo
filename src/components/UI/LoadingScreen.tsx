import { motion } from 'framer-motion'

interface LoadingScreenProps {
  onSkip?: () => void
}

export default function LoadingScreen({ onSkip }: LoadingScreenProps) {
  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    }
  }

  return (
    <div 
      className="relative flex items-center justify-center w-full h-full bg-black cursor-pointer"
      onClick={handleSkip}
    >
      {/* Relantro Helper */}
      {/* Relantro Helper - Commented out due to missing file */}
      {/*
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-4 right-4"
      >
        <motion.img
          src="/logos/relantro-helper.svg"
          alt="Relantro Helper"
          className="w-14 h-14 opacity-80 drop-shadow-2xl relative z-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
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
        <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl animate-pulse"></div>
      </motion.div>
      */}
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blood-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white text-xl"
        >
          Loading...
        </motion.p>
        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400 text-sm mt-2"
        >
          Click anywhere to skip
        </motion.p>
      </div>
    </div>
  )
}