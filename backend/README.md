# solplay-almacen-api

crear directorio logs en raíz
crear .env en raíz
crear los archivos privated.pem y public.pem en src
    openssl genrsa -out src/private.pem 4096
    openssl rsa -in src/private.pem -outform PEM -pubout -out src/public.pem

node 20
npm ci

crear .env

    APP_NAME = auth2_dev
    PORT = 8880
    ENV = development
    USE_HTTPS = false # si hay certificado, cambiar a true
    # APP_PRIVKEY = /etc/letsencrypt/live/<proyecto domain>.com/privkey.pem
    # APP_FULLCHAIN = /etc/letsencrypt/live/<proyecto domain>.com/fullchain.pem
    
    #--- Mailgun --------------
    MAILGUN_FROM=MyFunApp <no-reply@<DOMINIO DE LA APP>>
    MAILGUN_DOMAIN=<DOMINIO MAILGUN>
    MAILGUN_API_KEY=<API KEY MAILGUN>
    MAILGUN_ENDPOINT=<ENDPOINT MAILGUN>
    #--- End Mailgun --------------
    #--- EmailService -- Mailgun o Log
    EMAIL_SERVICE=Log
    
    #--- Auth
    AUTH_TOKEN_EXPIRES=60m
    AUTH_REFRESH_TOKEN_EXPIRES=30d

    #-- carro Singular Logistics
    SINGULAR_LOGISTICS_HOST=192.168.1.147
    SINGULAR_LOGISTICS_PORT=30000

    MONGO_IS_SRV='no' # si no usamos Atlas comentar
    DB_URI="mongodb+srv://<user>:<password>@<cluster>/?appName=Cluster0"
    MONGO_DB=solplay_almacen
    MONGO_USERNAME=<user>
    MONGO_PASSWORD=<password>
    MONGO_CLUSTER=<cluster>

    #-- Quartup api2 
    
    API2_HOST="https://<url>/api2/"
    
    
    #-Sockets events
    SOCKET_EVENT_STORE_CHANGED="storeChanged"
    
    #-Parking luego de entrega
    CART_PARKING=25
    
    GET_MESSAGE_QUEUED_INTERVAL=5000
    
    
    #-- Kafka host
    # KAFKA_URL="<url>:<port>"
    KAFKA_HOST="<domain>"
    KAFKA_PORT="19092"
    KAFKA_CLIENT_ID='<client-ID>'
    KAFKA_TOPIC_TMP="<topictmp>"
    KAFKA_TOPIC_OFS_CHANGED="SOLPLAY_PRODORFA"
    KAFKA_TOPIC_MOVI_MONTAJE="SOLPLAY_PRODMOVI"
    
    #Días de antelación para cálculo de entrega
    ENTREGA_DIAS_ANTELACION=1

    
#Artesano
npm run cli
