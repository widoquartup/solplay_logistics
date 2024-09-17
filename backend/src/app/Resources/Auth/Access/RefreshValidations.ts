// validaciones del recurso Access
import { z } from 'zod';

const refreshtoken = z.string();

const AccessSchema = z.object({
    refreshtoken
});

const RefreshValidation = AccessSchema.extend({});


export { RefreshValidation };
