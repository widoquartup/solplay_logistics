import type { FindQueryParams } from "./__interfaces/FindQueryParams";
import type { FindResult } from "./__interfaces/FindResult";
export interface ServiceInterface<TEntity> {
  index(query: FindQueryParams): Promise< FindResult<TEntity>>;
  show(id: string): Promise<TEntity | null>;
  store(item: TEntity): Promise<TEntity>;
  update(_id: string, item: TEntity): Promise<TEntity | null>;
  delete(_id: string): Promise<boolean>;
  softDelete(_id: string): Promise<boolean>;
  // Añade aquí otros métodos según sea necesario
}
