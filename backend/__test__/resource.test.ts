import fs from 'fs';
import path from 'path';
import { Str } from '../src/base/Helpers/Str'
import { Resource } from '../artesano/commanders/Resource/Resource'

const pathTemplates = path.join(__dirname, '../artesano', 'commanders', 'Resource', 'templates');
const randomNames = ['exploration', 'mystery', 'discovery'];
const randomDeeps = ['arbol', 'cielo'];
const fileJsonName = "test" //sin la extension json aqui
const strRandom = (array: string[], join: string, ceroable: boolean = false): { str: string; n: number } => {
    const length = array.length
    let n;
    if (ceroable) {
        n = Math.floor(Math.random() * (length + 1)); // Permite n = 0
    } else {
        n = Math.floor(Math.random() * length) + 1;  // n es siempre >= 1
    }
    return {
        str: array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            .slice(0, n)
            .join(join),
        n: n
    }
};

const { str: name } = strRandom(randomNames, "-")
const { str: deep, n } = strRandom(randomDeeps, " ", true)
let base = "../../../base"
let p: string = ''
let pathApi: string = ''
if (n !== 0) {
    const additionalPaths = "../".repeat(n);
    base = additionalPaths + base;
    const aDeep = Str.toArray(" ", deep);
    const camelCaseJoined = aDeep.map(item => Str.toCamelCaseCapitalized(item)).join('/');
    const kebabCaseJoined = aDeep.map(item => Str.toKebabCase(item)).join('/');
    p = `app/Resources/${camelCaseJoined}/${Str.toCamelCaseCapitalized(name)}/${Str.toCamelCaseCapitalized(name)}`
    pathApi = `/api/${kebabCaseJoined}/${name}`;
} else {
    p = `app/Resources/${Str.toCamelCaseCapitalized(name)}/${Str.toCamelCaseCapitalized(name)}`
    pathApi = `/api/${name}`;


}

const pathModule = `./${p}Routes.js`;
const pathController = `${p}Controller.ts`
const pathService = `${p}Service.ts`
const pathRepository = `${p}Repository.ts`


const json = {
    "name": name,
    "deep": deep,
    "fields": [
        {
            "name": "name",
            "required": true,
            "type": "string",
            "min": 1
        },
        {
            "name": "age",
            "required": true,
            "type": "number",
            "min": 0
        },
        {
            "name": "sex",
            "required": false,
            "type": "string",
            "enum": [
                "M",
                "F"
            ],
            "default": "F"
        }
    ],
    "routesMiddlewares": {
        "index": {
            "base": [

            ]
        },
        "show": {
            "base": [

            ]
        },
        "store": {
            "base": [


                "validate"
            ]
        },
        "update": {
            "base": [

                "validate"
            ]
        },
        "delete": {
            "base": [

            ]
        },
        "softDelete": {
            "base": [
            ]
        }
    }
}
// Mockea un archivo json que contiene la definición de un resource
const jsonSimulado = JSON.stringify(json);


jest.mock('fs', () => ({
    readFileSync: jest.fn().mockImplementation((filePath, encoding) => {
        const expectedPathCurso = path.join(__dirname, '../src', 'app', 'jsons', 'test.json');
        const expectedPathRoutes = path.join(__dirname, '../src', 'base', 'routes.json');
        const expectedPathTControllerHbs = `${pathTemplates}/TController.hbs`;
        const expectedPathTServiceHbs = `${pathTemplates}/TService.hbs`;
        const expectedPathTRepositoryHbs = `${pathTemplates}/TRepository.hbs`;
        // const expectedTController = TController;

        if (filePath === expectedPathCurso) {
            return jsonSimulado;
        }
        else if (filePath === expectedPathRoutes) {
            return JSON.stringify([]);
        }
        else if (filePath === expectedPathTControllerHbs) {
            return '{{base}} {{upperResource}} {{lowerResource}}';
        }
        else if (filePath === expectedPathTServiceHbs) {
            return '{{base}} {{upperResource}}';
        }
        else if (filePath === expectedPathTRepositoryHbs) {
            return '{{base}} {{upperResource}}';
        }
        throw new Error('Archivo no encontrado');
    }),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn()
}));

describe('Resource class', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia todos los mocks
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { });
    });
    it('debería leer la estructura JSON correctamente y crear archivos de recurso', () => {
        const resourceName = fileJsonName;
        const resource = new Resource(resourceName);
        resource.handle();

        expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });


        const expectedPath = path.join(__dirname, '../src', 'base', 'routes.json');
        const expectedContent = JSON.stringify([
            {
                "path": pathApi,
                "module": pathModule
            }
        ], null, 4);

        const expectedPathController = path.join(__dirname, '../src', pathController);
        const expectedPathService = path.join(__dirname, '../src', pathService);
        const expectedPathRepository = path.join(__dirname, '../src', pathRepository);

        // const expectedContentController = JSON.stringify({ setting1: "value1", setting2: "value2" });
        const expectedContentController = base + " " + Str.toCamelCaseCapitalized(name) + " " + Str.toCamelCase(name);
        const expectedContentService = base + " " + Str.toCamelCaseCapitalized(name);
        const expectedContentRepository = base + " " + Str.toCamelCaseCapitalized(name);


        expect(fs.writeFileSync).toHaveBeenCalledTimes(4);
        expect(fs.writeFileSync).toHaveBeenNthCalledWith(1, expectedPath, expectedContent);
        expect(fs.writeFileSync).toHaveBeenNthCalledWith(2, expectedPathController, expectedContentController);
        expect(fs.writeFileSync).toHaveBeenNthCalledWith(3, expectedPathService, expectedContentService);
        expect(fs.writeFileSync).toHaveBeenNthCalledWith(4, expectedPathRepository, expectedContentRepository);

    });
});
