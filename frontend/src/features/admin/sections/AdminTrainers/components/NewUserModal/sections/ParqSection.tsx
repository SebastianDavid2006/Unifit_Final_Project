import ConsentCheckbox from '../components/ConsentCheckbox'
import parqBanner from '@/assets/illustrations/banners/parq_banner.webp'

export default function ParqSection({ accepted, onChange }: {
  accepted: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-5">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <img src={parqBanner} alt="Cuestionario PAR-Q" className="w-full h-auto object-cover" />
        </div>
      </div>
      <ConsentCheckbox
        checked={accepted}
        onChange={onChange}
        label="He completado el cuestionario PAR-Q y acepto continuar con mi registro."
      />
    </div>
  )
}
