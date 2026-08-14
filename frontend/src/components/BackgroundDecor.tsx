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
  const defaultSpheres: FloatingSphereStyle[] = [
    { width: 600, height: 600, background: 'radial-gradient(circle, rgba(18,112,183,0.25), transparent 60%)', top: '-180px', right: '-120px' },
    { width: 450, height: 450, background: 'radial-gradient(circle, rgba(244,56,67,0.2), transparent 60%)', bottom: '5%', left: '-120px' },
    { width: 350, height: 350, background: 'radial-gradient(circle, rgba(241,200,39,0.18), transparent 60%)', top: '25%', right: '15%' },
  ]
  const items = spheres ?? defaultSpheres

  return (
    <>
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
    </>
  )
}
