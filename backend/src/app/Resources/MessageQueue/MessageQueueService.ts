import { ServiceBase } from '@base/Bases/ServiceBase';
import { MessageQueueRepository } from './MessageQueueRepository';
import { FakeStation, MessageQueueType } from './MessageQueueType';

export class MessageQueueService extends ServiceBase<MessageQueueType> {
  constructor(repository: MessageQueueRepository) {
    super(repository);
  }

  private getRandomStation(): FakeStation {
    return {
      station_id: Math.floor(Math.random() * 64) + 1,
      station_type: Math.random() < 0.5 ? 1 : 3,
      level: Math.random() < 0.5 ? 1 : 2
    };
  }
  
  async generateMovements(numMovements: number, station_id: number = 1, station_type: number = 3, level: number = 2): Promise<{ data: string }> {
    let currentMsgId: number = 361; // Iniciamos con el msg_id del ejemplo
    let currentStation: FakeStation = { station_id, station_type, level }; // Estación inicial
  
    for (let i = 0; i < numMovements; i++) {
      const nextStation = this.getRandomStation();
      
      const movement = {
        from: {
          type: 1,
          msg_id: currentMsgId,
          cart_id: 1,
          station_id: currentStation.station_id,
          station_type: currentStation.station_type,
          level: currentStation.level,
          options: "0",
          initial_inputs: "0",
          cargo_id: " "
        },
        to: {
          type: 3,
          msg_id: currentMsgId + 1,
          cart_id: 1,
          station_id: nextStation.station_id,
          station_type: nextStation.station_type,
          level: nextStation.level,
          options: "0",
          initial_inputs: "0",
          cargo_id: " "
        },
        order: {
          number: (66564 + i).toString(), // Incrementamos el número de orden
          bulto: 1,
          fecha_entrega: "2024-05-07", 
          delivery_ready: false,
          detalle: "TOLDO B.I. CITY 9010 (con fase 3 y 4)",
          cantidad: 3,
          cantidad_fabricada: 0
        },
        fromPending: true,
        toPending: true,
        isDeleted: false
      };
  
      await this.repository.create(movement as MessageQueueType);
  
      // Preparamos para el siguiente movimiento
      currentMsgId += 2;
      currentStation = nextStation;
    }
    return { data: "ok" };
  }
}