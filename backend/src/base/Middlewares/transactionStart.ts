import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';



interface Transaction {
    service: string | undefined;
    method: string;
    url: string;
    timestamp: Date;
    host: string | undefined;
    origin: string | undefined;
    referer: string | undefined;
    user_agent: string | undefined;
    ip: string | undefined;
    ips: string[];
    user_id: string | null;
    user_name: string | null;
    actions: object[]; // Se podría especificar una interfaz detallada para las acciones
    payload: {
        body: object;
        query: object;
        params: object;
    };
    request_id: string;
    response: object | null;
    hasErrors: boolean;
}

function transactionStart(service: string | undefined) {
    return function (req: Request, res: Response, next: NextFunction) {
        const transaction: Transaction = {
            service: service,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date(),
            host: req.headers.host,
            origin: req.headers.origin,
            referer: req.headers.referer,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            ips: req.ips,
            user_id: null,
            user_name: null,
            actions: [],
            payload: {
                body: JSON.parse(JSON.stringify(req.body)),
                query: req.query,
                params: []
                // se añade en el repositorio en métodos update y delete
            },
            request_id: uuidv4(),
            response: null,
            hasErrors: false
        };
        res.locals.transaction = transaction;
        next();
    };
}

export default transactionStart;
