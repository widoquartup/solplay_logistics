/**
 *  Campo	    Longitud	Descripción
 *  type        3	        Tipo de mensaje. Ver Order_type.
 *  msg_id	    5	        Identificador de mensaje. Incrementado en cada nuevo mensaje.
 *  cart_id	    5	        Identificador del carro.
 *  src_type	3	        Tipo de mensaje de la orden a la que se contesta (carga, tránsito, descarga, ir al aparcamiento, ir al nodo).
 *  src_msg_id	5	        Identificador del mensaje de la orden a la que se contesta.
 */

import { parseData } from '../../../helpers/Helpers';

export interface AckData {
    type: string;
    msgId: string;
    cartId: string;
    srcType: string;
    srcMsgId: string;
}

class Ack {
    private _type: string;
    private _msgId: string;
    private _cartId: string;
    private _srcType: string;
    private _srcMsgId: string;

    constructor(data: string) {
        const { type, msgId, cartId, srcType, srcMsgId } = this._parseData(data);
        this._type = type;
        this._msgId = msgId;
        this._cartId = cartId;
        this._srcType = srcType;
        this._srcMsgId = srcMsgId;
    }

    private _parseData(data: string): AckData {
        const lengths = {
            type: 3,
            msgId: 5,
            cartId: 5,
            srcType: 3,
            srcMsgId: 5,
        };
        return parseData(lengths, data) as AckData;
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

    // Setters
    set type(value: string) {
        if (value.length !== 3) {
            throw new Error("El tipo debe tener una longitud de 3 caracteres");
        }
        this._type = value;
    }

    set msgId(value: string) {
        if (value.length !== 5) {
            throw new Error("El ID del mensaje debe tener una longitud de 5 caracteres");
        }
        this._msgId = value;
    }

    set cartId(value: string) {
        if (value.length !== 5) {
            throw new Error("El ID del carrito debe tener una longitud de 5 caracteres");
        }
        this._cartId = value;
    }

    set srcType(value: string) {
        if (value.length !== 3) {
            throw new Error("El tipo de origen debe tener una longitud de 3 caracteres");
        }
        this._srcType = value;
    }

    set srcMsgId(value: string) {
        if (value.length !== 5) {
            throw new Error("El ID del mensaje de origen debe tener una longitud de 5 caracteres");
        }
        this._srcMsgId = value;
    }
}

export default Ack;