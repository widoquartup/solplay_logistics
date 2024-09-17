// routes for MessageQueue resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { messageQueueController } from './MessageQueueController';

import ValidateReq from '@base/Middlewares/validateReq';
import { MessageQueueCreationSchema, MessageQueueUpdateSchema } from './MessageQueueValidations';
const validateStore = ValidateReq(MessageQueueCreationSchema);
const validateUpdate = ValidateReq(MessageQueueUpdateSchema);

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

router.get('/', indexMiddlewares, messageQueueController.index);

router.get('/:messageQueue_id', showMiddlewares, messageQueueController.show);
router.post('/', storeMiddlewares, messageQueueController.store);
router.put('/:messageQueue_id', updateMiddlewares, messageQueueController.update);
router.delete('/:messageQueue_id', deleteMiddlewares, messageQueueController.delete);
router.patch('/:messageQueue_id/softDelete', softDeleteMiddlewares, messageQueueController.softDelete);
router.post('/pending', showMiddlewares, messageQueueController.pending);

// Exportar el router
export default router;