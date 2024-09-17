import { Document } from 'mongoose';

export interface BaseDocument extends Document {
    isDeleted: boolean;
}
