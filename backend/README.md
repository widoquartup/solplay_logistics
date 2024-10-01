# solplay-almacen-api

crear directorio logs en raíz
crear .env en raíz
crear los archivos privated.pem y public.pem en src
    openssl genrsa -out src/private.pem 4096
    openssl rsa -in src/private.pem -outform PEM -pubout -out src/public.pem

node 20
npm ci

crear ./backend/.env desde ./backend/.env-example

    

    
#Artesano
npm run cli
