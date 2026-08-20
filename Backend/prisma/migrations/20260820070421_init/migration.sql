-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('admin', 'entrenador', 'usuario');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('estudiante', 'profesor', 'administrativo');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('pendiente', 'activo', 'inactivo');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CC', 'TI', 'CE', 'PA', 'RC');

-- CreateEnum
CREATE TYPE "NivelPrograma" AS ENUM ('especializacion', 'tecnico', 'profesional');

-- CreateEnum
CREATE TYPE "Universidad" AS ENUM ('uni_colombia', 'uni_bogota');

-- CreateEnum
CREATE TYPE "EstadoAgenda" AS ENUM ('pendiente', 'completado', 'cancelado', 'no_asistio');

-- CreateEnum
CREATE TYPE "TipoAgenda" AS ENUM ('valoracion', 'registro', 'seguimiento', 'otro');

-- CreateEnum
CREATE TYPE "ModalidadEstudiante" AS ENUM ('presencial', 'virtual');

-- CreateEnum
CREATE TYPE "JornadaEstudiante" AS ENUM ('diurna', 'nocturna', 'finde');

-- CreateEnum
CREATE TYPE "EstadoRutina" AS ENUM ('activa', 'finalizada', 'cancelada');

-- CreateEnum
CREATE TYPE "EstadoMaquina" AS ENUM ('disponible', 'mantenimiento', 'sin_servicio');

-- CreateEnum
CREATE TYPE "NivelExperiencia" AS ENUM ('principiante', 'intermedio', 'avanzado');

-- CreateEnum
CREATE TYPE "NivelActividad" AS ENUM ('sedentario', 'ligero', 'moderado', 'activo', 'muy_activo');

-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('vigente', 'obsoleto', 'vencido');

-- CreateEnum
CREATE TYPE "EstadoSesionRutina" AS ENUM ('en_progreso', 'finalizada', 'cancelada');

-- CreateEnum
CREATE TYPE "ObjetivoUsuario" AS ENUM ('perdida_peso', 'ganancia_muscular', 'acondicionamiento_fisico', 'salud', 'rendimiento_deportivo', 'otro');

-- CreateEnum
CREATE TYPE "TipoAntecedente" AS ENUM ('osteomuscular', 'respiratorio', 'psiquiatrico', 'cardiovascular', 'metabolico', 'psicologico');

-- CreateEnum
CREATE TYPE "RutinaDuracion" AS ENUM ('cuatro_semanas', 'ocho_semanas', 'doce_semanas', 'dieciseis_semanas');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado');

-- CreateEnum
CREATE TYPE "TipoDocPersonal" AS ENUM ('legal', 'informe_medico', 'lesion_seguimiento');

-- CreateEnum
CREATE TYPE "TipoDocLegal" AS ENUM ('contrato_gym', 'tratamiento_datos');

-- CreateEnum
CREATE TYPE "GrupoMuscular" AS ENUM ('pecho', 'espalda', 'hombros', 'brazos', 'piernas', 'abdomen_core', 'cardio', 'general', 'tren_superior', 'tren_inferior');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('masculino', 'femenino', 'otro');

-- CreateEnum
CREATE TYPE "GrupoSanguineo" AS ENUM ('a_positivo', 'a_negativo', 'b_positivo', 'b_negativo', 'ab_positivo', 'ab_negativo', 'o_positivo', 'o_negativo');

