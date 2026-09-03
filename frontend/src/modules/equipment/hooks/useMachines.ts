import { useState, useMemo, useEffect, useCallback } from 'react'
import type { Machine } from '@/data/shared/types'
import * as maquinaService from '@/services/maquina.service'

interface MachineForm {
  name: string
  zone: string
  status: 'active' | 'maintenance' | 'inactive'
  imageDataUrl: string
  description: string
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  observations: string
  selectedIds: string[]
}

const defaultForm: MachineForm = {
  name: '', zone: '', status: 'active',
  imageDataUrl: '', description: '', muscleGroups: [],
  recommendedLevel: 'principiante', observations: '', selectedIds: [],
}

export function useMachines(search: string) {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [form, setForm] = useState<MachineForm>(defaultForm)

  const loadMachines = useCallback(async () => {
    try {
      setLoading(true)
      const data = await maquinaService.getMaquinas()
      setMachines(data)
    } catch (err) {
      console.error('Error loading machines:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadMachines() }, [loadMachines])

  const filtered = useMemo(() => {
    let list = machines
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.zone.toLowerCase().includes(q)
      )
    }
    return list
  }, [machines, search])

  function openAdd() {
    setEditingMachine(null)
    setStep(0)
    setForm(defaultForm)
    setShowModal(true)
  }

  function openEdit(m: Machine) {
    setEditingMachine(m)
    setStep(0)
    setForm({
      name: m.name, zone: m.zone, status: m.status,
      imageDataUrl: m.imageDataUrl || '', description: m.description,
      muscleGroups: [...m.muscleGroups], recommendedLevel: m.recommendedLevel,
      observations: m.observations, selectedIds: [...m.exerciseIds],
    })
    setShowModal(true)
  }

  async function save() {
    if (!form.name.trim()) return null
    const data = {
      name: form.name.trim(),
      zone: form.muscleGroups.join(', ') || 'General',
      status: form.status,
      imageDataUrl: form.imageDataUrl || undefined,
      description: form.description.trim(),
      muscleGroups: form.muscleGroups,
      recommendedLevel: form.recommendedLevel,
      observations: form.observations.trim(),
      exerciseIds: form.selectedIds,
    }
    try {
      if (editingMachine) {
        const updated = await maquinaService.editarMaquina(editingMachine.id, data)
        setMachines(prev => prev.map(m => m.id === editingMachine.id ? updated : m))
        return { edited: true, name: data.name }
      } else {
        const created = await maquinaService.crearMaquina(data)
        setMachines(prev => [...prev, created])
        return { edited: false, name: data.name }
      }
    } catch (err) {
      console.error('Error saving machine:', err)
      return null
    }
  }

  function closeModal() {
    setShowModal(false)
    setShowSuccess(false)
    setEditingMachine(null)
    setShowConfirmClose(false)
  }

  async function remove(id: string) {
    try {
      await maquinaService.desactivarMaquina(id)
      setMachines(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Error deactivating machine:', err)
    }
  }

  function changeStatus(id: string, status: Machine['status']) {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  function toggleExerciseSelection(id: string) {
    setForm(f => ({
      ...f,
      selectedIds: f.selectedIds.includes(id)
        ? f.selectedIds.filter(x => x !== id)
        : [...f.selectedIds, id],
    }))
  }

  return {
    machines,
    setMachines,
    filtered,
    loading,
    showModal,
    setShowModal,
    editingMachine,
    step,
    setStep,
    showSuccess,
    setShowSuccess,
    showConfirmClose,
    setShowConfirmClose,
    form,
    setForm,
    openAdd,
    openEdit,
    save,
    closeModal,
    remove,
    changeStatus,
    toggleExerciseSelection,
    defaultForm,
  }
}
