// Definición del tipo Almacen
import { Document, Types } from 'mongoose';
import { Order } from '../PendingStorage/PendingStorageType';


export interface AlmacenType extends Document {
    _id:Types.ObjectId;
    station_id: number,
    station_type: number,
    level: number,
    order: Order|null,
    loaded: boolean,
    status_ok: boolean,
    processing: boolean,
    preferent_order: number,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date
}


export type TransportParameterType = {
    stationId: number;
    stationType: number;
    level: number;
  };
  

export type ResponseTransportType = {
  data: string;
  code: number;
}