-- CreateEnum
CREATE TYPE "Parentesco" AS ENUM ('padre', 'madre', 'hermano_a', 'abuelo_a', 'tio_a', 'primo_a', 'otro');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" TEXT NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT,
    "primer_apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT,
    "email_contacto" TEXT NOT NULL,
    "telefono_contacto" TEXT,
    "documento" TEXT NOT NULL,
    "tipo_documento" "TipoDocumento" NOT NULL DEFAULT 'CC',
    "fecha_nacimiento" TIMESTAMP(3),
    "genero" "Genero" NOT NULL,
    "genero_otro" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'usuario',
    "tipo_usuario" "TipoUsuario" NOT NULL DEFAULT 'estudiante',
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'pendiente',
    "password_hash" TEXT,
    "debe_cambiar_password" BOOLEAN NOT NULL DEFAULT true,
    "token_activacion" TEXT,
    "token_expira" TIMESTAMP(3),
    "avatar" TEXT,
    "eps" TEXT,
    "eps_certificado" TEXT,
    "grupo_sanguineo" "GrupoSanguineo",
    "nombre_emergencia" TEXT,
    "telefono_emergencia" TEXT,
    "parentesco_emergencia" "Parentesco",
    "parentesco_otro" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,
    "parq_realizado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_parq" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id_estudiante" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_programa" TEXT NOT NULL,
    "numero_carnet" TEXT,
    "semestre" INTEGER,
    "modalidad" "ModalidadEstudiante",
    "jornada" "JornadaEstudiante",
    "es_egresado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id_profesor" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_cargo" TEXT NOT NULL,
    "id_area" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "Administrativo" (
    "id_administrativo" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_cargo" TEXT NOT NULL,
    "id_area" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Administrativo_pkey" PRIMARY KEY ("id_administrativo")
);

-- CreateTable
CREATE TABLE "Acudiente" (
    "id_acudiente" TEXT NOT NULL,
    "id_usuario_acudido" TEXT NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT,
    "primer_apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT,
    "documento" TEXT NOT NULL,
    "tipo_documento" "TipoDocumento" NOT NULL DEFAULT 'CC',
    "telefono_contacto" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acudiente_pkey" PRIMARY KEY ("id_acudiente")
);

-- CreateTable
CREATE TABLE "Programa" (
    "id_programa" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "universidad" "Universidad" NOT NULL,
    "tipo_programa" "NivelPrograma" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programa_pkey" PRIMARY KEY ("id_programa")
);

-- CreateTable
CREATE TABLE "Cargo" (
    "id_cargo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id_cargo")
);

-- CreateTable
CREATE TABLE "Area" (
    "id_area" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id_area")
);

-- CreateTable
CREATE TABLE "Huella" (
    "id_huella" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_sensor" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Huella_pkey" PRIMARY KEY ("id_huella")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id_asistencia" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora_ingreso" TIMESTAMP(3) NOT NULL,
    "hora_salida" TIMESTAMP(3),
    "duracion_minutos" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id_asistencia")
);

-- CreateTable
CREATE TABLE "Valoracion" (
    "id_valoracion" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_creador" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proxima_valoracion" TIMESTAMP(3),
    "objetivos" "ObjetivoUsuario"[],
    "objetivo_detalle" TEXT,
    "nivel_actividad" "NivelActividad" NOT NULL,
    "tipo_antecedentes" "TipoAntecedente"[],
    "observaciones_antecedentes" TEXT,
    "observaciones_finales" TEXT,
    "dias_disponibles" "DiaSemana"[],
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Valoracion_pkey" PRIMARY KEY ("id_valoracion")
);

-- CreateTable
CREATE TABLE "DatosMedicos" (
    "id_datos" TEXT NOT NULL,
    "id_valoracion" TEXT NOT NULL,
    "presion_arterial" TEXT NOT NULL,
    "edad_metabolica" DOUBLE PRECISION NOT NULL,
    "agua_corporal" DOUBLE PRECISION NOT NULL,
    "resistencia_muscular" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DatosMedicos_pkey" PRIMARY KEY ("id_datos")
);

-- CreateTable
CREATE TABLE "MedidasCorporales" (
    "id_medidas" TEXT NOT NULL,
    "id_valoracion" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "estatura" DOUBLE PRECISION NOT NULL,
    "imc" DOUBLE PRECISION NOT NULL,
    "grasa_corporal" DOUBLE PRECISION NOT NULL,
    "masa_muscular" DOUBLE PRECISION NOT NULL,
    "masa_magra" DOUBLE PRECISION NOT NULL,
    "grasa_visceral" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MedidasCorporales_pkey" PRIMARY KEY ("id_medidas")
);

