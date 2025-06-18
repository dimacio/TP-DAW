# La construcción se ejecutará desde el contexto 'src/backend'
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de manifiesto del paquete
COPY package*.json ./

# Instala las dependencias de producción
RUN npm install --production

# Copia el resto del código fuente del backend
COPY . .

# Expone el puerto que usa la aplicación
EXPOSE 3000

# El comando para iniciar el servidor
CMD [ "npm", "start" ]
