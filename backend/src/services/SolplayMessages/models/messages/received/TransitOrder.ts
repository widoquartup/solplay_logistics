interface TransitOrderData {
  use: string;
  type: string;
  // node: string;
  stationId: string;
  stationType: string;
  level: string;
  options: string;
  transitId: string;
  cargoId: string;
  phase: string;
  inputs: string;
  outputs: string;
  lastCommand: string;
}

class TransitOrder {
  private _use: string;
  private _type: string;
  // private _node: string;
  private _stationId: string;
  private _stationType: string;
  private _level: string;
  private _options: string;
  private _transitId: string;
  private _cargoId: string;
  private _phase: string;
  private _inputs: string;
  private _outputs: string;
  private _lastCommand: string;

  constructor(data: string) {
    const parsedData = this._parseData(data);
    this._use = parsedData.use;
    this._type = parsedData.type;
    // this._node = parsedData.node;
    this._stationId = parsedData.stationId;
    this._stationType = parsedData.stationType;
    this._level = parsedData.level;
    this._options = parsedData.options;
    this._transitId = parsedData.transitId;
    this._cargoId = parsedData.cargoId;
    this._phase = parsedData.phase;
    this._inputs = parsedData.inputs;
    this._outputs = parsedData.outputs;
    this._lastCommand = parsedData.lastCommand;
  }

  private _parseData(data: string): TransitOrderData {
    const lengths: { [key: string]: number } = {
      use: 1,
      type: 3,
      // node: 5,
      stationId: 5,
      stationType: 5,
      level: 2,
      options: 10,
      transitId: 10,
      cargoId: 10,
      phase: 1,
      inputs: 10,
      outputs: 10,
      lastCommand: 10,
    };

    let offset = 0;
    const parsedData: Partial<TransitOrderData> = {};
    for (const key of Object.keys(lengths)) {
      const length = lengths[key];
      parsedData[key as keyof TransitOrderData] = data.substring(offset, offset + length);
      offset += length;
    }

    return parsedData as TransitOrderData;
  }

  // Getters
  get use(): string {
    return this._use;
  }

  get type(): string {
    return this._type;
  }

  // get node(): string {
  //   return this._node;
  // }

  get stationId(): string {
    return this._stationId;
  }

  get stationType(): string {
    return this._stationType;
  }

  get level(): string {
    return this._level;
  }

  get options(): string {
    return this._options;
  }

  get transitId(): string {
    return this._transitId;
  }

  get cargoId(): string {
    return this._cargoId;
  }

  get phase(): string {
    return this._phase;
  }

  get inputs(): string {
    return this._inputs;
  }

  get outputs(): string {
    return this._outputs;
  }

  get lastCommand(): string {
    return this._lastCommand;
  }

  // Setters
  set use(value: string) {
    if (value.length !== 1) {
      throw new Error("El campo 'use' debe tener una longitud de 1 caracter");
    }
    this._use = value;
  }

  set type(value: string) {
    if (value.length !== 3) {
      throw new Error("El campo 'type' debe tener una longitud de 3 caracteres");
    }
    this._type = value;
  }

  // set node(value: string) {
  //   if (value.length !== 5) {
  //     throw new Error("El campo 'node' debe tener una longitud de 5 caracteres");
  //   }
  //   this._node = value;
  // }

  set stationId(value: string) {
    if (value.length !== 5) {
      throw new Error("El campo 'stationId' debe tener una longitud de 5 caracteres");
    }
    this._stationId = value;
  }

  set stationType(value: string) {
    if (value.length !== 5) {
      throw new Error("El campo 'stationType' debe tener una longitud de 5 caracteres");
    }
    this._stationType = value;
  }

  set level(value: string) {
    if (value.length !== 2) {
      throw new Error("El campo 'level' debe tener una longitud de 2 caracteres");
    }
    this._level = value;
  }

  set options(value: string) {
    if (value.length !== 10) {
      throw new Error("El campo 'options' debe tener una longitud de 10 caracteres");
    }
    this._options = value;
  }

  set transitId(value: string) {
    if (value.length !== 10) {
      throw new Error("El campo 'transitId' debe tener una longitud de 10 caracteres");
    }
    this._transitId = value;
  }

  set cargoId(value: string) {
    if (value.length !== 10) {
      throw new Error("El campo 'cargoId' debe tener una longitud de 10 caracteres");
    }
    this._cargoId = value;
  }

  set phase(value: string) {
    if (value.length !== 1) {
      throw new Error("El campo 'phase' debe tener una longitud de 1 caracter");
    }
    this._phase = value;
  }

  set inputs(value: string) {
    if (value.length !== 10) {
      throw new Error("El campo 'inputs' debe tener una longitud de 10 caracteres");
    }
    this._inputs = value;
  }

  set outputs(value: string) {
    if (value.length !== 10) {
      throw new Error("El campo 'outputs' debe tener una longitud de 10 caracteres");
    }
    this._outputs = value;
  }

  set lastCommand(value: string) {
    if (value.length !== 10) {
      throw new Error("El campo 'lastCommand' debe tener una longitud de 10 caracteres");
    }
    this._lastCommand = value;
  }
}

export default TransitOrder;