import { Request, Response, NextFunction } from 'express';
import { ControllerInterface } from '@base/Bases/ControllerInterface';
import { ServiceInterface } from '@base/Bases/ServiceInterface';

import NotFoundException from '@base/Exceptions/NotFoundException';

export abstract class ControllerBase<TEntity, TService extends ServiceInterface<TEntity>> implements ControllerInterface {
    protected service: TService;
    constructor(service: TService) {
        this.index = this.index.bind(this);
        this.show = this.show.bind(this);
        this.store = this.store.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.softDelete = this.softDelete.bind(this);
        this.service = service;
        // GatewayService(service);
    }
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.locals.response = await this.service.index(req.query);
            next();
        } catch (error) {
            next(error);
        }
    }
    async store(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const entity = await this.service.store(req.body);
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
    async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // const _id: string = req.params._id;
            res.locals.params = req.params;
            const keys = Object.keys(req.params);
            const entity = await this.service.show(req.params[keys[0]]);
            if (!entity) {
                throw new NotFoundException();
            }
            res.locals.response = entity;
            next();
        } catch (error) {
            next(error);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.locals.params = req.params;
        const keys = Object.keys(req.params);
        try {
            const result = await this.service.delete(req.params[keys[0]]);
            if (!result) {
                throw new NotFoundException();
            }
            res.status(204);
            res.locals.response = result;
            next();
        } catch (error) {
            next(error);
        }
    }

    async softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.locals.params = req.params;
        const keys = Object.keys(req.params);
        try {
            const result = await this.service.softDelete(req.params[keys[0]]);
            if (!result) {
                throw new NotFoundException();
            }
            res.status(204);
            res.locals.response = result;

            next();// No Content, el recurso se ha marcado como eliminado correctamente
        } catch (error) {
            next(error);
        }
    }
}