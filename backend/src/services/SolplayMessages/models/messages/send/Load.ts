import LoadUnloadTransit from "./LoadUnloadTransit";

class Load extends LoadUnloadTransit {
    constructor(
        msg_id: number = 0,
        cart_id: number = 0,
        station_id: number = 0,
        station_type: number = 0,
        level: number = 0,
        options: string = '0',
        initial_inputs: string = '0',
        cargo_id: string = '0'
    ) {
        super(1, msg_id, cart_id, station_id, station_type, level, options, initial_inputs, cargo_id);
    }
}

export default Load;