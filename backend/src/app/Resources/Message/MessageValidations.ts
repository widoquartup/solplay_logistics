// validaciones del recurso Message
import { z } from 'zod';

 

const MessageSchema = z.object({
    
});

const MessageCreationSchema = MessageSchema.extend({});
const MessageUpdateSchema = MessageSchema.partial();

export { MessageCreationSchema, MessageUpdateSchema };
