import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useMedicalAuth } from './hooks/useMedicalAuth'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import CrearCita from './components/CrearCita'
import RecetasMedicas from './components/RecetasMedicas'
import HistorialMedico from './components/HistorialMedico'

// Nuevos imports 👇
import LoginAdmin from './components/LoginAdmin'
import PanelAdmin from './components/AdminPanel'

function App() {
  // --- AUTENTICACIÓN MÉDICO EXISTENTE ---
  const { currentMedico, isAuthenticated, loading, login, logout } = useMedicalAuth()
  const [currentSection, setCurrentSection] = useState<string>('dashboard')

  // --- NUEVO: ESTADO DEL ADMIN ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  // --- LOGIN ADMINISTRADOR ---
  const handleLoginAdmin = async (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdminAuthenticated(true)
      return true
    } else {
      alert('Credenciales de administrador incorrectas')
      return false
    }
  }

  // --- LOGOUT ADMIN ---
  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false)
  }

  const handleNavigate = (section: string) => {
    setCurrentSection(section)
  }

  const handleBack = () => {
    setCurrentSection('dashboard')
  }

  // --- SI ADMIN ESTÁ LOGUEADO ---
  if (isAdminAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <PanelAdmin onLogout={handleLogoutAdmin} />
      </>
    )
  }

  // --- SI MÉDICO ESTÁ LOGUEADO ---
  if (isAuthenticated) {
    const renderCurrentSection = () => {
      if (!currentMedico) return null

      switch (currentSection) {
        case 'crear-cita':
          return <CrearCita medico={currentMedico} onBack={handleBack} />
        case 'recetas':
          return <RecetasMedicas medico={currentMedico} onBack={handleBack} />
        case 'historial':
          return <HistorialMedico medico={currentMedico} onBack={handleBack} />
        default:
          return (
            <Dashboard
              medico={currentMedico}
              onLogout={logout}
              onNavigate={handleNavigate}
            />
          )
      }
    }

    return (
      <>
        <Toaster position="top-right" />
        {renderCurrentSection()}
      </>
    )
  }

  // --- SI NADIE ESTÁ LOGUEADO (PANTALLA DE ELECCIÓN) ---
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
        <h1 className="text-2xl font-bold mb-6 text-white-800">
          Ingreso al Sistema Médico
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          {/* Login de administrador */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <LoginAdmin onLogin={handleLoginAdmin} loading={false} />
          </div>

          {/* Login de médico */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <LoginForm onLogin={login} loading={loading} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App