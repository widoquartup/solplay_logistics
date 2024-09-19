import { StationInfo } from "../Interfaces/Interfaces";
// import { AckData } from "../models/messages/received/Ack";
// import {CartStateData} from "../models/messages/received/CartState";
// import {CircuitStateData} from "../models/messages/received/CircuitState";
// import {NackData} from "../models/messages/received/Nack";
// import {StationStateData} from "../models/messages/received/StationState";
// import {TransitAckData} from "../models/messages/received/TransitAck";
import CancelTransit from "../models/messages/send/CancelTransit";
import Load from "../models/messages/send/Load";
import Unload from "../models/messages/send/Unload";
import Transit from "../models/messages/send/Transit";
import { TransportParameterType } from "@src/app/Resources/Almacen/AlmacenTypes";
import LoadUnloadTransit from "../models/messages/send/LoadUnloadTransit";
import { MessageQueueFromToType } from "@src/app/Resources/MessageQueue/MessageQueueType";
import { boolean } from "zod";

const bitValues: BitValues = {
    none: 0,
    cart_error: 1,
    hook_error: 2,
    warning: 4,
    paused: 8,
    manual_mode: 16,
    maintenance: 32,
    busy: 64,
    ready: 128,
    parking: 256,
    loaded: 512,
    house_keeping: 1024,
    shutdown_ready: 2048
};

interface LengthsObject {
    [key: string]: number;
}

// interface ParsedData {
//     [key: string]: string;
// }

interface BitValues {
    [key: string]: number;
}

interface CartStatusResult {
    [key: string]: number;
}

export function parseData(lengths: LengthsObject, data: string): unknown {
    let offset = 0;
    const parsedData: { [key: string]: string } = {};
    for (const key of Object.keys(lengths)) {
        const length = lengths[key];
        const value = data.substring(offset, offset + length).trim();
        parsedData[key] = value;
        offset += length;
    }
    return parsedData;
}

/**
 * 
 * @param {number} cart_status
 * @returns {CartStatusResult} // devuelve todos los valores con bits activados que concuerdan con cart_status 
 */
export function canSendTransit(cart_status: number): boolean {
    const koStatus = [
        'none',
        'cart_error',
        'hook_error',
        'warning',
        'paused',
        'manual_mode',
        'maintenance',
        'house_keeping',
        'shutdown_ready'
    ];
    const binaryString = (cart_status >>> 0).toString(2).padStart(12, '0');
    // console.log(binaryString);
    let ready = true;
    for (let i = 0; i < binaryString.length; i++) {
        const value = 2 ** (binaryString.length - 1 - i);
        if (binaryString[i] === '1') {
            const key2 = Object.keys(bitValues).find(key => bitValues[key] === value);
            if (key2) {
                if (koStatus.find(i => i == key2) !== undefined) {
                    return false;
                }
                ready = (key2 == 'ready');
            }
        }
    }
    return ready;
}
/**
 * 
 * @param {number} cart_status
 * @returns {CartStatusResult} // devuelve todos los valores con bits activados que concuerdan con cart_status 
 */
export function getCartBitValuesFromDecimalStatus(cart_status: number): CartStatusResult {
    const binaryString = (cart_status >>> 0).toString(2).padStart(12, '0');
    const result: CartStatusResult = {};
    // console.log(binaryString);
    let bitsResult = [];
    for (let i = 0; i < binaryString.length; i++) {
        const value = 2 ** (binaryString.length - 1 - i);
        if (binaryString[i] === '1') {
            const key2 = Object.keys(bitValues).find(key => bitValues[key] === value);
            if (key2) {
                bitsResult.push(key2);
                result[key2] = value;
            }
        }
    }
    return result;
}



export function getMessageFromQueueForSend(msgId: number, msg: MessageQueueFromToType): LoadUnloadTransit | CancelTransit | undefined {
    switch (msg.type) {
        case 20:
            return getCancelTransit(msgId);
        case 1:
            return getLoad(msgId, {
                stationId: msg.station_id ?? 1,
                stationType: msg.station_type ?? 1,
                level: msg.level ?? 1
            });
        case 2:
            return getTransit(msgId, msg.station_id ?? 25);
        case 3:
            return getUnload(msgId, {
                stationId: msg.station_id ?? 1,
                stationType: msg.station_type ?? 1,
                level: msg.level ?? 1
            });
        default:
            return undefined;
    }
}


