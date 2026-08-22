export const personalSections = [
  {
    title: 'Información personal',
    items: [
      { key: 'firstName', label: 'Primer nombre', value: 'Ana', editable: true },
      { key: 'secondName', label: 'Segundo nombre', value: 'Lucía', editable: true },
      { key: 'lastName', label: 'Primer apellido', value: 'García', editable: true },
      { key: 'secondLastName', label: 'Segundo apellido', value: 'Restrepo', editable: true },
      { key: 'documentType', label: 'Tipo de documento', value: 'CC', editable: false },
      { key: 'documentNumber', label: 'Número de documento', value: '1.021.334.556', editable: false },
      { key: 'birthDate', label: 'Fecha de nacimiento', value: '14/03/2004', editable: true },
      { key: 'gender', label: 'Género', value: 'Femenino', editable: true },
    ],
  },
  {
    title: 'Información de contacto',
    items: [
      { key: 'email', label: 'Email', value: 'ana.garcia@ucol.edu.co', editable: true },
      { key: 'phone', label: 'Teléfono', value: '+57 312 456 7890', editable: true },
    ],
  },
  {
    title: 'Información médica',
    items: [
      { key: 'eps', label: 'EPS', value: 'Sanitas', editable: true },
      { key: 'bloodType', label: 'Grupo sanguíneo', value: 'O+', editable: true },
      { key: 'contactName', label: 'Nombre contacto', value: 'María García', editable: true },
      { key: 'contactPhone', label: 'Teléfono contacto', value: '+57 310 222 3344', editable: true },
      { key: 'contactRelation', label: 'Parentesco', value: 'Madre', editable: true },
    ],
  },
  {
    title: 'Rol en la universidad',
    items: [{ key: 'role', label: 'Rol', value: 'Estudiante', editable: false }],
  },
  {
    title: 'Información académica',
    items: [
      { key: 'carnetId', label: 'Número carnet', value: 'U-2021-10458', editable: false },
      { key: 'status', label: 'Estado', value: 'Activo', editable: false },
      { key: 'institution', label: 'Institución', value: 'Universitaria de Colombia', editable: false },
      { key: 'modality', label: 'Modalidad', value: 'Presencial', editable: false },
      { key: 'formationLevel', label: 'Nivel de formación', value: 'Profesional', editable: false },
      { key: 'career', label: 'Carrera', value: 'Ingeniería de Sistemas', editable: false },
      { key: 'semester', label: 'Semestre', value: '7', editable: false },
      { key: 'schedule', label: 'Jornada', value: 'Diurna', editable: false },
    ],
  },
]
