// routes for User resource
import express, { RequestHandler } from 'express';
import { userController } from './UserController';

import ValidateReq from '@base/Middlewares/validateReq';
import auth from '@base/Middlewares/auth';
import i18nMiddleware from '@base/Middlewares/i18nMiddelware';
import { UserCreationSchema, UserUpdateSchema } from './UserValidations';
const validateStore = ValidateReq(UserCreationSchema);
const validateUpdate = ValidateReq(UserUpdateSchema);

import { VerifyCodeValidation } from './validations/VerifyCodeValidations';
const validateVerifyCode = ValidateReq(VerifyCodeValidation);

import { RecoverPassValidation } from './validations/RecoverPassValidations';
const recoverPassValidation = ValidateReq(RecoverPassValidation);

import { UpdatePasswordValidation } from './validations/UpdatePasswordValidations';
const updatePasswordValidation = ValidateReq(UpdatePasswordValidation);

const router = express.Router();

// middlewares get
const indexMiddlewares: RequestHandler[] = [auth];
// const indexMiddlewares: RequestHandler[] = [];
// middlewares show
const showMiddlewares: RequestHandler[] = [auth];
// middlewares store
const storeMiddlewares: RequestHandler[] = [i18nMiddleware, validateStore];
// middlewares update
const updateMiddlewares: RequestHandler[] = [auth, validateUpdate];
const verifyCodeMiddlewares: RequestHandler[] = [validateVerifyCode];
const recoverPassMiddlewares: RequestHandler[] = [i18nMiddleware, recoverPassValidation];
const updatePasswordMiddlewares: RequestHandler[] = [updatePasswordValidation];
// middlewares delete
const deleteMiddlewares: RequestHandler[] = [auth];
// middlewares softDelete
const softDeleteMiddlewares: RequestHandler[] = [auth];

// router.get('/', [], userController.index);
router.get('/', indexMiddlewares, userController.index);
router.get('/:user_id', showMiddlewares, userController.show);
router.post('/', storeMiddlewares, userController.store);
router.post('/verify-new-user', verifyCodeMiddlewares, userController.verifyNewUser);
router.post('/recover-pass', recoverPassMiddlewares, userController.recoverPass);
router.post('/verify-recover-pass', verifyCodeMiddlewares, userController.verifyRecoverPass);
router.post('/update-pass', updatePasswordMiddlewares, userController.updatePass);
// router.put('/:user_id', [], userController.update);
router.put('/:user_id', updateMiddlewares, userController.update);
router.delete('/:user_id', deleteMiddlewares, userController.delete);
router.patch('/:user_id/softDelete', softDeleteMiddlewares, userController.softDelete);

router.get('/logged/user-data', showMiddlewares, userController.getUser);
// Exportar el router
export default router;