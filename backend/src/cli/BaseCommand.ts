// src/cli/commands/BaseCommand.ts
import { Command } from 'commander';
import { input, confirm } from '@inquirer/prompts';

export abstract class BaseCommand extends Command {
    constructor(commandName: string, description: string) {
        super(commandName);
        this.description(description);
        // this.initializeOptions();
        this.configureCommand();
    }

    // abstract initializeOptions(): void;
    abstract configureCommand(): void;

    async promptInput(message: string): Promise<string> {
        return input({ message });
    }

    async promptConfirm(message: string): Promise<boolean> {
        return confirm({ message });
    }
}
