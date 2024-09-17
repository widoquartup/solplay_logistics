// MessageQueueService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { MessageQueueRepository } from './MessageQueueRepository';
import { MessageQueueType } from './MessageQueueType';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";
export class MessageQueueService extends ServiceBase<MessageQueueType> {
  constructor(repository: MessageQueueRepository) {
    super(repository);
  }
  // Sobrescribir métodos si es necesario
}
