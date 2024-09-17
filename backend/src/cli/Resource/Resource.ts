// Resource.ts
import { join } from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import { Str } from '@base/Helpers/Str';
import { PostmanCollectionManager } from './PostmanCollectionManager';
import { DataSource, Templates, RoutesMiddlewares, RouteMiddlewareConfig, Field, Route, JavaScriptType, MongooseType, Specs } from '@src/cli/DataSourceInterfaces';
import ts from 'typescript';
import clc from 'cli-color';
import { dirJsons, resourceTemplatesPath, routesPath, dirResources } from '@src/paths';
interface RouteInfo {
    method: string;
    path: string;
}

export class Resource {
    private templates: Templates = {
        controller: 'TController.hbs',
        service: 'TService.hbs',
        repository: 'TRepository.hbs',
        model: 'TModel.hbs',
        routes: 'TRoutes.hbs',
        type: 'TType.hbs',
        validations: 'TValidations.hbs',
    };
    private jsonFileName: string | undefined;
    private routesPath: string = '';
    private resourcePath: string = '';
    private dirResources: string = '';
    private dirJsons: string = '';
    private resourceTemplatesPath: string = '';
    private __targeDir: string = '../../../';
    // private __targeDir: string = '';
    private __dirBaseresources: string = "app/Resources";
    //path relativo antes de Base
    // private __base: string = "../../../base";
    private __base: string = "@base";
    private oDefRoutes: Route = {
        path: '',
        module: ''
    };
    private json: DataSource = {
        name: '',
        deep: '',
        fields: [],
        routesMiddlewares: {
            index: { base: [] } as RouteMiddlewareConfig,
            show: { base: [] } as RouteMiddlewareConfig,
            store: { base: [] } as RouteMiddlewareConfig,
            update: { base: [] } as RouteMiddlewareConfig,
            delete: { base: [] } as RouteMiddlewareConfig,
            softDelete: { base: [] } as RouteMiddlewareConfig
        } as RoutesMiddlewares
    };
    private specs: Specs = {
        lowerResource: '',
        upperResource: '',
        base: ''
    };
    private abort: boolean = false;
    constructor(jsonFileName: string | undefined) {
        this.jsonFileName = jsonFileName;
        this._setPaths();
        try {
            this._setJsonDefinitions();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.info(clc.red(error.message));
            } else {
                console.error(clc.red("Se produjo un error"));
            }
            this.abort = true;
            return;
        }
        this._setResourcePath();
        this._setBase();
        try {
            this._mkDirIfNotExist();
        } catch (error) {
            if (error instanceof Error) {
                console.info(clc.red(error.message));
            } else {
                console.error(clc.red("Se produjo un error"));
            }
            this.abort = true;
            return;
        }
        this._setDefRoutes();
        this._addObjectDefRoutesToFileRoutes();
        this._setSpecs();
    }
    public handle(): boolean {
        if (this.abort) {
            return false;
        }
        this._buildResourceFile('controller');
        this._buildResourceFile('service');
        this._buildResourceFile('repository');
        this._buildResourceFile('routes', this.json.routesMiddlewares);
        this._buildResourceFile('model', this.json.fields);
        this._buildResourceFile('type', this.json.fields);
        this._buildResourceFile('validations', this.json.fields);
        this._buildPostmanCollection();
        return true;
        // console.log(`Manejando el recurso con nombre: ${this.jsonFileName}`);
    }

    private _mapToMongooseType(type: JavaScriptType): MongooseType {
        const typeMapping: { [key in JavaScriptType]: MongooseType } = {
            'string': 'String',
            'email': 'String',
            'number': 'Number',
            'boolean': 'Boolean',
            'date': 'Date',
            'array': 'Array',
            'object': 'Object'
            // Agrega más mapeos según sea necesario
        };

        return typeMapping[type] || 'Schema.Types.Mixed';
    }
    private _setJsonDefinitions(): void {

        try {
            const file = join(this.dirJsons, this.jsonFileName + ".json");
            const content = fs.readFileSync(file, 'utf8');
            this.json = JSON.parse(content);
        } catch (error) {
            throw new Error(`no se encontró el archivo ${this.jsonFileName}.json en ${'src' + this.dirJsons.split('src')[1]}`);
        }
    }
    private _getTemplateContent(templateName: string): string | undefined {
        try {
            const p = join(this.resourceTemplatesPath, templateName);
            return fs.readFileSync(p, 'utf8');
        } catch (error: unknown) {  // Asegúrate de capturar el error como tipo 'unknown'
            if (error instanceof Error) {  // Chequea si el error es una instancia de Error
                console.error('No se encontró la template. Error: ' + error.message);
            } else {
                console.error('Ocurrió un error desconocido al leer la template.');
            }
        }
    }
    private _buildResourceFile(name: keyof Templates, data: Field[] | RoutesMiddlewares | null = null) {
        const resource = this.json.name;
        const content = this._getTemplateContent(this.templates[name]);
        if (!content) {
            console.error('nops');
            return;
        }
        const templateCompile = Handlebars.compile(content);
        let specs = this.specs;
        if (data && name === 'model') {

            specs.mongoDefs = this._generarCamposDinamicos(data as Field[]);
        }
        if (data && name === 'type') {
            specs.types = this._generarTiposDinamicos(data as Field[]);
        }
        if (data && name === 'validations') {
            specs.object = this._generarValidationObjectDinamico(data as Field[]);
            specs.consts = this._generarValidationConstsDinamico(data as Field[]);
        }
        if (data && name === 'routes') {
            specs = this._generarRoutesSpecs(data as RoutesMiddlewares, specs);
        }
        const result = templateCompile(specs);
        const fileName = Str.toCamelCaseCapitalized(`${resource}-${name}.ts`);
        const filePath = join(this.resourcePath, fileName);
        fs.writeFileSync(filePath, result);
        const relative = "src" + filePath.split('src')[1];
        console.info(`Archivo creado en: ${relative}`);
    }

    private _buildPostmanCollection() {
        const resource = this.json.name;
        const folderName = Str.toCamelCaseCapitalized(resource);
        const fileRoutes = Str.toCamelCaseCapitalized(`${resource}-routes.ts`);
        const rotesPath = join(this.resourcePath, fileRoutes);
        const routes = this.analyzeRoutes(rotesPath);
        const apiPath = this._getApiPath();
        const manager = new PostmanCollectionManager();
        manager.addFolder(folderName, routes, apiPath);
    }


    private _processMiddlewares(middlewares: RoutesMiddlewares): Record<string, string> {
        const specs: Record<string, string> = {};

        const keys: Array<keyof RoutesMiddlewares> = ['index', 'show', 'store', 'update', 'delete', 'softDelete'];
        keys.forEach(route => {
            const config = middlewares[route];
            if (config) {
                let { base = [] } = config;
                const { local = [] } = config;

                if (route === 'update' || route === 'store') {
                    base = base.map(middleware => middleware === 'validate' ? `validate${Str.capitalizeFirstLetter(route)}` : middleware);
                }

                const allMiddlewares = base.concat(local);
                specs[route] = allMiddlewares.join(", ");
            }
        });

        return specs;
    }

    private _setSpecs() {
        this.specs = {
            lowerResource: Str.toCamelCase(this.json.name),
            upperResource: Str.toCamelCaseCapitalized(this.json.name),
            base: this.__base
        };
    }
    private _generarRoutesSpecs(routesMiddlewares: RoutesMiddlewares, specs: Specs) {

        const pspecs = this._processMiddlewares(routesMiddlewares);
        const keys = Object.keys(pspecs);
        for (const key of keys) {
            const aM = pspecs[key].split(",").map(item => item.trim());
            if (key === 'store') {
                if (aM.includes('validateStore')) {
                    specs.validateReq = 'ValidateReq';
                    specs.creationSchema = true;
                }
            }
            if (key === 'update') {
                if (aM.includes('validateUpdate')) {
                    specs.validateReq = 'ValidateReq';
                    specs.updateSchema = true;
                }
            }
            pspecs[key] = `const ${key}Middlewares: RequestHandler[] = [${pspecs[key]}];`;
        }
        if (specs.updateSchema && specs.creationSchema) {
            specs.fullValidation = true;
            specs.creationSchema = false;
            specs.updateSchema = false;
        }
        return { ...specs, ...pspecs };
    }

    private _generarCamposDinamicos(fields: Field[]) {
        return fields.map(field => {
            // Iniciar la definición del campo con su tipo
            // Validar y convertir el tipo solo si coincide con los valores esperados
            const fieldType: JavaScriptType | undefined = ['string', 'email', 'number', 'boolean', 'date', 'array', 'object'].includes(field.type) ? field.type as JavaScriptType : undefined;
            if (!fieldType) {
                console.error(`Tipo no soportado: ${field.type}`);
                return ''; // O maneja este caso como prefieras
            }
            let fieldDefinition = `${field.name}: { type: ${this._mapToMongooseType(fieldType)}, `;

            // Añadir atributos opcionales basándose en la presencia de propiedades específicas
            if (field.required) {
                fieldDefinition += 'required: true, ';
            } else {
                if (fieldType == 'number') {
                    fieldDefinition += 'default: null, ';
                }
                if (fieldType == 'string') {
                    fieldDefinition += 'default: "", ';
                }
                if (fieldType == 'date') {
                    fieldDefinition += 'default: null, ';
                }
                if (fieldType == 'array') {
                    fieldDefinition += 'default: [], ';
                }
                if (fieldType == 'object') {
                    fieldDefinition += 'default: {}, ';
                }
                if (fieldType == 'boolean') {
                    fieldDefinition += 'default: false, ';
                }
            }


            if (field.min !== undefined) {
                if (field.type === 'string') {
                    fieldDefinition += `minlength: ${field.min}, `;
                }
                if (field.type === 'number') {
                    fieldDefinition += `min: ${field.min}, `;
                }
            }

            if (field.enum) {
                const enumValues = field.enum.map(value => `'${value}'`).join(', ');
                fieldDefinition += `enum: [${enumValues}], `;
            }

            if (field.default !== undefined) {
                const defaultValue = typeof field.default === 'string' ? `'${field.default}'` : field.default;
                fieldDefinition += `default: ${defaultValue}, `;
            }

            fieldDefinition = fieldDefinition.slice(0, -2);
            fieldDefinition += ' },';
            return fieldDefinition;
        }).join('\n  ');
    }

    private _generarValidationConstsDinamico(fields: Field[]) {
        return fields.map(field => {
            let str = "";
            if (field.type === "string") {
                str += `const ${field.name} = z.string()`;
                if (field.min) {
                    str += `.min(${field.min})`;
                }
                if (field.required === false) {
                    str += '.optional()';
                }
                str += ';';
            }
            if (field.type === "email") {
                str += `const ${field.name} = z.string().email()`;
                if (field.min) {
                    str += `.min(${field.min})`;
                }
                if (field.required === false) {
                    str += '.optional()';
                }
                str += ';';
            }
            if (field.type === "boolean") {
                str += `const ${field.name} = z.boolean()`;
                if (field.required === false) {
                    str += '.optional()';
                }
                if (field.mustBeTrue) {
                    str += '.refine(value => value === true, {message: \'Must be true\'})';
                }
                str += ';';
            }
            if (field.type === "array") {
                str += `const ${field.name} = z.array(z.any())`;
                if (field.required === false) {
                    str += '.optional()';
                }
                str += ';';
            }
            if (field.type === "object") {
                str += `const ${field.name} = z.object({})`;
                if (field.required === false) {
                    str += '.optional()';
                }
                str += ';';
            }
            if (field.type === "date") {
                str += `const ${field.name} = z.date()`;
                if (field.required === false) {
                    str += '.optional()';
                }
                str += ';';
            }
            if (field.type === 'number') {
                str += `const ${field.name} = z.string()`;
                let pipe = 'z.coerce.number()';

                if (typeof field.min === 'number' && field.min === 0) {

                    pipe += `.positive()`;
                }
                str += `.pipe(${pipe})`;
                if (field.required === false) {
                    str += '.optional()';
                }
                str += ';';

            }
            return str;
        }).join('\n');

    }
    private _generarTiposDinamicos(fields: Field[]) {
        return fields.map(field => {
            if (field.type === 'date') {
                return `${field.name}: ${Str.capitalizeFirstLetter(field.type)};`;
            }
            return `${field.name}: ${field.type};`;
        }).join('\n    ');
    }
    private _generarValidationObjectDinamico(fields: Field[]) {
        return fields.map(field => {
            const o = `${field.name},`;
            return o;
        }).join('\n    ');
    }
    private _setPaths(): void {
        // const targetDir = resolve(__dirname, this.__targeDir);

        this.routesPath = routesPath;
        this.dirResources = dirResources;
        this.dirJsons = dirJsons;
        this.resourceTemplatesPath = resourceTemplatesPath;
    }
    private _setResourcePath(): void {
        const resource = this.json.name;
        const deep = this.json.deep;
        if (deep) {
            const deepPath = deep.split(" ").map(d => Str.toCamelCaseCapitalized(d)).join("/");

            this.resourcePath = join(this.dirResources, deepPath, Str.toCamelCaseCapitalized(resource));
            return;
        }
        this.resourcePath = join(this.dirResources, Str.toCamelCaseCapitalized(resource));
        return;
    }

    private _setBase(): void {
        if (!this.resourcePath.includes(this.__dirBaseresources)) {
            throw new Error('bad dirBaseresources');
        }
        let segmentos = this.resourcePath.split(this.__dirBaseresources);
        segmentos = segmentos.filter(elemento => elemento !== '');

        if (segmentos.length < 2) {
            console.error('El formato del resourcePath no contiene suficientes segmentos después de dirBaseresources');
            return; // Salir de la función para evitar otros errores
        }

    }

    private _mkDirIfNotExist(): void {
        if (fs.existsSync(this.resourcePath)) {
            throw new Error('El recurso ya existe');
        }
        try {
            fs.mkdirSync(this.resourcePath, { recursive: true });
        } catch (error) {
            throw new Error('se ha producido un error al crear el directorio del recurso');
        }

    }
    private _setDefRoutes(): void {
        const resource = this.json.name;
        if (!resource || resource.length === 0) {
            console.error('Resource name is undefined or empty.');
            return;
        }

        const deep = this.json.deep;
        if (!deep) {
            const resourcePath = Str.toKebabCase(Str.toCamelCase(resource));
            const resourceModulePath = `${resource[0].toUpperCase()}${Str.toCamelCase(resource).slice(1)}`;

            this.oDefRoutes = {
                path: `/api/${resourcePath}`,
                module: `./app/Resources/${resourceModulePath}/${resourceModulePath}Routes`
            };
            return;
        }

        //const deepArray = deep.split(" ");
        const deepArray = deep.split(" ").filter(item => item.trim() !== "");

        const resourcePath = Str.toKebabCase(Str.toCamelCase(resource));
        const deepCamel = deepArray.map(s => Str.toCamelCase(s));
        const deepKebab = deepCamel.map(ss => Str.toKebabCase(ss));

        const apiPath = `/api/${deepKebab.join("/")}/${resourcePath}`;
        const modulePathParts = deepCamel.map(part => `${part[0].toUpperCase()}${part.slice(1)}`);
        const resourceModulePath = `${resource[0].toUpperCase()}${Str.toCamelCase(resource).slice(1)}`;
        const modulePath = `./app/Resources/${modulePathParts.join("/")}/${resourceModulePath}/${resourceModulePath}Routes`;

        this.oDefRoutes = {
            path: apiPath,
            module: modulePath
        };
        return;
    }
    private _addObjectDefRoutesToFileRoutes() {
        let routes = [];
        try {
            const currentRoutes = fs.readFileSync(this.routesPath, 'utf8');
            routes = JSON.parse(currentRoutes);
        } catch (error) {
            console.error('Archivo de rutas no encontrado o vacío, creando uno nuevo.');
        }

        // Verificar si el objeto de ruta ya existe en el array
        const routeExists = routes.find((route: Route) => route.path === this.oDefRoutes.path);

        if (!routeExists) {
            // Añadir el nuevo objeto de ruta al array y guardar el archivo actualizado si no existe.
            routes.push(this.oDefRoutes);

            fs.writeFileSync(this.routesPath, JSON.stringify(routes, null, 4));

            console.info(`Rutas añadidas al archivo: 'src/app/routes.json'`);
        }
    }
    private analyzeRoutes(filePath: string): RouteInfo[] {
        const program = ts.createProgram([filePath], { allowJs: true });
        const sourceFile = program.getSourceFile(filePath);
        const routes: RouteInfo[] = [];

        if (!sourceFile) return routes;

        function visit(node: ts.Node) {
            // Ahora buscamos PropertyAccessExpression específicamente en el objeto 'router'
            if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
                const callExpr = node.expression;
                if (ts.isIdentifier(callExpr.expression) && callExpr.expression.text === 'router') {
                    const method = callExpr.name.text;
                    const firstArg = node.arguments[0];
                    if (ts.isStringLiteral(firstArg)) { // Asegúrate de que el primer argumento es un literal string, que sería la ruta
                        routes.push({
                            method: method,
                            path: firstArg.text
                        });
                        // console.log(`Found route: ${method} ${firstArg.text}`);
                    }
                }
            }

            ts.forEachChild(node, visit);
        }

        ts.forEachChild(sourceFile, visit);

        return routes;
    }

    private _getApiPath(): string {
        const resource = this.json.name;
        const deep = this.json.deep;
        if (deep) {
            const deepPath = deep.trim().split(/\s+/).map(d => Str.toKebabCase(d)).join("/");
            return join(deepPath, Str.toKebabCase(resource));
        }
        return join(Str.toKebabCase(resource));
    }
}
