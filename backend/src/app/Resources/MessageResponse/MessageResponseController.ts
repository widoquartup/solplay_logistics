// MessageResponseController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { MessageResponseService } from './MessageResponseService';
import { MessageResponseRepository } from './MessageResponseRepository';
import { MessageResponseModel } from './MessageResponseModel';
import { MessageResponseType } from './MessageResponseType';

class MessageResponseController extends ControllerBase<MessageResponseType, MessageResponseService> {
    constructor(service: MessageResponseService) {
        super(service);
    }
}

const repository = new MessageResponseRepository(MessageResponseModel);
const service = new MessageResponseService(repository);
const messageResponseController = new MessageResponseController(service);
export { messageResponseController };
