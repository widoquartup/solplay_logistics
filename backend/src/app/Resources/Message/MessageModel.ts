// MessageModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { MessageType } from './MessageType';

const messageSchema = new Schema({
  msg_id: { type: Number, default: 1 },
  message: { type: String, required: true },
  type: { type: Number, required: true },
  sended: { type: Boolean, default: false },
  response_ack: { type: Boolean, default: false },
  response_nack: { type: Boolean, default: false },
  priority: { type: Number, default: 999999 },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});

export const MessageModel = mongoose.model<MessageType & Document>('Message', messageSchema);
