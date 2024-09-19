import TcpClient from './TcpClient';
import ProcessResultMessage from './ProcessResultMessage';

import colors from 'cli-color';
import dotenv from 'dotenv';
import Nack from './models/messages/received/Nack';
import Ack from './models/messages/received/Ack';
import TransitAck from './models/messages/received/TransitAck';
import CircuitState from './models/messages/received/CircuitState';
import CartState, { CartStateProcess } from './models/messages/received/CartState';
import StationState from './models/messages/received/StationState';
import { canSendTransit,  getCartBitValuesFromDecimalStatus,  getLast2TransitOrders,  getMessageFromQueueForSend, getTransit, logClassGetters, sleep} from './helpers/Helpers';
import StationService from './services/StationService';
// import { PendingStorageRepository } from '@src/app/Resources/Almacen/PendingStorage/PendingStorageRepository';
import { MessageService } from '@src/app/Resources/Message/MessageService';
import { MessageRepository } from '@src/app/Resources/Message/MessageRepository';
import { MessageModel } from '@src/app/Resources/Message/MessageModel';
import { MessageType } from '@src/app/Resources/Message/MessageType';
import ProcessMessageQueue from './services/ProcessMessageQueue';
import CancelTransit from './models/messages/send/CancelTransit';
import { MessageQueueFromToType } from '@src/app/Resources/MessageQueue/MessageQueueType';
import { Order } from '@src/app/Resources/PendingStorage/PendingStorageType';
import ProcessOrdersStorage from './ProcessOrdersStorage';
import GestionAlmacenService from './services/GestionAlmacenService';
import WinstonLogger from '../Logger/Services/WinstonLogger';
import { unknown } from 'zod';
import { log } from 'console';
// import OrderQueueProcessService from './OrderQueueProcessService';
// import { setTokenSourceMapRange } from 'typescript';


interface OrderInTransit{
    from: any;
    to: any;
    order: Order|null;
    fromAck: boolean;
    fromNack: boolean;
    toAck: boolean;
    toNack: boolean;
}



dotenv.config();

const START = '0x02';
const END = '0x03';
const CART_PARKING =  process.env.CART_PARKING || 25;
const GET_MESSAGE_QUEUED_INTERVAL =  (process.env.GET_MESSAGE_QUEUED_INTERVAL || 5000) as number;
class GatewayService {
    private tcpClient: TcpClient;
    private lastMsgId: number;
    private lastStationId: number;
    private lastCartStatus: number;
    private stationService: StationService;
    private hasTransitToParkingPending: boolean;
    private waitingAck: boolean = false;
    private readyForTransit: boolean = true;
    private gestionAlmacenService: GestionAlmacenService;
    private messageRepository: MessageRepository;
    private MessageService: MessageService;
    private processMessageQueue: ProcessMessageQueue;
    private timeoutId: NodeJS.Timeout;
    private orderInTransit:OrderInTransit = this.voidOrderInTransit();
    private processOrderStorage: ProcessOrdersStorage;
    private readyToLoadInStation100: boolean;
    private tcpConnectionAllowed: boolean = true;
    private logger: WinstonLogger = new WinstonLogger();
    private processResultMessage:ProcessResultMessage = new ProcessResultMessage();
    private lastMsgIdSended: number;

    constructor() {
        this.readyToLoadInStation100 = false;
        this.processOrderStorage = new ProcessOrdersStorage();
        this.lastStationId = -1;
        this.lastCartStatus = 0;
        this.hasTransitToParkingPending = false;
        this.messageRepository = new MessageRepository(MessageModel);
        this.MessageService = new MessageService(this.messageRepository);
        this.processMessageQueue = new ProcessMessageQueue();
        this.lastMsgId = 1;
        this.getNextMessageId();
        this.tcpClient = new TcpClient();
        this.stationService = new StationService(this);
        this.timeoutId = this.setIntervalForGetMessageQueued();
        this.init();
        this.gestionAlmacenService = new GestionAlmacenService(this);
        this.lastMsgIdSended = 0;
    }
    
