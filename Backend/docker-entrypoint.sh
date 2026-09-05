#!/bin/sh
set -e

echo ">> Aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo ">> Migraciones aplicadas. Iniciando API..."
exec node dist/app.js