export default function ChartTitle({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-center mb-5">
      <span className="text-[13px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.55)' }}>{children}</span>
    </div>
  )
}
