import Ack from './models/messages/received/Ack';
import TransitAck from './models/messages/received/TransitAck';
import Nack from './models/messages/received/Nack';
import CircuitState from './models/messages/received/CircuitState';
import CartState from './models/messages/received/CartState';
import StationState from './models/messages/received/StationState';

class ProcessResultMessage {
    private orderType: number;
    private _isTransistAck!: boolean;
    private _isAck!: boolean;
    private _isNack!: boolean;

    constructor() {
        this.orderType = -1;
        this.init();
    }

    private init(): void {
        this._isTransistAck = false;
        this._isAck = false;
        this._isNack = false;
    }

    processMessages(data:string):string[]{
        return this.extractMessages(data);
    }
    


    process(data: string): (Ack | TransitAck | Nack | CartState | CircuitState | StationState | { message: string }) {
    // process(data: string): (Ack | TransitAck | Nack | CartState | CircuitState | StationState | { message: string })[] {
        this.init();
        // Remove the first value
        const dataSliced = data.slice(1);
        // Remove the last value
        const dataSlicedComplete = dataSliced.slice(0, data.length - 1);
        const stringData = dataSlicedComplete.toString();
        console.log("STX = ",   `{ "msg": "${stringData.substring(0)}" }`) ;

        const orderType = parseInt(stringData.substr(0, 3), 10);

        // const messages:array = [];

        if (orderType === 100) {
            this._isTransistAck = true;
            return this.processTransitAck(stringData);
        }

        if (orderType === 101) {
            this._isAck = true;
            return this.processAck(stringData);
        }

        if (orderType === 102) {
            this._isNack = true;
            return this.processNack(stringData);
        }

        if (orderType === 200) {
            return this.processCartState(stringData);
        }

        if (orderType === 201) {
            return this.processCircuitState(stringData);
        }

        if (orderType === 202) {
            return this.processStationState(stringData);
        }

        return { message: stringData };
    }

    private processAck(data: string): Ack {
        return new Ack(data);
    }

    private processTransitAck(data: string): TransitAck {
        return new TransitAck(data);
    }

    private processNack(data: string): Nack {
        return new Nack(data);
    }

    private processCartState(data: string): CartState {
        return new CartState(data);
    }

    private processCircuitState(data: string): CircuitState {
        return new CircuitState(data);
    }

    private processStationState(data: string): StationState {
        return new StationState(data);
    }

    isAck(): boolean {
        return this._isAck;
    }

    isNAck(): boolean {
        return this._isNack;
    }

    isTransistAck(): boolean {
        return this._isTransistAck;
    }

    extractMessages (input: string): string[] {
        // Expresión regular para capturar texto entre STX (0x02) y ETX (0x03)
        // eslint-disable-next-line no-control-regex
        const regex = /\x02(.*?)\x03/g;
        const messages: string[] = [];
        let match;
    
        // Iteramos sobre todas las coincidencias
        while ((match = regex.exec(input)) !== null) {
            messages.push(match[1]); // Agregamos el contenido sin STX y ETX
        }
    
        return messages;
    }

}

export default ProcessResultMessage;