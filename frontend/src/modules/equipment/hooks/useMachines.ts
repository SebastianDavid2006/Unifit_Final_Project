import { useState, useMemo } from 'react'
import type { Machine } from '@/data/shared/types'

interface MachineForm {
  name: string
  zone: string
  status: 'active' | 'maintenance' | 'inactive'
  imageDataUrl: string
  description: string
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  observations: string
  selectedIds: number[]
}

const defaultForm: MachineForm = {
  name: '', zone: '', status: 'active',
  imageDataUrl: '', description: '', muscleGroups: [],
  recommendedLevel: 'principiante', observations: '', selectedIds: [],
}

export function useMachines(initialMachines: Machine[], search: string) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [showModal, setShowModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [form, setForm] = useState<MachineForm>(defaultForm)

  const nextId = useMemo(() => Math.max(...machines.map(m => m.id), 0) + 1, [machines])

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

  function save() {
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
    let edited = false
    if (editingMachine) {
      setMachines(prev => prev.map(m =>
        m.id === editingMachine.id ? { ...m, ...data } : m
      ))
      edited = true
    } else {
      setMachines(prev => [...prev, { id: nextId, ...data }])
    }
    return { edited, name: data.name }
  }

  function closeModal() {
    setShowModal(false)
    setShowSuccess(false)
    setEditingMachine(null)
    setShowConfirmClose(false)
  }

  function remove(id: number) {
    setMachines(prev => prev.filter(m => m.id !== id))
  }

  function changeStatus(id: number, status: Machine['status']) {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  function toggleExerciseSelection(id: number) {
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
    nextId,
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
