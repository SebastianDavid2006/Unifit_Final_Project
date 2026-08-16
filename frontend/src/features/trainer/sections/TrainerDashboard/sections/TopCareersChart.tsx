import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import ChartCard from '../components/ChartCard'
import ChartTitle from '../components/ChartTitle'
import { topCareers } from '../data'

const shownCareers = topCareers.slice(0, 5)
const BAR_BLUE = '#2563EB'

export default function TopCareersChart() {
  return (
    <ChartCard delay={0.3}>
      <ChartTitle>CARRERAS CON MÁS ASISTENCIA</ChartTitle>
      <div style={{ overflow: 'visible' }} className="no-clip-chart">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={shownCareers} margin={{ top: 40, bottom: 0, left: 0, right: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.12)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fontSize: 13, fontWeight: 700, fill: 'rgba(0,0,0,0.8)' }}
              tickMargin={8}
            />
            <YAxis hide domain={[0, 50]} />
            <Tooltip
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null
                const entry = payload[0]
                return (
                  <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 14,
                    padding: '12px 18px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  }}>
                    <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 11, marginBottom: 4, fontWeight: 500 }}>{entry.payload.name}</p>
                    <p style={{ color: BAR_BLUE, fontSize: 14, fontWeight: 700 }}>{entry.value} <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400, fontSize: 12 }}>estudiantes</span></p>
                  </div>
                )
              }}
            />
            <defs>
              <linearGradient id="gradTopBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Bar dataKey="students" radius={[8, 8, 0, 0]} className="bar-hover" fill="url(#gradTopBlue)">
              <LabelList
                dataKey="students"
                position="top"
                content={({ x, y, width, value }: any) => {
                  const pillW = 26
                  return (
                    <g>
                      <rect x={x + width / 2 - pillW / 2} y={y - 20} width={pillW} height={17} rx={8.5} fill="rgba(0,0,0,0.08)" />
                      <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize={10} fontWeight={800} fill="rgba(0,0,0,0.7)">{value}</text>
                    </g>
                  )
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
