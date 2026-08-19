import { motion, AnimatePresence } from 'motion/react'
import { X, Sparkles } from 'lucide-react'
import viewGif from '@/assets/icons/animated/actions/view.gif'
import weightLossIcon from '@/assets/icons/objects/metric_belt.webp'
import armIcon2 from '@/assets/icons/objects/dumbbel.webp'
import shoesIcon from '@/assets/icons/objects/shoes.webp'
import healthIcon from '@/assets/icons/health/health.webp'
import trophyIcon from '@/assets/icons/objects/trophy.webp'
import otroIcon from '@/assets/icons/ui/star.webp'
import musculoIcon from '@/assets/icons/anatomy/musculoskeletal.webp'
import lungsIcon from '@/assets/icons/anatomy/lungs.webp'
import brainIcon from '@/assets/icons/anatomy/brain.webp'
import cardioHealthIcon from '@/assets/icons/anatomy/cardio.webp'
import liverIcon from '@/assets/icons/anatomy/liver.webp'
import mindIcon from '@/assets/icons/health/mind.webp'
import calendarImg from '@/assets/icons/objects/calendar.webp'
import { ValuationSuccess } from './ValuationSuccess'
import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface NewValuationModalProps {
  isOpen: boolean
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationStep: number
  setValuationStep: (s: number) => void
  valuationViewMode: boolean
  setValuationViewMode: (v: boolean) => void
  valuationSuccess: boolean
  setValuationSuccess: (s: boolean) => void
  aiGenerating: boolean
  startAiRoutine: () => void
  onClose: () => void
  onRequestClose: () => void
  onCreateManual: () => void
  onSave: () => void
}

