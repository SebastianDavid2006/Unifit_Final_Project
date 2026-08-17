import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { BLUE, BLUE_GRAD } from '@/modules/students/NewStudentData'
import parqBanner from '@/assets/illustrations/banners/parq_banner.webp'
import type { StoredDocs } from '@/data/documents'

interface StepDocAgreementProps {
  step: number
  docs: StoredDocs
  aceptaDatos: boolean
  setAceptaDatos: (val: boolean) => void
  aceptaContrato: boolean
  setAceptaContrato: (val: boolean) => void
  aceptaParq: boolean
  setAceptaParq: (val: boolean) => void
}

export function StepDocAgreement({
  step,
  docs,
  aceptaDatos,
  setAceptaDatos,
  aceptaContrato,
  setAceptaContrato,
  aceptaParq,
  setAceptaParq,
}: StepDocAgreementProps) {
  if (step === 2) {
    return (
      <div className="space-y-5">
        {docs.tratamiento.dataUrl ? (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <iframe src={docs.tratamiento.dataUrl} title="Tratamiento de datos" className="w-full h-[280px] bg-white" />
          </div>
        ) : (
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
        )}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAceptaDatos(!aceptaDatos)}
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
            style={{
              background: aceptaDatos ? BLUE_GRAD : 'transparent',
              border: `1.5px solid ${aceptaDatos ? BLUE : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {aceptaDatos && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Check size={12} color="white" strokeWidth={3} />
              </motion.span>
            )}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.6,
              color: aceptaDatos ? 'transparent' : 'rgba(0,0,0,0.55)',
              background: aceptaDatos ? BLUE_GRAD : 'none',
              backgroundClip: aceptaDatos ? 'text' : 'none',
              WebkitBackgroundClip: aceptaDatos ? 'text' : 'none',
            }}
          >
            Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de UniFit.
          </span>
        </label>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="space-y-5">
        {docs.contrato.dataUrl ? (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <iframe src={docs.contrato.dataUrl} title="Contrato" className="w-full h-[340px] bg-white" />
          </div>
        ) : (
          <div className="rounded-2xl p-5 text-xs leading-relaxed max-h-[280px] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.02)', color: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <p className="font-bold text-sm mb-3" style={{ color: '#1A1A1E' }}>Contrato de prestación de servicios estudiantiles</p>
            <p className="mb-3">
              El presente contrato regula la relación entre UniFit S.A.S., en adelante "LA INSTITUCIÓN", y el estudiante que se registra a través del presente formulario, en adelante "EL ESTUDIANTE".
            </p>
            <p className="mb-3">
              <strong>CLÁUSULA PRIMERA – OBJETO:</strong> LA INSTITUCIÓN se compromete a proporcionar al ESTUDIANTE los servicios de entrenamiento y acompañamiento deportivo contratados, de acuerdo con el programa académico y la modalidad seleccionada en el formulario de registro.
            </p>
            <p className="mb-3">
              <strong>CLÁUSULA SEGUNDA – OBLIGACIONES DEL ESTUDIANTE:</strong> El ESTUDIANTE se obliga a asistir puntualmente a las sesiones programadas, cumplir con las normas internas de LA INSTITUCIÓN, utilizar adecuadamente las instalaciones y equipos, y mantener una conducta respetuosa hacia el personal y demás estudiantes.
            </p>
            <p className="mb-3">
              <strong>CLÁUSULA TERCERA – OBLIGACIONES DE LA INSTITUCIÓN:</strong> LA INSTITUCIÓN se obliga a proporcionar entrenadores calificados, mantener las instalaciones en condiciones óptimas de seguridad e higiene, y garantizar la prestación del servicio de acuerdo con los estándares de calidad establecidos.
            </p>
            <p className="mb-3">
              <strong>CLÁUSULA CUARTA – VALOR Y FORMA DE PAGO:</strong> El valor del programa será el establecido en la tarifa vigente al momento de la matrícula. EL ESTUDIANTE acepta realizar los pagos en las fechas y montos acordados.
            </p>
            <p className="mb-3">
              <strong>CLÁUSULA QUINTA – TERMINACIÓN:</strong> El presente contrato podrá ser terminado por cualquiera de las partes mediante comunicación escrita con quince (15) días de antelación, o de forma inmediata por incumplimiento grave de las obligaciones aquí establecidas.
            </p>
            <p>
              <strong>CLÁUSULA SEXTA – ACEPTACIÓN:</strong> Las partes aceptan el presente contrato y se obligan a su cumplimiento en todos sus términos.
            </p>
          </div>
        )}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAceptaContrato(!aceptaContrato)}
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
            style={{
              background: aceptaContrato ? BLUE_GRAD : 'transparent',
              border: `1.5px solid ${aceptaContrato ? BLUE : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {aceptaContrato && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Check size={12} color="white" strokeWidth={3} />
              </motion.span>
            )}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.6,
              color: aceptaContrato ? 'transparent' : 'rgba(0,0,0,0.55)',
              background: aceptaContrato ? BLUE_GRAD : 'none',
              backgroundClip: aceptaContrato ? 'text' : 'none',
              WebkitBackgroundClip: aceptaContrato ? 'text' : 'none',
            }}
          >
            Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit.
          </span>
        </label>
      </div>
    )
  }

  // Step 4: PAR-Q
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-5">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {docs.parq.dataUrl ? (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <iframe src={docs.parq.dataUrl} title="PAR-Q" className="w-full h-[280px] bg-white" />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <img src={parqBanner} alt="Cuestionario PAR-Q" className="w-full h-auto object-cover" />
          </div>
        )}
      </div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAceptaParq(!aceptaParq)}
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
          style={{
            background: aceptaParq ? BLUE_GRAD : 'transparent',
            border: `1.5px solid ${aceptaParq ? BLUE : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {aceptaParq && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Check size={12} color="white" strokeWidth={3} />
            </motion.span>
          )}
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.6,
            color: aceptaParq ? 'transparent' : 'rgba(0,0,0,0.55)',
            background: aceptaParq ? BLUE_GRAD : 'none',
            backgroundClip: aceptaParq ? 'text' : 'none',
            WebkitBackgroundClip: aceptaParq ? 'text' : 'none',
          }}
        >
          He completado el cuestionario PAR-Q y acepto continuar con mi registro.
        </span>
      </label>
    </div>
  )
}
