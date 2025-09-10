# Etapa 1: Builder - Instalar dependencias y compilar la aplicación
FROM node:20-slim as builder

# Añadir el repositorio archivado de Debian Buster para instalar libssl1.1
RUN apt-get update && apt-get install -y curl && \
    echo "deb http://archive.debian.org/debian-security/ buster/updates main" >> /etc/apt/sources.list.d/buster-security.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends libssl1.1 openssl

WORKDIR /app

# Copiar solo los archivos de dependencias primero para aprovechar el caché de Docker
# Como el contexto ahora es el directorio 'backend', las rutas son relativas a él.
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente del backend
COPY . .

# Generar el cliente de Prisma (Paso crucial)
RUN npx prisma generate

# Compilar la aplicación de NestJS
RUN npm run build

# Etapa 2: Production - Crear la imagen final y ligera
FROM node:20-slim

# Instalar las dependencias de runtime para Prisma
RUN apt-get update && apt-get install -y curl && \
    echo "deb http://archive.debian.org/debian-security/ buster/updates main" >> /etc/apt/sources.list.d/buster-security.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends libssl1.1 openssl

WORKDIR /app

# Copiar solo los artefactos necesarios desde la etapa de builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# El comando se define en el docker-compose.yml
CMD ["npm", "run", "start:prod"]

