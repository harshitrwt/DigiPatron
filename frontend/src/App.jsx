import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import TreePage from './pages/TreePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VaultPage from './pages/VaultPage'
import LightRays from './components/LightRays'

const WORKFLOW_STORAGE_KEY = 'digiwarden.workflow'

function loadStoredWorkflow() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(WORKFLOW_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  const [page, setPage] = useState('landing')
  const [workflow, setWorkflow] = useState(loadStoredWorkflow)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (workflow) {
        window.sessionStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(workflow))
      } else {
        window.sessionStorage.removeItem(WORKFLOW_STORAGE_KEY)
      }
    } catch {}
  }, [workflow])

  const navigate = (nextPage, nextWorkflow) => {
    if (nextWorkflow) setWorkflow(nextWorkflow)
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflowX: 'hidden' }}>
      {/* Cinematic Light Rays */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '80vh', 
        zIndex: 1, 
        pointerEvents: 'none',
        opacity: 0.6 
      }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ec9766"
          raysSpeed={1.2}
          lightSpread={0.8}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.05}
          noiseAmount={0.1}
          distortion={0.05}
          pulsating
          fadeDistance={1.2}
          saturation={0.9}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
        <Navbar page={page} navigate={navigate} hasAsset={Boolean(workflow?.analysis?.image_id)} />
        <main>
          {page === 'landing' && <LandingPage navigate={navigate} />}
          {page === 'upload' && <UploadPage navigate={navigate} workflow={workflow} />}
          {page === 'dashboard' && <DashboardPage workflow={workflow} navigate={navigate} />}
          {page === 'tree' && <TreePage workflow={workflow} navigate={navigate} />}
          {page === 'login' && <LoginPage navigate={navigate} />}
          {page === 'register' && <RegisterPage navigate={navigate} />}
          {page === 'vault' && <VaultPage navigate={navigate} />}
        </main>
      </div>
    </div>
  )
}
