import { Outlet, useNavigate, useLocation } from 'react-router'
import GymFloatingToolbar from './components/GymFloatingToolbar'

const REVERSE_TAB_MAP: Record<string, string> = {
  students: 'usuarios',
  equipment: 'equipamiento',
  schedule: 'agenda',
}

export default function GestionLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentTab = location.pathname.includes('/equipamiento') ? 'equipment'
    : location.pathname.includes('/agenda') ? 'schedule'
    : 'students'

  const handleTabChange = (tab: 'students' | 'equipment' | 'schedule') => {
    if (tab === 'equipment') navigate('/admin/gestion/equipamiento/maquinas')
    else navigate(`/admin/gestion/${REVERSE_TAB_MAP[tab]}`)
  }

  return (
    <>
      <div className="size-full">
        <Outlet />
      </div>
      <GymFloatingToolbar tab={currentTab} onTabChange={handleTabChange} />
    </>
  )
}
