export default function BackgroundDecor() {
  return (
    <>
      <div className="floating-sphere" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(18,112,183,0.25), transparent 60%)', top: '-180px', right: '-120px' }} />
      <div className="floating-sphere" style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(244,56,67,0.2), transparent 60%)', bottom: '5%', left: '-120px' }} />
      <div className="floating-sphere" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(241,200,39,0.18), transparent 60%)', top: '25%', right: '15%' }} />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8" result="goo" />
          </filter>
        </defs>
      </svg>
    </>
  )
}
