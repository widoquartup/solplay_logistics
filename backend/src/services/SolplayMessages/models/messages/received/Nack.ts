/**
 *  Campo	        Longitud	Descripción
 *  type            3	        Tipo de mensaje. Ver Order_type.
 *  msg_id	        5	        Identificador de mensaje. Incrementado en cada nuevo mensaje.
 *  cart_id	        5	        Identificador del carro.
 *  src_type	    3	        Tipo de mensaje de la orden a la que se contesta (carga, tránsito, descarga, ir al aparcamiento, ir al nodo).
 *  src_msg_id	    5	        Identificador del mensaje de la orden a la que se contesta.
 *  error_message	80	        Identificador del mensaje de la orden a la que se contesta.
 */

import { parseData } from '../../../helpers/Helpers';

export interface NackData {
    type: string;
    msgId: string;
    cartId: string;
    srcType: string;
    srcMsgId: string;
    errorMessage: string;
}

class Nack {
    private _type: string;
    private _msgId: string;
    private _cartId: string;
    private _srcType: string;
    private _srcMsgId: string;
    private _errorMessage: string;

    constructor(data: string) {
        const { type, msgId, cartId, srcType, srcMsgId, errorMessage } = this._parseData(data);
        this._type = type;
        this._msgId = msgId;
        this._cartId = cartId;
        this._srcType = srcType;
        this._srcMsgId = srcMsgId;
        this._errorMessage = errorMessage;
    }

    private _parseData(data: string): NackData {
        const lengths = {
            type: 3,
            msgId: 5,
            cartId: 5,
            srcType: 3,
            srcMsgId: 5,
            errorMessage: 80,
        };
        return parseData(lengths, data) as NackData;
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

    get errorMessage(): string {
        return this._errorMessage;
    }

    // Setters
    set type(type: string) {
        this._type = type;
    }

    set msgId(msgId: string) {
        this._msgId = msgId;
    }

    set cartId(cartId: string) {
        this._cartId = cartId;
    }

    set srcType(srcType: string) {
        this._srcType = srcType;
    }

    set srcMsgId(srcMsgId: string) {
        this._srcMsgId = srcMsgId;
    }

    set errorMessage(errorMessage: string) {
        this._errorMessage = errorMessage;
    }
}

export default Nack;