import { Document, Types } from 'mongoose';


// Definición de la interfaz Order
export interface Order {
    number: string;
    fecha_entrega: string;
    bulto: number;
    delivery_ready: boolean;
    detalle: string;
    cantidad: number;
    cantidad_fabricada: number;
}

// Definición del tipo PendingStorage
export interface PendingStorageType extends Document {
    _id:Types.ObjectId;
    codigo_barras: string;
    station_id: number;
    station_type: number;
    pending: boolean;
    order: Order;
    isDeleted: boolean;
}

// ******* CargaToldoTypes

export interface CargaToldoDataType{
    station_type: string;
    producto: string;
}


export interface CargaToldoResultOrdenType{
    serie_orden: string;
    numero_orden: string;
    articulo: string;
    nombre: string;
    estado: string;
    fecha_fin: string;
    cantidad: string;
    cantidad_fabricada: string;
    id: string;
  }



export interface CargaToldoResultDataType{
    collection: CargaToldoResultOrdenType [];
    itemsPerPage: number;
    page: number;
    pages: number;
    totalFilteredRows: number;
    totalRows: number;
}