    async init(){
        
    }

    //comprobar el estado de la conexión tcp
    gatewayConnected(){
        this.tcpClient.isConnected();
    }

    voidOrderInTransit():OrderInTransit{
        this.orderInTransit = {
            from: null,
            to: null,
            order: null,
            fromAck: false,
            fromNack: false,
            toAck: false,
            toNack: false
        };
        return this.orderInTransit;
    }

    forceDisconnectFromGateway(){
        this.tcpConnectionAllowed = false;
        this.tcpClient.close();
        this.tcpClient.destroy();
    }
    
    forceConnectToGateway(){
        this.tcpConnectionAllowed = true;
        this.tryTcpConnect();
    }

    reset(){
        this.waitingAck = false;
        this.readyForTransit = true;
        this.lastCartStatus = 0;
        this.setIntervalForGetMessageQueued();
    }

    setIntervalForGetMessageQueued(){
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout( async () => await this.performTimedChecks(), GET_MESSAGE_QUEUED_INTERVAL);
        return this.timeoutId;
    }

    async performTimedChecks(){
        // parar el timeout
        clearTimeout(this.timeoutId);
        // await this.gestionAlmacenService.sendConnectionStatus();
        await this.gestionAlmacenService.processDeliveryReady();
        await this.processNextMessage();
        this.setIntervalForGetMessageQueued();
    }


    showStatus(){
        // console.log("this.waitingAck",this.waitingAck);
        // console.log("this.hasTransitToParkingPending",this.hasTransitToParkingPending);
        // console.log("this.readyForTransit",this.readyForTransit);
        // console.log("this.lastCartStatus",this.lastCartStatus);
        // console.log("this.lastStationId",this.lastStationId);
        // console.log("Podemos ver si hay mensajes en cola?",(this.readyForTransit ||   this.lastCartStatus== 200 && ( this.lastStationId == 102 || this.hasTransitToParkingPending )) );
    }

    connect(handleData: (data: Buffer) => void) {
        this.tcpClient = new TcpClient(handleData);
        this.tryTcpConnect();
    }


    tryTcpConnect():void {
        console.log("tryTcpConnect", this.tcpConnectionAllowed , !this.tcpClient.isConnected());
        if (this.tcpConnectionAllowed && !this.tcpClient.isConnected()){
            this.tcpClient.connect();
        }
    }

    
    handleData(data: Buffer): void {
        const stringData = data.toString('utf-8');

        if (stringData == "DISCONNECTED"){
            this.gestionAlmacenService.sendConnectionStatusToFrontend({connected:false});
            return;
        }

        this.gestionAlmacenService.sendConnectionStatusToFrontend({connected:true});

        // Pasar la el string del buffer de entrada a un array de mensajes
        const messages = this.processResultMessage.processMessages(stringData);

        // procesar los mensajes
        messages.forEach( (message: string) => {
            this.logger.info('IN>>>'+message+'<<<' );
            // console.log("LARGO MENSAJE = ",message.length);s
            const objectReceived = this.processResultMessage.process(message);
            
            if (objectReceived instanceof Nack) {
                // //-->console.log("NACK:", objectReceived);
                    this.processAfterNack(objectReceived);
                } else if (objectReceived instanceof Ack) {
                    // //-->console.log("ACK:", objectReceived);
                    this.processAfterAck(objectReceived);
                } else if (objectReceived instanceof TransitAck) {
                    // //-->console.log("TransitAck:", objectReceived);
                    this.processAfterTransitAck(objectReceived);
                } else if (objectReceived instanceof CircuitState) {
                    // //-->console.log("CircuitState:", objectReceived);
                    this.processAfterCircuitState(objectReceived);
                } else if (objectReceived instanceof CartState) {
                    // console.log("CartState:", objectReceived);
                    this.processAfterCartState(objectReceived);
                } else if (objectReceived instanceof StationState) {
                    // console.log("StationState:", objectReceived);
                    this.processAfterStationState(objectReceived);
                }
        });
    }
    
