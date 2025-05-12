
// import './index.css'
import App from "./assets/app.tsx"

// render(<App />, document.getElementById('app')!)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
