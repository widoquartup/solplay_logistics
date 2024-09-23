// DeliveryordersqueueRepository.ts
import { DeliveryordersqueueType } from './DeliveryordersqueueType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class DeliveryordersqueueRepository extends RepositoryBase <DeliveryordersqueueType> {
  constructor(model: mongoose.Model<DeliveryordersqueueType>) {
    super(model);
  }
}

