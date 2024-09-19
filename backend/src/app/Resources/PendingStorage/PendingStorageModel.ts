// PendingStorageModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { PendingStorageType } from './PendingStorageType';
import { context } from '@base/context';
import GestionAlmacenService from '@src/services/SolplayMessages/services/GestionAlmacenService';

const pendingStorageSchema = new Schema({
  station_id: { type: Number, required: true, default: 100 },
  station_type: { type: Number, required: true },
  codigo_barras: {type: String, required: true },
  pending: { type: Boolean, required: true },
  order: { type: Object, required: true },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});
// Trigger for update operation
pendingStorageSchema.post('findOneAndUpdate', async function(data: PendingStorageType) {
  // enviar mensaje por websocket indicando que hay cambios de stock
  // console.log(data._update["$set"]);
  await new GestionAlmacenService(context.message).sendUpdateStorageMessageToFrontend(data);
});
export const PendingStorageModel = mongoose.model<PendingStorageType & Document>('PendingStorage', pendingStorageSchema, "pending_storages");
