// import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import fs from 'fs';


import { privatePemPath, publicPemPath } from '@src/paths';

import type { TokenType } from './types/TokenType';
import type { DecodedTokenType } from './types/DecodedTokenType';

class Tokenizer {
    private privateKey: string = "";
    private publicKey: string = "";

    constructor() {
        try {
            if (!privatePemPath || !publicPemPath) {
                throw new Error("Paths to PEM files are not defined");
            }
            const prikey = fs.readFileSync(privatePemPath, 'utf8');
            if (!prikey) {
                throw new Error("Private key file is null or empty");
            }
            const pukey = fs.readFileSync(publicPemPath, 'utf8');
            if (!pukey) {
                throw new Error("Public key file is null or empty");
            }
            this.privateKey = prikey.toString()!;
            this.publicKey = pukey.toString();
        } catch (error) {
            // console.log("NO HAY PRIVATE KEY", error);
        }
    }

    async tokenize(data: TokenType, expiresIn: string | number): Promise<string> {

        try {
            const token = jwt.sign({ data }, this.privateKey, {
                expiresIn,
                algorithm: 'RS256'
            });
            return token ?? ''; // Siempre debe retornarse una cadena
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error creating token: ${error.message}`);
            } else {
                throw new Error('Se produjo un error al crear el token');
            }
        }
    }

    async detokenize(token: string): Promise<TokenType> {
        try {
            const decoded = jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }) as DecodedTokenType;
            if (decoded.expiresIn !== undefined) {
                const nowInSeconds = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
                if (nowInSeconds > decoded.expiresIn.getTime() / 1000) {
                    throw new Error('El token ha expirado');
                }
            }
            return decoded.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error on decoding token: ${error.message}`);
            } else {
                throw new Error('Se produjo un error al decodificar el token');
            }
        }
    }
}

export default Tokenizer;
