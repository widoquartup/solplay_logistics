import { Request, Response, NextFunction } from 'express';
import BadRequestException from '@base/Exceptions/BadRequestException';
import { RequestHandler } from 'express';
import SocketHandler from '@base/Utils/SocketHandler';


// Middleware para emitir mensajes WebSocket
const emitWebSocketMessage: RequestHandler = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log("MIDDLEWARE: ", req, res );
            // const originalJson = res.json;
            // res.json = function(body) {
            //     originalJson.call(this, body);
            //     const event = req.method === 'POST' ? 'almacenCreated' : 'almacenUpdated';
            //     SocketHandler.emitMessage(event, body);
            //     return this;
            // };
            next();
        } catch (error) {
            if (error) {
                next(new BadRequestException(error));
            }
            next(error);
        }
    };
};
export default emitWebSocketMessage;