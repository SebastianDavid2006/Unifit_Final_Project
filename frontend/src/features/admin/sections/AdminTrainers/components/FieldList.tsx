export default function FieldList({ fields, labelMb = 0.5, itemPb = 6, editable = false }: {
  fields: { label: string; value: string }[]
  labelMb?: number
  itemPb?: number
  editable?: boolean
}) {
  return (
    <div className="flex flex-col">
      {fields.map((field, fi, arr) => (
        <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? itemPb : 0 }}>
          {editable ? (
            <div>
              <p className="text-xs" style={{ marginBottom: labelMb, color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
              <input
                type="text"
                value={field.value}
                className="text-base font-semibold w-full border rounded p-1"
                style={{ color: '#0D1B2A' }}
              />
            </div>
          ) : (
            <p className="text-xs" style={{ marginBottom: labelMb, color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
            <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
          )}
        </div>
      ))}
    </div>
  )
}
