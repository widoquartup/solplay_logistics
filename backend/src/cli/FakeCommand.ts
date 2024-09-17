// src/commands/cli/ResourceCommand.ts
import { BaseCommand } from './BaseCommand';
import { fakeUser } from '@src/seeds/fakeUser';
import clc from 'cli-color';
import checkbox from '@inquirer/checkbox';

export class FakeCommand extends BaseCommand {
    constructor() {
        super('fake', 'Introduce datos de desarrollo en base de datos');
    }

    configureCommand(): void {
        this.action(async () => {

            const answer = await checkbox({
                message: 'Selecciona un recurso',
                choices: [
                    { name: 'user', value: 'fakeUser' },
                    // { name: 'yarn', value: 'yarn' },
                    // { name: 'pnpm', value: 'pnpm', disabled: '(pnpm is not available)' },
                ],
                instructions: false,

                // Configuración para permitir solo una selección
                validate: (answer) => {
                    if (answer.length !== 1) {
                        return 'Por favor, selecciona exactamente un recurso.';
                    }
                    return true;
                },
            });

            const selectedResource = answer[0];
            // console.log(selectedResource);
            // }
            const confirm = await this.promptConfirm("¿Crear los datos?");
            if (confirm) {
                if (selectedResource == 'fakeUser') {
                    await fakeUser();
                }
                console.info(clc.green("Se están creando datos ..."));
                // const recurso = new Resource(name);
                const res = true;
                if (res) {
                    console.info(clc.green("Datos creados."));
                }
            } else {
                console.info(clc.blue("Acción cancelada."));
            }
        });
    }
}
