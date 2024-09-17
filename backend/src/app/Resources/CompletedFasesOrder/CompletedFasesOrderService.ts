// CompletedFasesOrderService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { CompletedFasesOrderRepository } from './CompletedFasesOrderRepository';
import { CompletedFasesOrderType } from './CompletedFasesOrderType';
import { FindQueryParams } from '@base/Bases/__interfaces/FindQueryParams';
import dotenv from 'dotenv';
import { FilterQuery } from 'mongoose';
import { calculateOrderReadyDate } from '@src/services/SolplayMessages/helpers/Helpers';
dotenv.config();


export class CompletedFasesOrderService extends ServiceBase<CompletedFasesOrderType> {
  constructor(repository: CompletedFasesOrderRepository) {
    super(repository);
    this.getOrder = this.getOrder.bind(this);
  }
  // Sobrescribir métodos si es necesario


  async getOrder(orderNumber: number): Promise<CompletedFasesOrderType | null> {
    try {
      const hoy = calculateOrderReadyDate();
      // Formatear la fecha (opcional)
      const query = {
            "$and": [
              {order_number: orderNumber },
              {delivery_date: {
                "$lt": hoy}
              }
            ]
          };
      // console.log("CompletedFasesOrderService findOne getOrder" , query);
      return this.repository.findOne(query);
    } catch (error) {
      return null;
    }
  }
}
