// middlewares/i18nMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import i18next from '@src/i18n'; // Importa tu configuración de i18next
import i18nextMiddleware from 'i18next-http-middleware';

const i18nMiddleware = (req: Request, res: Response, next: NextFunction) => {
    i18nextMiddleware.handle(i18next)(req, res, next);
};

export default i18nMiddleware;