    async processAfterNack(nack: Nack): Promise<void> {
        console.log(colors.red("NACK,hubo un error en la orden enviada con msg_id", logClassGetters(nack)));
        // Hay que recuperar el mensaje con msg_id = nack.srcMsgId
        this.processMessageQueue.changeStatusOfMessageQueue(parseInt(nack.srcMsgId));
        this.setIntervalForGetMessageQueued();
    }
    
    async processAfterAck(ack: Ack): Promise<void> {
        this.processOrderInTransit(ack);
        // console.log(colors.green("ACK, se puede enviar una nueva orden", logClassGetters(ack)));
        this.waitingAck = false;
    }
    async processAfterTransitAck(transitAck: TransitAck): Promise<void> {
        // this.processOrderInTransit(transitAck);
        console.log(colors.green("TransitAck, se puede enviar una nueva orden", logClassGetters(transitAck)));
    }

    // si recibimos un Nack, procesamos la orderInTransit y messageQueue
    async cancelOrderInTransitWithNack(status:Nack){
        const srcMsgId = parseInt(status.srcMsgId);
        // if (!this.orderInTransit.from.msg_id == srcMsgId ){
        //     return;
        // }
    }

    // solo trabajamos con la orden en tránsito solo si recibimos un Ack
    async processOrderInTransit( status: Ack | TransitAck ): Promise<void> {

        const srcMsgId = parseInt(status.srcMsgId);
        // console.log("processOrderInTransit", this.orderInTransit.order);
        // const orderInTransit = await this.processMessageQueue.getByMessageId(msg_id);
        // if (!orderInTransit){
        //     return;
        // }

        if (!this.orderInTransit.order){
            return;
        }
        
        // Si es respuesta a load, quitamos la orden de la estación de carga
        if (this.orderInTransit.from.msg_id == srcMsgId){
            const resulUpdateStorage = await this.processOrderStorage.deleteOrderFromStation(this.orderInTransit.from.station_id, this.orderInTransit.from.station_type, this.orderInTransit.from.level);
            // console.log("this.processOrderStorage.deleteOrderFromStation",resulUpdateStorage);
            return;
        }
        
        // console.log ("this.orderInTransit.to.msg_id == srcMsgId", this.orderInTransit.to.msg_id, srcMsgId);
        // Si es respuesta a unload, asignamos la orden a la estación en caso de que no sea la estación de entrega
        if (this.orderInTransit.to.msg_id == srcMsgId && this.orderInTransit.to.station_id !== 102){
            const resultUpdateStorage = await this.processOrderStorage.addOrderToStation(this.orderInTransit.to.station_id, this.orderInTransit.to.station_type, this.orderInTransit.to.level, this.orderInTransit.order, true);
            // console.log("this.processOrderStorage.addOrderToStation",resultUpdateStorage);
            return;
        }

        // Si es respuesta a unload en la estación de entrega aumentar la cantidad entregada en 
        if (this.orderInTransit.to.msg_id == srcMsgId && this.orderInTransit.to.station_id == 102){
            const result = await this.gestionAlmacenService.incrementDeliveredQuantityInCompletedFasesOrder(this.orderInTransit.order);
            // console.log("this.processOrderStorage.addOrderToStation",result);
            return;
        }
    }

    async processAfterCartState(cartState: CartState): Promise<void> {
        // console.log("processAfterCartState", cartState);
        this.lastCartStatus = parseInt(cartState.cartStatus);

        // Comprueba si el carro está listo para nuevos mensajes
        this.readyForTransit = this.stationService.isCartReadyForNewMessage(cartState);

        // Si no está lista salir
        if ( !this.readyForTransit ){
            return;
        }
        this.logger.info("-------El carro acepta nuevos mensajes-------");
        // comprueba si podemos seguir con los mensajes pendientes
        const lastAckMoment = this.processResultMessage.getLastAckMoment();
        const lastCartStatusMoment = this.processResultMessage.getLastCartStatusMoment();

        // Si el Ack es posterior al Cartstate salir
        if ( !(lastAckMoment !== null && lastCartStatusMoment!==null && lastAckMoment < lastCartStatusMoment )) {
            return;            
        }    

        this.stationService.tryProcessLoadOnStation100(cartState);
        await this.processNextMessage();
    }

