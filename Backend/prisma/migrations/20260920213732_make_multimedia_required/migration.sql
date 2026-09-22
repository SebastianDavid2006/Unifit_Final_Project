/*
  Warnings:

  - Made the column `url_multimedia` on table `Ejercicio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url_multimedia` on table `Maquina` required. This step will fail if there are existing NULL values in that column.

*/
-- Primero actualizar valores NULL existentes a string vacío
UPDATE "Ejercicio" SET "url_multimedia" = '' WHERE "url_multimedia" IS NULL;
UPDATE "Maquina" SET "url_multimedia" = '' WHERE "url_multimedia" IS NULL;

-- AlterTable
ALTER TABLE "Ejercicio" ALTER COLUMN "url_multimedia" SET NOT NULL,
ALTER COLUMN "url_multimedia" SET DEFAULT '';

ALTER TABLE "Maquina" ALTER COLUMN "url_multimedia" SET NOT NULL,
ALTER COLUMN "url_multimedia" SET DEFAULT '';