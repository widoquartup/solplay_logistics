export interface FindResult<T> {
  collection: T[];
  page: number;
  pages:number;
  itemsPerPage: number;
  totalRows:number;
  totalFilteredRows:number;
  // Otros detalles pueden agregarse aquí más tarde
}
