// routes for Input resource
// import express, { RequestHandler } from 'express';
import express, { Request, Response, NextFunction, RequestHandler } from 'express';

import multerSingleFileMiddleware from '@base/Middlewares/multer/multerSingleFileMiddelware';
import StorageService from '../../services/Storage/StorageService';
import BadRequestException from '@base/Exceptions/BadRequestException';
import auth from '@base/Middlewares/auth';

const router = express.Router();


// middlewares store
const storeMiddlewares: RequestHandler[] = [auth, multerSingleFileMiddleware];


router.post('/', storeMiddlewares, async (req: Request, res: Response, next: NextFunction) => {
    // console.log('como ?', req.body);
    if (req.file) {
        const store = new StorageService();
        const resfile = await store.storeFile(req.file);
        res.locals.response = resfile;
        next();
        return;
    }
    next(new BadRequestException({ file: 'not file in request' }));
    // next(new Error('roto'));
});



// Exportar el router
export default router;