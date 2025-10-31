
import React, { useState } from 'react'
import { useDoctorAuth } from '../hooks/useDoctorAuth'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'
import {Calendar, Phone, User, Save, ArrowLeft} from 'lucide-react'

interface CreateAppointmentProps {
  onBack: () => void
}

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ onBack }) => {
  const { currentDoctor } = useDoctorAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientFullName: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentDoctor) return

    setLoading(true)
    try {
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}:00`)
      
      await lumi.entities.medical_appointments.create({
        patientFullName: formData.patientFullName,
        phoneNumber: formData.phoneNumber,
        appointmentDate: appointmentDateTime.toISOString(),
        doctorId: currentDoctor.doctorCode,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast.success('Cita médica creada exitosamente')
      setFormData({
        patientFullName: '',
        phoneNumber: '',
        appointmentDate: '',
        appointmentTime: ''
      })
    } catch (error) {
      console.error('Error creando cita:', error)
      toast.error('Error al crear la cita')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Nueva Cita Médica</h1>
              <p className="text-gray-600">Registrar información del paciente</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo del Paciente
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="patientFullName"
                  value={formData.patientFullName}
                  onChange={handleInputChange}
                  placeholder="Nombre completo del paciente"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+52 55 1234 5678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de la Cita
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de la Cita
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Médico asignado:</strong> {currentDoctor?.fullName} ({currentDoctor?.specialty})
              </p>
            </div>

            <div className="flex gap-4">
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
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Guardando...' : 'Crear Cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAppointment
