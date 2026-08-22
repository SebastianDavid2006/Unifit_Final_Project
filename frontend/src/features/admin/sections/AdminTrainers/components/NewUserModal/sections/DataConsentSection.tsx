import ConsentCheckbox from '../components/ConsentCheckbox'
import dataProcessingBanner from '@/assets/illustrations/banners/data_proccesing_banner.webp'

export default function DataConsentSection({ accepted, onChange }: {
  accepted: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <img src={dataProcessingBanner} alt="Autorización para el tratamiento de datos personales" className="w-full h-auto object-cover" />
      </div>
      <ConsentCheckbox
        checked={accepted}
        onChange={onChange}
        label="Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de UniFit."
      />
    </div>
  )
}
