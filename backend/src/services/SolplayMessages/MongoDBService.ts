import mongoose, { Model, Document } from 'mongoose';
import EndedOrder from './models/db/EndedOrder';
import MessageResponse from './models/db/MessageResponse';
import Message from './models/db/Message';
// import Position from './models/db/Position';

class MongoDBService {
  private uri: string;
  private dbName: string;

  constructor(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
  }

  async connect(): Promise<void> {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(this.uri, { dbName: this.dbName });
    }
  }

  async disconnect(): Promise<void> {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
  }

  async createDocument<T extends Document>(Model: Model<T>, data: Partial<T>): Promise<T> {
    await this.connect();
    const document = new Model(data);
    return document.save();
  }

  async findDocuments<T extends Document>(Model: Model<T>, query: object = {}): Promise<T[]> {
    await this.connect();
    return Model.find(query).exec();
  }

  async updateDocument<T extends Document>(Model: Model<T>, id: string, updateData: Partial<T>): Promise<T | null> {
    await this.connect();
    return Model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteDocument<T extends Document>(Model: Model<T>, id: string): Promise<T | null> {
    await this.connect();
    return Model.findByIdAndDelete(id).exec();
  }
}

export { MongoDBService, EndedOrder, MessageResponse, Message, Position };