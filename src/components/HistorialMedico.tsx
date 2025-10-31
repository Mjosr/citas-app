import React, { useState, useEffect } from 'react'
import { Cita } from './CrearCita' // Importa la interfaz
import { Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface HistorialMedicoProps {
  medico?: { codigo_medico: string; nombre: string }
  onBack: () => void
  puedeBorrar?: boolean // Admin puede borrar
  onActualizarCita?: (citaActualizada: Cita) => void
}

const HistorialMedico: React.FC<HistorialMedicoProps> = ({ medico, onBack, puedeBorrar, onActualizarCita }) => {
  const [citas, setCitas] = useState<Cita[]>([])
  const [busqueda, setBusqueda] = useState('')

  // Obtener todas las citas de localStorage
  const cargarCitas = () => {
    const data: Cita[] = JSON.parse(localStorage.getItem('citas') || '[]')
    setCitas(data)
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  const handleBuscar = () => {
    const data: Cita[] = JSON.parse(localStorage.getItem('citas') || '[]')
    const resultado = data.filter(c =>
      c.paciente.toLowerCase().includes(busqueda.toLowerCase())
    )
    setCitas(resultado)
    if (resultado.length === 0) {
      toast.error('No se encontró historial para este paciente')
    }
  }

  const handleEliminar = (id: string) => {
    const filtradas = citas.filter(c => c.id !== id)
    localStorage.setItem('citas', JSON.stringify(filtradas))
    setCitas(filtradas)
    toast.success('Cita eliminada correctamente')
  }

  const handlePosponer = (cita: Cita) => {
    const nuevaFecha = prompt('Ingrese nueva fecha y hora (YYYY-MM-DDTHH:MM)', `${cita.fecha}T${cita.hora}`)
    if (!nuevaFecha) return

    const [fecha, hora] = nuevaFecha.split('T')
    const actualizada: Cita = { ...cita, fecha, hora }
    const todasCitas = JSON.parse(localStorage.getItem('citas') || '[]') as Cita[]
    const updatedCitas = todasCitas.map(c => c.id === cita.id ? actualizada : c)
    localStorage.setItem('citas', JSON.stringify(updatedCitas))
    setCitas(updatedCitas)
    toast.success('Cita pospuesta correctamente')

    // Llamar callback si existe
    if (onActualizarCita) onActualizarCita(actualizada)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={onBack} className="mb-6 text-blue-600 hover:underline">&larr; Volver</button>

      <h1 className="text-2xl font-bold mb-4">Historial de Citas Médicas</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por paciente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
        <button onClick={handleBuscar} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Buscar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        {citas.length === 0 ? (
          <p>No hay citas registradas</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Paciente</th>
                <th className="border px-4 py-2 text-left">Fecha</th>
                <th className="border px-4 py-2 text-left">Hora</th>
                <th className="border px-4 py-2 text-left">Motivo</th>
                <th className="border px-4 py-2 text-left">Estado</th>
                <th className="border px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(cita => (
                <tr key={cita.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{cita.paciente}</td>
                  <td className="border px-4 py-2">{cita.fecha}</td>
                  <td className="border px-4 py-2">{cita.hora}</td>
                  <td className="border px-4 py-2">{cita.motivo}</td>
                  <td className="border px-4 py-2 capitalize">{cita.estado}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    {medico && (
                      <button
                        onClick={() => handlePosponer(cita)}
                        className="text-yellow-500 hover:text-yellow-700 flex items-center gap-1"
                      >
                        <Edit2 size={16} /> Posponer
                      </button>
                    )}
                    {puedeBorrar && (
                      <button
                        onClick={() => handleEliminar(cita.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default HistorialMedico
