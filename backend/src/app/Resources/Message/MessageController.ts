// MessageController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { MessageService } from './MessageService';
import { MessageRepository } from './MessageRepository';
import { MessageModel } from './MessageModel';
import { MessageType } from './MessageType';

class MessageController extends ControllerBase<MessageType, MessageService> {
    constructor(service: MessageService) {
        super(service);
    }
}

const repository = new MessageRepository(MessageModel);
const service = new MessageService(repository);
const messageController = new MessageController(service);
export { messageController };
