import { useState, useMemo } from 'react'
import type { Exercise } from '@/data/types'
import { muscleToZones } from '@/data/constants'

interface ExForm {
  name: string
  zone: string
  description: string
  status: 'active' | 'maintenance' | 'inactive'
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  imageUrl: string
  videoUrl: string
}

const defaultForm: ExForm = {
  name: '', zone: '', description: '', status: 'active',
  muscleGroups: [], recommendedLevel: 'principiante',
  imageUrl: '', videoUrl: '',
}

export function useExercises(initialExercises: Exercise[]) {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [askCreateAnother, setAskCreateAnother] = useState(false)
  const [createdCount, setCreatedCount] = useState(0)
  const [confirmClose, setConfirmClose] = useState(false)
  const [form, setForm] = useState<ExForm>(defaultForm)
  const [filterZone, setFilterZone] = useState('')

  const nextId = useMemo(() => Math.max(...exercises.map(e => e.id), 0) + 1, [exercises])

  const zones = useMemo(() => [...new Set(exercises.map(e => e.zone))], [exercises])

  const filtered = useMemo(() => {
    let list = exercises
    if (filterZone) list = list.filter(e => e.zone === filterZone)
    return list
  }, [exercises, filterZone])

  function openAdd() {
    setEditing(null)
    setStep(0)
    setShowSuccess(false)
    setForm(defaultForm)
  }

  function openEdit(e: Exercise) {
    setEditing(e)
    setStep(0)
    setShowSuccess(false)
    setShowModal(true)
    setForm({
      name: e.name, zone: e.zone, description: e.description, status: e.status,
      muscleGroups: [...e.muscleGroups], recommendedLevel: e.recommendedLevel,
      imageUrl: e.imageUrl, videoUrl: e.videoUrl,
    })
  }

  function save() {
    if (!form.name.trim()) return null
    const zoneFromGroups = form.muscleGroups.length > 0
      ? (form.muscleGroups.includes('General') ? [...new Set(['Cardio', 'Pesas Libres'])] : form.muscleGroups.flatMap(g => muscleToZones[g] || []))
      : []
    const zone = zoneFromGroups.length > 0 ? zoneFromGroups[0] : (form.zone || 'Cardio')
    const data = {
      name: form.name.trim(), zone,
      description: form.description, status: form.status,
      muscleGroups: form.muscleGroups, recommendedLevel: form.recommendedLevel,
      imageUrl: form.imageUrl, videoUrl: form.videoUrl,
    }
    let edited = false
    if (!editing) {
      setExercises(prev => [...prev, { id: nextId, ...data }])
      setCreatedCount(c => c + 1)
      setAskCreateAnother(true)
    } else {
      setExercises(prev => prev.map(e =>
        e.id === editing.id ? { ...e, ...data } : e
      ))
      edited = true
    }
    return { edited, name: data.name, wasNew: !editing }
  }

  function remove(id: number) {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  function closeModal() {
    setShowModal(false)
    setShowSuccess(false)
    setEditing(null)
    setConfirmClose(false)
    setAskCreateAnother(false)
  }

  return {
    exercises,
    setExercises,
    filtered,
    zones,
    showModal,
    setShowModal,
    editing,
    step,
    setStep,
    showSuccess,
    setShowSuccess,
    askCreateAnother,
    setAskCreateAnother,
    createdCount,
    confirmClose,
    setConfirmClose,
    form,
    setForm,
    nextId,
    filterZone,
    setFilterZone,
    openAdd,
    openEdit,
    save,
    remove,
    closeModal,
    defaultForm,
  }
}
