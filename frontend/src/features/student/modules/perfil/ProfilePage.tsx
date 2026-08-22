import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ClipboardList, FileText, UserCog, X, ChevronRight } from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import { assessmentItems } from '@/modules/students/StudentProfileData'
import { SectionTitle, cardStyle, AMBER, BLUE, GREEN } from '@/features/student/components/ui/fitness'
import { ProfileHeader } from './components/ProfileHeader'
import { MetricsRow } from './components/MetricsRow'
import { HistoryPanel } from './components/HistoryPanel'
import { DocumentsPanel } from './components/DocumentsPanel'
import { PersonalDataPanel } from './components/PersonalDataPanel'

type ModalId = 'history' | 'documents' | 'personal' | null

export function ProfilePage() {
  const { student } = useStudentApp()
  const [modal, setModal] = useState<ModalId>(null)
  const [historySel, setHistorySel] = useState<number | null>(null)
  const [medEps, setMedEps] = useState<File | null>(null)
  const [medHistoria, setMedHistoria] = useState<File | null>(null)
  const [lesiones, setLesiones] = useState<File[]>([])

  const menuItems = [
    { id: 'history' as const, label: 'Historial de valoraciones', desc: `${assessmentItems.length} valoraciones registradas`, icon: ClipboardList, color: BLUE },
    { id: 'documents' as const, label: 'Documentos', desc: 'PAR-Q, consentimientos y más', icon: FileText, color: AMBER },
    { id: 'personal' as const, label: 'Datos personales', desc: 'Información de tu perfil', icon: UserCog, color: GREEN },
  ]

  return (
    <div className="space-y-6">
      <ProfileHeader student={student} />

      <MetricsRow />

      {/* Menú */}
      <section>
        <SectionTitle>Mi cuenta</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setModal(item.id); if (item.id === 'history') setHistorySel(null) }}
              className="rounded-2xl p-5 text-left w-full"
              style={cardStyle}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '15', border: `1px solid ${item.color}28` }}>
                  <item.icon size={21} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate" style={{ fontSize: 14 }}>{item.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, marginTop: 2 }}>{item.desc}</p>
                </div>
                <ChevronRight size={17} style={{ color: 'rgba(255,255,255,0.25)' }} className="flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ---------- MODALES ---------- */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setModal(null); setHistorySel(null) }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full md:max-w-xl max-h-[82vh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
              style={{
                background: 'linear-gradient(165deg, #12121C, #0A0A14)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 -10px 80px rgba(0,0,0,0.6)',
              }}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-5" style={{ background: 'rgba(18,18,28,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="uppercase italic font-black text-white" style={{ fontSize: 16 }}>
                  {modal === 'history' ? 'Historial de valoraciones' : modal === 'documents' ? 'Documentos' : 'Datos personales'}
                </h3>
                <button onClick={() => { setModal(null); setHistorySel(null) }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                  <X size={17} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                {modal === 'history' && (
                  <HistoryPanel
                    selectedNum={historySel}
                    onSelect={setHistorySel}
                    onBack={() => setHistorySel(null)}
                  />
                )}
                {modal === 'documents' && (
                  <DocumentsPanel
                    medEps={medEps}
                    setMedEps={setMedEps}
                    medHistoria={medHistoria}
                    setMedHistoria={setMedHistoria}
                    lesiones={lesiones}
                    setLesiones={setLesiones}
                  />
                )}
                {modal === 'personal' && <PersonalDataPanel />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
