// DataSourceInterfaces.ts
// definicion de tipos para el mapeo a mongo DB;
export type JavaScriptType = 'string' | 'email' | 'number' | 'boolean' | 'date' | 'array' | 'object';
export type MongooseType = 'String' | 'Number' | 'Boolean' | 'Date' | 'Array' | 'Object' | 'Schema.Types.Mixed';
export interface Field {
    name: string;
    required: boolean;
    // type: string;
    type: JavaScriptType; // Cambio aquí de 'string' a 'JavaScriptType'
    min?: number;
    enum?: string[];
    default?: string;
    mustBeTrue?: boolean;
}

export interface RouteMiddlewareConfig {
    base: string[];
    local?: string[];
}

export interface RoutesMiddlewares {
    index: RouteMiddlewareConfig;
    show: RouteMiddlewareConfig;
    store: RouteMiddlewareConfig;
    update: RouteMiddlewareConfig;
    delete: RouteMiddlewareConfig;
    softDelete: RouteMiddlewareConfig;
}

export interface DataSource {
    name: string;
    deep: string;
    fields: Field[];
    routesMiddlewares: RoutesMiddlewares;
}

export interface Route {
    path: string;
    module: string;
}
export interface Specs {
    lowerResource: string;
    upperResource: string;
    base: string;
    [key: string]: string | boolean; // Esto permite propiedades adicionales de cualquier tipo
}
export interface Templates {
    controller: string;
    service: string;
    repository: string;
    model: string;
    routes: string;
    type: string;
    validations: string;
}

