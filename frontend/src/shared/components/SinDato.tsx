// Marcador de un dato vacío: gris y en cursiva para distinguirlo de los valores reales
export default function SinDato({ texto = 'No registrado' }: { texto?: string }) {
  return <span className="italic font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>{texto}</span>
}
