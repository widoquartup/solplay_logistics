// PendingStorageService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { PendingStorageRepository } from './PendingStorageRepository';
import { CargaToldoDataType, PendingStorageType, CargaToldoResultDataType, Order, CargaToldoResultOrdenType } from './PendingStorageType';
import Api2ClientService from '@src/services/QuartupApi2/Api2ClientService';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SortOrder } from 'mongoose';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";
export class PendingStorageService extends ServiceBase<PendingStorageType> {
  constructor(repository: PendingStorageRepository) {
    super(repository);
  }


  async cargaToldo(body: CargaToldoDataType) {

    const { station_type, producto } = body;

    const searchResult = await this.repository.findOne({"codigo_barras": producto });
    if (searchResult){
      return {data: null, error: "Este bulto ya está registrado"};
    }
    const partesProducto = producto.split('.');
    const ordenFabricacion = partesProducto[2];
    const api2Client = new Api2ClientService();
    const result = await api2Client.getOrdenFabricacion(ordenFabricacion);
    const data = result.data as CargaToldoResultDataType;
    const dataOrden = data.collection.length > 0 ? data.collection[0] : null;
    if (dataOrden) {
      const orden = ({
        number: dataOrden.numero_orden,
        bulto: parseInt(partesProducto[partesProducto.length - 1]),
        fecha_entrega: dataOrden.fecha_fin.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
        delivery_ready: false,
        detalle: dataOrden.nombre,
        cantidad: parseInt(dataOrden.cantidad),
        cantidad_fabricada: parseInt(dataOrden.cantidad_fabricada),
      }) as Order;
      const resultRepository = await this.repository.create(
        {
          codigo_barras: producto,
          station_type: parseInt(station_type),
          pending: true,
          order: orden
        } as PendingStorageType
      );
      return resultRepository;
    }
    return {data: null, error: "No se encontró la orden de fabricación"};
    // return result;
  }
}