#Pantalla de la aplicación mesa que sube toldos */carga-toldo
1 - Mesa de toldos escanea código para indicar que está lista para subir al elevador:
    1.1: Llamada a la API para añadir un registro en pending_storages indicando level (derecha o izquierda)

2 - Carga del ascensor y envío del todlo con ascensor

3   Recibimos el mensaje de que hay carga, consumimos de la tabla pending_storages el primer registro 
    {pending:true, level:mensaje.level, isDeleted:false}
    3.1: EXISTE: Marcamos la posición de la estación de carga en la tabla storages añadiendo la orden.
    3.2: NO EXISTE: ERROR!!!, no deberíamos tener carga sin que exista un registro pendiente en pending_storages.

4 - Comprobamos en la tabla ended_orders si existe esa orden (fases 3 o 4 finalizada).
    4.1 EXISTE: creamos un mensaje de carga y descarga hacia la estación 100 entrega
    4.2 NO EXISTE: comprobar si tenemos algúna estación con este número de orden y vacío.
        4.2.1: EXISTE: creamos un mensaje de carga y descarga hacia la estación final.
            4.2.1.1: Quitamos la orden de la estación de carga y lo asignamos a la estación de descarga
        4.2.2: NO EXISTE: En el registro de la orden (pending_storage) viene indicada la cantidad de bultos de la orden. 
            4.2.2.1: Con esta información y fecha_entrega reservamos espacios (estaciones) en un lugar estratégico para la próxima entrega.
            4.2.2.2: Creamos un mensaje de carga y descarga hacia la primer estación reservada.
            4.2.2.2: Quitamos la orden de la estación de carga y lo asignamos a la estación de descarga.

#Consumidor Kafka de mensajes que envía Quartup
1 - A medida que en Quartup se cierren fases, recibiremos un mensaje con el consumidor de Kafka.
    1.1: Buscamos la orden en la tabla ended_orders (no me queda claro si por alguna razón podríamos recibir 2 mensajes de cierre de fase.)
        1.1.1: EXISTE:  No hacer nada.
        1.1.2: NO EXISTE:  Creamos un registro en ended_orders
        1.1.3: Buscamos en storages este número de orden:
            1.1.3.1: NO EXISTE: No hacer nada.
            1.1.3.2: EXISTEN: creamos todos los mensajes de carga y descarga hacia la estación 100 entrega
                1.1.3.2.1: A medida que entregamos quitamos la orden de la estación y marcamos como vacías.

#Reserva de espacios en almacén para las órdenes que entran en el estación de carga
1 - Comprobar espacios libres para