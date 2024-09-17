// validaciones del recurso Variable
import { z } from 'zod';

const name = z.string();
const group = z.string();
const value = z.string(); 

const VariableSchema = z.object({
    name,
    group,
    value,
});

const VariableCreationSchema = VariableSchema.extend({});
const VariableUpdateSchema = VariableSchema.partial();

export { VariableCreationSchema, VariableUpdateSchema };
