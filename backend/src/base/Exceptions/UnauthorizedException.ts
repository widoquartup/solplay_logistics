import { InterfaceCustomError } from './InterfaceCustomError';

export default class UnauthorizedException extends Error implements InterfaceCustomError {
  code: number; // Declara explícitamente la propiedad code

  constructor(message: string = 'Unauthorized', code: number = 401) {
    super(message);
    this.name = "UnauthorizedException";
    this.code = code;
    // Esto asegura que la pila de errores sea capturada correctamente en todas las versiones de Node
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedException);
    }
  }
}
