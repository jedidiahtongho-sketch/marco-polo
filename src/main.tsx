import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

console.log('🚀 Starting Marco\'s Curse...')
console.log('📦 Loading React app...')

const rootElement = document.getElementById('root')
console.log('🎯 Root element:', rootElement)

if (!rootElement) {
  console.error('❌ Root element not found!')
} else {
  console.log('✅ Root element found, creating React root...')
  const root = ReactDOM.createRoot(rootElement)
  console.log('✅ React root created, rendering app...')

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

  console.log('✅ App rendered successfully!')
}