    async processNextMessage(){
        // console.log("Buscando nuevos mensajes");
        // console.log("this.tcpClient.isConnected", this.tcpClient.isConnected());
        if (!this.tcpClient.isConnected()){
            //-->console.log("No está conectado.. conectando.");
            this.tryTcpConnect();
        }
        this.showStatus();
        // parar el timeout
        clearTimeout(this.timeoutId);

        // Consultamos por el último estado para saber si podemos hacer tránsitos
        // const canIsendTransit:boolean = canSendTransit(this.lastCartStatus);
        if (this.readyForTransit){
            // console.log(`lastCartStatus=${this.lastCartStatus}  canIsendTransit`, canIsendTransit);
            const nextMessage = await this.processMessageQueue.getNextMessagePending();

            // No hay mensajes en cola y la última estación es la de entrega, enviar el carro a la estación 25
            if (!nextMessage && this.lastStationId == 102){
                const msgId = await this.getNextMessageId();
                // const msgTo = getTransit(msgId, CART_PARKING as number);
                // await this.send(msgTo.getData(), msgTo.getType(), true);
                const msgTo:string = " 15" + msgId.toString().padEnd(5) + "    1"+"   33";
                await this.send(msgTo, 15, true);
                this.hasTransitToParkingPending = false;
                this.lastStationId = CART_PARKING as number;
                this.setIntervalForGetMessageQueued();
                return;
            }
            
            // No hay mensajes en cola
            if (!nextMessage ){
                this.setIntervalForGetMessageQueued();
                return;
            }

            // Enviar el primer mensaje en cola
            // //-->console.log("nextMessage",nextMessage);
            let msg: MessageQueueFromToType;
            const msgId = await this.getNextMessageId();
            if ( nextMessage.fromPending && nextMessage.from){
                msg = nextMessage.from ;
                nextMessage.from.msg_id = msgId; 

                const orderResult = await this.processOrderStorage.getOrderInTransit(nextMessage.from.station_id, nextMessage.from.station_type, nextMessage.from.level as number)
                // asignamos valor a orderInTransit para controlar la orden y el tránsito de la misma.
                this.orderInTransit = {
                    from: nextMessage.from,
                    to: nextMessage.to,
                    order: orderResult,
                    fromAck: false,
                    fromNack: false,
                    toAck: false,
                    toNack: false
                };
            }else {
                msg = nextMessage.to;
                if (this.orderInTransit && this.orderInTransit.to){
                    nextMessage.to.msg_id = msgId; 
                    // console.log(nextMessage);
                    this.orderInTransit.to.msg_id = msgId;
                    this.orderInTransit.toAck = false;
                    this.orderInTransit.toNack = false;

                }
            }
            // console.log("processNextMessage, orderInTransit=", this.orderInTransit);
            if (msg){
                try {
                    // Convierte el mensaje de la base de datos al tipo que corresponde (LoadUnloadTransit o CancelTransit)
                    const sendMessage = getMessageFromQueueForSend(msgId, msg);
                    if (sendMessage == undefined){
                        this.setIntervalForGetMessageQueued();
                        return;
                    }
                    if (!(sendMessage instanceof CancelTransit)){
                        this.lastStationId = sendMessage.getStationId();
                    }

                    if (nextMessage.fromPending){
                        console.log("--> FROM", nextMessage._id, nextMessage.fromPending);
                        nextMessage.fromPending = false;
                    
                    }else{
                        nextMessage.toPending = false;
                        console.log("--> TO", nextMessage._id, nextMessage.toPending);
                    }
                    // console.log("GUARDAR", nextMessage._id, nextMessage.fromPending, nextMessage.toPending);
                    const processMessageQueueResult = await this.processMessageQueue.update(nextMessage);
                    // console.log("nextMessageResult", processMessageQueueResult);
                    if (this.lastMsgIdSended !== msgId){
                        await this.send(sendMessage.getData(), sendMessage.getType(), true);
                        this.lastMsgIdSended = msgId;
                    }   
                } catch (error) {
                    //-->console.log("Error enviando o guardando el mensaje");
                }
            }
        }
        this.setIntervalForGetMessageQueued();
    }

