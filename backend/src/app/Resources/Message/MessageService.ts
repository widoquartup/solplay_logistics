// MessageService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { MessageRepository } from './MessageRepository';
import { MessageType } from './MessageType';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";
export class MessageService extends ServiceBase<MessageType> {
  constructor(repository: MessageRepository) {
    super(repository);
  }
  // Sobrescribir métodos si es necesario
}
