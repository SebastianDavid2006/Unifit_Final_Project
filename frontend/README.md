
# Generar aplicación según instrucciones

This is a code bundle for Generar aplicación según instrucciones. The original project is available at https://www.figma.com/design/ftiUC2K6Tuu9Gojrs5sCqo/Generar-aplicaci%C3%B3n-seg%C3%BAn-instrucciones.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Estructura del código (`src/`)

La aplicación separa **vistas** (lo que se ve y coordina cada rol) de **módulos compartidos** (funcionalidad reutilizada por más de un rol).

```
src/
├─ app/                 # Punto de entrada: App.tsx decide qué vista mostrar según el rol
├─ views/               # UNA CARPETA POR ROL/VISTA
│  ├─ login/            #   LoginView.tsx — pantalla de selección de rol
│  ├─ trainer/          #   Entrenador (TrainerView + sidebar + topbar + dashboard)
│  ├─ admin/            #   Administración (AdminView + todos sus paneles)
│  └─ student/          #   Estudiante (StudentView — app móvil autocontenida)
├─ modules/             # Módulos COMPARTIDOS entre roles
│  ├─ students/         #   Gestión de estudiantes (usada por entrenador y admin)
│  ├─ agenda/           #   Agenda/citas (usada por entrenador y admin)
│  └─ equipment/        #   Gestión de máquinas y ejercicios (usada por entrenador y admin)
├─ data/                # Datos mock, tipos y constantes globales
├─ assets/              # Imágenes, modelos 3D, iconos e ilustraciones
├─ components/          # Componentes UI reutilizables (shadcn/ui, etc.)
└─ imports/             # Texto/documentación de referencia (markdown)
```

### Regla general

- **`views/`** contiene TODO lo exclusivo de un rol: su shell, navegación y paneles propios.
  No puede ser importado por otro rol.
- **`modules/`** contiene funcionalidad *compartida*: `StudentProfile`, `StudentsModule`,
  `AgendaModule` y `EquipmentPage` los usan tanto el entrenador (`TrainerView`) como el
  administrador (`AdminGym`).
- Un rol nunca importa de la carpeta `views/` de otro rol. Los archivos que antes vivían en
  `pages/` ahora viven en `views/<rol>/` (p. ej. `pages/AdminPage.tsx` → `views/admin/AdminView.tsx`).
- `app/App.tsx` es el único punto de unión: monta `LoginView`, `TrainerView`, `AdminView` o
  `StudentView` según el rol seleccionado.

### Notas

- Los módulos compartidos grandes se dividen para mantenerlos legibles:
  `StudentProfile` usa `StudentProfileData.ts` + `tabs/`, `NewStudentModal` usa
  `NewStudentData.ts`, y `AgendaModule` usa `AgendaData.ts` + `AgendaDayCard.tsx`.
- `modules/admin/` fue reemplazado por `views/admin/`: sus componentes (`AdminDashboard`,
  `AdminTrainers`, `AdminGym`, `AdminConfig`, `AdminStats`, `NewUserModal`, etc.) eran
  exclusivos del administrador y ahora viven en su vista.
