import EquipmentModule from '../modules/equipment/EquipmentModule'
import type { Status } from '../data/types'

interface Props {
  search: string
  searchFocused: boolean
  statusFilter: Status | 'all'
  showBlur: boolean
  viewMode: 'machines' | 'exercises'
  onViewModeChange: (v: 'machines' | 'exercises') => void
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
  onStatusFilterChange: (v: Status | 'all') => void
}

export default function EquipmentPage(props: Props) {
  return <EquipmentModule {...props} />
}
