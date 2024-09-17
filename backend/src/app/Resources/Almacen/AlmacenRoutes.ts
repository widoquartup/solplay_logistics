// routes for Almacen resource
import express, { RequestHandler } from 'express';

import auth from '@base/Middlewares/auth';

import { almacenController } from './AlmacenController';

import ValidateReq from '@base/Middlewares/validateReq';
import { AlmacenCreationSchema, AlmacenUpdateSchema } from './AlmacenValidations';
import { AlmacenTransportCreationSchema } from './AlmacenTransportValidations';
import { AlmacenUnloadCreationSchema } from './AlmacenUnloadValidations';
import emitWebSocketMessage from '@base/Middlewares/emitWebSocketMessage';
const validateStore = ValidateReq(AlmacenCreationSchema);
const validateUpdate = ValidateReq(AlmacenUpdateSchema);

const validateTransport = ValidateReq(AlmacenTransportCreationSchema);
const validateUnload = ValidateReq(AlmacenUnloadCreationSchema);

const router = express.Router();

// middlewares get
const indexMiddlewares: RequestHandler[] = [auth];
// middlewares show
const showMiddlewares: RequestHandler[] = [auth];
// middlewares store
// const storeMiddlewares: RequestHandler[] = [auth, validateStore];
const storeMiddlewares: RequestHandler[] = [auth, validateStore, emitWebSocketMessage]; 
// middlewares update
const updateMiddlewares: RequestHandler[] = [auth, validateUpdate, emitWebSocketMessage];
// middlewares delete
const deleteMiddlewares: RequestHandler[] = [auth];
// middlewares softDelete
const softDeleteMiddlewares: RequestHandler[] = [auth];

const transportMiddlewares: RequestHandler[] = [auth, validateTransport];
const unloadMiddlewares: RequestHandler[] = [auth, validateUnload];
const transitMiddlewares: RequestHandler[] = [auth];

router.get('/', indexMiddlewares, almacenController.index);
// router.get('/:almacen_id', showMiddlewares, almacenController.show);
router.get('/calc/:value', [], almacenController.calc);
router.get('/reset-gateway', indexMiddlewares, almacenController.resetGateway);
router.get('/transit/cancel', [], almacenController.cancelTransit);
router.post('/', storeMiddlewares, almacenController.store);
router.put('/:almacen_id', updateMiddlewares, almacenController.update);
router.delete('/:almacen_id', deleteMiddlewares, almacenController.delete);
router.patch('/:almacen_id/softDelete', softDeleteMiddlewares, almacenController.softDelete);
router.post('/transport', transportMiddlewares, almacenController.transport);
router.post('/unload', unloadMiddlewares, almacenController.unload);
router.post('/gateway/tcp-status', indexMiddlewares, almacenController.tcpStatus);
// Exportar el router
export default router;