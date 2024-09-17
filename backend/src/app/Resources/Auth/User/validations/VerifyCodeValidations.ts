// validaciones del recurso User
import { z } from 'zod';

const token = z.string();
const code = z.string();

const VerifyCode = z.object({
    token,
    code
});

const VerifyCodeValidation = VerifyCode.extend({});


export { VerifyCodeValidation };
