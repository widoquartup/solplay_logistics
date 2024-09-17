import 'module-alias/register';
import express, { Request, Response, NextFunction } from 'express';
import { connectToMongoDB } from '@base/mongoConnection';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import https from 'https';
import http from 'http';
import fs from 'fs';
import dotenv from 'dotenv';

import { context } from '@base/context';
import transactionStart from './base/Middlewares/transactionStart';
import transactionEnd from './base/Middlewares/transactionEnd';
import transactionStore from './base/Middlewares/transactionStore';
import { InterfaceCustomError } from './base/Exceptions/InterfaceCustomError';
import SocketHandler from '@base/Utils/SocketHandler';
import { routesPath } from './paths';
import { runConsumer } from './services/Kafka/KafkaConsumer';
import { consumidorDatos } from './services/SolplayMessages/services/Consumer/DataConsumerManager';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();


app.set('trust proxy', true);
app.use(cors());
app.use(helmet());
// app.use(logger('dev'));
app.use(morgan('tiny'));
// Habilitar el análisis de cuerpos de solicitud JSON
app.use(express.json({ limit: '50mb' }));

// Habilitar el análisis de cuerpos de solicitud URL-encoded (si es necesario para tu API)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

async function startApp() {
    interface Route {
        path: string;
        module: string;
    }
    app.use(transactionStart(process.env.APP_NAME));
    app.use(cors({
        origin: '*' // Permite cualquier origen para las rutas Express
      }));
    const data = fs.readFileSync(routesPath, 'utf8');
    const routes: Route[] = JSON.parse(data);
    for (const route of routes) {
        try {
            const module = await import(route.module);
            app.use(route.path, module.default);
        } catch (error) {
            if (error instanceof Error) {
                // console.error(error.message);
                // console.log(route.path, error);
                context.logger.error(route.path +" / "+error.toString());
                context.logger.error('Hubo un error cargando rutas');
            } else {
                console.error('Error desconocido:', error);
                // console.log(route.path);
                context.logger.error(route.path +" / "+(error as string));
                context.logger.error('Hubo un error cargando rutas');
            }
        }
    }

    // Middleware de manejo de errores
    interface ErrorResponse {
        message: string;
        errors?: object | null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: InterfaceCustomError, req: Request, res: Response, next: NextFunction): void => {
        const errorResponse: ErrorResponse = { message: err.message };
        if (err.errors) {
            errorResponse.errors = err.errors;
        }

        res.locals.errorCode = err.code ?? 500;
        res.locals.errors = errorResponse;

        // console.log(res.locals.errors);
        next();
        // res.status(err.code ?? 500).json(errorResponse);
    });

    app.use(transactionEnd()); //antes de enviar cualquier respuesta terminamos el registro de la transacción
    app.use(transactionStore()); //antes de enviar cualquier respuesta hacemos store del registro de la transacción


    // Middleware final return respose
    app.use((req: Request, res: Response) => {

        if (res.locals.errors) {
            return res.status(res.locals.errorCode).json(res.locals.errors);
        }

        if (typeof res.locals.response === 'undefined') {
            let message = 'route not found';
            if (process.env.ENV === 'development') {
                message += ' o no has definido la response';
            }
            return res.status(404).json({ message: message });
        }

        return res.json(res.locals.response);
    });

    await connectToMongoDB();

    let server;
    // Configuración del servidor HTTPS/HTTP
    if (process.env.USE_HTTPS === 'true') {

        const httpsOptions = {
            key: fs.readFileSync(process.env.APP_PRIVKEY as string),
            cert: fs.readFileSync(process.env.APP_FULLCHAIN as string),
            requestCert: false,
            rejectUnauthorized: false
        };

        server = https.createServer(httpsOptions, app);
    } else {
        server = http.createServer(app);
    }
    context.message.connect((data: Buffer) => {
        context.message.handleData(data);
    });

    // Inicializar Socket.IO
    SocketHandler.initialize(server);

    server.listen(PORT, () => {
        console.log(`Servidor ${process.env.USE_HTTPS === 'true' ? 'HTTPS' : 'HTTP'} y WebSocket corriendo en ${process.env.USE_HTTPS === 'true' ? 'https' : 'http'}://localhost:${PORT}`);
        
        // Consumidor de mensajes Kafka
        runConsumer().catch(console.error);
        // Consume datos desde BBDD
        // consumidorDatos(); 

    });

    // context.message.connect((data: Buffer) => {
    //     context.message.handleData(data);
    // });
}

startApp();