export function NewValuationModal({
  isOpen,
  valuationForm,
  setValuationForm,
  valuationStep,
  setValuationStep,
  valuationViewMode,
  setValuationViewMode,
  valuationSuccess,
  setValuationSuccess,
  aiGenerating,
  startAiRoutine,
  onClose,
  onRequestClose,
  onCreateManual,
  onSave,
}: NewValuationModalProps) {
  if (!isOpen) return null
  const handleClose = () => {
    if (valuationViewMode || valuationSuccess) {
      onClose()
    } else {
      onRequestClose()
    }
  }
  return (
          <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
              onClick={handleClose}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className={`rounded-3xl w-full max-w-2xl flex flex-col mx-4 relative ${valuationSuccess ? 'overflow-visible' : 'overflow-hidden'}`}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                  maxHeight: '90vh',
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0 px-6 pt-4 pb-0">
                  <div className="relative flex justify-end">
                    <img src={viewGif} alt="" className="absolute left-1/2 -translate-x-1/2 w-6 h-6 pointer-events-none" />
                    <motion.button
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                        hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
                        tap: { scale: 0.9 },
                      }}
                      onClick={handleClose}
                      className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X size={15} />
                    </motion.button>
                  </div>
                  {!valuationSuccess && (
                  <>
                  {/* Step dots */}
                  <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                    {[1, 2, 3, 4, 5, 6].map(s => (
                      <motion.div
                        key={s}
                        animate={{
                          width: s === valuationStep ? 16 : 6,
                          background: s === valuationStep ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.12)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="rounded-full"
                        style={{ height: 6 }}
                      />
                    ))}
                  </div>
                  {/* Step title */}
                  <span className="text-lg font-bold tracking-wide text-center block" style={{
                    color: '#1A1A1E',
                    marginBottom: 10,
                  }}>
                    {['Contexto del estudiante', 'Medidas corporales', 'Evaluación Clínica', 'Antecedentes de salud', 'Plan de entrenamiento', 'Observaciones finales'][valuationStep - 1]}
                  </span>
                  </>
                  )}
                </div>

                {/* Scrollable body */}
                <div className={`flex-1 px-6 ${valuationSuccess ? 'overflow-visible pb-0' : 'overflow-y-auto pb-6'}`}>
                  {valuationSuccess ? (
                    <ValuationSuccess
                      aiGenerating={aiGenerating}
                      onStartAiRoutine={startAiRoutine}
                      onCreateManual={onCreateManual}
                    />
                  ) : (
                  <motion.div
                    key={valuationStep}
                    initial={{ opacity: 0, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* ═══════ Paso 1: Contexto del estudiante ═══════ */}
                    {valuationStep === 1 && (
                      <div className="space-y-5">
                        <div className="flex flex-col gap-1 relative group">
                          <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Nivel de actividad física</label>
                          <div className="relative">
                            <select
                              value={valuationForm.nivelActividad}
                              disabled={valuationViewMode}
                              onChange={e => setValuationForm(p => ({ ...p, nivelActividad: e.target.value }))}
                              className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
                              style={{
                                background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                                color: '#1A1A1E',
                                border: '1px solid transparent',
                                paddingRight: 32,
                              }}
                              onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                              onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                              onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                              onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                            >
                              <option value="">Seleccionar nivel</option>
                              <option value="Sedentario">Sedentario</option>
                              <option value="Ligeramente activo">Ligeramente activo</option>
                              <option value="Activo">Activo</option>
                              <option value="Muy activo">Muy activo</option>
                              <option value="Extremadamente activo">Extremadamente activo</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-hover:opacity-60" style={{ color: 'rgba(0,0,0,0.2)' }}>
                              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Objetivo del usuario</label>
                          <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más objetivos. Si seleccionas "Otro", los demás se deseleccionan.</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'Perdida de peso', icon: weightLossIcon },
                              { value: 'Ganancia muscular', icon: armIcon2 },
                              { value: 'Acondicionamiento fisico', icon: shoesIcon },
                              { value: 'Salud', icon: healthIcon },
                              { value: 'Rendimiento deportivo', icon: trophyIcon },
                              { value: 'Otro', icon: otroIcon },
                            ].map(item => {
                              const isOtro = item.value === 'Otro'
                              const selected = valuationForm.objetivoTarjetas.includes(item.value)
                              const otroSelected = valuationForm.objetivoTarjetas.includes('Otro')
                              const disabled = otroSelected && !isOtro
                              const hoverBg = isOtro ? 'rgba(241,200,39,0.12)' : 'rgba(18,112,183,0.12)'
                              const selectedBg = isOtro ? 'linear-gradient(135deg, #F1C827, #FFE066)' : 'linear-gradient(135deg, #1270B7, #7ec8e3)'
                              const textColor = selected ? '#FFFFFF' : disabled ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.35)'
                              const shadow = isOtro ? '0 4px 20px rgba(241,200,39,0.25)' : '0 4px 20px rgba(18,112,183,0.25)'
                              return (
                                <motion.button
                                  key={item.value}
                                  type="button"
                                  disabled={valuationViewMode}
                                  whileHover={!disabled && !valuationViewMode ? { scale: 1.06 } : {}}
                                  whileTap={!disabled && !valuationViewMode ? { scale: 0.95 } : {}}
                                  onClick={() => {
                                    if (disabled || valuationViewMode) return
                                    if (isOtro) {
                                      setValuationForm(p => ({
                                        ...p,
                                        objetivoTarjetas: selected ? [] : ['Otro'],
                                      }))
                                    } else if (otroSelected) {
                                      setValuationForm(p => ({
                                        ...p,
                                        objetivoTarjetas: p.objetivoTarjetas.includes(item.value)
                                          ? p.objetivoTarjetas.filter((t: string) => t !== item.value)
                                          : [...p.objetivoTarjetas.filter((t: string) => t !== 'Otro'), item.value],
                                      }))
                                    } else {
                                      setValuationForm(p => ({
                                        ...p,
                                        objetivoTarjetas: p.objetivoTarjetas.includes(item.value)
                                          ? p.objetivoTarjetas.filter((t: string) => t !== item.value)
                                          : [...p.objetivoTarjetas, item.value],
                                      }))
                                    }
                                  }}
                                  onMouseEnter={e => { if (!selected && !disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = isOtro ? '#B8860B' : '#1270B7' } }}
                                  onMouseLeave={e => { if (!selected && !disabled) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? selectedBg : 'rgba(0,0,0,0.03)',
                                    color: textColor,
                                    border: '1px solid transparent',
                                    boxShadow: selected ? shadow : 'none',
                                    opacity: disabled ? 0.4 : 1,
                                    filter: disabled ? 'blur(0.6px)' : 'none',
                                    pointerEvents: disabled ? 'none' : 'auto',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  <motion.img
                                    src={item.icon}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 52 : 28,
                                      height: selected ? 52 : 28,
                                      marginTop: selected ? -28 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : disabled ? 'grayscale(0.6) blur(0px)' : 'blur(0px)',
                                      opacity: disabled ? 0.3 : 1,
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span>{item.value}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>¿Cuál es el objetivo?</label>
                          <div className="relative rounded-xl overflow-hidden" style={{
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,185,0,0.08), rgba(255,215,0,0.15))',
                            border: '1px solid rgba(212,175,55,0.35)',
                            boxShadow: '0 0 25px rgba(255,215,0,0.1), inset 0 1px 0 rgba(255,215,0,0.2)',
                          }}>
                            <div className="absolute inset-0 pointer-events-none" style={{
                              background: 'linear-gradient(110deg, transparent 20%, rgba(255,215,0,0.25) 35%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.25) 65%, transparent 80%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 2.5s ease-in-out infinite',
                            }} />
                            <textarea
                              value={valuationForm.objetivoDetalle}
                              readOnly={valuationViewMode}
                              onChange={e => setValuationForm(p => ({ ...p, objetivoDetalle: e.target.value }))}
                              placeholder="Describe a detalle el objetivo del estudiante..."
                              rows={3}
                              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none relative"
                              style={{
                                background: 'transparent',
                                color: '#B8860B',
                                border: 'none',
                                boxShadow: 'none',
                                fontWeight: 700,
                                textShadow: '0 0 8px rgba(255,215,0,0.2)',
                              }}
                              onFocus={e => { e.currentTarget.parentElement!.style.boxShadow = '0 0 40px rgba(255,215,0,0.2)' }}
                              onBlur={e => { e.currentTarget.parentElement!.style.boxShadow = '0 0 25px rgba(255,215,0,0.08)' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 2: Medidas corporales ═══════ */}
                    {valuationStep === 2 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: 'peso', label: 'Peso (kg)', type: 'number' },
                            { key: 'estatura', label: 'Estatura (cm)', type: 'number' },
                            { key: 'imc', label: 'IMC', type: 'number' },
                            { key: 'grasaCorporal', label: 'Grasa corporal (%)', type: 'number' },
                            { key: 'masaMuscular', label: 'Masa muscular (kg)', type: 'number' },
                            { key: 'masaMagra', label: 'Masa magra (kg)', type: 'number' },
                            { key: 'grasaVisceral', label: 'Grasa visceral (nivel)', type: 'number' },
                          ].map(field => (
                            <div key={field.key} className="flex flex-col gap-1 group">
                              <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{field.label}</label>
                              <input
                                type={field.type}
                                readOnly={valuationViewMode}
                                value={(valuationForm as any)[field.key]}
                                onChange={e => setValuationForm(p => ({ ...p, [field.key]: e.target.value }))}
                                className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full transition-all duration-200"
                                style={{
                                  background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                                  color: '#1A1A1E',
                                  border: '1px solid transparent',
                                }}
                                onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                                onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                                onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                                onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 3: Evaluación Clínica ═══════ */}
                    {valuationStep === 3 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: 'presionArterial', label: 'Presión arterial', type: 'text' },
                            { key: 'edadMetabolica', label: 'Edad metabólica', type: 'number' },
                            { key: 'aguaCorporal', label: 'Agua corporal (%)', type: 'number' },
                            { key: 'resistenciaMuscular', label: 'Resistencia muscular', type: 'text' },
                          ].map(field => (
                            <div key={field.key} className="flex flex-col gap-1 group">
                              <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{field.label}</label>
                              <input
                                type={field.type}
                                readOnly={valuationViewMode}
                                value={(valuationForm as any)[field.key]}
                                onChange={e => setValuationForm(p => ({ ...p, [field.key]: e.target.value }))}
                                className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full transition-all duration-200"
                                style={{
                                  background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                                  color: '#1A1A1E',
                                  border: '1px solid transparent',
                                }}
                                onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                                onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                                onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                                onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 4: Antecedentes de salud ═══════ */}
                    {valuationStep === 4 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Antecedentes de salud</label>
                          <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más antecedentes.</p>
                          <div className="grid grid-cols-3 gap-2">
                             {[
                              { value: 'Osteomuscular', icon: musculoIcon },
                              { value: 'Respiratorio', icon: lungsIcon },
                              { value: 'Psiquiátrico', icon: brainIcon },
                              { value: 'Cardiovascular', icon: cardioHealthIcon },
                              { value: 'Metabólico', icon: liverIcon },
                              { value: 'Psicológico', icon: mindIcon },
                            ].map(item => {
                              const selected = valuationForm.antecedentesSalud.includes(item.value)
                              return (
                                <motion.button
                                  key={item.value}
                                  type="button"
                                  disabled={valuationViewMode}
                                  whileHover={!selected && !valuationViewMode ? { scale: 1.06 } : {}}
                                  whileTap={valuationViewMode ? {} : { scale: 0.95 }}
                                  onClick={() => {
                                    if (valuationViewMode) return
                                    setValuationForm(p => ({
                                      ...p,
                                      antecedentesSalud: selected
                                        ? p.antecedentesSalud.filter((s: string) => s !== item.value)
                                        : [...p.antecedentesSalud, item.value],
                                    }))
                                  }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.03)',
                                    color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                                    border: '1px solid transparent',
                                    boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
                                  }}
                                  onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
                                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                >
                                  <motion.img
                                    src={item.icon}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 48 : 24,
                                      height: selected ? 48 : 24,
                                      marginTop: selected ? -24 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span>{item.value}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Observaciones del entrenador</label>
                          <textarea
                            value={valuationForm.observacionesEntrenador}
                            readOnly={valuationViewMode}
                            onChange={e => setValuationForm(p => ({ ...p, observacionesEntrenador: e.target.value }))}
                            placeholder="Notas del entrenador sobre los antecedentes..."
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none"
                            style={{
                              background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                              color: '#1A1A1E',
                              border: '1px solid transparent',
                            }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 5: Plan de entrenamiento ═══════ */}
                    {valuationStep === 5 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Días de la semana</label>
                          <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona los días disponibles.</p>
                          <div className="grid grid-cols-6 gap-2">
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(dia => {
                              const selected = valuationForm.diasDisponibles.includes(dia)
                              return (
                                <motion.button
                                  key={dia}
                                  type="button"
                                  disabled={valuationViewMode}
                                  whileHover={!selected && !valuationViewMode ? { scale: 1.06 } : {}}
                                  whileTap={valuationViewMode ? {} : { scale: 0.95 }}
                                  onClick={() => {
                                    if (valuationViewMode) return
                                    setValuationForm(p => ({
                                      ...p,
                                      diasDisponibles: selected
                                        ? p.diasDisponibles.filter((d: string) => d !== dia)
                                        : [...p.diasDisponibles, dia],
                                    }))
                                  }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.03)',
                                    color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                                    border: '1px solid transparent',
                                    boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
                                  }}
                                  onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
                                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                >
                                  <motion.img
                                    src={calendarImg}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 48 : 24,
                                      height: selected ? 48 : 24,
                                      marginTop: selected ? -24 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span className="text-sm">{dia}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 6: Observaciones finales ═══════ */}
                    {valuationStep === 6 && (
                      <div className="space-y-5">
                        <div className="flex flex-col gap-1">
                          <textarea
                            value={valuationForm.observacionesFinales}
                            readOnly={valuationViewMode}
                            onChange={e => setValuationForm(p => ({ ...p, observacionesFinales: e.target.value }))}
                            placeholder="Escribe aquí las observaciones finales..."
                            rows={6}
                            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none"
                            style={{
                              background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                              color: '#1A1A1E',
                              border: '1px solid transparent',
                            }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                  )}
                </div>

                {/* Footer */}
                {!valuationSuccess && (
                <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                  <div className="relative flex items-center justify-between">
                    {valuationViewMode && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04, boxShadow: '0 10px 28px rgba(124,58,237,0.45)', transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.94, boxShadow: '0 2px 8px rgba(124,58,237,0.2)', transition: { duration: 0.1 } }}
                        onClick={startAiRoutine}
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, #BF5AF2, #7C3AED)',
                          boxShadow: '0 8px 22px rgba(124,58,237,0.3)',
                        }}
                      >
                        <Sparkles size={14} />
                        Generar rutina con IA
                      </motion.button>
                    )}
                    <div className="flex-1 flex justify-start">
                      {valuationStep > 1 ? (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setValuationStep(s => s - 1)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                          Atrás
                        </motion.button>
                      ) : <div />}
                    </div>

                    <div className="flex-1 flex justify-end">
                      <motion.button
                        type="button"
                        whileHover={valuationStep < 6 ? { scale: 1.04, boxShadow: '0 8px 25px rgba(18,112,183,0.35)', transition: { duration: 0.15 } } : {}}
                        whileTap={valuationStep < 6 ? { scale: 0.92, boxShadow: '0 2px 8px rgba(18,112,183,0.2)', transition: { duration: 0.1 } } : {}}
                        onClick={() => {
                          if (valuationStep < 6) {
                            setValuationStep(s => s + 1)
                          } else if (valuationViewMode) {
                            onClose()
                          } else {
                            onSave()
                          }
                        }}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{
                          background: !valuationViewMode && valuationStep === 6 ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #1270B7, #7ec8e3)',
                        }}
                      >
                        {valuationStep === 6 && valuationViewMode ? (
                          <>Cerrar</>
                        ) : valuationStep === 6 ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Guardar Valoración
                          </>
                        ) : (
                          <>
                            Siguiente
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  )
}