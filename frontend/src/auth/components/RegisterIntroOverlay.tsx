import { motion } from 'motion/react'

interface RegisterIntroOverlayProps {
  src: string
  videoRef: React.Ref<HTMLVideoElement>
  containerRef?: React.Ref<HTMLDivElement>
  onSkip: () => void
}

export function RegisterIntroOverlay({ src, videoRef, containerRef, onSkip }: RegisterIntroOverlayProps) {
  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-50 overflow-hidden cursor-pointer"
      style={{ background: '#000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSkip}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={onSkip}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </motion.div>
  )
}