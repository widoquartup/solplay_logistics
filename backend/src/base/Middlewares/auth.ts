import { Request, Response, NextFunction } from 'express';
import { context } from '@src/base/context';
import UnauthorizedException from '@base/Exceptions/UnauthorizedException';

export default async function (req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization;
  if (typeof token === 'undefined') {
    return next(new UnauthorizedException('Unauthorized; no bearer token provided'));
  }
  const bearer = token.split(" ");
  token = bearer[1].trim();
  // console.log(token);
  try {
    const user = await context.token.detokenize(token);
    req.body.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException('Unauthorized; bearer token is invalid or has expired'));
  }
}
