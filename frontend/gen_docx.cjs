// Generador simple - usa async/await + Packer.toBuffer sin opciones
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell } = require('docx');

const OUT_DIR = 'C:\\Users\\LENOVO I5\\Desktop';
const OUT_FILE = path.join(OUT_DIR, 'Contrato_Auth_UNIFIT.docx');

function H1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, children: [new TextRun({ text: t, bold: true, size: 28 })] }); }
function H2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun({ text: t, bold: true, size: 24 })] }); }
function P(t) { return new Paragraph({ children: [new TextRun({ text: t })] }); }
function Code(t) { return new Paragraph({ children: [new TextRun({ text: t, font: 'Consolas', size: 20 })] }); }
function Bullet(t) { return new Paragraph({ bullet: { level: 0 }, children: [new TextRun(t)] }); }

function tbl(headers, rows) {
  const mkCell = (t, b = false) => new TableCell({ children: [new TextRun({ text: String(t), bold: b, size: 20 })] });
  const headRow = new TableRow({ repeat: true, children: headers.map((h) => mkCell(h, true)) });
  const bodyRows = rows.map((r) => new TableRow({ children: r.map((c) => mkCell(c)) }));
  return new Table({ rows: [headRow, ...bodyRows] });
}

const children = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: 'UNIFIT', size: 40, bold: true }), new TextRun({ text: ' - Contrato de Autenticacion (Frontend -> Backend)', size: 28 })] }),
  new Paragraph('Documento de referencia para el backend. Describe que espera el frontend tras la reorganizacion del modulo auth.'),
  new Paragraph('Version: 1.0 · Proyecto de grado UNIFIT · Frontend Vite + React 18'),
  new Paragraph({ text: '—', alignment: 'center' }),

  H1('1. Introduccion'),
  P('El frontend consume una API REST de autenticacion. Actualmente el auth esta implementado con MOCKS en localStorage, pero la arquitectura esta preparada para un backend real.'),
  P('Roles: "entrenador" (UI trainer), "admin" (UI admin), "estudiante" (UI student).'),
  P('IMPORTANTE: el frontend NO persiste la sesion/token entre recargas (mock). Backend debe devolver accessToken+refresh en httpOnly cookies.'),

  H1('2. Modelos de datos'),
  H2('2.1 Usuario'),
  Code('interface MockUser { id: string; email: string; password: string; // solo backend'),
  Code('  rol: "entrenador" | "admin" | "estudiante";'),
  Code('  estado: "en_proceso" | "activo";'),
  Code('  debeCambiarContrasena: boolean;'),
  Code('  onboarding: { cita: boolean; firma: boolean; huella: boolean };'),
  Code('  nombre?: string; cita?: { fecha: string; hora: string } }'),
  P('estado "en_proceso" = pendiente onboarding. debeCambiarContrasena=true fuerza ChangePasswordPage.'),

  H2('2.2 Sesion'),
  Code('interface MockSession { user: MockUser; token: string }'),
  P('token se pasa como Bearer en requests siguientes.'),

  H1('3. Usuarios de prueba (seed)'),
  tbl(['identifier', 'password', 'rol', 'estado', 'debeCambiar', 'flujo'], [
    ['entrenador', 'entrenador123', 'entrenador', 'activo', 'false', 'Login -> UI trainer'],
    ['admin', 'admin123', 'admin', 'activo', 'false', 'Login -> UI admin'],
    ['estudiante', 'estudiante123', 'estudiante', 'en_proceso', 'true', 'Login -> ChangePassword -> Onboarding'],
    ['estudiante2', 'estudiante123', 'estudiante', 'activo', 'false', 'Login -> StudentPage'],
    ['test', 'test', 'entrenador', 'activo', 'true', 'Login -> ChangePassword -> trainer'],
  ]),

  H1('4. Endpoints'),
  H2('4.1 POST /api/auth/login'),
  Code('Body: { "identifier": "<email|user>", "password": "<string>" }'),
  P('200 -> { "user": MockUser, "token": "<jwt>" } | 401/404'),

  H2('4.2 POST /api/auth/change-password'),
  Code('Auth: Bearer <token>'),
  Code('Body: { "currentPassword", "newPassword" }'),
  P('200 -> { ok: true } | 400/401. Frontend pone debeCambiarContrasena=false.'),

  H2('4.3 POST /api/auth/register'),
  Code('Body: { email, nombre, rol: "estudiante", tipoUsuario, ...formulario }'),
  P('201 -> { user: MockUser, tempPassword }. Backend crea estado=en_proceso, debeCambiar=true, onboarding={f,f,f}.'),

  H2('4.4 POST /api/auth/forgot-password (3 pasos)'),
  Code('1. request  { email } -> 200 { code: "6 digitos", expiresIn: 300 }'),
  Code('2. verify   { email, code } -> 200/400'),
  Code('3. reset    { email, newPassword } -> 200 { ok } | 400'),

  H2('4.5 GET /api/auth/me'),
  Code('Returns MockUser del token. Hidrata sesion al recargar.'),

  H2('4.6 POST /api/auth/logout'),
  Code('Invalida refresh token. Frontend -> /login.'),

  H1('5. Onboarding estudiantes'),
  P('StudentOnboardingGate lee session.user.onboarding { cita, firma, huella }'),
  Bullet('cita=false -> agendar cita (SchedulePicker)'),
  Bullet('firma=false -> firma digital (SignaturePad)'),
  Bullet('huella=false -> captura huella (FingerprintCapture)'),
  P('onboarding completo (true,true,true) -> desbloquea StudentPage.'),

  H1('6. Almacenamiento token (recomendado)'),
  P('accessToken 15min + refreshToken httpOnly, Secure, SameSite=Strict cookies. Frontend no toca token (evita XSS).'),
  P('Si localStorage inevitable: clave "unifit_token" con exp en JWT.'),

  H1('7. Mock vs Backend esperado'),
  tbl(['Funcion', 'Mock actual', 'Backend esperado'], [
    ['Login', 'localStorage, password ===', 'POST /api/auth/login, bcrypt, jwt'],
    ['Users', 'localStorage seedUsers()', 'DB users (id, email, pass_hash, rol, estado, onboarding JSON)'],
    ['Mail inbox', 'localStorage INBOX_KEY', 'SMTP, code 6 digitos, tempPassword'],
    ['Sesion persistente', 'NO (useState)', 'httpOnly cookies, /auth/me'],
    ['Refresh', 'No', 'POST /api/auth/refresh'],
    ['Logout', 'No invalida', 'POST /api/auth/logout -> borra refresh'],
  ]),

  H1('8. Seguridad'),
  Bullet('Nunca devolver password (solo tempPassword al crear).'),
  Bullet('Verificar email antes de login; estudiante inicia en estado=en_proceso.'),
  Bullet('Rate-limit login/forgot.'),
  Bullet('Bloquear /student hasta onboarding completo.'),
  Bullet('HTTPS obligatorio; cookies Secure.'),

  new Paragraph({ text: '— Fin —', alignment: 'center' }),
];

const doc = new Document({
  title: 'Contrato de Autenticacion - UNIFIT',
  sections: [{ children }],
});

async function main() {
  try {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(OUT_FILE, buffer);
    console.log('Generado:', OUT_FILE, '(' + buffer.length + ' bytes)');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();