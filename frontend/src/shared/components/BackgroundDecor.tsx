import { useIsMobile } from '@/shared/components/ui/use-mobile'

export interface FloatingSphereStyle {
  width?: number
  height?: number
  background?: string
  top?: string
  right?: string
  bottom?: string
  left?: string
  animationDelay?: string
}

export default function BackgroundDecor({ spheres, goo = true }: {
  spheres?: FloatingSphereStyle[]
  goo?: boolean
}) {
  const isMobile = useIsMobile()
  
  const defaultSpheres: FloatingSphereStyle[] = [
    { width: 600, height: 600, background: 'radial-gradient(circle, rgba(18,112,183,0.25), transparent 60%)', top: '-180px', right: '-120px' },
    { width: 450, height: 450, background: 'radial-gradient(circle, rgba(244,56,67,0.2), transparent 60%)', bottom: '5%', left: '-120px' },
    { width: 350, height: 350, background: 'radial-gradient(circle, rgba(241,200,39,0.18), transparent 60%)', top: '25%', right: '15%' },
  ]
  
  const mobileSpheres: FloatingSphereStyle[] = [
    { width: 280, height: 280, background: 'radial-gradient(circle, rgba(18,112,183,0.15), transparent 60%)', top: '-60px', right: '-40px' },
    { width: 200, height: 200, background: 'radial-gradient(circle, rgba(244,56,67,0.1), transparent 60%)', bottom: '10%', left: '-40px' },
    { width: 180, height: 180, background: 'radial-gradient(circle, rgba(241,200,39,0.08), transparent 60%)', top: '30%', right: '10%' },
  ]
  
  const items = spheres ?? (isMobile ? mobileSpheres : defaultSpheres)

  return (
    <div className="overflow-hidden" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {items.map((s, i) => (
        <div key={i} className="floating-sphere" style={{
          width: s.width,
          height: s.height,
          background: s.background,
          top: s.top,
          right: s.right,
          bottom: s.bottom,
          left: s.left,
          animationDelay: s.animationDelay,
        }} />
      ))}
      {goo && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8" result="goo" />
            </filter>
          </defs>
        </svg>
      )}
    </div>
  )
}
