import mongoose, { Document, Schema } from 'mongoose';

interface IMessageResponse extends Document {
  msg_id: number;
  response: string;
  processed: number;
  date_entered: Date;
}

const messageResponseSchema = new Schema<IMessageResponse>({
  msg_id: { type: Number, required: true },
  response: { type: String, required: true },
  processed: { type: Number, required: true },
  date_entered: { type: Date, default: Date.now }
});

messageResponseSchema.index({ msg_id: 1, date_entered: 1 });

const MessageResponse = mongoose.model<IMessageResponse>('MessageResponse', messageResponseSchema, 'message_responses');

export default MessageResponse;