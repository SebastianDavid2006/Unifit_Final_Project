# Frontend/Dockerfile
# ---- STAGE 1: BUILD ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- STAGE 2: NGINX ----
FROM nginx:alpine AS runtime

# Configuración nginx para SPA + proxy /api
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]