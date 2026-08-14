import { motion, AnimatePresence } from 'motion/react'
import permissionsScene from '@/assets/scenes/permmisions_scene.png'

export default function PermissionsOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ filter: 'blur(24px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          exit={{ filter: 'blur(24px)', opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 pointer-events-none"
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${permissionsScene})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }} />
          <div className="absolute inset-0" style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            maskImage: 'radial-gradient(ellipse at center, transparent 50%, black 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 50%, black 75%)',
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
