export default function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 14,
      padding: '12px 18px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
    }}>
      <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 11, marginBottom: 4, fontWeight: 500 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#1A1A1E', fontSize: 14, fontWeight: 700 }}>
          {p.value} <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400, fontSize: 12 }}>{p.name}</span>
        </p>
      ))}
    </div>
  )
}
