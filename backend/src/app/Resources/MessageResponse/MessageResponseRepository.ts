// MessageResponseRepository.ts
import { MessageResponseType } from './MessageResponseType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class MessageResponseRepository extends RepositoryBase <MessageResponseType> {
  constructor(model: mongoose.Model<MessageResponseType>) {
    super(model);
  }
}

