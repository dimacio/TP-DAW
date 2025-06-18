# Usar una imagen oficial de Node.js
FROM node:14

# Crear y definir el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el package.json y package-lock.json para instalar dependencias
COPY src/backend/package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente del backend
COPY src/backend/ .

# Exponer el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]