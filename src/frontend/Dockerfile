# --- Etapa 1: Build ---
# Esta etapa instala dependencias y compila el TypeScript a JavaScript.
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia solo los archivos de manifiesto del paquete.
# Esto es una optimización para el caché de Docker. El paso de 'npm install'
# solo se volverá a ejecutar si estos archivos cambian.
COPY package*.json ./

# Instala todas las dependencias (de desarrollo y producción).
RUN npm install

# Copia el resto del código fuente del frontend.
COPY . .

# Ejecuta el script de compilación definido en package.json.
RUN npm run build

# --- Etapa 2: Production ---
# Esta etapa crea la imagen final y ligera que se desplegará.
FROM nginx:1.25-alpine

# Copia los assets estáticos (HTML y CSS) desde el contexto de construcción.
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css

# Copia solo el JavaScript compilado desde la etapa 'builder'.
COPY --from=builder /app/dist/main.js /usr/share/nginx/html/dist/main.js

# Reemplaza la configuración por defecto de Nginx con la nuestra.
COPY nginx.conf /etc/nginx/conf.d/default.conf