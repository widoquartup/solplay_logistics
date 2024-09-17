// MessageRepository.ts
import { MessageType } from './MessageType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class MessageRepository extends RepositoryBase <MessageType> {
  constructor(model: mongoose.Model<MessageType>) {
    super(model);
  }
}

