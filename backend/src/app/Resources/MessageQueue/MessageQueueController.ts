// MessageQueueController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { MessageQueueService } from './MessageQueueService';
import { MessageQueueRepository } from './MessageQueueRepository';
import { MessageQueueModel } from './MessageQueueModel';
import { MessageQueueType } from './MessageQueueType';
import { Request, Response, NextFunction } from 'express';

class MessageQueueController extends ControllerBase<MessageQueueType, MessageQueueService> {
    constructor(service: MessageQueueService) {
        super(service);
        this.pending = this.pending.bind(this);
        this.fakeMovements = this.fakeMovements.bind(this);
    }

    async pending(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const query = {
                "$or": [{ "fromPending": true }, { "toPending": true }]
            };
                // $expr: {
                // }
            res.locals.response = await this.service.findWithMongo(query, { _id: 1 });
            next();
        } catch (error) {
            next(error);
        }
    }


    async fakeMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.locals.params = req.params;
            const keys = Object.keys(req.params);
            // const entity = await this.service.show(req.params[keys[0]]);
            // req.params[keys[0]]
            res.locals.response = await this.service.generateMovements(
                parseInt(req.params[keys[0]]),
                parseInt(req.params[keys[1]]),
                parseInt(req.params[keys[2]]),
                parseInt(req.params[keys[3]])
            );
            next();
        } catch (error) {
            next(error);
        }
    }

}

const repository = new MessageQueueRepository(MessageQueueModel);
const service = new MessageQueueService(repository);
const messageQueueController = new MessageQueueController(service);
export { messageQueueController };
