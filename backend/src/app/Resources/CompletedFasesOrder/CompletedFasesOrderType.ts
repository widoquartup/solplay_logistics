// Definición del tipo CompletedFasesOrder
import { Document } from 'mongoose';

export interface CompletedFasesOrderType extends Document {
    _id: string;
    order_number: number;
    status: string;
    delivered: boolean;
    detail: string;
    delivery_date: Date;
    quantity: number;
    delivered_quantity: number;
    isDeleted: boolean;
}
