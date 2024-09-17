// CompletedFasesOrderController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { CompletedFasesOrderService } from './CompletedFasesOrderService';
import { CompletedFasesOrderRepository } from './CompletedFasesOrderRepository';
import { CompletedFasesOrderModel } from './CompletedFasesOrderModel';
import { CompletedFasesOrderType } from './CompletedFasesOrderType';
import { Request, Response, NextFunction } from 'express';

class CompletedFasesOrderController extends ControllerBase<CompletedFasesOrderType, CompletedFasesOrderService> {
    constructor(service: CompletedFasesOrderService) {
        super(service);
        this.pending = this.pending.bind(this);
    }
    async pending(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query={
                $expr: {
                  $lt: ["$delivered_quantity", "$quantity"]
                }
              };
            res.locals.response = await this.service.findWithMongo(query);
            next();
        } catch (error) {
            next(error);
        }
    }
}

const repository = new CompletedFasesOrderRepository(CompletedFasesOrderModel);
const service = new CompletedFasesOrderService(repository);
const completedFasesOrderController = new CompletedFasesOrderController(service);
export { completedFasesOrderController };
