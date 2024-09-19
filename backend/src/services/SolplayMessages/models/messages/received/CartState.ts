/**
 *  Campo	                    Longitud	Descripción
 *  type	                    3	        cart_state. Ver Order_type.
 *  msg_id	                    5	        Identificador de mensaje. Incrementado en cada nuevo mensaje.
 *  cart_id	                    5	        Identificador del carro.
 *  cart_status	                4	        Ver Cart_status en Enumeraciones.
 *  cart_phase	                1	        Ver Cart_phase en Enumeraciones.
 *  ini_node	                5	        Nodo inicial del segmento en curso.
 *  rel_position	            3	        Porcentaje recorrido del segmento en curso.
 *  end_node	                5	        Nodo final del segmento en curso.
 *  next_node	                5	        Nodo final del siguiente segmento.
 *  speed_mms	                5	        Velocidad actual en milímetros por segundo.
 *  cross_confirmation_needed	1	        A 1 si espera recibir un mensaje de tipo cross_granted para el nodo end_node. No pasará al segmento siguiente (end_node, next_node) hasta que no lo reciba.
 *  orders	                    154	        Contiene 2 Transit_order (82 bytes cada una). Ver Transit_order en Estructuras.
 */
import { OrderqueueUpdateSchema } from '@src/app/Resources/Orderqueue/OrderqueueValidations';
import { getLast2TransitOrders, parseData } from '../../../helpers/Helpers';
import TransitOrder from './TransitOrder';

export interface CartStateData {
    type: string;
    msgId: string;
    cartId: string;
    srcType: string;
    srcMsgId: string;
    cartStatus: string;
    cartPhase: string;
    iniNode: string;
    relPosition: string;
    endNode: string;
    nextNode: string;
    speedMms: string;
    crossConfirmationNeeded: string;
    orders: string;
}

class CartState {
    private _type: string;
    private _msgId: string;
    private _cartId: string;
    // private _srcType: string;
    // private _srcMsgId: string;
    private _cartStatus: string;
    private _cartPhase: string;
    private _iniNode: string;
    private _relPosition: string;
    private _endNode: string;
    private _nextNode: string;
    private _speedMms: string;
    private _crossConfirmationNeeded: string;
    private _orders: string;

    constructor(data: string) {
        const {
            type,
            msgId,
            cartId,
            // srcType,
            // srcMsgId,
            cartStatus,
            cartPhase,
            iniNode,
            relPosition,
            endNode,
            nextNode,
            speedMms,
            crossConfirmationNeeded,
            orders,
        } = this._parseData(data);

        this._type = type;
        this._msgId = msgId;
        this._cartId = cartId;
        // this._srcType = srcType;
        // this._srcMsgId = srcMsgId;
        this._cartStatus = cartStatus;
        this._cartPhase = cartPhase;
        this._iniNode = iniNode;
        this._relPosition = relPosition;
        this._endNode = endNode;
        this._nextNode = nextNode;
        this._speedMms = speedMms;
        this._crossConfirmationNeeded = crossConfirmationNeeded;
        this._orders = orders;
    }

    private _parseData(data: string): CartStateData {
        const lengths = {
            type: 3,
            msgId: 5,
            cartId: 5,
            // srcType: 3,
            // srcMsgId: 5,
            cartStatus: 4,
            cartPhase: 1,
            iniNode: 5,
            relPosition: 3,
            endNode: 5,
            nextNode: 5,
            speedMms: 5,
            crossConfirmationNeeded: 1,
            orders: 164,
        };
        return parseData(lengths, data) as CartStateData;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get msgId(): string {
        return this._msgId;
    }

    set msgId(value: string) {
        this._msgId = value;
    }

    get cartId(): string {
        return this._cartId;
    }

    set cartId(value: string) {
        this._cartId = value;
    }

    // get srcType(): string {
    //     return this._srcType;
    // }

    // set srcType(value: string) {
    //     this._srcType = value;
    // }

    // get srcMsgId(): string {
    //     return this._srcMsgId;
    // }

    // set srcMsgId(value: string) {
    //     this._srcMsgId = value;
    // }

    get cartStatus(): string {
        return this._cartStatus;
    }

    set cartStatus(value: string) {
        this._cartStatus = value;
    }

    get cartPhase(): string {
        return this._cartPhase;
    }

    set cartPhase(value: string) {
        this._cartPhase = value;
    }

    get iniNode(): string {
        return this._iniNode;
    }

    set iniNode(value: string) {
        this._iniNode = value;
    }

    get relPosition(): string {
        return this._relPosition;
    }

    set relPosition(value: string) {
        this._relPosition = value;
    }

    get endNode(): string {
        return this._endNode;
    }

    set endNode(value: string) {
        this._endNode = value;
    }

    get nextNode(): string {
        return this._nextNode;
    }

    set nextNode(value: string) {
        this._nextNode = value;
    }

    get speedMms(): string {
        return this._speedMms;
    }

    set speedMms(value: string) {
        this._speedMms = value;
    }

    get crossConfirmationNeeded(): string {
        return this._crossConfirmationNeeded;
    }

    set crossConfirmationNeeded(value: string) {
        this._crossConfirmationNeeded = value;
    }

    get orders(): string {
        return this._orders;
    }

    set orders(value: string) {
        this._orders = value;
    }

    getTransitOrders(): [TransitOrder|null, TransitOrder|null] {
        const last2TransitOrders = getLast2TransitOrders(this._orders);
        if (last2TransitOrders[0] == null || last2TransitOrders[1] == null){
            return [null, null];
        }
        return  [new TransitOrder(last2TransitOrders[0]), new TransitOrder(last2TransitOrders[1])];
    }
}

export default CartState;



export class CartStateProcess{

