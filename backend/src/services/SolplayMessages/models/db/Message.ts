import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  msg_id: number;
  message: string;
  type: number;
  sended: boolean;
  response_ack: boolean;
  response_nack: boolean;
  priority: number;
  date_entered: Date;
}

const messageSchema = new Schema<IMessage>({
  msg_id: { type: Number, default: 1 },
  message: { type: String, required: true },
  type: { type: Number, required: true },
  sended: { type: Boolean, default: false },
  response_ack: { type: Boolean, default: false },
  response_nack: { type: Boolean, default: false },
  priority: { type: Number, default: 999999 },
  date_entered: { type: Date, default: Date.now }
});

messageSchema.index({ msg_id: 1 }, { unique: true });

const Message = mongoose.model<IMessage>('Message', messageSchema, 'messages');

export default Message;