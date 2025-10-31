import React, { useState } from 'react'
import { Calendar, Phone, User, FileText, ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export interface Cita {
  id: string
  codigo_medico: string
  paciente: string
  fecha: string // solo YYYY-MM-DD
  hora: string  // solo HH:MM
  motivo: string
  estado: "programada" | "pospuesta" | "realizada"
}

// Guardar y obtener citas en localStorage
const guardarCitas = (citas: Cita[]) => {
  localStorage.setItem("citas", JSON.stringify(citas))
}

const obtenerCitas = (): Cita[] => {
  const data = localStorage.getItem("citas")
  return data ? JSON.parse(data) : []
}

interface CrearCitaProps {
  medico: { codigo_medico: string; nombre: string }
  onBack: () => void
}

const CrearCita: React.FC<CrearCitaProps> = ({ medico, onBack }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre_paciente: '',
    celular_paciente: '',
    fecha_cita: '',
    motivo_consulta: '',
    observaciones: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Separar fecha y hora
      const [fecha, hora] = formData.fecha_cita.split("T")

      const nuevaCita: Cita = {
        id: Date.now().toString(),
        codigo_medico: medico.codigo_medico,
        paciente: formData.nombre_paciente,
        fecha,
        hora,
        motivo: formData.motivo_consulta,
        estado: "programada"
      }

      const citasGuardadas = obtenerCitas()
      guardarCitas([...citasGuardadas, nuevaCita])

      toast.success("Cita médica creada exitosamente")

      setFormData({
        nombre_paciente: "",
        celular_paciente: "",
        fecha_cita: "",
        motivo_consulta: "",
        observaciones: ""
      })
    } catch (error) {
      console.error("Error al crear cita:", error)
      toast.error("Error al crear la cita médica")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Crear Nueva Cita Médica</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Nombre Completo del Paciente *
                </label>
                <input
                  type="text"
                  name="nombre_paciente"
                  value={formData.nombre_paciente}
                  onChange={handleChange}
                  placeholder="Ej: María García López"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Número de Celular *
                </label>
                <input
                  type="tel"
                  name="celular_paciente"
                  value={formData.celular_paciente}
                  onChange={handleChange}
                  placeholder="Ej: 555-1234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Fecha y Hora de la Cita *
              </label>
              <input
                type="datetime-local"
                name="fecha_cita"
                value={formData.fecha_cita}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-2" />
                Motivo de la Consulta *
              </label>
              <textarea
                name="motivo_consulta"
                value={formData.motivo_consulta}
                onChange={handleChange}
                placeholder="Describa el motivo principal de la consulta..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                {loading ? 'Guardando...' : 'Crear Cita'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CrearCita
