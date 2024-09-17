// MessageQueueController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { MessageQueueService } from './MessageQueueService';
import { MessageQueueRepository } from './MessageQueueRepository';
import { MessageQueueModel } from './MessageQueueModel';
import { MessageQueueType } from './MessageQueueType';
import { Request, Response, NextFunction } from 'express';
import { SortType } from '@base/Bases/RepositoryInterface';

class MessageQueueController extends ControllerBase<MessageQueueType, MessageQueueService> {
    constructor(service: MessageQueueService) {
        super(service);
        this.pending = this.pending.bind(this);
    }

    async pending(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const query = {
                $expr: {
                    "$or": [{ "fromPending": true }, { "toPending": true }]
                }
            };
            res.locals.response = await this.service.findWithMongo(query, { _id: -1 });
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
