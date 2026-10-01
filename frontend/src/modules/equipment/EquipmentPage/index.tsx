import { useState, useEffect } from 'react'
import type { Machine, Exercise } from '@/data/shared/types'
import type { FrontendMachine } from '@/services/maquina.service'
import type { FrontendExercise } from '@/services/ejercicio.service'
import { BLUE } from '@/data/shared/constants'
import { WeightsView } from '@/assets/models/ui/equipment/weights/WeightsModel'
import { PenView } from '@/assets/models/ui/actions/pen/PenModel'
import { Power } from 'lucide-react'
import { getUsuario } from '@/lib/auth'
import { useToast } from '@/modules/equipment/hooks/useToast'
import { useMachines } from '@/modules/equipment/hooks/useMachines'
import { useExercises } from '@/modules/equipment/hooks/useExercises'
import { EquipmentBanner } from './sections/EquipmentBanner'
import { CreateOptionsOverlay } from './sections/CreateOptionsOverlay'
import { MachineCardGrid } from './sections/MachineCardGrid'
import { ExerciseCardGrid } from './sections/ExerciseCardGrid'
import { DisableConfirmDialog } from './sections/DisableConfirmDialog'
import { MachineModal } from './components/MachineModal'
import { ExerciseManagerModal } from './components/ExerciseManagerModal'
import { MachinePreviewModal } from './components/MachinePreviewModal'
import { ExercisePreviewModal } from './components/ExercisePreviewModal'
import { Toast } from './components/Toast'
import { SaveErrorModal } from './components/SaveErrorModal'
import Pagination from '@/features/admin/components/Pagination'

interface Props {
  search: string
  searchFocused: boolean
  viewMode: 'machines' | 'exercises'
  onViewModeChange: (v: 'machines' | 'exercises') => void
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
}

