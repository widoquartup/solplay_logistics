import { Request, Response, NextFunction } from 'express';
import multer, { StorageEngine } from 'multer';

// Almacenamiento del archivo en buffer 
const storage: StorageEngine = multer.memoryStorage();

const upload = multer({ storage });

const multerSingleFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err) => {
        //eslint-disable-next-line
        // if (true) {
        //     return next(new Error('po'));

        // }
        if (err) {
            return next(err);
        }
        next();
    });
};

export default multerSingleFileMiddleware;
