import { Model } from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';
import DataConsumerService from './DataConsumerService';
import { dataConsumerConfig } from './config/Config';
import { BaseDocument } from '@base/Bases/__interfaces/BaseDocument';

// Definición de la interfaz para la configuración
interface ServiceConfig<T extends BaseDocument> {
  model: Model<T>;
  repository: RepositoryBase<T>;
  consumerObject:  InstanceType<new (...args: any[]) => any>;
  intervalMs?: number;
}

// Interfaz para la configuración global
interface GlobalConfig {
  services: ServiceConfig<any>[];
}

export const consumidorDatos = async () => {
  const dataConsumerManager = new DataConsumerManager(dataConsumerConfig);
  await dataConsumerManager.init();
};

class DataConsumerManager {
  private services: Map<string, DataConsumerService<any, any>> = new Map();
  private config: GlobalConfig;

  constructor(config: GlobalConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    try {
      await this.initializeServices();
      this.startAllServices();
      console.log('DataConsumerManager initialized and all services started.');
    } catch (error) {
      console.error('Error initializing DataConsumerManager:', error);
    }
  }

  private async initializeServices(): Promise<void> {
    for (const serviceConfig of this.config.services) {
      try {
        const { model, repository, consumerObject } = serviceConfig;
        const service = new DataConsumerService({ model, repository, consumerObject });
        this.services.set(model.modelName, service);
        console.log(`Initialized service for model: ${model.modelName}`);
      } catch (error) {
        console.error(`Error initializing service for ${serviceConfig.model.modelName}:`, error);
      }
    }
  }

  private startAllServices(): void {
    for (const [modelName, service] of this.services) {
      const config = this.config.services.find(c => c.model.modelName === modelName);
      const intervalMs = config?.intervalMs || 5000;
      service.start(intervalMs);
      console.log(`Started service for model: ${modelName}`);
    }
  }

  stop(): void {
    for (const [modelName, service] of this.services) {
      service.stop();
      console.log(`Stopped service for model: ${modelName}`);
    }
    console.log('All services stopped.');
  }

  getService(modelName: string): DataConsumerService<any, any> | undefined {
    return this.services.get(modelName);
  }
}

export default DataConsumerManager;