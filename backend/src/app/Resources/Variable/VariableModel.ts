// VariableModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { VariableType } from './VariableType';

const variableSchema = new Schema({
  name: { type: String, required: true },
  group: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, required: true },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
    strict: true,
});

export const VariableModel = mongoose.model<VariableType & Document>('Variable', variableSchema);
