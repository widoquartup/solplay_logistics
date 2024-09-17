/* eslint-disable no-case-declarations */
import { Kafka, Consumer, EachMessagePayload, KafkaConfig } from 'kafkajs';
import dotenv from 'dotenv';
import { CompletedFasesOrderRepository } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderRepository';
import { CompletedFasesOrderModel } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderModel';
import { convertQuartupDateToDate } from '../SolplayMessages/helpers/Helpers';
import { CompletedFasesOrderType } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderType';
import * as fs from 'fs';
import * as path from 'path';
import GestionAlmacenService from '../SolplayMessages/services/GestionAlmacenService';
import { context } from '@base/context';

dotenv.config();

const KAFKA_HOST = process.env.KAFKA_HOST || "localhost";
const KAFKA_PORT = process.env.KAFKA_PORT || "9092";
const KAFKA_TOPIC_OFS_CHANGED = process.env.KAFKA_TOPIC_OFS_CHANGED || "topic-tmp";
const KAFKA_TOPIC_MOVI_MONTAJE = process.env.KAFKA_TOPIC_MOVI_MONTAJE || "topic2-tmp";
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "kafla-id";


export interface KafkaMessage {
  [key: string]: any;
} 

const certDir = path.join(__dirname, '..', '..',  '..', 'cert', 'kafka');

const ssl = {
  rejectUnauthorized: false, // Establece en true en producción
  ca: fs.readFileSync(path.join(certDir, 'local/mac-guillermo.ca.crt'), 'utf-8'),
  key: fs.readFileSync(path.join(certDir, 'local/mac-guillermo.key'), 'utf-8'),
  cert: fs.readFileSync(path.join(certDir, 'local/mac-guillermo.crt'), 'utf-8'),
};
// const ssl = {
//   rejectUnauthorized: false, // Establece en true en producción
//   ca: fs.readFileSync(path.join(certDir, 'certificate.ca.crt'), 'utf-8'),
//   key: fs.readFileSync(path.join(certDir, 'certificate.key'), 'utf-8'),
//   cert: fs.readFileSync(path.join(certDir, 'certificate.crt'), 'utf-8')
// };


const kafkaConfig: KafkaConfig = {
  clientId: KAFKA_CLIENT_ID,
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
  ssl: ssl,
  // sasl: {
  //   mechanism: 'plain', // o 'scram-sha-256' o 'scram-sha-512' según tu configuración
  //   username: 'your-username',
  //   password: 'your-password'
  // }
};

const kafka = new Kafka(kafkaConfig);

const consumer: Consumer = kafka.consumer({ groupId: 'solplay' });

const processMessage = async (topic: string, message: string | KafkaMessage): Promise<void> => {
  try {
    console.log(`Processing message from topic: ${topic}`);
    
    let messageData: KafkaMessage;
    if (typeof message === 'string') {
      messageData = JSON.parse(message);
    } else {
      messageData = message;
    }
    
    switch (topic) {
      case KAFKA_TOPIC_OFS_CHANGED:
        // console.log('Processing OFS_CHANGED message:', messageData);
        // Add your processing logic for OFS_CHANGED topic here
        break;
      case KAFKA_TOPIC_MOVI_MONTAJE:
        // console.log('Processing MOVI_MONTAJE message:', messageData);
        // Busco si existe el registro en la la tabla completed_fases_orders

        const gestionAlmacenService = new GestionAlmacenService(context.message);
        const result = await gestionAlmacenService.receivedClosedFaseOrder(messageData);
        break;
      default:
        console.log('Unknown topic:', topic);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
};

const runConsumer = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC_OFS_CHANGED, fromBeginning: true });
  await consumer.subscribe({ topic: KAFKA_TOPIC_MOVI_MONTAJE, fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      
      // Call the processMessage function for each received message
      await processMessage(topic, message.value?.toString() || '');
    },
  });
};

runConsumer().catch(console.error);

export { runConsumer, processMessage };