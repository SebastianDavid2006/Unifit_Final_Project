import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import ChartCard from '../components/ChartCard'
import ChartTooltip from '../components/ChartTooltip'
import ChartTitle from '../components/ChartTitle'
import { weeklyAttendance } from '../data'

export default function WeeklyAttendanceChart() {
  return (
    <ChartCard delay={0.25}>
      <ChartTitle>ASISTENCIA SEMANAL</ChartTitle>
      <div style={{ overflow: 'visible' }} className="no-clip-chart">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyAttendance} margin={{ top: 40, bottom: 0, left: 0, right: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.12)" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }: any) => (
                <g transform={`translate(${x},${y})`}>
                  <text x={0} y={0} dy={16} textAnchor="middle" fontSize={13} fontWeight={700} fill={payload.value === 'Hoy' ? '#30D158' : 'rgba(0,0,0,0.8)'}>
                    {payload.value}
                  </text>
                </g>
              )}
            />
            <YAxis hide />
            <Tooltip content={<ChartTooltip />} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGreenGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#30D158" stopOpacity={1} />
                <stop offset="100%" stopColor="#30D158" stopOpacity={0.2} />
              </linearGradient>
              <filter id="glowToday" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feFlood floodColor="#30D158" floodOpacity="0.35" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <Bar dataKey="asistentes" radius={[12, 12, 0, 0]} className="bar-hover">
              {weeklyAttendance.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isToday ? 'url(#barGreenGlow)' : 'url(#barGradient)'}
                  filter={entry.isToday ? 'url(#glowToday)' : undefined}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
              ))}
              <LabelList
                dataKey="asistentes"
                position="top"
                content={({ x, y, width, value, index }: any) => {
                  const entry = weeklyAttendance[index]
                  const isToday = entry?.isToday
                  const label = isToday ? 'Hoy' : value
                  const pillW = isToday ? 50 : 30
                  return (
                    <g>
                      <rect
                        x={x + width / 2 - pillW / 2}
                        y={y - 22}
                        width={pillW}
                        height={18}
                        rx={9}
                        fill={isToday ? '#30D158' : 'rgba(18,112,183,0.1)'}
                      />
                      <text
                        x={x + width / 2}
                        y={y - 10}
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={800}
                        fill={isToday ? '#FFFFFF' : '#1270B7'}
                      >
                        {label}
                      </text>
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
