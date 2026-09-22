import { useState, useMemo, useEffect, useCallback } from 'react'
import { muscleToZones } from '@/data/shared/constants'
import * as ejercicioService from '@/services/ejercicio.service'
import { mensajeError } from '@/lib/api'

type FrontendExercise = ejercicioService.FrontendExercise

interface ExForm {
  name: string
  zone: string
  description: string
  status: 'active' | 'maintenance' | 'inactive'
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  imageUrl: string
  imageFile: File | null
  videoUrl: string
}

const defaultForm: ExForm = {
  name: '', zone: '', description: '', status: 'active',
  muscleGroups: [], recommendedLevel: 'principiante',
  imageUrl: '', imageFile: null, videoUrl: '',
}

export function useExercises() {
  const [exercises, setExercises] = useState<FrontendExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<FrontendExercise | null>(null)
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [askCreateAnother, setAskCreateAnother] = useState(false)
  const [createdCount, setCreatedCount] = useState(0)
  const [confirmClose, setConfirmClose] = useState(false)
  const [form, setForm] = useState<ExForm>(defaultForm)
  const [filterZone, setFilterZone] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true)
      const data = await ejercicioService.getEjercicios()
      // Sort by fecha_creacion descending (most recent first)
      const sorted = [...data].sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
      setExercises(sorted)
    } catch (err) {
      console.error('Error loading exercises:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadExercises() }, [loadExercises])

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
    setSaveError(null)
    setForm(defaultForm)
  }

  function openEdit(e: FrontendExercise) {
    setEditing(e)
    setStep(0)
    setShowSuccess(false)
    setSaveError(null)
    setShowModal(true)
    setForm({
      name: e.name, zone: e.zone, description: e.description, status: e.status,
      muscleGroups: [...e.muscleGroups], recommendedLevel: e.recommendedLevel,
      imageUrl: e.imageUrl, imageFile: null, videoUrl: e.videoUrl,
    })
  }

  async function save() {
    if (!form.name.trim()) return null
    const zoneFromGroups = form.muscleGroups.length > 0
      ? (form.muscleGroups.includes('General') ? [...new Set(['Cardio', 'Pesas Libres'])] : form.muscleGroups.flatMap(g => muscleToZones[g] || []))
      : []
    const zone = zoneFromGroups.length > 0 ? zoneFromGroups[0] : (form.zone || 'Cardio')
    const data = {
      name: form.name.trim(), zone,
      description: form.description, status: form.status,
      muscleGroups: form.muscleGroups, recommendedLevel: form.recommendedLevel,
      imageUrl: form.imageUrl, imageFile: form.imageFile, videoUrl: form.videoUrl,
    }
    try {
      if (!editing) {
        const created = await ejercicioService.crearEjercicio(data)
        // Prepend new items (most recent first)
        setExercises(prev => [created, ...prev])
        setCreatedCount(c => c + 1)
        setAskCreateAnother(true)
        return { edited: false, name: data.name, wasNew: true }
      } else {
        const updated = await ejercicioService.editarEjercicio(editing.id, data)
        setExercises(prev => prev.map(e => e.id === editing.id ? updated : e))
        return { edited: true, name: data.name, wasNew: false }
      }
    } catch (err) {
      console.error('Error saving exercise:', err)
      setSaveError(mensajeError(err))
      return null
    }
  }

  async function remove(id: string) {
    try {
      await ejercicioService.desactivarEjercicio(id)
      setExercises(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('Error deactivating exercise:', err)
    }
  }

  function closeModal() {
    setShowModal(false)
    setShowSuccess(false)
    setEditing(null)
    setConfirmClose(false)
    setAskCreateAnother(false)
    setSaveError(null)
  }

  return {
    exercises,
    setExercises,
    filtered,
    zones,
    loading,
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
    setCreatedCount,
    confirmClose,
    setConfirmClose,
    form,
    setForm,
    filterZone,
    setFilterZone,
    saveError,
    clearSaveError: () => setSaveError(null),
    openAdd,
    openEdit,
    save,
    remove,
    closeModal,
    defaultForm,
  }
}