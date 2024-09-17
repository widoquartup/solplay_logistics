// validaciones del recurso User
import { z } from 'zod';

const email = z.string().email();

const RecoverPass = z.object({
    email
});

const RecoverPassValidation = RecoverPass.extend({});


export { RecoverPassValidation };
