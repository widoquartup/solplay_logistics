import { Request, Response, NextFunction } from 'express';

import { context } from "../context";
function transactionEnd() {
    return function (req: Request, res: Response, next: NextFunction) {
        const transaction = res.locals.transaction;
        let response;
        if (res.locals.response) {
            // console.log('entramos aquie en success response');

            response = res.locals.response;
        }
        if (res.locals.errors && res.locals.errorCode) {
            // console.log('entramos aquie en errores');
            response = {
                code: res.locals.errorCode,
                errors: res.locals.errors
            };
            transaction.hasErrors = true;
        }
        transaction.response = response;
        transaction.payload.params = res.locals.params;
        transaction.actions = context.actions;
        res.locals.transaction = transaction;
        // console.log('res->', res.locals.response);
        next();
    };
}

export default transactionEnd;
