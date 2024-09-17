// UserModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { UserType } from './types/UserType';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  apiKey: { type: String, required: false, default: null },
  metadata: { type: Object, default: {} },
  app: { type: String, required: true },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
  timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
  strict: true,
});

export const UserModel = mongoose.model<UserType & Document>('User', userSchema);
