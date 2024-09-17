// AccessController.ts
import { Request, Response, NextFunction } from 'express';
import { ControllerBase } from '@base/Bases/ControllerBase';
import { AccessService } from './AccessService';
import { AccessRepository } from './AccessRepository';
import { UserRepository } from '../User/UserRepository';
import { UserModel } from '../User/UserModel';
import { AccessModel } from './AccessModel';
import { AccessType } from './types/AccessType';
import { RequestAuthByApiKeyType, RequestAuthType } from './types/RequestAuthType';
import { RequestRefreshType } from './types/RequestRefreshType';

class AccessController extends ControllerBase<AccessType, AccessService> {
    constructor(service: AccessService) {
        super(service);
        this.service = service;
        this.login = this.login.bind(this);
        this.loginByApiKey = this.loginByApiKey.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // console.log("req.body", req.body)
            const headers = this.extractRequestInfo(req);
            const { email, password } = req.body;
            const dataLogin = { ...{ email, password }, ...headers } as RequestAuthType;
            const entity = await this.service.login(dataLogin);
            res.locals.response = entity;
            res.status(200);
            next();
        } catch (error) {
            next(error);
        }
    }
    async loginByApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const headers = this.extractRequestInfo(req);
            const { apiKey } = req.body;
            const dataLogin = { ...{ apiKey }, ...headers } as RequestAuthByApiKeyType;
            console.log("dataLogin",dataLogin);
            const entity = await this.service.loginByApiKey(dataLogin);
            console.log("entity",entity);
            res.locals.response = entity;
            res.status(200);
            next();
        } catch (error) {
            next(error);
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const headers = this.extractRequestInfo(req);
            const { refreshtoken } = req.body;
            const dataRefresh = { ...{ refreshtoken }, ...headers } as RequestRefreshType;
            const entity = await this.service.refresh(dataRefresh);
            res.locals.response = entity;
            res.status(200);
            next();
        } catch (error) {
            next(error);
        }

    }
    private extractRequestInfo(req: Request) {
        const ip_address = req.ip || 'unknow';
        const origin = req.get('origin') || 'unknow';
        const agent = req.get('user-agent') || 'unknow';
        return { ip_address, origin, agent };
    }

}

const repository = new AccessRepository(AccessModel);
const userRepository = new UserRepository(UserModel);
const service = new AccessService(repository, userRepository);
const accessController = new AccessController(service);
export { accessController };
