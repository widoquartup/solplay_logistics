import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder {
  number: number;
  fecha_entrega?: Date;
  bulto: number;
  delivery_ready: boolean;
  detalle?: string;
}

export interface IEndedOrder extends Document {
  order: IOrder;
  date_created: Date;
  delivered: boolean;
  'fase-6': number;
  'fase-7': number;
  status: number;
}

const endedOrderSchema = new Schema<IEndedOrder>({
  order: {
    number: { type: Number, required: true },
    fecha_entrega: { type: Date },
    bulto: { type: Number, default: -1 },
    delivery_ready: { type: Boolean, default: false },
    detalle: { type: String }
  },
  date_created: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
  'fase-6': { type: Number, default: -1 },
  'fase-7': { type: Number, default: -1 },
  status: { type: Number, default: 0 }
});

endedOrderSchema.index({ 'order.number': 1 }, { unique: true });

const EndedOrder = mongoose.model<IEndedOrder>('EndedOrder', endedOrderSchema, 'ended_orders');

export default EndedOrder;