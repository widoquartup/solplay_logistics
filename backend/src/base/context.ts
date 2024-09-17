// context.ts
import container from './container';
import { EmailInterface } from '../services/Email/Interfaces/EmailInterface';
import { LoggerInterface } from '../services/Logger/Interfaces/LoggerInterface';
import Tokenizer from '@src/services/Tokenizer/Tokenizer';
import GatewayService from '@src/services/SolplayMessages/GatewayService';


/**
 * Son las actions que guardamos en la transacción
 */

interface Action {
    action: string;
    entity: string;
    item: object | null;
}

export class ApplicationContext {
    private _actions: Action[] = []; // Usar _actions como propiedad privada para almacenar las acciones


    get actions(): Action[] {
        return this._actions;
    }

    set actions(value: Action[]) {
        this._actions = value;
    }
    get email() {
        return container.resolve<EmailInterface>('emailService');
    }
    get logger() {
        return container.resolve<LoggerInterface>('loggerService'); // Asumiendo que tienes una clase WinstonLogger definida
    }
    get token() {
        return container.resolve<Tokenizer>('tokenizerService'); // Asumiendo que tienes una clase WinstonLogger definida
    }
    get message() {
        return container.resolve<GatewayService>('messageService'); // Para gestionar los mensajes al carro 
    }
}

// Crea una instancia global del contexto
export const context = new ApplicationContext();
