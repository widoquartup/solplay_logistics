
// import { MessageQueueType } from './MessageQueue/MessageQueueType';
import { context } from '@base/context';
import { getLoad, getUnload, sleep } from '@src/services/SolplayMessages/helpers/Helpers';
import { TransportParameterType, ResponseTransportType } from '@src/app/Resources/Almacen/AlmacenTypes';
import CancelTransit from '@src/services/SolplayMessages/models/messages/send/CancelTransit';

import clc from 'cli-color';
import { MessageQueueModel } from '@src/app/Resources/MessageQueue/MessageQueueModel';
import { MessageQueueRepository } from '@src/app/Resources/MessageQueue/MessageQueueRepository';
import { MessageQueueService } from '@src/app/Resources/MessageQueue/MessageQueueService';
import { MessageQueueFromToType, MessageQueueType } from '@src/app/Resources/MessageQueue/MessageQueueType';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";

export class TransportService {

  private messageQueueRepository: MessageQueueRepository;
  private messageQueueService: MessageQueueService;

  constructor() {
    this.messageQueueRepository = new MessageQueueRepository(MessageQueueModel);
    this.messageQueueService = new MessageQueueService(this.messageQueueRepository);
  }

  // envia mensajes para cargar a una estación y descargar en otra.
  async transport(from: TransportParameterType, to: TransportParameterType): Promise<ResponseTransportType> {
    // console.log("**************TRANSPORT");
    // console.log("FROM", from);
    // console.log("TO", to);
    // console.log("**************<<<<<>>>>>");
    const msgFrom = JSON.parse(JSON.stringify(getLoad(0, from))) as  MessageQueueFromToType;
    try {
      const msgTo = JSON.parse(JSON.stringify(getUnload(0, to))) as  MessageQueueFromToType;
      const result = await this.messageQueueService.store(
        {
          from: msgFrom,
          to: msgTo,
          fromPending: true,
          toPending: true
        }  as MessageQueueType
      );
      if (!result._id) {
        return { data: "Error guardando el mensaje  (_id)", code: 400 };
      }
      // si no hubo error y from es station_id == 100, marcar en StationService vaciar lastStationState a travez de context.message
      if (from.stationId == 100){
        context.message.voidLastStateInStationService(from.stationType);
      }


    } catch (error: any) {
      return { data: "Error guardando el mensaje", code: 400 };
    }
    return { data: "OK", code: 200 };
  }

  async unload(to: TransportParameterType): Promise<ResponseTransportType> {
    // const message = context.message;
    // const msgId = await message.getNextMessageId();
    // //-->console.log("Mensaje ID:", msgId);

    const msgTo = JSON.parse(JSON.stringify(getUnload(0, to))) as  MessageQueueFromToType;
    // const msgTo = getUnload(msgId.toString(), to);
    // // const msgTo = getUnload(msgId.toString(), getStationInfo(to));
    // //-->console.log('Unload Data:', to, msgTo, msgTo.getData(), new Date().toUTCString());
    // message.send(msgTo.getData(), msgTo.getType());

    const result = await this.messageQueueService.store(
      {
        from: null,
        to: msgTo,
        fromPending: false,
        toPending: true
      } as MessageQueueType
    );
    //-->console.log("RESULT  ", result);
    if (!result._id) {
      return { data: "Error guardando unload (_id)", code: 400 };
    }
    return { data: "OK", code: 200 };
  }
  
  async deliveryFromLoadStation(stationType: number){
    return await this.transport(
      {stationId: 100, stationType, level: 3},
      {stationId: 102, stationType: 2,level: 0},
    );
  }


  async cancelTransit() {
    // const cancelTransitsModel = new CancelTransit();
    // cancelTransitsModel.setType(20);
    const msgId = await context.message.getNextMessageId();
    // cancelTransitsModel.setMsgId(msgId);
    // cancelTransitsModel.setCartId(1);
    const msgString:string = " 20"+msgId.toString().padStart(5)+"    1";
    console.log("Cancelar tránsito ");
    // console.log('Load Data:', cancelTransitsModel, new Date().toUTCString());
    await context.message.send(msgString, 20);
    // await context.message.send(cancelTransitsModel.getData(), cancelTransitsModel.getType());
    return { data: "OK", code: 200 };
  }

  resetGateway(){
    context.message.reset();
    return { data: "OK", code: 200 };
  }


}
