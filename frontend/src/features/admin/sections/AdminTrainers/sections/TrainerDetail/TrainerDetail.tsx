import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Trainer } from '@/services/usuario.service'
import { actualizarEntrenador } from '@/services/usuario.service'
import { mensajeError } from '@/lib/api'

import { TrainerGrid } from './components/TrainerGrid'
import { TrainerInfoModal } from './modals/TrainerInfoModal'
import { TrainerConfirmModal } from './modals/TrainerConfirmModal'

export default function TrainerDetail({ trainer: trainerProp }: { trainer: Trainer }) {
  const [trainer, setTrainer] = useState<Trainer>(trainerProp)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  const [confirm, setConfirm] = useState<'save' | 'status' | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null)

  function buildDraft(): Record<string, string> {
    return {
      firstName: trainer.firstName,
      secondName: trainer.secondName,
      lastName: trainer.lastName,
      secondLastName: trainer.secondLastName,
      documentType: trainer.documentType,
      document: trainer.document,
      birthDate: trainer.birthDate,
      gender: trainer.gender,
      email: trainer.email,
      phone: trainer.phone,
    }
  }

  function startEdit() {
    setDraft(buildDraft())
    setErrorGuardado(null)
    setEditMode(true)
  }

  async function saveDraft() {
    if (!draft || guardando) return
    setGuardando(true)
    setErrorGuardado(null)

    const actualizado: Trainer = {
      ...trainer,
      name: [draft.firstName, draft.secondName, draft.lastName, draft.secondLastName].filter(Boolean).join(' '),
      firstName: draft.firstName,
      secondName: draft.secondName,
      lastName: draft.lastName,
      secondLastName: draft.secondLastName,
      documentType: draft.documentType,
      document: draft.document,
      birthDate: draft.birthDate,
      gender: draft.gender,
      email: draft.email,
      phone: draft.phone,
    }

    try {
      await actualizarEntrenador(trainer.id, actualizado)
      setTrainer(actualizado)
      setEditMode(false)
      setDraft(null)
    } catch (err) {
      setErrorGuardado(mensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  function handleDraftChange(key: string, value: string) {
    setDraft(prev => (prev ? { ...prev, [key]: value } : prev))
  }

  function toggleStatus() {
    setTrainer(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))
  }

  function handleConfirm() {
    if (confirm === 'save') {
      saveDraft()
    } else if (confirm === 'status') {
      toggleStatus()
    }
    setConfirm(null)
  }

  return (
    <div className="relative z-10 p-8 overflow-hidden">
      <div className="w-full">
        <TrainerGrid trainer={trainer} onShowInfo={() => setShowInfoModal(true)} />
      </div>

      {/* Info completa (modal por categorias) */}
      <AnimatePresence>
        {showInfoModal && (
          <TrainerInfoModal
            isOpen={true}
            trainer={trainer}
            editMode={editMode}
            draft={draft}
            onClose={() => { setShowInfoModal(false); setEditMode(false); setDraft(null); setErrorGuardado(null) }}
            onEdit={startEdit}
            onSave={saveDraft}
            onStatusChange={() => setConfirm('status')}
            onDraftChange={handleDraftChange}
            guardando={guardando}
            errorGuardado={errorGuardado}
          />
        )}
      </AnimatePresence>

      {/* Confirmacion de cambios */}
      <AnimatePresence>
        {confirm && (
          <TrainerConfirmModal
            isOpen={true}
            trainer={trainer}
            type={confirm}
            onConfirm={handleConfirm}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
