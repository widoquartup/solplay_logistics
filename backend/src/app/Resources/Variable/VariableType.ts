// Definición del tipo Variable
import { Document } from 'mongoose';
export interface VariableType extends Document {
    name: string;
    group: string;
    value: string;
    type: string;
    isDeleted: boolean;
}
