/**
  Campo           Longitud              Descripción
  type            3                     station_state. Ver Order_type.
  msg_id          5                     Identificador de mensaje. Incrementado en cada nuevo mensaje.
  station_id      5                     Identificador de la estación
  station_type    5                     Tipo de la estación
  box_ready       1                     Indica si tenemos una carga disponible o no
*/

import { parseData } from '../../../helpers/Helpers';

export interface StationStateData {
  type: string;
  msgId: string;
  stationId: string;
  stationType: string;
  boxReady: string;
}

class StationState {
  private _type: string;
  private _msgId: string;
  private _stationId: string;
  private _stationType: string;
  private _boxReady: string;

  constructor(data: string) {
    const {
      type,
      msgId,
      stationId,
      stationType,
      boxReady,
    } = this._parseData(data) ;

    this._type = type;
    this._msgId = msgId;
    this._stationId = stationId;
    this._stationType = stationType;
    this._boxReady = boxReady;
  }

  private _parseData(data: string): StationStateData {
    const lengths = {
      type: 3,
      msgId: 5,
      stationId: 5,
      stationType: 5,
      boxReady: 1,
    };

    return parseData(lengths, data) as StationStateData;
  }

  // Getters
  get type(): string {
    return this._type;
  }

  get msgId(): string {
    return this._msgId;
  }

  get stationId(): string {
    return this._stationId;
  }

  get stationType(): string {
    return this._stationType;
  }

  get boxReady(): string {
    return this._boxReady;
  }

  // Setters
  set type(type: string) {
    this._type = type;
  }

  set msgId(msgId: string) {
    this._msgId = msgId;
  }

  set stationId(stationId: string) {
    this._stationId = stationId;
  }

  set stationType(stationType: string) {
    this._stationType = stationType;
  }

  set boxReady(boxReady: string) {
    this._boxReady = boxReady;
  }
}

export default StationState;