-- CreateTable
CREATE TABLE "Ejercicio" (
    "id_ejercicio" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "grupos_musculares" "GrupoMuscular"[],
    "nivel" "NivelExperiencia" NOT NULL DEFAULT 'principiante',
    "url_multimedia" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "Maquina" (
    "id_maquina" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "grupos_musculares" "GrupoMuscular"[],
    "nivel" "NivelExperiencia" NOT NULL DEFAULT 'principiante',
    "url_multimedia" TEXT,
    "estado" "EstadoMaquina" NOT NULL DEFAULT 'disponible',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maquina_pkey" PRIMARY KEY ("id_maquina")
);

-- CreateTable
CREATE TABLE "MaquinaEjercicio" (
    "id_maquina" TEXT NOT NULL,
    "id_ejercicio" TEXT NOT NULL,

    CONSTRAINT "MaquinaEjercicio_pkey" PRIMARY KEY ("id_maquina","id_ejercicio")
);

-- CreateTable
CREATE TABLE "Rutina" (
    "id_rutina" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_creador" TEXT NOT NULL,
    "id_valoracion" TEXT,
    "nombre" TEXT NOT NULL,
    "duracion" "RutinaDuracion",
    "nivel" "NivelExperiencia" NOT NULL DEFAULT 'principiante',
    "estado" "EstadoRutina" NOT NULL DEFAULT 'activa',
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rutina_pkey" PRIMARY KEY ("id_rutina")
);

-- CreateTable
CREATE TABLE "RutinaEjercicio" (
    "id_rutina_ejercicio" TEXT NOT NULL,
    "id_rutina" TEXT NOT NULL,
    "id_ejercicio" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "series" INTEGER,
    "repeticiones_min" INTEGER,
    "repeticiones_max" INTEGER,
    "descanso" INTEGER,
    "orden" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "RutinaEjercicio_pkey" PRIMARY KEY ("id_rutina_ejercicio")
);

-- CreateTable
CREATE TABLE "SesionRutina" (
    "id_sesion" TEXT NOT NULL,
    "id_rutina" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSesionRutina" NOT NULL DEFAULT 'en_progreso',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SesionRutina_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id_agenda" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_creador" TEXT NOT NULL,
    "id_cupo" TEXT,
    "fecha" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "tipo" "TipoAgenda" NOT NULL,
    "tipo_otro" TEXT,
    "estado" "EstadoAgenda" NOT NULL DEFAULT 'pendiente',
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id_agenda")
);

-- CreateTable
CREATE TABLE "Cupo" (
    "id_cupo" TEXT NOT NULL,
    "id_creador" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cupo_pkey" PRIMARY KEY ("id_cupo")
);

-- CreateTable
CREATE TABLE "DocumentoLegal" (
    "id_doc_legal" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDocLegal" NOT NULL,
    "version" TEXT,
    "url_pdf" TEXT,
    "estado" "EstadoDocumento" NOT NULL DEFAULT 'vigente',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentoLegal_pkey" PRIMARY KEY ("id_doc_legal")
);

-- CreateTable
CREATE TABLE "DocumentoPersonal" (
    "id_doc_personal" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDocPersonal" NOT NULL,
    "url_archivo" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentoPersonal_pkey" PRIMARY KEY ("id_doc_personal")
);

-- CreateTable
CREATE TABLE "AceptacionDocumento" (
    "id_aceptacion" TEXT NOT NULL,
    "id_doc_legal" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "firma_imagen" TEXT,
    "fecha_aceptacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AceptacionDocumento_pkey" PRIMARY KEY ("id_aceptacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_contacto_key" ON "Usuario"("email_contacto");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_documento_key" ON "Usuario"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_id_usuario_key" ON "Estudiante"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_numero_carnet_key" ON "Estudiante"("numero_carnet");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_id_usuario_key" ON "Profesor"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Administrativo_id_usuario_key" ON "Administrativo"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Acudiente_id_usuario_acudido_key" ON "Acudiente"("id_usuario_acudido");

-- CreateIndex
CREATE UNIQUE INDEX "Acudiente_documento_key" ON "Acudiente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Programa_nombre_universidad_key" ON "Programa"("nombre", "universidad");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_nombre_key" ON "Cargo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Area_nombre_key" ON "Area"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Huella_id_usuario_key" ON "Huella"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Huella_id_sensor_key" ON "Huella"("id_sensor");

-- CreateIndex
CREATE UNIQUE INDEX "DatosMedicos_id_valoracion_key" ON "DatosMedicos"("id_valoracion");

-- CreateIndex
CREATE UNIQUE INDEX "MedidasCorporales_id_valoracion_key" ON "MedidasCorporales"("id_valoracion");

-- CreateIndex
CREATE UNIQUE INDEX "Rutina_id_valoracion_key" ON "Rutina"("id_valoracion");

-- CreateIndex
CREATE UNIQUE INDEX "Agenda_id_cupo_key" ON "Agenda"("id_cupo");

-- CreateIndex
CREATE UNIQUE INDEX "AceptacionDocumento_id_doc_legal_id_usuario_key" ON "AceptacionDocumento"("id_doc_legal", "id_usuario");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_programa_fkey" FOREIGN KEY ("id_programa") REFERENCES "Programa"("id_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor" ADD CONSTRAINT "Profesor_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor" ADD CONSTRAINT "Profesor_id_cargo_fkey" FOREIGN KEY ("id_cargo") REFERENCES "Cargo"("id_cargo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor" ADD CONSTRAINT "Profesor_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "Area"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrativo" ADD CONSTRAINT "Administrativo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrativo" ADD CONSTRAINT "Administrativo_id_cargo_fkey" FOREIGN KEY ("id_cargo") REFERENCES "Cargo"("id_cargo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrativo" ADD CONSTRAINT "Administrativo_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "Area"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acudiente" ADD CONSTRAINT "Acudiente_id_usuario_acudido_fkey" FOREIGN KEY ("id_usuario_acudido") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Huella" ADD CONSTRAINT "Huella_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatosMedicos" ADD CONSTRAINT "DatosMedicos_id_valoracion_fkey" FOREIGN KEY ("id_valoracion") REFERENCES "Valoracion"("id_valoracion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedidasCorporales" ADD CONSTRAINT "MedidasCorporales_id_valoracion_fkey" FOREIGN KEY ("id_valoracion") REFERENCES "Valoracion"("id_valoracion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejercicio" ADD CONSTRAINT "Ejercicio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maquina" ADD CONSTRAINT "Maquina_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaquinaEjercicio" ADD CONSTRAINT "MaquinaEjercicio_id_maquina_fkey" FOREIGN KEY ("id_maquina") REFERENCES "Maquina"("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaquinaEjercicio" ADD CONSTRAINT "MaquinaEjercicio_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "Ejercicio"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_id_valoracion_fkey" FOREIGN KEY ("id_valoracion") REFERENCES "Valoracion"("id_valoracion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaEjercicio" ADD CONSTRAINT "RutinaEjercicio_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaEjercicio" ADD CONSTRAINT "RutinaEjercicio_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "Ejercicio"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SesionRutina" ADD CONSTRAINT "SesionRutina_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SesionRutina" ADD CONSTRAINT "SesionRutina_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_cupo_fkey" FOREIGN KEY ("id_cupo") REFERENCES "Cupo"("id_cupo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cupo" ADD CONSTRAINT "Cupo_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoPersonal" ADD CONSTRAINT "DocumentoPersonal_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AceptacionDocumento" ADD CONSTRAINT "AceptacionDocumento_id_doc_legal_fkey" FOREIGN KEY ("id_doc_legal") REFERENCES "DocumentoLegal"("id_doc_legal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AceptacionDocumento" ADD CONSTRAINT "AceptacionDocumento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
