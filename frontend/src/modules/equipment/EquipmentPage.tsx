import EquipmentModule from './EquipmentModule'

interface Props {
  search: string
  searchFocused: boolean
  viewMode: 'machines' | 'exercises'
  onViewModeChange: (v: 'machines' | 'exercises') => void
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
}

export default function EquipmentPage(props: Props) {
  return <EquipmentModule {...props} />
}
