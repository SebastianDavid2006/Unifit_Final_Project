import { motion, AnimatePresence } from 'motion/react'
import { LogOut } from 'lucide-react'
import { RED_GRAD } from '../data'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

export default function ProfileMenu({ isPermissions, open, onToggle, onLogout }: {
  isPermissions: boolean
  open: boolean
  onToggle: () => void
  onLogout?: () => void
}) {
  const isMobile = useIsMobile()
  return (
    <>
      <div className="relative flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          title="Menú de usuario"
          className={`flex items-center rounded-xl cursor-pointer overflow-hidden ${isMobile ? 'hidden' : ''}`}
          style={{
            height: 38,
            background: isPermissions ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            border: `1px solid ${isPermissions ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)'}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}
        >
          <div
            className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: RED_GRAD }}
          >
            AD
          </div>
        </motion.button>

        <AnimatePresence>
          {open && !isMobile && (
            <>
              <div className="fixed inset-0 z-40" onClick={onToggle} />
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>Admin UNIFIT</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Plataforma de Administración</p>
                </div>
                <motion.button
                  whileHover={{ background: 'rgba(244,56,67,0.06)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onToggle(); onLogout?.() }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-left"
                  style={{ color: '#F43843' }}
                >
                  <LogOut size={14} />
                  Cerrar sesión
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
