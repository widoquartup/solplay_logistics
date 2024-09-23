// validaciones del recurso Deliveryordersqueue
import { z } from 'zod';

const numero_orden = z.string();
const fecha_entrega = z.string();
const bulto = z.string().pipe(z.coerce.number());
const closed = z.boolean();
const date_delivered = z.date().optional(); 

const DeliveryordersqueueSchema = z.object({
    numero_orden,
    fecha_entrega,
    bulto,
    closed,
    date_delivered,
});

const DeliveryordersqueueCreationSchema = DeliveryordersqueueSchema.extend({});
const DeliveryordersqueueUpdateSchema = DeliveryordersqueueSchema.partial();

export { DeliveryordersqueueCreationSchema, DeliveryordersqueueUpdateSchema };
