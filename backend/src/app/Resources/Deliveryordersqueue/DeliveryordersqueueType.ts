// Definición del tipo Deliveryordersqueue
import { Document } from 'mongoose';
export interface DeliveryordersqueueType extends Document {
    numero_orden: string;
    fecha_entrega: string;
    bulto: number;
    closed: boolean;
    date_delivered: Date;
    isDeleted: boolean;
}
