import { z } from 'zod';

const token = z.string();
const password = z.string();
const confirmPassword = z.string();

const UpdatePassword = z.object({
    token,
    password,
    confirmPassword
});

const UpdatePasswordValidation = UpdatePassword.extend({});


export { UpdatePasswordValidation };