    private value: CartState;
    private transitOrder: TransitOrder|null;
    private transitOrders: [TransitOrder|null,TransitOrder|null];
    constructor(state: CartState){
        this.value = state;
        // me quedo con la transitOrder de la estación 100 porque es la que nos interesa para comprobar si es válido el último estado de estación de carga que hemos recibido
        

        // this.transitOrder = new TransitOrder(state.orders.substring(0,82));
        // if (parseInt(this.transitOrder.stationId) !== 100 ){
        //     this.transitOrder = new TransitOrder(state.orders.substring(82,82));
        // }

        this.transitOrders = state.getTransitOrders();
        if (this.transitOrders[0] !== null && parseInt(this.transitOrders[0].stationId) == 100){
            this.transitOrder = this.transitOrders[0];
        }else{
            this.transitOrder = this.transitOrders[1];
        }
    }

    getTransitOrders() {
        return this.transitOrders;
    }


    canProcessMessagesFromStation100(){
        if (! this.isStation100 ){
            return true;
        }
        if (this.isTypeLoad() && this.isUseAndTransitPhaseOk()){
            return true;
        }
        return false;
    }    


    // comprobar si es la estación 100 
    isStation100():boolean{
        if (this.transitOrder == null){
            return false;
        }
        return parseInt(this.transitOrder.stationId) == 100;
    }

    isTypeLoad(){
        if (this.transitOrder == null){
            return false;
        }

        return (parseInt(this.transitOrder.type) === 1);
    }


    isUseAndTransitPhaseOk():boolean{
        if (this.transitOrder == null){
            return false;
        }

        if (parseInt(this.transitOrder.use) == 1){
            return true;
        }

        if (parseInt(this.transitOrder.use) !== 2 ){
            return false;
        }

        if (parseInt(this.transitOrder.phase) == 3 ){
            return true;
        }
        return false;
    }
    
    isCartReadyForNewMessage():boolean{
        // comprobar las 2 ordenes que vienen en CARTSTATE ANTES DE ENVIAR
        
        // use: 
        // unused: 0
        // previouse: 1
        // current: 2
        // next:3 
        
        // 0 y 0 true
        // 0 y 1 true
        // 1 y 0 true
        // 1 y 2 comprobar si la orden que tiene el current (2) phase = 3 (transit_done)
        // 2 y 1 comprobar si la orden que tiene el current (2) phase = 3 (transit_done)
        // 2 y 3 comprobar si la orden que tiene el current (2) phase = 3 (transit_done)
        // 3 y 2 comprobar si la orden que tiene el current (2) phase = 3 (transit_done)
        
        // 0 y 2 true
        // 2 y 0 true
        
        // 3 y 1 comprobar si la orden que tiene el previous (1) phase = 3 (transit_done)
        // 1 y 3 comprobar si la orden que tiene el previous (1) phase = 3 (transit_done)
        
        // 3 y 0 true
        // 0 y 3 true

        
        for( let index1:number = 0; index1<2;index1++){
            const order1: TransitOrder|null = this.transitOrders[index1];
            const order2: TransitOrder|null = this.transitOrders[(index1 == 0) ? 1: 0];
            if (order1 == null || order2 == null  ){
                return false;
            }

            if ( parseInt(order1.use) == 1 && parseInt(order1.phase) !== 3 ){
                return false;
            }
            if ( parseInt(order1.use) == 2 && parseInt(order1.phase) !== 3){
                return false;
            }
            if ( parseInt(order1.use) == 3 && parseInt(order1.phase) !== 3){
                return false;
            }
        }

        return true;
    }
    

}