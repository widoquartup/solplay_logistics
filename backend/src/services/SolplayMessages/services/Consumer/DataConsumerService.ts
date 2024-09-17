import { BaseDocument } from '@base/Bases/__interfaces/BaseDocument';
import DataConsumer, { DataConsumerConfig } from './DataConsumer';
import { RepositoryBase } from '@base/Bases/RepositoryBase';
import { VariableRepository } from '@src/app/Resources/Variable/VariableRepository';
import { VariableModel } from '@src/app/Resources/Variable/VariableModel';
import GestionAlmacenService from '../GestionAlmacenService';


class DataConsumerService<T extends BaseDocument, R extends RepositoryBase<T>> {
  private consumer: DataConsumer<T, R>;
  private intervalId: NodeJS.Timeout | null = null;
  private lastChecked: Date;
  private variableRepository = new VariableRepository(VariableModel);
  constructor(config: DataConsumerConfig<T, R>) {
    this.consumer = new DataConsumer(config);
    this.lastChecked = new Date();
  }

  async updateLastCkecked (){
    this.lastChecked = new Date();
    await this.variableRepository.setValue("lastChecked", `consumer_${this.consumer.getModelName()}`, this.lastChecked );
  }

  async initStart (intervalMs: number) {
    this.lastChecked = new Date( await this.variableRepository.getValue( "lastChecked", `consumer_${this.consumer.getModelName()}`, this.lastChecked.toISOString()) );
    // console.log("lastChecked",this.lastChecked);
    this.intervalId = setInterval(async () => {
      await this.processNewAndUpdatedRecords();
    }, intervalMs);
    console.log(`DataConsumerService started for ${this.consumer.getModelName()} with interval of ${intervalMs}ms`);
  }


  start(intervalMs: number = 5000): void {
    if (this.intervalId) {
      console.warn('Service is already running');
      return;
    }
    this.initStart(intervalMs);

  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log(`DataConsumerService stopped for ${this.consumer.getModelName()}`);
    }
  }

  private async processNewAndUpdatedRecords(): Promise<void> {

    try {
      // const newRecords = await this.consumer.consumeNewRecords(this.lastChecked);
      // await this.consumer.processRecords(newRecords, this.processNewRecord);

      const updatedRecords = await this.consumer.consumeUpdatedRecords(this.lastChecked);
      await this.consumer.processRecords(updatedRecords, this.processUpdatedRecord);

    } catch (error) {
      console.error(`Error processing records for ${this.consumer.getModelName()}:`, error);
    }
  }

  // private processNewRecord = async (record: T): Promise<void> => {
  //   console.log(`Processing new ${this.consumer.getModelName()} record: ${record._id}`);
  //   // Implement logic for processing new records here
  // }

  private processUpdatedRecord = async (record: T): Promise<void> => {

    if (record){
      const consumerObject = this.consumer.getConsumerObject();
      const result = await consumerObject.ifExistOrderDeliverIt(record);
      console.log('Record:', record);
      console.log('Consumer return :', result);
    }

    // this.updateLastCkecked();
    // console.log("Lastchecked = ", this.lastChecked);
    console.log(`Processing updated ${this.consumer.getModelName()} record: ${record}`);
    // Implement logic for processing updated records here
  }
}

export default DataConsumerService;