// DeliveryordersqueueModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { DeliveryordersqueueType } from './DeliveryordersqueueType';

const deliveryordersqueueSchema = new Schema({
  numero_orden: { type: String, required: true },
  fecha_entrega: { type: String, required: true },
  bulto: { type: Number, required: true },
  closed: { type: Boolean, required: true },
  date_delivered: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});

export const DeliveryordersqueueModel = mongoose.model<DeliveryordersqueueType & Document>('Deliveryordersqueue', deliveryordersqueueSchema,'deliveryorders_queue');
