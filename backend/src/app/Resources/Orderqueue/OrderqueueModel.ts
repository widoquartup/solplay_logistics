// OrderqueueModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { OrderqueueType } from './OrderqueueType';

const orderqueueSchema = new Schema({
  order_number: { type: Number, required: true },
  delivery_date: { type: Date, required: true },
  quantity: { type: Number, required: true },
  delivered_quantity: { type: Number, required: false, default: 0 },
  stored_quantity: { type: Number, required: false, default: 0 },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});

export const OrderqueueModel = mongoose.model<OrderqueueType & Document>('Orderqueue', orderqueueSchema, "orders_queue");
