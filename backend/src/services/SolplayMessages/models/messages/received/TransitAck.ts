/**
 *  Campo	        Longitud	Descripción
 *  type	        3	        Tipo de mensaje de reconocimiento de tránsito. Ver Order_type.
 *  msg_id	        5	        Identificador de mensaje. Se incrementa en cada nuevo mensaje.
 *  cart_id 	    5	        Identificador del carro.
 *  src_type	    3	        Tipo de mensaje de la orden a la que se contesta (carga, tránsito, descarga, ir al aparcamiento, ir al nodo).
 *  src_msg_id	    5	        Identificador del mensaje de la orden a la que se contesta.
 *  transit_id	    10	        Identificador de tránsito asignado por el gateway.
 */

import { parseData } from '../../../helpers/Helpers';

export interface TransitAckData {
    type: string;
    msgId: string;
    cartId: string;
    srcType: string;
    srcMsgId: string;
    transitId: string;
}

class TransitAck {
    private _type: string;
    private _msgId: string;
    private _cartId: string;
    private _srcType: string;
    private _srcMsgId: string;
    private _transitId: string;

    constructor(data: string) {
        const { type, msgId, cartId, srcType, srcMsgId, transitId } = this._parseData(data);
        this._type = type;
        this._msgId = msgId;
        this._cartId = cartId;
        this._srcType = srcType;
        this._srcMsgId = srcMsgId;
        this._transitId = transitId;
    }

    private _parseData(data: string): TransitAckData {
        const lengths = {
            type: 3,
            msgId: 5,
            cartId: 5,
            srcType: 3,
            srcMsgId: 5,
            transitId: 10
        };
        return parseData(lengths, data) as TransitAckData;
    }

    // Getters
    get type(): string {
        return this._type;
    }

    get msgId(): string {
        return this._msgId;
    }

    get cartId(): string {
        return this._cartId;
    }

    get srcType(): string {
        return this._srcType;
    }

    get srcMsgId(): string {
        return this._srcMsgId;
    }

    get transitId(): string {
        return this._transitId;
    }

    // Setters
    set type(value: string) {
        if (!value || value.length !== 3) {
            throw new Error("El tipo de mensaje debe tener una longitud de 3 caracteres.");
        }
        this._type = value;
    }

    set msgId(value: string) {
        if (!value || value.length !== 5) {
            throw new Error("El identificador del mensaje debe tener una longitud de 5 caracteres.");
        }
        this._msgId = value;
    }

    set cartId(value: string) {
        if (!value || value.length !== 5) {
            throw new Error("El identificador del carro debe tener una longitud de 5 caracteres.");
        }
        this._cartId = value;
    }

    set srcType(value: string) {
        if (!value || value.length !== 3) {
            throw new Error("El tipo de mensaje de la orden debe tener una longitud de 3 caracteres.");
        }
        this._srcType = value;
    }

    set srcMsgId(value: string) {
        if (!value || value.length !== 5) {
            throw new Error("El identificador del mensaje de la orden debe tener una longitud de 5 caracteres.");
        }
        this._srcMsgId = value;
    }

    set transitId(value: string) {
        if (!value || value.length !== 10) {
            throw new Error("El identificador de tránsito debe tener una longitud de 10 caracteres.");
        }
        this._transitId = value;
    }
}

export default TransitAck;