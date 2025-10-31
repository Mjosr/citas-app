import React, { useState, useEffect } from 'react'
import { UserPlus, KeyRound, Trash2, Stethoscope, Save, Edit2 } from 'lucide-react'

interface Medico {
  codigo: string
  nombre: string
  especialidad: string
  password: string
}

interface Cita {
  id: string
  codigo_medico: string
  paciente: string
  fecha: string
  hora: string
  motivo: string
  estado: "programada" | "pospuesta" | "realizada"
}

interface AdminPanelProps {
  onLogout: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [nuevoMedico, setNuevoMedico] = useState<Medico>({
    codigo: '',
    nombre: '',
    especialidad: '',
    password: ''
  })
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('medicos')
    if (data) setMedicos(JSON.parse(data))

    const citasData = localStorage.getItem('citas')
    if (citasData) setCitas(JSON.parse(citasData))
  }, [])

  const guardarMedicos = (data: Medico[]) => {
    setMedicos(data)
    localStorage.setItem('medicos', JSON.stringify(data))
  }

  const agregarMedico = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoMedico.codigo || !nuevoMedico.nombre || !nuevoMedico.password) {
      alert('Por favor, complete todos los campos obligatorios.')
      return
    }

    const existe = medicos.find(m => m.codigo === nuevoMedico.codigo)
    if (existe) {
      alert('Ya existe un médico con ese código.')
      return
    }

    const actualizados = [...medicos, nuevoMedico]
    guardarMedicos(actualizados)
    alert('✅ Médico registrado con éxito.')
    setNuevoMedico({ codigo: '', nombre: '', especialidad: '', password: '' })
  }

  const eliminarMedico = (codigo: string) => {
    if (confirm('¿Seguro que deseas eliminar este médico?')) {
      const actualizados = medicos.filter(m => m.codigo !== codigo)
      guardarMedicos(actualizados)
    }
  }

  const resetPassword = (codigo: string) => {
    const nuevaPass = prompt('Ingrese la nueva contraseña:')
    if (!nuevaPass) return
    const actualizados = medicos.map(m =>
      m.codigo === codigo ? { ...m, password: nuevaPass } : m
    )
    guardarMedicos(actualizados)
    alert('Contraseña actualizada correctamente.')
  }

  // -----------------------
  // Manejo de citas
  // -----------------------
  const handleActualizarCita = (citaActualizada: Cita) => {
    const nuevasCitas = citas.map(c =>
      c.id === citaActualizada.id ? citaActualizada : c
    )
    setCitas(nuevasCitas)
    localStorage.setItem('citas', JSON.stringify(nuevasCitas))
    alert('Cita actualizada correctamente')
  }

  const eliminarCita = (id: string) => {
    if (!confirm('¿Deseas eliminar esta cita?')) return
    const nuevasCitas = citas.filter(c => c.id !== id)
    setCitas(nuevasCitas)
    localStorage.setItem('citas', JSON.stringify(nuevasCitas))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-full">
            <Stethoscope className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Formulario para registrar médicos */}
      <section className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <UserPlus className="text-blue-600 mr-2" /> Registrar nuevo médico
        </h2>

        <form
          onSubmit={agregarMedico}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código del médico
            </label>
            <input
              type="text"
              value={nuevoMedico.codigo}
              onChange={e => setNuevoMedico({ ...nuevoMedico, codigo: e.target.value })}
              placeholder="Ej: MED001"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo del médico
            </label>
            <input
              type="text"
              value={nuevoMedico.nombre}
              onChange={e => setNuevoMedico({ ...nuevoMedico, nombre: e.target.value })}
              placeholder="Ej: Médico Carlos López"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad médica
            </label>
            <input
              type="text"
              value={nuevoMedico.especialidad}
              onChange={e => setNuevoMedico({ ...nuevoMedico, especialidad: e.target.value })}
              placeholder="Ej: Pediatría"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={nuevoMedico.password}
              onChange={e => setNuevoMedico({ ...nuevoMedico, password: e.target.value })}
              placeholder="********"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="col-span-full text-right mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Registrar Médico
            </button>
          </div>
        </form>
      </section>

      {/* Tabla de médicos */}
      <section className="bg-white shadow-lg rounded-xl p-6 max-w-5xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Stethoscope className="text-green-600 mr-2" /> Médicos Registrados
        </h2>

        {medicos.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No hay médicos registrados.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Código</th>
                <th className="border px-3 py-2 text-left">Nombre</th>
                <th className="border px-3 py-2 text-left">Especialidad</th>
                <th className="border px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map(m => (
                <tr key={m.codigo}>
                  <td className="border px-3 py-2">{m.codigo}</td>
                  <td className="border px-3 py-2">{m.nombre}</td>
                  <td className="border px-3 py-2">{m.especialidad}</td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <button
                      onClick={() => resetPassword(m.codigo)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg inline-flex items-center"
                    >
                      <KeyRound size={16} className="mr-1" /> Cambiar contraseña
                    </button>
                    <button
                      onClick={() => eliminarMedico(m.codigo)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg inline-flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Eliminar médico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Tabla de citas */}
      <section className="bg-white shadow-lg rounded-xl p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Stethoscope className="text-purple-600 mr-2" /> Citas Registradas
        </h2>

        {citas.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No hay citas registradas.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Paciente</th>
                <th className="border px-3 py-2 text-left">Fecha</th>
                <th className="border px-3 py-2 text-left">Motivo</th>
                <th className="border px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(c => (
                <tr key={c.id}>
                  <td className="border px-3 py-2">{c.paciente}</td>
                  <td className="border px-3 py-2">{c.fecha}</td>
                  <td className="border px-3 py-2">{c.motivo}</td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <button
                      onClick={() => setCitaEditando(c)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg inline-flex items-center"
                    >
                      <Edit2 size={16} className="mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => eliminarCita(c.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg inline-flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Modal de edición de cita */}
      {citaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Editar Cita</h2>
            <input
              type="text"
              value={citaEditando.paciente}
              onChange={e => setCitaEditando({ ...citaEditando, paciente: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="datetime-local"
              value={citaEditando.fecha}
              onChange={e => setCitaEditando({ ...citaEditando, fecha: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              value={citaEditando.motivo}
              onChange={e => setCitaEditando({ ...citaEditando, motivo: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setCitaEditando(null)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (citaEditando) handleActualizarCita(citaEditando)
                  setCitaEditando(null)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded inline-flex items-center"
              >
                <Save size={16} className="mr-1" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
