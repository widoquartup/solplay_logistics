// CompletedFasesOrderModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { CompletedFasesOrderType } from './CompletedFasesOrderType';
import { context } from '@base/context';
import GestionAlmacenService from '@src/services/SolplayMessages/services/GestionAlmacenService';

const completedFasesOrderSchema = new Schema({
  order_number: { type: Number, required: true },
  status: { type: String, default: null },
  delivered: { type: Boolean, default: false },
  delivery_date: { type: Date, default: null },
  detail: { type: String, default: null },
  quantity: { type: Number, default: 0 },
  delivered_quantity: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});

// Trigger for update operation
completedFasesOrderSchema.post('findOneAndUpdate', async function(data: CompletedFasesOrderType) {
  // enviar mensaje por websocket indicando que hay cambios de stock
  // console.log(data._update["$set"]);
  await new GestionAlmacenService(context.message).sendUpdateStorageMessageToFrontend(data);
});
export const CompletedFasesOrderModel = mongoose.model<CompletedFasesOrderType & Document>('CompletedFasesOrder', completedFasesOrderSchema, 'completed_fases_orders');
