// Definición del tipo MessageResponse
import { Document } from 'mongoose';

export interface MessageResponseType extends Document {
    _id: string;
    msg_id: number;
    response: string;
    processed: number;
    isDeleted: boolean;
}
