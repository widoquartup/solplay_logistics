/**
 *  Campo	        Longitud	Descripción
 *  type	        3	        circuit_state. Ver Order_type.
 *  msg_id	        5	        Identificador de mensaje. Incrementado en cada nuevo mensaje.
 *  circuit_voltage	5	        Voltaje del circuito. Formato xxx.x
 *  circuit_current	5	        Amperaje del circuito. Formato xxx.x
 *  working_carts	5	        Número de carros preparados para trabajar.
 *  check	        7	        Comprobaciones del circuito. Ver Circuit_check en Enumeraciones.
 *  target_mode	    1	        Modo de funcionamiento asignado al circuito. Ver Circuit_mode en Enumeraciones.
 *  mode	        1	        Modo de funcionamiento efectivo del circuito. Debería coincidir con target_mode, pero puede no hacerlo dependiendo de las condiciones detectadas en check. Ver Circuit_mode en Enumeraciones.
 */

import { parseData } from '../../../helpers/Helpers';

export interface CircuitStateData {
  type: string;
  msgId: string;
  circuitVoltage: string;
  circuitCurrent: string;
  workingCarts: string;
  check: string;
  targetMode: string;
  mode: string;
}

class CircuitState {
  private _type: string;
  private _msgId: string;
  private _circuitVoltage: string;
  private _circuitCurrent: string;
  private _workingCarts: string;
  private _check: string;
  private _targetMode: string;
  private _mode: string;

  constructor(data: string) {
    const {
      type,
      msgId,
      circuitVoltage,
      circuitCurrent,
      workingCarts,
      check,
      targetMode,
      mode,
    } = this._parseData(data) ;

    this._type = type;
    this._msgId = msgId;
    this._circuitVoltage = circuitVoltage;
    this._circuitCurrent = circuitCurrent;
    this._workingCarts = workingCarts;
    this._check = check;
    this._targetMode = targetMode;
    this._mode = mode;
  }

  private _parseData(data: string): CircuitStateData {
    const lengths = {
      type: 3,
      msgId: 5,
      circuitVoltage: 5,
      circuitCurrent: 5,
      workingCarts: 5,
      check: 7,
      targetMode: 1,
      mode: 1,
    };
    return parseData(lengths, data) as CircuitStateData;
  }

  // Getters
  get type(): string {
    return this._type;
  }

  get msgId(): string {
    return this._msgId;
  }

  get circuitVoltage(): string {
    return this._circuitVoltage;
  }

  get circuitCurrent(): string {
    return this._circuitCurrent;
  }

  get workingCarts(): string {
    return this._workingCarts;
  }

  get check(): string {
    return this._check;
  }

  get targetMode(): string {
    return this._targetMode;
  }

  get mode(): string {
    return this._mode;
  }

  // Setters
  set type(type: string) {
    this._type = type;
  }

  set msgId(msgId: string) {
    this._msgId = msgId;
  }

  set circuitVoltage(circuitVoltage: string) {
    this._circuitVoltage = circuitVoltage;
  }

  set circuitCurrent(circuitCurrent: string) {
    this._circuitCurrent = circuitCurrent;
  }

  set workingCarts(workingCarts: string) {
    this._workingCarts = workingCarts;
  }

  set check(check: string) {
    this._check = check;
  }

  set targetMode(targetMode: string) {
    this._targetMode = targetMode;
  }

  set mode(mode: string) {
    this._mode = mode;
  }
}

export default CircuitState;