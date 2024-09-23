// routes for Deliveryordersqueue resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { deliveryordersqueueController } from './DeliveryordersqueueController';

import ValidateReq from '@base/Middlewares/validateReq';
import { DeliveryordersqueueCreationSchema, DeliveryordersqueueUpdateSchema } from './DeliveryordersqueueValidations';
const validateStore = ValidateReq(DeliveryordersqueueCreationSchema);
const validateUpdate = ValidateReq(DeliveryordersqueueUpdateSchema);

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

router.get('/', indexMiddlewares, deliveryordersqueueController.index);
router.get('/:deliveryordersqueue_id', showMiddlewares, deliveryordersqueueController.show);
router.post('/', storeMiddlewares, deliveryordersqueueController.store);
router.put('/:deliveryordersqueue_id', updateMiddlewares, deliveryordersqueueController.update);
router.delete('/:deliveryordersqueue_id', deleteMiddlewares, deliveryordersqueueController.delete);
router.patch('/:deliveryordersqueue_id/softDelete', softDeleteMiddlewares, deliveryordersqueueController.softDelete);

// Exportar el router
export default router;