export function getLoad(msgId: number, station: TransportParameterType): Load {
    const loadModel = new Load();

    loadModel.setCartId(1);
    loadModel.setMsgId(msgId);
    loadModel.setStationId(station.stationId);
    loadModel.setStationType(station.stationType);
    loadModel.setLevel(station.level);
    loadModel.setCargoId(' ');
    return loadModel;
}

export function getTransit(msgId: number, stationId: number): Transit {
    const loadModel = new Transit();

    loadModel.setCartId(1);
    loadModel.setMsgId(msgId);
    loadModel.setStationId(stationId);
    loadModel.setStationType(1);
    loadModel.setLevel(1);
    loadModel.setCargoId(' ');
    return loadModel;
}

export function getUnload(msgId: number, station: TransportParameterType): Unload {
    const unloadModel = new Unload();
    unloadModel.setCartId(1);
    unloadModel.setMsgId(msgId);
    unloadModel.setStationId(station.stationId);
    unloadModel.setStationType(station.stationType);
    unloadModel.setLevel(station.level);
    unloadModel.setCargoId(' ');
    return unloadModel;
}


export function getCancelTransit(msgId: number,): CancelTransit {
    const cancelTransitsModel = new CancelTransit();
    cancelTransitsModel.setType(20);
    cancelTransitsModel.setMsgId(msgId);
    cancelTransitsModel.setCartId(1);
    return cancelTransitsModel;
}


export async function sleep(seconds: number = 0.25): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


// la uso para mostrar el contenido de las clases de mensajes
export function logClassGetters<T extends object>(instance: T) {
    const proto = Object.getPrototypeOf(instance);
    const propertyNames = Object.getOwnPropertyNames(proto);

    const getters = propertyNames.filter(name => {
        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
        return descriptor && typeof descriptor.get === 'function';
    });

    const result: Record<string, any> = {};

    getters.forEach(getter => {
        try {
            result[getter] = (instance as any)[getter];
        } catch (error) {
            result[getter] = `Error al acceder: ${error}`;
        }
    });

    // console.log(JSON.stringify(result, null, 2));
    return JSON.stringify(result, null, 2);
}

export const getWeekAgoAnsiDate = () => {
    // Crear una nueva fecha con la fecha actual
    const date = new Date();

    // Restar 7 días
    date.setDate(date.getDate() - 7);

    // Obtener el año, mes y día
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    // Formar la cadena en formato YYYYMMDD
    return `${year}-${month}-${day}`;
};

export const convertQuartupDateToDate = (dateString: string): Date => {
    // Verificar si el string tiene el formato correcto
    if (!/^\d{8}$/.test(dateString)) {
        throw new Error('El formato de fecha debe ser YYYYMMDD');
    }

    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // Los meses en Date van de 0 a 11
    const day = parseInt(dateString.substring(6, 8), 10);

    const date = new Date(year, month, day);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        throw new Error('La fecha proporcionada no es válida');
    }

    return date;
};

export const calculateOrderReadyDate = (): Date =>{
    const hoy: Date = new Date();
    // Restar un día
    const diasParaEntrega: number = parseInt(process.env.ENTREGA_DIAS_ANTELACION || "1");
    hoy.setDate(hoy.getDate() - diasParaEntrega + 1);

    return hoy;
};

export const isReadyToDelivery = (earliestDeliveryDate: Date, delivery_date: Date): boolean => {
    return delivery_date <= earliestDeliveryDate ;
};

export const getLast2TransitOrders = (input: string): [string|null, string|null] => {
    // Asegurarse de que el string tiene al menos 154 caracteres
    if (input.length < 154) {
        return [null,null];
    }
  
    // Calcular el punto de inicio para los últimos 154 caracteres
    const startIndex = input.length - 154;
  
    // Extraer los últimos 164 caracteres
    const last164 = input.slice(startIndex);
  
    // Dividir los últimos 164 caracteres en dos partes de 82 caracteres cada una
    const firstPart = last164.slice(0, 77);
    const secondPart = last164.slice(77);
  
    return [firstPart, secondPart];
  };