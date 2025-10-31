
import { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface Doctor {
  _id: string
  doctorCode: string
  fullName: string
  specialty: string
  isActive: boolean
}

export const useDoctorAuth = () => {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar si hay una sesión activa
    const savedDoctor = localStorage.getItem('currentDoctor')
    if (savedDoctor) {
      setCurrentDoctor(JSON.parse(savedDoctor))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (doctorCode: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      const { list: doctors } = await lumi.entities.doctors.list({
        filter: { 
          doctorCode: doctorCode,
          password: password,
          isActive: true
        }
      })

      if (doctors && doctors.length > 0) {
        const doctor = doctors[0]
        setCurrentDoctor(doctor)
        setIsAuthenticated(true)
        localStorage.setItem('currentDoctor', JSON.stringify(doctor))
        toast.success(`Bienvenido, ${doctor.fullName}`)
        return true
      } else {
        toast.error('Código o contraseña incorrectos')
        return false
      }
    } catch (error) {
      console.error('Error en login:', error)
      toast.error('Error al iniciar sesión')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setCurrentDoctor(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentDoctor')
    toast.success('Sesión cerrada')
  }

  return {
    currentDoctor,
    isAuthenticated,
    loading,
    login,
    logout
  }
}
