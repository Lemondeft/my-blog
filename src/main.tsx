import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './page.tsx'
import Whoami from './blog/whoami.tsx'
import Linux from './blog/linux.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/whoami" element={<Whoami />} />
        <Route path="/blog/linux" element={<Linux />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)