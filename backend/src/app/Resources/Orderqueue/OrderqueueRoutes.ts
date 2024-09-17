// routes for Orderqueue resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { orderqueueController } from './OrderqueueController';

import ValidateReq from '@base/Middlewares/validateReq';
import { OrderqueueCreationSchema, OrderqueueUpdateSchema } from './OrderqueueValidations';
const validateStore = ValidateReq(OrderqueueCreationSchema);
const validateUpdate = ValidateReq(OrderqueueUpdateSchema);

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

router.get('/', indexMiddlewares, orderqueueController.index);
router.get('/:orderqueue_id', showMiddlewares, orderqueueController.show);
router.post('/', storeMiddlewares, orderqueueController.store);
router.put('/:orderqueue_id', updateMiddlewares, orderqueueController.update);
router.delete('/:orderqueue_id', deleteMiddlewares, orderqueueController.delete);
router.patch('/:orderqueue_id/softDelete', softDeleteMiddlewares, orderqueueController.softDelete);

// Exportar el router
export default router;