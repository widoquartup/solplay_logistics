import Api2ClientService from '@src/services/QuartupApi2/Api2ClientService';
import { convertQuartupDateToDate } from "./helpers/Helpers";
import { AlmacenRepository } from '@src/app/Resources/Almacen/AlmacenRepository';
import { AlmacenModel } from '@src/app/Resources/Almacen/AlmacenModel';
import { AlmacenType } from '@src/app/Resources/Almacen/AlmacenType';
import { CargaToldoResultDataType, Order } from '@src/app/Resources/PendingStorage/PendingStorageType';

// aquí procesaremos las órdenes de fabricación y el almacén que controlamos con el gateway de Singular Logistic.

class ProcessOrdersStorage {
    private almacenRepository: AlmacenRepository;
    constructor() {
        this.almacenRepository = new AlmacenRepository(AlmacenModel);
    }

    private async receiveOFMovimientoAlmacen() {
    }


    private async receiveCargaElevador() {
    }

    // Devuelve la orden almacenada que coincida con los parámetros de la estación .
    public async getOrderInTransit(station_id: number, station_type: number, level: number): Promise<Order | null> {
        const filters = { "station_id": station_id, "station_type": station_type, "level": level };
        const resultOrder = await this.almacenRepository.findWithMongo(filters);
        if (resultOrder) {
            return resultOrder[0].order as Order;
        }
        return null;
    }

    // Asigna la orden a la estación
    public async addOrderToStation(station_id: number, station_type: number, level: number, order: Order, loaded: boolean = false): Promise<AlmacenType | null> {
        const filters = { "station_id": station_id, "station_type": station_type, "level": level };
        try {
            const resultOrder = await this.almacenRepository.findWithMongo(filters);
            if (resultOrder.length>0) {
                const almacen = resultOrder[0];
                // almacen.order = order;
                // almacen.loaded = loaded;
                const resultOrderUpdate = await this.almacenRepository.updateStation(almacen, {order, loaded});
                return resultOrderUpdate;
            }
        } catch (error) {
            console.log("Error actualizando estación", error);
        }

        return null;
    }


    // Quita la orden de la estación
    public async deleteOrderFromStation(station_id: number, station_type: number, level: number): Promise<AlmacenType | null> {
        const filters = { "station_id": station_id,  "station_type": station_type,  "level": level };
        console.log("Buscando para eliminar orden en ", filters);
        try {
            const resultOrder = await this.almacenRepository.findWithMongo(filters);
            if (resultOrder) {
                const almacen = resultOrder[0];
                almacen.order = null;
                almacen.loaded = false;
                const resultOrderUpdate = await this.almacenRepository.updateStation(almacen, {order: null, loaded: false});
                return resultOrderUpdate;
            }
        } catch (error) {
            console.log("Error actualizando estación", error);
        }

        return null;
    }



    // public async getAndCompareOrderQueue() {

    //     const api2Client = new Api2ClientService();
    //     const result = await api2Client.getOrdenesFabricacion();
    //     console.log("api2Client.getOrdenesFabricacion", result);

    //     const data = result.data as CargaToldoResultDataType;
    //     if (data.collection.length > 0) {
    //         for (const orden of data.collection) {
    //             console.log("ORDEN:", orden);
    //             if (parseInt(orden.cantidad) < 1) {
    //                 continue;
    //             }
    //             const query = {
    //                 page: "1",
    //                 itemsPerPage: "1",
    //                 filters: `{"order_number": { "=": "${orden.numero_orden}" }}`
    //             };
    //             console.log("QUERY QUEUE = ", query);
    //             const orderQueueResult = await this.orderQueueRepository.find(query);
    //             if (orderQueueResult.collection.length == 0) {
    //                 const ordenQueue = {
    //                     order_number: parseInt(orden.numero_orden),
    //                     delivery_date: convertQuartupDateToDate(orden.fecha_fin),
    //                     quantity: parseInt(orden.cantidad),
    //                     delivered_quantity: 0,
    //                     stored_quantity: 0,
    //                     isDeleted: false
    //                 } as OrderqueueType;
    //                 try {
    //                     this.orderQueueRepository.create(ordenQueue);
    //                 } catch (error) {
    //                     console.log("Error guardando la orden de fabricación en las colas de órdenes.");
    //                 }
    //             }
    //         }
    //     }

        //     page?: string;
        //     itemsPerPage?: string;
        //     permanentFilters?: string; //json_encode_string
        //     filters?: string; //json_encode_string
        //     simpleSearch?: string; //json_encode_string
        //     sortBy?: string; //json_encode_string
        //     sortDesc?: string; //json_encode_string
        //     project?: string; //json_encode_string
        //   }


        // const filter = '{ sent : { "=": false } }';
        // try {
        //     const result = await this.orderQueueService.index({filters: filter, sortBy: '["fecha_fin"]',  sortDesc: '[false]', itemsPerPage: "1"});
        //     return result;
        // } catch (error) {
        //     return [];
        // }
        // return [];
    // }
}

export default ProcessOrdersStorage;