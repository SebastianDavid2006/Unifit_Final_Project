import ConsentCheckbox from '../components/ConsentCheckbox'
import contractIUDCBanner from '@/assets/illustrations/banners/contractIUDC_banner.webp'

export default function ContractSection({ accepted, onChange }: {
  accepted: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <img src={contractIUDCBanner} alt="Contrato de prestación de servicios estudiantiles" className="w-full h-auto object-cover" />
      </div>
      <ConsentCheckbox
        checked={accepted}
        onChange={onChange}
        label="Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit."
      />
    </div>
  )
}
