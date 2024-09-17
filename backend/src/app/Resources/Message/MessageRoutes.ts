// routes for Message resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { messageController } from './MessageController';

import ValidateReq from '@base/Middlewares/validateReq';
import { MessageCreationSchema, MessageUpdateSchema } from './MessageValidations';
const validateStore = ValidateReq(MessageCreationSchema);
const validateUpdate = ValidateReq(MessageUpdateSchema);

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

router.get('/', indexMiddlewares, messageController.index);
router.get('/:message_id', showMiddlewares, messageController.show);
router.post('/', storeMiddlewares, messageController.store);
router.put('/:message_id', updateMiddlewares, messageController.update);
router.delete('/:message_id', deleteMiddlewares, messageController.delete);
router.patch('/:message_id/softDelete', softDeleteMiddlewares, messageController.softDelete);

// Exportar el router
export default router;