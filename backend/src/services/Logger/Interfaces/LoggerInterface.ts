// LoggerInterface.ts
export interface LoggerInterface {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  // otros métodos según sea necesario
}