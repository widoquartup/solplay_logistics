//
// POR EL MOMENTO NO SE ESTÁ USANDO ESTE SERVICIO
//


import { OrderqueueModel } from "@src/app/Resources/Orderqueue/OrderqueueModel";
import { OrderqueueRepository } from "@src/app/Resources/Orderqueue/OrderqueueRepository";
import { OrderqueueService } from "@src/app/Resources/Orderqueue/OrderqueueService";
import { OrderqueueType } from "@src/app/Resources/Orderqueue/OrderqueueType";
import { CargaToldoResultDataType } from "@src/app/Resources/PendingStorage/PendingStorageType";
import Api2ClientService from '@src/services/QuartupApi2/Api2ClientService';
import { convertQuartupDateToDate } from "./helpers/Helpers";

class OrderQueueProcessService{
    private orderQueueRepository: OrderqueueRepository;
    constructor(){
        this.orderQueueRepository = new OrderqueueRepository(OrderqueueModel);
    }
    public async getAndCompareOrderQueue(){

        const api2Client = new Api2ClientService();
        const result = await api2Client.getOrdenesFabricacion();
        console.log("api2Client.getOrdenesFabricacion",result);
        
        const data = result.data as CargaToldoResultDataType;
        if ( data.collection.length > 0) {
            for (const orden of data.collection){
                console.log("ORDERN:", orden);
                if ( parseInt(orden.cantidad)<1){
                    continue;
                }
                const query = {
                    page:"1", 
                    itemsPerPage:"1", 
                    filters: `{"order_number": { "=": "${orden.numero_orden}" }}`
                };
                console.log("QUERY QUEUE = ", query);
                const orderQueueResult = await  this.orderQueueRepository.find(query);
                if ( orderQueueResult.collection.length==0 ){
                    const ordenQueue = {
                        order_number: parseInt(orden.numero_orden),
                        delivery_date: convertQuartupDateToDate(orden.fecha_fin),
                        quantity: parseInt(orden.cantidad),
                        delivered_quantity: 0,
                        stored_quantity: 0,
                        isDeleted: false
                    } as OrderqueueType;
                    try {
                        this.orderQueueRepository.create(ordenQueue);
                    } catch (error) {
                        console.log("Error guardando la orden de fabricación en las colas de órdenes.");
                    }
                }
            }
        }

        // {
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
    }
}

export default OrderQueueProcessService;