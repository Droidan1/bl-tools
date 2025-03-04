
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Using createRoot API for React 18
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
