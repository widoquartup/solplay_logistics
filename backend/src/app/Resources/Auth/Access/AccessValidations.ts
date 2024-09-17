// validaciones del recurso Access
import { z } from 'zod';

const user_id = z.string();
const ip_address = z.string();
const origin = z.string();
const agent = z.string();
const expiresAt = z.date();
const is_revoked = z.boolean();
const refreshtoken_id = z.string(); 

const AccessSchema = z.object({
    user_id,
    ip_address,
    origin,
    agent,
    expiresAt,
    is_revoked,
    refreshtoken_id,
});

const AccessCreationSchema = AccessSchema.extend({});
const AccessUpdateSchema = AccessSchema.partial();

export { AccessCreationSchema, AccessUpdateSchema };
