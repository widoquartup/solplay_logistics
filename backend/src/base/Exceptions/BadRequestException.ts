import { InterfaceCustomError } from './InterfaceCustomError';

export default class BadRequestException extends Error implements InterfaceCustomError {
  code: number; // Declara explícitamente la propiedad code
  errors: object;

  constructor(errors: object, code: number = 400) {
    super('bad request');
    this.name = "BadRequestException";
    this.code = code;
    this.errors = errors;
    // Esto asegura que la pila de errores sea capturada correctamente en todas las versiones de Node
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestException);
    }
  }
}
