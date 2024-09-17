// MessageResponseService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { MessageResponseRepository } from './MessageResponseRepository';
import { MessageResponseType } from './MessageResponseType';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";
export class MessageResponseService extends ServiceBase<MessageResponseType> {
  constructor(repository: MessageResponseRepository) {
    super(repository);
  }
  // Sobrescribir métodos si es necesario
}
