// routes for MessageResponse resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { messageResponseController } from './MessageResponseController';

import ValidateReq from '@base/Middlewares/validateReq';
import { MessageResponseCreationSchema, MessageResponseUpdateSchema } from './MessageResponseValidations';
const validateStore = ValidateReq(MessageResponseCreationSchema);
const validateUpdate = ValidateReq(MessageResponseUpdateSchema);

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

router.get('/', indexMiddlewares, messageResponseController.index);
router.get('/:messageResponse_id', showMiddlewares, messageResponseController.show);
router.post('/', storeMiddlewares, messageResponseController.store);
router.put('/:messageResponse_id', updateMiddlewares, messageResponseController.update);
router.delete('/:messageResponse_id', deleteMiddlewares, messageResponseController.delete);
router.patch('/:messageResponse_id/softDelete', softDeleteMiddlewares, messageResponseController.softDelete);

// Exportar el router
export default router;