// validaciones del recurso PendingStorage
import { z } from 'zod';

const level = z.coerce.number();
const pending = z.boolean();
const order = z.object({}); 

const PendingStorageSchema = z.object({
    level,
    pending,
    order,
});

const PendingStorageCreationSchema = PendingStorageSchema.extend({});
const PendingStorageUpdateSchema = PendingStorageSchema.partial();

export { PendingStorageCreationSchema, PendingStorageUpdateSchema };
