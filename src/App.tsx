import { useState, useEffect } from 'react'
import MainMenu from './components/UI/MainMenu'
import AvatarSelection from './components/UI/AvatarSelection'
import Lobby from './components/UI/Lobby'
import LoadingScreen from './components/UI/LoadingScreen'
import Game from './components/Game/Game'
import MatchmakingLobby from './components/UI/MatchmakingLobby'
import { audioManager } from './audio/AudioManager'
import './styles/App.css'

type GameState = 'menu' | 'avatar' | 'lobby' | 'matchmaking' | 'loading' | 'playing'

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')

  console.log('🎮 App component rendering, gameState:', gameState)

  // Load saved avatar data and audio on mount
  useEffect(() => {
    console.log('🔄 App useEffect running...')
    const savedAvatar = localStorage.getItem('avatar')
    const savedUsername = localStorage.getItem('username')

    if (savedAvatar && savedUsername) {
      setGameState('lobby')
    }

    loadAudioFiles()
  }, [])

  const loadAudioFiles = () => {
    // Commented out audio loading due to missing files
    /*
    const audioFiles = [
      { name: 'marco', path: '/audio/marco.mp3', options: { spatial: true } },
      { name: 'polo', path: '/audio/polo.mp3' },
      { name: 'heartbeat', path: '/audio/heartbeat.mp3', options: { loop: true } },
      { name: 'jumpscare', path: '/audio/jumpscare.mp3' },
      { name: 'whispers', path: '/audio/whispers.mp3', options: { loop: true, volume: 0.2 } },
      { name: 'distant_screams', path: '/audio/distant_screams.mp3', options: { loop: true, volume: 0.1 } },
      { name: 'breathing', path: '/audio/breathing.mp3', options: { loop: true, volume: 0.3 } }
    ]

    audioFiles.forEach(({ name, path, options = {} }) => {
      try {
        audioManager.loadSound(name, path, options)
      } catch (error) {
        console.warn(`Failed to load audio file: ${name}`, error)
      }
    })
    */
    console.log('Audio loading commented out - files not available')
  }

  const handleStartGame = () => {
    setGameState('lobby')
  }

  const handleAvatarComplete = () => {
    setGameState('lobby')
  }

  const startGameWithLoading = () => {
    setGameState('loading')
    setTimeout(() => setGameState('playing'), 3000)
  }

  const handleLobbyComplete = () => {
    startGameWithLoading()
  }

  const handleBackToMenu = () => {
    setGameState('menu')
  }

  const handleBackToAvatar = () => {
    setGameState('lobby')
  }

  const handleMatchmakingComplete = () => {
    startGameWithLoading()
  }

  return (
    <div className="App">
      {gameState === 'menu' && (
        <MainMenu onStart={handleStartGame} />
      )}
      
      {gameState === 'avatar' && (
        <AvatarSelection 
          onComplete={handleAvatarComplete} 
          onBack={handleBackToMenu} 
        />
      )}
      
      {gameState === 'lobby' && (
        <Lobby 
          onStartGame={handleLobbyComplete} 
          onBack={handleBackToAvatar} 
        />
      )}
      
      {gameState === 'matchmaking' && (
        <MatchmakingLobby 
          onStartGame={handleMatchmakingComplete} 
          onBackToMenu={handleBackToMenu} 
        />
      )}
      
      {gameState === 'loading' && (
        <LoadingScreen onSkip={() => {
          console.log('⏭️ Loading skipped by user click')
          setGameState('playing')
        }} />
      )}
      
      {gameState === 'playing' && (
        <Game onGameOver={handleBackToMenu} onGameComplete={handleBackToMenu} />
      )}
    </div>
  )
}

export default App