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
 *  orders	                    164	        Contiene 2 Transit_order (82 bytes cada una). Ver Transit_order en Estructuras.
 */
import { parseData } from '../../../helpers/Helpers';
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
}

export default CartState;



export class CartStateProcess{

    private value: CartState;
    private transitOrder: TransitOrder;
    constructor(state: CartState){
        this.value = state;
        // me quedo con la transitOrder de la estación 100 porque es la que nos interesa para comprobar si es válido el último estado de estación de carga que hemos recibido
        this.transitOrder = new TransitOrder(state.orders.substring(0,82));
        if (parseInt(this.transitOrder.stationId) !== 100 ){
            this.transitOrder = new TransitOrder(state.orders.substring(82,82));
        }
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
        return parseInt(this.transitOrder.stationId) == 100;
    }

    isTypeLoad(){
        return (parseInt(this.transitOrder.type) === 1);
    }


    isUseAndTransitPhaseOk():boolean{
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
    

}