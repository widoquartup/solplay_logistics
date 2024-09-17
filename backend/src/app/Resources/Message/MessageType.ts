// Definición del tipo Message
import { Document } from 'mongoose';
export interface MessageType extends Document {
    _id: string;
    msg_id: number,
    message: string,
    type: number,
    sended: boolean
    response_ack: boolean,
    response_nack: boolean,
    priority: number,
    isDeleted: boolean;
}
