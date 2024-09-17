// routes for PendingStorage resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { pendingStorageController } from './PendingStorageController';

import ValidateReq from '@base/Middlewares/validateReq';
import { PendingStorageCreationSchema, PendingStorageUpdateSchema } from './PendingStorageValidations';
const validateStore = ValidateReq(PendingStorageCreationSchema);
const validateUpdate = ValidateReq(PendingStorageUpdateSchema);

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
const basicMiddlewares: RequestHandler[] = [auth];

router.get('/', indexMiddlewares, pendingStorageController.index);
router.get('/:pendingStorage_id', showMiddlewares, pendingStorageController.show);
router.post('/', storeMiddlewares, pendingStorageController.store);
router.put('/:pendingStorage_id', updateMiddlewares, pendingStorageController.update);
router.delete('/:pendingStorage_id', deleteMiddlewares, pendingStorageController.delete);
router.patch('/:pendingStorage_id/softDelete', softDeleteMiddlewares, pendingStorageController.softDelete);
router.post('/carga-toldo', basicMiddlewares, pendingStorageController.cargaToldo);

// Exportar el router
export default router;