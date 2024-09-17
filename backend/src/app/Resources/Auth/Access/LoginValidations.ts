// validaciones del recurso Access
import { z } from 'zod';

const email = z.string().email().min(1, "Required");
const password = z.string().min(1, "Required");

const AccessSchema = z.object({
    email,
    password
});

const LoginValidation = AccessSchema.extend({});


export { LoginValidation };
