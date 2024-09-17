// MessageQueueModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { MessageQueueType } from './MessageQueueType';

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

export const MessageQueueModel = mongoose.model<MessageQueueType & Document>('MessageQueue', messageQueueSchema, "messages_queue");
