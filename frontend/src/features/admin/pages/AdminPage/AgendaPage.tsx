import { useEffect, useState } from 'react'
import AgendaModule from '@/modules/agenda/AgendaModule'
import { getUsuarios } from '@/services/usuario.service'

interface StudentOption {
  name: string
  id_usuario: string
  carnetId?: string
  program?: string
  faculty?: string
  avatar?: string
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export default function AgendaPage() {
  const [students, setStudents] = useState<StudentOption[]>([])

  useEffect(() => {
    getUsuarios()
      .then(lista => {
        const estudiantes = lista
          .filter(u => u.tipo_usuario === 'estudiante' || u.rol === 'usuario')
          .map(u => {
            const name = `${u.primer_nombre} ${u.primer_apellido}`.trim()
            return {
              name,
              id_usuario: u.id_usuario,
              program: u.estudiante?.programa?.nombre_programa ?? undefined,
              avatar: initials(name),
            }
          })
        setStudents(estudiantes)
      })
      .catch(() => setStudents([]))
  }, [])

  return <AgendaModule students={students} />
}
