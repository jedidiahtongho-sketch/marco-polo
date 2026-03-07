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

  console.log('🎯 APP STATE:', gameState)
  console.log('LocalStorage check - username:', localStorage.getItem('username'))
  console.log('LocalStorage check - avatar:', localStorage.getItem('avatar'))

  // Debug state changes
  useEffect(() => {
    console.log('🔄 STATE CHANGED TO:', gameState)
  }, [gameState])

  // Load saved avatar data on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar')
    const savedUsername = localStorage.getItem('username')
    
    if (savedAvatar && savedUsername) {
      // If user has completed avatar setup before, skip to lobby
      setGameState('lobby')
    }

    // Load audio files (will warn if missing)
    try {
      audioManager.loadSound('marco', '/audio/marco.mp3', { spatial: true })
      audioManager.loadSound('polo', '/audio/polo.mp3')
      audioManager.loadSound('heartbeat', '/audio/heartbeat.mp3', { loop: true })
      audioManager.loadSound('jumpscare', '/audio/jumpscare.mp3')
      audioManager.loadSound('whispers', '/audio/whispers.mp3', { loop: true, volume: 0.2 })
      audioManager.loadSound('distant_screams', '/audio/distant_screams.mp3', { loop: true, volume: 0.1 })
      audioManager.loadSound('breathing', '/audio/breathing.mp3', { loop: true, volume: 0.3 })
      console.log('Audio files loaded (or attempted to load)')
    } catch (error) {
      console.error('Failed to load audio files:', error)
    }
  }, [])

  const handleStartGame = () => {
    console.log('🚀 STARTING GAME - Current state:', gameState)
    console.log('🚀 STARTING GAME - Setting state to lobby')
    setGameState('lobby')
    console.log('🚀 STARTING GAME - State should now be lobby')
  }

  const handleAvatarComplete = () => {
    setGameState('lobby')
  }

  const handleLobbyComplete = () => {
    console.log('🎯 LOBBY COMPLETE - Setting state to loading')
    setGameState('loading')
    
    // Simulate loading time
    console.log('⏰ Starting 3 second loading timer...')
    setTimeout(() => {
      console.log('✅ Loading complete - Setting state to playing')
      setGameState('playing')
    }, 3000)
  }

  const handleBackToMenu = () => {
    setGameState('menu')
  }

  const handleBackToAvatar = () => {

    setGameState('lobby')
  }

  const handleMatchmakingComplete = () => {
    console.log('🎯 MATCHMAKING COMPLETE - Setting state to loading')
    setGameState('loading')
    
    // Simulate loading time
    console.log('⏰ Starting 3 second loading timer...')
    setTimeout(() => {
      console.log('✅ Loading complete - Setting state to playing')
      setGameState('playing')
    }, 3000)
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