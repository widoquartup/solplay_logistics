import { MessageQueueRepository } from '@src/app/Resources/MessageQueue/MessageQueueRepository';
import { MessageQueueService } from '@src/app/Resources/MessageQueue/MessageQueueService';
import { MessageQueueModel } from '@src/app/Resources/MessageQueue/MessageQueueModel';
// import GatewayService from '../GatewayService';
// import colors from 'cli-color';
import { FindQueryParams } from '@base/Bases/__interfaces/FindQueryParams';
// import { FindResult } from '@base/Bases/__interfaces/FindResult';
import dotenv from 'dotenv';
import { MessageQueueType } from '@src/app/Resources/MessageQueue/MessageQueueType';

// import SocketHandler from '@base/Utils/SocketHandler';
// import { context } from '@base/context';
dotenv.config();
class ProcessMessageQueue {

    private messageQueueRepository: MessageQueueRepository;
    private messageQueueService: MessageQueueService;

    constructor() {
        this.messageQueueRepository = new MessageQueueRepository(MessageQueueModel);
        this.messageQueueService = new MessageQueueService(this.messageQueueRepository);
    }

    async getByMessageId(msg_id:number) {
        const result = await this.messageQueueRepository.find({
            page:"1", 
            itemsPerPage:"1", 
            filters:JSON.stringify({"$and":[{"to.msg_id":{"=": msg_id.toString()}},{"from.msg_id":{"=": msg_id.toString()}}]}),
            sortBy:'["_id"]'
        });
        // console.log(result);
        if (result.collection && result.collection.length>0){
            return result.collection[0];
        }
        return null;
    }


    async getNextMessagePending() {
        // //-->console.log(data);
        // {
        //     page?: string;
        //     itemsPerPage?: string;
        //     permanentFilters?: string; //json_encode_string
        //     filters?: string; //json_encode_string
        //     simpleSearch?: string; //json_encode_string
        //     sortBy?: string; //json_encode_string
        //     sortDesc?: string; //json_encode_string
        //     project?: string; //json_encode_string
        //   }
        // console.log("ENVIANDO Topending:true");
        const result = await this.messageQueueRepository.find({
            page:"1", 
            itemsPerPage:"1", 
            filters:JSON.stringify({"toPending":{"=":true}}),
            sortBy:'["_id"]'
        });
        if (result.collection && result.collection.length>0){
            // //-->console.log(result);
            return result.collection[0];
        }
        return null;
        // SocketHandler.emitMessage(SOCKET_EVENT_STORE_CHANGED, JSON.stringify(data));
    }
    async update(message:MessageQueueType) {
       
        const result = await this.messageQueueService.update(message._id as string, message);
        // console.log("Actualizando queuemessage", message._id, result);
        return result;
        // SocketHandler.emitMessage(SOCKET_EVENT_STORE_CHANGED, JSON.stringify(data));
    }

    async changeStatusOfMessageQueue(msg_id: number) {
        const result = await this.messageQueueService.index({
            page:"1", 
            itemsPerPage:"1", 
            filters: `{"$or": [{"from.msg_id": {"=": ${msg_id}}}, {"to.msg_id": {"=": ${msg_id}}}] }`,
            sortBy:'["_id"]'
        });
        if (result.collection && result.collection.length>0){
            const row = result.collection[0];
            if (row.from && row.from.msg_id == msg_id){
                row.fromPending = true;
                row.from.msg_id = 0;
            }else{
                row.to.msg_id = 0;
                row.toPending = true;
            }
            await this.update(row);
            return ;
        }
    }

}

export default ProcessMessageQueue;