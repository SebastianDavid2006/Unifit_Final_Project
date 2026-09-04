# Backend/Dockerfile
# ---- STAGE 1: BUILDER ----
FROM node:20-alpine AS builder
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
FROM node:20-alpine AS runtime
WORKDIR /app

# Solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar artefactos de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/app.js"]