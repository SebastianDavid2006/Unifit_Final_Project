import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Trainer } from '@/data/trainers'
import { BLUE_GRAD, GREEN_BLUE_GRAD, RED, GREEN, gymTenure } from '../../data'

import DetailCard from '../../components/DetailCard'
import FieldList from '../../components/FieldList'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { LockView } from '@/assets/models/ui/objects/lock/LockModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import coach2Gif from '@/assets/illustrations/characters/coach_2/animated/coach_2.gif'
import lectorHuellaImg from '@/assets/illustrations/actions/fingerprint.webp'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'

import { TrainerGrid } from './components/TrainerGrid'
import { TrainerInfoModal } from './modals/TrainerInfoModal'
import { TrainerFingerprintModal } from './modals/TrainerFingerprintModal'
import { TrainerConfirmModal } from './modals/TrainerConfirmModal'

export default function TrainerDetail({ trainer: trainerProp }: { trainer: Trainer }) {
  const [trainer, setTrainer] = useState<Trainer>(trainerProp)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showFingerprintModal, setShowFingerprintModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  const [confirm, setConfirm] = useState<'save' | 'status' | null>(null)
  const [fingerprintStatus, setFingerprintStatus] = useState<'idle' | 'scanning' | 'captured'>('idle')
  const [fingerprintSuccess, setFingerprintSuccess] = useState(false)

  function buildDraft(): Record<string, string> {
    return {
      name: trainer.name,
      firstName: trainer.firstName,
      secondName: trainer.secondName,
      lastName: trainer.lastName,
      secondLastName: trainer.secondLastName,
      document: trainer.document,
      birthDate: trainer.birthDate,
      gender: trainer.gender,
      eps: trainer.eps,
      bloodType: trainer.bloodType,
      email: trainer.email,
      phone: trainer.phone,
      contactName: trainer.contactName,
      contactRelation: trainer.contactRelation,
      contactPhone: trainer.contactPhone,
    }
  }

  function startEdit() {
    setDraft(buildDraft())
    setEditMode(true)
  }

  function saveDraft() {
    if (!draft) return
    setTrainer(prev => ({
      ...prev,
      name: [draft.firstName, draft.secondName, draft.lastName, draft.secondLastName].filter(Boolean).join(' '),
      firstName: draft.firstName,
      secondName: draft.secondName,
      lastName: draft.lastName,
      secondLastName: draft.secondLastName,
      document: draft.document,
      birthDate: draft.birthDate,
      gender: draft.gender,
      eps: draft.eps,
      bloodType: draft.bloodType,
      email: draft.email,
      phone: draft.phone,
      contactName: draft.contactName,
      contactRelation: draft.contactRelation,
      contactPhone: draft.contactPhone,
    }))
    setEditMode(false)
    setDraft(null)
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

  const handleFingerprintStart = () => {
    setFingerprintStatus('scanning')
    setTimeout(() => setFingerprintStatus('captured'), 5000)
  }

  const handleFingerprintNext = () => {
    setFingerprintSuccess(true)
  }

  return (
    <div className="relative z-10 p-8 overflow-hidden">
      <div className="w-full">
        <TrainerGrid trainer={trainer} onShowInfo={() => setShowInfoModal(true)} onShowFingerprint={() => setShowFingerprintModal(true)} />
      </div>

      {/* â”€â”€ Info completa (modal por categorías) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {showInfoModal && (
          <TrainerInfoModal
            isOpen={true}
            trainer={trainer}
            editMode={editMode}
            draft={draft}
            onClose={() => { setShowInfoModal(false); setEditMode(false); setDraft(null); }}
            onEdit={startEdit}
            onSave={saveDraft}
            onStatusChange={() => setConfirm('status')}
            onDraftChange={handleDraftChange}
          />
        )}
      </AnimatePresence>

      {/* â”€â”€ Confirmación de cambios â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

      {/* â”€â”€ Modal Huella Digital â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {showFingerprintModal && (
          <TrainerFingerprintModal
            isOpen={true}
            trainer={trainer}
            huella={trainer.huella}
            onClose={() => { setShowFingerprintModal(false); setFingerprintStatus('idle'); setFingerprintSuccess(false); }}
            onCapture={() => { setFingerprintStatus('scanning'); setTimeout(() => setFingerprintStatus('captured'), 5000); }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
