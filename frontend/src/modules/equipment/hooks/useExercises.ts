import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { muscleToZones } from '@/data/shared/constants'
import * as ejercicioService from '@/services/ejercicio.service'
import { mensajeError } from '@/lib/api'

type FrontendExercise = ejercicioService.FrontendExercise

interface ExForm {
  name: string
  zone: string
  description: string
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  imageUrl: string
  imageFile: File | null
  videoUrl: string
}

const defaultForm: ExForm = {
  name: '', zone: '', description: '',
  muscleGroups: [], recommendedLevel: 'principiante',
  imageUrl: '', imageFile: null, videoUrl: '',
}

export function useExercises() {
  const [exercises, setExercises] = useState<FrontendExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [incluirInactivos, setIncluirInactivos] = useState(false)
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
  // Guarda contra el doble envío: el ref corta los clics del mismo instante (el estado aún no se repintó)
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)

  const loadExercises = useCallback(async (incluir: boolean) => {
    try {
      setLoading(true)
      const data = await ejercicioService.getEjercicios(incluir)
      // Sort by fecha_creacion descending (most recent first)
      const sorted = [...data].sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
      setExercises(sorted)
    } catch (err) {
      console.error('Error loading exercises:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadExercises(incluirInactivos) }, [incluirInactivos, loadExercises])

  const zones = useMemo(() => [...new Set(exercises.map(e => e.zone))], [exercises])

  const filtered = useMemo(() => {
    let list = exercises
    if (!incluirInactivos) list = list.filter(e => e.activo)
    if (filterZone) list = list.filter(e => e.zone === filterZone)
    return list
  }, [exercises, filterZone, incluirInactivos])

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
      name: e.name, zone: e.zone, description: e.description,
      muscleGroups: [...e.muscleGroups], recommendedLevel: e.recommendedLevel,
      imageUrl: e.imageUrl, imageFile: null, videoUrl: e.videoUrl,
    })
  }

  async function save() {
    if (!form.name.trim()) return null
    if (savingRef.current) return null
    savingRef.current = true
    setSaving(true)
    const zoneFromGroups = form.muscleGroups.length > 0
      ? (form.muscleGroups.includes('General') ? [...new Set(['Cardio', 'Pesas Libres'])] : form.muscleGroups.flatMap(g => muscleToZones[g] || []))
      : []
    const zone = zoneFromGroups.length > 0 ? zoneFromGroups[0] : (form.zone || 'Cardio')
    const data = {
      name: form.name.trim(), zone,
      description: form.description,
      muscleGroups: form.muscleGroups, recommendedLevel: form.recommendedLevel,
      imageUrl: form.imageUrl, imageFile: form.imageFile, videoUrl: form.videoUrl,
    }
    try {
      if (!editing) {
        const created = await ejercicioService.crearEjercicio({ ...data, activo: true })
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
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  async function disable(id: string) {
    try {
      const updated = await ejercicioService.deshabilitarEjercicio(id)
      setExercises(prev => prev.map(e => e.id === id ? updated : e))
    } catch (err) {
      console.error('Error deshabilitando ejercicio:', err)
    }
  }

  async function reactivate(id: string) {
    try {
      const updated = await ejercicioService.reactivarEjercicio(id)
      setExercises(prev => prev.map(e => e.id === id ? updated : e))
    } catch (err) {
      console.error('Error reactivando ejercicio:', err)
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
    incluirInactivos,
    setIncluirInactivos,
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
    saving,
    clearSaveError: () => setSaveError(null),
    openAdd,
    openEdit,
    save,
    disable,
    reactivate,
    closeModal,
    defaultForm,
  }
}