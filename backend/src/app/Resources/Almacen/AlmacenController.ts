// AlmacenController.ts
import { Request, Response, NextFunction } from 'express';
import { ControllerBase } from '@base/Bases/ControllerBase';
import { AlmacenService } from './AlmacenService';
import { AlmacenRepository } from './AlmacenRepository';
import { AlmacenModel } from './AlmacenModel';
import { AlmacenType } from './AlmacenType';
import { TransportParameterType } from './AlmacenTypes';
import { context } from '@base/context';
import GestionAlmacenService from '@src/services/SolplayMessages/services/GestionAlmacenService';
// import colors from 'cli-color';

class AlmacenController extends ControllerBase<AlmacenType, AlmacenService> {
    constructor(service: AlmacenService) {
        super(service);
        this.transport = this.transport.bind(this);
        this.unload = this.unload.bind(this);
        this.cancelTransit = this.cancelTransit.bind(this);
        this.resetGateway = this.resetGateway.bind(this);
    }

    async store(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.storeAndSendWebSocketMessage(req.body);
            res.locals.response = entity;
            res.status(201);
            next();
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.locals.params = req.params;
        const keys = Object.keys(req.params);
        try {
            const entity = await this.service.update(req.params[keys[0]], req.body);
            res.locals.response = entity;
            next();
        } catch (error) {
            next(error);
        }
    }

    async transport(req: Request, res: Response, next: NextFunction) {
        const result = await this.service.transport( req.body.from as TransportParameterType, req.body.to as TransportParameterType);
        res.locals.response = result;
        res.status(200);
        // res.status(result.code);
        
        next();
        return;
    }
    async unload(req: Request, res: Response, next: NextFunction) {
        const result = await this.service.unload( req.body.to as TransportParameterType);
        res.locals.response = result;
        res.status(result.code);
        next();
        return;
    }
    async cancelTransit(req: Request, res: Response, next: NextFunction) {
        const result = await this.service.cancelTransit();
        res.locals.response = result;
        res.status(result.code);
        next();
        return;
    }
    async resetGateway(req: Request, res: Response, next: NextFunction) {
        const result = this.service.resetGateway();
        res.locals.response = result;
        res.status(result.code);
        next();
        return ;
    }
    
    async tcpStatus(req: Request, res: Response, next: NextFunction) {
        const command = req.body.command;
        // 'disconnect' : 'connect';
        if (command=="connect"){
            await context.message.forceConnectToGateway();
        }
        if (command=="connect"){
            await context.message.forceDisconnectFromGateway;
        }
        
        res.locals.response = { data: "OK" };
        res.status(200);
        next();
        return ;
    }


}

const repository = new AlmacenRepository(AlmacenModel);
const service = new AlmacenService(repository);
const almacenController = new AlmacenController(service);
export { almacenController };
