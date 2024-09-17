export interface InterfaceCustomError extends Error {
  code: number;
  message: string;
  errors?: object; // 'errors' es opcional
}
