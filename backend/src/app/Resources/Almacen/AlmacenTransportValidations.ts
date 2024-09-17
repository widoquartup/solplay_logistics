// validaciones del recurso Almacen
import { z } from 'zod';

const from = z.object({
    stationId: z.number(),
    stationType: z.number(),
    level: z.number()
});
const to = z.object({
    stationId: z.number(),
    stationType: z.number().nullable(),
    level: z.number().nullable()
});

const AlmacenTransportSchema = z.object({
    from, 
    to
});

const AlmacenTransportCreationSchema = AlmacenTransportSchema.extend({});

export { AlmacenTransportCreationSchema };
