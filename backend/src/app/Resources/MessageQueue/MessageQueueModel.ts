// MessageQueueModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { MessageQueueType } from './MessageQueueType';
import GestionAlmacenService from '@src/services/SolplayMessages/services/GestionAlmacenService';
import { context } from '@base/context';

const messageQueueSchema = new Schema({
  from: { type: Object, default: {} },
  to: { type: Object, default: {} },
  order: { type: Schema.Types.Mixed, default: null },
  fromPending: { type: Boolean, default: true },
  toPending: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});


// Trigger for update operation
messageQueueSchema.post('findOneAndUpdate', async function(data: MessageQueueType) {
  // enviar mensaje por websocket indicando que hay cambios de stock
  // console.log(data._update["$set"]);
  if (data == null){
    return;
  }
  await new GestionAlmacenService(context.message).sendUpdateMessageQueueStatusToFrontend(data);
});

export const MessageQueueModel = mongoose.model<MessageQueueType & Document>('MessageQueue', messageQueueSchema, "messages_queue");
