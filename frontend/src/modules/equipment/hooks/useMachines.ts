import { useState, useMemo, useEffect, useCallback } from 'react'
import * as maquinaService from '@/services/maquina.service'
import { mensajeError } from '@/lib/api'

type FrontendMachine = maquinaService.FrontendMachine

interface MachineForm {
  name: string
  zone: string
  status: 'active' | 'maintenance' | 'inactive'
  imageDataUrl: string
  imageFile: File | null
  description: string
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  observations: string
  selectedIds: string[]
}

const defaultForm: MachineForm = {
  name: '', zone: '', status: 'active',
  imageDataUrl: '', imageFile: null, description: '', muscleGroups: [],
  recommendedLevel: 'principiante', observations: '', selectedIds: [],
}

export function useMachines(search: string) {
  const [machines, setMachines] = useState<FrontendMachine[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState<FrontendMachine | null>(null)
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [form, setForm] = useState<MachineForm>(defaultForm)
  const [saveError, setSaveError] = useState<string | null>(null)

  const loadMachines = useCallback(async () => {
    try {
      setLoading(true)
      const data = await maquinaService.getMaquinas()
      // Sort by fecha_creacion descending (most recent first)
      const sorted = [...data].sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
      setMachines(sorted)
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
    setSaveError(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  function openEdit(m: FrontendMachine) {
    setEditingMachine(m)
    setStep(0)
    setSaveError(null)
    setForm({
      name: m.name, zone: m.zone, status: m.status,
      imageDataUrl: m.imageDataUrl || '', imageFile: null, description: m.description,
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
      imageFile: form.imageFile,
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
        // Prepend new items (most recent first)
        setMachines(prev => [created, ...prev])
        return { edited: false, name: data.name }
      }
    } catch (err) {
      console.error('Error saving machine:', err)
      setSaveError(mensajeError(err))
      return null
    }
  }

  function closeModal() {
    setShowModal(false)
    setShowSuccess(false)
    setEditingMachine(null)
    setShowConfirmClose(false)
    setSaveError(null)
  }

  async function remove(id: string) {
    try {
      await maquinaService.desactivarMaquina(id)
      setMachines(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Error deactivating machine:', err)
    }
  }

  function changeStatus(id: string, status: FrontendMachine['status']) {
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
    saveError,
    clearSaveError: () => setSaveError(null),
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