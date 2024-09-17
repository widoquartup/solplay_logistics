// AlmacenRepository.ts
import { AlmacenType } from './AlmacenType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class AlmacenRepository extends RepositoryBase <AlmacenType> {
  constructor(model: mongoose.Model<AlmacenType>) {
    super(model);
  }
}

