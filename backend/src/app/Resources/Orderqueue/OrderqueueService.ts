// OrderqueueService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { OrderqueueRepository } from './OrderqueueRepository';
import { OrderqueueType } from './OrderqueueType';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";
export class OrderqueueService extends ServiceBase<OrderqueueType> {
  constructor(repository: OrderqueueRepository) {
    super(repository);
  }
  // Sobrescribir métodos si es necesario
}
