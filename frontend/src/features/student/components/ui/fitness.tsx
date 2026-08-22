import { ReactNode } from 'react'

export const FIRE = '#E63946'
export const AMBER = '#F5A623'
export const BLUE = '#007AFF'
export const GREEN = '#30D158'
export const INK = '#07070E'

export const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
}

export function GradientBorder({ children, className = '', radius = 20 }: { children: ReactNode; className?: string; radius?: number }) {
  return (
    <div
      className={className}
      style={{
        padding: 1,
        borderRadius: radius,
        background: 'linear-gradient(135deg, rgba(230,57,70,0.55), rgba(245,166,35,0.35) 50%, rgba(230,57,70,0.15))',
        boxShadow: '0 20px 60px rgba(230,57,70,0.12), 0 8px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ borderRadius: radius - 1, background: 'linear-gradient(165deg, #101018 0%, #0A0A14 60%, #0C0C16 100%)', height: '100%' }}>
        {children}
      </div>
    </div>
  )
}

export function SectionTitle({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="h-4 w-1 rounded-full" style={{ background: `linear-gradient(180deg, ${accent || FIRE}, ${AMBER})` }} />
      <h2 className="uppercase italic font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>
        {children}
      </h2>
      <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
    </div>
  )
}

export function FitnessBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 88% -10%, rgba(230,57,70,0.16) 0%, rgba(7,7,14,0) 55%),' +
            'radial-gradient(100% 80% at -10% 110%, rgba(245,166,35,0.11) 0%, rgba(5,5,10,0) 60%),' +
            'linear-gradient(180deg, #08080F 0%, #0A0A14 45%, #06060C 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 28px)',
          maskImage: 'linear-gradient(180deg, transparent 0%, black 25%, black 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 25%, black 75%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 15%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 15%, transparent 72%)',
        }}
      />
      <div
        className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,57,70,0.17), transparent 65%)', filter: 'blur(24px)' }}
      />
      <div
        className="absolute -bottom-48 -left-40 w-[560px] h-[560px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.13), transparent 65%)', filter: 'blur(28px)' }}
      />
      <div
        className="absolute bottom-2 right-2 select-none font-black italic uppercase hidden lg:block"
        style={{
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.045)',
        }}
      >
        UNIFIT
      </div>
    </div>
  )
}

export function GhostBadge({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl px-3 py-2.5 flex items-center gap-2.5" style={{ ...cardStyle, minWidth: 110 }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-black leading-none" style={{ color, fontSize: 16 }}>{value}</p>
        <p className="uppercase tracking-wider truncate" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 600 }}>{label}</p>
      </div>
    </div>
  )
}
