// routes for Access resource
import express, { RequestHandler } from 'express';
import { accessController } from './AccessController';

import ValidateReq from '@base/Middlewares/validateReq';
import { AccessUpdateSchema } from './AccessValidations';
import { LoginValidation } from './LoginValidations';
import { RefreshValidation } from './RefreshValidations';
import auth from '@base/Middlewares/auth';
// const validateStore = ValidateReq(AccessCreationSchema);
const validateUpdate = ValidateReq(AccessUpdateSchema);
const validateLogin = ValidateReq(LoginValidation);
const validateRefresh = ValidateReq(RefreshValidation);

const router = express.Router();

// middlewares get
const indexMiddlewares: RequestHandler[] = [auth];
// middlewares show
const showMiddlewares: RequestHandler[] = [auth];
// middlewares store
// const storeMiddlewares: RequestHandler[] = [validateStore];
// middlewares update
const updateMiddlewares: RequestHandler[] = [auth,validateUpdate ];
// middlewares delete
const deleteMiddlewares: RequestHandler[] = [auth];
// middlewares softDelete
const softDeleteMiddlewares: RequestHandler[] = [auth];

const loginMiddlewares: RequestHandler[] = [];
// const loginMiddlewares: RequestHandler[] = [validateLogin];
const loginApiKeyMiddlewares: RequestHandler[] = [];
const refreshMiddlewares: RequestHandler[] = [validateRefresh];


router.get('/', indexMiddlewares, accessController.index);
router.get('/:access_id', showMiddlewares, accessController.show);
router.put('/:access_id', updateMiddlewares, accessController.update);
router.delete('/:access_id', deleteMiddlewares, accessController.delete);
router.patch('/:access_id/softDelete', softDeleteMiddlewares, accessController.softDelete);


router.post('/', loginMiddlewares, accessController.login);
router.post('/refresh', refreshMiddlewares, accessController.refresh);
router.post('/api-key', loginApiKeyMiddlewares, accessController.loginByApiKey);

// Exportar el router
export default router;