// DeliveryordersqueueService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { DeliveryordersqueueRepository } from './DeliveryordersqueueRepository';
import { DeliveryordersqueueType } from './DeliveryordersqueueType';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";
export class DeliveryordersqueueService extends ServiceBase<DeliveryordersqueueType> {
  constructor(repository: DeliveryordersqueueRepository) {
    super(repository);
  }
  // Sobrescribir métodos si es necesario
}
