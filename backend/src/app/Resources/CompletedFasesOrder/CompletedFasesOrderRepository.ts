// CompletedFasesOrderRepository.ts
import { CompletedFasesOrderType } from './CompletedFasesOrderType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class CompletedFasesOrderRepository extends RepositoryBase <CompletedFasesOrderType> {
  constructor(model: mongoose.Model<CompletedFasesOrderType>) {
    super(model);
  }

}

