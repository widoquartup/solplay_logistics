// validaciones del recurso MessageQueue
import { z } from 'zod';

const from = z.object({}).optional();
const to = z.object({});
const pending = z.boolean().refine(value => value === true, {message: 'Must be true'});
const deleted = z.string().pipe(z.coerce.number()); 

const MessageQueueSchema = z.object({
    from,
    to,
    pending,
    deleted,
});

const MessageQueueCreationSchema = MessageQueueSchema.extend({});
const MessageQueueUpdateSchema = MessageQueueSchema.partial();

export { MessageQueueCreationSchema, MessageQueueUpdateSchema };
