// PendingStorageRepository.ts
import { PendingStorageType } from './PendingStorageType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class PendingStorageRepository extends RepositoryBase <PendingStorageType> {
  constructor(model: mongoose.Model<PendingStorageType>) {
    super(model);
  }
}

