// src/commands/cli/ResourceCommand.ts
import { BaseCommand } from './BaseCommand';
import { Resource } from './Resource/Resource';
import clc from 'cli-color';

export class ResourceCommand extends BaseCommand {
    constructor() {
        super('resource', 'Crea los archivos necesarios para un nuevo recurso');
    }

    configureCommand(): void {
        this.action(async () => {
            const name = await this.promptInput("Introduce el nombre del archivo json de definición");
            const confirm = await this.promptConfirm("¿Crear recurso?");
            if (confirm) {
                console.info(clc.green("Se crearán los archivos del recurso ..."));
                const recurso = new Resource(name);
                const res = recurso.handle();
                if(res){
                    console.info(clc.green("Recurso creado."));
                }
            } else {
                console.info(clc.blue("Acción cancelada."));
            }
        });
    }
}
