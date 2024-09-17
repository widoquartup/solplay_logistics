// import mongoose from 'mongoose';
import type { FindQueryParams } from "./__interfaces/FindQueryParams";
import type { FindResult } from "./__interfaces/FindResult";
import { Document, FilterQuery, SortOrder } from 'mongoose';


export type SortType = { [key: string]: SortOrder };

export interface RepositoryInterface<T extends Document> {
    find(query: FindQueryParams): Promise<FindResult<T>>;
    findById(_id: string): Promise<T | null>;
    findOne(query: FilterQuery<T>): Promise<T | null>; // Nuevo método añadido
    create(item: Omit<T, '_id'>): Promise<T>;
    update(_id: string, item: Partial<T>): Promise<T>;
    delete(_id: string): Promise<boolean>;
    softDelete(_id: string): Promise<boolean>;
    findWithMongo(query: FilterQuery<T>, sort?: SortType): Promise<T[]>; // Nuevo método añadido
}
// Métodos de Búsqueda
// find(): Busca documentos que coincidan con las condiciones dadas.
// findById(): Busca un documento por su identificador único (_id).
// findOne(): Busca el primer documento que coincida con las condiciones dadas.
// findOneAndDelete(): Encuentra un documento, lo elimina y lo devuelve.
// findOneAndRemove(): Similar a findOneAndDelete pero puede tener diferencias en comportamiento debido a cómo MongoDB maneja los métodos subyacentes.
// findOneAndUpdate(): Encuentra un documento y lo actualiza con los datos proporcionados.
// findByIdAndUpdate(): Encuentra un documento por su _id y lo actualiza.
// countDocuments(): Cuenta el número de documentos que coinciden con las condiciones dadas.
// estimatedDocumentCount(): Proporciona una estimación rápida del número total de documentos en una colección.
// distinct(): Encuentra los valores distintos para un campo específico entre un conjunto de documentos que coinciden con una condición dada.
// Métodos de Creación y Actualización
// create(): Crea uno o más documentos y los inserta en la base de datos.
// insertMany(): Inserta varios documentos en la base de datos en una operación de lote.
// updateOne(): Actualiza el primer documento que coincide con las condiciones dadas.
// updateMany(): Actualiza todos los documentos que coinciden con las condiciones dadas.
// findByIdAndReplace(): Encuentra un documento por su _id, lo reemplaza con otro documento y devuelve el documento original o el nuevo según la opción seleccionada.
// replaceOne(): Reemplaza un único documento que coincide con las condiciones dadas.
// Métodos de Eliminación
// deleteOne(): Elimina el primer documento que coincida con las condiciones dadas.
// deleteMany(): Elimina todos los documentos que coincidan con las condiciones dadas.
// Métodos de Agregación
// aggregate(): Realiza una operación de agregación para procesar datos y devolver resultados calculados.
// Métodos de Utilidad
// populate(): Se usa para rellenar automáticamente los campos especificados en el documento con documentos de otras colecciones (similar a las JOINs en SQL).
// lean(): Devuelve los resultados como simples objetos JavaScript, sin toda la magia de los documentos de Mongoose.
// exec(): Ejecuta una consulta y devuelve una promesa.