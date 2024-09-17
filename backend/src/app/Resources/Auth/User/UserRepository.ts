// UserRepository.ts
import { UserType } from './types/UserType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';
import NotFoundException from "@base/Exceptions/NotFoundException";
import { context } from '@base/context';
import bcrypt from 'bcrypt';

export class UserRepository extends RepositoryBase<UserType> {
  constructor(model: mongoose.Model<UserType>) {
    super(model);
  }
  async create(item: Omit<UserType, "_id">): Promise<UserType> {
    item.password = await this.hashPassword(item.password);
    const created = await this.model.create(item as UserType);
    const action = {
      action: "created",
      entity: this.model.collection.collectionName,
      item: created,
    };
    context.actions = [...context.actions, action];
    return created;
  }
  async update(_id: string, datos: Partial<UserType>): Promise<UserType> {
    if ('password' in datos) {
      datos.password = await this.hashPassword(datos.password);
    }
    const updatedDocument = await this.model.findOneAndUpdate(
      { _id, isDeleted: false },
      datos,
      { new: true }
    );
    if (!updatedDocument) {
      throw new NotFoundException(`Documento con _id=${_id} no encontrado.`);
    }
    const action = {
      action: "updated",
      entity: this.model.collection.collectionName,
      item: updatedDocument,
    };
    context.actions = [...context.actions, action];
    return updatedDocument;
  }
  async findByEmail(email: string): Promise<UserType> {
    const user = await this.model.findOne({ email }).select('-createdAt -updatedAt -isDeleted').lean(true);
    if (user) {
      // delete user.password; // Eliminar el campo password del objeto user
      return user;
    }
    throw new NotFoundException();
  }

  async findByCredentials(email: string, password: string): Promise<UserType> {
    const user = await this.model.findOne({ email }).select('-createdAt -updatedAt -isDeleted').lean(true);
    if (user && await bcrypt.compare(password, user.password)) {
      // delete user.password; // Eliminar el campo password del objeto user
      return user;
    }
    throw new NotFoundException();
  }
  private async hashPassword(password?: string): Promise<string> {
    if (!password) {
      throw new Error('Password is undefined or empty');
    }
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async findByApiKey(apiKey: string): Promise<UserType> {
    const user = await this.model.findOne({ apiKey }).select('-createdAt -updatedAt -isDeleted').lean(true);
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }
  
}

