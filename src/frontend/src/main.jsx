import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './containers/Home/home'
import './containers/style/style.css'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
