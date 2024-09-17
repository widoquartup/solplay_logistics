// PendingStorageController.ts
import { Request, Response, NextFunction } from 'express';
import { ControllerBase } from '@base/Bases/ControllerBase';
import { PendingStorageService } from './PendingStorageService';
import { PendingStorageRepository } from './PendingStorageRepository';
import { PendingStorageModel } from './PendingStorageModel';
import { CargaToldoDataType, PendingStorageType } from './PendingStorageType';



class PendingStorageController extends ControllerBase<PendingStorageType, PendingStorageService> {
    constructor(service: PendingStorageService) {
        super(service);
    }

    async cargaToldo (req: Request, res: Response, next: NextFunction) {
        try {
            // console.log("Carga toldo", req.body);

            // const data = req.body;
            // const response = { result: {ok: true}, request: data};
            // // const result = await this._service.cargaToldo(data);
            // // res.locals.response = result;
            // res.status(200).json(response);

            const cargaToldo = req.body as CargaToldoDataType;
            const result = await service.cargaToldo(cargaToldo);
            res.locals.response = result;
            res.status(200);
        } catch (error) {
            console.log("ERROR",error);
            res.locals.response = { error };
            res.status(400);
        }
        next();
        return;
    }
}

const repository = new PendingStorageRepository(PendingStorageModel);
const service = new PendingStorageService(repository);
const pendingStorageController = new PendingStorageController(service);
export { pendingStorageController };