// validateReq

import { ZodError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import BadRequestException from '@base/Exceptions/BadRequestException';


/**
 * Función de orden superior que retorna un middleware de Express.
 * Este middleware valida el cuerpo de la solicitud usando un esquema de Zod dado.
 * 
 * @param schema El esquema de Zod para la validación.
 * @returns Un middleware de Express que realiza la validación.
 */
const validateReq = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                next(new BadRequestException(error.errors));
            }
            next(error);
        }
    };
};

export default validateReq;
