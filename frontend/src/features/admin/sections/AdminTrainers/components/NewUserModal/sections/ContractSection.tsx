import ConsentCheckbox from '../components/ConsentCheckbox'

export default function ContractSection({ accepted, onChange }: {
  accepted: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-5">
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
      <ConsentCheckbox
        checked={accepted}
        onChange={onChange}
        label="Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit."
      />
    </div>
  )
}
