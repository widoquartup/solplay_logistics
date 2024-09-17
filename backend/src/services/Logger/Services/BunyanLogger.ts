import bunyan from 'bunyan';
// import rfs from 'rotating-file-stream'; 
import { createStream } from 'rotating-file-stream';
// Necesitarás instalar rotating-file-stream
import { LoggerInterface } from '../Interfaces/LoggerInterface';

class BunyanLogger implements LoggerInterface {
    private logger: bunyan;

    constructor() {
        const infoStream = createStream('info.log', {
            interval: '1d', // rotación diaria
            path: 'logs',
            size: '20M', // tamaño máximo del archivo
            maxFiles: 14, // guardar archivos de log durante 14 días
            compress: 'gzip' // comprimir archivos antiguos
        });

        const errorStream = createStream('errors.log', {
            interval: '1d', // rotación diaria
            path: 'logs',
            size: '20M', // tamaño máximo del archivo
            maxFiles: 14, // guardar archivos de log durante 14 días
            compress: 'gzip' // comprimir archivos antiguos
        });

        this.logger = bunyan.createLogger({
            name: 'myapp',
            streams: [
                {
                    level: 'info',
                    stream: infoStream
                },
                {
                    level: 'error',
                    stream: errorStream
                },
                {
                    level: 'warn',
                    stream: process.stdout // log en consola para advertencias
                },
                {
                    level: 'debug',
                    stream: process.stdout // log en consola para debug
                }
            ]
        });
    }

    info(message: string): void {
        this.logger.info(message);
    }

    warn(message: string): void {
        this.logger.warn(message);
    }

    error(message: string): void {
        this.logger.error(message);
    }
}

export default BunyanLogger;
