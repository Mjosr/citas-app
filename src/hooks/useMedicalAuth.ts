
import { useState, useCallback } from 'react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface Medico {
  _id: string
  codigo_medico: string
  nombre: string
  especialidad: string
  password: string
  activo: boolean
}

export const useMedicalAuth = () => {
  const [currentMedico, setCurrentMedico] = useState<Medico | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (codigoMedico: string, password: string) => {
    setLoading(true)
    try {
      const { list: medicos } = await lumi.entities.medicos.list({
        filter: {
          codigo_medico: codigoMedico,
          password: password,
          activo: true
        }
      })

      if (medicos && medicos.length > 0) {
        const medico = medicos[0]
        setCurrentMedico(medico)
        setIsAuthenticated(true)
        toast.success(`Bienvenido, ${medico.nombre}`)
        return true
      } else {
        toast.error('Código de médico o contraseña incorrectos')
        return false
      }
    } catch (error) {
      console.error('Error en login:', error)
      toast.error('Error al iniciar sesión')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentMedico(null)
    setIsAuthenticated(false)
    toast.success('Sesión cerrada correctamente')
  }, [])

  return {
    currentMedico,
    isAuthenticated,
    loading,
    login,
    logout
  }
}
