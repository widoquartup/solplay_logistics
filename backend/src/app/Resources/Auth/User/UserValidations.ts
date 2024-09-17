// validaciones del recurso User
import { z } from 'zod';


const accept = z.boolean().refine(value => value === true, {
    message: 'Must be true',
});
const name = z.string();
const email = z.string().email();
const password = z.string();
const metadata = z.object({}).optional();
const app = z.string().min(1);

const UserSchema = z.object({
    name,
    email,
    password,
    metadata,
    app, accept
});

const UserCreationSchema = UserSchema.extend({});
const UserUpdateSchema = UserSchema.partial();

export { UserCreationSchema, UserUpdateSchema };
