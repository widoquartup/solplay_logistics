import { BaseCommand } from './BaseCommand';
// import { input, confirm } from '@inquirer/prompts';
import { Resource } from './Resource/Resource';
// import checkbox, { Separator } from '@inquirer/checkbox';
import clc from 'cli-color';


import { select } from '@inquirer/prompts';

import fs from 'fs';
import { dirJsons } from '@src/paths';

export class JsonCommand extends BaseCommand {
    constructor() {
        super('json', 'Crea una nueva definicion json de recurso');
    }

    configureCommand(): void {
        this.action(async () => {

            const name = await this.promptInput("Nombre del archivo (sin extensión)");
            const deep = await this.promptInput("Ruta relativa al servicio (mínusculas; separación por espacio)?");
            /* eslint-disable-next-line */
            const fields: any[] = [];
            let addAnotherField = true;

            const mongoTypes = [
                { name: 'String', value: 'string' },
                { name: 'Email', value: 'email' },
                { name: 'Number', value: 'number' },
                { name: 'Boolean', value: 'boolean' },
                { name: 'Object', value: 'object' },
                { name: 'Array', value: 'array' },
                { name: 'Date', value: 'date' },
            ];

            const campos = await this.promptConfirm("¿Creamos campos?");
            if (campos) {
                while (addAnotherField) {
                    const fieldName = await this.promptInput("Nombre del campo:");
                    // const fieldType = await this.promptInput("Tipo de campo (string, number, boolean, object, array):");

                    const fieldType = await select({
                        message: "Seleccione el tipo de campo:",
                        choices: mongoTypes.map(option => ({
                            name: `${option.name} - ${option.value}`,
                            value: option.value
                        }))
                    });

                    const isRequired = await this.promptConfirm("¿Es requerido este campo?");
                    interface ObF {
                        name: string
                        required: boolean,
                        type: string,
                        mustBeTrue?: boolean
                    }
                    const obF: ObF = {
                        name: fieldName,
                        required: isRequired,
                        type: fieldType,
                    };
                    if (fieldType == 'boolean') {
                        // if (isRequired == false) {


                        //     const answer = await checkbox({
                        //         message: 'Select a package manager',
                        //         choices: [
                        //             { name: 'npm', value: 'npm' },
                        //             { name: 'yarn', value: 'yarn' },
                        //             new Separator(),
                        //             { name: 'pnpm', value: 'pnpm', disabled: true },
                        //             {
                        //                 name: 'pnpm',
                        //                 value: 'pnpm',
                        //                 disabled: '(pnpm is not available)',
                        //             },
                        //         ],
                        //     });
                        //     console.log(answer);
                        // }
                        if (isRequired == true) {
                            let mustBeTrue = false;

                            mustBeTrue = await this.promptConfirm("¿Debe ser true este campo?");
                            obF.mustBeTrue = mustBeTrue;

                        }
                    }

                    fields.push(obF);

                    addAnotherField = await this.promptConfirm("¿Desea añadir otro campo?");
                }
            }
            const confirm = await this.promptConfirm("¿Crear el archivo?");

            if (confirm) {
                console.log("Continuando con la acción...");
                const file: string = `${dirJsons}/${name}.json`;
                const routesMiddlewares = JSON.parse(`{
                    "index": {
                        "base": [
                            "auth"
                        ]
                    },
                    "show": {
                        "base": [
                            "auth"
                        ]
                    },
                    "store": {
                        "base": [
                            "auth",
                            "validate"
                        ]
                    },
                    "update": {
                        "base": [
                            "auth",
                            "validate"
                        ]
                    },
                    "delete": {
                        "base": [
                            "auth"
                        ]
                    },
                    "softDelete": {
                        "base": [
                            "auth"
                        ]
                    }
                }`);
                fs.writeFileSync(file, JSON.stringify({
                    name: name,
                    deep: deep,
                    fields: fields,
                    routesMiddlewares: routesMiddlewares
                }, null, 4));
                // ------------
                const confirm = await this.promptConfirm("¿Crear el recurso?");
                if (confirm) {
                    console.info(clc.green("Se crearán los archivos del recurso ..."));
                    const recurso = new Resource(name);
                    recurso.handle();
                    console.info(clc.green("Recurso creado."));
                }
                // -------------
            } else {
                console.log("Acción cancelada.");
            }
        });
    }
}
