// validaciones del recurso MessageResponse
import { z } from 'zod';

const msg_id = z.string().pipe(z.coerce.number());
const response = z.string();
const processed = z.string().pipe(z.coerce.number()); 

const MessageResponseSchema = z.object({
    msg_id,
    response,
    processed,
});

const MessageResponseCreationSchema = MessageResponseSchema.extend({});
const MessageResponseUpdateSchema = MessageResponseSchema.partial();

export { MessageResponseCreationSchema, MessageResponseUpdateSchema };
