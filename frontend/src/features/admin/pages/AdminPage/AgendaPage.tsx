import AgendaModule from '@/modules/agenda/AgendaModule'
import { students } from '@/data/students'

export default function AgendaPage() {
  return <AgendaModule students={students} />
}
