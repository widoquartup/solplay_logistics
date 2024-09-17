// OrderqueueRepository.ts
import { OrderqueueType } from './OrderqueueType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class OrderqueueRepository extends RepositoryBase <OrderqueueType> {
  constructor(model: mongoose.Model<OrderqueueType>) {
    super(model);
  }
}

