# solplay_logistics

generar backend/src/public.pem y backend/src/private.pem

# Dockers
    docker-compose -f compose-backend.yaml up -d
    docker-compose -f compose-frontend.yaml up -d
    Dentro del directorio ./mongo está el docker para mongodb


# Calcular el valor de un cartStatus
http://localhost:8880/api/almacen/calc/:valor

# Calcular el CartState - solo es para los mensajes 200
http://localhost:8880/api/almacen/cartstate/:message
Se puede copiar message desde el log 
    ej: /home/almacen-lonas/solplay_logistics/backend/logs/logistics/in-out-2024-09-27.log
    {"level":"info","message":"IN>>>20030802    1 7046    9  4   17   17   9001  1    9    3 2         0      3249          3         0         0         02  3  102    2 0         0      3250          1         0         0         0<<<","timestamp":"2024-09-27T12:10:59.819Z"}
    desde >>>  hasta <<<

    http://localhost:8880/api/almacen/cartstate/20030802    1 7046    9  4   17   17   9001  1    9    3 2         0      3249          3         0         0         02  3  102    2 0         0      3250          1         0         0         0