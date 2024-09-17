// validaciones del recurso CompletedFasesOrder
import { z } from 'zod';

const order = z.object({});
const delivered = z.boolean();
const fase3 = z.string().pipe(z.coerce.number()).optional();
const fase4 = z.string().pipe(z.coerce.number()).optional();
const status = z.string().pipe(z.coerce.number()).optional(); 

const CompletedFasesOrderSchema = z.object({
    order,
    delivered,
    fase3,
    fase4,
    status,
});

const CompletedFasesOrderCreationSchema = CompletedFasesOrderSchema.extend({});
const CompletedFasesOrderUpdateSchema = CompletedFasesOrderSchema.partial();

export { CompletedFasesOrderCreationSchema, CompletedFasesOrderUpdateSchema };
