// validaciones del recurso Almacen
import { z } from 'zod';


const to = z.object({
    stationId: z.number(),
    stationType: z.number().nullable(),
    level: z.number().nullable()
});

const AlmacenUnloadSchema = z.object({
    to
});

const AlmacenUnloadCreationSchema = AlmacenUnloadSchema.extend({});

export { AlmacenUnloadCreationSchema };
