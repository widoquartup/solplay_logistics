// AccessModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { AccessType } from './types/AccessType';

const accessSchema = new Schema({
  user_id: { type: String, required: true },
  ip_address: { type: String, required: true },
  origin: { type: String, required: true },
  agent: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  is_revoked: { type: Boolean, required: true },
  refreshtoken_id: { type: String, required: true },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
  timestamps: true, // Añade automáticamente los campos createdAt y updatedUt
  strict: true,
});
accessSchema.index({ refreshtoken_id: 1 }, { unique: true });
export const AccessModel = mongoose.model<AccessType & Document>('Access', accessSchema);
