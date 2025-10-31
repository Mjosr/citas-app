
import React, { useState, useEffect } from 'react'
import {FileText, Plus, ArrowLeft, Save, Calendar, Pill} from 'lucide-react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface RecetasMedicasProps {
  medico: {
    codigo_medico: string
    nombre: string
  }
  onBack: () => void
}

interface Cita {
  _id: string
  nombre_paciente: string
  celular_paciente: string
  fecha_cita: string
  motivo_consulta: string
  estado: string
}

interface Medicamento {
  nombre: string
  dosis: string
  frecuencia: string
  instrucciones: string
}

const RecetasMedicas: React.FC<RecetasMedicasProps> = ({ medico, onBack }) => {
  const [citas, setCitas] = useState<Cita[]>([])
  const [citaSeleccionada, setCitaSeleccionada] = useState<string>('')
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([
    { nombre: '', dosis: '', frecuencia: '', instrucciones: '' }
  ])
  const [diasTratamiento, setDiasTratamiento] = useState<number>(7)
  const [fechaProximaCita, setFechaProximaCita] = useState<string>('')
  const [instruccionesGenerales, setInstruccionesGenerales] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCitas()
  }, [])

  const fetchCitas = async () => {
    try {
      const { list } = await lumi.entities.citas_medicas.list({
        filter: { codigo_medico: medico.codigo_medico },
        sort: { fecha_cita: -1 }
      })
      setCitas(list || [])
    } catch (error) {
      console.error('Error al cargar citas:', error)
      toast.error('Error al cargar las citas')
    }
  }

  const agregarMedicamento = () => {
    setMedicamentos([
      ...medicamentos,
      { nombre: '', dosis: '', frecuencia: '', instrucciones: '' }
    ])
  }

  const actualizarMedicamento = (index: number, campo: keyof Medicamento, valor: string) => {
    const nuevos = [...medicamentos]
    nuevos[index][campo] = valor
    setMedicamentos(nuevos)
  }

  const eliminarMedicamento = (index: number) => {
    if (medicamentos.length > 1) {
      setMedicamentos(medicamentos.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!citaSeleccionada) {
      toast.error('Seleccione una cita para crear la receta')
      return
    }

    const medicamentosValidos = medicamentos.filter(m => 
      m.nombre.trim() && m.dosis.trim() && m.frecuencia.trim()
    )

    if (medicamentosValidos.length === 0) {
      toast.error('Agregue al menos un medicamento válido')
      return
    }

    setLoading(true)

    try {
      const recetaData = {
        cita_id: citaSeleccionada,
        codigo_medico: medico.codigo_medico,
        medicamentos: medicamentosValidos,
        dias_tratamiento: diasTratamiento,
        fecha_proxima_cita: fechaProximaCita ? new Date(fechaProximaCita).toISOString() : '',
        instrucciones_generales: instruccionesGenerales,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await lumi.entities.recetas_medicas.create(recetaData)
      
      // Crear entrada en historial médico
      const citaInfo = citas.find(c => c._id === citaSeleccionada)
      if (citaInfo) {
        const historialData = {
          nombre_paciente: citaInfo.nombre_paciente,
          celular_paciente: citaInfo.celular_paciente,
          fecha_visita: citaInfo.fecha_cita,
          codigo_medico: medico.codigo_medico,
          diagnostico: citaInfo.motivo_consulta,
          tratamiento_recetado: medicamentosValidos.map(m => 
            `${m.nombre} ${m.dosis} - ${m.frecuencia}`
          ).join(', '),
          cita_id: citaSeleccionada,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        await lumi.entities.historial_medico.create(historialData)
      }

      toast.success('Receta médica creada exitosamente')
      
      // Limpiar formulario
      setCitaSeleccionada('')
      setMedicamentos([{ nombre: '', dosis: '', frecuencia: '', instrucciones: '' }])
      setDiasTratamiento(7)
      setFechaProximaCita('')
      setInstruccionesGenerales('')
      
    } catch (error) {
      console.error('Error al crear receta:', error)
      toast.error('Error al crear la receta médica')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <h1 className="text-xl font-semibold text-gray-900">Recetas Médicas</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Nueva Receta Médica</h2>
                <p className="text-gray-600"> {medico.nombre}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Seleccionar Cita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Seleccionar Cita *
              </label>
              <select
                value={citaSeleccionada}
                onChange={(e) => setCitaSeleccionada(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione una cita...</option>
                {citas.map((cita) => (
                  <option key={cita._id} value={cita._id}>
                    {cita.nombre_paciente} - {new Date(cita.fecha_cita).toLocaleDateString()} - {cita.motivo_consulta}
                  </option>
                ))}
              </select>
            </div>

            {/* Medicamentos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  <Pill size={16} className="inline mr-2" />
                  Medicamentos *
                </label>
                <button
                  type="button"
                  onClick={agregarMedicamento}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <Plus size={16} className="mr-1" />
                  Agregar Medicamento
                </button>
              </div>

              {medicamentos.map((medicamento, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Nombre del medicamento"
                        value={medicamento.nombre}
                        onChange={(e) => actualizarMedicamento(index, 'nombre', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Dosis (ej: 500mg)"
                        value={medicamento.dosis}
                        onChange={(e) => actualizarMedicamento(index, 'dosis', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Frecuencia (ej: Cada 8 horas)"
                        value={medicamento.frecuencia}
                        onChange={(e) => actualizarMedicamento(index, 'frecuencia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Instrucciones especiales"
                        value={medicamento.instrucciones}
                        onChange={(e) => actualizarMedicamento(index, 'instrucciones', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {medicamentos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarMedicamento(index)}
                          className="ml-2 px-3 py-2 text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Duración del Tratamiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de Tratamiento *
                </label>
                <input
                  type="number"
                  min="1"
                  value={diasTratamiento}
                  onChange={(e) => setDiasTratamiento(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Próxima Cita (opcional)
                </label>
                <input
                  type="datetime-local"
                  value={fechaProximaCita}
                  onChange={(e) => setFechaProximaCita(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Instrucciones Generales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones Generales
              </label>
              <textarea
                value={instruccionesGenerales}
                onChange={(e) => setInstruccionesGenerales(e.target.value)}
                placeholder="Instrucciones adicionales para el tratamiento..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Botones */}
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
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                {loading ? 'Guardando...' : 'Crear Receta'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default RecetasMedicas