import mongoose, { Document, Schema } from 'mongoose';

interface IOrder {
  number: number;
  fecha_entrega?: Date;
  bulto: number;
  delivery_ready: boolean;
  detalle?: string;
}

interface IPendingStorage extends Document {
  level: number;
  date_created: Date;
  pending: boolean;
  order: IOrder;
}

const pendingStorageSchema = new Schema<IPendingStorage>({
  level: { type: Number, required: true },
  date_created: { type: Date, default: Date.now },
  pending: { type: Boolean, default: false },
  order: {
    number: { type: Number, required: true },
    fecha_entrega: { type: Date },
    bulto: { type: Number, default: -1 },
    delivery_ready: { type: Boolean, default: false },
    detalle: { type: String }
  },
});

pendingStorageSchema.index({ level: 1, date_created: 1, pending: 1}, { unique: true });

const PendingStorage = mongoose.model<IPendingStorage>('PendingStorage', pendingStorageSchema, 'pending_storage');

export default PendingStorage;