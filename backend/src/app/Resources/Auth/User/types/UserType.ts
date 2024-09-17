// Definición del tipo User
import { Document, Types } from 'mongoose';
export interface UserType extends Document {
    _id:Types.ObjectId;
    name: string;
    email: string;
    password: string;
    metadata: object;
    app: string;
    isDeleted: boolean;
}
