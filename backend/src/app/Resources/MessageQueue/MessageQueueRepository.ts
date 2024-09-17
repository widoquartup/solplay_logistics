// MessageQueueRepository.ts
import { MessageQueueType } from './MessageQueueType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class MessageQueueRepository extends RepositoryBase <MessageQueueType> {
  constructor(model: mongoose.Model<MessageQueueType>) {
    super(model);
  }
}

