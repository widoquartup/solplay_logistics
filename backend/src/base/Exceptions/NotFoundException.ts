import { InterfaceCustomError } from './InterfaceCustomError';

export default class NotFoundException extends Error implements InterfaceCustomError {
  code: number; // Declara explícitamente la propiedad code

  constructor(message: string = 'Not found', code: number = 404) {
    super(message);
    this.name = "NotFoundException";
    this.code = code;
    // Esto asegura que la pila de errores sea capturada correctamente en todas las versiones de Node
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundException);
    }
  }
}
