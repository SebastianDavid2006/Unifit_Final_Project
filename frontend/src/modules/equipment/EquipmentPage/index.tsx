import { useState, useEffect } from 'react'
import type { Machine, Exercise } from '@/data/shared/types'
import { BLUE, RED } from '@/data/shared/constants'
import { initialMachines, initialExercises } from '@/data/shared/mockData'
import { WeightsView } from '@/assets/models/ui/equipment/weights/WeightsModel'
import { TrashView } from '@/assets/models/ui/actions/trash/TrashModel'
import { PenView } from '@/assets/models/ui/actions/pen/PenModel'
import { useToast } from '@/modules/equipment/hooks/useToast'
import { useMachines } from '@/modules/equipment/hooks/useMachines'
import { useExercises } from '@/modules/equipment/hooks/useExercises'
import { EquipmentBanner } from './sections/EquipmentBanner'
import { CreateOptionsOverlay } from './sections/CreateOptionsOverlay'
import { MachineCardGrid } from './sections/MachineCardGrid'
import { ExerciseCardGrid } from './sections/ExerciseCardGrid'
import { DeleteConfirmDialog } from './sections/DeleteConfirmDialog'
import { MachineModal } from './components/MachineModal'
import { ExerciseManagerModal } from './components/ExerciseManagerModal'
import { MachinePreviewModal } from './components/MachinePreviewModal'
import { ExercisePreviewModal } from './components/ExercisePreviewModal'
import { Toast } from './components/Toast'

interface Props {
  search: string
  searchFocused: boolean
  viewMode: 'machines' | 'exercises'
  onViewModeChange: (v: 'machines' | 'exercises') => void
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
}

