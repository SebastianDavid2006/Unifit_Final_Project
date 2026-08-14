import ConsentCheckbox from '../components/ConsentCheckbox'

export default function DataConsentSection({ accepted, onChange }: {
  accepted: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 text-xs leading-relaxed max-h-[280px] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.02)', color: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <p className="font-bold text-sm mb-3" style={{ color: '#1A1A1E' }}>Autorización para el tratamiento de datos personales</p>
        <p className="mb-3">
          En cumplimiento de la Ley 1581 de 2012 y sus decretos reglamentarios, UniFit S.A.S. en calidad de responsable del tratamiento de datos personales, solicita su autorización para recolectar, almacenar, usar, circular y suprimir los datos personales suministrados en el presente formulario, con la finalidad de gestionar su registro como estudiante, llevar a cabo el seguimiento académico, realizar comunicaciones institucionales, enviar información sobre programas y servicios, y cumplir con obligaciones legales y contractuales.
        </p>
        <p className="mb-3">
          Los datos serán conservados durante el tiempo necesario para cumplir con las finalidades descritas y de acuerdo con las disposiciones legales vigentes. El estudiante podrá ejercer sus derechos de acceso, actualización, rectificación, supresión y revocación de la autorización mediante comunicación escrita dirigida a nuestro correo electrónico: datos@unifit.co.
        </p>
        <p>
          La no autorización implica la imposibilidad de completar el proceso de registro como estudiante de UniFit.
        </p>
      </div>
      <ConsentCheckbox
        checked={accepted}
        onChange={onChange}
        label="Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de UniFit."
      />
    </div>
  )
}
