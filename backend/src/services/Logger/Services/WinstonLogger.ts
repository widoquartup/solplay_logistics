import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file'; // Importar el módulo de rotación diaria
import { LoggerInterface } from '../Interfaces/LoggerInterface';

class WinstonLogger implements LoggerInterface {
  private logger: Logger;

  constructor() {
    const dailyRotateFileTransportInfo = new transports.DailyRotateFile({
      level: 'info',
      filename: 'logs/logistics/in-out-%DATE%.log', // Formato de nombre de archivo con fecha
      datePattern: 'YYYY-MM-DD', // Patrón de fecha
      zippedArchive: true, // Comprimir archivos antiguos
      maxSize: '20m', // Tamaño máximo del archivo
      maxFiles: '14d', // Guardar archivos de log durante 14 días
    });

    // Transporte para logs de nivel 'error'
    const dailyRotateFileTransportError = new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/logistics/in-out-errors-%DATE%.log', // Formato de nombre de archivo con fecha
      datePattern: 'YYYY-MM-DD', // Patrón de fecha
      zippedArchive: true, // Comprimir archivos antiguos
      maxSize: '20m', // Tamaño máximo del archivo
      maxFiles: '14d', // Guardar archivos de log durante 14 días
    });

    this.logger = createLogger({

      format: format.combine(
        format.timestamp(), // Agregar una marca de tiempo
        format.json() // Formato JSON
      ),
      transports: [
        // new transports.Console(), // Log en consola
        dailyRotateFileTransportInfo,
        dailyRotateFileTransportError
      ],
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

export default WinstonLogger;