export default function EquipmentPage(props: Props) {
  const machine = useMachines(initialMachines, props.search)
  const ex = useExercises(initialExercises)
  const createToast = useToast()
  const deleteToast = useToast()
  const editToast = useToast()

  const [showCreateOptions, setShowCreateOptions] = useState(false)
  const [previewMachine, setPreviewMachine] = useState<Machine | null>(null)
  const [previewMuscleFilter, setPreviewMuscleFilter] = useState<string>('all')
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'machine' | 'exercise'; id: number } | null>(null)
  const [pendingMachineToast, setPendingMachineToast] = useState<{ name: string; edited: boolean } | null>(null)
  const [pendingExerciseToast, setPendingExerciseToast] = useState<{ name: string } | null>(null)

  useEffect(() => {
    if (!machine.showModal && pendingMachineToast) {
      const { name, edited } = pendingMachineToast
      if (edited) editToast.trigger(name)
      else createToast.trigger(name)
      setPendingMachineToast(null)
    }
  }, [machine.showModal])

  useEffect(() => {
    if (!ex.showModal && pendingExerciseToast) {
      editToast.trigger(pendingExerciseToast.name)
      setPendingExerciseToast(null)
    }
  }, [ex.showModal])

  function handleSaveMachine() {
    const result = machine.save()
    if (!result) return
    machine.setShowSuccess(true)
    setPendingMachineToast({ name: result.name, edited: result.edited })
  }

  function handleSaveExercise() {
    const result = ex.save()
    if (!result) return
    if (result.wasNew) {
      ex.setAskCreateAnother(true)
    } else {
      ex.setShowSuccess(true)
      setPendingExerciseToast({ name: result.name })
    }
  }

  function handleExerciseCreateAnotherNo() {
    ex.setShowSuccess(true)
    ex.setCreatedCount(0)
  }

  function handleDelete() {
    if (!deleteConfirm) return
    const name = deleteConfirm.type === 'machine'
      ? machine.machines.find(m => m.id === deleteConfirm.id)?.name
      : ex.exercises.find(e => e.id === deleteConfirm.id)?.name
    if (deleteConfirm.type === 'machine') {
      machine.remove(deleteConfirm.id)
      setPreviewMachine(null)
      if (name) deleteToast.trigger(name)
    } else {
      ex.remove(deleteConfirm.id)
      setPreviewExercise(null)
    }
    setDeleteConfirm(null)
  }

  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto relative overflow-x-hidden" style={{ maxWidth: '100%' }}>
      <EquipmentBanner onCreate={() => setShowCreateOptions(true)} />

      <CreateOptionsOverlay
        show={showCreateOptions}
        onClose={() => setShowCreateOptions(false)}
        onCreateMachine={() => { setShowCreateOptions(false); machine.openAdd(); machine.setShowModal(true) }}
        onCreateExercise={() => { setShowCreateOptions(false); ex.openAdd(); ex.setShowModal(true) }}
      />

      {props.viewMode === 'machines' ? (
        <MachineCardGrid
          machines={machine.filtered}
          exercises={ex.exercises}
          onPreview={m => { setPreviewMachine(m); setPreviewMuscleFilter('all') }}
        />
      ) : (
        <ExerciseCardGrid
          exercises={ex.filtered}
          onPreview={setPreviewExercise}
        />
      )}

      {/* â”€â”€ Machine Modal â”€â”€ */}
      <MachineModal
        show={machine.showModal}
        editingMachine={machine.editingMachine}
        step={machine.step}
        showSuccess={machine.showSuccess}
        showConfirmClose={machine.showConfirmClose}
        form={machine.form}
        exercises={ex.exercises}
        onClose={() => machine.closeModal()}
        onSave={handleSaveMachine}
        onFormChange={f => machine.setForm(f)}
        onStepChange={s => machine.setStep(s)}
        onConfirmClose={v => machine.setShowConfirmClose(v)}
        onToggleExerciseSelection={id => machine.toggleExerciseSelection(id)}
      />

      {/* â”€â”€ Exercise Manager Modal â”€â”€ */}
      <ExerciseManagerModal
        show={ex.showModal}
        editing={ex.editing}
        step={ex.step}
        showSuccess={ex.showSuccess}
        askCreateAnother={ex.askCreateAnother}
        createdCount={ex.createdCount}
        confirmClose={ex.confirmClose}
        form={ex.form}
        onClose={() => ex.closeModal()}
        onSave={handleSaveExercise}
        onFormChange={f => ex.setForm(f)}
        onStepChange={s => ex.setStep(s)}
        onConfirmClose={v => ex.setConfirmClose(v)}
        onAskCreateAnother={v => ex.setAskCreateAnother(v)}
        onCreatedCountChange={v => ex.setCreatedCount(v)}
        onCreateAnotherNo={handleExerciseCreateAnotherNo}
      />

      {/* â”€â”€ Machine Preview Modal â”€â”€ */}
      <MachinePreviewModal
        machine={previewMachine}
        exercises={ex.exercises}
        previewMuscleFilter={previewMuscleFilter}
        onMuscleFilterChange={setPreviewMuscleFilter}
        onEdit={m => { setPreviewMachine(null); machine.openEdit(m) }}
        onDelete={m => setDeleteConfirm({ type: 'machine', id: m.id })}
        onClose={() => setPreviewMachine(null)}
      />

      {/* â”€â”€ Exercise Preview Modal â”€â”€ */}
      <ExercisePreviewModal
        exercise={previewExercise}
        onEdit={e => { setPreviewExercise(null); ex.openEdit(e) }}
        onDelete={e => setDeleteConfirm({ type: 'exercise', id: e.id })}
        onClose={() => setPreviewExercise(null)}
      />

      {/* â”€â”€ Delete Confirm â”€â”€ */}
      <DeleteConfirmDialog
        confirm={deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
      />

      {/* â”€â”€ Delete Toast â”€â”€ */}
      <Toast
        show={deleteToast.show}
        name={deleteToast.name}
        progress={deleteToast.progress}
        title="Máquina eliminada"
        icon={<TrashView />}
        iconStyle={{ background: `${RED}08` }}
        boxShadow="0 24px 80px rgba(244,56,67,0.12), 0 8px 32px rgba(0,0,0,0.08)"
        progressGradient="linear-gradient(90deg, #F43843, #FF6B6B)"
      />

      {/* â”€â”€ Edit Toast â”€â”€ */}
      <Toast
        show={editToast.show}
        name={editToast.name}
        progress={editToast.progress}
        title="Registro actualizado"
        icon={<PenView />}
        iconStyle={{ background: `${BLUE}08` }}
        boxShadow="0 24px 80px rgba(18,112,183,0.15), 0 8px 32px rgba(0,0,0,0.08)"
        progressGradient="linear-gradient(90deg, #F5A623, #FF8C42)"
      />

      {/* â”€â”€ Creation Toast â”€â”€ */}
      <Toast
        show={createToast.show}
        name={createToast.name}
        progress={createToast.progress}
        title="Â¡Máquina creada!"
        icon={<WeightsView />}
        iconStyle={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), rgba(248,251,255,0.8)' }}
        iconClassName="w-[76px] h-[76px] flex-shrink-0"
        boxShadow="0 24px 80px rgba(18,112,183,0.15), 0 8px 32px rgba(0,0,0,0.08)"
        progressGradient="linear-gradient(90deg, #1270B7, #1A8CDB)"
      />
    </div>
  )
}