    async processAfterCircuitState(circuitState: CircuitState): Promise<void> {
        // console.log(colors.green("CircuitState2", logClassGetters(circuitState)));
        // this.processNextMessage();
    }
    // Station State change
    async processAfterStationState(stationState: StationState): Promise<void> {
        // console.log(colors.green("StationState", logClassGetters(stationState)));
        this.stationService.receivedStationState(stationState);
        // this.processNextMessage();
        
    }

    voidLastStateInStationService(stationType:number):void{
        this.stationService.voidLastStationState(stationType);
    }

    async getNextMessageId(): Promise<number> {
        try {
            // const lastMessage = await this.MessageService.index({});
            const lastMessage = await this.MessageService.index({sortBy: '["msg_id"]',  sortDesc: '[true]', itemsPerPage: "1"});
            // //-->console.log("lastMessage de getNextMessageId", lastMessage);
            if (lastMessage.collection.length > 0 ){
                this.lastMsgId = lastMessage.collection[0].msg_id + 1;
                return this.lastMsgId;
            }
            return 1;
        } catch (error) {
            console.error('Error al buscar el último mensaje (getNextMessageId):', error);
            throw error;
        }
    }

    async getNextUnsendedMessage(): Promise<unknown> {
        const filter = '{ sent : { "=": false } }';
        try {
            const lastMessage = await this.MessageService.index({filters: filter, sortBy: '["msg_id"]',  sortDesc: '[false]', itemsPerPage: "1"});
            // //-->console.log("lastMessage de getNextUnsendedMessage", lastMessage);

            if (lastMessage.collection.length > 0 ){
                return lastMessage.collection[0];
            }
            return null;
        } catch (error) {
            console.error('Error al buscar el último mensaje (getNextUnsendedMessage):', error);
            throw error;
        }
    }

    async send(message: string, type: number, waitingAck: boolean = false): Promise<void> {
        if (!this.tcpClient.isConnected()) {
            this.tryTcpConnect();
        }
        const nuevoMensaje = await this.MessageService.store( {
            msg_id: this.lastMsgId,
            message: message,
            type: type
        } as MessageType);

        //-->console.log(colors.green("Waiting ACK", waitingAck));

        if (waitingAck){
            this.waitingAck = waitingAck;
        }
        this.logger.info('OUT>>>'+message+'<<<');

        // //-->console.log("Nuevo mensaje creado:", nuevoMensaje);
        // const verificacion = await this.MessageService.show(nuevoMensaje._id as string);
        // //-->console.log('Verificación inmediata:', verificacion);
        const toSend = String.fromCharCode(parseInt(START, 16)) + message + String.fromCharCode(parseInt(END, 16));
        this.tcpClient.sendMessage(toSend);
    }

    async endConnection(): Promise<void> {
        this.tcpClient.close();
        // await this.mongoService.disconnect();
    }

    setTransitToParkingPending(status: boolean = true){
        this.hasTransitToParkingPending = status;
    }
    
    setWaitingAck(waiting:boolean){
        this.waitingAck = waiting;
    }

    getWaitingAck(){
        return this.waitingAck;
    }

    isReadyForTransit(){
        return !this.waitingAck && this.readyForTransit;
    }

}

export default GatewayService;