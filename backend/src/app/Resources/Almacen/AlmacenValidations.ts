// validaciones del recurso Almacen
import { z } from 'zod';


const AlmacenSchema = z.object({
    
});

const AlmacenCreationSchema = AlmacenSchema.extend({});
const AlmacenUpdateSchema = AlmacenSchema.partial();

export { AlmacenCreationSchema, AlmacenUpdateSchema };
