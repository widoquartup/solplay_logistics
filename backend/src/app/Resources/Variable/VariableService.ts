// VariableService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { VariableRepository } from './VariableRepository';
import { VariableType } from './VariableType';
// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";
export class VariableService extends ServiceBase<VariableType> {
  constructor(repository: VariableRepository) {
    super(repository);
  }
  // Sobrescribir métodos si es necesario
}
