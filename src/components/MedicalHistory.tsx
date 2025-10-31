
import React, { useState, useEffect, useCallback } from 'react'
import { lumi } from '../lib/lumi'
import { useDoctorAuth } from '../hooks/useDoctorAuth'
import {Search, Calendar, User, FileText, Pill, Clock, ArrowLeft} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface MedicalHistoryProps {
  onBack: () => void
}

interface Appointment {
  _id: string
  patientFullName: string
  phoneNumber: string
  appointmentDate: string
  doctorId: string
  status: string
  diagnosis?: string
  prescription?: string
  treatmentDays?: number
  nextAppointmentDate?: string
  createdAt: string
}

interface Doctor {
  _id: string
  doctorCode: string
  fullName: string
  specialty: string
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ onBack }) => {
  const { currentDoctor } = useDoctorAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Record<string, Doctor>>({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<string>('')

  // Obtener lista de médicos
  const fetchDoctors = useCallback(async () => {
    try {
      const { list: doctorsList } = await lumi.entities.doctors.list()
      const doctorsMap: Record<string, Doctor> = {}
      
      if (doctorsList) {
        doctorsList.forEach(doctor => {
          doctorsMap[doctor.doctorCode] = doctor
        })
      }
      
      setDoctors(doctorsMap)
    } catch (error) {
      console.error('Error cargando médicos:', error)
    }
  }, [])

  // Obtener historial de citas
  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const { list: appointmentsList } = await lumi.entities.medical_appointments.list({
        sort: { appointmentDate: -1 }
      })
      
      setAppointments(appointmentsList || [])
    } catch (error) {
      console.error('Error cargando historial:', error)
      toast.error('Error al cargar historial médico')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDoctors()
    fetchAppointments()
  }, [fetchDoctors, fetchAppointments])

  // Filtrar citas por término de búsqueda
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      appointment.patientFullName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPatient = selectedPatient === '' || 
      appointment.patientFullName === selectedPatient

    return matchesSearch && matchesPatient
  })

  // Obtener lista única de pacientes
  const uniquePatients = [...new Set(appointments.map(app => app.patientFullName))].sort()

  const handlePatientSearch = (patientName: string) => {
    setSelectedPatient(patientName)
    setSearchTerm(patientName)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
<p className="text-lg font-semibold text-gray-700">Cargando historial...</p>
</div>
  </div>
    )
  }

  return null
}