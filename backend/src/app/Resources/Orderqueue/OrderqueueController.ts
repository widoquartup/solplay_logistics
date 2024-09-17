// OrderqueueController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { OrderqueueService } from './OrderqueueService';
import { OrderqueueRepository } from './OrderqueueRepository';
import { OrderqueueModel } from './OrderqueueModel';
import { OrderqueueType } from './OrderqueueType';

class OrderqueueController extends ControllerBase<OrderqueueType, OrderqueueService> {
    constructor(service: OrderqueueService) {
        super(service);
    }
}

const repository = new OrderqueueRepository(OrderqueueModel);
const service = new OrderqueueService(repository);
const orderqueueController = new OrderqueueController(service);
export { orderqueueController };
