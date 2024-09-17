// Definición del tipo Access
import { Document } from 'mongoose';
export interface AccessType extends Document {
    user_id: string;
    ip_address: string;
    origin: string;
    agent: string;
    expiresAt: Date;
    is_revoked: boolean;
    refreshtoken_id: string;
    isDeleted: boolean;
}
