
// container.ts
import { createContainer, asClass, AwilixContainer } from 'awilix';

import { EmailInterface } from '../services/Email/Interfaces/EmailInterface';
import { LoggerInterface } from '../services/Logger/Interfaces/LoggerInterface';
import MailgunEmail from '../services/Email/Services/MailgunEmail';
import LogEmail from '../services/Email/Services/LogEmail';
import WinstonLogger from '../services/Logger/Services/WinstonLogger';
// import BunyanLogger from '@src/services/Logger/Services/BunyanLogger';
import Tokenizer from '@src/services/Tokenizer/Tokenizer';

import config from "@src/app/config";
import GatewayService from '@src/services/SolplayMessages/GatewayService';

// Definir una interfaz para los servicios del contenedor
interface ContainerServices {
    emailService: EmailInterface;
    loggerService: LoggerInterface;
    tokenizerService: Tokenizer;
    messageService: GatewayService;
}

// Crear el contenedor y registrar los servicios con sus tipos respectivos
const container: AwilixContainer<ContainerServices> = createContainer();

if (config.emailService === 'Mailgun') {
    container.register({
        emailService: asClass(MailgunEmail).singleton(),
    });
} else if (config.emailService === 'Log') {
    container.register({
        emailService: asClass(LogEmail).singleton(),
    });
} else {
    throw new Error('Invalid email service specified in config');
}

container.register({
    loggerService: asClass(WinstonLogger).singleton(),
    tokenizerService: asClass(Tokenizer).singleton(),
    messageService: asClass(GatewayService).singleton()
});

export default container;
