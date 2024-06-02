# Usa la imagen oficial de Node.js como base
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias de tu aplicación
RUN npm install

# Copia el resto de tu aplicación al directorio de trabajo del contenedor
COPY . .

# Expone el puerto en el que tu aplicación escucha (asegúrate de que coincida con el puerto que estás utilizando en tu aplicación Node.js)
EXPOSE 3000

# Comando para ejecutar tu aplicación cuando se inicie el contenedor
CMD ["node", "server5.js"]
