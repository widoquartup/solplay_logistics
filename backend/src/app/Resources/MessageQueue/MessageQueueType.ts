// Definición del tipo MessageQueue
import { Document } from 'mongoose';
export interface MessageQueueFromToType{
    type: number;
    msg_id: number;
    cart_id: number;
    station_id: number;
    station_type: number;
    level?: number;
    options?: string,
    initial_inputs?: string,
    cargo_id?: string,
}


export interface MessageQueueType extends Document {
    from: MessageQueueFromToType | null;
    to: MessageQueueFromToType;
    fromPending: boolean;
    toPending: boolean;
    isDeleted: boolean;
}
