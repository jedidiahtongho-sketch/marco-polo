import { motion } from 'framer-motion'
import { useState } from 'react'

interface AvatarSelectionProps {
  onComplete: () => void
  onBack: () => void
}

interface AvatarOptions {
  face: number
  hair: number
  hairColor: string
  skinTone: string
  eyes: number
  eyeColor: string
  bodyType: number
  height: number
}

export default function AvatarSelection({ onComplete, onBack }: AvatarSelectionProps) {
  const [step, setStep] = useState<'avatar' | 'account' | 'friendCode'>('avatar')
  const [avatar, setAvatar] = useState<AvatarOptions>({
    face: 0,
    hair: 0,
    hairColor: '#8B4513',
    skinTone: '#F5DEB3',
    eyes: 0,
    eyeColor: '#4169E1',
    bodyType: 0,
    height: 1.0
  })
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [friendCode, setFriendCode] = useState('')

  const faces = ['😀', '😊', '😐', '😔', '😠', '😢', '😴', '🤔']
  const hairs = ['👨‍🦱', '👨‍🦰', '👨‍🦳', '👨‍🦲', '👩‍🦱', '👩‍🦰', '👩‍🦳', '👩‍🦲', '👨‍🎨', '👩‍🎨', '👨‍💼', '👩‍💼']
  const hairColors = ['#8B4513', '#000000', '#FFD700', '#FF6347', '#FF69B4', '#4169E1', '#32CD32', '#FFFFFF', '#C0C0C0', '#800080', '#FFA500', '#DC143C', '#00CED1', '#FF1493', '#ADFF2F', '#FF4500']
  const skinTones = ['#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F', '#CD853F', '#A0522D', '#8B4513', '#654321', '#2F1B14', '#1C0A00']
  const eyes = ['👁️', '👀', '😳', '😍', '😎', '🤓', '😴', '😵']
  const eyeColors = ['#4169E1', '#000000', '#8B0000', '#228B22', '#FFD700', '#FF6347', '#9370DB', '#FF69B4', '#00CED1', '#FFA500', '#DC143C', '#32CD32', '#8A2BE2', '#FF1493', '#00FFFF', '#FF4500', '#ADFF2F', '#DDA0DD', '#98FB98', '#F0E68C']
  const bodyTypes = ['🏃', '🏋️', '🧘', '🤾']

  const generateFriendCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-'
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleAvatarComplete = () => {
    setStep('account')
  }

  const handleAccountComplete = () => {
    if (username.length < 3) {
      alert('Username must be at least 3 characters.')
      return
    }
    const code = generateFriendCode()
    setFriendCode(code)
    setStep('friendCode')
  }

  const handleFinalComplete = () => {
    // Save avatar and account data (would normally save to backend)
    localStorage.setItem('avatar', JSON.stringify(avatar))
    localStorage.setItem('username', username)
    localStorage.setItem('displayName', displayName || username)
    localStorage.setItem('friendCode', friendCode)
    
    onComplete()
  }

  if (step === 'avatar') {
    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-black via-gray-900 to-blood-900 p-8">
        {/* Relantro Helper - Commented out due to missing file */}
        {/*
        <motion.div className="absolute top-4 right-4 relative">
          <motion.img
            src="/logos/relantro-helper.svg"
            alt="Relantro Helper"
            className="w-12 h-12 opacity-60 relative z-10"
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          // 4D Dimensional rifts
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1 left-1 w-0.5 h-3 bg-cyan-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute top-1.5 right-0.5 w-2 h-0.5 bg-magenta-400 opacity-60"
              animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-1 left-1.5 w-0.5 h-2 bg-yellow-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
          <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
        </motion.div>
        */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-blood-500 mb-8 text-center"
        >
          CREATE YOUR SURVIVOR
        </motion.h1>

        <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Avatar Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-lg"
          >
            <h2 className="text-2xl text-white mb-4 text-center">Avatar Preview</h2>
            <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center text-8xl">
              <div style={{ 
                fontSize: `${avatar.height * 4}rem`,
                filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))'
              }}>
                {faces[avatar.face]}
              </div>
            </div>
            <div className="mt-4 text-center text-gray-300">
              Height: {Math.round(avatar.height * 100)}%
            </div>
          </motion.div>

          {/* Customization Options */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 p-8 rounded-lg max-w-md"
          >
            <h2 className="text-2xl text-white mb-6 text-center">Customize Appearance</h2>
            
            <div className="space-y-6">
              {/* Face */}
              <div>
                <label className="block text-white mb-2">Face Type</label>
                <div className="flex flex-wrap gap-2">
                  {faces.map((face, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatar({...avatar, face: i})}
                      className={`w-12 h-12 rounded border-2 ${avatar.face === i ? 'border-blood-500' : 'border-gray-600'} hover:border-blood-400 transition-colors`}
                    >
                      {face}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair */}
              <div>
                <label className="block text-white mb-2">Hair Style</label>
                <div className="flex flex-wrap gap-2">
                  {hairs.slice(0, 8).map((hair, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatar({...avatar, hair: i})}
                      className={`w-12 h-12 rounded border-2 ${avatar.hair === i ? 'border-blood-500' : 'border-gray-600'} hover:border-blood-400 transition-colors`}
                    >
                      {hair}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <label className="block text-white mb-2">Hair Color</label>
                <div className="flex flex-wrap gap-2">
                  {hairColors.slice(0, 8).map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatar({...avatar, hairColor: color})}
                      className={`w-8 h-8 rounded border-2 ${avatar.hairColor === color ? 'border-white' : 'border-gray-600'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="block text-white mb-2">Skin Tone</label>
                <div className="flex flex-wrap gap-2">
                  {skinTones.slice(0, 5).map((tone, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatar({...avatar, skinTone: tone})}
                      className={`w-8 h-8 rounded border-2 ${avatar.skinTone === tone ? 'border-white' : 'border-gray-600'}`}
                      style={{ backgroundColor: tone }}
                    />
                  ))}
                </div>
              </div>

              {/* Eyes */}
              <div>
                <label className="block text-white mb-2">Eye Shape</label>
                <div className="flex flex-wrap gap-2">
                  {eyes.slice(0, 4).map((eye, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatar({...avatar, eyes: i})}
                      className={`w-12 h-12 rounded border-2 ${avatar.eyes === i ? 'border-blood-500' : 'border-gray-600'} hover:border-blood-400 transition-colors`}
                    >
                      {eye}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-white mb-2">Eye Color</label>
                <div className="flex flex-wrap gap-2">
                  {eyeColors.slice(0, 8).map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatar({...avatar, eyeColor: color})}
                      className={`w-8 h-8 rounded border-2 ${avatar.eyeColor === color ? 'border-white' : 'border-gray-600'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-white mb-2">Body Type</label>
                <div className="flex flex-wrap gap-2">
                  {bodyTypes.map((body, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatar({...avatar, bodyType: i})}
                      className={`w-12 h-12 rounded border-2 ${avatar.bodyType === i ? 'border-blood-500' : 'border-gray-600'} hover:border-blood-400 transition-colors`}
                    >
                      {body}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-white mb-2">Height: {Math.round(avatar.height * 100)}%</label>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={avatar.height}
                  onChange={(e) => setAvatar({...avatar, height: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 flex space-x-4"
        >
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Menu
          </button>
          <button
            onClick={handleAvatarComplete}
            className="px-6 py-3 bg-blood-600 hover:bg-blood-700 text-white rounded-lg transition-colors"
          >
            Continue to Account
          </button>
        </motion.div>
      </div>
    )
  }

  if (step === 'account') {
    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-black via-gray-900 to-blood-900 p-8">
        {/* Relantro Helper - Commented out due to missing file */}
        {/*
        <motion.div className="absolute top-4 right-4 relative">
          <motion.img
            src="/logos/relantro-helper.svg"
            alt="Relantro Helper"
            className="w-12 h-12 opacity-60 relative z-10"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          // 4D Dimensional rifts
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1 left-1 w-0.5 h-3 bg-cyan-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute top-1.5 right-0.5 w-2 h-0.5 bg-magenta-400 opacity-60"
              animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-1 left-1.5 w-0.5 h-2 bg-yellow-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
          <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
        </motion.div>
        */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-blood-500 mb-8 text-center"
        >
          CREATE ACCOUNT
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 p-8 rounded-lg max-w-md w-full"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Username (3-16 characters)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blood-500 focus:outline-none"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Display Name (optional)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 20))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blood-500 focus:outline-none"
                placeholder="How others see you"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex space-x-4"
        >
          <button
            onClick={() => setStep('avatar')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Avatar
          </button>
          <button
            onClick={handleAccountComplete}
            className="px-6 py-3 bg-blood-600 hover:bg-blood-700 text-white rounded-lg transition-colors"
          >
            Create Account
          </button>
        </motion.div>
      </div>
    )
  }

  if (step === 'friendCode') {
    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-black via-gray-900 to-blood-900 p-8">
        {/* Relantro Helper - Commented out due to missing file */}
        {/*
        <motion.div className="absolute top-4 right-4 relative">
          <motion.img
            src="/logos/relantro-helper.svg"
            alt="Relantro Helper"
            className="w-12 h-12 opacity-60 relative z-10"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          // 4D Dimensional rifts
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1 left-1 w-0.5 h-3 bg-cyan-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute top-1.5 right-0.5 w-2 h-0.5 bg-magenta-400 opacity-60"
              animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-1 left-1.5 w-0.5 h-2 bg-yellow-400 opacity-60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
          <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
        </motion.div>
        */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-blood-500 mb-8 text-center"
        >
          ACCOUNT CREATED!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 p-8 rounded-lg max-w-md w-full text-center"
        >
          <h2 className="text-2xl text-white mb-4">Welcome, {displayName || username}!</h2>
          
          <div className="bg-gray-800 p-4 rounded mb-6">
            <p className="text-gray-300 mb-2">Your Friend Code:</p>
            <p className="text-2xl font-mono text-blood-400 font-bold">{friendCode}</p>
            <p className="text-sm text-gray-400 mt-2">Share this code with friends to play together</p>
          </div>

          <div className="text-left text-gray-300 text-sm">
            <p>✅ Avatar customized</p>
            <p>✅ Account created</p>
            <p>✅ Friend code generated</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={handleFinalComplete}
            className="px-8 py-4 bg-blood-600 hover:bg-blood-700 text-white text-xl font-bold rounded-lg transition-colors"
          >
            Enter Matchmaking Lobby
          </button>
        </motion.div>
      </div>
    )
  }

  return null
}