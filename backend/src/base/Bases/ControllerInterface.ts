import { Request, Response, NextFunction } from 'express';

export interface ControllerInterface {
    index(req: Request, res: Response, next: NextFunction): Promise<void>;
}