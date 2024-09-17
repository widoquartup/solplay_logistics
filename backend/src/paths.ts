// paths.ts
import { join } from 'path';

export const basePath = __dirname; // Ruta base del proyecto
export const routesPath = join(basePath, 'app', 'routes.json');
export const dirResources = join(basePath, 'app', 'Resources');
export const dirJsons = join(basePath, 'app', 'jsons');
export const resourceTemplatesPath = join(basePath, 'cli', 'Resource', 'templates');
export const postmanCollectionFilePath = join(basePath, 'app', 'postman', 'PostmanCollection.json');
export const postmanEnvironmentFilePath = join(basePath, 'app', 'postman', 'PostmanEnvironment.json');
export const privatePemPath = join(basePath, 'private.pem');
export const publicPemPath = join(basePath, 'public.pem');
export const emailTemplatesBasePath = join(basePath, 'services', 'Email', 'templates');


