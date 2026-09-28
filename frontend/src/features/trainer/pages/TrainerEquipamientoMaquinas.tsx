import { useState } from 'react'
import EquipmentPage from '@/modules/equipment/EquipmentPage'

export default function TrainerEquipamientoMaquinas() {
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  return (
    <EquipmentPage
      search={search}
      searchFocused={searchFocused}
      viewMode="machines"
      onViewModeChange={() => {}}
      onSearchChange={setSearch}
      onSearchFocus={setSearchFocused}
    />
  )
}
