# --- Stage 1: Build ---
# Actualizamos la versión de Node a una compatible con Vite
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm cache clean --force && npm install --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV VITE_API_URL=/api

# Genera la build de producción de React
RUN npm run build

# --- Stage 2: Production ---
FROM nginx:stable-alpine

# Copia la configuración de Nginx específica del frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos generados por React al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx escuchará en el puerto 80 dentro del contenedor por defecto
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]

