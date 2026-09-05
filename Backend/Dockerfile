# Backend/Dockerfile
# ---- STAGE 1: BUILDER ----
FROM node:22-alpine AS builder
WORKDIR /app

# Instalar dependencias de build (incluye prisma)
COPY package*.json ./
RUN npm ci

# Generar Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Compilar TypeScript
COPY . .
RUN npm run build

# ---- STAGE 2: RUNTIME ----
FROM node:22-alpine AS runtime
WORKDIR /app

# Solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar artefactos de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copiar CLI de Prisma (necesario para `migrate deploy`) y sus dependencias
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# tsx (para ejecutar el seed manualmente: `npx tsx prisma/seed.ts`)
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/.bin/tsx ./node_modules/.bin/tsx

# Entrypoint para ejecutar migraciones antes de arrancar
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/app.js"]