import { motion } from 'motion/react'
import weightLossIcon from '@/assets/icons/objects/metric_belt.webp'
import armIcon2 from '@/assets/icons/objects/dumbbel.webp'
import shoesIcon from '@/assets/icons/objects/shoes.webp'
import healthIcon from '@/assets/icons/health/health.webp'
import trophyIcon from '@/assets/icons/objects/trophy.webp'
import otroIcon from '@/assets/icons/ui/star.webp'
import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface Step1ContextoProps {
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationViewMode: boolean
}

const OBJETIVOS = [
  { value: 'Perdida de peso', icon: weightLossIcon },
  { value: 'Ganancia muscular', icon: armIcon2 },
  { value: 'Acondicionamiento fisico', icon: shoesIcon },
  { value: 'Salud', icon: healthIcon },
  { value: 'Rendimiento deportivo', icon: trophyIcon },
  { value: 'Otro', icon: otroIcon },
] as const

export function Step1Contexto({ valuationForm, setValuationForm, valuationViewMode }: Step1ContextoProps) {
  return (
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
            <option value="sedentario">Sedentario</option>
            <option value="ligero">Ligero</option>
            <option value="moderado">Moderado</option>
            <option value="activo">Activo</option>
            <option value="muy_activo">Muy activo</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-hover:opacity-60" style={{ color: 'rgba(0,0,0,0.2)' }}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Objetivo del usuario</label>
        <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más objetivos. Si seleccionas "Otro", los demás se deseleccionan.</p>
        <div className="grid grid-cols-3 gap-2">
          {OBJETIVOS.map(item => {
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
                disabled={valuationViewMode || disabled}
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
  )
}