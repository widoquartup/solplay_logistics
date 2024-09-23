// DeliveryordersqueueController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { DeliveryordersqueueService } from './DeliveryordersqueueService';
import { DeliveryordersqueueRepository } from './DeliveryordersqueueRepository';
import { DeliveryordersqueueModel } from './DeliveryordersqueueModel';
import { DeliveryordersqueueType } from './DeliveryordersqueueType';

class DeliveryordersqueueController extends ControllerBase<DeliveryordersqueueType, DeliveryordersqueueService> {
    constructor(service: DeliveryordersqueueService) {
        super(service);
        // Si creas un nuevo método, tienes que hacer un bind para usar las propiedades de la clase base
        // Ej. this.nuevoMetodo = this.nuevoMetodo.bind(this);
    }
}

const repository = new DeliveryordersqueueRepository(DeliveryordersqueueModel);
const service = new DeliveryordersqueueService(repository);
const deliveryordersqueueController = new DeliveryordersqueueController(service);
export { deliveryordersqueueController };
