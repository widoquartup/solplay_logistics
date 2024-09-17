import { Request, Response, NextFunction } from 'express';
import { context } from '../context';


function transactionStore() {
    return function (req: Request, res: Response, next: NextFunction) {
        const transaction = res.locals.transaction;
        // console.log('transaction:', transaction);
        if (transaction.hasErrors) {
            // context.logger.error(transaction);
            // console.log('errors:', transaction.response);
        } else {
            // context.logger.info(transaction);
        }
        next();
    };
}

export default transactionStore;
