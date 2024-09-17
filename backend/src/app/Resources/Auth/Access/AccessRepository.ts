// AccessRepository.ts
import { AccessType } from './types/AccessType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';



export class AccessRepository extends RepositoryBase<AccessType> {
  constructor(model: mongoose.Model<AccessType>) {
    super(model);
  }
}

