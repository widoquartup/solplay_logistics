// AlmacenModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { AlmacenType } from './AlmacenType';

import GestionAlmacenService from '@src/services/SolplayMessages/services/GestionAlmacenService';
import { context } from '@base/context';
import { Order } from '../PendingStorage/PendingStorageType';



const almacenSchema = new Schema({
  station_id: { type: Number, required: true },
  station_type: { type: Number, required: true },
  level: { type: Number, required: true },
  order: {type: Object, required: false },
  loaded: { type: Boolean, default: false },
  status_ok: { type: Boolean, default: true },
  processing: { type: Boolean, default: false },
  preferent_order: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedAt
    strict: true,
    unique: [{ station_id: 1, station_type: 1, level: 1 }]
});

// Add a compound index to ensure uniqueness of the combination
almacenSchema.index({ station_id: 1, station_type: 1, level: 1 }, { unique: true });

// Trigger for update operation
almacenSchema.post('findOneAndUpdate', async function(data: AlmacenType) {
  // enviar mensaje por websocket indicando que hay cambios de stock
  // console.log(data._update["$set"]);
  if (data == null){
    return;
  }
  await new GestionAlmacenService(context.message).sendUpdateStorageMessageToFrontend(data.order);
});

export const AlmacenModel = mongoose.model<AlmacenType & Document>('Almacen', almacenSchema, 'storages');
