
import React, { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'
import {ArrowLeft, Save, FileText, Calendar, Pill} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface MedicalPrescriptionProps {
  appointmentId: string
  onBack: () => void
}

interface Appointment {
  _id: string
  patientFullName: string
  appointmentDate: string
  status: string
}

const MedicalPrescription: React.FC<MedicalPrescriptionProps> = ({ appointmentId, onBack }) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    diagnosis: '',
    prescription: '',
    treatmentDays: '',
    nextAppointmentDate: '',
    nextAppointmentTime: ''
  })

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointmentData = await lumi.entities.medical_appointments.get(appointmentId)
        setAppointment(appointmentData)
        
        // Pre-llenar campos si ya existen
        if (appointmentData.diagnosis) {
          setFormData({
            diagnosis: appointmentData.diagnosis || '',
            prescription: appointmentData.prescription || '',
            treatmentDays: appointmentData.treatmentDays?.toString() || '',
            nextAppointmentDate: appointmentData.nextAppointmentDate ? 
              new Date(appointmentData.nextAppointmentDate).toISOString().split('T')[0] : '',
            nextAppointmentTime: appointmentData.nextAppointmentDate ? 
              new Date(appointmentData.nextAppointmentDate).toTimeString().slice(0, 5) : ''
          })
        }
      } catch (error) {
        console.error('Error cargando cita:', error)
        toast.error('Error al cargar información de la cita')
      }
    }

    fetchAppointment()
  }, [appointmentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updates: any = {
        diagnosis: formData.diagnosis,
        prescription: formData.prescription,
        treatmentDays: formData.treatmentDays ? parseInt(formData.treatmentDays) : undefined,
        status: 'completed',
        updatedAt: new Date().toISOString()
      }

      if (formData.nextAppointmentDate && formData.nextAppointmentTime) {
        const nextAppointmentDateTime = new Date(`${formData.nextAppointmentDate}T${formData.nextAppointmentTime}:00`)
        updates.nextAppointmentDate = nextAppointmentDateTime.toISOString()
      }

      await lumi.entities.medical_appointments.update(appointmentId, updates)
      toast.success('Receta médica guardada exitosamente')
      onBack()
    } catch (error) {
      console.error('Error guardando receta:', error)
      toast.error('Error al guardar la receta médica')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!appointment) {
    return <div className="p-4">Cargando información de la cita...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Receta Médica</h1>
              <p className="text-gray-600">Agregar diagnóstico y prescripción</p>
            </div>
          </div>

          {/* Información del Paciente */}
          <div className="bg-blue-50 p-6 rounded-xl mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Información del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Paciente:</strong> {appointment.patientFullName}</p>
              <p><strong>Fecha de Cita:</strong> {format(new Date(appointment.appointmentDate), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnóstico
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Describa el diagnóstico médico..."
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prescripción Médica
              </label>
              <div className="relative">
                <Pill className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleInputChange}
                  placeholder="Medicamentos, dosis, frecuencia e instrucciones especiales..."
                  rows={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de Tratamiento
              </label>
              <input
                type="number"
                name="treatmentDays"
                value={formData.treatmentDays}
                onChange={handleInputChange}
                placeholder="Número de días"
                min="1"
                max="365"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Próxima Cita (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Regreso
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="nextAppointmentDate"
                      value={formData.nextAppointmentDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Regreso
                  </label>
                  <input
                    type="time"
                    name="nextAppointmentTime"
                    value={formData.nextAppointmentTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Guardando...' : 'Guardar Receta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MedicalPrescription
