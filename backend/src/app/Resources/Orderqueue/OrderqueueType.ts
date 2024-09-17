// Definición del tipo Orderqueue
import { Document } from 'mongoose';
export interface OrderqueueType extends Document {
    order_number: number;
    delivery_date: Date;
    quantity: number;
    stored_quantity: number;
    delivered_quantity: number;
    isDeleted: boolean;
}