export default function EquipmentPage(props: Props) {
  const sesionRol = getUsuario()?.rol
  const userRole: 'admin' | 'entrenador' | undefined =
    sesionRol === 'admin' || sesionRol === 'entrenador' ? sesionRol : undefined

  const machine = useMachines(props.search)
  const ex = useExercises()
  const createToast = useToast()
  const actionToast = useToast()
  const editToast = useToast()

  const [showCreateOptions, setShowCreateOptions] = useState(false)
  const [previewMachine, setPreviewMachine] = useState<Machine | null>(null)
  const [previewMuscleFilter, setPreviewMuscleFilter] = useState<string>('all')
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null)
  const [disableConfirm, setDisableConfirm] = useState<{ type: 'machine' | 'exercise'; id: string } | null>(null)
  const [pendingMachineToast, setPendingMachineToast] = useState<{ name: string; edited: boolean } | null>(null)
  const [pendingExerciseToast, setPendingExerciseToast] = useState<{ name: string } | null>(null)
  const [actionToastTitle, setActionToastTitle] = useState('Máquina deshabilitada')
  const [pendingActionToast, setPendingActionToast] = useState<{ title: string; name: string } | null>(null)

  const showInactive = machine.incluirInactivos || ex.incluirInactivos
  const toggleInactive = () => {
    const next = !showInactive
    machine.setIncluirInactivos(next)
    ex.setIncluirInactivos(next)
    setMachinePage(1)
    setExercisePage(1)
  }

  // Pagination
  const PAGE_SIZE = 6
  const [machinePage, setMachinePage] = useState(1)
  const [exercisePage, setExercisePage] = useState(1)

  const machineTotalPages = Math.max(1, Math.ceil(machine.filtered.length / PAGE_SIZE))
  const exerciseTotalPages = Math.max(1, Math.ceil(ex.filtered.length / PAGE_SIZE))

  const pagedMachines = machine.filtered.slice((machinePage - 1) * PAGE_SIZE, machinePage * PAGE_SIZE)
  const pagedExercises = ex.filtered.slice((exercisePage - 1) * PAGE_SIZE, exercisePage * PAGE_SIZE)

  // Reset pagination when search changes
  useEffect(() => {
    setMachinePage(1)
    setExercisePage(1)
  }, [props.search])

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

  useEffect(() => {
    if (pendingActionToast) {
      setActionToastTitle(pendingActionToast.title)
      actionToast.trigger(pendingActionToast.name)
      setPendingActionToast(null)
    }
  }, [pendingActionToast])

  async function handleSaveMachine() {
    const result = await machine.save()
    if (!result) return
    machine.setShowSuccess(true)
    setPendingMachineToast({ name: result.name, edited: result.edited })
  }

  async function handleSaveExercise() {
    const result = await ex.save()
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

  async function handleDisable() {
    if (!disableConfirm) return
    const { type, id } = disableConfirm
    const name = type === 'machine'
      ? machine.machines.find(m => m.id === id)?.name
      : ex.exercises.find(e => e.id === id)?.name
    let title = ''
    if (type === 'machine') {
      const target = machine.machines.find(m => m.id === id)
      if (target?.status === 'inactive') {
        await machine.reactivate(id)
        title = 'Máquina reactivada'
      } else {
        await machine.disable(id)
        title = 'Máquina deshabilitada'
      }
      setPreviewMachine(null)
    } else {
      const target = ex.exercises.find(e => e.id === id)
      if (target && !target.activo) {
        await ex.reactivate(id)
        title = 'Ejercicio reactivado'
      } else {
        await ex.disable(id)
        title = 'Ejercicio deshabilitado'
      }
      setPreviewExercise(null)
    }
    if (name) setPendingActionToast({ title, name })
    setDisableConfirm(null)
  }

  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto relative overflow-x-hidden" style={{ maxWidth: '100%' }}>
      <EquipmentBanner
        onCreate={() => setShowCreateOptions(true)}
        userRole={userRole}
        showInactive={showInactive}
        onToggleInactive={toggleInactive}
      />

      <CreateOptionsOverlay
        show={showCreateOptions}
        onClose={() => setShowCreateOptions(false)}
        onCreateMachine={() => { setShowCreateOptions(false); machine.openAdd(); machine.setShowModal(true) }}
        onCreateExercise={() => { setShowCreateOptions(false); ex.openAdd(); ex.setShowModal(true) }}
      />

      {props.viewMode === 'machines' ? (
        <>
          <MachineCardGrid
            machines={pagedMachines}
            exercises={ex.exercises}
            onPreview={m => { setPreviewMachine(m as Machine); setPreviewMuscleFilter('all') }}
          />
          {machineTotalPages > 1 && <Pagination page={machinePage} totalPages={machineTotalPages} onPage={setMachinePage} />}
        </>
      ) : (
        <>
          <ExerciseCardGrid
            exercises={pagedExercises}
            onPreview={e => setPreviewExercise(e as Exercise)}
          />
          {exerciseTotalPages > 1 && <Pagination page={exercisePage} totalPages={exerciseTotalPages} onPage={setExercisePage} />}
        </>
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
        saving={machine.saving}
        onFormChange={f => machine.setForm(f)}
        onStepChange={s => machine.setStep(s)}
        onConfirmClose={v => { if (!machine.saving) machine.setShowConfirmClose(v) }}
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
        saving={ex.saving}
        onFormChange={f => ex.setForm(f)}
        onStepChange={s => ex.setStep(s)}
        onConfirmClose={v => { if (!ex.saving) ex.setConfirmClose(v) }}
        onAskCreateAnother={v => ex.setAskCreateAnother(v)}
        onCreatedCountChange={v => ex.setCreatedCount(v)}
        onCreateAnotherNo={handleExerciseCreateAnotherNo}
      />

      {/* â”€â”€ Machine Preview Modal â”€â”€ */}
      <MachinePreviewModal
        machine={previewMachine as FrontendMachine}
        exercises={ex.exercises}
        previewMuscleFilter={previewMuscleFilter}
        onMuscleFilterChange={setPreviewMuscleFilter}
        onEdit={m => { setPreviewMachine(null); machine.openEdit(m as FrontendMachine) }}
        onToggleActive={m => setDisableConfirm({ type: 'machine', id: m.id })}
        onClose={() => setPreviewMachine(null)}
        userRole={userRole}
      />

      {/* â”€â”€ Exercise Preview Modal â”€â”€ */}
      <ExercisePreviewModal
        exercise={previewExercise as FrontendExercise}
        onEdit={e => { setPreviewExercise(null); ex.openEdit(e as FrontendExercise) }}
        onToggleActive={e => setDisableConfirm({ type: 'exercise', id: e.id })}
        onClose={() => setPreviewExercise(null)}
        userRole={userRole}
      />

      {/* â”€â”€ Disable Confirm â”€â”€ */}
      <DisableConfirmDialog
        confirm={disableConfirm}
        onCancel={() => setDisableConfirm(null)}
        onConfirm={handleDisable}
      />

      {/* â”€â”€ Save Error Modal â”€â”€ */}
      <SaveErrorModal
        show={!!(machine.saveError || ex.saveError)}
        message={machine.saveError || ex.saveError}
        onClose={() => { machine.clearSaveError(); ex.clearSaveError() }}
      />

      {/* â”€â”€ Deshabilitar / Reactivar Toast â”€â”€ */}
      <Toast
        show={actionToast.show}
        name={actionToast.name}
        progress={actionToast.progress}
        title={actionToastTitle}
        icon={<Power size={26} />}
        iconStyle={{ background: 'rgba(245,166,35,0.12)', color: '#B4531D' }}
        boxShadow="0 24px 80px rgba(245,166,35,0.14), 0 8px 32px rgba(0,0,0,0.08)"
        progressGradient="linear-gradient(90deg, #F5A623, #FF8C42)"
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
