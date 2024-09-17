class LoadUnloadTransit {
    private lengths: { [key: string]: number };
    private type: number;
    private msg_id: number;
    private cart_id: number;
    private station_id: number;
    private station_type: number;
    private level: number;
    private options: string;
    private initial_inputs: string;
    private cargo_id: string;

    // type puede ser '1', '2', '3'
    constructor(
        type: number = 0,
        msg_id: number = 0,
        cart_id: number = 0,
        station_id: number = 0,
        station_type: number = 0,
        level: number = 0,
        options: string = '0',
        initial_inputs: string = '0',
        cargo_id: string = '0'
    ) {
        this.lengths = {
            type: 3,
            msg_id: 5,
            cart_id: 5,
            station_id: 5,
            station_type: 5,
            level: 2,
            options: 10,
            initial_inputs: 10,
            cargo_id: 10,
        };
        this.type = type;
        this.msg_id = msg_id;
        this.cart_id = cart_id;
        this.station_id = station_id;
        this.station_type = station_type;
        this.level = level;
        this.options = options;
        this.initial_inputs = initial_inputs;
        this.cargo_id = cargo_id;
    }

    // Métodos get
    getType(): number {
        return this.type;
    }

    getMsgId(): number {
        return this.msg_id;
    }

    getCartId(): number {
        return this.cart_id;
    }

    getStationId(): number {
        return this.station_id;
    }

    getStationType(): number {
        return this.station_type;
    }

    getLevel(): number {
        return this.level;
    }

    getOptions(): string {
        return this.options;
    }

    getInitialInputs(): string {
        return this.initial_inputs;
    }

    getCargoId(): string {
        return this.cargo_id;
    }

    // Función para aplicar space padding
    private spacePad(value: string | number, length: number): string {
        const stringValue = String(value);
        let padding = '';
        if (stringValue.length <= length) {
            padding = ' '.repeat(length - stringValue.length);
        }
        return padding + stringValue;
    }

    // Devuelve el mensaje completo
    getData(): string {
        return this.spacePad(this.type, this.lengths.type) +
               this.spacePad(this.msg_id, this.lengths.msg_id) +
               this.spacePad(this.cart_id, this.lengths.cart_id) +
               this.spacePad(this.station_id, this.lengths.station_id) +
               this.spacePad(this.station_type, this.lengths.station_type) +
               this.spacePad(this.level, this.lengths.level) +
               this.spacePad(this.options, this.lengths.options) +
               this.spacePad(this.initial_inputs, this.lengths.initial_inputs) +
               this.spacePad(this.cargo_id, this.lengths.cargo_id);
    }

    // Métodos set para cada propiedad
    setType(newType: number): void {
        this.type = newType;
    }

    setMsgId(newMsgId: number): void {
        this.msg_id = newMsgId;
    }

    setCartId(newCartId: number): void {
        this.cart_id = newCartId;
    }

    setStationId(newStationId: number): void {
        this.station_id = newStationId;
    }

    setStationType(newStationType: number): void {
        this.station_type = newStationType;
    }

    setLevel(newLevel: number): void {
        this.level = newLevel;
    }

    setOptions(newOptions: string): void {
        this.options = newOptions;
    }

    setInitialInputs(newInitialInputs: string): void {
        this.initial_inputs = newInitialInputs;
    }

    setCargoId(newCargoId: string): void {
        this.cargo_id = newCargoId;
    }

    getCancelTransit(): string {
        return " 20    2    1";
    }
}

export default LoadUnloadTransit;