# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json (si está disponible)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia los archivos del proyecto al directorio de trabajo
COPY . .

# Compila TypeScript a JavaScript
RUN npm run build

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 8880

# Define el comando para ejecutar la aplicación
#CMD [ "node", "dist/index.js" ]
CMD ["npm", "run", "start"]

