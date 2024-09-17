// routes for Variable resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { variableController } from './VariableController';

import ValidateReq from '@base/Middlewares/validateReq';
import { VariableCreationSchema, VariableUpdateSchema } from './VariableValidations';
const validateStore = ValidateReq(VariableCreationSchema);
const validateUpdate = ValidateReq(VariableUpdateSchema);

const router = express.Router();

// middlewares get
const indexMiddlewares: RequestHandler[] = [auth];
// middlewares show
const showMiddlewares: RequestHandler[] = [auth];
// middlewares store
const storeMiddlewares: RequestHandler[] = [auth, validateStore];
// middlewares update
const updateMiddlewares: RequestHandler[] = [auth, validateUpdate];
// middlewares delete
const deleteMiddlewares: RequestHandler[] = [auth];
// middlewares softDelete
const softDeleteMiddlewares: RequestHandler[] = [auth];

router.get('/', indexMiddlewares, variableController.index);
router.get('/:variable_id', showMiddlewares, variableController.show);
router.post('/', storeMiddlewares, variableController.store);
router.put('/:variable_id', updateMiddlewares, variableController.update);
router.delete('/:variable_id', deleteMiddlewares, variableController.delete);
router.patch('/:variable_id/softDelete', softDeleteMiddlewares, variableController.softDelete);

// Exportar el router
export default router;