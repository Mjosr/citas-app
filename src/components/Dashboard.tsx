
import React from 'react'
import {Calendar, FileText, History, LogOut, User} from 'lucide-react'

interface DashboardProps {
  medico: {
    nombre: string
    especialidad: string
    codigo_medico: string
  }
  onLogout: () => void
  onNavigate: (section: string) => void
}

const Dashboard: React.FC<DashboardProps> = ({ medico, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">Sistema Médico</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{medico.nombre}</p>
                <p className="text-xs text-gray-500">{medico.especialidad} - {medico.codigo_medico}</p>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {medico.nombre.split(' ').slice(1).join(' ')}
          </h2>
          <p className="text-gray-600">Seleccione una opción para continuar</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Crear Cita */}
          <div 
            onClick={() => onNavigate('crear-cita')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Crear Cita Médica</h3>
            <p className="text-gray-600 mb-4">
              Registrar una nueva cita con datos del paciente y motivo de consulta
            </p>
            <div className="text-blue-600 font-medium">Crear nueva cita →</div>
          </div>

          {/* Recetas Médicas */}
          <div 
            onClick={() => onNavigate('recetas')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 hover:border-green-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FileText className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Recetas Médicas</h3>
            <p className="text-gray-600 mb-4">
              Crear recetas con medicamentos, dosificación y duración del tratamiento
            </p>
            <div className="text-green-600 font-medium">Gestionar recetas →</div>
          </div>

          {/* Historial Médico */}
          <div 
            onClick={() => onNavigate('historial')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 hover:border-purple-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <History className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Historial Médico</h3>
            <p className="text-gray-600 mb-4">
              Consultar historial completo de pacientes por nombre
            </p>
            <div className="text-purple-600 font-medium">Ver historial →</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center py-8">
              <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">
                Seleccione una opción del menú para comenzar a gestionar citas médicas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard