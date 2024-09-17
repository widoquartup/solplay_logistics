import express, { Request, Response } from 'express';
import cors from 'cors';
import { LoadUnloadTransit } from "./models/messages/send/LoadUnloadTransit";
import { CancelTransit } from "./models/messages/send/CancelTransit";
import { Load } from "./models/messages/send/Load";
import { Unload } from "./models/messages/send/Unload";
import { Message } from "./services/GatewayService";
import { createInterface } from 'readline';
import colors from 'cli-color';

const PORT: number = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8880;

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

interface StationInfo {
    stationId: number;
    stationType: number;
    level: number;
}

interface TransportRequest {
    from: {
        station: string;
        position: string;
    };
    to: {
        station: string;
        position: string;
    };
}

const message = new Message(async (data: any) => {
    console.log(colors.magenta(`<<<`, data));
    if (data.getType === "202") {
        let lugar = data.getStationType === 1 ? 'Derecha' : 'Izquierda';
        if (data.getBoxReady === '1') {
            console.log(colors.yellow(`Hay que descargar la estación 100  ${lugar}`));
        } else {
            console.log(colors.yellow(`Estación 100  ${lugar} descargada`));
        }
    }
    if (data._type === "101" || data._type === "100") {
        console.log(colors.yellow("ACK, se puede enviar una nueva orden"));
    }
    if (data._type === "102") {
        console.log(colors.red("NACK,hubo un error en la orden enviada"));
    }
    if (data._type === "200") {
        console.log(colors.yellow("Status OK"));
    }
});

// app.post('/api/transport', async (req: Request<{}, {}, TransportRequest>, res: Response) => {
//     console.log("Transportar ", req.body);

//     const from = req.body.from;
//     let msgId = await message.getNextMessageId();
//     console.log("Mensaje ID:", msgId);
//     let msgFrom = getLoad(msgId, getStationInfo(from));
//     console.log('Load Data:', from, msgFrom, new Date().toUTCString());
//     message.send(msgFrom.getData(), msgFrom.type);
//     await sleep(2);
//     const to = req.body.to;
//     msgId = await message.getNextMessageId();
//     let msgTo = getUnload(msgId, getStationInfo(to));
//     console.log('Unload Data:', to, msgTo, new Date().toUTCString());
//     message.send(msgTo.getData(), msgTo.type);
//     res.json({ status: 'ok', from, to });
// });

function sleep(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function getStationInfo(data: { station: string; position: string }): StationInfo {
    const station = data.station;
    const position = data.position;

    const result: StationInfo = { stationId: 0, stationType: 0, level: 0 };

    if (station === 'entrega') {
        return { stationId: 102, stationType: 2, level: 0 };
    }

    if (station === 'carga') {
        return {
            stationId: 100,
            stationType: position === 'D' ? 3 : 1,
            level: 3
        };
    }

    result.stationId = parseInt(station);

    if (position) {
        const [side, level] = position.split(':');
        result.stationType = side === 'D' ? 3 : 1;
        result.level = parseInt(level);
    }
    return result;
}

app.get('/api/cancel-transit', async (_req: Request, res: Response) => {
    console.log("Cancelar tránsito ");
    let msgCancelTransit = await getCancelTransit();
    console.log('Load Data:', msgCancelTransit, new Date().toUTCString());
    message.send(msgCancelTransit.getData(), msgCancelTransit.type);
    res.sendStatus(200);
});

interface CargaToldoRequest {
    producto: string;
}

app.post('/api/carga-toldo', async (req: Request<{}, {}, CargaToldoRequest>, res: Response) => {
    console.log("Se ha cargado un ", req.body);
    const product = {
        nombre: `Producto: ${req.body.producto}`,
        codigo: "000001"
    };
    res.json(product);
});

app.listen(PORT, () => {
    console.log(`Servidor API REST escuchando en el puerto ${PORT}`);
});

const loadModel = new Load();
const unloadModel = new Unload();

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function getLoad(msgId: string, station: StationInfo): Load {
    loadModel.setCartId('1');
    loadModel.setMsgId(msgId);
    loadModel.setStationId(station.stationId);
    loadModel.setStationType(station.stationType);
    loadModel.setLevel(station.level);
    loadModel.setCargoId(' ');
    return loadModel;
}

function getUnload(msgId: string, station: StationInfo): Unload {
    unloadModel.setCartId('1');
    unloadModel.setMsgId(msgId);
    unloadModel.setStationId(station.stationId);
    unloadModel.setStationType(station.stationType);
    unloadModel.setLevel(station.level);
    unloadModel.setCargoId(' ');
    return unloadModel;
}

const CancelTransitModel = new CancelTransit();
async function getCancelTransit(): Promise<CancelTransit> {
    CancelTransitModel.setType('20');
    let msgId = await message.getNextMessageId();
    CancelTransitModel.setMsgId(msgId);
    CancelTransitModel.setCartId('1');
    return CancelTransitModel;
}