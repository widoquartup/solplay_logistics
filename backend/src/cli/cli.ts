// src/cli/commands/cli.ts
import { Command } from 'commander';
import { select } from '@inquirer/prompts';
import { ResourceCommand } from './ResourceCommand';
import { JsonCommand } from './JsonCommand';
import { FakeCommand } from './FakeCommand';

async function chooseCommand() {
    const commands = [
        { title: 'Crear un nuevo resource desde un json existente', value: 'resource' },
        { title: 'Crear una nueva definicion json de recurso', value: 'json' },
        { title: 'Crear data fake', value: 'fake' },
    ];

    const answer = await select({
        message: '¿Qué quieres hacer?',
        choices: commands
    });

    return answer;
}

async function run() {
    const program = new Command();
    program.version('1.0.0');

    const resourceCommand = new ResourceCommand();
    const jsonCommand = new JsonCommand();
    const fakeCommand = new FakeCommand();

    program.addCommand(resourceCommand);
    program.addCommand(jsonCommand);
    program.addCommand(fakeCommand);

    const selectedCommand = await chooseCommand();
    // Asegúrate de que solo se estén pasando los argumentos necesarios
    const simulatedArgs = [process.argv[0], 'cli', selectedCommand];
    program.parse(simulatedArgs);
}

run().catch(error => {
    console.error('CLI error:', error);
    process.exit(1);
});
