// UserController.ts
import { Request, Response, NextFunction } from 'express';

import { ControllerBase } from '@base/Bases/ControllerBase';
import { UserService } from './UserService';
import { UserRepository } from './UserRepository';
import { UserModel } from './UserModel';
import { UserType } from './types/UserType';

class UserController extends ControllerBase<UserType, UserService> {
    constructor(service: UserService) {
        super(service);
        this.verifyNewUser = this.verifyNewUser.bind(this);
        this.recoverPass = this.recoverPass.bind(this);
        this.verifyRecoverPass = this.verifyRecoverPass.bind(this);
        this.updatePass = this.updatePass.bind(this);
        this.getUser = this.getUser.bind(this);

    }
    async store(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // eslint-disable-next-line
            const { user, ...rest } = req.body;
       
            //rest contiene los datos del nuevo usuario ( hemos quitado user de body, que es el user logado, si lo hubiera)
            const entity = await this.service.preStoreUser(rest,req.t);
            res.locals.response = entity;
            res.status(201);
            next();
        } catch (error) {
            next(error);
        }
    }
    async verifyNewUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.verifyNewUser(req.body);
            res.locals.response = entity;
            res.status(201);
            next();
        } catch (error) {
            next(error);
        }
    }
    async recoverPass(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const app = req.get('x-application') || 'unknow';
            console.log("Error", req.body);

            const { email } = req.body;
            const entity = await this.service.recoverPass({
                app: app,
                email: email,
                t: req.t
            });
            res.locals.response = entity;
            res.status(201);
            next();
        } catch (error) {
            next(error);
        }
    }
    async verifyRecoverPass(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.verifyRecoverPass(req.body);
            res.locals.response = entity;
            res.status(200);
            next();
        } catch (error) {
            next(error);
        }
    }
    async updatePass(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.updatePass(req.body);
            res.locals.response = entity;
            res.status(200);
            next();
        } catch (error) {
            next(error);
        }
    }

    // devuelve los datos del usuario logado
    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const entity = await this.service.getUser(req.body);
            res.locals.response = entity;
            res.status(200);
            next();
        } catch (error) {
            next(error);
        }

    }
}

const repository = new UserRepository(UserModel);
const service = new UserService(repository);
const userController = new UserController(service);
export { userController };
