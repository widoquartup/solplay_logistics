// routes for CompletedFasesOrder resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { completedFasesOrderController } from './CompletedFasesOrderController';

import ValidateReq from '@base/Middlewares/validateReq';
import { CompletedFasesOrderCreationSchema, CompletedFasesOrderUpdateSchema } from './CompletedFasesOrderValidations';
const validateStore = ValidateReq(CompletedFasesOrderCreationSchema);
const validateUpdate = ValidateReq(CompletedFasesOrderUpdateSchema);

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


router.get('/', indexMiddlewares, completedFasesOrderController.index);
router.get('/completed/not-delivered', indexMiddlewares, completedFasesOrderController.pending);

router.get('/:completedFasesOrder_id', showMiddlewares, completedFasesOrderController.show);
router.post('/', storeMiddlewares, completedFasesOrderController.store);
router.put('/:completedFasesOrder_id', updateMiddlewares, completedFasesOrderController.update);
router.delete('/:completedFasesOrder_id', deleteMiddlewares, completedFasesOrderController.delete);
router.patch('/:completedFasesOrder_id/softDelete', softDeleteMiddlewares, completedFasesOrderController.softDelete);

// Exportar el router
export default router;