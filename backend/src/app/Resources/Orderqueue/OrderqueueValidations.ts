// validaciones del recurso Orderqueue
import { z } from 'zod';

const order_number = z.string().pipe(z.coerce.number());
const delivery_date = z.date();
const quantity = z.string().pipe(z.coerce.number());
const quantity_delivered = z.string().pipe(z.coerce.number());
const stored_quantity = z.string().pipe(z.coerce.number());
const isDeleted = z.boolean().optional(); 

const OrderqueueSchema = z.object({
    order_number,
    delivery_date,
    quantity,
    quantity_delivered,
    stored_quantity,
    isDeleted,
});

const OrderqueueCreationSchema = OrderqueueSchema.extend({});
const OrderqueueUpdateSchema = OrderqueueSchema.partial();

export { OrderqueueCreationSchema, OrderqueueUpdateSchema };
