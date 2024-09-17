import { RepositoryBase } from '@base/Bases/RepositoryBase';
import { Model } from 'mongoose';
import { BaseDocument } from '@base/Bases/__interfaces/BaseDocument';

export interface DataConsumerConfig<T extends BaseDocument, R extends RepositoryBase<T>> {
  model: Model<T>;
  repository: R;
  consumerObject: InstanceType<new (...args: any[]) => any>;
}

class DataConsumer<T extends BaseDocument, R extends RepositoryBase<T>> {
  private model: Model<T>;
  private repository: R;
  private consumerObject: InstanceType<new (...args: any[]) => any>;

  constructor(config: DataConsumerConfig<T, R>) {
    this.model = config.model;
    this.repository = config.repository;
    this.consumerObject = config.consumerObject;
  }

  getConsumerObject():InstanceType<new (...args: any[]) => any>{
    return this.consumerObject;
  }


  getModelName(): string {
    return this.model.modelName || this.model.constructor.name;
  }

  getRepositoryName(): string {
    return this.repository.constructor.name;
  }

  async consumeNewRecords(lastCheckedTimestamp: Date): Promise<T[]> {
    const newRecords = await this.model.find({
      createdAt: { $gt: lastCheckedTimestamp },
      isDeleted: false
    }).sort({ createdAt: 1 });

    return newRecords;
  }

  async consumeUpdatedRecords(lastCheckedTimestamp: Date): Promise<T[]> {
    const updatedRecords = await this.model.find({
      updatedAt: { $gt: lastCheckedTimestamp },
      isDeleted: false
    }).sort({ updatedAt: 1 });

    return updatedRecords;
  }

  async processRecords(records: T[], processFunction: (record: T) => Promise<void>): Promise<void> {
    for (const record of records) {
      await processFunction(record);
    }
  }
}

export default DataConsumer;