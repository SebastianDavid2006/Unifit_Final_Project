import { useState, useRef } from 'react'
import gymBg from '../../assets/scenes/login_screen.mp4'

export function LoginBackground() {
  const [opacityA, setOpacityA] = useState(1)
  const [opacityB, setOpacityB] = useState(0)
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)
  const crossfading = useRef(false)

  const triggerCrossfade = (from: HTMLVideoElement, to: HTMLVideoElement, fadeTo: () => void) => {
    if (crossfading.current) return
    crossfading.current = true
    to.currentTime = 0
    to.play()
    fadeTo()
    setTimeout(() => {
      from.pause()
      from.currentTime = 0
      if (from === videoARef.current) setOpacityA(0)
      else setOpacityB(0)
      crossfading.current = false
    }, 2200)
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget
    if (v.currentTime >= (v.duration || 0) - 2.2) {
      if (v === videoARef.current) {
        if (videoBRef.current) triggerCrossfade(v, videoBRef.current, () => setOpacityB(1))
      } else if (videoARef.current) {
        triggerCrossfade(v, videoARef.current, () => setOpacityA(1))
      }
    }
  }

  return (
    <>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoARef}
          src={gymBg}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ opacity: opacityA }}
        />
        <video
          ref={videoBRef}
          src={gymBg}
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ opacity: opacityB }}
        />
        <div className="absolute inset-0" style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }} />
      </div>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(115deg, rgba(8,12,28,0.55) 0%, rgba(8,12,28,0.3) 45%, rgba(8,12,28,0.16) 100%)',
      }} />
    </>
  )
}
