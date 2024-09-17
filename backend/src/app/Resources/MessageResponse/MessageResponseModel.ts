// MessageResponseModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { MessageResponseType } from './MessageResponseType';

const messageResponseSchema = new Schema({
  msg_id: { type: Number, required: true },
  response: { type: String, required: true },
  processed: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});

export const MessageResponseModel = mongoose.model<MessageResponseType & Document>('MessageResponse', messageResponseSchema, 'message_responses');
