// AlmacenRepository.ts

import { AlmacenType } from './AlmacenType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';
import { context } from '@base/context';
import NotFoundException from '@base/Exceptions/NotFoundException';

export class AlmacenRepository extends RepositoryBase<AlmacenType> {
  constructor(model: mongoose.Model<AlmacenType>) {
    super(model);
  }

  async updateStation(almacen: AlmacenType, datos: Partial<AlmacenType>): Promise<AlmacenType> { 
    console.log("UPDATE", almacen, datos, this.model);

    const updatedDocument = await this.model.findOneAndUpdate(
        { station_id: almacen.station_id, station_type: almacen.station_type, level: almacen.level },
        datos,
        { new: true, runValidators: true }
    );

    console.log("UPDATEDOCUMENT", updatedDocument);

    if (!updatedDocument) {
        throw new NotFoundException(`Documento con station_id=${almacen.station_id}, station_type=${almacen.station_type}, level=${almacen.level} no encontrado.`);
    }

    const action = {
        action: "updated",
        entity: this.model.collection.collectionName,
        item: updatedDocument,
    };
    context.actions = [...context.actions, action];

    return updatedDocument;
  }
}